"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveSellerBank } from "@/actions/market.actions";
import { toEnDigits } from "@/lib/fa-digits";
import { iranianShebaError, SHEBA_HOLDER } from "@/lib/sheba";
import { VERIFY_KYC } from "./data/verifyData";

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

export default function VerifyShebaForm({ cta, shebaMasked = "", holderName = "" }) {
  const router = useRouter();
  const [name, setName] = useState(holderName);
  const [sheba, setSheba] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event) {
    event.preventDefault();
    if (name.trim().length < 3) {
      setError(SHEBA_HOLDER);
      return;
    }
    const shebaError = iranianShebaError(sheba);
    if (shebaError) {
      setError(shebaError);
      return;
    }

    const payload = new FormData();
    payload.set("holder_name", name.trim());
    payload.set("sheba", sheba);

    setLoading(true);
    setError("");
    const result = await saveSellerBank(payload);
    setLoading(false);
    if (result.unauthorized) {
      router.push("/login?next=/verify/status");
      return;
    }
    if (!result.ok) {
      setError(result.message || "ثبت شبا انجام نشد.");
      return;
    }
    setSheba("");
    router.refresh();
  }

  return (
    <form className="flex w-full flex-col items-start gap-4 self-stretch" onSubmit={onSubmit}>
      {shebaMasked ? (
        <p className="text-[14px] leading-[21px] text-graytext">
          ثبت‌شده: <span dir="ltr">{shebaMasked}</span>
          {holderName ? ` — ${holderName}` : ""}
        </p>
      ) : null}
      <label className="flex w-full flex-col gap-1 text-[14px] font-bold leading-[21px]" htmlFor="sheba-holder">
        {VERIFY_KYC.shebaHolder}
        <input
          id="sheba-holder"
          name="holder_name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setError("");
          }}
          className={inputClass}
        />
      </label>
      <label className="flex w-full flex-col gap-1 text-[14px] font-bold leading-[21px]" htmlFor="sheba-number">
        {VERIFY_KYC.shebaNumber}
        <input
          id="sheba-number"
          name="sheba"
          type="text"
          inputMode="text"
          autoComplete="off"
          dir="ltr"
          spellCheck={false}
          placeholder="IR000000000000000000000000"
          value={sheba}
          onChange={(event) => {
            const next = toEnDigits(event.target.value)
              .toUpperCase()
              .replace(/[^IR0-9\s]/g, "")
              .slice(0, 34);
            setSheba(next);
            setError(iranianShebaError(next, { requireComplete: false }) || "");
          }}
          className={`${inputClass} text-start`}
        />
      </label>
      <p className="text-[14px] leading-[21px] text-graytext">{VERIFY_KYC.shebaHint}</p>
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
