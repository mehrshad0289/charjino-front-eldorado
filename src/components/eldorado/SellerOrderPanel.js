"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deliverSellerOrder } from "../../actions/market.actions";
import { formatToman } from "../../lib/listing";
import { listingGame, listingTitle, orderStatusMeta } from "../../lib/order";
import { toFaDigits } from "../../lib/fa-digits";
import OrderChatBox from "./OrderChatBox";
import OrderTimeline from "./OrderTimeline";
import { ORDER_COPY } from "./data/orderData";

export default function SellerOrderPanel({ order }) {
  const router = useRouter();
  const [secret, setSecret] = useState("");
  const [instructions, setInstructions] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const status = orderStatusMeta(order?.status);
  const canDeliver = order?.status === "paid" || order?.status === "awaiting_delivery";
  const paidOut = order?.status === "settling" || order?.status === "settled" || order?.status === "completed";
  const delivered = Boolean(order?.delivered_at) || order?.status === "buyer_reviewing" || paidOut;

  async function onSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const result = await deliverSellerOrder(order.order_no, secret, instructions);
    setBusy(false);
    if (result.unauthorized) {
      router.push(`/login?next=/dashboard/orders/sold/${encodeURIComponent(order.order_no)}`);
      return;
    }
    if (!result.ok) {
      setMessage(result.message || "ارسال نشد.");
      return;
    }
    setSecret("");
    setInstructions("");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-5">
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
        <p className="mt-4 text-[18px] font-bold">{formatToman(order.seller_payout_amount || order.price_amount)} تومان</p>
        {order.status === "cart_pending" || orderNeedsPay(order.status) ? (
          <p className="mt-3 text-[14px]">{ORDER_COPY.sellerWaitPay}</p>
        ) : null}
        {order.status === "paid" ? <p className="mt-3 text-[14px] leading-[22px]">{ORDER_COPY.sellerPaidHint}</p> : null}
        {order.status === "buyer_reviewing" ? <p className="mt-3 text-[14px] leading-[22px]">{ORDER_COPY.sellerWaitBuyer}</p> : null}
        {paidOut ? (
          <p className="mt-3 text-[14px] leading-[22px]">
            {ORDER_COPY.sellerWalletCredited}{" "}
            <a href="/dashboard/wallet" className="font-bold text-linkblue">
              {ORDER_COPY.sellerWalletLink}
            </a>
          </p>
        ) : null}
      </section>

      {canDeliver ? (
        <form onSubmit={onSubmit} className="rounded-xl bg-white p-5 shadow-[0_2px_4px_rgba(9,9,11,0.05)]">
          <h2 className="text-[16px] font-bold">{ORDER_COPY.sellerDeliverTitle}</h2>
          <p className="mt-2 text-[14px] leading-[22px] text-graytext">{ORDER_COPY.sellerDeliverHint}</p>
          <label className="mt-4 block text-[13px] font-bold">{ORDER_COPY.sellerSecret}</label>
          <textarea
            required
            value={secret}
            onChange={(event) => setSecret(event.target.value)}
            rows={5}
            className="mt-1 w-full rounded-lg bg-inputgray p-3 text-[14px]"
          />
          <label className="mt-3 block text-[13px] font-bold">{ORDER_COPY.sellerInstructions}</label>
          <textarea
            value={instructions}
            onChange={(event) => setInstructions(event.target.value)}
            rows={3}
            className="mt-1 w-full rounded-lg bg-inputgray p-3 text-[14px]"
          />
          {message ? <p className="mt-3 text-[14px] text-[rgb(232,27,22)]">{message}</p> : null}
          <button type="submit" disabled={busy} className="mt-4 rounded-lg bg-darkbtn px-4 py-3 text-[14px] font-bold text-white disabled:opacity-60">
            {ORDER_COPY.sellerSend}
          </button>
        </form>
      ) : null}

      <OrderChatBox orderNo={order.order_no} role="seller" />
      <OrderTimeline items={order.timeline} />
    </div>
  );
}

function orderNeedsPay(status) {
  return status === "awaiting_payment" || status === "payment_verifying";
}
