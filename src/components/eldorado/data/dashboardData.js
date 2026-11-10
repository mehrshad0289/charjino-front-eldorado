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

import { FA } from "./faCopy";

const ASSET = "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F";

export const DASHBOARD_USER = {
  name: "NewFloat-0una",
  registered: "Registered: 11/4/26",
  /* Session 18: the profile route now exists in the clone — internal href
     (was the live https://www.eldorado.gg/users/NewFloat-0una URL). */
  profileUrl: "/users/NewFloat-0una",
  avatar: `${ASSET}84921a2fde83d534b819877fa09cd79af209ba7a.svg?generation=1793785993008975&alt=media`,
};

export const DASHBOARD_BANNER = `${ASSET}88ee8d54b0513acd4a7d21d309470a1d431bf0ed.png?generation=1793785993005156&alt=media`;

/* Sidebar nav: groups are collapsible (chevron per capture); active item
   gets the yellow fill (bg rgb(255,201,80)) exactly like the capture's
   "Accounts" row. Links verbatim from the capture hrefs. */
export const DASHBOARD_NAV_GROUPS = [
  {
    icon: "orders",
    id: "Orders",
    label: FA.orders,
    children: [
      { id: "Purchased orders", label: FA.purchasedOrders, href: "/dashboard/orders/purchased" },
      { id: "Sold orders", label: FA.soldOrders, href: "/dashboard/orders/sold" },
    ],
  },
  {
    icon: "offers",
    id: "Offers",
    label: FA.offers,
    children: [
      { id: "Accounts", label: FA.accounts, href: "/dashboard/offers/Account" },
      { id: "Top Ups", label: FA.topUps, href: "/dashboard/offers/TopUp" },
      { id: "Items", label: FA.items, href: "/dashboard/offers/CustomItem" },
      { id: "Gift Cards", label: FA.giftCards, href: "/dashboard/offers/GiftCard" },
      { id: "Currency", label: FA.currency, href: "/dashboard/offers/Currency" },
    ],
  },
  {
    icon: "boosting",
    id: "Boosting",
    label: FA.boosting,
    children: [{ id: "My requests", label: FA.myRequests, href: "/dashboard/boosting/my-requests" }],
  },
];

/* Session 17: the five newest captures (CustomItem, Feedback, Wallet,
   Messages, loyalty — all captured 2026-11-04/05) no longer contain the
   "Become a Seller" sidebar link that the older dashboard/Account captures
   had. Treated as a live-site change, not a per-page variation: removed
   from the shared nav (the link itself lives on at /become-seller). */
export const DASHBOARD_NAV_LINKS = [
  { icon: "loyalty", id: "Loyalty", label: FA.loyalty, href: "/dashboard/loyalty" },
  { icon: "wallet", id: "Wallet", label: FA.wallet, href: "/dashboard/wallet" },
  { icon: "messages", id: "Messages", label: FA.messages, href: "/dashboard/messages" },
  { icon: "notifications", id: "Notifications", label: FA.notifications, href: "/dashboard/notifications" },
  { icon: "feedback", id: "Feedback", label: FA.feedback, href: "/dashboard/feedback" },
  { icon: "settings", id: "Account settings", label: FA.accountSettings, href: "/dashboard/settings" },
];

export const DASHBOARD_VIEW_PROFILE = {
  icon: "profile",
  id: "View Profile",
  label: FA.viewProfile,
  href: "/dashboard/settings",
};

/* /dashboard/offers/Account page content (empty state — the capture's
   account is brand new and has no offers yet) */
export const DASHBOARD_OFFERS_PAGE = {
  icon: "tag",
  title: FA.offers,
  action: { label: FA.newOffer, href: "/become-seller", ariaLabel: FA.newOffer },
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

/* Session 18 — /dashboard/offers/GiftCard (own capture, decoded 2026-11-04,
   1920-only, deflate+0 variant): same offers template as Currency/TopUp —
   h1 "Offers" + New Offer → /become-seller, offline-mode banner, "Select
   Game" combobox only, "Nothing found" empty state. Active sidebar row:
   Gift Cards (bg rgb(255,201,80) verbatim in the capture). */
export const DASHBOARD_OFFERS_GIFTCARD_PAGE = {
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
  title: FA.purchasedOrders,
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
  title: FA.soldOrders,
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

/* Session 17 — /dashboard/feedback, /dashboard/wallet, /dashboard/messages
   (own captures `ui ux/{Feedback,Wallet,Messages}/…`, decoded 2026-11-05,
   1920-only, by scripts/decode_session17_captures.py — feedback via the
   fig-make+zstd path, the other two via the newer
   [u32 clen][4B][raw-deflate] chunk variant). /dashboard/loyalty from the
   same capture batch is session-16 work (DashboardLoyalty.js). Header
   icons: the captures' icomoon glyphs are empty (project-wide pattern) —
   inline SVG replacements (documented assumption, same convention as the
   tag/orders icons). */

export const DASHBOARD_FEEDBACK_PAGE = {
  icon: "feedback",
  title: FA.feedback,
  stats: [
    { icon: "completed", label: "Completed orders", value: "0" },
    { icon: "positive", label: "Positive feedback", value: "0" },
    { icon: "negative", label: "Negative feedback", value: "0" },
    { icon: "score", label: "Feedback score", value: "0%" },
  ],
  filters: ["All", "Positive", "Negative"],
  emptyState: {
    image: DASHBOARD_OFFERS_PAGE.emptyState.image,
    imageAlt: "No results found",
    title: "Nothing found",
    text: "",
  },
};

export const DASHBOARD_WALLET_PAGE = {
  icon: "wallet",
  title: FA.wallet,
  balanceLabel: "Balance",
  balanceValue: "0.00",
  filterLabel: "All",
  columns: ["Date Created", "Balance change", "Order ID", "Description"],
  columnWidths: ["20%", "15%", "31%", "34%"],
};

export const DASHBOARD_MESSAGES_PAGE = {
  icon: "messages",
  title: FA.messages,
  /* Session 22 (messages-notempty capture): the empty state is gone —
     the page now renders a filter chip row + an "Unread messages only"
     toggle above an (in every reference) client-rendered chat container.
     Chips verbatim: All active (dark), the rest on rgb(244,244,244). */
  chips: ["All", "Boosting", "Orders", "Support", "Pre-purchase"],
  unreadToggleLabel: "Unread messages only",
};

/* Session 18 — /dashboard/settings (own capture, decoded 2026-11-04,
   1920-only, deflate+0 variant): h1 "Account settings" + five white
   shadow cards (Profile / Profile picture / Security / Email
   notifications / Your description). Email + Username render as disabled
   gray inputs (bg rgb(239,239,241), text rgb(198,198,204)) with a blue
   uppercase "Edit" label; password row = dark "Change password" button.
   Toggles verbatim from the capture: master "All email notifications" OFF,
   "Boosting offers" OFF, the other seven ON (track rgba(71,131,255,0.2)
   with a blue rgb(71,131,255) knob; off track rgb(231,231,231), white
   knob). Description textarea is EMPTY with placeholder "Type here...". */
export const DASHBOARD_SETTINGS_PAGE = {
  icon: "settings",
  title: FA.accountSettings,
  email: "mehrshad02899@gmail.com",
  emailNote: "This email is linked to your account. It is not visible to other users.",
  username: "NewFloat-0una",
  changePassword: "Change password",
  passwordNote:
    "Password can only be changed if you are using the email/password login flow",
  pictureNote: "Must be JPEG, PNG or HEIC and cannot exceed 10MB.",
  twoFa: {
    label: "Set Up 2FA",
    bodyParts: [
      "Enable with Google Authenticator. 2FA codes will be requested for ",
      { bold: "withdrawals" },
      " and",
      { bold: "purchases" },
      ". They are not ",
      { bold: "required for logging in" },
      ".",
    ],
  },
  logout: {
    label: "Log out from all devices",
    body: "This button logs you out from all devices and browsers.",
    footnote: "* This action can take up to 1 hour to complete.",
  },
  notifications: [
    { label: "All email notifications", desc: "", on: false, master: true },
    { label: "New order", desc: "When you receive a new order", on: true },
    { label: "Message received", desc: "When you receive a new message", on: true },
    { label: "Order updates", desc: "When your order status changes", on: true },
    { label: "Dispute updates", desc: "When your dispute is resolved or updated", on: true },
    { label: "Payment updates", desc: "When your payment is received or refunded", on: true },
    { label: "Withdrawal updates", desc: "When you request a withdrawal, and when it is processed", on: true },
    { label: "Verification updates", desc: "When your verification is processed or updated", on: true },
    { label: "Boosting offers", desc: "When you receive boosting offers or updates", on: false },
  ],
  descriptionPlaceholder: "Type here...",
  changeDescription: "Change description",
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
