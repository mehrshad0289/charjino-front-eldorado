import { GIFT_CARD_IMAGES } from "./data/giftCardData";

/* Dark banner strip on top of the page artwork (giftcard .make capture +
   live eldorado.gg/xbox-gift-card/v/103): opaque #282836 bar wrapping the
   Xbox icon + name and centered Accounts/Game Pass/Gift cards tabs.
   Deviation from the shop_account capture: on the live reference the ACTIVE
   tab underline is brand yellow (not white) — followed here.
   Desktop: 3-col grid per the 1920 capture. Mobile (live @390): stacked
   rows — game name row, then tabs row below.
   Accounts/Game Pass point at the capture's own eldorado URLs (no local
   routes exist for them); Gift cards stays internal/active. */

function ActiveTab({ href, children }) {
  return (
    <a
      href={href}
      className="relative flex items-center justify-center gap-2 whitespace-nowrap px-3 font-bold text-white"
    >
      <span className="absolute inset-x-0 bottom-0 border-b-2 border-brand" aria-hidden="true" />
      <span
        className="absolute inset-0 -z-10 opacity-15 blur-md"
        style={{
          backgroundImage:
            "linear-gradient(0deg, rgb(254, 169, 0) -7.89%, rgba(255, 237, 71, 0.24) 71.95%, rgba(255, 237, 71, 0) 0%)",
        }}
        aria-hidden="true"
      />
      <span className="block">{children}</span>
    </a>
  );
}

function BannerTab({ href, children }) {
  return (
    <a
      href={href}
      className="flex items-center justify-center gap-2 whitespace-nowrap px-3 text-navgray"
    >
      <span className="block">{children}</span>
    </a>
  );
}

function BannerIcon() {
  return (
    <div className="h-7 shrink-0 overflow-hidden">
      <img
        alt="xbox gift card"
        src={GIFT_CARD_IMAGES.bannerLogo}
        className="block h-7 w-7 rounded-sm object-cover align-middle"
      />
    </div>
  );
}

export default function GiftCardBanner() {
  return (
    <div className="w-full bg-catactive shadow-[rgba(9,9,11,0.05)_0px_2px_4px_0px,rgba(9,9,11,0.02)_0px_12px_8px_0px]">
      {/* mobile: stacked — game row, tabs row (live reference @390) */}
      <div className="md:hidden">
        <div className="flex h-11 items-center px-4">
          <BannerIcon />
          <div className="ml-2 truncate font-bold leading-[20px] text-white">Xbox</div>
        </div>
        <nav className="flex items-center px-1 pb-1.5">
          <div className="flex items-center overflow-x-auto text-[13px] leading-none">
            <span className="flex items-center px-2">
              <BannerTab href="https://www.eldorado.gg/xbox-accounts/a/103-1-0">Accounts</BannerTab>
            </span>
            <span className="flex items-center px-2">
              <BannerTab href="https://www.eldorado.gg/xbox-game-pass/t/103">Game Pass</BannerTab>
            </span>
            <span className="flex items-center px-2">
              <ActiveTab href="/xbox-gift-card">Gift cards</ActiveTab>
            </span>
          </div>
        </nav>
      </div>

      {/* desktop: 1fr_2fr_1fr grid per the 1920 capture */}
      <div className="mx-auto hidden h-14 w-full max-w-[1208px] grid-cols-[1fr_2fr_1fr] px-6 md:grid">
        <div className="flex items-center">
          <BannerIcon />
          <div className="ml-2 font-bold leading-[20px] text-white">Xbox</div>
        </div>
        <nav className="flex items-center justify-center">
          <div className="flex items-center justify-center">
            <span className="flex items-center pb-[18px] pt-[13px]">
              <BannerTab href="https://www.eldorado.gg/xbox-accounts/a/103-1-0">Accounts</BannerTab>
            </span>
            <span className="flex items-center pb-[18px] pt-[13px]">
              <BannerTab href="https://www.eldorado.gg/xbox-game-pass/t/103">Game Pass</BannerTab>
            </span>
            <span className="flex items-center pb-[18px] pt-[13px]">
              <ActiveTab href="/xbox-gift-card">Gift cards</ActiveTab>
            </span>
          </div>
        </nav>
      </div>
    </div>
  );
}
