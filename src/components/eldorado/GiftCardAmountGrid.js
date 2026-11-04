"use client";

import { useState } from "react";
import { GIFT_CARD_AMOUNTS, GIFT_CARD_MOBILE_PREVIEW_COUNT } from "./data/giftCardData";

/* Step 2 of the buying flow (giftcard .make capture): "Select amount *" with
   a number badge and a grid of amount cards (white, hairline border, card
   image, value + "From" price).
   Desktop (1920 capture): badge inline in the title row, then an open
   4-column grid of vertical cards, all visible.
   Mobile (live @390): one white container card with the badge overlapping
   its top-left corner, single-column gray rows inside (first 8 + a centered
   "View more" toggle). Clicking a card selects it. */

function Row({ amount, selected, onSelect, horizontal }) {
  return (
    <button
      type="button"
      aria-label="gift-card-amount"
      aria-pressed={selected}
      onClick={onSelect}
      className={
        horizontal
          ? `flex w-full items-center gap-3 rounded-lg p-2.5 text-left transition-colors ${
              selected ? "bg-white ring-2 ring-ink" : "bg-badgebg"
            }`
          : `relative flex h-full w-full flex-col items-start rounded-lg border p-[10px] text-left transition-colors ${
              selected ? "border-ink ring-1 ring-ink" : "border-cardborder bg-white"
            }`
      }
    >
      <div className="h-9 shrink-0 overflow-hidden">
        <img
          alt={`Xbox ${amount.label}`}
          src={amount.img}
          className="block h-9 w-9 rounded-sm object-cover align-middle"
        />
      </div>
      <div className="min-w-0 grow md:mt-3">
        <div className="text-[14px] leading-[19.6px]">{amount.label}</div>
        <div className="text-[12px] leading-[18px] text-graytext">Value</div>
      </div>
      <div className={horizontal ? "shrink-0 text-[14px] leading-[21px]" : "mt-6 shrink-0 text-[14px] leading-[21px]"}>
        <span>From</span>
        <span> {amount.from}</span>
      </div>
    </button>
  );
}

function AmountBadge() {
  return (
    <div
      className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-brand"
      aria-hidden="true"
    >
      <span className="block text-[28px] leading-[42px]">2</span>
    </div>
  );
}

export default function GiftCardAmountGrid() {
  const [selected, setSelected] = useState(null);
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="relative mb-8">
      {/* desktop: badge inline in title row + open grid (capture) */}
      <div className="hidden md:block">
        <div className="mb-3 flex items-center text-[18px] font-bold leading-[27px]">
          <div className="mr-[10px]">
            <AmountBadge />
          </div>
          <span className="block">Select amount</span>
          <span className="block text-[rgb(212,_25,_20)]">*</span>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {GIFT_CARD_AMOUNTS.map((a) => (
            <Row key={a.label} amount={a} selected={selected === a.label} onSelect={() => setSelected(a.label)} />
          ))}
        </div>
      </div>

      {/* mobile: white container card (live @390) */}
      <div className="relative rounded-2xl bg-white p-4 pt-6 md:hidden">
        <div
          className="absolute left-0 top-0 z-[10] flex h-10 w-10 -translate-x-2 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full bg-brand"
          aria-hidden="true"
        >
          <span className="block text-[28px] leading-[42px]">2</span>
        </div>
        <div className="mb-3 text-[18px] font-bold leading-[27px]">
          Select amount<span className="text-[rgb(212,_25,_20)]">*</span>
        </div>
        <div className="flex flex-col gap-2">
          {GIFT_CARD_AMOUNTS.map((a, i) => {
            if (!expanded && i >= GIFT_CARD_MOBILE_PREVIEW_COUNT) return null;
            return (
              <Row
                key={a.label}
                amount={a}
                horizontal
                selected={selected === a.label}
                onSelect={() => setSelected(a.label)}
              />
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mx-auto mt-1 flex items-center gap-1 py-2 text-[14px] font-bold"
        >
          {expanded ? "View less" : "View more"}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            className={`transition-transform ${expanded ? "rotate-180" : ""}`}
          >
            <path d="m6 9.5 6 5 6-5" stroke="#14131a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
