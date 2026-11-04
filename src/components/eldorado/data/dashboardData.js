/* Dashboard (logged-in) + login page data — verbatim from the user-pushed
   captures (session 11, commit 58f7236):
   - ui ux/dashbord/www_eldorado_gg_dashboard_offers_Account_*.make
     (decoded snapshots/dashboard-1920px-light-1.tsx, 1920-only)
   - ui ux/login/login_eldorado_gg_loginofile_20aws_co.make
     (decoded snapshots/login-1920px-light-1.tsx, 1920-only)
   All asset URLs verified HTTP 200 on 2026-11-04. The capture's icomoon
   glyphs decode empty (project-wide pattern) — icon keys below map to
   inline SVGs in the components; names for the unnamed header icon buttons
   are documented assumptions. */

const ASSET = "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F";

export const DASHBOARD_USER = {
  name: "NewFloat-0una",
  registered: "Registered: 11/4/26",
  profileUrl: "https://www.eldorado.gg/users/NewFloat-0una",
  avatar: `${ASSET}84921a2fde83d534b819877fa09cd79af209ba7a.svg?generation=1793785993008975&alt=media`,
};

export const DASHBOARD_BANNER = `${ASSET}88ee8d54b0513acd4a7d21d309470a1d431bf0ed.png?generation=1793785993005156&alt=media`;

/* Sidebar nav: groups are collapsible (chevron per capture); active item
   gets the yellow fill (bg rgb(255,201,80)) exactly like the capture's
   "Accounts" row. Links verbatim from the capture hrefs. */
export const DASHBOARD_NAV_GROUPS = [
  {
    icon: "orders",
    label: "Orders",
    children: [
      { label: "Purchased orders", href: "/dashboard/orders/purchased" },
      { label: "Sold orders", href: "/dashboard/orders/sold" },
    ],
  },
  {
    icon: "offers",
    label: "Offers",
    children: [
      { label: "Currency", href: "/dashboard/offers/Currency" },
      { label: "Accounts", href: "/dashboard/offers/Account" },
      { label: "Top Ups", href: "/dashboard/offers/TopUp" },
      { label: "Items", href: "/dashboard/offers/CustomItem" },
      { label: "Gift Cards", href: "/dashboard/offers/GiftCard" },
    ],
  },
  {
    icon: "boosting",
    label: "Boosting",
    children: [{ label: "My requests", href: "/dashboard/boosting/my-requests" }],
  },
];

export const DASHBOARD_NAV_LINKS = [
  { icon: "loyalty", label: "Loyalty", href: "/dashboard/loyalty" },
  { icon: "wallet", label: "Wallet", href: "/dashboard/wallet" },
  { icon: "seller", label: "Become a Seller", href: "/become-seller" },
  { icon: "messages", label: "Messages", href: "/dashboard/messages" },
  { icon: "notifications", label: "Notifications", href: "/dashboard/notifications" },
  { icon: "feedback", label: "Feedback", href: "/dashboard/feedback" },
  { icon: "settings", label: "Account settings", href: "/dashboard/settings" },
];

export const DASHBOARD_VIEW_PROFILE = {
  icon: "profile",
  label: "View Profile",
  href: "https://www.eldorado.gg/users/NewFloat-0una",
};

/* /dashboard/offers/Account page content (empty state — the capture's
   account is brand new and has no offers yet) */
export const DASHBOARD_OFFERS_PAGE = {
  icon: "tag",
  title: "Offers",
  action: { label: "New Offer", href: "/become-seller", ariaLabel: "New Offer" },
  infoBanner: {
    title: "Want to pause all your offers?",
    bodyParts: [
      "Toggle on ",
      { italic: "Offline mode" },
      " under your ",
      { italic: "Account settings" },
      ". That way theres no need to pause each offer one by one.",
    ],
  },
  filters: {
    gamePlaceholder: "Select Game",
    searchPlaceholder: "Search offers",
    sortLabel: "Recommended",
  },
  emptyState: {
    image: `${ASSET}91671a13bded2708951c70c98c7f9d8f11e1ed60.svg?generation=1793785993043728&alt=media`,
    imageAlt: "No results found",
    title: "Nothing found",
    text: "Try to adjust filters to find what you are looking for or create a new offer",
  },
};

/* Session 16 — /dashboard/offers/Currency and /dashboard/offers/TopUp
   (own captures, decoded 2026-11-04, 1920-only): page content identical
   to the Account offers page (title "Offers" + New Offer → /become-seller,
   offline-mode info banner, same "Nothing found" empty state and asset)
   except the filter row carries ONLY the "Select Game" combobox — no
   search input and no sort button exist in either capture. The active
   sidebar row differs per route (Currency / Top Ups). */
export const DASHBOARD_OFFERS_CURRENCY_PAGE = {
  ...DASHBOARD_OFFERS_PAGE,
  filters: { gamePlaceholder: "Select Game" },
};

export const DASHBOARD_OFFERS_TOPUP_PAGE = {
  ...DASHBOARD_OFFERS_PAGE,
  filters: { gamePlaceholder: "Select Game" },
};

/* Session 16 — /dashboard/orders/purchased + /dashboard/orders/sold
   (own captures, decoded 2026-11-04, 1920-only): page header WITHOUT an
   action button, content gap mt-[32px] (offers pages use mt-[4px]); filter
   row = two min-w-[200px] comboboxes ("All statuses", "Recent"); sold adds
   a 200px "Search Orders" input and a right-aligned gray "Download invoice"
   button (bg rgb(244,244,244)). Empty states reuse the offers asset but
   with order-specific texts. Header icon: capture's icomoon glyph is empty
   (project-wide pattern) — "orders" maps to an inline receipt SVG
   (documented assumption, same convention as the tag icon). */
export const DASHBOARD_ORDERS_PURCHASED_PAGE = {
  icon: "orders",
  title: "Purchased orders",
  filters: { status: "All statuses", period: "Recent" },
  emptyState: {
    image: DASHBOARD_OFFERS_PAGE.emptyState.image,
    imageAlt: "No results found",
    title: "Nothing found",
    text: "You have no purchased orders",
  },
};

export const DASHBOARD_ORDERS_SOLD_PAGE = {
  icon: "orders",
  title: "Sold orders",
  filters: {
    status: "All statuses",
    period: "Recent",
    searchPlaceholder: "Search Orders",
    invoiceLabel: "Download invoice",
  },
  emptyState: {
    image: DASHBOARD_OFFERS_PAGE.emptyState.image,
    imageAlt: "No results found",
    title: "Nothing found",
    text: "You have no sold orders",
  },
};

/* Login page (login.eldorado.gg capture) */
export const LOGIN_BG = `${ASSET}fdbcce785891c023ba5cef0f78a6cfaa2620fc0b.png?generation=1793786228667980&alt=media`;

export const LOGIN_PAGE = {
  logo: `${ASSET}bc849c6408d54615c9db00832e00c681bd67d757.svg?generation=1793786228679019&alt=media`,
  logoAlt: "Form logo",
  title: "Sign in",
  socialHeading: "With other accounts",
  socialButtons: [
    { icon: "google", label: "Sign in with Google", href: "https://login.eldorado.gg/oauth2/authorize" },
    { icon: "apple", label: "Continue with Apple", href: "https://login.eldorado.gg/oauth2/authorize" },
    { icon: "facebook", label: "Continue with Facebook", href: "https://login.eldorado.gg/oauth2/authorize" },
  ],
  divider: "Or",
  formHeading: "With existing account",
  emailLabel: "Email address",
  emailPlaceholder: "name@host.com",
  nextLabel: "Next",
  signup: { prefix: "New user? ", label: "Create an account", href: "https://login.eldorado.gg/signup" },
};

export const LOGIN_SOCIAL_ICONS = {
  google: `${ASSET}b0a84ee3d0c12ed7d60027f0bd22cb3bfbe88cfd.svg?generation=1793786228693887&alt=media`,
  apple: `${ASSET}78f4e7d3f11c5ceaf18f71c440b4c0b551e894d8.svg?generation=1793786228680310&alt=media`,
  facebook: `${ASSET}098b837b757c00e1dab59cc77d23a71ffde20f3c.svg?generation=1793786228683139&alt=media`,
};
