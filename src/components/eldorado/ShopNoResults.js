import { SHOP_SUBSCRIPTION_IMAGES } from "./data/shopSubscriptionData";

/* "Nothing found" block inside the amount card (psplus .make capture —
   the page's no-offers state): centered 100px illustration, bold 24/36
   title, gray subtitle, max-w-600, 12px gaps, 48px vertical padding. */

export default function ShopNoResults({ title, text }) {
  return (
    <div aria-label="No results" className="flex justify-center">
      <div className="py-12">
        <div className="flex flex-col items-center gap-3">
          <div className="h-[100px] shrink-0 overflow-hidden">
            <img
              alt="No results found"
              src={SHOP_SUBSCRIPTION_IMAGES.noResults}
              className="block size-[100px] object-cover align-middle"
            />
          </div>
          <div className="text-center text-[24px] font-bold leading-[36px]">{title}</div>
          <div className="pt-1 text-center text-graytext">{text}</div>
        </div>
      </div>
    </div>
  );
}
