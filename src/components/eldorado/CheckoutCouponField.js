"use client";

import { FA } from "./data/faCopy";
import { formatTomanPrice } from "../../lib/format-toman";

export default function CheckoutCouponField({ coupon, disabled = false }) {
  if (!coupon) return null;
  const quote = coupon.quote;

  return (
    <div className="mb-3 flex flex-col gap-2">
      <span className="block text-sm font-bold text-nav">{FA.coupon}</span>
      {quote ? (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-cardborder bg-page px-3 py-2.5">
          <p className="min-w-0 text-sm text-nav">
            <span className="font-bold" dir="ltr">
              {quote.code}
            </span>
            {quote.discountToman > 0 ? (
              <span className="text-graytext"> · {formatTomanPrice(quote.discountToman)} {FA.discount}</span>
            ) : null}
          </p>
          <button type="button" className="shrink-0 text-xs font-bold text-graytext" onClick={() => coupon.clear()}>
            {FA.couponRemove}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            type="text"
            name="couponCode"
            autoComplete="off"
            spellCheck={false}
            dir="ltr"
            maxLength={32}
            disabled={disabled || coupon.busy}
            placeholder={FA.couponPlaceholder}
            value={coupon.input}
            onChange={(event) => coupon.setCode(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                void coupon.apply();
              }
            }}
            className="min-h-10 w-full rounded-md border border-cardborder bg-white px-3 py-2 text-sm text-nav"
          />
          <button
            type="button"
            disabled={disabled || coupon.busy}
            onClick={() => void coupon.apply()}
            className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-md border border-cardborder px-4 text-sm font-bold text-nav"
          >
            {FA.couponApply}
          </button>
        </div>
      )}
      {coupon.error ? (
        <p className="text-xs text-graytext">
          {coupon.error}
          {coupon.needAuth ? (
            <>
              {" "}
              <a href="/login" className="font-bold text-nav underline">
                {FA.login}
              </a>
            </>
          ) : null}
        </p>
      ) : null}
    </div>
  );
}
