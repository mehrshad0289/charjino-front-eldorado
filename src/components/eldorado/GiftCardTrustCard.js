import { GIFT_CARD_IMAGES, GIFT_CARD_TRUST_ROWS } from "./data/giftCardData";

/* "Why trust Eldorado?" card (giftcard .make capture): white rounded-2xl
   card with a decorative top background image, bold title + gray subtitle,
   then a 2-column checklist with hairline dividers (single column on
   mobile per live @390). Check icons are the capture's own SVG asset. */

export default function GiftCardTrustCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-cardborder bg-white px-5 pb-6 pt-6">
      <img
        alt=""
        src={GIFT_CARD_IMAGES.trustBackdrop}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 block h-auto w-full max-w-full object-cover object-top"
      />
      <div className="relative mb-6">
        <div className="mb-2 text-[24px] font-bold leading-[normal]">Why trust Eldorado?</div>
        <div className="text-graytext">From start to finish, your purchase experience is supervised and safe</div>
      </div>
      <div className="relative grid grid-cols-1 gap-x-8 md:grid-cols-2">
        {GIFT_CARD_TRUST_ROWS.map((row, i) => (
          <div
            key={row}
            className={`flex items-center gap-2 border-b border-cardborder py-[15px] ${
              i === 0 ? "border-t" : ""
            } ${i === 1 ? "md:border-t-0" : ""}`}
          >
            <div className="h-[18px] shrink-0 overflow-hidden">
              <img
                alt=""
                src={GIFT_CARD_IMAGES.check}
                className="block h-[18px] w-[18px] object-cover align-middle"
              />
            </div>
            <div className="text-[16px] leading-[27px] md:text-[18px]">{row}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
