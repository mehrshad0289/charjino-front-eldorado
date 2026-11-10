"use client";

import { useState } from "react";
import { PRODUCT_PROTECT } from "./data/productData";

/* "How we protect your purchase" collapsible card (product .make capture
   shows the collapsed bar — grid-rows-[0fr]; the four feature rows were
   scraped live 2026-11-04 by expanding it on
   eldorado.gg/efootball-accounts/oa/2f48f97f-...).
   Light-blue rounded card: blue shield roundel + bold 14px title + chevron;
   expanded body lists the four features as bold title + gray description.
   The capture ships no open state — the live expanded rendering is used. */

function ShieldRoundel() {
  return (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-focusblue">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 3 5 5.8v5.4c0 4.3 2.9 7.4 7 8.8 4.1-1.4 7-4.5 7-8.8V5.8L12 3Z" fill="#fff" />
        <path d="m9 11.8 2.1 2.1 4-4.2" stroke="#4783ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export default function ProductProtectCard({ title, items, label }) {
  const [open, setOpen] = useState(false);
  const heading = title || "How we protect your purchase";
  const rows = items || PRODUCT_PROTECT;
  const aria = label || heading;
  return (
    <div className="rounded-lg bg-[rgba(71,131,255,0.08)] outline-[0.8px] outline-[rgba(71,131,255,0.2)]">
      <button
        type="button"
        aria-expanded={open}
        aria-label={aria}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-[10px] rounded-t-lg px-4 py-3 text-left lg:px-5"
      >
        <ShieldRoundel />
        <span className="grow text-start text-[14px] font-bold leading-[19.6px]">{heading}</span>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className={`shrink-0 text-ink transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="m6 9.5 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="flex flex-col gap-4 px-4 pb-5 pt-1 lg:px-5">
          {rows.map((f) => (
            <div key={f.title}>
              <div className="text-[14px] font-bold leading-[19.6px]">{f.title}</div>
              <div className="text-[14px] leading-[19.6px] text-graytext">{f.text}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
