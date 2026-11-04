import { GIFT_CARD_PROCESS_STEPS } from "./data/giftCardData";

/* "Effortless buying process" (giftcard .make capture): centered title and
   a 3-column grid of illustrated steps (icon, bold title, gray text).
   Mobile (live @390): the columns stack vertically. Illustrations are the
   capture's own SVG assets. */

export default function GiftCardProcessSteps() {
  return (
    <div className="w-full">
      <div className="flex flex-col items-center gap-8 md:gap-12">
        <div className="max-w-[400px] text-center text-[24px] font-bold leading-[36px] md:text-[30px]">
          Effortless buying process
        </div>
        <div className="grid w-full grid-cols-1 items-start gap-8 md:grid-cols-3 md:gap-8">
          {GIFT_CARD_PROCESS_STEPS.map((step) => (
            <div
              key={step.title}
              aria-label={`Process step: ${step.title}`}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-4 flex h-[125px] items-center text-center">
                <div className="shrink-0 overflow-hidden text-center">
                  <img
                    alt={step.alt}
                    src={step.img}
                    className="block align-middle"
                    width={step.w}
                    height={step.h}
                  />
                </div>
              </div>
              <div className="max-w-[270px] text-center">
                <div className="mb-4 text-center text-[20px] font-bold leading-[28.8px] md:text-[24px]">
                  {step.title}
                </div>
                <p className="text-center text-[16px] leading-[30px] text-graytext md:text-[20px]">
                  {step.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
