import { GAME_PASS_FEATURED_OFFER, GAME_PASS_IMAGES } from "./data/gamePassData";
import { BoltIcon, ShieldIcon, SupportIcon, TrustRow } from "./TrustRows";

/* Featured "Popular" offer card (gamepass .make capture + live sidebar
   @1920 / stacked flow @390): yellow Popular ribbon, "Delivery time" +
   "Delivery instructions" rows, Total block (strike, discount badge, green
   price), dark full-width Buy now and the three reassurance rows.
   Mobile: flush white continuation of the steps column (no shadow, rounded
   bottom); desktop: standalone shadowed card in the 400px sidebar.
   The capture's quantity-picker row is NOT rendered — the live page has no
   quantity stepper (probed 2026-11-04); live is the design authority. */

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

      <div className="flex items-end justify-between px-4 py-3 lg:px-6">
        <div className="text-[16px] font-bold leading-[24px]">Total</div>
        <div className="flex flex-col items-end">
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

      <div className="px-4 pb-4 lg:px-6">
        <button
          type="button"
          aria-label="Buy now"
          className="block min-h-14 w-full rounded-lg bg-darkbtn px-4 py-3 text-center font-bold text-white"
        >
          <span className="block lg:hidden">Buy now ({total.price})</span>
          <span className="hidden lg:block">Buy now</span>
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
