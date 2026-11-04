"use client";

import { useState } from "react";
import { GAME_PASS_IMAGES, GAME_PASS_VARIANTS, GAME_PASS_DEFAULT_VARIANT } from "./data/gamePassData";

/* Step 2 of the buying flow (gamepass .make capture + live probes):
   "Amount: {variant}" inline label over the subscription variant cards.
   Mobile (live @390): horizontal scroll row of 136px cards.
   md (probed md:grid-cols-3): 3-col grid; xl (probed xl:grid-cols-4): the
   1920 capture's 4-col grid. Selected card: 16% yellow tint + 2px yellow
   outline inset -2px (capture) + the "Popular" ribbon on the pre-selected
   variant (live @1920/@390). Clicking a card selects it. */

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="#6a667b" strokeWidth="1.6" />
      <path d="M12 11v5" stroke="#6a667b" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="7.6" r="1" fill="#6a667b" />
    </svg>
  );
}

function PopularRibbon() {
  return (
    <div className="absolute -top-3 left-0 z-[2] flex items-center gap-1 rounded-md bg-brand py-1 pl-2 pr-2.5 shadow-[rgba(9,9,11,0.05)_0px_2px_4px_0px]">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="m12 2 2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 16.9l-6.1 3.5 1.5-6.8L2.2 9l6.9-.7L12 2Z"
          fill="#14131a"
        />
      </svg>
      <span className="block text-[12px] font-bold leading-[16.8px]">Popular</span>
    </div>
  );
}

function Card({ variant, selected, onSelect }) {
  return (
    <button
      type="button"
      aria-label={`Select ${variant.label}`}
      aria-pressed={selected}
      onClick={onSelect}
      className={`relative flex h-full w-full flex-col rounded-lg border border-cardborder p-3 text-left transition-colors ${
        selected ? "bg-brand/[0.16] outline-2 outline-offset-[-2px] outline-brand" : "bg-white hover:bg-badgebg"
      }`}
    >
      {selected && variant.popular && <PopularRibbon />}
      <div className="h-10 w-10 shrink-0 overflow-hidden">
        <img
          alt={`Xbox ${variant.label}`}
          src={variant.img}
          className="block h-10 w-10 rounded-sm object-cover align-middle"
        />
      </div>
      <div className="mt-2.5 min-w-0 grow text-[14px] leading-[19.6px]">{variant.label}</div>
      <div className="w-full shrink-0 text-[14px] leading-[19.6px]">
        {variant.was && <div className="text-graytext line-through">{variant.was}</div>}
        <div className="flex items-center gap-2">
          <span className="text-[16px] font-bold leading-[24px] text-[rgb(54,_117,_6)]">{variant.price}</span>
          {variant.discount && (
            <span className="rounded-sm bg-[rgba(209,_240,_143,_0.2)] px-1 py-0.5 text-[12px] font-bold leading-[16.8px] text-[rgb(54,_117,_6)]">
              {variant.discount}
            </span>
          )}
        </div>
        <div className="mt-1.5">
          <InfoIcon />
        </div>
      </div>
    </button>
  );
}

export default function GamePassAmountGrid() {
  const [selected, setSelected] = useState(GAME_PASS_DEFAULT_VARIANT);

  return (
    <div className="bg-white px-4 pb-4 pt-4 lg:px-6 lg:pb-5">
      <div className="mb-3 text-[16px] leading-[24px]">
        <span className="font-bold">Amount: </span>
        <span className="text-graytext">{selected}</span>
      </div>
      {/* mobile: horizontal scroll row (live @390, card width 136px) */}
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:hidden">
        {GAME_PASS_VARIANTS.map((v) => (
          <div key={v.label} className="w-[136px] shrink-0">
            <Card variant={v} selected={selected === v.label} onSelect={() => setSelected(v.label)} />
          </div>
        ))}
      </div>
      {/* md+: probed grid — md:grid-cols-3, xl:grid-cols-4 (1920 capture) */}
      <div className="hidden gap-4 md:grid md:grid-cols-3 xl:grid-cols-4">
        {GAME_PASS_VARIANTS.map((v) => (
          <Card key={v.label} variant={v} selected={selected === v.label} onSelect={() => setSelected(v.label)} />
        ))}
      </div>
    </div>
  );
}
