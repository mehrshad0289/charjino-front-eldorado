import { PRODUCT_GAME } from "./data/productData";

/* Desktop-only breadcrumb bar under the game strip (product .make capture:
   small blue chevron + bold 14px "Back to all offers"). The live page shows
   the same bar ("Browse all offers" wording); the capture wording is kept —
   it is the design reference file. Mobile has no bar: the game strip itself
   carries the back chevron (live @390). */

export default function ProductBreadcrumb() {
  return (
    <div className="hidden lg:block">
      <div className="mx-auto flex w-full max-w-[1208px] items-center gap-[10px] px-6 py-3">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M14.5 5.5 8 12l6.5 6.5" stroke="#2d5ead" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <a href={PRODUCT_GAME.backHref} className="text-[14px] font-bold leading-[19.6px] tracking-[0.14px]">
          {PRODUCT_GAME.backLabel}
        </a>
      </div>
    </div>
  );
}
