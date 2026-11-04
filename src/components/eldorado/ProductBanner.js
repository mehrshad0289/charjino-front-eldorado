import { PRODUCT_GAME } from "./data/productData";

/* Product-single game strip (product .make capture + live
   eldorado.gg/efootball-accounts/oa/... @390/1920):
   Desktop (lg+): opaque #282836 bar, game icon + bold game name, no tabs
   (the product page has no Accounts/Coins tabs — capture + live).
   Mobile: same dark bar with a back chevron on the left and the stacked
   game names centered ("eFootball 2027" bold, "eFootball 2026" gray) —
   the live mobile banner doubles as the breadcrumb. */

function GameIcon() {
  return (
    <div className="h-7 shrink-0 overflow-hidden">
      <img alt={PRODUCT_GAME.name} src={PRODUCT_GAME.icon} className="block h-7 w-7 rounded-sm object-cover align-middle" />
    </div>
  );
}

function BackChevron() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M14.5 5.5 8 12l6.5 6.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ProductBanner() {
  return (
    <div className="w-full bg-catactive shadow-[rgba(9,9,11,0.05)_0px_2px_4px_0px,rgba(9,9,11,0.02)_0px_12px_8px_0px]">
      {/* mobile: back chevron + stacked game names (live @390) */}
      <div className="relative flex min-h-[64px] flex-col justify-center px-4 py-2 lg:hidden">
        <a
          href={PRODUCT_GAME.backHref}
          aria-label={PRODUCT_GAME.backLabel}
          className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center"
        >
          <BackChevron />
        </a>
        <div className="pointer-events-none flex flex-col items-center leading-tight">
          <div className="text-[16px] font-bold text-white">{PRODUCT_GAME.name}</div>
          <div className="text-[12px] text-navgray">{PRODUCT_GAME.subName}</div>
        </div>
      </div>

      {/* desktop: game icon + name only (capture has no tabs here) */}
      <div className="mx-auto hidden h-12 w-full max-w-[1208px] items-center px-6 lg:flex">
        <GameIcon />
        <div className="ml-2 font-bold leading-[20px] text-white">{PRODUCT_GAME.name}</div>
      </div>
    </div>
  );
}
