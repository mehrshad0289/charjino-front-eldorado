"use client";

import { useState } from "react";

export function useCheckoutPreview() {
  const [ack, setAck] = useState(false);
  const [message, setMessage] = useState("");

  async function preview(selected) {
    const skuId = selected?.skuId;
    if (!skuId) {
      setMessage("پیشنهاد معتبری انتخاب نشده است.");
      return;
    }
    setMessage("");
    const response = await fetch("/api/checkout-preview", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        skuId,
        fields: { instantUseAck: ack },
      }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || payload?.success === false) {
      setMessage(payload?.message || "پیش‌نمایش خرید انجام نشد.");
      return;
    }
    const price = payload?.data?.price;
    setMessage(price ? `پیش‌نمایش ثبت شد؛ مبلغ ${price} تومان. سفارشی ساخته نشد.` : "پیش‌نمایش ثبت شد. سفارشی ساخته نشد.");
  }

  return { ack, setAck, message, preview };
}
