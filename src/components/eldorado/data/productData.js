// Data for the product-single page, extracted from the decoded capture
// "ui ux/extracted/snapshots/product-1920px-light-1.tsx" (+ duplicate -2)
// uploaded as ui ux/product-single/www_eldorado_gg_efootball-accounts_oa_2f48f97f-c412-48b0-c3a4-08df0a5485be_1920w_390w_1536w_default.make
// Offer fields, carousel cards, "More like this" grid cards and the seller
// card are verbatim from the capture (EUR display prices, capture order).
// The "How we protect your purchase" expanded features and the Warranty
// tooltip (Covered / Not covered) were scraped live 2026-11-04 from
// eldorado.gg/efootball-accounts/oa/2f48f97f-c412-48b0-c3a4-08df0a5485be
// (the capture shows the accordion collapsed with empty <li> placeholders).

const GCS = "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F";

export const PRODUCT_ID = "2f48f97f-c412-48b0-c3a4-08df0a5485be";

// Game strip (same game icon asset as GameBanner on the accounts page).
export const PRODUCT_GAME = {
  icon: `${GCS}28eadbfb8c8591ca88f6d0c676e94ecf6d4d258c.png?generation=1793727745920311&alt=media`,
  name: "eFootball 2027",
  subName: "eFootball 2026",
  backLabel: "Back to all offers",
  backHref: "/efootball-accounts",
};

// Offer, capture verbatim.
export const PRODUCT = {
  title: "[ ANDROID ] ACC 3000 COINS, 2.5M GP",
  price: "2.38",
  image: `${GCS}0191c5b5567e197c421e9ef2d04075cca2aadbb7.png?generation=1793778240464303&alt=media`,
  details: [
    { label: "Game Series", value: "eFootball 2026", mobileHidden: true },
    { label: "Original email", value: "Included", info: true },
    { label: "Warranty", value: "5 days free", info: true },
    { label: "Delivery time", value: "Instant", instant: true, info: true },
  ],
  description: `ANDROID ONLY, ANDROID ONLY
DO NOT LOGIN TO IOS ( IPHONE, IPAD ETC )
Random Region

Login Through KONAMI ID

1. On the Title screen, check the bottom right corner, select "Data Transfer," and then choose  "Konami ID."
2. Enter your Konami ID and password, then complete the human verification step by selecting the matching images.

SOMENTE PARA ANDROID, SOMENTE PARA ANDROID
NÃO FAÇA LOGIN EM SISTEMAS IOS (IPHONE, IPAD ETC.)
Região Aleatória

Login com o ID Konami

1. Na tela inicial, verifique o canto inferior direito, selecione "Transferência de Dados" e, em seguida, escolha "ID Konami".
2. Insira seu ID Konami e senha e conclua a verificação humana selecionando as imagens correspondentes.`,
  // Offer chips above the description (capture): blue icon + bold label + ⓘ
  chips: ["Full email access", "Original email"],
};

// Top "More like this" carousel, 4 capture cards (title / seller / feedback /
// price; teal bolt-only delivery). Live page 1 shows the same 4 cards.
export const PRODUCT_CAROUSEL = [
  { title: "Efb  Starter HALAND BT KONAMI ONLI-ANG", seller: "TsandraStore92", feedback: "100%", count: "(3583)", price: "2.75" },
  { title: "IOS | 3K Coins | 3M GP", seller: "Cat_GG", feedback: "98.8%", count: "(3726)", price: "2.81" },
  { title: "Rare powerful LBGiovanni van Bronckhorst 105 (Netherlands) Daniele Massaro (AC Milan / Italy) 103 Eto 103 Messi Highligh 104", seller: "TrimDance-dC2a", feedback: "100%", count: "(3)", price: "2.75" },
  { title: "Mobile|PW 2101|Bellingham BigTime New,Mark Van Bommel Epic|2026|Check SS EFB2750B", seller: "BestSpeed", feedback: "98.6%", count: "(11,982)", price: "2.27" },
];

// Bottom "More like this" grid, 9 capture cards + "+15 more" cell.
// 58px thumbnail, no game-name line in the capture (live-only detail).
export const PRODUCT_MORE_CARDS = [
  { title: "iOS | 2000 Coins | 1.5-2.5M GP | Random 5 Player", seller: "PalmPremium-", feedback: "100%", count: "(19,466)", price: "2.44", delivery: "Get instantly", img: `${GCS}0bdd969d2f24d8b4de7fe2d53e8147e4b62b84c5.png?generation=1793778240483835&alt=media` },
  { title: "IOS | 2K Coins | 1.5M-2.2M GP", seller: "Cat_GG", feedback: "98.8%", count: "(3726)", price: "2.34", delivery: "Get instantly", img: `${GCS}6c502fe560acae826edb89be6743599356aad58a.png?generation=1793778240488797&alt=media` },
  { title: "Android | 2K Coins | 1.8M-2.2M GP", seller: "Cat_GG", feedback: "98.8%", count: "(3726)", price: "2.34", delivery: "Get instantly", img: `${GCS}6c502fe560acae826edb89be6743599356aad58a.png?generation=1793778240488797&alt=media` },
  { title: "Global Android onlyEFootball 2026 3K Gold | GP 3 million | random 1-10 star players", seller: "SassyPalm-okvt", feedback: "98%", count: "(1708)", price: "2.81", delivery: "Get instantly", img: `${GCS}16f4ac09b4f83be12074be00627fd252d13a72c0.png?generation=1793778240477057&alt=media` },
  { title: "Global Android onlyEFootball 2026 3K Gold | GP 3 million | random 1-10 star players", seller: "Cat_GG", feedback: "98.8%", count: "(3726)", price: "2.81", delivery: "Get instantly", img: `${GCS}3c72e534b7f8dbb8c48fd1c8edcf0d682c6e465e.jpg?generation=1793778240510310&alt=media` },
  { title: "Efootball 2026  102 paul scholes", seller: "VortexVaultGG", feedback: "99.3%", count: "(685)", price: "2.04", delivery: "Get instantly", img: `${GCS}b1ce645177e7e7d32d6af47e50165becdb5184c4.jpg?generation=1793778240493574&alt=media` },
  { title: "Efootball 2026 Android coin 480", seller: "VortexVaultGG", feedback: "99.3%", count: "(685)", price: "2.74", delivery: "Get instantly", img: `${GCS}af2346b1bd54bff3761b8a732511a4cd8c6c5986.jpg?generation=1793778240514398&alt=media` },
  { title: "Mobile|PW 3053|Epic Diego Costa,Aubameyang,david Seaman,SHW C Romero,Etc|2026|Check SS|EFB4152B", seller: "BestSpeed", feedback: "98.6%", count: "(11,982)", price: "2.83", delivery: "1 day", img: `${GCS}680e893621daa70d49d3def7f2e9bcbf5ac0c1da.jpg?generation=1793778240651686&alt=media` },
  { title: "Mobile|PW 2093|Bigtime Mbappe 9 Jul 26|Konami ID|Check SS(EFB754Z)", seller: "GGZone", feedback: "100%", count: "(27)", price: "2.26", delivery: "1 day", img: `${GCS}696a11c7c29bdc40740c3f4d622b7204ffe5a577.jpg?generation=1793778240659371&alt=media` },
];
export const PRODUCT_MORE_EXTRA = "+15 more";

// Seller card, capture verbatim (avatar / name / "99.6% positive feedback"
// link / Online dot / orders / selling-since rows / "Verified ID" chip).
export const PRODUCT_SELLER = {
  name: "Rintana93",
  avatar: `${GCS}a8d906b4b068a63daeb90440343f3dd81ded4545.png?generation=1793778240490383&alt=media`,
  feedback: "99.6%",
  online: "Online",
  orders: "2,699 orders delivered",
  sellingSince: "Selling since Mar 31, 2026",
  verifiedChip: "Verified ID",
};

// "How we protect your purchase" accordion content, scraped live 2026-11-04
// (capture shows the panel collapsed).
export const PRODUCT_PROTECT = [
  { title: "Verified sellers", text: "Sellers must confirm their identity before they can list and sell." },
  { title: "Payment held until delivery is confirmed", text: "Seller receives money only after you mark the order as received." },
  { title: "Free warranty included", text: "If the account isn't as described, you're covered at no extra cost." },
  { title: "Optional extended warranty", text: "Add extra protection for longer-lasting peace of mind." },
];

// Warranty ⓘ tooltip content, scraped live 2026-11-04 (hover). The capture's
// tooltip DOM is empty; no tooltip content exists for the other ⓘ buttons.
export const PRODUCT_WARRANTY_TOOLTIP = {
  covered: ["Account doesn't work or isn't as described", "Seller recovers the account (you lose access)", "Ban caused by ownership transfer", "Ban caused by the seller's actions"],
  notCovered: ["Ban caused by your actions (e.g., cheats)", "Lost access not tied to the seller (e.g., forgot password)", "Ban from ignoring seller instructions (e.g., contacting support)", "Reselling the account (warranty becomes void)"],
};

// Payment badges shared with the gift card / game pass captures (same GCS
// asset URLs, all verified HTTP 200).
export const PRODUCT_PAYMENTS = {
  applePay: `${GCS}dd6e842fcce7d583e70dddf074d9307e29d69a8e.svg?generation=1793768744578617&alt=media`,
  googlePay: `${GCS}8916ddaefd4ac6e1dfdec635acab443637130fa2.svg?generation=1793768744565450&alt=media`,
  paypal: `${GCS}30c574904376dfec8831a78ecd59a0a32c9f79bb.svg?generation=1793768744543155&alt=media`,
};
