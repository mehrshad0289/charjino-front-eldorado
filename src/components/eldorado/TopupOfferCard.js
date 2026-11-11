"use client";

import { useState } from "react";
import { GIFT_CARD_IMAGES } from "./data/giftCardData";
import { FA } from "./data/faCopy";
import { TOPUP_SHOP_CHROME } from "./data/giftShopCopy";
import { catalogRegionLabel } from "../../lib/catalog-region";
import { formatTomanPrice } from "../../lib/format-toman";
import CheckoutCouponField from "./CheckoutCouponField";
import { BoltIcon, ShieldIcon, SupportIcon, TrustRow } from "./TrustRows";

function Caret() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 8.5h16L12 17.5 4 8.5Z" fill="#14131a" stroke="#14131a" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="#6a667b" strokeWidth="1.6" />
      <path d="M12 11v5" stroke="#6a667b" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="7.6" r="1" fill="#6a667b" />
    </svg>
  );
}

function PayBadge({ src, alt }) {
  return (
    <span className="flex h-6 shrink-0 overflow-hidden">
      <img alt={alt} src={src} className="block h-6 w-9 object-cover align-middle" />
    </span>
  );
}

function fieldInputType(field) {
  const type = String(field.type || "text").toLowerCase();
  if (type === "password") return "password";
  if (type === "email") return "email";
  return "text";
}

function isSecretField(field) {
  const type = String(field.type || "").toLowerCase();
  const name = String(field.name || field.key || "").toLowerCase();
  return (
    type === "password" ||
    type === "email" ||
    name === "email" ||
    name === "account_password" ||
    name === "backup_code" ||
    name === "ea_id" ||
    name === "psn_id"
  );
}

export default function TopupOfferCard({
  selected = null,
  showRegion = false,
  deviceHeading = "",
  deviceValue = "",
  deliveryTime = "",
  deliverySteps = [],
  ack = false,
  onAckChange,
  message = "",
  onBuy,
  buyerFields = [],
  buyerValues = {},
  onBuyerFieldChange,
  coupon = null,
}) {
  const region = showRegion ? catalogRegionLabel(selected?.region) || selected?.region || "" : "";
  const deviceText = String(deviceValue || "").trim();
  const deviceTitle = String(deviceHeading || "").trim() || TOPUP_SHOP_CHROME.gameDevice;
  const price = selected?.from || "";
  const payable = coupon?.quote?.payableToman > 0 ? formatTomanPrice(coupon.quote.payableToman) : "";
  const displayPrice = payable || price;
  const hasSale = Boolean(selected?.discount && selected?.was);
  const fields = Array.isArray(buyerFields) ? buyerFields : [];
  const [guideOpen, setGuideOpen] = useState(false);
  const steps = Array.isArray(deliverySteps) ? deliverySteps.filter((step) => String(step || "").trim()) : [];
  const guideBody = steps.length
    ? ""
    : fields.length
      ? TOPUP_SHOP_CHROME.deliveryInstructionsWithId
      : TOPUP_SHOP_CHROME.deliveryInstructionsBody;
  const guideSteps = steps.length ? steps : TOPUP_SHOP_CHROME.deliveryInstructionsSteps;
  const timeLabel = String(deliveryTime || "").trim() || TOPUP_SHOP_CHROME.instant;

  return (
    <div className="relative bg-white lg:rounded-lg lg:shadow-[rgba(9,9,11,0.05)_0px_2px_4px_0px,rgba(9,9,11,0.02)_0px_12px_8px_0px]">
      <div className="hidden items-center ps-3 lg:flex">
        <div className="flex w-fit items-center gap-1 rounded-bl-lg rounded-br-lg bg-brand py-1 ps-2 pe-3">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="m12 2 2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 16.9l-6.1 3.5 1.5-6.8L2.2 9l6.9-.7L12 2Z"
              fill="#14131a"
            />
          </svg>
          <span className="block text-[12px] font-bold leading-[16.8px]">{FA.popular}</span>
        </div>
      </div>

      {deviceText ? (
        <div className="flex justify-between border-b border-cardborder px-4 pt-6 pb-3 lg:px-6">
          <span className="block font-bold">{deviceTitle}</span>
          <div className="flex items-center text-graytext">{deviceText}</div>
        </div>
      ) : region ? (
        <div className="flex justify-between border-b border-cardborder px-4 pt-6 pb-3 lg:px-6">
          <span className="block font-bold">{TOPUP_SHOP_CHROME.server}</span>
          <div className="flex items-center text-graytext">{region}</div>
        </div>
      ) : null}

      <div className="flex justify-between border-b border-cardborder px-4 py-3 lg:px-6">
        <span className="block font-bold">{TOPUP_SHOP_CHROME.deliveryTime}</span>
        <div className="flex items-center text-graytext">{timeLabel}</div>
      </div>
      <div className="border-b border-cardborder">
        <button
          type="button"
          aria-expanded={guideOpen}
          aria-controls="topup-delivery-guide"
          onClick={() => setGuideOpen((open) => !open)}
          className="flex w-full items-center justify-between px-4 py-3 text-start lg:px-6"
        >
          <span className="block font-bold">{TOPUP_SHOP_CHROME.deliveryInstructions}</span>
          <span className={`flex items-center transition-transform ${guideOpen ? "rotate-180" : ""}`}>
            <Caret />
          </span>
        </button>
        {guideOpen ? (
          <div id="topup-delivery-guide" className="px-4 pb-4 text-[14px] leading-[21px] text-graytext lg:px-6">
            {guideBody ? <p>{guideBody}</p> : null}
            <ol className={`${guideBody ? "mt-2" : ""} list-decimal space-y-1 ps-5`}>
              {guideSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        ) : null}
      </div>

      {fields.length > 0 ? (
        <div className="flex flex-col gap-3 border-b border-cardborder px-4 py-3 lg:px-6">
          {fields.map((raw) => {
            const field = raw && typeof raw === "object" ? raw : {};
            const name = String(field.name || field.key || "").trim();
            if (!name) return null;
            const label = String(field.label || name);
            const help = String(field.help || "").trim();
            const secret = isSecretField(field);
            return (
              <label key={name} className="block text-sm text-graytext">
                <span className="mb-1 block font-bold text-nav">{label}</span>
                <input
                  type={fieldInputType(field)}
                  name={name}
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  dir={secret ? "ltr" : undefined}
                  required={field.required !== false}
                  value={buyerValues?.[name] || ""}
                  onChange={(event) => onBuyerFieldChange?.(name, event.target.value)}
                  className={`min-h-10 w-full rounded-md border border-cardborder bg-white px-3 py-2 text-sm text-nav ${secret ? "text-left" : ""}`}
                />
                {help ? <span className="mt-1 block text-[12px] leading-[18px]">{help}</span> : null}
              </label>
            );
          })}
        </div>
      ) : null}

      <div className="flex flex-col items-start gap-1 px-4 py-3 lg:flex-row lg:items-end lg:justify-between lg:px-6">
        <div className="text-[16px] font-bold leading-[24px]">{TOPUP_SHOP_CHROME.total}</div>
        <div className="flex flex-col items-start lg:items-end">
          {displayPrice ? (
            hasSale || payable ? (
              <>
                <div className="flex items-center gap-2">
                  {hasSale ? (
                    <span className="block rounded-sm bg-[rgba(209,_240,_143,_0.2)] px-1 py-0.5 text-[12px] font-bold leading-[16.8px] text-[rgb(54,_117,_6)]">
                      {selected.discount}
                    </span>
                  ) : null}
                  <span className="block text-[20px] font-bold leading-[30px] text-[rgb(54,_117,_6)]">{displayPrice}</span>
                </div>
                {price && (payable || selected?.was) ? (
                  <div className="flex items-center gap-1">
                    <InfoIcon />
                    <span className="block text-[16px] leading-[24px] text-graytext line-through">
                      {payable ? price : selected.was}
                    </span>
                  </div>
                ) : null}
              </>
            ) : (
              <span className="block text-[20px] font-bold leading-[30px]">{displayPrice}</span>
            )
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-2 px-4 pb-4 lg:px-6">
        {selected?.instantUse ? (
          <label className="flex items-start gap-2 text-sm text-graytext">
            <input
              type="checkbox"
              className="mt-1"
              checked={Boolean(ack)}
              onChange={(event) => onAckChange?.(event.target.checked)}
            />
            <span>{FA.instantUseAck}</span>
          </label>
        ) : null}
        {selected ? <CheckoutCouponField coupon={coupon} disabled={!selected?.skuId} /> : null}
        {message ? <p className="text-sm text-graytext">{message}</p> : null}
        <button
          type="button"
          aria-label={TOPUP_SHOP_CHROME.buyNow}
          data-sku-id={selected?.skuId || undefined}
          className="block min-h-14 w-full rounded-lg bg-darkbtn px-4 py-3 text-center font-bold text-white"
          onClick={() => onBuy?.()}
        >
          <span className="block lg:hidden">
            {displayPrice ? `${TOPUP_SHOP_CHROME.buyNow} (${displayPrice})` : TOPUP_SHOP_CHROME.buyNow}
          </span>
          <span className="hidden lg:block">{TOPUP_SHOP_CHROME.buyNow}</span>
        </button>
      </div>

      <div className="flex flex-col gap-[14px] px-4 pb-5 lg:px-6 lg:pb-6">
        <TrustRow icon={<ShieldIcon />} label={TOPUP_SHOP_CHROME.moneyBack} note={TOPUP_SHOP_CHROME.moneyBackNote} />
        <TrustRow icon={<BoltIcon />} label={TOPUP_SHOP_CHROME.fastCheckout}>
          <span className="flex shrink-0 gap-1">
            <PayBadge src={GIFT_CARD_IMAGES.applePay} alt="Apple Pay" />
            <PayBadge src={GIFT_CARD_IMAGES.googlePay} alt="Google Pay" />
            <PayBadge src={GIFT_CARD_IMAGES.paypal} alt="PayPal" />
          </span>
        </TrustRow>
        <TrustRow icon={<SupportIcon />} label={TOPUP_SHOP_CHROME.liveSupport} note={TOPUP_SHOP_CHROME.liveSupportNote} />
      </div>
    </div>
  );
}
