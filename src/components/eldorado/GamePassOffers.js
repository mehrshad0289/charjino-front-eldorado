"use client";

import { useState } from "react";
import {
  GAME_PASS_OTHER_SELLERS,
  GAME_PASS_OTHER_SELLERS_COUNT,
  GAME_PASS_OTHER_SELLERS_PAGES,
} from "./data/gamePassData";

/* "Other sellers" list + pagination (gamepass .make capture + live probes).
   Desktop row (md+): the capture's 5-column grid
   [seller 0.7fr | delivery 0.3fr | price 120px | Buy now | instructions].
   Mobile (live @390): white card — seller block left, strike + discounted
   price + clock delivery right, then a full-width Delivery instructions
   row and a full-width outlined Buy now button. Pagination: arrows + page
   buttons (md+) + "Go to page" single-select dropdown. */

function VerifiedBadge({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className="translate-y-[-1px]">
      <path
        d="M12 1.8 14.7 4l3.4-.4 1 3.3 2.9 1.9-1.3 3.2 1.3 3.2-2.9 1.9-1 3.3-3.4-.4L12 22.2 9.3 20l-3.4.4-1-3.3L2 15.2l1.3-3.2L2 8.8l2.9-1.9 1-3.3L9.3 4 12 1.8Z"
        fill="#00e4c9"
      />
      <path d="m8.4 12.2 2.4 2.4 4.8-5" stroke="#14131a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Caret({ open }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
    >
      <path d="M4 8.5h16L12 17.5 4 8.5Z" fill="#14131a" stroke="#14131a" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="#6a667b" strokeWidth="1.6" />
      <path d="M12 7.5V12l3 2" stroke="#6a667b" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Arrow({ dir }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={dir === "left" ? "m14 6-6 6 6 6" : "m10 6 6 6-6 6"}
        stroke="#14131a"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SellerBlock({ seller }) {
  return (
    <div className="flex items-center gap-[10px]">
      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full">
        <img alt={seller.name} src={seller.avatar} className="block h-12 w-12 object-cover align-middle" />
      </div>
      <div className="flex min-w-0 flex-col justify-center gap-[7px]">
        <div className="flex min-h-[14px] items-center gap-1 text-[14px] font-bold leading-[17px]">
          <span className="block truncate">{seller.name}</span>
          <VerifiedBadge />
        </div>
        <div className="flex min-h-[18px] flex-wrap items-center gap-1.5 text-[14px] leading-[17px] text-graytext">
          <span className="flex items-center gap-1 text-[rgb(0,_228,_201)]">
            <VerifiedBadge size={18} />
            {seller.rating}
          </span>
          <button type="button" className="underline decoration-solid">
            {seller.reviews} reviews
          </button>
        </div>
      </div>
    </div>
  );
}

function PriceBlock({ seller, withDelivery, align = "right" }) {
  return (
    <div className={align === "right" ? "text-right" : ""}>
      <div className="text-[14px] leading-[19.6px] text-graytext line-through">{seller.was}</div>
      <div className={`flex items-center gap-2 ${align === "right" ? "justify-end" : ""}`}>
        <span className="rounded-sm bg-[rgba(209,_240,_143,_0.2)] px-1 py-0.5 text-[12px] font-bold leading-[16.8px] text-[rgb(54,_117,_6)]">
          {seller.discount}
        </span>
        <span className="text-[16px] font-bold leading-[24px] text-[rgb(54,_117,_6)]">{seller.price}</span>
      </div>
      {withDelivery && (
        <div className="mt-1 flex items-center justify-end gap-1.5 text-[14px] leading-[19.6px] text-graytext">
          <ClockIcon />
          {seller.delivery}
        </div>
      )}
    </div>
  );
}

function OfferRow({ seller }) {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-[rgba(9,9,11,0.05)_0px_2px_4px_0px,rgba(9,9,11,0.02)_0px_12px_8px_0px]">
      {/* mobile: stacked card (live @390) */}
      <div className="p-4 md:hidden">
        <div className="flex items-start justify-between gap-3">
          <SellerBlock seller={seller} />
          <PriceBlock seller={seller} withDelivery />
        </div>
        <div className="mt-3 flex justify-between border-t border-cardborder pt-3">
          <span className="block font-bold">Delivery instructions</span>
          <span className="flex items-center">
            <Caret />
          </span>
        </div>
        <button
          type="button"
          aria-label="Buy now"
          className="mt-3 block min-h-[42px] w-full rounded-lg border-[0.8px] border-darkbtn px-4 py-[10px] text-center text-[14px] font-bold leading-[21px] text-ink"
        >
          Buy now ({seller.price})
        </button>
      </div>
      {/* md+: capture's 5-column grid row */}
      <div className="hidden items-center justify-between gap-4 px-6 py-4 md:grid md:grid-cols-[0.7fr_0.3fr_120px_auto_auto]">
        <SellerBlock seller={seller} />
        <div className="flex flex-col gap-1">
          <div className="text-[14px] leading-[19.6px] text-graytext">Delivery time</div>
          <div>{seller.delivery}</div>
        </div>
        <PriceBlock seller={seller} />
        <div className="flex justify-end">
          <button
            type="button"
            aria-label="Buy now"
            className="inline-block min-h-[42px] rounded-lg border-[0.8px] border-darkbtn px-4 py-[10px] text-center text-[14px] font-bold leading-[21px] text-ink"
          >
            Buy now
          </button>
        </div>
        <div className="flex min-w-[155px] items-center justify-end gap-1">
          <span className="block">Delivery instructions</span>
          <Caret />
        </div>
      </div>
    </div>
  );
}

export default function GamePassOffers() {
  const [page, setPage] = useState(1);
  const [goOpen, setGoOpen] = useState(false);
  const pages = Array.from({ length: GAME_PASS_OTHER_SELLERS_PAGES }, (_, i) => i + 1);

  return (
    <div className="w-full">
      <div className="mb-3 text-[20px] font-bold leading-[30px]">
        Other sellers ({GAME_PASS_OTHER_SELLERS_COUNT})
      </div>
      <div className="flex flex-col gap-3">
        {GAME_PASS_OTHER_SELLERS.map((s) => (
          <OfferRow key={s.name} seller={s} />
        ))}
      </div>
      <nav
        aria-label="Pagination"
        className="mt-5 flex flex-wrap items-center justify-center gap-1.5 text-center"
      >
        <button
          type="button"
          aria-label="Previous page"
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="flex h-[42px] w-[42px] items-center justify-center rounded-sm bg-badgebg disabled:opacity-40"
        >
          <Arrow dir="left" />
        </button>
        {pages.map((p) => (
          <button
            key={p}
            type="button"
            aria-pressed={page === p}
            onClick={() => setPage(p)}
            className={`hidden h-[42px] min-w-[42px] items-center justify-center rounded-sm px-0.5 text-[14px] leading-[19.6px] md:flex ${
              p === page ? "bg-brand font-bold" : "bg-inputgray"
            }`}
          >
            {p}
          </button>
        ))}
        <button
          type="button"
          aria-label="Next page"
          disabled={page === pages.length}
          onClick={() => setPage((p) => Math.min(pages.length, p + 1))}
          className="flex h-[42px] w-[42px] items-center justify-center rounded-sm bg-badgebg disabled:opacity-40"
        >
          <Arrow dir="right" />
        </button>
        <div className="relative ml-2.5 flex h-[42px] items-center">
          <label className="mr-[15px] block text-[16px] leading-[19px]">Go to page:</label>
          <div className="relative">
            <button
              type="button"
              aria-label="Single-select dropdown"
              aria-haspopup="listbox"
              aria-expanded={goOpen}
              onClick={() => setGoOpen((v) => !v)}
              className="flex min-h-[42px] min-w-[72px] items-center justify-between gap-2 rounded-lg bg-inputgray px-[14px] py-2 text-[16px] leading-[19.6px] shadow-[rgba(0,0,0,0)_0px_0px_0px_1px_inset]"
            >
              <span className="block">{page}</span>
              <span className={`text-graytext transition-transform ${goOpen ? "rotate-180" : ""}`}>
                <Caret />
              </span>
            </button>
            {goOpen && (
              <ul
                role="listbox"
                className="absolute inset-x-0 top-[calc(100%+4px)] z-20 overflow-hidden rounded-lg border border-cardborder bg-white py-1 shadow-[rgba(9,9,11,0.05)_0px_2px_4px_0px,rgba(9,9,11,0.02)_0px_12px_8px_0px]"
              >
                {pages.map((p) => (
                  <li key={p}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={page === p}
                      onClick={() => {
                        setPage(p);
                        setGoOpen(false);
                      }}
                      className={`block w-full px-[14px] py-2 text-left text-[14px] hover:bg-inputgray ${
                        p === page ? "font-bold" : ""
                      }`}
                    >
                      {p}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
