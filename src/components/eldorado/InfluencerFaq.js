"use client";

/* FAQ accordion for /influencer-program — session 15. The capture shows
   the rows closed (white rounded-lg, bold question + 24px gray chevron);
   open/close behavior per live (answers scraped from live, stored in
   influencerData.js). Multiple rows can be open, like live. */
import { useState } from "react";

function Chevron({ open }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={`shrink-0 text-graytext transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <path d="m5 9 7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function InfluencerFaq({ items }) {
  const [open, setOpen] = useState(() => new Set());
  const toggle = (i) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <div className="flex flex-col gap-2">
      {items.map((item, i) => {
        const isOpen = open.has(i);
        return (
          <div key={item.q} className="w-full rounded-lg bg-card px-[14px] py-3">
            <button
              type="button"
              onClick={() => toggle(i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-[6px] text-left"
            >
              <span className="font-bold">{item.q}</span>
              <Chevron open={isOpen} />
            </button>
            {isOpen && <p className="pt-2 leading-6 text-graytext">{item.a}</p>}
          </div>
        );
      })}
    </div>
  );
}
