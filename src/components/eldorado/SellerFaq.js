"use client";

/* Seller FAQ accordion for /become-seller — session 19. The capture shows
   the 7 rows CLOSED (white rounded-lg, bold question + 24px gray chevron
   — same row pattern as InfluencerFaq); open/close behavior per live.
   Answers scraped from live (becomeSellerData.js); answer 4 is the live
   rich-text article → rendered as bold h + paragraph blocks. Multiple
   rows can be open at once, like live. The icomoon chevron is
   substituted with an inline SVG (project convention). */
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

function Answer({ item }) {
  if (item.blocks) {
    return (
      <div className="flex flex-col gap-3 pt-2 text-graytext">
        {item.blocks.map((b) => (
          <div key={b.h} className="flex flex-col gap-2">
            <p className="font-bold text-ink">{b.h}</p>
            {b.lead && (
              <p>
                {b.lead[0]}
                <b className="text-ink">{b.lead[1]}</b>
                {b.lead[2]}
              </p>
            )}
            {b.ps.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        ))}
      </div>
    );
  }
  return <p className="pt-2 leading-6 text-graytext">{item.a}</p>;
}

export default function SellerFaq({ items }) {
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
              className="flex w-full items-center justify-between gap-[6px] text-start"
            >
              <span className="font-bold">{item.q}</span>
              <Chevron open={isOpen} />
            </button>
            {isOpen && <Answer item={item} />}
          </div>
        );
      })}
    </div>
  );
}
