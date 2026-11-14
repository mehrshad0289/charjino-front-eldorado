import { GIFT_CARD_IMAGES } from "./data/giftCardData";

/* Shared hub strip (gift-card/steam, shop/accounts/*, games, top-up):
   opaque #282836 bar, icon + name, centered tabs on one row.
   Active tab: brand underline = text width, stuck to the bar bottom,
   with a light yellow glow (Eldorado .category-item.active). */

function ActiveTab({ href, children }) {
  return (
    <a
      href={href}
      className="relative mx-1 flex h-full items-center justify-center whitespace-nowrap py-2 font-bold leading-6 text-white"
    >
      <span className="absolute inset-x-0 bottom-0 h-0.5 bg-brand" aria-hidden="true" />
      <span
        className="pointer-events-none absolute inset-x-0 bottom-0 h-7 opacity-25"
        style={{
          background: "linear-gradient(0deg, #fea900 -7.89%, #ffed473d 71.95%, #ffed4700 0%)",
          filter: "blur(8px)",
        }}
        aria-hidden="true"
      />
      <span className="relative">{children}</span>
    </a>
  );
}

function BannerTab({ href, children }) {
  return (
    <a
      href={href}
      className="mx-1 flex h-full items-center justify-center whitespace-nowrap py-2 leading-6 text-navgray"
    >
      <span className="block">{children}</span>
    </a>
  );
}

function BannerIcon({ alt, src }) {
  if (!src) return <span className="block h-7 w-7 shrink-0 rounded-sm bg-white/15" aria-hidden="true" />;
  return (
    <div className="h-7 shrink-0 overflow-hidden">
      <img alt={alt} src={src} className="block h-7 w-7 rounded-sm object-cover align-middle" />
    </div>
  );
}

function TabNav({ tabs, active, className }) {
  return (
    <nav className={className}>
      <div className="shop-hub-tabs flex h-full flex-nowrap items-stretch overflow-x-auto">
        {tabs.map((tab) => (
          <span key={tab.key} className="flex h-full shrink-0 items-stretch">
            {tab.key === active ? (
              <ActiveTab href={tab.href}>{tab.label || tab.key}</ActiveTab>
            ) : (
              <BannerTab href={tab.href}>{tab.label || tab.key}</BannerTab>
            )}
          </span>
        ))}
      </div>
    </nav>
  );
}

export default function GiftCardBanner({
  active = "gift-cards",
  iconAlt = "xbox gift card",
  gameName = "Xbox",
  gameIcon,
  tabs = [],
}) {
  const icon = gameIcon === undefined ? GIFT_CARD_IMAGES.bannerLogo : gameIcon;
  const showTabs = tabs.length > 0;
  return (
    <div className="w-full bg-catactive shadow-[rgba(9,9,11,0.05)_0px_2px_4px_0px,rgba(9,9,11,0.02)_0px_12px_8px_0px]">
      <div className="flex h-11 items-stretch lg:hidden">
        <div className="flex min-w-0 max-w-[46%] items-center gap-3 ps-4">
          <BannerIcon alt={iconAlt} src={icon} />
          <div className="truncate font-bold leading-[20px] text-white" dir="auto">
            {gameName}
          </div>
        </div>
        {showTabs ? (
          <TabNav tabs={tabs} active={active} className="ms-auto flex h-full min-w-0 items-stretch pe-1" />
        ) : null}
      </div>

      <div className="mx-auto hidden h-14 w-full max-w-[1208px] grid-cols-[1fr_2fr_1fr] px-6 lg:grid">
        <div className="flex min-w-0 items-center gap-3">
          <BannerIcon alt={iconAlt} src={icon} />
          <div className="truncate font-bold leading-[20px] text-white" dir="auto">
            {gameName}
          </div>
        </div>
        {showTabs ? (
          <TabNav
            tabs={tabs}
            active={active}
            className="flex h-full min-w-0 items-stretch justify-center text-[16px]"
          />
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
