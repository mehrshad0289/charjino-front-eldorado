"use client";

import { useMemo, useState } from "react";
import { createMarketOrder } from "../../actions/market.actions";
import { formatTomanPrice } from "../../lib/format-toman";
import { toFaDigits } from "../../lib/fa-digits";
import { CURRENCY_LISTING_COPY } from "./data/listingData";

export default function AccountCheckoutForm({
  listingId,
  loggedIn,
  next,
  isOwn = false,
  isItem = false,
  isCurrency = false,
  initialQuantity,
  quote = null,
  stock = null,
  minQuantity = 1,
  checkoutFields = [],
  deliveryLabel = "",
}) {
  const minQty = Math.max(1, Number(minQuantity) || 1);
  const maxQty = stock != null && Number.isFinite(Number(stock)) ? Math.max(minQty, Number(stock)) : minQty;
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const startQty = clampQty(initialQuantity, minQty, maxQty);
  const [quantity, setQuantity] = useState(startQty);
  const [fields, setFields] = useState({});

  const totals = useMemo(() => {
    const unit = Number(quote?.unit_price_amount || quote?.price_amount || 0);
    const feePercent = Number(quote?.buyer_fee_percent || 0);
    const qty = Math.min(maxQty, Math.max(minQty, Number(quantity) || minQty));
    const price = Number.isFinite(unit) ? unit * qty : 0;
    const fee = feePercent ? Math.floor((price * feePercent) / 100) : Number(quote?.buyer_fee_amount || 0);
    const paid = price + fee;
    return { qty, price, fee, paid };
  }, [quote, quantity, minQty, maxQty]);

  async function onSubmit(event) {
    event.preventDefault();
    if (isOwn) {
      setMessage("این آگهی متعلق به شماست و نمی‌توانید آن را بخرید.");
      return;
    }
    if (!accepted) {
      setMessage("برای ادامه، شرایط خرید را بپذیر.");
      return;
    }
    for (const field of checkoutFields) {
      if (field.required && !String(fields[field.key] || "").trim()) {
        setMessage(`برای «${field.label}» باید مقدار بدهید.`);
        return;
      }
    }
    if (!loggedIn) {
      window.location.href = `/login?next=${encodeURIComponent(next)}`;
      return;
    }
    setLoading(true);
    setMessage("");
    const checkout = {};
    for (const field of checkoutFields) {
      const value = String(fields[field.key] || "").trim();
      if (value) checkout[field.key] = value;
    }
    const result = await createMarketOrder(listingId, {
      quantity: totals.qty,
      checkout: Object.keys(checkout).length ? checkout : undefined,
    });
    if (result.unauthorized) {
      window.location.href = `/login?next=${encodeURIComponent(next)}`;
      return;
    }
    if (!result.ok) {
      setLoading(false);
      setMessage(result.message || "ثبت سفارش انجام نشد.");
      return;
    }
    if (result.payUrl) {
      window.location.href = result.payUrl;
      return;
    }
    if (result.orderNo) {
      window.location.href = `/dashboard/orders/purchased/${encodeURIComponent(result.orderNo)}`;
      return;
    }
    setLoading(false);
    setMessage("سفارش ساخته شد ولی آدرس پرداخت نیامد.");
  }

  const showQty = (isItem || isCurrency) && maxQty > minQty;
  const unitLabel = quote?.price_unit_label || "";
  const rwt = isCurrency ? quote?.rwt_notice || CURRENCY_LISTING_COPY.rwtFallback : "";

  return (
    <form onSubmit={onSubmit} className="rounded-lg bg-white p-6 shadow-[rgba(9,9,11,0.05)_0px_2px_4px_0px]">
      {deliveryLabel ? (
        <p className="mb-4 text-[14px] text-graytext">
          تحویل: <strong className="text-ink">{deliveryLabel}</strong>
        </p>
      ) : null}
      {isCurrency && quote?.delivery_minutes ? (
        <p className="mb-4 text-[14px] text-graytext">
          زمان تضمینی: <strong className="text-ink">{toFaDigits(quote.delivery_minutes)} دقیقه</strong>
        </p>
      ) : null}
      {isCurrency && unitLabel ? (
        <p className="mb-4 text-[14px] text-graytext">
          نرخ برای هر <strong className="text-ink">{unitLabel}</strong>
        </p>
      ) : null}
      {showQty ? (
        <label className="mb-4 block text-[14px]">
          <span className="mb-2 block font-bold">تعداد</span>
          <input
            type="number"
            min={minQty}
            max={maxQty}
            value={quantity}
            onChange={(event) => setQuantity(onlyNumber(event.target.value, minQty, maxQty))}
            className="h-[42px] w-full rounded-lg bg-inputgray px-3"
          />
          <span className="mt-1 block text-[13px] text-filtertext">
            موجودی {toFaDigits(maxQty)}
            {unitLabel ? ` ${unitLabel}` : ""}
          </span>
        </label>
      ) : null}
      {checkoutFields.map((field) => (
        <label key={field.key} className="mb-4 block text-[14px]">
          <span className="mb-2 block font-bold">
            {field.label}
            {field.required ? <span className="text-red-600"> *</span> : null}
          </span>
          <input
            value={fields[field.key] || ""}
            onChange={(event) => setFields((current) => ({ ...current, [field.key]: event.target.value }))}
            required={Boolean(field.required)}
            className="h-[42px] w-full rounded-lg bg-inputgray px-3"
          />
        </label>
      ))}
      <dl className="mb-5 space-y-2 text-[14px]">
        <div className="flex items-center justify-between gap-3">
          <dt className="text-graytext">قیمت کالا</dt>
          <dd className="font-bold">{formatTomanPrice(totals.price) || "—"}</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-graytext">کارمزد خریدار</dt>
          <dd>{formatTomanPrice(totals.fee) || "۰ تومان"}</dd>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-cardborder pt-2">
          <dt className="font-bold">جمع پرداختی</dt>
          <dd className="text-[18px] font-bold">{formatTomanPrice(totals.paid) || "—"}</dd>
        </div>
      </dl>
      <label className="flex items-start gap-3 text-[14px] leading-[22px]">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(event) => setAccepted(event.target.checked)}
          className="mt-1"
        />
        <span>
          پول تا تأیید تحویل نزد شارژینو می‌ماند و مشخصات آگهی را خوانده‌ام.
          {rwt ? ` ${rwt}` : ""}
        </span>
      </label>
      {isOwn ? (
        <p className="mt-3 text-[14px] text-red-600">این آگهی متعلق به شماست. برای تست خرید با حساب خریدار وارد شوید.</p>
      ) : null}
      {message ? <p className="mt-3 text-[14px] text-red-600">{message}</p> : null}
      <button
        type="submit"
        disabled={loading || isOwn}
        className="mt-5 block w-full rounded-lg bg-darkbtn py-3 text-[16px] font-bold text-white disabled:opacity-60"
      >
        {loading ? "رفتن به درگاه…" : loggedIn ? "پرداخت امن" : "ورود و ادامه خرید"}
      </button>
    </form>
  );
}

function clampQty(value, min, max) {
  const next = Number(String(value ?? "").replace(/\D/g, ""));
  if (!Number.isFinite(next) || next < min) return min;
  if (next > max) return max;
  return next;
}

function onlyNumber(value, min, max) {
  const next = Number(String(value || "").replace(/\D/g, ""));
  if (!Number.isFinite(next) || next < min) return min;
  if (next > max) return max;
  return next;
}
