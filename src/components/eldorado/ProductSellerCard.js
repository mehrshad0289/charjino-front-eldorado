import { PRODUCT_SELLER } from "./data/productData";

/* Seller card.
   Desktop (product .make capture): white card — 48px round avatar + name +
   teal verified badge + "99.6% positive feedback" underlined link + teal
   thumbs-up; hairline-bordered rows (teal Online dot, "2,699 orders
   delivered", "Selling since Mar 31, 2026" with gray icons); light-blue
   "Verified ID" chip with blue shield icon.
   Mobile (live @390): compact card — gray "Seller" label above (rendered by
   the page), avatar + name + badge, then teal thumbs + "99.6%" +
   "2,701 reviews" underlined link (live wording/number). */

function VerifiedBadge() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
      <path
        d="M12 1.8 14.7 4l3.4-.4 1 3.3 2.9 1.9-1.3 3.2 1.3 3.2-2.9 1.9-1 3.3-3.4-.4L12 22.2 9.3 20l-3.4.4-1-3.3L2 15.2l1.3-3.2L2 8.8l2.9-1.9 1-3.3L9.3 4 12 1.8Z"
        fill="#00e4c9"
      />
      <path d="m8.4 12.2 2.4 2.4 4.8-5" stroke="#14131a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ThumbsUp({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 10.5v9M7 19.5H4.8A1.8 1.8 0 0 1 3 17.7v-5.4c0-1 .8-1.8 1.8-1.8H7m0 0V10.5m0 0 3.8-6.2a1.9 1.9 0 0 1 3.5 1v3.2h4.2a1.8 1.8 0 0 1 1.8 2.1l-1.1 6.4a1.8 1.8 0 0 1-1.8 1.5H7"
        stroke="#00e4c9"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GrayIcon({ kind }) {
  return kind === "orders" ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="4" width="14" height="17" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9 9h6M9 13h6M9 17h3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="5.5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 10h16M8.5 3.5v3.5M15.5 3.5v3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export default function ProductSellerCard({ seller }) {
  const s = seller || PRODUCT_SELLER;
  const avatar = s.avatar ? (
    <img alt={s.name} src={s.avatar} className="block h-12 w-12 object-cover align-middle" />
  ) : (
    <span className="flex h-12 w-12 items-center justify-center bg-badgebg text-[16px] font-bold">{(s.name || "ف").slice(0, 1)}</span>
  );
  return (
    <>
      {/* mobile compact card (live @390) */}
      <div className="rounded-lg bg-white p-4 shadow-[rgba(9,9,11,0.05)_0px_2px_4px_0px,rgba(9,9,11,0.02)_0px_12px_8px_0px] lg:hidden">
        <div className="flex items-center gap-[10px]">
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full">
            {avatar}
          </div>
          <div className="flex flex-col justify-center gap-[7px]">
            <div className="flex items-center gap-1 text-[14px] font-bold leading-[17px]">
              <span className="block">{s.name}</span>
              <VerifiedBadge />
            </div>
            <div className="flex items-center gap-1.5 text-[14px] leading-[17px]">
              <ThumbsUp />
              <span className="font-bold">{s.feedback}</span>
              <span className="ms-1 underline decoration-solid">{s.reviews || "2,701 reviews"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* desktop capture card */}
      <div className="hidden rounded-lg bg-white shadow-[rgba(9,9,11,0.05)_0px_2px_4px_0px,rgba(9,9,11,0.02)_0px_12px_8px_0px] lg:block">
        <div className="flex items-center gap-[12px] px-6 pb-4 pt-6">
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full">
            {avatar}
          </div>
          <div className="grow">
            <div className="flex items-center gap-1 font-bold">
              <span className="block">{s.name}</span>
              <VerifiedBadge />
            </div>
            <div className="mt-[4px] flex items-center gap-1 text-[14px] leading-[19.6px]">
              <ThumbsUp />
              <button type="button" className="ml-[4px] text-[14px] underline decoration-solid text-linkblue">
                {s.feedbackNote || `${s.feedback} positive feedback`}
              </button>
            </div>
          </div>
        </div>
        <div className="grid gap-[12px] border-y-[0.8px] border-cardborder px-6 py-4 text-[14px] leading-[19.6px]">
          {s.online ? (
            <div className="flex items-center gap-[8px]">
              <span className="m-[3px] block h-[10px] w-[10px] rounded-full bg-[rgb(0,_228,_201)]" aria-hidden="true" />
              <span className="block">{s.online}</span>
            </div>
          ) : null}
          {s.orders ? (
            <div className="flex items-center gap-[8px]">
              <span className="text-graytext">
                <GrayIcon kind="orders" />
              </span>
              <span className="block">{s.orders}</span>
            </div>
          ) : null}
          {s.sellingSince ? (
            <div className="flex items-center gap-[8px]">
              <span className="text-graytext">
                <GrayIcon kind="since" />
              </span>
              <span className="block">{s.sellingSince}</span>
            </div>
          ) : null}
        </div>
        <div className="flex gap-[8px] px-6 pb-6 pt-4">
          <div className="flex w-fit items-center gap-[8px] rounded-lg bg-[rgba(71,131,255,0.12)] px-3 py-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 3 5 5.8v5.4c0 4.3 2.9 7.4 7 8.8 4.1-1.4 7-4.5 7-8.8V5.8L12 3Z" stroke="#4783ff" strokeWidth="1.8" strokeLinejoin="round" />
              <path d="m9 11.8 2.1 2.1 4-4.2" stroke="#4783ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="block text-[14px] font-bold leading-[19.6px]">{s.verifiedChip}</span>
          </div>
        </div>
      </div>
    </>
  );
}
