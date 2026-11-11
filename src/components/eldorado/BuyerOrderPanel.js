"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  confirmBuyerOrder,
  revealBuyerOrder,
  startMarketPayment,
} from "../../actions/market.actions";
import { formatToman } from "../../lib/listing";
import { listingGame, listingTitle, orderNeedsPayment, orderStatusMeta } from "../../lib/order";
import { toFaDigits } from "../../lib/fa-digits";
import OrderChatBox from "./OrderChatBox";
import OrderTimeline from "./OrderTimeline";
import AccountSecureGuide from "./AccountSecureGuide";
import { ORDER_COPY } from "./data/orderData";

export default function BuyerOrderPanel({ order, payment }) {
  const router = useRouter();
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");
  const [secret, setSecret] = useState("");
  const [copied, setCopied] = useState(false);
  const status = orderStatusMeta(order?.status);
  const delivery = order?.delivery || {};
  const reviewing = order?.status === "buyer_reviewing" || Boolean(delivery.has_payload);
  const unpaid = orderNeedsPayment(order?.status);

  async function run(name, action) {
    setBusy(name);
    setMessage("");
    const result = await action();
    setBusy("");
    if (result.unauthorized) {
      router.push(`/login?next=/dashboard/orders/purchased/${encodeURIComponent(order.order_no)}`);
      return result;
    }
    if (!result.ok) {
      setMessage(result.message || "انجام نشد.");
      return result;
    }
    return result;
  }

  async function onPay() {
    const result = await run("pay", () => startMarketPayment(order.order_no));
    if (result?.payUrl) window.location.href = result.payUrl;
  }

  async function onReveal() {
    if (!window.confirm(ORDER_COPY.revealOnce)) return;
    const result = await run("reveal", () => revealBuyerOrder(order.order_no));
    if (result?.secret) setSecret(result.secret);
    router.refresh();
  }

  async function onConfirm() {
    const result = await run("confirm", () => confirmBuyerOrder(order.order_no));
    if (result?.ok) router.refresh();
  }

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(secret);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {payment === "success" ? (
        <p className="rounded-lg bg-[rgba(33,150,83,0.15)] px-4 py-3 text-[14px] font-bold">{ORDER_COPY.paySuccess}</p>
      ) : null}
      <section className="rounded-xl bg-white p-5 shadow-[0_2px_4px_rgba(9,9,11,0.05)]">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-[20px] font-bold">{listingTitle(order)}</h2>
            <p className="mt-1 text-[14px] text-graytext">{listingGame(order)}</p>
            <p className="mt-2 text-[13px] text-graytext">
              {ORDER_COPY.orderId} {toFaDigits(order.order_no)}
            </p>
          </div>
          <span className="rounded-lg px-3 py-1 text-[13px] font-bold text-white" style={{ backgroundColor: status.bg }}>
            {status.label}
          </span>
        </div>
        <p className="mt-4 text-[18px] font-bold">{formatToman(order.buyer_paid_amount)} تومان</p>
        <p className="mt-1 text-[13px] text-graytext">{ORDER_COPY.escrowNote}</p>
        {unpaid ? (
          <button
            type="button"
            disabled={busy === "pay"}
            onClick={onPay}
            className="mt-4 rounded-lg bg-darkbtn px-4 py-3 text-[14px] font-bold text-white disabled:opacity-60"
          >
            {ORDER_COPY.payCta}
          </button>
        ) : null}
        {order.status === "paid" ? <p className="mt-4 text-[14px] leading-[22px]">{ORDER_COPY.waitSeller}</p> : null}
        {order.status === "awaiting_delivery" ? <p className="mt-4 text-[14px] leading-[22px]">{ORDER_COPY.waitDelivery}</p> : null}
        {order.status === "completed" || order.status === "settling" || order.status === "settled" ? (
          <p className="mt-4 text-[14px] leading-[22px]">{ORDER_COPY.completed}</p>
        ) : null}
      </section>

      {reviewing ? (
        <section className="rounded-xl bg-white p-5 shadow-[0_2px_4px_rgba(9,9,11,0.05)]">
          <h2 className="text-[16px] font-bold">{ORDER_COPY.accountDetails}</h2>
          <p className="mt-2 text-[14px] leading-[22px] text-graytext">{ORDER_COPY.reviewHint}</p>
          <div className="mt-4 rounded-lg bg-guarantee p-4">
            <p className="text-[14px] font-bold">{ORDER_COPY.staySecureTitle}</p>
            <p className="mt-1 text-[14px] leading-[22px]">{ORDER_COPY.staySecure}</p>
          </div>
          {secret ? (
            <div className="mt-4 rounded-lg bg-badgebg p-4">
              <pre className="whitespace-pre-wrap break-all text-[14px]">{secret}</pre>
              <button type="button" onClick={onCopy} className="mt-3 text-[13px] font-bold text-linkblue">
                {copied ? ORDER_COPY.copied : ORDER_COPY.copy}
              </button>
            </div>
          ) : delivery.revealed ? (
            <p className="mt-4 text-[14px] text-graytext">{ORDER_COPY.revealDone}</p>
          ) : (
            <button
              type="button"
              disabled={busy === "reveal"}
              onClick={onReveal}
              className="mt-4 rounded-lg bg-darkbtn px-4 py-3 text-[14px] font-bold text-white disabled:opacity-60"
            >
              {ORDER_COPY.revealCta}
            </button>
          )}
          {secret || delivery.revealed || delivery.has_payload ? <AccountSecureGuide /> : null}
          {order.status === "buyer_reviewing" ? (
            <div className="mt-5">
              <p className="text-[14px] leading-[22px] text-graytext">{ORDER_COPY.confirmHint}</p>
              <button
                type="button"
                disabled={busy === "confirm"}
                onClick={onConfirm}
                className="mt-3 rounded-lg bg-[rgb(33,150,83)] px-4 py-3 text-[14px] font-bold text-white disabled:opacity-60"
              >
                {ORDER_COPY.confirmCta}
              </button>
            </div>
          ) : null}
        </section>
      ) : null}

      {message ? <p className="text-[14px] text-[rgb(232,27,22)]">{message}</p> : null}
      <OrderChatBox orderNo={order.order_no} role="buyer" />
      <OrderTimeline items={order.timeline} />
    </div>
  );
}
