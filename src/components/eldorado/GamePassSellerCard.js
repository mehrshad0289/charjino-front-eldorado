import { GAME_PASS_FEATURED_OFFER } from "./data/gamePassData";

/* Seller info card (gamepass .make capture): white rounded card with the
   bold "Seller" heading, 48px round avatar, seller name + teal verified
   badge, then rating % + underlined reviews-count link. Shown under the
   featured offer in the desktop sidebar and in the mobile flow. */

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
        <div className="font-bold">Seller</div>
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
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M12 1.8 14.7 4l3.4-.4 1 3.3 2.9 1.9-1.3 3.2 1.3 3.2-2.9 1.9-1 3.3-3.4-.4L12 22.2 9.3 20l-3.4.4-1-3.3L2 15.2l1.3-3.2L2 8.8l2.9-1.9 1-3.3L9.3 4 12 1.8Z"
                    fill="currentColor"
                  />
                  <path
                    d="m8.4 12.2 2.4 2.4 4.8-5"
                    stroke="#14131a"
                    strokeWidth="1.8"
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
