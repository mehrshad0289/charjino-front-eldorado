"use client";

import { useEffect, useState } from "react";
import { FA } from "./data/faCopy";

export function useCheckoutCoupon(skuId) {
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [needAuth, setNeedAuth] = useState(false);
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    setQuote(null);
    setError("");
    setNeedAuth(false);
  }, [skuId]);

  function setCode(value) {
    setInput(String(value || "").toUpperCase());
    setError("");
    setNeedAuth(false);
  }

  function clear() {
    setQuote(null);
    setError("");
    setNeedAuth(false);
  }

  async function apply() {
    const code = input.trim();
    if (!skuId) {
      setError(FA.couponNeedSku);
      return;
    }
    if (!code) {
      setError(FA.couponPlaceholder);
      return;
    }
    setBusy(true);
    setError("");
    setNeedAuth(false);
    try {
      const response = await fetch("/api/checkout/coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ code, skuId, quantity: 1 }),
      });
      const payload = await response.json().catch(() => ({}));
      if (response.status === 401 || payload?.error?.code === "UNAUTHENTICATED") {
        setQuote(null);
        setNeedAuth(true);
        setError(payload?.message || FA.couponNeedAuth);
        return;
      }
      if (!response.ok || payload?.success === false) {
        setQuote(null);
        setError(payload?.message || "کد تخفیف اعمال نشد.");
        return;
      }
      const data = payload?.data || {};
      setQuote({
        code: String(data.code || code).toUpperCase(),
        type: data.type || "",
        subtotalToman: Number(data.subtotalToman) || 0,
        discountToman: Number(data.discountToman) || 0,
        payableToman: Number(data.payableToman) || 0,
      });
    } catch {
      setQuote(null);
      setError("اتصال به سرور برقرار نشد.");
    } finally {
      setBusy(false);
    }
  }

  return { input, setCode, busy, error, needAuth, quote, apply, clear };
}
