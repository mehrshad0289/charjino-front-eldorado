"use client";

import { useState } from "react";
import { createMarketOrder } from "../../actions/market.actions";

export default function AccountCheckoutForm({ listingId, loggedIn, next }) {
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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
        {loading ? "رفتن به درگاه…" : loggedIn ? "پرداخت امن" : "ورود و ادامه خرید"}
      </button>
    </form>
  );
}
