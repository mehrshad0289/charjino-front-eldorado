"use client";

import { useEffect, useRef, useState } from "react";
import { GIFT_CARD_REGIONS } from "./data/giftCardData";

/* Step 1 of the buying flow (giftcard .make capture): white card with a
   yellow→pink gradient border, yellow number badge pinned to the top-left
   corner, "Select region *" label and a single-select dropdown (captured
   closed; options are the regions sold on the page). */

function Chevron({ open }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
    >
      {/* live dropdown shows a solid caret */}
      <path d="M4 8.5h16L12 17.5 4 8.5Z" fill="#626362" stroke="#626362" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

export default function GiftCardRegionStep() {
  const [open, setOpen] = useState(false);
  const [region, setRegion] = useState(null);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <div className="relative z-[1] mb-8 rounded-2xl p-px" style={{ backgroundImage: "linear-gradient(to right, rgb(255, 201, 80), rgb(210, 123, 185))" }}>
      <div
        className="absolute left-0 top-0 z-[10] flex h-10 w-10 -translate-x-2 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full bg-brand lg:-translate-x-0"
        aria-hidden="true"
      >
        <span className="block text-[28px] font-bold leading-[42px]">1</span>
      </div>
      <div className="rounded-2xl bg-white p-4">
        <label className="mb-3 mt-3 inline-block text-[16px] font-bold leading-[27px] lg:text-[18px]">
          Select region<span className="text-[rgb(212,_25,_20)]">*</span>
        </label>
        <div className="relative w-full" ref={rootRef}>
          <button
            type="button"
            aria-label="Single-select dropdown"
            aria-haspopup="listbox"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex min-h-[42px] w-full items-center justify-between overflow-hidden rounded-lg bg-inputgray px-[14px] py-2 text-left leading-[19.6px] shadow-[rgba(0,0,0,0)_0px_0px_0px_1px_inset]"
          >
            <span className={`block truncate ${region ? "text-ink" : "text-filtertext"}`}>{region ?? "Region"}</span>
            <Chevron open={open} />
          </button>
          {open && (
            <ul
              role="listbox"
              className="absolute inset-x-0 top-[calc(100%+4px)] z-20 overflow-hidden rounded-lg border border-cardborder bg-white py-1 shadow-[rgba(9,9,11,0.05)_0px_2px_4px_0px,rgba(9,9,11,0.02)_0px_12px_8px_0px]"
            >
              {GIFT_CARD_REGIONS.map((r) => (
                <li key={r}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={region === r}
                    onClick={() => {
                      setRegion(r);
                      setOpen(false);
                    }}
                    className={`block w-full px-[14px] py-2 text-left text-[14px] hover:bg-inputgray ${region === r ? "font-bold" : ""}`}
                  >
                    {r}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
