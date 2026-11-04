/* "Lets team up" section from the about capture: speech bubble anchored to
   the mascot, then a 2-column CTA grid with El Drago absolutely positioned
   over the top-right card cell (gridArea 1/2 per the capture — positioned
   elements paint above the static cards), exactly like the capture's DOM. */
export default function TeamUpSection({ data }) {
  return (
    <section className="flex flex-col items-center" aria-label={data.title}>
      <h2 className="text-center text-[48px] font-bold leading-[52.8px]">{data.title}</h2>
      <p className="mt-5 max-w-[860px] text-center text-graytext">{data.body}</p>

      <div className="mt-[38px] flex w-full justify-end lg:pr-[278px]">
        <div className="relative mr-[62px] max-w-[421px] rounded-3xl bg-card pb-3 pl-[17px] pr-7 pt-3 max-lg:mr-6">
          <p className="text-center text-[14px] font-bold leading-[19.6px]">{data.bubble}</p>
          {/* tail arrow sits 62px outside the bubble (per the capture) —
              hidden below lg where it would overflow the viewport. Eager:
              lazy-loading mid-page decorations missed the paint window. */}
          <img
            src={data.bubbleArrow}
            alt=""
            width="90"
            height="25"
            className="absolute bottom-0 right-[-62px] hidden h-[25px] w-[90px] lg:block"
          />
        </div>
        <div className="hidden max-w-[26px] grow basis-0 lg:block" />
      </div>

      <div className="relative mt-32 grid w-full gap-6 max-lg:mt-24 lg:grid-cols-2">
        <div className="absolute right-0 top-0 hidden h-[259px] pr-[19px] lg:block">
          <img
            src={data.mascot}
            alt={data.mascotAlt}
            width="259"
            height="259"
            className="block size-[259px] object-cover align-middle"
          />
        </div>
        {data.cards.map((card) => (
          <div
            key={card.title}
            className="flex flex-col gap-6 rounded-2xl border-[0.8px] border-cardborder pb-8 pl-6 pr-6 pt-12 max-lg:pt-8"
            style={{ backgroundImage: "linear-gradient(rgb(255,255,255) 14%, rgb(239,239,241) 100%)" }}
          >
            <h3 className="mb-[10px] text-[24px] font-bold leading-[28.8px]">{card.title}</h3>
            <p className="grow basis-0 text-[14px] leading-[19.6px] text-graytext">{card.text}</p>
            <div>
              <a
                href={card.action.href}
                aria-label={card.action.ariaLabel}
                className="inline-flex min-h-[42px] w-full min-w-[70px] items-center justify-center gap-1.5 rounded-lg bg-badgebg px-4 py-[10px] text-center text-[14px] font-bold leading-[16.8px] text-[rgb(20,20,26)]"
              >
                <span className="block text-center">{card.action.label}</span>
                <span aria-hidden="true">
                  <ArrowRight />
                </span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ArrowRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 12h15m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
