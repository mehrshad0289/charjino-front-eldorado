"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { catalogCheckoutHref, saveCatalogCheckoutDraft } from "../../lib/catalog-checkout";
import { TOPUP_SHOP_CHROME } from "./data/giftShopCopy";

export function useCheckoutPreview() {
  const router = useRouter();
  const [ack, setAck] = useState(false);
  const [idAck, setIdAck] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function preview(selected, extraFields = {}, extra = {}) {
    const skuId = Number(selected?.skuId);
    if (!Number.isInteger(skuId) || skuId < 1) {
      setMessage("پیشنهاد معتبری انتخاب نشده است.");
      return;
    }
    if (selected?.needsIdAck && !idAck) {
      setMessage(TOPUP_SHOP_CHROME.idAckRequired);
      return;
    }
    setMessage("");
    setBusy(true);
    try {
      const fields = { ...extraFields };
      if (selected?.instantUse) fields.instantUseAck = ack;
      if (selected?.needsIdAck) fields.id_ack = "1";
      const response = await fetch("/api/checkout-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ skuId, fields }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || payload?.success === false) {
        setMessage(payload?.message || "پیش‌نمایش خرید انجام نشد.");
        return;
      }
      const couponCode = String(extra.couponCode || "").trim();
      const from = String(extra.from || "").trim();
      saveCatalogCheckoutDraft(skuId, {
        fields,
        couponCode,
        handle: selected.handle || "",
        from,
      });
      router.push(
        catalogCheckoutHref({
          skuId,
          handle: selected.handle,
          couponCode,
          from,
        }),
      );
    } catch {
      setMessage("اتصال به سرور برقرار نشد.");
    } finally {
      setBusy(false);
    }
  }

  return { ack, setAck, idAck, setIdAck, message, setMessage, preview, busy };
}
