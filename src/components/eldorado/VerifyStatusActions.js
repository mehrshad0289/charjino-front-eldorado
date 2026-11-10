"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitKycLevel2 } from "@/actions/market.actions";
import { onlyDigits } from "@/lib/fa-digits";
import { iranianNationalIdError } from "@/lib/national-id";
import { VERIFY_KYC } from "./data/verifyData";

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPT = "image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp";
const inputClass =
  "block h-[42px] w-full rounded-lg border-2 border-[rgb(239,239,241)] bg-[rgb(239,239,241)] px-3 text-[14px] text-ink outline-none";

function ArrowRightIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 12h15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="m13 6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FileField({ id, label, file, onFile, already }) {
  return (
    <div className="flex w-full flex-col items-start gap-1">
      <span className="text-[14px] font-bold leading-[21px]">{label}</span>
      {already ? (
        <p className="text-[14px] text-graytext">ثبت شده</p>
      ) : (
        <label
          htmlFor={id}
          className="inline-flex min-h-[42px] w-full cursor-pointer items-center justify-between gap-3 rounded-lg bg-[rgb(34,33,39)] px-4 text-[14px] font-bold text-white"
        >
          <span className="truncate">{file?.name || VERIFY_KYC.pickFile}</span>
          <input
            id={id}
            name={id}
            type="file"
            accept={ACCEPT}
            className="sr-only"
            onChange={(event) => {
              const next = event.target.files?.[0] ?? null;
              onFile(next);
            }}
          />
        </label>
      )}
    </div>
  );
}

export default function VerifyStatusActions({ phase, cta, uploadedKinds = [] }) {
  const router = useRouter();
  const docsOnly = phase === "docs";
  const [fullName, setFullName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [nationalCard, setNationalCard] = useState(null);
  const [selfie, setSelfie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const hasCard = uploadedKinds.includes("national_card");
  const hasSelfie = uploadedKinds.includes("selfie");

  async function onSubmit(event) {
    event.preventDefault();
    if (!docsOnly && fullName.trim().length < 3) {
      setError("نام را کامل بنویس.");
      return;
    }
    if (!docsOnly) {
      const nationalIdError = iranianNationalIdError(nationalId);
      if (nationalIdError) {
        setError(nationalIdError);
        return;
      }
    }
    const card = hasCard ? null : nationalCard;
    const face = hasSelfie ? null : selfie;
    if (!hasCard && !card) {
      setError("تصویر کارت ملی لازم است.");
      return;
    }
    if (!hasSelfie && !face) {
      setError("سلفی با کارت ملی لازم است.");
      return;
    }
    if ((card && card.size > MAX_BYTES) || (face && face.size > MAX_BYTES)) {
      setError("حجم هر تصویر حداکثر ۵ مگابایت است.");
      return;
    }

    const payload = new FormData();
    if (docsOnly) payload.set("docs_only", "1");
    payload.set("full_name", fullName.trim());
    payload.set("national_id", nationalId);
    if (card) payload.set("national_card", card);
    if (face) payload.set("selfie", face);

    setLoading(true);
    setError("");
    const result = await submitKycLevel2(payload);
    setLoading(false);
    if (result.unauthorized) {
      router.push("/login?next=/verify/status");
      return;
    }
    if (!result.ok) {
      setError(result.message || "ارسال انجام نشد.");
      return;
    }
    router.refresh();
  }

  return (
    <form className="flex w-full flex-col items-start gap-4 self-stretch" onSubmit={onSubmit}>
      {docsOnly ? null : (
        <>
          <label className="flex w-full flex-col gap-1 text-[14px] font-bold leading-[21px]" htmlFor="kyc-full-name">
            {VERIFY_KYC.fullName}
            <input
              id="kyc-full-name"
              name="full_name"
              type="text"
              autoComplete="name"
              value={fullName}
              onChange={(event) => {
                setFullName(event.target.value);
                setError("");
              }}
              className={inputClass}
            />
          </label>
          <label className="flex w-full flex-col gap-1 text-[14px] font-bold leading-[21px]" htmlFor="kyc-national-id">
            {VERIFY_KYC.nationalId}
            <input
              id="kyc-national-id"
              name="national_id"
              type="text"
              inputMode="numeric"
              dir="ltr"
              maxLength={10}
              value={nationalId}
              onChange={(event) => {
                const next = onlyDigits(event.target.value).slice(0, 10);
                setNationalId(next);
                setError(next.length === 10 ? iranianNationalIdError(next) || "" : "");
              }}
              className={`${inputClass} text-start`}
            />
          </label>
        </>
      )}
      <FileField
        id="national_card"
        label={VERIFY_KYC.nationalCard}
        file={nationalCard}
        already={hasCard}
        onFile={(file) => {
          setNationalCard(file);
          setError("");
        }}
      />
      <FileField
        id="selfie"
        label={VERIFY_KYC.selfie}
        file={selfie}
        already={hasSelfie}
        onFile={(file) => {
          setSelfie(file);
          setError("");
        }}
      />
      <p className="text-[14px] leading-[21px] text-graytext">{VERIFY_KYC.fileHint}</p>
      {error ? <p className="text-[14px] text-[rgb(232,27,22)]">{error}</p> : null}
      <button
        type="submit"
        aria-label={cta}
        disabled={loading}
        className="inline-block min-h-[42px] min-w-[70px] overflow-hidden rounded-lg bg-[rgb(34,_33,_39)] px-4 pb-[10px] pt-[10px] text-center text-[14px] font-bold leading-[21px] text-white disabled:opacity-60"
      >
        <span className="flex items-center justify-center gap-[6px] text-center">
          <span className="block text-center">{loading ? "…" : cta}</span>
          <ArrowRightIcon />
        </span>
      </button>
    </form>
  );
}
