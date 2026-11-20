/* "Lets team up" section from the about capture: speech bubble anchored to
   the mascot, then a 2-column CTA grid with El Drago absolutely positioned
   over the top-right card cell (gridArea 1/2 per the capture — positioned
   elements paint above the static cards), exactly like the capture's DOM. */
import Link from "next/link";

export default function TeamUpSection({ data }) {
  return (
    <section className="flex flex-col items-center" aria-label={data.title}>
      <h2 className="text-center text-[32px] font-bold leading-[36px] lg:text-[48px] lg:leading-[52.8px]">
        {data.title}
      </h2>
      <p className="mt-5 max-w-[860px] text-center text-graytext">
        {data.body}
      </p>


      <div class="mt-6 flex w-full pr-31 sm:mt-9.5 sm:pr-69.5">
        <div class="bg-card relative mr-5.5 max-w-105.25 rounded-xl py-2 pr-2.5 pl-2 sm:mr-15.5 sm:rounded-3xl sm:py-3 sm:pr-7 sm:pl-4.25">
          <p class="text-center text-xs font-bold sm:text-sm">
            {" "}
            {data.bubble}
          </p>
          <svg
            fill="none"
            height="25"
            viewBox="0 0 90 25"
            width="90"
            xmlns="http://www.w3.org/2000/svg"
            class="absolute -right-15.5 bottom-0 hidden sm:block"
          >
            <path
              clip-rule="evenodd"
              d="M0 0V25H3C9.47792 24.9999 15.3803 22.5359 19.8213 18.4941C34.6648 21.2833 59.2719 24.064 89.2021 22.5918C81.6156 21.7122 31.2796 16.2027 27.2422 6.12793C27.7363 4.16706 28 2.11428 28 0H0Z"
              fill-rule="evenodd"
              class="fill-card"
            ></path>
          </svg>
          <svg
            fill="none"
            height="25"
            viewBox="0 0 32 25"
            width="32"
            xmlns="http://www.w3.org/2000/svg"
            class="absolute -right-5.5 bottom-0 sm:hidden"
          >
            <path
              d="M0 0V25C3.94645 24.9999 7.35963 22.7231 9.00195 19.4121C14.4097 21.8453 22.449 23.9014 32 22.5918C29.3933 21.7493 12.7199 16.6599 10.0439 7.37988V0H0Z"
              fill-rule="evenodd"
              class="fill-card"
            ></path>
          </svg>
        </div>
        <div class="max-w-6.5 flex-1"></div>
      </div>



      <div className="relative mt-24 grid w-full gap-6 lg:mt-32 lg:grid-cols-2">
        <div className="absolute start-0 top-[-114px] lg:top-[-200px]  h-[100px] lg:h-[259px] pe-[19px] lg:block">
          <img
            src={data.mascot}
            alt={data.mascotAlt}
            width="259"
            height="259"
            className="block size-[150px] lg:size-[259px] object-cover align-middle"
          />
        </div>
        {data.cards.map((card) => (
          <div
            key={card.title}
            className="flex flex-col gap-6 rounded-2xl border-[0.8px] border-cardborder px-6 pt-14 pb-8 max-lg:pt-8"
            style={{
              backgroundImage:
                "linear-gradient(rgb(255,255,255) 14%, rgb(239,239,241) 100%)",
            }}
          >
            <h3 className="mb-[10px] text-[24px] font-bold leading-[28.8px]">
              {card.title}
            </h3>
            <p className="grow basis-0 text-[14px] leading-[19.6px] text-graytext">
              {card.text}
            </p>
            <div>
              <Link
                href={card.action.href}
                aria-label={card.action.ariaLabel}
                className="inline-flex min-h-[42px] w-full min-w-[70px] items-center justify-center gap-1.5 rounded-lg bg-badgebg px-4 py-[10px] text-center text-[14px] font-bold leading-[16.8px] text-[rgb(20,20,26)]"
              >
                <span className="block text-center">{card.action.label}</span>
                <span aria-hidden="true">
                  <ArrowRight />
                </span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ArrowRight() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="rtl:rotate-180"
    >
      <path
        d="M4 12h15m0 0-6-6m6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
