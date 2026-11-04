import { useState } from "react";
import { GAME_PASS_FEATURED_OFFER, GAME_PASS_IMAGES } from "./data/gamePassData";
import { BoltIcon, ShieldIcon, SupportIcon, TrustRow } from "./TrustRows";

/* Featured "Popular" offer card (gamepass .make capture + live sidebar
   @1920 / stacked flow @390): yellow Popular ribbon, "Delivery time" +
   "Delivery instructions" rows, quantity stepper + "In stock: 5" (capture
   AND live 2026-11-04 re-probe — the session-9 drop is reverted), Total
   block (strike, discount badge, green price), dark full-width Buy now +
   light "Add to cart" (live addition, not in the capture) and the three
   reassurance rows.
   Mobile: flush white continuation of the steps column (no shadow, rounded
   bottom), the Total block renders left-aligned without the "Total" label
   (live @390); desktop keeps the label + right price column (capture). */

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

export default function GamePassFeaturedOffer() {
  const { deliveryTime, total } = GAME_PASS_FEATURED_OFFER;
  const [qty, setQty] = useState(1);
  return (
    <div className="relative bg-white lg:rounded-lg lg:shadow-[rgba(9,9,11,0.05)_0px_2px_4px_0px,rgba(9,9,11,0.02)_0px_12px_8px_0px]">
      {/* Popular ribbon (live @1920: pill overlapping the top edge; the
          live mobile flow keeps the ribbon only on the selected variant
          card, so it is hidden below lg here) */}
      <div className="absolute -top-3 left-0 z-[2] hidden items-center gap-1 rounded-md bg-brand py-1 pl-2 pr-2.5 shadow-[rgba(9,9,11,0.05)_0px_2px_4px_0px] lg:flex">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="m12 2 2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 16.9l-6.1 3.5 1.5-6.8L2.2 9l6.9-.7L12 2Z"
            fill="#14131a"
          />
        </svg>
        <span className="block text-[12px] font-bold leading-[16.8px]">Popular</span>
      </div>

      <div className="flex justify-between border-b border-cardborder px-4 py-3 lg:px-6">
        <span className="block font-bold">Delivery time</span>
        <div className="flex items-center text-graytext">{deliveryTime}</div>
      </div>
      {/* no open state exists in any reference — the row stays static */}
      <div className="flex justify-between border-b border-cardborder px-4 py-3 lg:px-6">
        <span className="block font-bold">Delivery instructions</span>
        <span className="flex items-center">
          <Caret />
        </span>
      </div>

      {/* quantity stepper + stock note (capture rows: 42px minus / input /
          plus boxes on rgb(239,239,241), rounded-sm; "In stock: 5" below) */}
      <div className="border-b border-cardborder px-4 py-3 lg:px-6">
        <div className="flex h-[42px] items-center gap-[10px]">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="flex h-full w-[42px] shrink-0 items-center justify-center rounded-sm bg-[rgb(239,_239,_241)] text-[24px] leading-[36px] text-ink/50"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <input
            type="text"
            aria-label="Quantity picker field"
            value={qty}
            readOnly
            className="block h-full min-w-0 grow rounded-sm bg-[rgb(239,_239,_241)] pt-2 pb-2 pl-3 pr-3 text-center"
          />
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQty((q) => Math.min(5, q + 1))}
            className="flex h-full w-[42px] shrink-0 items-center justify-center rounded-sm bg-[rgb(239,_239,_241)] text-[24px] leading-[36px] text-ink"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="pt-2 text-[14px] leading-[19.6px] text-graytext">In stock: 5</div>
      </div>

      {/* Total: mobile = left-aligned stack without the label (live @390);
          desktop = label + right column (capture) */}
      <div className="flex flex-col items-start px-4 py-3 lg:flex-row lg:items-end lg:justify-between lg:px-6">
        <div className="hidden text-[16px] font-bold leading-[24px] lg:block">Total</div>
        <div className="flex flex-col items-start lg:items-end">
          <div className="text-[16px] leading-[24px] text-graytext line-through">{total.was}</div>
          <div className="flex items-center gap-2">
            <InfoIcon />
            <span className="rounded-sm bg-[rgba(209,_240,_143,_0.2)] px-1 py-0.5 text-[12px] font-bold leading-[16.8px] text-[rgb(54,_117,_6)]">
              {total.discount}
            </span>
            <span className="text-[24px] font-bold leading-[30px] text-[rgb(54,_117,_6)]">{total.price}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 px-4 pb-4 lg:px-6">
        <button
          type="button"
          aria-label="Buy now"
          className="block min-h-14 w-full rounded-lg bg-darkbtn px-4 py-3 text-center font-bold text-white"
        >
          <span className="block">Buy now</span>
        </button>
        {/* live 2026-11-04: light secondary button under Buy now (not in
            the capture — styled from the live probe: light fill, dark bold
            label, same 56px height) */}
        <button
          type="button"
          aria-label="Add to cart"
          className="block min-h-14 w-full rounded-lg bg-[rgb(244,_244,_245)] px-4 py-3 text-center font-bold text-ink"
        >
          <span className="block">Add to cart</span>
        </button>
      </div>

      <div className="flex flex-col gap-[14px] px-4 pb-5 lg:px-6 lg:pb-6">
        <TrustRow icon={<ShieldIcon />} label="Money-back guarantee" note="Protected by TradeShield" />
        <TrustRow icon={<BoltIcon />} label="Fast checkout options">
          <span className="flex shrink-0 gap-1">
            <span className="flex h-6 shrink-0 overflow-hidden">
              <img alt="Apple Pay" src={GAME_PASS_IMAGES.applePay} className="block h-6 w-9 object-cover align-middle" />
            </span>
            <span className="flex h-6 shrink-0 overflow-hidden">
              <img alt="Google Pay" src={GAME_PASS_IMAGES.googlePay} className="block h-6 w-9 object-cover align-middle" />
            </span>
            <span className="flex h-6 shrink-0 overflow-hidden">
              <img alt="PayPal" src={GAME_PASS_IMAGES.paypal} className="block h-6 w-9 object-cover align-middle" />
            </span>
          </span>
        </TrustRow>
        <TrustRow icon={<SupportIcon />} label="24/7 live support" note="We're always here to help" />
      </div>
    </div>
  );
}
