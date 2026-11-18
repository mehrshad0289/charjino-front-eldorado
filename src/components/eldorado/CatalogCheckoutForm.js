"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  catalogOrderHref,
  catalogRequirements,
  catalogVisibleInputFields,
  checkoutIdempotencyKey,
  isCatalogAckValue,
  missingRequiredCatalogField,
  readCatalogCheckoutDraft,
} from "../../lib/catalog-checkout";
import { completeMockPayment, createCheckoutOrder, startOrderPayment } from "../../actions/checkout.actions";
import { formatTomanInWords } from "../../lib/price";
import { formatTomanPrice } from "../../lib/format-toman";
import { TOPUP_SHOP_CHROME } from "./data/giftShopCopy";
import { useCheckoutCoupon } from "./useCheckoutCoupon";
import CatalogBuyerFields from "./CatalogBuyerFields";
import CheckoutCouponField from "./CheckoutCouponField";
import LoadingSpinner from "./LoadingSpinner";

export default function CatalogCheckoutForm({
  skuId,
  loggedIn,
  next,
  price = 0,
  couponCode = "",
  needsIdAck = false,
  inputFields = [],
}) {
  const router = useRouter();
  const [accepted, setAccepted] = useState(false);
  const [idAck, setIdAck] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [draftFields, setDraftFields] = useState({});
  const payKeyRef = useRef("");
  const coupon = useCheckoutCoupon(skuId);
  const buyerFields = useMemo(
    () => catalogVisibleInputFields(inputFields, draftFields),
    [inputFields, draftFields],
  );

  useEffect(() => {
    const draft = readCatalogCheckoutDraft(skuId);
    const fields = { ...draft.fields };
    setIdAck(isCatalogAckValue(fields.id_ack ?? fields.idAck));
    setDraftFields(fields);
    const code = String(couponCode || draft.couponCode || "").trim();
    if (code) coupon.setCode(code);
  }, [skuId, couponCode]);

  const totals = useMemo(() => {
    const payable = coupon?.quote?.payableToman > 0 ? coupon.quote.payableToman : Number(price) || 0;
    const discount = coupon?.quote?.discountToman > 0 ? coupon.quote.discountToman : 0;
    const subtotal = coupon?.quote?.subtotalToman > 0 ? coupon.quote.subtotalToman : payable + discount;
    return { payable, discount, subtotal };
  }, [coupon?.quote, price]);

  async function onSubmit(event) {
    event.preventDefault();
    if (!accepted) {
      setMessage("برای ادامه، شرایط خرید را بپذیر.");
      return;
    }
    const missing = missingRequiredCatalogField(buyerFields, draftFields);
    if (missing) {
      setMessage(`${missing} را وارد کن.`);
      return;
    }
    if (needsIdAck && !idAck) {
      setMessage(TOPUP_SHOP_CHROME.idAckRequired);
      return;
    }
    if (!loggedIn) {
      router.push(`/login?next=${encodeURIComponent(next)}`);
      return;
    }
    setLoading(true);
    setMessage("");
    const key = payKeyRef.current || checkoutIdempotencyKey();
    payKeyRef.current = key;
    const created = await createCheckoutOrder(
      skuId,
      catalogRequirements(draftFields, { idAck: needsIdAck }),
      key,
      1,
      { couponCode: coupon.quote?.code || coupon.input || "" },
    );
    if (created.unauthorized) {
      setLoading(false);
      router.push(`/login?next=${encodeURIComponent(next)}`);
      return;
    }
    if (!created.ok) {
      payKeyRef.current = "";
      setLoading(false);
      setMessage(created.message || "ثبت سفارش انجام نشد.");
      return;
    }
    const pay = await startOrderPayment(created.data.number, window.location.origin);
    if (pay.unauthorized) {
      setLoading(false);
      router.push(`/login?next=${encodeURIComponent(next)}`);
      return;
    }
    if (!pay.ok) {
      setLoading(false);
      setMessage(
        `${pay.message || "پرداخت شروع نشد."} شماره سفارش: ${created.data.number}. از سفارش‌های خرید ادامه بده.`,
      );
      return;
    }
    if (pay.data?.provider === "mock") {
      const done = await completeMockPayment(pay.data.authority);
      if (!done.ok) {
        setLoading(false);
        setMessage(done.message || "پرداخت آزمایشی ثبت نشد.");
        return;
      }
      window.location.href = `${catalogOrderHref(done.data.number)}?payment=success`;
      return;
    }
    if (pay.data?.redirectUrl) {
      window.location.href = pay.data.redirectUrl;
      return;
    }
    if (created.data?.number) {
      window.location.href = catalogOrderHref(created.data.number);
      return;
    }
    setLoading(false);
    setMessage("سفارش ساخته شد ولی آدرس پرداخت نیامد.");
  }

  return (
    <form onSubmit={onSubmit} className="rounded-lg bg-white p-6 shadow-[rgba(9,9,11,0.05)_0px_2px_4px_0px]">
      {buyerFields.length > 0 ? (
        <CatalogBuyerFields
          fields={buyerFields}
          values={draftFields}
          onChange={(name, value) => setDraftFields((prev) => ({ ...prev, [name]: value }))}
          className="mb-5 flex flex-col gap-3"
        />
      ) : null}
      <CheckoutCouponField coupon={coupon} disabled={!skuId || loading} />
      <dl className="mb-5 space-y-2 text-[14px]">
        <div className="flex items-center justify-between gap-3">
          <dt className="text-graytext">قیمت کالا</dt>
          <dd className="font-bold">{formatTomanInWords(totals.subtotal) || formatTomanPrice(totals.subtotal) || "—"}</dd>
        </div>
        {totals.discount > 0 ? (
          <div className="flex items-center justify-between gap-3">
            <dt className="text-graytext">تخفیف</dt>
            <dd>{formatTomanInWords(totals.discount)}</dd>
          </div>
        ) : null}
        <div className="flex items-center justify-between gap-3 border-t border-cardborder pt-2">
          <dt className="font-bold">جمع پرداختی</dt>
          <dd className="text-[18px] font-bold">{formatTomanInWords(totals.payable) || "—"}</dd>
        </div>
      </dl>
      <label className="flex items-start gap-3 text-[14px] leading-[22px]">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(event) => setAccepted(event.target.checked)}
          className="mt-1"
        />
        <span>شرایط خرید را خوانده‌ام و پرداخت را تأیید می‌کنم.</span>
      </label>
      {needsIdAck ? (
        <label className="mt-3 flex items-start gap-3 text-[14px] leading-[22px]">
          <input
            type="checkbox"
            checked={idAck}
            onChange={(event) => setIdAck(event.target.checked)}
            className="mt-1"
          />
          <span>{TOPUP_SHOP_CHROME.idAckLabel}</span>
        </label>
      ) : null}
      {message ? <p className="mt-3 text-[14px] text-red-600">{message}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="mt-5 block w-full rounded-lg bg-darkbtn py-3 text-[16px] font-bold text-white disabled:opacity-60"
      >
        {loading ? (
          <LoadingSpinner variant="inline" className="text-white" />
        ) : loggedIn ? (
          "پرداخت امن"
        ) : (
          "ورود و ادامه خرید"
        )}
      </button>
    </form>
  );
}
