import {
  SHOP_ITEM_GAME,
  SHOP_ITEM_FILTERS,
  SHOP_ITEM_CHIPS,
  SHOP_ITEM_TOOLBAR,
  SHOP_ITEM_OFFERS,
  SHOP_ITEM_PAGINATION,
  SHOP_ITEM_TRUST,
  SHOP_ITEM_SEO_HTML,
} from "./data/shopItemData";

/* Shop-item category page content from the shop-item capture (session 18):
   sticky 160px Filters sidebar (Filters title + Price accordion with
   Min./Max. inputs and 4 radio ranges + Game accordion with a Search Game
   input, 5 radio game rows and Show more (33)) and the main column
   (selected-filter chips row, "31057 items found" + Recommended sort
   combobox, 24 white offer cards in a 3-col/16px grid, 42px pagination
   [1 yellow active, 2-5, …, 1000, Next], the "From last 386,200 orders"
   trust row and the verbatim SEO block). Capture is 1920-only — below lg
   the sidebar stacks above the content (documented approximation). */

const CARD_SHADOW = "shadow-[rgba(9,9,11,0.05)_0px_2px_4px_0px,_rgba(9,9,11,0.02)_0px_12px_8px_0px]";

function AccordionHeader({ label }) {
  return (
    <button
      type="button"
      className="mx-[2px] flex items-center justify-between gap-1 rounded-lg text-center font-bold"
    >
      <div className="flex h-6 items-center overflow-hidden text-ellipsis text-center">
        {label}
      </div>
      {/* capture's chevron renders rotated 270° (pointing left) */}
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="shrink-0 rotate-[-90deg]"
      >
        <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

function RadioRow({ label, icon }) {
  return (
    <div className="flex h-6 rounded-lg">
      <label className="grid w-full items-center gap-[7px]" style={{ gridTemplateColumns: "17.5px 1fr" }}>
        <input type="radio" name={label} className="block h-0 w-0 bg-black/0 opacity-0" style={{ gridArea: "1 / 1 / 2 / 2" }} />
        <div className="h-[17.5px] w-[17.5px]" style={{ gridArea: "1 / 1 / 2 / 2" }}>
          <div className="size-full overflow-hidden align-middle">
            <img src={icon} alt="" className="block size-full" />
          </div>
        </div>
        <span className="text-[14px] leading-[19.6px]">{label}</span>
      </label>
    </div>
  );
}

function FiltersSidebar() {
  return (
    <div className="mr-0 mb-8 lg:mr-[32px] lg:mb-0">
      <div className="flex w-full flex-col pt-7 lg:sticky lg:top-[var(--shop-header-h)] lg:h-[1044px] lg:w-2xs">
        <span className="mb-5 block text-[20px] font-bold leading-[30px]">{SHOP_ITEM_FILTERS.title}</span>
        <div className="grow overflow-y-auto overflow-x-hidden border-t-[0.8px] border-cardborder pr-0 lg:pr-4">
          <div className="mt-5 mb-5">
            <AccordionHeader label={SHOP_ITEM_FILTERS.priceLabel} />
            <div className="mt-3">
              <div className="mb-4 mt-2">
                <div className="flex w-full items-center gap-2">
                  <div className="flex h-[42px] w-full items-center rounded-lg bg-[rgb(239,239,241)] px-3">
                    <input type="text" aria-label="Numeric input field" placeholder="Min." className="block w-full bg-[rgb(239,239,241)]" />
                  </div>
                  <span className="block">to</span>
                  <div className="flex h-[42px] w-full items-center rounded-lg bg-[rgb(239,239,241)] px-3">
                    <input type="text" aria-label="Numeric input field" placeholder="Max." className="block w-full bg-[rgb(239,239,241)]" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-[12px]">
                {SHOP_ITEM_FILTERS.ranges.map((r) => (
                  <RadioRow key={r.label} {...r} />
                ))}
              </div>
            </div>
          </div>
          <div className="mt-5 mb-5">
            <AccordionHeader label={SHOP_ITEM_FILTERS.gameLabel} />
            <div className="mt-3">
              <div className="mb-3 mt-2">
                <div className="flex h-[42px] items-center rounded-lg bg-[rgb(239,239,241)] px-3">
                  <input type="text" placeholder={SHOP_ITEM_FILTERS.gameSearch} className="block w-full bg-[rgb(239,239,241)]" />
                </div>
              </div>
              <div className="m-[2px] flex flex-col gap-1 text-[14px] leading-[19.6px]">
                {SHOP_ITEM_FILTERS.games.map((g) => (
                  <RadioRow key={g.label} {...g} />
                ))}
              </div>
              <div className="mt-3 text-[14px] font-bold leading-[19.6px] text-[rgb(45,94,173)]">
                {SHOP_ITEM_FILTERS.showMore}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OfferCard({ offer }) {
  return (
    <a
      href={offer.href}
      className={`block size-full overflow-hidden rounded-lg bg-white text-[14px] leading-[21px] ${CARD_SHADOW}`}
    >
      <section className="flex h-48 flex-col p-[14px]">
        <div className="mb-4 flex items-center gap-[10px]">
          <div className="flex content-start flex-wrap gap-x-1 overflow-hidden leading-[19.6px] max-h-[18px]">
            {offer.tags.map((t) => (
              <div key={t} className="flex justify-center font-bold">
                <span className="flex items-center">{t}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex grow items-start justify-between">
          <div className="flow-root max-h-[38px] overflow-hidden text-[rgb(106,102,123)] leading-[19.6px]">
            {offer.title}
          </div>
          <div className="ml-3 h-[58px] min-w-[58px] w-[58px] shrink-0 overflow-hidden">
            <img
              alt="Roblox"
              src={offer.img}
              className="block h-[58px] w-[58px] rounded-sm object-cover align-middle"
            />
          </div>
        </div>
        <div className="flex justify-between gap-1">
          <div className="flex items-center gap-[2px] overflow-hidden text-[rgb(106,102,123)]">
            <strong className="block truncate font-bold">{offer.seller}</strong>
            {offer.online && (
              <span className="block h-4 w-4 shrink-0 text-[rgb(0,228,201)]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="5" fill="currentColor" />
                </svg>
              </span>
            )}
            <div
              className="whitespace-nowrap"
              /* the capture's &nbsp; between % and the count */
              dangerouslySetInnerHTML={{ __html: offer.rating }}
            />
          </div>
        </div>
        <div className="mt-[10px] flex items-center justify-between">
          <div>
            <strong className="text-[18px] font-bold leading-[27px]">{offer.price}</strong>
            {offer.unit ? (
              <span className="inline-flex items-center gap-1 text-[18px] leading-[27px]">
                {offer.unit}
              </span>
            ) : null}
          </div>
          <div className="flex items-center gap-1 text-[rgb(106,102,123)] leading-[17px]">
            <div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-[rgb(106,102,123)]">
                <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
                <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </div>
            <div>{offer.delivery}</div>
          </div>
        </div>
      </section>
    </a>
  );
}

export default function ShopItemPageContent() {
  return (
    <div className="relative">
      <div className="flex flex-col">
        <div>
          <div className="absolute left-0 z-0 hidden h-[465px] w-full overflow-hidden md:block" aria-hidden="true">
            <div className="absolute -bottom-px left-0 z-[2] h-[340px] w-full"
              style={{ backgroundImage: "linear-gradient(rgba(246, 246, 246, 0) 0%, rgb(246, 246, 246) 100%)" }}
            />
            <div className="h-[465px] overflow-hidden">
              <img
                alt="banner background image"
                src={SHOP_ITEM_GAME.banner}
                className="block h-[465px] w-full object-cover align-middle"
                style={{ objectPosition: "50% 15%" }}
              />
            </div>
          </div>
        </div>
        <div className="relative z-[1] mx-auto flex w-full justify-center px-6 lg:mb-[50px]">
          <FiltersSidebar />
          <div className="w-full min-w-0 lg:w-auto lg:grow">
            {/* selected-filter chips */}
            <div className="flex flex-wrap gap-2 pt-6 lg:pt-0">
              {SHOP_ITEM_CHIPS.map((c) => (
                <div key={c} className="whitespace-nowrap">
                  <div
                    role="button"
                    aria-label={c}
                    tabIndex={0}
                    className="flex max-w-fit items-center justify-center rounded-full bg-white px-3 py-1 text-[14px] leading-[19.6px] tracking-[0.14px] outline-[0.8px] outline-[rgb(231,231,231)] outline-solid"
                  >
                    <span className="block">{c}</span>
                  </div>
                </div>
              ))}
            </div>
            {/* toolbar */}
            <div className="mb-5 mt-8 flex h-[42px] items-center justify-between">
              <div className="text-[14px] leading-[14px] text-[rgb(98,99,98)]">
                {SHOP_ITEM_TOOLBAR.resultCount}
              </div>
              <div
                role="combobox"
                aria-haspopup="listbox"
                aria-label="Single-select dropdown"
                className="flex min-h-[42px] items-center justify-between overflow-hidden rounded-lg bg-[rgb(244,244,244)] px-[14px] py-2 leading-[19.6px]"
              >
                <div className="flex grow items-center gap-2">
                  <span className="text-ink">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  </span>
                  <span className="block truncate">{SHOP_ITEM_TOOLBAR.sortLabel}</span>
                </div>
                <span className="ml-2 block shrink-0 text-[rgb(98,99,98)]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </div>
            {/* offers grid */}
            <div className="mt-4 flex flex-col justify-center gap-6">
              <div className="grid w-full gap-4 sm:grid-cols-2 lg:[grid-template-columns:repeat(3,_minmax(0px,_1fr))]">
                {SHOP_ITEM_OFFERS.map((o, i) => (
                  <OfferCard key={`${o.title}-${i}`} offer={o} />
                ))}
              </div>
            </div>
            {/* pagination */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              {SHOP_ITEM_PAGINATION.pages.map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`flex h-[42px] min-w-[42px] items-center justify-center rounded-sm px-[2px] text-center text-[14px] leading-[19.6px] ${
                    p === SHOP_ITEM_PAGINATION.active ? "bg-[rgb(255,201,80)]" : "bg-[rgb(239,239,241)]"
                  }`}
                >
                  {p}
                </button>
              ))}
              <span className="flex h-[42px] min-w-[42px] items-center justify-center rounded-sm bg-[rgb(239,239,241)] text-center text-[14px] leading-[19.6px]">
                ...
              </span>
              <button
                type="button"
                className="flex h-[42px] min-w-[42px] items-center justify-center rounded-sm bg-[rgb(239,239,241)] px-[2px] text-center text-[14px] leading-[19.6px]"
              >
                {SHOP_ITEM_PAGINATION.last}
              </button>
              <button
                type="button"
                aria-label="Next page"
                className="flex h-[42px] w-[42px] items-center justify-center rounded-sm bg-[rgb(244,244,244)] text-center"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            {/* trust row */}
            <div className="mt-8 flex justify-center">
              <div className="flex items-center">
                <span className="text-[rgb(255,201,80)]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2.5 14.9 8.6l6.6.8-4.9 4.5 1.3 6.5L12 17.2l-5.9 3.2 1.3-6.5-4.9-4.5 6.6-.8L12 2.5Z" />
                  </svg>
                </span>
                <p className="ml-[5px] flex items-center leading-[21px]">
                  {SHOP_ITEM_TRUST.prefix}
                  <b className="block px-1 font-bold">{SHOP_ITEM_TRUST.orders}</b>
                  {SHOP_ITEM_TRUST.suffix}
                </p>
              </div>
            </div>
            {/* SEO block — verbatim capture HTML (p/a/h2 with capture classes) */}
            <div className="mt-8"
              dangerouslySetInnerHTML={{ __html: SHOP_ITEM_SEO_HTML }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
