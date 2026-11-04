"use client";

import { useRef, useState } from "react";
import { PRODUCT_CAROUSEL } from "./data/productData";

/* Top "More like this" carousel (product .make capture + live):
   bold header (18px desktop / 16px mobile), capture adds the gray
   "Page 1 of 4" indicator + two white bordered arrow buttons on the right;
   mobile (live @390) swaps the indicator for an "All offers" link and moves
   the arrows below the cards row. Horizontally scrollable w-52 cards:
   title clamped to 3 lines (h-[84px]), seller + teal badge | feedback,
   price 18px bold | teal bolt-only delivery (capture ships no label). */

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

function Bolt() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M13.5 3 6 13.5h4.5L10 21l7.5-10.5H13L13.5 3Z" fill="rgb(0, 228, 201)" />
    </svg>
  );
}

function ArrowButton({ dir, onClick, disabled, label }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center rounded-lg border-[0.8px] border-cardborder bg-white p-[5px] ${
        disabled ? "text-placehold" : "text-ink"
      }`}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        {dir === "prev" ? (
          <path d="M14.5 5.5 8 12l6.5 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path d="m9.5 5.5 6.5 6.5-6.5 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    </button>
  );
}

export default function ProductCarousel() {
  const scroller = useRef(null);
  const [page, setPage] = useState(1);
  const pageCount = 4;

  const scrollByPage = (dir) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth, behavior: "smooth" });
  };

  const onScroll = () => {
    const el = scroller.current;
    if (!el || !el.clientWidth) return;
    const max = el.scrollWidth - el.clientWidth;
    const frac = max > 0 ? el.scrollLeft / max : 0;
    setPage(Math.min(pageCount, 1 + Math.round(frac * (pageCount - 1))));
  };

  return (
    <section aria-label="More offers like this">
      {/* header row: mobile shows the All offers link, desktop the paginator */}
      <div className="flex items-center justify-between">
        <h2 className="text-[16px] font-bold leading-[24px] lg:text-[18px] lg:leading-[27px]">More like this</h2>
        <div className="flex items-center">
          <a href="/efootball-accounts" className="text-[14px] leading-[21px] text-linkblue underline lg:hidden">
            All offers
          </a>
          <div className="hidden items-center pl-[14px] lg:flex">
            <span className="mr-[10px] block text-[12px] leading-[16.8px] text-filtertext">Page {page} of {pageCount}</span>
            <ArrowButton dir="prev" label="Previous offers" onClick={() => scrollByPage(-1)} disabled={page === 1} />
            <div className="ml-[10px]">
              <ArrowButton dir="next" label="Next offers" onClick={() => scrollByPage(1)} disabled={page === pageCount} />
            </div>
          </div>
        </div>
      </div>

      {/* cards row */}
      <div
        ref={scroller}
        onScroll={onScroll}
        className="mt-3 flex w-full gap-[8px] overflow-x-auto pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {PRODUCT_CAROUSEL.map((c) => (
          <article key={c.title} className="w-52 shrink-0 rounded-lg bg-white shadow-[rgba(9,9,11,0.05)_0px_2px_4px_0px,rgba(9,9,11,0.02)_0px_12px_8px_0px]">
            <div className="px-[10px] pb-[10px] pt-3">
              <h3 className="mb-[10px] flow-root h-[84px] overflow-hidden text-ellipsis text-[14px] leading-[21px]">{c.title}</h3>
              <div className="mt-[10px] flex items-center justify-between text-[14px] leading-[21px]">
                <span className="flex min-w-0 items-center gap-1">
                  <strong className="block truncate font-bold">{c.seller}</strong>
                  <VerifiedBadge />
                </span>
                <span className="shrink-0">
                  {c.feedback}&nbsp;{c.count}
                </span>
              </div>
              <div className="mt-[10px] flex items-center justify-between">
                <strong className="text-[18px] font-bold">{c.price}</strong>
                <span className="flex items-center gap-[4px] text-filtertext">
                  <Bolt />
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* mobile: arrows under the row (live @390) */}
      <div className="mt-3 flex items-center justify-end gap-[10px] lg:hidden">
        <ArrowButton dir="prev" label="Previous offers" onClick={() => scrollByPage(-1)} disabled={page === 1} />
        <ArrowButton dir="next" label="Next offers" onClick={() => scrollByPage(1)} disabled={page === pageCount} />
      </div>
    </section>
  );
}
