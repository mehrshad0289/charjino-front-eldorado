/* "Trusted by thousands of players worldwide" (giftcard .make capture):
   centered 30px title over a white rounded card (230px tall on desktop,
   150px content area). The live widget is a Trustpilot reviews carousel
   that renders empty in both references except its attribution line
   (visible on the live mobile reference) — that line is used as the card
   content on all breakpoints instead of an empty white box. */

function TrustpilotStar() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m12 2 2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 16.9l-6.1 3.5 1.5-6.8L2.2 9l6.9-.7L12 2Z" fill="#00b67a" />
    </svg>
  );
}

export default function GiftCardReviews() {
  return (
    <div className="w-full">
      <div className="flex w-full justify-center text-center">
        <span className="block text-center text-[24px] font-bold leading-[36px] md:text-[30px]">
          Trusted by thousands of players worldwide
        </span>
      </div>
      <div className="relative mx-auto mt-6 md:mt-8 md:h-[230px] md:max-w-[1208px]">
        <div className="flex h-full min-h-[120px] items-center justify-center rounded-lg bg-white px-6 pb-8 pt-12 shadow-[rgba(9,9,11,0.05)_0px_2px_4px_0px,rgba(9,9,11,0.02)_0px_12px_8px_0px] md:min-h-[230px] md:py-0">
          <p className="text-center text-[14px] leading-[21px]">
            Rated 4.4 out of 5 based on{" "}
            <a
              href="https://www.trustpilot.com/review/eldorado.gg"
              className="font-bold underline"
            >
              289,757 reviews
            </a>{" "}
            on{" "}
            <span className="inline-flex items-center gap-1 align-middle">
              <TrustpilotStar />
              <span className="font-bold">Trustpilot</span>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
