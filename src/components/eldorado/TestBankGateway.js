"use client";

import { useState } from "react";
import { verifyTestPayment } from "../../actions/market.actions";
import { formatToman } from "../../lib/listing";
import { toFaDigits } from "../../lib/fa-digits";
import { ORDER_COPY } from "./data/orderData";

export default function TestBankGateway({ reference, orderNo, amount, title }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function onPay() {
    setLoading(true);
    setMessage("");
    const result = await verifyTestPayment(reference);
    if (result.unauthorized) {
      window.location.href = `/login?next=${encodeURIComponent(`/pay/test?reference=${encodeURIComponent(reference)}&order=${encodeURIComponent(orderNo)}`)}`;
      return;
    }
    if (!result.ok) {
      setLoading(false);
      setMessage(result.message || "پرداخت تأیید نشد.");
      return;
    }
    const next = result.orderNo || orderNo;
    window.location.href = `/dashboard/orders/purchased/${encodeURIComponent(next)}?payment=success`;
  }

  const cancelHref = orderNo
    ? `/dashboard/orders/purchased/${encodeURIComponent(orderNo)}?payment=canceled`
    : "/dashboard/orders/purchased";

  return (
    <div className="flex min-h-screen flex-col bg-[#0f2a4a] text-white">
      <header className="border-b border-white/10 px-4 py-4">
        <p className="text-center text-[14px] font-bold tracking-wide">{ORDER_COPY.bankTitle}</p>
      </header>
      <main className="mx-auto flex w-full max-w-[420px] flex-1 flex-col px-4 py-8">
        <p className="rounded-lg bg-[#16375e] px-4 py-3 text-center text-[13px] leading-[22px] text-white/90">
          {ORDER_COPY.bankNote}
        </p>
        <section className="mt-5 rounded-2xl bg-white p-5 text-ink shadow-[0_12px_24px_rgba(0,0,0,0.18)]">
          <p className="text-[13px] text-graytext">پذیرنده</p>
          <p className="text-[16px] font-bold">{ORDER_COPY.bankMerchant}</p>
          {title ? <p className="mt-1 text-[13px] text-graytext">{title}</p> : null}
          <p className="mt-5 text-[13px] text-graytext">مبلغ</p>
          <p className="text-[28px] font-black">{formatToman(amount)} تومان</p>
          {orderNo ? (
            <p className="mt-2 text-[13px] text-graytext">سفارش {toFaDigits(orderNo)}</p>
          ) : null}
          <label className="mt-5 block text-[13px] text-graytext">{ORDER_COPY.bankCardLabel}</label>
          <input
            readOnly
            value="6037 9972 0000 0000"
            className="mt-1 w-full rounded-lg bg-inputgray px-3 py-3 text-left font-mono text-[15px] tracking-[0.12em]"
            dir="ltr"
          />
          <div className="mt-3 grid grid-cols-2 gap-3">
            <input readOnly value="۱۲ / ۲۹" className="rounded-lg bg-inputgray px-3 py-3 text-center" />
            <input readOnly value="۱۲۳" className="rounded-lg bg-inputgray px-3 py-3 text-center" dir="ltr" />
          </div>
          {message ? <p className="mt-3 text-[14px] text-[rgb(232,27,22)]">{message}</p> : null}
          <button
            type="button"
            onClick={onPay}
            disabled={loading || !reference}
            className="mt-5 w-full rounded-lg bg-[rgb(33,150,83)] py-3 text-[16px] font-bold text-white disabled:opacity-60"
          >
            {loading ? "…" : ORDER_COPY.bankPay}
          </button>
          <a href={cancelHref} className="mt-3 block w-full rounded-lg py-3 text-center text-[14px] font-bold text-graytext">
            {ORDER_COPY.bankCancel}
          </a>
        </section>
      </main>
    </div>
  );
}
