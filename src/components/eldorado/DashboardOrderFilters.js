"use client";

import { useState } from "react";

function ChevronDown() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m6 9.5 6 5 6-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 4v10m0 0 4-4m-4 4-4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 19h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/* Orders filter row (/dashboard/orders/purchased + /sold captures,
   1920-only, decoded 2026-11-04): two min-w-[200px] comboboxes ("All
   statuses", "Recent") in a flex-wrap gap-[10px] wrapper inside a
   mb-[14px] flex row. The sold capture adds a 200px "Search Orders" input
   (search icon absolute right-2, dark glyph) and a right-aligned gray
   "Download invoice" button (ml-auto min-w-[200px], bg rgb(244,244,244),
   bold 14/21, icon after the label). No menu content exists in any
   reference, so the comboboxes stay static buttons (project pattern);
   the search input is a real text field (controlled, no-op). */

function Combobox({ label }) {
  return (
    <div className="min-w-[200px]">
      <div className="relative flex w-full flex-col">
        <button
          type="button"
          role="combobox"
          aria-label="Single-select dropdown"
          aria-haspopup="listbox"
          className="flex min-h-[42px] items-center justify-between overflow-hidden rounded-lg bg-[rgb(239,_239,_241)] py-2 pl-[14px] pr-[14px] leading-[19.6px]"
        >
          <span className="block grow basis-[0%] truncate">{label}</span>
          <span className="ml-[8px] block shrink-0 text-[rgb(98,_99,_98)]">
            <ChevronDown />
          </span>
        </button>
      </div>
    </div>
  );
}

export default function DashboardOrderFilters({ status, period, searchPlaceholder, invoiceLabel }) {
  const [query, setQuery] = useState("");
  return (
    <div className="mb-[14px] flex flex-wrap gap-[10px]">
      <div>
        <div className="flex flex-wrap gap-[10px]">
          <Combobox label={status} />
          <Combobox label={period} />
        </div>
      </div>
      {searchPlaceholder && (
        <div className="w-[200px] max-w-full">
          <div className="inline-block w-[200px]">
            <div className="flex w-full">
              <div className="grow self-center basis-[0%]">
                <div className="relative">
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={searchPlaceholder}
                      className="block h-[42px] w-full overflow-clip rounded-lg border-[2px] border-[rgb(239,_239,_241)] bg-[rgb(239,_239,_241)] pb-[7px] pl-3 pr-9 pt-[5px] leading-[19.2px] outline-none placeholder:text-placehold"
                    />
                    <div className="absolute right-2">
                      <SearchIcon />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {invoiceLabel && (
        <div className="ml-auto min-w-[200px]">
          <div className="inline w-full">
            <button
              type="button"
              aria-label={invoiceLabel}
              className="inline-block min-h-[42px] w-full min-w-[70px] overflow-hidden rounded-lg bg-[rgb(244,_244,_244)] px-4 pb-[10px] pt-[10px] text-center text-[14px] font-bold leading-[21px] text-[rgb(20,_20,_26)]"
            >
              <span className="flex items-center justify-center gap-[6px] text-center">
                <span className="block text-center">{invoiceLabel}</span>
                <DownloadIcon />
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
