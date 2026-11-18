"use client";

import { useEffect, useState } from "react";
import { catalogOrderHref } from "../../lib/catalog-checkout";
import {
  completeMockPayment,
  getMyCatalogOrder,
  refreshCatalogOrderStatus,
  revealOrderCodes,
  startOrderPayment,
} from "../../actions/checkout.actions";
import { formatTomanInWords } from "../../lib/price";
import { formatOrderDate } from "../../lib/order";
import { toFaDigits } from "../../lib/fa-digits";
import LoadingSpinner from "./LoadingSpinner";

const PAYABLE = new Set(["draft", "awaiting_payment", "pending_payment"]);
const LIVE = new Set(["paid", "submitting", "submitted", "processing", "fulfilling"]);

export default function CatalogOrderPanel({ order: initial, payment = "" }) {
  const [order, setOrder] = useState(initial);
  const [codes, setCodes] = useState(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState("");
  const status = String(order?.status || "");
  const canPay = PAYABLE.has(status);
  const delivery = order?.delivery && typeof order.delivery === "object" ? order.delivery : {};
  const canReveal =
    Number(delivery.itemCount || 0) > 0 &&
    ["completed", "needs_review", "delivered", "partial"].includes(status);
  const live = LIVE.has(status) && Number(order?.pollHintSeconds) > 0;

  useEffect(() => {
    setOrder(initial);
  }, [initial]);

  useEffect(() => {
    const seconds = Number(order?.pollHintSeconds);
    const number = String(order?.number || "");
    if (!number || !seconds || !LIVE.has(String(order?.status || ""))) return undefined;
    const started = Date.now();
    let timer;

    function tick() {
      if (typeof document !== "undefined" && document.hidden) return;
      if (Date.now() - started > 10 * 60 * 1000) return;
      void getMyCatalogOrder(number).then((result) => {
        if (result.ok && result.data) setOrder(result.data);
      });
    }

    function onVisibility() {
      if (!document.hidden) tick();
    }

    timer = window.setInterval(tick, seconds * 1000);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [order?.number, order?.pollHintSeconds, order?.status]);

  async function refresh() {
    setBusy("refresh");
    setMessage("");
    const queued = await refreshCatalogOrderStatus(order.number);
    if (queued.unauthorized) {
      window.location.href = `/login?next=${encodeURIComponent(catalogOrderHref(order.number))}`;
      return;
    }
    if (!queued.ok) {
      setBusy("");
      setMessage(queued.message || "وضعیت تازه نشد.");
      return;
    }
    const fresh = await getMyCatalogOrder(order.number);
    if (fresh.ok && fresh.data) setOrder(fresh.data);
    setBusy("");
  }

  async function pay() {
    setBusy("pay");
    setMessage("");
    const result = await startOrderPayment(order.number, window.location.origin);
    if (result.unauthorized) {
      window.location.href = `/login?next=${encodeURIComponent(catalogOrderHref(order.number))}`;
      return;
    }
    if (!result.ok) {
      setBusy("");
      setMessage(result.message || "پرداخت شروع نشد.");
      return;
    }
    if (result.data?.provider === "mock") {
      const done = await completeMockPayment(result.data.authority);
      if (!done.ok) {
        setBusy("");
        setMessage(done.message || "پرداخت آزمایشی ثبت نشد.");
        return;
      }
      window.location.href = `${catalogOrderHref(done.data.number)}?payment=success`;
      return;
    }
    if (result.data?.redirectUrl) {
      window.location.href = result.data.redirectUrl;
      return;
    }
    setBusy("");
    setMessage("آدرس پرداخت نیامد.");
  }

  async function reveal() {
    setBusy("reveal");
    setMessage("");
    const result = await revealOrderCodes(order.number);
    if (!result.ok) {
      setBusy("");
      setMessage(result.message || "کد آماده نشد.");
      return;
    }
    setCodes(Array.isArray(result.data?.items) ? result.data.items : []);
    setBusy("");
  }

  async function copy(text) {
    try {
      await navigator.clipboard.writeText(text);
      setMessage("کپی شد.");
    } catch {
      setMessage("کپی نشد.");
    }
  }

  return (
    <section className="rounded-lg bg-white p-6 shadow-[rgba(9,9,11,0.05)_0px_2px_4px_0px]">
      {payment === "success" ? (
        <p className="mb-4 text-[14px] text-[rgb(33,150,83)]">پرداخت تأیید شد. وضعیت سفارش اینجاست.</p>
      ) : null}
      <dl className="grid gap-4 text-[14px] sm:grid-cols-2">
        <div>
          <dt className="text-graytext">شماره سفارش</dt>
          <dd className="mt-1 font-bold" dir="ltr">
            {order.number}
          </dd>
        </div>
        <div>
          <dt className="text-graytext">وضعیت</dt>
          <dd className="mt-1 font-bold">{order.statusLabelFa || status}</dd>
        </div>
        <div>
          <dt className="text-graytext">مبلغ</dt>
          <dd className="mt-1 font-bold">{formatTomanInWords(order.amountToman) || "—"}</dd>
        </div>
        <div>
          <dt className="text-graytext">تاریخ</dt>
          <dd className="mt-1">{formatOrderDate(order.createdAt) || "—"}</dd>
        </div>
        <div>
          <dt className="text-graytext">محصول</dt>
          <dd className="mt-1">{order.productTitle || "—"}</dd>
        </div>
        <div>
          <dt className="text-graytext">بسته</dt>
          <dd className="mt-1">{order.skuName || "—"}</dd>
        </div>
      </dl>
      {order.customerMessage ? <p className="mt-4 text-[14px] text-red-600">{order.customerMessage}</p> : null}
      {delivery.summary ? <p className="mt-4 text-[14px] leading-[22px] text-graytext">{delivery.summary}</p> : null}
      {live ? (
        <p className="mt-4 text-[14px] leading-[22px] text-graytext">
          سفارش در حال انجام است. همین صفحه را باز بگذار؛ کد به‌محض آماده شدن اینجا می‌آید.
        </p>
      ) : null}
      {message ? <p className="mt-4 text-[14px] text-graytext">{message}</p> : null}
      {live ? (
        <button
          type="button"
          disabled={Boolean(busy)}
          onClick={() => void refresh()}
          className="mt-5 block w-full rounded-lg border border-cardborder bg-white py-3 text-[16px] font-bold text-ink disabled:opacity-60"
        >
          {busy === "refresh" ? <LoadingSpinner variant="inline" /> : "بررسی دوباره"}
        </button>
      ) : null}
      {canPay ? (
        <button
          type="button"
          disabled={Boolean(busy)}
          onClick={() => void pay()}
          className="mt-5 block w-full rounded-lg bg-darkbtn py-3 text-[16px] font-bold text-white disabled:opacity-60"
        >
          {busy === "pay" ? <LoadingSpinner variant="inline" className="text-white" /> : "ادامه پرداخت"}
        </button>
      ) : null}
      {canReveal ? (
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={Boolean(busy)}
            onClick={() => void reveal()}
            className="rounded-lg bg-darkbtn px-4 py-2 text-[14px] font-bold text-white disabled:opacity-60"
          >
            {busy === "reveal" ? <LoadingSpinner variant="inline" className="text-white" /> : "نمایش کد"}
          </button>
        </div>
      ) : null}
      {Array.isArray(codes) ? (
        <ul className="mt-4 space-y-2">
          {codes.map((item, index) => (
            <li key={`${index}-${String(item).slice(0, 6)}`} className="flex items-center justify-between gap-3 rounded-lg bg-page px-3 py-2">
              <code className="min-w-0 break-all text-[14px]" dir="ltr">
                {item}
              </code>
              <button type="button" className="shrink-0 text-[13px] font-bold text-linkblue" onClick={() => void copy(item)}>
                کپی
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      {order.quantity > 1 ? <p className="mt-4 text-[14px] text-graytext">تعداد: {toFaDigits(order.quantity)}</p> : null}
    </section>
  );
}
