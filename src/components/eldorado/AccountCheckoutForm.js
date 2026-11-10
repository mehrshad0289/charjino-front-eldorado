"use client";

import { useState } from "react";
import { createMarketOrder } from "../../actions/market.actions";
import { toFaDigits } from "../../lib/fa-digits";

export default function AccountCheckoutForm({ listingId, loggedIn, next }) {
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [orderNo, setOrderNo] = useState("");
  const [paid, setPaid] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    if (!accepted) {
      setMessage("برای ادامه، شرایط خرید را بپذیر.");
      return;
    }
    if (!loggedIn) {
      window.location.href = `/login?next=${encodeURIComponent(next)}`;
      return;
    }
    setLoading(true);
    setMessage("");
    const result = await createMarketOrder(listingId);
    setLoading(false);
    if (result.unauthorized) {
      window.location.href = `/login?next=${encodeURIComponent(next)}`;
      return;
    }
    if (!result.ok) {
      setMessage(result.message || "ثبت سفارش انجام نشد.");
      return;
    }
    setOrderNo(result.orderNo || "");
    setPaid(Boolean(result.paid));
  }

  if (orderNo) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-[rgba(9,9,11,0.05)_0px_2px_4px_0px]">
        <p className="text-[18px] font-bold">{paid ? "خرید ثبت شد" : "سفارش ثبت شد"}</p>
        <p className="mt-2 text-[14px] leading-[22px] text-graytext">
          شماره سفارش {toFaDigits(orderNo)}.{" "}
          {paid
            ? "پرداخت تأیید شد و پول تا تأیید تحویل نزد شارژینو می‌ماند."
            : "پرداخت در مرحلهٔ بعد انجام می‌شود."}
        </p>
        <a href="/dashboard/orders/purchased" className="mt-4 inline-flex rounded-lg bg-darkbtn px-4 py-3 text-[14px] font-bold text-white">
          سفارش‌های خرید
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-lg bg-white p-6 shadow-[rgba(9,9,11,0.05)_0px_2px_4px_0px]">
      <label className="flex items-start gap-3 text-[14px] leading-[22px]">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(event) => setAccepted(event.target.checked)}
          className="mt-1"
        />
        <span>پول تا تأیید تحویل نزد شارژینو می‌ماند و مشخصات آگهی را خوانده‌ام.</span>
      </label>
      {message ? <p className="mt-3 text-[14px] text-red-600">{message}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="mt-5 block w-full rounded-lg bg-darkbtn py-3 text-[16px] font-bold text-white disabled:opacity-60"
      >
        {loading ? "…" : loggedIn ? "ثبت سفارش" : "ورود و ادامه خرید"}
      </button>
    </form>
  );
}
