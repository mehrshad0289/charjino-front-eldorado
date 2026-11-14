import GiftCardBanner from "./GiftCardBanner";

const EFOOTBALL_ICON =
  "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F28eadbfb8c8591ca88f6d0c676e94ecf6d4d258c.png?generation=1793727745920311&alt=media";

const EFOOTBALL_TABS = [
  { key: "accounts", label: "Accounts", href: "/efootball-accounts" },
  { key: "coins", label: "Coins", href: "/efootball-accounts" },
];

export default function GameBanner({ name, href, icon, tabLabel, active, tabs }) {
  const title = name || "eFootball 2027";
  const rows =
    Array.isArray(tabs) && tabs.length > 0
      ? tabs
      : href
        ? [{ key: "hub", label: tabLabel || "اکانت", href }]
        : EFOOTBALL_TABS;
  return (
    <GiftCardBanner
      active={active || rows[0]?.key}
      iconAlt={title}
      gameName={title}
      gameIcon={icon || (!name ? EFOOTBALL_ICON : "")}
      tabs={rows}
    />
  );
}
