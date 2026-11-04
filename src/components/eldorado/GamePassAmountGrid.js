"use client";

import { useEffect, useRef, useState } from "react";
import { GAME_PASS_IMAGES, GAME_PASS_VARIANTS, GAME_PASS_DEFAULT_VARIANT } from "./data/gamePassData";

/* Step 2 of the buying flow (gamepass .make capture + live re-probe
   2026-11-05, session 25): "Amount: {variant}" inline label over the
   subscription variant cards. Card anatomy is capture-exact (and the live
   page converges on it): 40px icon, 14px/19.6 label (bold when selected),
   then the price ROW (bold green 16px + discount chip) and BELOW it the
   strike row (line-through 14px + 16px info icon, gap-8) — the old
   strike-above-price / 18px price render is corrected to both authorities.
   "Popular" chip = flush top tab on the SELECTED card only (yellow bg,
   rounded bottom corners, star + 12px bold label) — the "Best Value" chip
   is gone in BOTH the capture and today's live page, so it is dropped.
   A full-bleed hairline footer with the normalized per-month price stays
   (live addition the capture doesn't have; value derived from the
   capture's own price + duration, 12px like live). Mobile (live @390):
   horizontal scroll row of 142px cards. Selected card: 16% yellow tint +
   2px yellow outline inset -2px (capture == live). Click selects. */

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="#6a667b" strokeWidth="1.6" />
      <path d="M12 11v5" stroke="#6a667b" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="7.6" r="1" fill="#6a667b" />
    </svg>
  );
}

// flush top tab (capture selected card): yellow bg, only bottom corners
// rounded, star 12px + 12px bold label, pt-1 pr-3 pb-1 pl-2
function PopularTab() {
  return (
    <div className="mb-2.5 flex w-fit items-center gap-1 rounded-bl-lg rounded-br-lg bg-brand pt-1 pr-3 pb-1 pl-2">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="m12 2 2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 16.9l-6.1 3.5 1.5-6.8L2.2 9l6.9-.7L12 2Z"
          fill="#14131a"
        />
      </svg>
      <span className="block text-[12px] font-bold leading-[16.8px]">Popular</span>
    </div>
  );
}

// normalized monthly price from the capture's own price + label duration
// (live formula: months -> price/n; days -> price*30/n; 2 decimals)
function perMonth(variant) {
  const price = parseFloat(variant.price);
  const m = variant.label.match(/(\d+)\s+(Month|Months|Days)/);
  if (!m || Number.isNaN(price)) return null;
  const [, n, unit] = m;
  const value = unit === "Days" ? (price * 30) / Number(n) : price / Number(n);
  return value.toFixed(2);
}

function Card({ variant, selected, onSelect }) {
  const monthly = perMonth(variant);
  return (
    <button
      type="button"
      aria-label={`Select ${variant.label}`}
      aria-pressed={selected}
      onClick={onSelect}
      className={`relative flex h-full w-full flex-col rounded-lg border border-cardborder p-3 text-left transition-colors lg:min-h-[160px] ${
        selected ? "bg-brand/[0.16] outline-2 outline-offset-[-2px] outline-brand" : "bg-white hover:bg-badgebg"
      }`}
    >
      {selected && variant.popular ? <PopularTab /> : null}
      <div className="h-10 w-10 shrink-0 overflow-hidden">
        <img
          alt={`Xbox ${variant.label}`}
          src={variant.img}
          className="block h-10 w-10 rounded-sm object-cover align-middle"
        />
      </div>
      {/* capture: 14px/19.6 label, bold on the selected card */}
      <div className={`mt-2.5 min-w-0 grow text-[14px] leading-[19.6px] ${selected ? "font-bold" : ""}`}>
        {variant.label}
      </div>
      <div className="w-full shrink-0">
        {/* price row first (capture + live 2026-11-05): bold green 16px
            + discount chip; then the strike row: line-through 14px + info
            icon, gap-2 (8px) */}
        <div className="flex items-center gap-2">
          <span className="text-[16px] font-bold leading-[24px] text-[rgb(54,_117,_6)]">{variant.price}</span>
          {variant.discount && (
            <span className="rounded-sm bg-[rgba(209,_240,_143,_0.2)] px-1 py-0.5 text-[12px] font-bold leading-[16.8px] text-[rgb(54,_117,_6)]">
              {variant.discount}
            </span>
          )}
        </div>
        {variant.was && (
          <div className="mt-1 flex items-center gap-2">
            <span className="text-[14px] leading-[19.6px] text-graytext line-through">{variant.was}</span>
            <InfoIcon />
          </div>
        )}
        <div className="mt-1.5 mb-2.5" />
      </div>
      {monthly && (
        <div className="-mx-3 -mb-3 mt-2 border-t border-cardborder px-3 py-2.5 text-[12px] leading-[16.8px] text-graytext">
          {monthly} / month
        </div>
      )}
    </button>
  );
}

export default function GamePassAmountGrid() {
  const [selected, setSelected] = useState(GAME_PASS_DEFAULT_VARIANT);
  const scrollerRef = useRef(null);

  // live @390 opens with the selected variant visible in the scroller
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const el = scroller.querySelector(`[aria-label="Select ${CSS.escape(selected)}"]`);
    if (el) scroller.scrollTo({ left: Math.max(0, el.offsetLeft - 16) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-white px-4 pb-4 pt-4 lg:px-6 lg:pb-5">
      <div className="mb-3 text-[16px] leading-[24px]">
        <span className="font-bold">Amount: </span>
        <span className="text-graytext">{selected}</span>
      </div>
      {/* below lg: horizontal scroll row (live keeps the mobile-style flow
          through the whole tablet band — live @768 still scrolls, @1024 grids;
          card width 142px per live @390 capture) */}
      <div ref={scrollerRef} className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:hidden">
        {GAME_PASS_VARIANTS.map((v) => (
          <div key={v.label} className="w-[142px] shrink-0">
            <Card variant={v} selected={selected === v.label} onSelect={() => setSelected(v.label)} />
          </div>
        ))}
      </div>
      {/* lg+: probed grid — lg:grid-cols-3, xl:grid-cols-4 (1920 capture) */}
      <div className="hidden gap-4 lg:grid lg:grid-cols-3 xl:grid-cols-4">
        {GAME_PASS_VARIANTS.map((v) => (
          <Card key={v.label} variant={v} selected={selected === v.label} onSelect={() => setSelected(v.label)} />
        ))}
      </div>
    </div>
  );
}
