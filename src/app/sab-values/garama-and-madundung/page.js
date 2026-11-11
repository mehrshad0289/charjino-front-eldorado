import HeaderBar from "../../../components/eldorado/HeaderBar";
import CategoryNav from "../../../components/eldorado/CategoryNav";
import Footer from "../../../components/eldorado/Footer";
import {
  ROBLOX_PRICE_IMAGES,
  ROBLOX_PRICE_PAGE,
} from "../../../components/eldorado/data/robloxPriceHistoryData";

/* Roblox items price-history page (session 24; the user-pushed
   "Roblox items price history" capture — robloxprice-1920px-light-{1,2}
   — live URL /sab-values/garama-and-madundung): 465px artwork backdrop,
   then a 1208 p-6 column: 36px icon + 30px h1 + gray subtitle, the white
   filter card (Game chip scroller — Steal a Brainrot active yellow — +
   the Brainrot / Mutations single-select dropdowns), the price card
   (104px outlined thumb, game + item 30px bold, "Lowest available price"
   0.60 + dark Buy now + blue TradeShield row), the 3-col stats grid
   (90-day change green w/ up arrow / high / low) and the chart card
   ("90 days daily price" + the capture's pre-rendered 1112×250 chart
   PNG). SEO section h1 24px + paragraph. No ChatBubble in the capture.
   Below 1024 the two dropdown columns stack and the cards flow full-width
   (capture is 1920-only; live is the responsive authority, same pattern
   as the top-up shop pages). */

function ShieldIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
      <path
        d="M12 3 5 5.8v5.4c0 4.3 2.9 8.3 7 9.8 4.1-1.5 7-5.5 7-9.8V5.8L12 3Z"
        stroke="rgb(71,131,255)"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="m9 11.6 2.1 2.1L15.3 9.4" stroke="rgb(71,131,255)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrendUpIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
      <path d="M4 17 10 11l4 4 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 9h6v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Caret() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 text-[rgb(98,_99,_98)]">
      <path d="M4 8.5h16L12 17.5 4 8.5Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

export const metadata = {
  title: "Roblox items price history - Garama and Madundung - Eldorado",
  description:
    "See how a Roblox items price changes over time and find the lowest current price. Track the Garama and Madundung 90-day daily price, high, low and buy from verified sellers.",
};

export default function RobloxPriceHistoryPage() {
  const d = ROBLOX_PRICE_PAGE;
  return (
    <>
      <HeaderBar />
      <CategoryNav activeCategory="Items" />
      <main className="relative">
        {/* artwork backdrop (capture) */}
        <div aria-hidden="true" className="absolute left-0 top-0 z-0 h-[465px] w-full overflow-hidden">
          <div
            className="-bottom-px absolute left-0 z-[2] h-[340px] w-full"
            style={{ backgroundImage: "linear-gradient(rgba(246, 246, 246, 0) 0%, rgb(246, 246, 246) 100%)" }}
          />
          <img
            alt="banner background image"
            src={ROBLOX_PRICE_IMAGES.artwork}
            className="block h-[465px] w-full object-cover align-middle"
            style={{ objectPosition: "50% 15%" }}
          />
        </div>
        <div className="relative z-10 ">
          <section className="mx-auto flex w-full max-w-[1208px] flex-col gap-6 p-4 lg:p-6">
            {/* header row */}
            <div>
              <div className="flex items-center gap-3">
                <div className="h-9 shrink-0 overflow-hidden">
                  <img
                    alt="Roblox"
                    src={ROBLOX_PRICE_IMAGES.pageIcon}
                    className="block h-9 w-9 rounded-sm object-cover align-middle"
                  />
                </div>
                <div className="text-[30px] font-bold leading-[36px]">{d.title}</div>
              </div>
              <div className="text-graytext">{d.subtitle}</div>
            </div>

            {/* filter card */}
            <div className="flex flex-col gap-2 rounded-lg bg-white px-4 pb-4 pt-4 lg:px-6">
              <span className="block h-5 text-[14px] leading-[19.6px] text-graytext">{d.gameLabel}</span>
              <div className="overflow-hidden">
                <div className="size-full overflow-x-auto overflow-y-hidden whitespace-nowrap">
                  <div className="inline-block">
                    {d.games.map((g) => {
                      const active = !!g.active;
                      return (
                        <span key={g.label} className="inline-block [&:not(:first-child)]:pl-2">
                          <button
                            type="button"
                            aria-pressed={active}
                            className={`inline-block min-h-10 min-w-12 rounded-lg border text-center ${
                              active
                                ? "border-2 border-brand bg-brand/[0.16] px-[7px] py-1 font-bold"
                                : "border-cardborder bg-white px-2 py-1 hover:bg-badgebg"
                            }`}
                          >
                            <span className="relative flex items-center justify-center text-center">
                              <span className="flex h-6 shrink-0 items-center overflow-hidden pr-1">
                                <img
                                  alt={g.label}
                                  src={g.img}
                                  className="block h-6 w-6 rounded-sm object-cover align-middle"
                                />
                              </span>
                              <span className="block px-1">{g.label}</span>
                            </span>
                          </button>
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="mt-4 grid gap-6 sm:grid-cols-2">
                {d.dropdowns.map((dd) => (
                  <div key={dd.label} className="flex flex-col gap-1">
                    <span className="block h-5 text-[14px] leading-[19.6px] text-graytext">{dd.label}</span>
                    <div className="relative flex w-full flex-col">
                      <button
                        type="button"
                        aria-label="Single-select searchable dropdown"
                        aria-haspopup="listbox"
                        role="combobox"
                        className="flex min-h-12 items-center justify-between overflow-hidden rounded-lg bg-inputgray px-[14px] pt-3 pb-3 text-[16px] leading-[19.6px] shadow-[rgba(0,0,0,0)_0px_0px_0px_1px_inset]"
                      >
                        <span className="block grow basis-0 truncate">{dd.value}</span>
                        <span className="flex shrink-0 items-center">
                          <Caret />
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* price card */}
            <div className="flex flex-col items-start gap-6 rounded-lg bg-white p-6 shadow-[rgba(9,9,11,0.05)_0px_2px_4px_0px,rgba(9,9,11,0.02)_0px_12px_8px_0px] lg:flex-row lg:items-start">
              <div className="flex items-center gap-6">
                <div className="min-h-[104px] min-w-[104px] overflow-hidden rounded-lg outline-2 outline-[rgb(231,_231,_231)]">
                  <div className="inline-block h-[104px] overflow-hidden">
                    <img
                      alt={d.price.item}
                      src={ROBLOX_PRICE_IMAGES.itemThumb}
                      className="block h-[104px] w-[104px] object-contain align-middle"
                    />
                  </div>
                </div>
                <div className="flex flex-col justify-center gap-1">
                  <div className="text-graytext">{d.price.game}</div>
                  <div className="min-h-9 text-[30px] font-bold leading-[36px]">{d.price.item}</div>
                </div>
              </div>
              <div className="ml-auto flex flex-col items-end gap-2">
                <div className="text-graytext">Lowest available price</div>
                <div className="flex items-center gap-4">
                  <div className="h-9 text-[30px] font-bold leading-[36px]">{d.price.lowest}</div>
                  <button
                    type="button"
                    aria-label="Buy now"
                    className="block min-h-[42px] min-w-[70px] w-full rounded-lg bg-darkbtn px-4 pt-[10px] pb-[10px] text-center text-[14px] font-bold leading-[21px] text-white"
                  >
                    <span className="block text-center">Buy now</span>
                  </button>
                </div>
                <div className="flex gap-2 pt-0.5 text-[14px] leading-[19.6px]">
                  <span className="flex items-center text-[rgb(71,_131,_255)]">
                    <ShieldIcon />
                  </span>
                  <span className="block">Protected by TradeShield</span>
                </div>
              </div>
            </div>

            {/* stats grid */}
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="flex flex-col gap-1 rounded-lg bg-white px-6 pb-4 pt-4 shadow-[rgba(9,9,11,0.05)_0px_2px_4px_0px,rgba(9,9,11,0.02)_0px_12px_8px_0px] text-[rgb(54,_117,_6)]">
                <span className="block h-5 text-[14px] leading-[19.6px] text-graytext">90-day change</span>
                <span className="flex items-center gap-1 text-[20px] font-bold leading-[30px]">
                  <TrendUpIcon />
                  {d.price.change}
                </span>
              </div>
              <div className="flex flex-col gap-1 rounded-lg bg-white px-6 pb-4 pt-4 shadow-[rgba(9,9,11,0.05)_0px_2px_4px_0px,rgba(9,9,11,0.02)_0px_12px_8px_0px]">
                <span className="block h-5 text-[14px] leading-[19.6px] text-graytext">90-day high</span>
                <span className="flex items-center gap-1 text-[20px] font-bold leading-[30px]">{d.price.high}</span>
              </div>
              <div className="flex flex-col gap-1 rounded-lg bg-white px-6 pb-4 pt-4 shadow-[rgba(9,9,11,0.05)_0px_2px_4px_0px,rgba(9,9,11,0.02)_0px_12px_8px_0px]">
                <span className="block h-5 text-[14px] leading-[19.6px] text-graytext">90-day low</span>
                <span className="flex items-center gap-1 text-[20px] font-bold leading-[30px]">{d.price.low}</span>
              </div>
            </div>

            {/* chart card */}
            <div className="w-full rounded-lg bg-white p-6 shadow-[rgba(9,9,11,0.05)_0px_2px_4px_0px,rgba(9,9,11,0.02)_0px_12px_8px_0px]">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-2">
                  <div className="text-[20px] leading-[30px]">{d.price.chartLabel}</div>
                </div>
                <div>
                  <img
                    alt="90 days daily price chart"
                    src={ROBLOX_PRICE_IMAGES.chart}
                    className="h-[250px] w-full max-w-[1112px] object-cover align-middle"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* SEO section */}
          <section className="mx-auto w-full max-w-[1208px] px-4 pb-16 pt-16 lg:px-6">
            <div className="px-0 lg:px-6">
              <h1 className="mb-6 text-[24px] font-bold leading-[28.8px]">{d.seo.title}</h1>
              {d.seo.paragraphs.map((p) => (
                <p key={p.slice(0, 24)} className="mb-4 text-[14px] leading-[21px]">
                  {p}
                </p>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
