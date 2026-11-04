/* Checkout page data (/checkout) — session 19, from the user-pushed
   capture `ui ux/checkout/
   www_eldorauantity_1_category_RequestedBoosting_gameId_142_…make`
   (origin 5e937e0 — the filename lost "eldorado_gg_checko" upstream;
   URL on live: /checkout?quantity=1&category=RequestedBoosting&gameId=142,
   which 404-redirects without a cart session — the capture is the ONLY
   reference; responsive below 1920 is a documented approximation).
   Asset URLs verbatim from the capture, each verified HTTP 200
   individually (scripts/verify_checkout_assets.py — 29/29). */

export const CK_LOGO =
  "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F92b00c6365c83b373fef3d4d19c27ab7824a518b.svg?generation=1793807821041066&alt=media";

export const CK_PRODUCT = {
  title: "Division Rivals",
  img: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2Fc1b27c0e4b900220f2048386756256afe9d4e8c3.png?generation=1793807821039702&alt=media",
  alt: "Division Rivals",
  meta: [
    "Delivery time: 3 days",
    "Current division: Division 9",
    "Platform: PC - Steam",
    "Desired division: Elite",
    "Other options: 1",
  ],
  seller: "Joren",
  sellerStatus: "Online",
  sellerChips: [
    { label: "100% positive", icon: "thumb" },
    { label: "7410 reviews", icon: "star" },
    { label: "Verified since 2025", icon: "badge" },
  ],
};

/* Payment methods — order + sublabels verbatim; radios are the capture's
   own SVG imgs (row 1 checked / rest unchecked). Brand logo strips keep
   the capture's img order. */
export const CK_PAYMENTS = [
  {
    name: "Apple Pay",
    checked: true,
    radio: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2Fdd100d6ab2f62452fb86d79448d7e8b00a706f63.svg?generation=1793807821026817&alt=media",
    logos: [
      { src: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2Fdd6e842fcce7d583e70dddf074d9307e29d69a8e.svg?generation=1793768744578617&alt=media", alt: "PrimerApplePay", last: true },
    ],
  },
  {
    name: "Credit or debit card",
    sub: "Pay in one click next time",
    subColor: "linkblue",
    radio: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2Fa8cf63b945f50b2fddb4c171f2971d894d58d9bb.svg?generation=1793807821039245&alt=media",
    logos: [
      { src: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2Fe0b5be7c257944edb1198215e120be68526f50da.svg?generation=1793807821041065&alt=media", alt: "Primer" },
      { src: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2Ff2e489f7120ad0827baaa6a9d47430fa6aabf3ae.svg?generation=1793807821055375&alt=media", alt: "Primer" },
      { src: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F45703f20371d78a86431b1b4ccec16140e7f8497.svg?generation=1793807821041449&alt=media", alt: "Primer" },
      { src: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F9679bbe168ddff22918373c28657f4df81c953c8.svg?generation=1793807821066534&alt=media", alt: "Primer" },
      { src: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F194afeacba9d62824905acda22c8c5c9f691d7b1.svg?generation=1793807821061728&alt=media", alt: "Primer" },
      { src: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2Fa0d9a98320b85da9bfeaa2e2c0a3d8b343c47cc4.svg?generation=1793807821077992&alt=media", alt: "Primer" },
      { src: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F3dbdbd1c14021f1a1964378e2e25409ed4c2787f.svg?generation=1793807821213617&alt=media", alt: "Primer", last: true },
    ],
  },
  {
    name: "PayPal",
    radio: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F13d5deec64b52a92bb9da87586a64e370112da55.svg?generation=1793807821264259&alt=media",
    logos: [
      { src: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F30c574904376dfec8831a78ecd59a0a32c9f79bb.svg?generation=1793768744543155&alt=media", alt: "PrimerPayPal", last: true },
    ],
  },
  {
    name: "Google Pay",
    radio: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F1e2a0c5b9171e1b032c84501a5a1bfa1522a5b6f.svg?generation=1793807821232896&alt=media",
    logos: [
      { src: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F8916ddaefd4ac6e1dfdec635acab443637130fa2.svg?generation=1793768744565450&alt=media", alt: "PrimerGooglePay", last: true },
    ],
  },
  {
    name: "Klarna",
    radio: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2Fad902724b727bfb08702caea43a63ce2862ac4f7.svg?generation=1793807821240507&alt=media",
    logos: [
      { src: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F9046ede43fe5fc5eaea18602234df62b9ef2a359.svg?generation=1793807821281710&alt=media", alt: "CheckoutKlarna", last: true },
    ],
  },
  {
    name: "Alipay",
    sub: "May take up to 10 min",
    subColor: "graytext",
    radio: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2Ff16a785491325d533ce306c16f28cb44f5121702.svg?generation=1793807821282272&alt=media",
    logos: [
      { src: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F597092594206fa0be9f3270c433caaac010bd5e2.svg?generation=1793807821282209&alt=media", alt: "PrimerAlipay", last: true },
    ],
  },
  {
    name: "Cryptocurrency",
    radio: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F60840e036672db4a0856aca3b654b777ffa8d9f5.svg?generation=1793807821255037&alt=media",
    logos: [
      { src: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F34768c0f3de632f20bef3e0a2bc239fe8d88d625.svg?generation=1793807821270389&alt=media", alt: "Coingate" },
      { src: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F8b88f66f81c7a02251a77fe89cf31ae902a391d9.svg?generation=1793807821262075&alt=media", alt: "Coingate" },
      { src: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F4d2ddd7ffe713b6e70f07bb80058949f21a56a61.svg?generation=1793807821421758&alt=media", alt: "Coingate" },
      { src: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F9493604b751d030900ccf73fa19f9f285b770893.svg?generation=1793807821426063&alt=media", alt: "Coingate" },
      { src: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F95df9ded203e96bf42bb82f681b67678f3b42073.svg?generation=1793807821439142&alt=media", alt: "Coingate", last: true },
    ],
  },
];

export const CK_SAFE_PAYMENT =
  "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2Fae5aad08699ab52c5166dc544d4490693dae8c5e.png?generation=1793807821447519&alt=media";

export const CK_SUMMARY = {
  orderPrice: "73.34",
  paymentFees: "6.15",
  loyaltyPoints: "+ 5520",
  loyaltyCoin:
    "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2Fc3ac538a8837c344633a077c463dbe0d899e18be.svg?generation=1793800884935445&alt=media",
  total: "79.49",
};

/* The black pay button carries the Apple Pay wordmark as an inline SVG
   data URI — verbatim from the capture. */
export const CK_PAY_BUTTON_BG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 512'%3E%3Cpath fill='%23fff' d='M116.9 158.5c-7.5 8.9-19.5 15.9-31.5 14.9-1.5-12 4.4-24.8 11.3-32.6 7.5-9.1 20.6-15.6 31.3-16.1 1.2 12.4-3.7 24.7-11.1 33.8m10.9 17.2c-17.4-1-32.3 9.9-40.5 9.9-8.4 0-21-9.4-34.8-9.1-17.9.3-34.5 10.4-43.6 26.5-18.8 32.3-4.9 80 13.3 106.3 8.9 13 19.5 27.3 33.5 26.8 13.3-.5 18.5-8.6 34.5-8.6 16.1 0 20.8 8.6 34.8 8.4 14.5-.3 23.6-13 32.5-26 10.1-14.8 14.3-29.1 14.5-29.9-.3-.3-28-10.9-28.3-42.9-.3-26.8 21.9-39.5 22.9-40.3-12.5-18.6-32-20.6-38.8-21.1m100.4-36.2v194.9h30.3v-66.6h41.9c38.3 0 65.1-26.3 65.1-64.3s-26.4-64-64.1-64h-73.2zm30.3 25.5h34.9c26.3 0 41.3 14 41.3 38.6s-15 38.8-41.4 38.8h-34.8V165zm162.2 170.9c19 0 36.6-9.6 44.6-24.9h.6v23.4h28v-97c0-28.1-22.5-46.3-57.1-46.3-32.1 0-55.9 18.4-56.8 43.6h27.3c2.3-12 13.4-19.9 28.6-19.9 18.5 0 28.9 8.6 28.9 24.5v10.8l-37.8 2.3c-35.1 2.1-54.1 16.5-54.1 41.5.1 25.2 19.7 42 47.8 42zm8.2-23.1c-16.1 0-26.4-7.8-26.4-19.6 0-12.3 9.9-19.4 28.8-20.5l33.6-2.1v11c0 18.2-15.5 31.2-36 31.2zm102.5 74.6c29.5 0 43.4-11.3 55.5-45.4L640 193h-30.8l-35.6 115.1h-.6L537.4 193h-31.6L557 334.9l-2.8 8.6c-4.6 14.6-12.1 20.3-25.5 20.3-2.4 0-7-.3-8.9-.5v23.4c1.8.4 9.3.7 11.6.7z'/%3E%3C/svg%3E\")";

export const CK_GUARANTEES = [
  {
    title: "95.3% of orders arrive perfect",
    sub: "This is our all-time rate, not just a good month",
  },
  {
    title: "We don't pay the seller until you're happy",
    sub: "Late delivery? Wrong item? Get a full refund",
  },
];
