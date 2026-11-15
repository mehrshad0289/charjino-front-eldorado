"use client";

import { useId, useState } from "react";
import { formatTomanInWords, formatTomanNumber, sanitizePriceInput } from "@/lib/price";

function CloseIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 7l10 10M17 7L7 17"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function PriceField({
  id,
  label = "قیمت",
  hint = "تومان",
  placeholder = "۰",
  previewState = "default",
  value,
  name,
  onChange,
  onBlur,
  ariaLabel,
}) {
  const reactId = useId();
  const inputId = id || `price-${reactId}`;
  const [inner, setInner] = useState("");
  const raw = sanitizePriceInput(value === undefined ? inner : value);
  const isDisabled = previewState === "disabled";
  const isError = previewState === "error";
  const words = formatTomanInWords(raw);
  const shownHint = isError ? hint : words || hint;

  function setRaw(next) {
    const sanitized = sanitizePriceInput(next);
    if (value === undefined) setInner(sanitized);
    onChange?.(sanitized);
  }

  return (
    <label className="flex w-full min-w-0 flex-col text-[14px] font-bold" htmlFor={inputId}>
      {label ? <span>{label}</span> : null}
      <div
        className={`flex h-[42px] w-full items-center gap-2 rounded-lg border-2 px-3 text-[14px] text-ink ${
          label ? "mt-1" : ""
        } ${
          isError
            ? "border-[rgb(232,27,22)] bg-[rgb(255,244,244)]"
            : "border-[rgb(239,239,241)] bg-[rgb(239,239,241)]"
        }`}
      >
        <input
          id={inputId}
          className="min-h-0 min-w-0 flex-1 border-0 bg-transparent p-0 text-[14px] font-normal text-ink outline-none placeholder:text-graytext"
          name={name}
          inputMode="numeric"
          placeholder={placeholder}
          value={formatTomanNumber(raw)}
          disabled={isDisabled}
          aria-label={ariaLabel || label || undefined}
          aria-invalid={isError ? "true" : undefined}
          onBlur={onBlur}
          onChange={(event) => setRaw(event.target.value)}
        />
        {raw ? (
          <button
            type="button"
            className="flex size-6 shrink-0 items-center justify-center border-0 bg-transparent p-0 text-graytext disabled:opacity-60"
            aria-label="پاک کردن"
            disabled={isDisabled}
            onClick={() => setRaw("")}
          >
            <CloseIcon />
          </button>
        ) : null}
      </div>
      {shownHint ? (
        <span
          className={`mt-1 text-[13px] font-normal ${isError ? "text-[rgb(232,27,22)]" : "text-graytext"}`}
          role={isError ? "alert" : undefined}
        >
          {shownHint}
        </span>
      ) : null}
    </label>
  );
}
