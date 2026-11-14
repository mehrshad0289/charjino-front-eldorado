"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { acceptSellerTerms } from "@/actions/market.actions";
import { SUPPORT_SELLER_RULES } from "./data/supportData";
import { VERIFY_KYC } from "./data/verifyData";
import LoadingSpinner from "./LoadingSpinner";

function ArrowRightIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 12h15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="m13 6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function VerifyTermsForm({ cta }) {
  const router = useRouter();
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event) {
    event.preventDefault();
    if (!accepted) {
      setError("برای ادامه باید قوانین فروشنده را بپذیری.");
      return;
    }
    setLoading(true);
    setError("");
    const result = await acceptSellerTerms();
    setLoading(false);
    if (result.unauthorized) {
      router.push("/login?next=/verify/status");
      return;
    }
    if (!result.ok) {
      setError(result.message || "پذیرش انجام نشد.");
      return;
    }
    router.refresh();
  }

  return (
    <form className="flex w-full flex-col items-start gap-4 self-stretch" onSubmit={onSubmit}>
      <a href={SUPPORT_SELLER_RULES} className="text-[14px] font-bold text-linkblue">
        {VERIFY_KYC.termsLink}
      </a>
      <label className="flex items-start gap-2 text-[14px] leading-[21px]">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(event) => {
            setAccepted(event.target.checked);
            setError("");
          }}
          className="mt-1 size-4 shrink-0"
        />
        <span>{VERIFY_KYC.termsCheck}</span>
      </label>
      {error ? <p className="text-[14px] text-[rgb(232,27,22)]">{error}</p> : null}
      <button
        type="submit"
        aria-label={cta}
        disabled={loading || !accepted}
        className="inline-block min-h-[42px] min-w-[70px] overflow-hidden rounded-lg bg-[rgb(34,_33,_39)] px-4 pb-[10px] pt-[10px] text-center text-[14px] font-bold leading-[21px] text-white disabled:opacity-60"
      >
        <span className="flex items-center justify-center gap-[6px] text-center">
          <span className="block text-center">{loading ? <LoadingSpinner variant="inline" className="text-white" /> : cta}</span>
          <ArrowRightIcon />
        </span>
      </button>
    </form>
  );
}
