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

/* Toolbar above the offers grid (shop_account.make reference):
   3 filter dropdowns + Clear filters, quick-filter chips, text search,
   results count left + sort dropdown right. Static closed states per capture. */
export default function AccountsToolbar({ resultCount }) {
  return (
    <div className="mx-auto w-full max-w-[1208px] px-6">
      {/* filters row */}
      <div className="mx-auto flex max-w-[1140px] flex-wrap gap-2.5 py-4">
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

      {/* quick filter chips */}
      <div className="mb-5 flex flex-wrap gap-2">
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
      <div className="mb-5 max-w-[340px]">
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
      <div className="mb-2 flex h-10 items-center justify-between">
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
