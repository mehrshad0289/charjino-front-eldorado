/* Dark banner strip on top of the game artwork (shop_account.make reference):
   opaque #282836 bar wrapping game icon + name and centered Accounts/Coins
   tabs, active tab underlined + glow.
   Desktop: 3-col grid per the 1920 capture. Mobile (live eldorado.gg
   /efootball-accounts/a/183-1-0 @390): stacked rows — game name row, then
   tabs row below; the name never wraps. */

function AccountsTab() {
  return (
    <a
      href="/efootball-accounts"
      className="relative flex items-center justify-center gap-2 whitespace-nowrap px-3 font-bold text-white"
    >
      <span className="absolute inset-x-0 bottom-0 border-b-2 border-white" aria-hidden="true" />
      <span
        className="absolute inset-0 -z-10 opacity-15 blur-md"
        style={{
          backgroundImage:
            "linear-gradient(0deg, rgb(254, 169, 0) -7.89%, rgba(255, 237, 71, 0.24) 71.95%, rgba(255, 237, 71, 0) 0%)",
        }}
        aria-hidden="true"
      />
      <span className="block">Accounts</span>
    </a>
  );
}

function CoinsTab() {
  return (
    <a
      href="/efootball-accounts"
      className="flex items-center justify-center gap-2 whitespace-nowrap px-3 text-navgray"
    >
      <span className="block">Coins</span>
    </a>
  );
}

function GameIcon() {
  return (
    <div className="h-7 shrink-0 overflow-hidden">
      <img
        alt="efootball accounts"
        src="https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F28eadbfb8c8591ca88f6d0c676e94ecf6d4d258c.png?generation=1793727745920311&alt=media"
        className="block h-7 w-7 rounded-sm object-cover align-middle"
      />
    </div>
  );
}

export default function GameBanner() {
  return (
    <div className="w-full bg-catactive shadow-[rgba(9,9,11,0.05)_0px_2px_4px_0px,rgba(9,9,11,0.02)_0px_12px_8px_0px]">
      {/* mobile: stacked — game row, tabs row (live reference @390) */}
      <div className="md:hidden">
        <div className="flex h-11 items-center px-4">
          <GameIcon />
          <div className="ml-2 truncate font-bold leading-[20px] text-white">eFootball 2027</div>
        </div>
        <nav className="flex items-center px-1 pb-1.5">
          <div className="flex items-center overflow-x-auto">
            <span className="flex items-center px-2 text-[13px] leading-none">
              <AccountsTab />
            </span>
            <span className="flex items-center px-2 text-[13px] leading-none">
              <CoinsTab />
            </span>
          </div>
        </nav>
      </div>

      {/* desktop: 1fr_2fr_1fr grid per the 1920 capture */}
      <div className="mx-auto hidden h-14 w-full max-w-[1208px] grid-cols-[1fr_2fr_1fr] px-6 md:grid">
        <div className="flex items-center">
          <GameIcon />
          <div className="ml-2 font-bold leading-[20px] text-white">eFootball 2027</div>
        </div>
        <nav className="flex items-center justify-center">
          <div className="flex items-center justify-center">
            <span className="flex items-center pb-[18px] pt-[13px]">
              <AccountsTab />
            </span>
            <span className="flex items-center pb-[18px] pt-[13px]">
              <CoinsTab />
            </span>
          </div>
        </nav>
      </div>
    </div>
  );
}
