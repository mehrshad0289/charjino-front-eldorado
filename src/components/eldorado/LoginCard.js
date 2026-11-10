"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { requestOtp, verifyOtp } from "@/actions/auth.actions";
import { onlyDigits, toFaDigits } from "@/lib/fa-digits";
import { isIranianMobile } from "@/lib/phone";
import Logo from "./Logo";
import { FA } from "./data/faCopy";

const OTP_SECONDS = 120;
const inputClass =
  "block min-h-8 w-full rounded-lg border-[0.8px] border-[rgb(198,_198,_204)] bg-[rgb(42,_42,_55)] px-3 pb-[5px] pt-[5px] text-white outline-none placeholder:text-[rgb(160,_158,_169)]";
const yellowButtonClass =
  "inline-block w-full rounded-lg border-2 border-brand bg-brand px-5 py-1 text-center font-bold tracking-[0.07px] text-ink disabled:opacity-60";
const ghostButtonClass =
  "inline-block w-full rounded-lg border-2 border-[rgb(40,_40,_54)] bg-[rgb(40,_40,_54)] px-5 py-1 text-center font-bold tracking-[0.07px] text-white disabled:opacity-60";

export default function LoginCard({ nextPath = "/" }) {
  const router = useRouter();
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [seconds, setSeconds] = useState(OTP_SECONDS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (step !== "otp" || seconds <= 0) return undefined;
    const id = window.setTimeout(() => setSeconds((value) => value - 1), 1000);
    return () => window.clearTimeout(id);
  }, [step, seconds]);

  async function sendCode(event) {
    event.preventDefault();
    if (!isIranianMobile(phone)) {
      setError("شماره همراه معتبر نیست.");
      return;
    }
    setLoading(true);
    setError("");
    const result = await requestOtp(phone);
    setLoading(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setCode("");
    setSeconds(OTP_SECONDS);
    setStep("otp");
  }

  async function confirmCode(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const result = await verifyOtp(phone, code);
    setLoading(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    router.refresh();
    router.push(nextPath || "/");
  }

  return (
    <div className="w-full max-w-[402px] min-w-0">
      <div className="w-full rounded-lg border-[0.8px] border-[rgb(66,_70,_80)] bg-[rgb(30,_31,_40)] p-6">
        <div className="text-[14px] leading-[20px] text-[rgb(160,_158,_169)]">
          <div className="flex flex-col gap-5">
            <div className="text-center">
              <Link href="/" aria-label="شارژینو" className="inline-block">
                <Logo color="#FFFFFF" className="inline h-[40px] align-middle" />
              </Link>
            </div>
            <h2 className="py-[5px] text-start text-[24px] font-bold leading-[30px] text-white">{FA.otpTitle}</h2>
            {step === "phone" ? (
              <form aria-label="ورود با شماره" onSubmit={sendCode}>
                <div className="flex flex-col gap-5">
                  <div>
                    <label className="font-bold text-white" htmlFor="login-phone">
                      {FA.otpPhoneLabel}
                    </label>
                    <div className="pt-1">
                      <input
                        id="login-phone"
                        name="phone"
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel"
                        placeholder={FA.otpPhonePlaceholder}
                        value={phone}
                        onChange={(event) => {
                          setPhone(event.target.value);
                          setError("");
                        }}
                        className={inputClass}
                      />
                    </div>
                  </div>
                  {error ? <p className="text-[rgb(255,_99,_99)]">{error}</p> : null}
                  <button type="submit" className={yellowButtonClass} disabled={loading}>
                    {loading ? "…" : FA.otpSendCode}
                  </button>
                </div>
              </form>
            ) : (
              <form aria-label="کد تأیید" onSubmit={confirmCode}>
                <div className="flex flex-col gap-5">
                  <div>
                    <label className="font-bold text-white" htmlFor="login-otp">
                      {FA.otpCodeHeading}
                    </label>
                    <div className="pt-1">
                      <input
                        id="login-otp"
                        name="code"
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={8}
                        value={code}
                        onChange={(event) => {
                          setCode(onlyDigits(event.target.value).slice(0, 8));
                          setError("");
                        }}
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <p>
                    {seconds > 0 ? (
                      <>کدی دریافت نکردید؟ دریافت مجدد {toFaDigits(seconds)} ثانیه.</>
                    ) : (
                      <button
                        type="button"
                        className="text-[rgb(71,_131,_255)]"
                        disabled={loading}
                        onClick={sendCode}
                      >
                        {FA.otpResend}
                      </button>
                    )}
                  </p>
                  {error ? <p className="text-[rgb(255,_99,_99)]">{error}</p> : null}
                  <div className="flex flex-col gap-2">
                    <button
                      type="submit"
                      className={yellowButtonClass}
                      disabled={loading || code.length < 4}
                    >
                      {loading ? "…" : FA.otpSubmit}
                    </button>
                    <button
                      type="button"
                      className={ghostButtonClass}
                      disabled={loading}
                      onClick={() => {
                        setStep("phone");
                        setCode("");
                        setError("");
                      }}
                    >
                      {FA.otpChangePhone}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
