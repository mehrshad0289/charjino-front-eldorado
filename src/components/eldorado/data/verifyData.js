export const VERIFY_BANNER =
  "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2Fcb349af7034e5d56903b906fd4731e95c15b05bd.png?generation=1793807132818751&alt=media";

/* Session 20 — /verify/status capture (ui ux/verify/, 1920 light).
   Texts are VERBATIM from the capture (html.to.design strips
   apostrophes: "thats" — same convention as shopItemData's
   "Heres"/"youre"; live /verify/status is client-rendered so the
   capture is the only text reference). */

export const VERIFY_STATUS = {
  badge: "Action required",
  badgeBg: "rgb(232, 27, 22)",
  title: "Almost there...",
  subtitle:
    "To continue with your verification, please review the details below and update anything thats needed.",
  cta: "Continue verification",
  next: {
    title: "What happens next",
    items: [
      "List new offers and sell instantly",
      "Access full payouts and higher limits",
      "Chat safely with buyers",
    ],
  },
  why: {
    title: "Why verification matters",
    body: "To protect everyone on the platform, we verify sellers before enabling payouts and full selling access. Verified status secures payouts and builds trust with buyers.",
  },
  help: {
    title: "Need help?",
    /* The support-collection link has no route in this clone (external,
       per the capture); contact-us IS a clone route → internal href. */
    links: [
      {
        title: "Seller FAQ",
        href: "https://support.eldorado.gg/en/collections/6253612-i-m-selling",
        external: true,
      },
      { title: "Contact support", href: "/contact-us", external: false },
    ],
  },
  /* Card shadow (capture): 0 2px 4px rgba(9,9,11,.05) + 0 12px 8px
     rgba(9,9,11,.02). Title card is rounded-xl p-6, the three info
     cards are rounded-lg px-6 py-4. */
  cardShadow:
    "0 0 0 0 rgba(0,0,0,0), 0 0 0 0 rgba(0,0,0,0), 0 0 0 0 rgba(0,0,0,0), 0 0 0 0 rgba(0,0,0,0), 0 2px 4px 0 rgba(9,9,11,0.05), 0 12px 8px 0 rgba(9,9,11,0.02)",
  /* Info pill behind the card's 20px icon: the capture records the red
     (oklab ≈ the badge red #E81B16) at /20 alpha — soft pink disc.
     Icomoon glyph decodes empty → inline info SVG (documented). */
  infoPillBg: "rgba(232, 27, 22, 0.2)",
};
