/* Become a Seller page data (/become-seller) — session 19, from the
   user-pushed capture `ui ux/become-seller/
   www_eldorado_gg_become-seller_1920w_390w_1536w_default.make`
   (origin 4b8246c, decoded to extracted/snapshots/
   becomeseller-1920px-light-{1,2}.tsx, 1920-only).
   Asset URLs are verbatim from the capture — each has its own
   `generation` param (session-13 lesson) and was verified HTTP 200
   individually (scripts/verify_session19_assets.py; note: the hero
   background URL lives inside a style={{backgroundImage}} string where
   & is NOT html-escaped — unlike <img src> attributes).
   FAQ answers are NOT in the capture (all 7 rows closed @1920) —
   scraped verbatim from live eldorado.gg/become-seller on 2026-11-04
   (question order and wording match the capture exactly). Answer 4 is
   the live rich-text article with its four sub-headings. */

export const BS_HERO_BG =
  "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F820ff512df32ad51034a1a113e08a3077e7872ee.png?generation=1793806941549999&alt=media";

export const BS_HERO_IMG =
  "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F023d80dc3050ae3f6083e6d4fee26897a25f32d4.svg?generation=1793806941552033&alt=media";

export const BS_H1 = "Start making money on Eldorado";
export const BS_SUB =
  "Reach millions of verified gamers who buy gaming goods daily from sellers like you.";
export const BS_CTA_HREF = "https://www.eldorado.gg/verify/status";
export const BS_CTA_LABEL = "Start verification";

/* Trust pills — pill 3 carries the green Trustpilot star rgb(33,150,83)
   (icomoon glyph in the capture → inline SVG, project convention). */
export const BS_PILLS = [
  { title: "Safe sales", sub: "Protected by TradeShield", star: false },
  { title: "Global reach", sub: "Millions of verified buyers worldwide", star: false },
  {
    title: "Trusted since 2019",
    sub: "(100k+ reviews on Trustpilot)",
    star: true,
    rating: "4.4",
  },
];

/* "Why Eldorado?" cards — capture-verbatim (icons 134×152, gray top-fade
   gradient on the card, "Learn how" underlined support links). */
export const BS_WHY = [
  {
    title: "Fast & secure verification",
    desc: "Get verified quickly and safely so you can start selling with confidence.",
    link: "https://support.eldorado.gg/en/articles/9896838-seller-verification-guide",
    img: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F40ec31f93b02ac5b824d5d8daa9c532d0efb2139.svg?generation=1793796171892336&alt=media",
    alt: "Get verified quickly and start selling video game items on Eldorado.gg with confidence",
  },
  {
    title: "List your offers in minutes",
    desc: "Once verified, it takes just a few clicks to create your listings.",
    link: "https://support.eldorado.gg/en/articles/8409007-how-to-sell",
    img: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2Fa0767390bf365309c73e8b2cdf7a42c919abddd0.svg?generation=1793806941579410&alt=media",
    alt: "Once verified on Eldorado.gg, create your video game offers and listings in minutes",
  },
  {
    title: "100% payment protection",
    desc: "TradeShield guarantees no chargebacks or payment fraud.",
    link: "https://support.eldorado.gg/en/articles/8409006-tradeshield-selling",
    img: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2Faca65b37670234e2a27f48fe3099a92ca2239a17.svg?generation=1793806941568726&alt=media",
    alt: "On Eldorado.gg, TradeShield protects sellers from payment fraud and chargebacks",
  },
  {
    title: "Fast payouts",
    desc: "Withdraw earnings to Skrill, Payoneer, Crypto, and more.",
    link: "https://support.eldorado.gg/en/articles/8409026-withdrawals",
    img: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2Fcf9febb8f7742205142f8c9a087d5c3322b27cb2.svg?generation=1793796171921923&alt=media",
    alt: "When selling on Eldorado.gg, you can withdraw your money to Skrill, Payoneer, Crypto, and other digital payment services",
  },
];

/* "Tools to power your next sale" cards — icon chips are icomoon glyphs
   in the capture (no SVG asset) → substituted with inline SVG paths
   (documented assumption, project convention). Chip colors verbatim.
   Cards are TRANSPARENT on live (probe: backgroundColor rgba(0,0,0,0),
   radius 16px) — the capture's missing bg class is correct, not a
   decode artifact. */
export const BS_TOOLS = [
  {
    title: "Seller API",
    desc: "Automate listings, pricing, and delivery with zero manual work.",
    chip: "rgb(79, 189, 253)",
    icon: "api",
  },
  {
    title: "Bulk Uploads",
    desc: "Upload hundreds of offers in seconds import, edit, publish fast.",
    chip: "rgb(209, 240, 143)",
    icon: "upload",
  },
  {
    title: "Delivery Flexibility",
    desc: "Deliver instantly or via chat with secure, real-time handovers.",
    chip: "rgb(0, 228, 201)",
    icon: "delivery",
  },
  {
    title: "Influencer Growth",
    desc: "Top streamers grow Eldorado's audience, bringing more buyers to you.",
    chip: "rgb(254, 169, 0)",
    icon: "growth",
  },
];

/* Seller FAQs — questions verbatim from the capture; answers scraped
   from live 2026-11-04. Answer 4 = rich blocks (h/p pairs) exactly as
   the live article renders it. Apostrophes are the live ’ characters. */
export const BS_FAQS = [
  {
    q: "How do I start selling on Eldorado?",
    a: "Create an account, complete verification, and list your first offer — it only takes a few minutes to get started.",
  },
  {
    q: "What can you sell on Eldorado?",
    a: "On Eldorado, you can sell game accounts, in-game currency, items, top-ups, boosting, gift cards, and more.",
  },
  {
    q: "Do I need verification to sell?",
    a: "Yes. Verification keeps our marketplace safe for both sellers and buyers, ensuring every sale is protected.",
  },
  {
    q: "Why is ID verification needed on Eldorado.gg?",
    blocks: [
      {
        h: "What is ID verification?",
        ps: [
          "The verification system allows us to know that you are who you say you are. We want to ensure that it’s really YOU making the purchase, NOT someone who uses your personal information.",
          "When completing a transaction on Eldorado.gg, you might be asked to verify your identity. Usually, it’s done by taking a photo of your government-issued ID, so our customer support can match your name to the credit card you provided. This will protect your details and ensure that no one uses your credit or debit card without your knowledge.",
          "And don’t worry, we won’t misuse your data. According to our policy, we keep your information on file for about 90 days, just enough to successfully confirm your identity. After that, the data you provided will be deleted. The process is automated, so you don’t have to worry about someone forgetting to complete it.",
        ],
      },
      {
        h: "How to bypass ID verification?",
        ps: [
          "Alternatively, if you want to bypass the whole verification process, you can complete your transactions with cryptocurrency. That way, you will remain completely anonymous, and the transaction will remain secure since cryptocurrencies have inherent security built in.",
        ],
      },
      {
        h: "Types of verification",
        lead: ["There are ", "three types of verification", "."],
        ps: [
          "1. The first one is when we ask you to provide a photo of your ID. It’s the most straightforward option, and all you need is a high-resolution photo of your valid government-issued document (such as a driver’s license, passport, or any other official document). Please make sure the document is not expired and that nothing obstructs your face (for easy recognition).",
          "2. Another form of verification is similar to the first, but this time, we would ask you to take a picture of yourself holding the ID. This would help us verify your identity more accurately and ensure that no one is using your document to bypass our protocols. However, we won’t accept images that were clearly meant for other websites. For example, a selfie featuring you and your ID, with an additional piece of paper nearby that says ‘Google’ because the image may have previously leaked online and is now being reused.",
          "3. Lastly, you might need to verify your credit card. You can do so by taking a picture with the card details clearly visible, such as the cardholder's name, the card's issuing bank, whether the card is Visa or Mastercard, and its expiration date. You can block the card number while keeping the last 4 digits visible for verification.",
        ],
      },
      {
        h: "Why is ID verification required?",
        ps: [
          "There are many different ways that your information could be leaked. This information can include not only your name or address but also your credit card numbers. Someone could use your card information to make online purchases, since in most cases these transactions are not protected by a PIN (as they would be in a store or even at an ATM). Therefore, if fraudsters gain access to your credit card data, they can manipulate it freely, and in many cases, there’s little protection for you after the fact.",
        ],
      },
    ],
  },
  {
    q: "How long does verification take?",
    a: "Most sellers get verified within a few minutes once documents are submitted correctly.",
  },
  {
    q: "When will I get paid after selling?",
    a: "After the order is completed, your funds are released and ready to withdraw. Eldorado keeps them safe with TradeShield until delivery is confirmed.",
  },
  {
    q: "How does TradeShield protect sellers?",
    a: "TradeShield keeps every sale secure by covering you against chargebacks and payment fraud. Eldorado guarantees your payout once the buyer confirms delivery, no matter what happens with the buyer’s payment.",
  },
];

export const BS_FULL_FAQ_HREF =
  "https://support.eldorado.gg/en/collections/6253612-i-m-selling";

/* White CTA band (page bottom). The capture's text reads "get paid  all"
   — the em dash was dropped by the decode; live has
   "get paid — all" (confirmed on live 2026-11-04). */
export const BS_CTA_TITLE = "Start selling with Eldorado";
export const BS_CTA_SUB =
  "List your offers, reach millions of buyers, and get paid — all in one secure marketplace.";
