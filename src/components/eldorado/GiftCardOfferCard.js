"use client";

import { GIFT_CARD_IMAGES } from "./data/giftCardData";
import { GIFT_SHOP_CHROME } from "./data/giftShopCopy";
import { FA } from "./data/faCopy";
import { catalogRegionLabel } from "../../lib/catalog-region";
import { BoltIcon, ShieldIcon, SupportIcon, TrustRow } from "./TrustRows";

/* Gift-card offer sidebar: live Eldorado gift shop (product img + amount
   title, then Region / Delivery time Instant / Warranty / price / Buy now)
   plus the clone capture's three reassurance rows. */

function PayBadge({ src, alt }) {
  return (
    <span className="flex h-6 shrink-0 overflow-hidden">
      <img alt={alt} src={src} className="block h-6 w-9 object-cover align-middle" />
    </span>
  );
}

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 11v5.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="7.6" r="1.15" fill="currentColor" />
    </svg>
  );
}

function InstantBolt() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M13.5 3 6 13.5h4.5L10 21l7.5-10.5H13L13.5 3Z" fill="currentColor" />
    </svg>
  );
}

const buyClassName =
  "block min-h-14 w-full rounded-lg bg-darkbtn px-4 py-3 text-center font-bold text-white";

export default function GiftCardOfferCard({
  selected = null,
  title = GIFT_SHOP_CHROME.giftCard,
  productIcon = "",
  buyLabel = GIFT_SHOP_CHROME.buyNow,
  moneyBack = GIFT_SHOP_CHROME.moneyBack,
  moneyBackNote = GIFT_SHOP_CHROME.moneyBackNote,
  fastCheckout = GIFT_SHOP_CHROME.fastCheckout,
  liveSupport = GIFT_SHOP_CHROME.liveSupport,
  liveSupportNote = GIFT_SHOP_CHROME.liveSupportNote,
  ack = false,
  onAckChange,
  message = "",
  onBuy,
}) {
  const heading = selected ? selected.name || selected.label || title : title;
  const icon = selected?.img || productIcon;
  const region = catalogRegionLabel(selected?.region) || selected?.region || "";
  const price = selected?.from || "";

  return (
    <div className="mb-3 rounded-lg bg-white shadow-[rgba(9,9,11,0.05)_0px_2px_4px_0px,rgba(9,9,11,0.02)_0px_12px_8px_0px] md:mb-4">
      <div className="flex items-center gap-[10px] border-b border-cardborder px-2.5 py-3 md:px-6 md:py-3">
        {icon ? (
          <div className="inline-block h-7 shrink-0 overflow-hidden rounded-md">
            <img alt={heading} src={icon} className="block h-7 w-7 object-cover align-middle" />
          </div>
        ) : (
          <span className="block h-7 w-7 shrink-0 rounded-md bg-badgebg" />
        )}
        <div aria-label="gift-card-offer-title" className="text-base font-bold">
          {heading}
        </div>
      </div>

      {selected ? (
        <>
          <div className="block px-3.5 pt-3 text-sm font-bold md:hidden">{GIFT_SHOP_CHROME.deliveryInstructions}</div>
          <p className="mb-4 block px-3.5 py-3 text-base text-graytext md:hidden">
            {GIFT_SHOP_CHROME.deliveryInstructionsBody}
          </p>
          {region ? (
            <div className="flex justify-between px-3.5 py-2.5 md:px-6 md:py-3">
              <span className="text-graytext">{GIFT_SHOP_CHROME.region}</span>
              <span className="font-bold">{region}</span>
            </div>
          ) : null}
          <div className="flex justify-between border-y border-cardborder px-3.5 py-3 md:px-6 md:py-3.5">
            <div className="flex items-center gap-1 text-graytext">
              <span>{GIFT_SHOP_CHROME.deliveryTime}</span>
              <span className="text-graytext">
                <InfoIcon />
              </span>
            </div>
            <div className="flex items-center gap-[6px] font-bold">
              <span className="text-metaicon">
                <InstantBolt />
              </span>
              <span>{GIFT_SHOP_CHROME.instant}</span>
            </div>
          </div>
          <div className="flex justify-between border-b border-cardborder px-3.5 py-2.5 md:px-6 md:py-3">
            <div className="flex items-center gap-1 text-graytext">
              <span>{GIFT_SHOP_CHROME.warranty}</span>
              <span className="text-graytext">
                <InfoIcon />
              </span>
            </div>
            <span className="font-bold">{GIFT_SHOP_CHROME.warrantyValue}</span>
          </div>
          {price ? (
            <div className="flex px-3.5 py-2.5 text-[20px] font-bold md:px-6 md:pb-3">
              <span>{price}</span>
            </div>
          ) : null}
        </>
      ) : null}

      <div className={selected ? "px-3.5 pb-5 md:px-6" : "px-6 pb-5 pt-[14px]"}>
        {selected?.instantUse ? (
          <label className="mb-3 flex items-start gap-2 text-sm text-graytext">
            <input
              type="checkbox"
              className="mt-1"
              checked={Boolean(ack)}
              onChange={(event) => onAckChange?.(event.target.checked)}
            />
            <span>{FA.instantUseAck}</span>
          </label>
        ) : null}
        {message ? <p className="mb-3 text-sm text-graytext">{message}</p> : null}
        <button
          type="button"
          aria-label={buyLabel}
          data-sku-id={selected?.skuId || undefined}
          className={buyClassName}
          onClick={() => onBuy?.()}
        >
          <span className="flex items-center justify-center gap-1.5">
            <span className="block">{buyLabel}</span>
          </span>
        </button>
      </div>
      <div className="flex flex-col gap-[14px] px-4 pb-4 sm:px-6 sm:pb-6">
        <TrustRow icon={<ShieldIcon />} label={moneyBack} note={moneyBackNote} />
        <TrustRow icon={<BoltIcon />} label={fastCheckout}>
          <span className="flex shrink-0 gap-1">
            <PayBadge src={GIFT_CARD_IMAGES.applePay} alt="Apple Pay" />
            <PayBadge src={GIFT_CARD_IMAGES.googlePay} alt="Google Pay" />
            <PayBadge src={GIFT_CARD_IMAGES.paypal} alt="PayPal" />
          </span>
        </TrustRow>
        <TrustRow icon={<SupportIcon />} label={liveSupport} note={liveSupportNote} />
      </div>
    </div>
  );
}
