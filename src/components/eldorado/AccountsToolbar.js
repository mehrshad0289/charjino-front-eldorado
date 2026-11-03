import { ACCOUNT_FILTERS, QUICK_FILTERS } from "./data/referenceData";

function ChevronDown() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m6 9.5 6 5 6-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="#14131a" strokeWidth="2" />
      <path d="m20 20-3.5-3.5" stroke="#14131a" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function SortIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 4v13M7 17l-3-3M7 17l3-3" stroke="#14131a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 20V7M17 7l-3 3M17 7l3 3" stroke="#14131a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SlidersIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="9" cy="7" r="2" fill="currentColor" />
      <circle cx="15" cy="12" r="2" fill="currentColor" />
      <circle cx="8" cy="17" r="2" fill="currentColor" />
    </svg>
  );
}

/* Toolbar above the offers grid (shop_account.make reference):
   Desktop: 3 filter dropdowns + Clear filters, quick-filter chips, text
   search, results count left + sort dropdown right. Static closed states per
   capture.
   Mobile (live eldorado.gg @390): one horizontally scrollable row of compact
   filter pills (All filters / Price / Delivery Time / Game Series), no quick
   chips, full-width search, compact count + sort row. */
export default function AccountsToolbar({ resultCount }) {
  return (
    <div className="mx-auto w-full max-w-[1208px] px-4 md:px-6">
      {/* mobile: horizontally scrollable filter pills (live reference @390) */}
      <div className="flex gap-2 overflow-x-auto py-3 md:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <button
          type="button"
          className="flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg bg-white px-3 text-[13px] font-bold text-ink outline outline-1 outline-cardborder"
        >
          <SlidersIcon />
          All filters
        </button>
        {ACCOUNT_FILTERS.map((label) => (
          <button
            key={label}
            type="button"
            className="flex h-9 shrink-0 items-center whitespace-nowrap rounded-lg bg-white px-3 text-[13px] text-ink outline outline-1 outline-cardborder"
          >
            {label}
          </button>
        ))}
      </div>

      {/* desktop filters row */}
      <div className="mx-auto hidden max-w-[1140px] flex-wrap gap-2.5 py-4 md:flex">
        {ACCOUNT_FILTERS.map((label) => (
          <div key={label} className="w-[200px]">
            <div
              role="combobox"
              aria-haspopup="listbox"
              aria-label={`Single-select dropdown: ${label}`}
              className="flex min-h-[42px] items-center justify-between overflow-hidden rounded-lg bg-inputgray px-[14px] py-2 text-[14px] leading-[19.6px] text-filtertext shadow-[0_0_0_1px_rgba(0,0,0,0)_inset] cursor-pointer hover:brightness-[0.98]"
            >
              <div className="flex grow items-center gap-1">
                <span className="block max-w-full grow basis-[0%] truncate">{label}</span>
              </div>
              <div className="flex shrink-0 items-center text-filtertext">
                <ChevronDown />
              </div>
            </div>
          </div>
        ))}
        <div className="flex items-center justify-end pl-4 text-[14px] leading-[19.6px]">
          <button type="button" className="inline-block whitespace-nowrap rounded-lg underline">
            <span className="text-center">Clear filters</span>
          </button>
        </div>
      </div>

      {/* quick filter chips — desktop only (live mobile shows none) */}
      <div className="mb-5 hidden flex-wrap gap-2 md:flex">
        {QUICK_FILTERS.map((chip) => (
          <div key={chip} className="whitespace-nowrap">
            <div
              role="button"
              aria-label={chip}
              className="flex max-w-fit cursor-pointer items-center justify-center rounded-full bg-white px-3 py-1 text-[14px] tracking-[0.14px] leading-[19.6px] outline outline-1 outline-cardborder hover:outline-ink"
            >
              <span className="block">{chip}</span>
            </div>
          </div>
        ))}
      </div>

      {/* text search */}
      <div className="mb-4 max-w-[340px] md:mb-5">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for accounts"
            aria-label="Search for accounts"
            className="block h-[42px] w-full rounded-lg border-2 border-inputgray bg-inputgray py-[7px] pl-3 pr-9 text-[14px] leading-[19.2px] outline-none placeholder:text-filtertext focus:border-focusblue focus:bg-white"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <SearchIcon />
          </div>
        </div>
      </div>

      {/* results count + sort */}
      <div className="mb-2 flex min-h-10 items-center justify-between">
        <div className="text-[14px] leading-[14px] text-filtertext">{resultCount} accounts found</div>
        <div
          role="combobox"
          aria-haspopup="listbox"
          aria-label="Sort offers"
          className="flex min-h-[42px] cursor-pointer items-center justify-between rounded-lg px-[14px] py-2 text-[14px] leading-[19.6px]"
        >
          <div className="flex items-center gap-2">
            <SortIcon />
            <span className="block truncate">Recommended</span>
          </div>
          <div className="ml-2 flex shrink-0 items-center text-filtertext">
            <ChevronDown />
          </div>
        </div>
      </div>
    </div>
  );
}
