import { GIFT_CARD_PROCESS_STEPS } from "./data/giftCardData";

/* "Effortless buying process" (giftcard .make capture): centered title and
   a 3-column grid of illustrated steps (icon, bold title, gray text).
   Mobile (live @390): the columns stack vertically. Illustrations are the
   capture's own SVG assets. */

export default function GiftCardProcessSteps({ title = "Effortless buying process", steps }) {
  const items = (Array.isArray(steps) && steps.length > 0 ? steps : GIFT_CARD_PROCESS_STEPS).map((step, index) => {
    const art = GIFT_CARD_PROCESS_STEPS[index] || GIFT_CARD_PROCESS_STEPS[0];
    return {
      title: step.title || art.title,
      text: step.text || art.text,
      img: step.img || art.img,
      w: step.w || art.w,
      h: step.h || art.h,
      alt: step.alt || art.alt,
    };
  });
  return (
    <div className="w-full">
      <div className="flex flex-col items-center gap-8 lg:gap-12">
        <div className="max-w-[280px] text-center text-[24px] font-bold leading-[36px] lg:max-w-[400px] lg:text-[30px]">
          {title}
        </div>
        <div className="grid w-full grid-cols-1 items-start gap-8 lg:grid-cols-3 lg:gap-8">
          {items.map((step) => (
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
                <div className="mb-4 text-center text-[20px] font-bold leading-[28.8px] lg:text-[24px]">
                  {step.title}
                </div>
                <p className="text-center text-[16px] leading-[30px] text-graytext lg:text-[20px]">
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
