import { GIFT_CARD_IMAGES } from "./data/giftCardData";
import { BoltIcon, ShieldIcon, SupportIcon, TrustRow } from "./TrustRows";

/* Offer card — right sidebar on desktop, below the steps on mobile
   (giftcard .make capture + live @390): white card with icon + "Gift Card"
   header, dark full-width "Buy now" button and three reassurance rows
   (blue icon + bold label + gray note). Row 2 carries the fast-checkout
   payment badges from the capture. Icons/rows live in TrustRows.js
   (shared with the game pass featured-offer card). */

function PayBadge({ src, alt }) {
  return (
    <span className="flex h-6 shrink-0 overflow-hidden">
      <img alt={alt} src={src} className="block h-6 w-9 object-cover align-middle" />
    </span>
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
            <PayBadge src={GIFT_CARD_IMAGES.applePay} alt="Apple Pay" />
            <PayBadge src={GIFT_CARD_IMAGES.googlePay} alt="Google Pay" />
            <PayBadge src={GIFT_CARD_IMAGES.paypal} alt="PayPal" />
          </span>
        </TrustRow>
        <TrustRow icon={<SupportIcon />} label="24/7 Live Support" note="We're always here to help" />
      </div>
    </div>
  );
}
