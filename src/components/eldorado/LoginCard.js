"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { requestOtp, verifyOtp } from "@/actions/auth.actions";
import { writeSessionUser } from "@/lib/session-client";
import { onlyDigits, toFaDigits } from "@/lib/fa-digits";
import { isIranianMobile } from "@/lib/phone";
import Logo from "./Logo";
import LoadingSpinner from "./LoadingSpinner";
import { FA } from "./data/faCopy";

const OTP_SECONDS = 120;
const OTP_LENGTH = 6;
const inputClass =
  "block min-h-9 w-full rounded-lg border-[0.8px] border-[rgb(198,_198,_204)] bg-[rgb(42,_42,_55)] px-3 pb-[5px] pt-[5px] text-white outline-none placeholder:text-[rgb(160,_158,_169)]";
const otpBoxClass =
  "flex h-11 w-full min-w-0 items-center justify-center rounded-lg border-[0.8px] border-[rgb(198,_198,_204)] bg-[rgb(42,_42,_55)] px-0 text-center text-[18px] font-bold text-white";
const yellowButtonClass =
  "inline-block w-full max-h-9 rounded-lg border-2 border-brand bg-brand px-5 py-2 text-center font-bold tracking-[0.07px] text-ink disabled:opacity-60";
const ghostButtonClass =
  "inline-block w-full rounded-lg border-2 border-[rgb(40,_40,_54)] bg-[rgb(40,_40,_54)] px-5 py-1 text-center font-bold tracking-[0.07px] text-white disabled:opacity-60";

function OtpBoxes({ id, value, disabled, onChange }) {
  const inputRef = useRef(null);
  const onChangeRef = useRef(onChange);
  const [focused, setFocused] = useState(false);
  const code = onlyDigits(value).slice(0, OTP_LENGTH);
  const digits = Array.from(
    { length: OTP_LENGTH },
    (_, index) => code[index] ?? "",
  );
  const activeIndex = Math.min(code.length, OTP_LENGTH - 1);

  onChangeRef.current = onChange;

  useEffect(() => {
    if (disabled) return undefined;
    inputRef.current?.focus();
  }, [disabled]);

  useEffect(() => {
    if (disabled) return undefined;
    if (typeof window === "undefined" || !("OTPCredential" in window)) {
      return undefined;
    }
    const abort = new AbortController();
    navigator.credentials
      .get({ otp: { transport: ["sms"] }, signal: abort.signal })
      .then((credential) => {
        const next = onlyDigits(credential?.code).slice(0, OTP_LENGTH);
        if (next) onChangeRef.current(next);
      })
      .catch(() => {});
    return () => abort.abort();
  }, [disabled]);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return undefined;
    const takeDigits = (raw) => {
      const next = onlyDigits(raw).slice(0, OTP_LENGTH);
      if (next) onChangeRef.current(next);
      return next;
    };
    const onBeforeInput = (event) => {
      const inserted = onlyDigits(event.data || "");
      if (inserted.length <= 1) return;
      event.preventDefault();
      takeDigits(inserted);
    };
    const onPaste = (event) => {
      const pasted = onlyDigits(event.clipboardData?.getData("text") || "");
      if (!pasted) return;
      event.preventDefault();
      takeDigits(pasted);
    };
    input.addEventListener("beforeinput", onBeforeInput);
    input.addEventListener("paste", onPaste);
    return () => {
      input.removeEventListener("beforeinput", onBeforeInput);
      input.removeEventListener("paste", onPaste);
    };
  }, []);

  function applyCode(raw) {
    onChange(onlyDigits(raw).slice(0, OTP_LENGTH));
  }

  return (
    <div
      className="relative grid w-full min-w-0 grid-cols-6 gap-1.5 sm:gap-2"
      dir="ltr"
      onClick={() => inputRef.current?.focus()}
    >
      <input
        ref={inputRef}
        id={id}
        name="one-time-code"
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        pattern="[0-9]*"
        maxLength={OTP_LENGTH}
        value={code}
        disabled={disabled}
        aria-label="کد تأیید"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onBeforeInput={(event) => {
          const inserted = onlyDigits(event.data || "");
          if (inserted.length <= 1) return;
          event.preventDefault();
          applyCode(inserted.length >= OTP_LENGTH ? inserted : `${code}${inserted}`);
        }}
        onChange={(event) => applyCode(event.target.value)}
        onInput={(event) => applyCode(event.currentTarget.value)}
        className="absolute inset-0 z-[1] h-full w-full cursor-text border-0 bg-transparent text-[18px] text-transparent caret-transparent outline-none"
      />
      {digits.map((digit, index) => (
        <div
          key={index}
          aria-hidden="true"
          className={`${otpBoxClass} pointer-events-none ${
            disabled ? "opacity-60" : ""
          } ${focused && index === activeIndex ? "border-brand" : ""}`}
        >
          {digit ? toFaDigits(digit) : ""}
        </div>
      ))}
    </div>
  );
}

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
    writeSessionUser(result.user ?? null);
    router.refresh();
    router.push(nextPath || "/");
  }

  return (
    <div className="w-full min-w-0 max-w-[min(402px,100%)]">
      <div className="w-full rounded-xl border-[0.8px] border-[rgb(66,_70,_80)] bg-[rgb(30,_31,_40)] p-6">
        <div className="text-[14px] leading-[20px] text-[rgb(160,_158,_169)]">
          <div className="flex flex-col gap-5">
            <div className="text-center">
              <Link href="/" aria-label="شارژینو" className="inline-block">
                <Logo
                  color="#FFFFFF"
                  className="inline h-[40px] align-middle"
                />
              </Link>
            </div>
            <h2 className="py-[5px] text-start text-[24px] font-bold leading-[30px] text-white">
              {FA.otpTitle}
            </h2>
            {step === "phone" ? (
              <form aria-label="ورود با شماره" onSubmit={sendCode}>
                <div className="flex flex-col gap-2">
                  <div className="relative pb-5">
                    <label
                      className="font-bold text-white"
                      htmlFor="login-phone"
                    >
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
                    <div className="absolute bottom-0 left-0 right-0">
                      {error ? (
                        <p className="text-[rgb(255,_99,_99)] text-xs font-light">
                          {error}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <button
                    type="submit"
                    className={yellowButtonClass}
                    disabled={loading}
                  >
                    {loading ? (
                      <LoadingSpinner variant="inline" className="text-ink" />
                    ) : (
                      FA.otpSendCode
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <form aria-label="کد تأیید" onSubmit={confirmCode}>
                <div className="flex flex-col gap-2">
                  <div>
                    <label className="font-bold text-white" htmlFor="login-otp">
                      {FA.otpCodeHeading}
                    </label>
                    <div className="pt-1">
                      <OtpBoxes
                        id="login-otp"
                        value={code}
                        disabled={loading}
                        onChange={(next) => {
                          setCode(next);
                          setError("");
                        }}
                      />
                    </div>
                  </div>
                  <div className="relative pb-4 pt-2">
                    <p>
                      {seconds > 0 ? (
                        <>
                          کدی دریافت نکردید؟ دریافت مجدد {toFaDigits(seconds)}{" "}
                          ثانیه.
                        </>
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
                    {error ? (
                      <div className="absolute bottom-0 left-0 right-0">
                        <p className="text-[rgb(255,_99,_99)] text-xs font-light">{error}</p>
                      </div>
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      type="submit"
                      className={yellowButtonClass}
                      disabled={loading || code.length < OTP_LENGTH}
                    >
                      {loading ? (
                        <LoadingSpinner variant="inline" className="text-ink" />
                      ) : (
                        FA.otpSubmit
                      )}
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
