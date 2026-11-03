function ChevronLeft() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m14 6-6 6 6 6" stroke="#14131a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m10 6 6 6-6 6" stroke="#14131a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* Pagination (shop_account.make reference): prev/next squares, numbered buttons
   with the current page in brand yellow, ellipsis, last page, go-to-page select */
export default function AccountsPagination({ pages = [1, 2, 3, 4, 5], lastPage = 207 }) {
  return (
    <nav
      aria-label="Pagination"
      className="mt-[30px] flex items-center justify-center gap-1.5 pb-[15px] pt-5 text-center"
    >
      <button
        type="button"
        aria-label="Previous page"
        disabled
        className="flex h-[42px] w-[42px] items-center justify-center rounded-sm bg-badgebg opacity-40"
      >
        <ChevronLeft />
      </button>
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          className={`flex h-[42px] min-w-[42px] items-center justify-center rounded-sm px-0.5 text-[14px] leading-[19.6px] ${
            p === 1 ? "bg-brand font-bold" : "bg-inputgray"
          }`}
        >
          {p}
        </button>
      ))}
      <span className="flex h-[42px] min-w-[42px] items-center justify-center rounded-sm bg-inputgray px-0.5 text-[14px] leading-[19.6px]">
        ...
      </span>
      <button
        type="button"
        className="flex h-[42px] min-w-[42px] items-center justify-center rounded-sm bg-inputgray px-0.5 text-[14px] leading-[19.6px]"
      >
        {lastPage}
      </button>
      <button
        type="button"
        aria-label="Next page"
        className="flex h-[42px] w-[42px] items-center justify-center rounded-sm bg-badgebg"
      >
        <ChevronRight />
      </button>
      <div className="ml-2.5 flex h-[42px] items-center">
        <label className="mr-[15px] text-[16px] leading-[19px]">Go to page:</label>
        <div
          role="combobox"
          aria-haspopup="listbox"
          aria-label="Go to page"
          className="flex w-[60px] min-h-[42px] cursor-pointer items-center justify-between overflow-hidden rounded-lg bg-inputgray px-[14px] py-2 text-[14px] leading-[19.6px]"
        >
          <span className="block grow truncate">1</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="ml-2 text-filtertext">
            <path d="m6 9.5 6 5 6-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </nav>
  );
}
