"use client";

import { useEffect, useState } from "react";
import { getOrderMessages, sendOrderMessage } from "../../actions/market.actions";
import { formatOrderDate } from "../../lib/order";
import { ORDER_COPY } from "./data/orderData";

export default function OrderChatBox({ orderNo, role }) {
  const [items, setItems] = useState([]);
  const [body, setBody] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    const result = await getOrderMessages(orderNo);
    if (result.ok) setItems(result.items);
  }

  useEffect(() => {
    load();
  }, [orderNo]);

  async function onSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const result = await sendOrderMessage(orderNo, body);
    setLoading(false);
    if (!result.ok) {
      setMessage(result.message || "ارسال نشد.");
      return;
    }
    setBody("");
    await load();
  }

  return (
    <section id="order-chat" className="rounded-xl bg-white p-5 shadow-[0_2px_4px_rgba(9,9,11,0.05)]">
      <h2 className="text-[16px] font-bold">{ORDER_COPY.chatTitle}</h2>
      <p className="mt-1 text-[13px] leading-[20px] text-graytext">{ORDER_COPY.chatHint}</p>
      <div className="mt-4 flex max-h-[280px] flex-col gap-2 overflow-y-auto">
        {items.length === 0 ? (
          <p className="text-[14px] text-graytext">هنوز پیامی نیست.</p>
        ) : (
          items.map((item) => {
            const mine = item.sender_role === role;
            return (
              <div key={item.id} className={`max-w-[85%] rounded-lg px-3 py-2 text-[14px] ${mine ? "self-start bg-badgebg" : "self-end bg-[rgba(71,131,255,0.12)]"}`}>
                <p className="whitespace-pre-wrap">{item.body}</p>
                <p className="mt-1 text-[11px] text-graytext">{formatOrderDate(item.at)}</p>
              </div>
            );
          })
        )}
      </div>
      <form onSubmit={onSubmit} className="mt-4 flex gap-2">
        <input
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder={ORDER_COPY.chatPlaceholder}
          className="min-h-11 flex-1 rounded-lg bg-inputgray px-3"
        />
        <button type="submit" disabled={loading} className="rounded-lg bg-darkbtn px-4 text-[14px] font-bold text-white disabled:opacity-60">
          {ORDER_COPY.chatSend}
        </button>
      </form>
      {message ? <p className="mt-2 text-[14px] text-[rgb(232,27,22)]">{message}</p> : null}
    </section>
  );
}
