import { GIFT_CARD_IMAGES } from "./data/giftCardData";

/* Offer card — right sidebar on desktop, below the steps on mobile
   (giftcard .make capture + live @390): white card with icon + "Gift Card"
   header, dark full-width "Buy now" button and three reassurance rows
   (blue icon + bold label + gray note). Row 2 carries the fast-checkout
   payment badges from the capture. */

function ShieldIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3 5 5.8v5.4c0 4.3 2.9 7.4 7 8.8 4.1-1.4 7-4.5 7-8.8V5.8L12 3Z"
        stroke="#4783ff"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="m9 11.8 2.1 2.1 4-4.2" stroke="#4783ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M13.5 3 6 13.5h4.5L10 21l7.5-10.5H13L13.5 3Z" fill="#4783ff" />
    </svg>
  );
}

function SupportIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12a7 7 0 0 1 14 0"
        stroke="#4783ff"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <rect x="3.5" y="12" width="3.4" height="6" rx="1.7" fill="#4783ff" />
      <rect x="17.1" y="12" width="3.4" height="6" rx="1.7" fill="#4783ff" />
      <path d="M19 18a4 4 0 0 1-4 2.6" stroke="#4783ff" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function TrustRow({ icon, label, note, children }) {
  return (
    <div className="flex gap-2 text-[14px] leading-[21px]">
      <div className="shrink-0 text-[#4783ff]">{icon}</div>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <div className="font-bold">{label}</div>
        {children}
        {note && <div className="text-graytext">{note}</div>}
      </div>
    </div>
  );
}

export default function GiftCardOfferCard() {
  return (
    <div className="rounded-lg bg-white shadow-[rgba(9,9,11,0.05)_0px_2px_4px_0px,rgba(9,9,11,0.02)_0px_12px_8px_0px]">
      <div className="flex items-center gap-[10px] border-b border-cardborder px-6 py-[14px]">
        <div className="h-9 shrink-0 overflow-hidden rounded-md">
          <img
            alt="Gift Card"
            src={GIFT_CARD_IMAGES.offerIcon}
            className="block h-9 w-9 object-cover align-middle"
          />
        </div>
        <div aria-label="gift-card-offer-title" className="font-bold">
          Gift Card
        </div>
      </div>
      <div className="px-6 pb-5 pt-[14px]">
        <button
          type="button"
          aria-label="Buy now"
          className="block min-h-14 w-full rounded-lg bg-darkbtn px-4 py-3 text-center font-bold text-white"
        >
          <span className="flex items-center justify-center gap-1.5">
            <span className="block">Buy now</span>
          </span>
        </button>
      </div>
      <div className="flex flex-col gap-[14px] px-6 pb-6">
        <TrustRow icon={<ShieldIcon />} label="Money-back Guarantee" note="Protected by TradeShield" />
        <TrustRow icon={<BoltIcon />} label="Fast Checkout Options">
          <span className="flex shrink-0 gap-1">
            <span className="flex h-6 shrink-0 overflow-hidden">
              <img alt="Apple Pay" src={GIFT_CARD_IMAGES.applePay} className="block h-6 w-9 object-cover align-middle" />
            </span>
            <span className="flex h-6 shrink-0 overflow-hidden">
              <img alt="Google Pay" src={GIFT_CARD_IMAGES.googlePay} className="block h-6 w-9 object-cover align-middle" />
            </span>
            <span className="flex h-6 shrink-0 overflow-hidden">
              <img alt="PayPal" src={GIFT_CARD_IMAGES.paypal} className="block h-6 w-9 object-cover align-middle" />
            </span>
          </span>
        </TrustRow>
        <TrustRow icon={<SupportIcon />} label="24/7 Live Support" note="We're always here to help" />
      </div>
    </div>
  );
}
