/* Session 18 — /users/NewFloat-0una profile pages data, verbatim from the
   user-pushed captures (View Profile/About + Shop, 1920-only, decoded
   2026-11-04). The Reviews capture (.h2d container) is an undecodable
   binary — its tab content follows the LIVE page (probed 2026-11-04:
   All/Positive/Negative chips + "Nothing found" empty state without a
   subtitle; documented live-first fallback, same convention as the
   category archives). Chip / filter icons: the capture's icomoon glyphs
   decode empty (project-wide pattern) — inline SVG replacements in
   UserProfilePage.js (documented assumptions). */

export const PROFILE_BANNER = "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F85d513cb89885b578b89a08cd2b524bba50e910a.svg?generation=1793801447468662&alt=media";

export const PROFILE_LOYALTY_BADGE = "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F38035918d9d8fdcf6bac9f12adef7d0a91b47c5d.svg?generation=1793801447494222&alt=media";

export const PROFILE_USER = {
  username: "NewFloat-0una",
  name: "NewFloat-0una",
  online: true,
  registered: "Nov 4, 2026",
  profileUrl: "https://www.eldorado.gg/users/NewFloat-0una",
};

/* Shop tab chips — counts (0) and active row (Currency, yellow circle)
   verbatim from the vpshop capture. */
export const PROFILE_SHOP_CHIPS = [
  { icon: "coin", label: "Currency", count: 0, active: true },
  { icon: "account", label: "Accounts", count: 0, active: false },
  { icon: "item", label: "Items", count: 0, active: false },
  { icon: "topup", label: "Top Ups", count: 0, active: false },
  { icon: "giftcard", label: "Gift Cards", count: 0, active: false },
];

export const PROFILE_SHOP_GAME_FILTER = "All Games";

export const PROFILE_SHOP_EMPTY = {
  title: "Nothing found",
  text: "Sorry, but nothing matched your filters or search terms.",
};

/* Reviews tab — live-first (see header note): no counts, chips without
   numbers, empty state WITHOUT the subtitle line. */
export const PROFILE_REVIEW_FILTERS = [
  { label: "All", active: true },
  { label: "Positive", icon: "thumbup", active: false },
  { label: "Negative", icon: "thumbdown", active: false },
];

export const PROFILE_REVIEWS_EMPTY = { title: "Nothing found", text: "" };

export const PROFILE_ABOUT = {
  title: "About",
  descriptionLabel: "Description",
  description: "No description",
};

export const PROFILE_TABS = [
  { label: "Shop", tab: "shop" },
  { label: "Reviews", tab: "reviews" },
  { label: "About", tab: "about" },
];
