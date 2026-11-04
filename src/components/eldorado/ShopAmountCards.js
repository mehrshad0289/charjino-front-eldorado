"use client";

import { useEffect, useRef, useState } from "react";

/* Amount variant cards for the top-up shop pages (session 24; prime +
   codpoints captures, same card anatomy in both): 40px image, 14px label
   (bold when selected) + optional gray subtitle, price block = green 16px
   price + discount chip on row 1, strike + info icon on row 2, NO per-month
   footer (unlike the gamepass cards). Selected card: 16% yellow tint +
   2px yellow inset outline; the "Popular" tab chip (brand bar with rounded
   bottom corners, 12px star) renders in-flow at the card's top edge on the
   selected+popular card — capture-exact (NOT the gamepass floating pill).
   Desktop: open grid (lg:grid-cols-3, xl:grid-cols-4 @1920 per the capture's
   repeat(4,minmax(0,1fr))). Below lg (live amazon-prime @390 + psplus @390):
   horizontal scroller of ~142px cards, opened on the selected one. */

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="#6a667b" strokeWidth="1.6" />
      <path d="M12 11v5" stroke="#6a667b" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="7.6" r="1" fill="#6a667b" />
    </svg>
  );
}

function PopularChip() {
  return (
    <div className="flex w-fit items-center gap-1 rounded-bl-lg rounded-br-lg bg-brand py-1 pl-2 pr-3">
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

function Card({ variant, selected, onSelect }) {
  return (
    <button
      type="button"
      aria-label={`Select ${variant.ariaLabel ?? variant.label}${variant.sub ? " " + variant.sub : ""}`}
      aria-pressed={selected}
      onClick={onSelect}
      className={`relative flex h-full w-full flex-col rounded-lg border border-cardborder min-h-40 text-left transition-colors ${
        selected ? "bg-brand/[0.16] outline-2 outline-offset-[-2px] outline-brand" : "bg-white hover:bg-badgebg"
      }`}
    >
      <div className="flex grow flex-col items-start gap-[10px] p-3 pt-0">
        {selected && variant.popular ? <PopularChip /> : null}
        <div className="flex w-full grow flex-col items-start gap-[10px]">
          <div className="h-10 w-10 shrink-0 overflow-hidden">
            <img
              alt={variant.imgAlt ?? variant.label}
              src={variant.img}
              className="block h-10 w-10 rounded-sm object-cover align-middle"
            />
          </div>
          <div className="grow">
            <div className={`text-[14px] leading-[19.6px] ${selected ? "font-bold" : ""}`}>{variant.label}</div>
            {variant.sub ? <div className="text-[14px] leading-[19.6px] text-graytext">{variant.sub}</div> : null}
          </div>
          <div className="w-full shrink-0 text-[14px] leading-[19.6px]">
            <div className="flex flex-col items-start gap-1">
              <div className="flex items-center gap-2">
                <span className="block text-[16px] font-bold leading-[24px] text-[rgb(54,_117,_6)]">{variant.price}</span>
                {variant.discount && (
                  <span className="block rounded-sm bg-[rgba(209,_240,_143,_0.2)] px-1 py-0.5 text-[12px] font-bold leading-[16.8px] text-[rgb(54,_117,_6)]">
                    {variant.discount}
                  </span>
                )}
              </div>
              {variant.was && (
                <div className="flex items-center gap-2">
                  <InfoIcon />
                  <span className="block text-[16px] leading-[24px] text-graytext line-through">{variant.was}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

export default function ShopAmountCards({ variants, defaultSelected }) {
  const [selected, setSelected] = useState(defaultSelected);
  const scrollerRef = useRef(null);

  // live @390 opens with the selected variant visible in the scroller
  // (gamepass GamePassAmountGrid precedent)
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
      {/* below lg: horizontal scroll row (live @390: ~142px cards) */}
      <div ref={scrollerRef} className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:hidden">
        {variants.map((v) => {
          const aria = `${v.ariaLabel ?? v.label}${v.sub ? " " + v.sub : ""}`;
          return (
            <div key={aria} className="w-[142px] shrink-0">
              <Card
                variant={v}
                selected={selected === aria}
                onSelect={() => setSelected(aria)}
              />
            </div>
          );
        })}
      </div>
      {/* lg+: the capture's open grid (repeat(4, 1fr) @1920) */}
      <div className="hidden gap-4 lg:grid lg:grid-cols-3 xl:grid-cols-4">
        {variants.map((v) => {
          const aria = `${v.ariaLabel ?? v.label}${v.sub ? " " + v.sub : ""}`;
          return (
            <Card key={aria} variant={v} selected={selected === aria} onSelect={() => setSelected(aria)} />
          );
        })}
      </div>
    </div>
  );
}
