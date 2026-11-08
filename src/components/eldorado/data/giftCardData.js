// Data for the Xbox gift card shop page, extracted from the decoded captures
// "ui ux/extracted/snapshots/giftcard-1920px-light-1.tsx" (+ duplicate -2).
// Amount names, order and "From" prices are verbatim from the capture
// (EUR display currency). FAQ answers were scraped live from
// eldorado.gg/xbox-gift-card/v/103 (collapsed in the capture).

const GCS = "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F";

const IMG_DEFAULT = `${GCS}1ff3c58230f086c8c26867c8af7bea5144428ace.png?generation=1793768744599630&alt=media`;
const IMG_TURKEY = `${GCS}87856a5e7c4e02c7fe150cdc22886e93c29361f7.png?generation=1793768744565233&alt=media`;
const IMG_EU20 = `${GCS}adf5dfd241cd1a56457cb2266162e88f30d4cdb5.png?generation=1793768744547602&alt=media`;

export const GIFT_CARD_IMAGES = {
  bannerLogo: `${GCS}dfc6208bcbd66fc42eb981f27c8429a96f0285a1.png?generation=1793768744541913&alt=media`,
  heroBackdrop: `${GCS}3dc1f3acb06f6d5646426b81fc717fa1c1d29d77.png?generation=1793727745913594&alt=media`,
  amountDefault: IMG_DEFAULT,
  offerIcon: `${GCS}2a14dfec006c3244a048e1905c646dafe5fc95db.png?generation=1793768744686144&alt=media`,
  applePay: `${GCS}dd6e842fcce7d583e70dddf074d9307e29d69a8e.svg?generation=1793768744578617&alt=media`,
  googlePay: `${GCS}8916ddaefd4ac6e1dfdec635acab443637130fa2.svg?generation=1793768744565450&alt=media`,
  paypal: `${GCS}30c574904376dfec8831a78ecd59a0a32c9f79bb.svg?generation=1793768744543155&alt=media`,
  trustBackdrop: `${GCS}054d0db0f48c525aee94314b804cdb674aafbb26.png?generation=1793768744750982&alt=media`,
  check: `${GCS}9fd83d67e2df0f879fc4a52ceb09e2c62495082f.svg?generation=1788944034703253&alt=media`,
};

// Dropdown was captured closed; regions match the currencies sold on the page.
export const GIFT_CARD_REGIONS = [
  "United States",
  "United Kingdom",
  "Europe",
  "Canada",
  "Turkey",
];

// 33 cards, capture order. from = "From" price in EUR per the capture header.
export const GIFT_CARD_AMOUNTS = [
  { label: "5 USD", from: "5.09", img: IMG_DEFAULT },
  { label: "5 GBP", from: "12.11", img: IMG_DEFAULT },
  { label: "5 EUR", from: "5.74", img: IMG_DEFAULT },
  { label: "15 CAD", from: "9.82", img: IMG_DEFAULT },
  { label: "10 USD", from: "8.55", img: IMG_DEFAULT },
  { label: "10 GBP", from: "12.28", img: IMG_DEFAULT },
  { label: "10 EUR", from: "10.20", img: IMG_DEFAULT },
  { label: "25 CAD", from: "17.37", img: IMG_DEFAULT },
  { label: "50 TRY", from: "5.84", img: IMG_DEFAULT },
  { label: "15 USD", from: "12.34", img: IMG_DEFAULT },
  { label: "15 GBP", from: "18.38", img: IMG_DEFAULT },
  { label: "15 EUR", from: "15.32", img: IMG_DEFAULT },
  { label: "50 CAD", from: "35.71", img: IMG_DEFAULT },
  { label: "100 TRY", from: "5.84", img: IMG_DEFAULT },
  { label: "20 USD", from: "18.49", img: IMG_DEFAULT },
  { label: "25 GBP", from: "30.72", img: IMG_DEFAULT },
  { label: "25 EUR", from: "26.60", img: IMG_DEFAULT },
  { label: "75 CAD", from: "53.44", img: IMG_DEFAULT },
  { label: "300 TRY", from: "5.85", img: IMG_DEFAULT },
  { label: "25 USD", from: "20.46", img: IMG_DEFAULT },
  { label: "50 GBP", from: "61.53", img: IMG_DEFAULT },
  { label: "50 EUR", from: "51.13", img: IMG_DEFAULT },
  { label: "100 CAD", from: "65.71", img: IMG_DEFAULT },
  { label: "30 USD", from: "27.30", img: IMG_DEFAULT },
  { label: "100 GBP", from: "108.12", img: IMG_DEFAULT },
  { label: "100 EUR", from: "102.00", img: IMG_DEFAULT },
  { label: "1000 TRY", from: "19.70", img: IMG_TURKEY },
  { label: "40 USD", from: "37.21", img: IMG_DEFAULT },
  { label: "20 EUR", from: "20.48", img: IMG_EU20 },
  { label: "50 USD", from: "43.94", img: IMG_DEFAULT },
  { label: "3000 TRY", from: "59.11", img: IMG_TURKEY },
  { label: "100 USD", from: "89.67", img: IMG_DEFAULT },
  { label: "5000 TRY", from: "100.80", img: IMG_TURKEY },
];

// Live mobile reference collapses the grid to the first 8 rows + "View more".
export const GIFT_CARD_MOBILE_PREVIEW_COUNT = 8;

export const GIFT_CARD_PROCESS_STEPS = [
  {
    title: "1. Choose an offer",
    text: "Select the best offer from a top-rated seller.",
    img: `${GCS}b165ae643f2a9138d0fdb2e1e31af77fc5d3afc3.svg?generation=1788944034691575&alt=media`,
    w: 117,
    h: 105,
    alt: "Cursor over a list showing offer selection",
  },
  {
    title: "2. Complete payment",
    text: "Choose a convenient payment method.",
    img: `${GCS}19e9e8ec354d191e71580f1b0decc4bafd21b71b.svg?generation=1788944034713536&alt=media`,
    w: 120,
    h: 120,
    alt: "Credit card and payment chip icons representing secure payment",
  },
  {
    title: "3. Order ready",
    text: "Collect your order and jump into the game.",
    img: `${GCS}793beea2e27a2e306e8436dc53bbed90dfd32a5d.svg?generation=1788944034688355&alt=media`,
    w: 126,
    h: 117,
    alt: "Hero pose indicating successful order completion",
  },
];

// Answers scraped live 2026-11-04 from eldorado.gg/xbox-gift-card/v/103.
// questions array: string paragraphs; when steps is set it renders as an
// ordered list between the intro and the closing paragraph.
export const GIFT_CARD_FAQ = [
  {
    q: "How to redeem Xbox gift card?",
    steps: [
      "You log in to your Xbox account via the method that’s most comfortable for you",
      "Navigate towards the code redemption section",
      "Enter the provided code",
      "The funds should be added to your wallet momentarily or after a short delay.",
    ],
    intro: "The process is fairly easy:",
    after: "If you run into any issues, feel free to contact the seller or repeat the provided steps.",
  },
  {
    q: "Can you use Xbox gift card for Game Pass?",
    paragraphs: [
      "Absolutely! But it depends on what gift card you have - there are cards that charge your wallet and those funds can be used to purchase products from an online store, including the game pass. Other gift cards provide game pass time directly, so you skip the part of recharging your wallet.",
    ],
  },
  {
    q: "How to send Xbox gift card to a friend?",
    paragraphs: [
      "Well, there are few easy ways to transfer the code to your friends or family. When buying through Microsoft, you can enter the friend’s email address. Alternatively, if you buy through Eldorado, you can obtain the code yourself and then give it to your friend whenever you want. This also enables you to connect with the seller faster, in case something goes wrong with code activation/verification.",
    ],
  },
  {
    q: "How to check Xbox gift card balance without redeeming?",
    paragraphs: [
      "Yes, Microsoft allows you to see if the code has been redeemed or not. When you go to the redemption page, you can enter the code in your possession and the system will show what it’s meant for, and if the code has been used already.",
    ],
  },
  {
    q: "What can you use an xbox gift card for?",
    paragraphs: [
      "An Xbox gift card essentially grants money to your box wallet, and you can use those funds for anything that’s purchasable through the online shop. While the physical purchases might be out of reach, all sorts of online-only products, including in-game currencies or game passes, can be bought using the platform’s wallet.",
    ],
  },
  {
    q: "How long does an Xbox gift card last?",
    paragraphs: [
      "The good news is that there is no expiration date for the Xbox gift cards. You can hold on to the card until you’re ready to redeem it, but at the same time - a recharged wallet doesn’t have an expiration date either. So, while you can hold on to the codes, it might be a good idea to redeem them, since then you will have funds readily available for your needs. The only exception to this rule is promotional gift cards, which usually have a certain validation period.",
    ],
  },
];

export const GIFT_CARD_TRUST_ROWS = [
  "Verified professional sellers",
  "Fast Delivery",
  "24/7 live support",
  "Secure and instant payments",
  "Buyer protection and warranty",
  "Wide selection of offers",
];
