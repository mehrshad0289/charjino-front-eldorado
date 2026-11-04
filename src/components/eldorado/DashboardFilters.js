/* Offers filter row from the capture: "Select Game" combobox (148px),
   "Search offers" input (200px) and the right-aligned sort combobox
   ("Recommended", transparent). No menu content exists in any reference,
   so the comboboxes are static buttons (no invented dropdowns); the input
   is a real text field. Config passed via props for reuse. */

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

function SortIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h10M4 12h7M4 17h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M17 8v9m0 0 3-3m-3 3-3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function DashboardFilters({ gamePlaceholder, searchPlaceholder, sortLabel }) {
  return (
    <div className="mb-[10px] flex flex-wrap">
      <div>
        <div className="flex flex-wrap items-center">
          <form className="mb-[10px] mr-[10px]">
            <div className="w-[148px]">
              <button
                type="button"
                aria-label="Single-select searchable dropdown"
                aria-haspopup="listbox"
                className="flex min-h-[42px] w-full items-center justify-between overflow-hidden rounded-lg bg-[rgb(239,_239,_241)] px-[14px] py-2 leading-[19.6px]"
              >
                <span className="block grow truncate text-[rgb(98,_99,_98)]">{gamePlaceholder}</span>
                <span className="block text-[rgb(98,_99,_98)]">
                  <ChevronDown />
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
      <div>
        <div className="w-[200px]">
          <div className="relative">
            <input
              type="text"
              placeholder={searchPlaceholder}
              className="block h-[42px] w-full overflow-clip rounded-lg border-2 border-[rgb(239,_239,_241)] bg-[rgb(239,_239,_241)] pb-[7px] pl-3 pr-9 pt-[5px] leading-[19.2px] outline-none placeholder:text-placehold"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <SearchIcon />
            </div>
          </div>
        </div>
      </div>
      <div className="ml-auto">
        <button
          type="button"
          aria-label="Single-select dropdown"
          aria-haspopup="listbox"
          className="flex min-h-[42px] items-center justify-between overflow-hidden rounded-lg px-[14px] py-2 leading-[19.6px]"
        >
          <span className="flex items-center gap-2">
            <SortIcon />
            <span className="block truncate">{sortLabel}</span>
          </span>
          <span className="block text-[rgb(98,_99,_98)]">
            <ChevronDown />
          </span>
        </button>
      </div>
    </div>
  );
}
