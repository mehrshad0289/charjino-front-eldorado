import { GAME_PASS_FEATURED_OFFER } from "./data/gamePassData";

/* Seller info card (gamepass .make capture): white rounded card with the
   bold "Seller" heading (inside the card per the capture, desktop) — the
   live mobile flow shows the heading above the card on the page background,
   so below lg the heading renders externally via the `headingOutside`
   structure in the page. 48px round avatar, seller name + teal verified
   badge, then rating % + underlined reviews-count link. */

function VerifiedBadge() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="translate-y-[-1px]">
      <path
        d="M12 1.8 14.7 4l3.4-.4 1 3.3 2.9 1.9-1.3 3.2 1.3 3.2-2.9 1.9-1 3.3-3.4-.4L12 22.2 9.3 20l-3.4.4-1-3.3L2 15.2l1.3-3.2L2 8.8l2.9-1.9 1-3.3L9.3 4 12 1.8Z"
        fill="#00e4c9"
      />
      <path d="m8.4 12.2 2.4 2.4 4.8-5" stroke="#14131a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function GamePassSellerCard({ seller }) {
  const s = seller ?? GAME_PASS_FEATURED_OFFER.seller;
  return (
    <div className="rounded-lg bg-white p-4 shadow-[rgba(9,9,11,0.05)_0px_2px_4px_0px,rgba(9,9,11,0.02)_0px_12px_8px_0px] lg:p-6">
      <div className="flex flex-col gap-3">
        <div className="hidden font-bold lg:block">Seller</div>
        <div className="flex items-center gap-[10px]">
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full">
            <img alt={s.name} src={s.avatar} className="block h-12 w-12 object-cover align-middle" />
          </div>
          <div className="flex flex-col justify-center gap-[7px]">
            <div className="flex min-h-[14px] items-center gap-1 text-[14px] font-bold leading-[17px]">
              <span className="block">{s.name}</span>
              <VerifiedBadge />
            </div>
            <div className="flex min-h-[18px] items-center gap-1.5 text-[14px] leading-[17px] text-graytext">
              <span className="flex items-center gap-1 text-[rgb(0,_228,_201)]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
                  <path
                    d="M7 10.5v9M7 19.5H4.8A1.8 1.8 0 0 1 3 17.7v-5.4c0-1 .8-1.8 1.8-1.8H7m0 0 4.2-6.3a1.9 1.9 0 0 1 3.4 1.3l-.5 3.8h4.2c1.2 0 2.1 1.1 1.9 2.2l-1.1 5.6a2 2 0 0 1-2 1.6H7m0-9h3"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {s.rating}
              </span>
              <button type="button" className="ml-1 underline decoration-solid">
                {s.reviews} reviews
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
