"use client";

import { useEffect, useRef, useState } from "react";
import { GAME_PASS_IMAGES, GAME_PASS_VARIANTS, GAME_PASS_DEFAULT_VARIANT } from "./data/gamePassData";

/* Step 2 of the buying flow (gamepass .make capture + live re-probe
   2026-11-04): "Amount: {variant}" inline label over the subscription
   variant cards. Card anatomy follows the CURRENT live page (title 16px,
   strike / discounted price / info icon, then a full-bleed hairline footer
   with the normalized per-month price — "/ month" is a live addition the
   capture doesn't have; the per-month value is derived from the capture's
   own price and duration). "Popular" (selected) and "Best Value"
   (Essential 12 Months) chips render in-flow at the card's top-left per
   live. Mobile (live @390): horizontal scroll row of 142px cards.
   Selected card: 16% yellow tint + 2px yellow outline inset -2px (capture
   == live). Clicking a card selects it. */

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="#6a667b" strokeWidth="1.6" />
      <path d="M12 11v5" stroke="#6a667b" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="7.6" r="1" fill="#6a667b" />
    </svg>
  );
}

function Chip({ children }) {
  return (
    <div className="flex w-fit items-center gap-1 rounded-lg bg-brand py-1 pl-2 pr-2.5">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="m12 2 2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 16.9l-6.1 3.5 1.5-6.8L2.2 9l6.9-.7L12 2Z"
          fill="#14131a"
        />
      </svg>
      <span className="block text-[12px] font-bold leading-[16.8px]">{children}</span>
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
      {(selected && variant.popular) || variant.bestValue ? (
        <div className="mb-2.5">
          <Chip>{selected && variant.popular ? "Popular" : "Best Value"}</Chip>
        </div>
      ) : null}
      <div className="h-10 w-10 shrink-0 overflow-hidden">
        <img
          alt={`Xbox ${variant.label}`}
          src={variant.img}
          className="block h-10 w-10 rounded-sm object-cover align-middle"
        />
      </div>
      <div className="mt-2.5 min-w-0 grow text-[16px] leading-[22px]">{variant.label}</div>
      <div className="w-full shrink-0">
        {variant.was && <div className="text-[16px] leading-[24px] text-graytext line-through">{variant.was}</div>}
        <div className="flex items-center gap-2">
          <span className="text-[18px] font-bold leading-[27px] text-[rgb(54,_117,_6)]">{variant.price}</span>
          {variant.discount && (
            <span className="rounded-sm bg-[rgba(209,_240,_143,_0.2)] px-1 py-0.5 text-[12px] font-bold leading-[16.8px] text-[rgb(54,_117,_6)]">
              {variant.discount}
            </span>
          )}
        </div>
        <div className="mb-2.5 mt-1.5">
          <InfoIcon />
        </div>
      </div>
      {monthly && (
        <div className="-mx-3 -mb-3 mt-2 border-t border-cardborder px-3 py-2.5 text-[14px] leading-[19.6px] text-graytext">
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
