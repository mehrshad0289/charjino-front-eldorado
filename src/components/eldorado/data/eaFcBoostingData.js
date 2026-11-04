/* EA FC 27 Boosting page data (session 22/23: two user-pushed captures
   of /ea-fc-boosting/b/142-4 — Division Rivals default + Champions
   Finals variant in BOOST_VARIANTS below, rendered interactively by
   BoostingConfigSection; BOOST_CARDS/BOOST_CUSTOMIZE keep the
   session-19 Division Rivals anatomy as the data record). (/ea-fc-boosting/b/142-4) — session 19,
   from the user-pushed capture `ui ux/Boosting-rivals/
   www_eldorado_gg_ea-fc-boosting_b_142-4_1920w_390w_1536w_default.make`
   (origin bddd33e — the boosting product page the /checkout capture was
   taken from). Asset URLs verbatim, each verified HTTP 200
   (scripts/verify_boosting_assets.py). FAQ answers are NOT in the
   capture (all 8 rows closed @1920) — scraped verbatim from live
   eldorado.gg/ea-fc-boosting/b/142-4 on 2026-11-04 (question order and
   wording match the capture exactly). */

export const BOOST_GAME = {
  name: "EA Sports FC",
  icon: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2Ff1600033913281231070dedbd4be5df9249ea4a4.png?generation=1793808260332690&alt=media",
  alt: "ea fc boosting",
};

/* Tab hrefs verbatim from the capture (live URLs — the clone only
   implements the Boosting tab). Boosting = active, self-link internal. */
export const BOOST_TABS = [
  { label: "FC Coins", href: "https://www.eldorado.gg/ea-fc-coins/g/142-0-0" },
  { label: "Accounts", href: "https://www.eldorado.gg/ea-fc-accounts/a/142-1-0" },
  { label: "FC Points", href: "https://www.eldorado.gg/fc-points/t/142" },
  { label: "Items", href: "https://www.eldorado.gg/fc-players/i/142" },
  { label: "Boosting", href: "/ea-fc-boosting/b/142-4", active: true },
];

export const BOOST_BANNER =
  "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F3dc1f3acb06f6d5646426b81fc717fa1c1d29d77.png?generation=1793727745913594&alt=media";

export const BOOST_DEALS_TITLE = [
  "Get deals from expert boosters in under ",
  "2 minutes",
];

export const BOOST_CHIPS = [
  { label: "Division Rivals", active: true },
  { label: "Champions Finals" },
  { label: "Gallery Boost" },
  { label: "SBC Boost" },
  { label: "Archetype Boost" },
  { label: "Clubs Matches Boost" },
  { label: "Gauntlet Boost" },
  { label: "Custom Request" },
];

/* Config cards — header bg images, 90px icons and combobox values
   verbatim. Comboboxes are static per capture (no dropdown content in
   any reference — nothing invented). */
export const BOOST_CARDS = [
  {
    bg: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F99cc743fd2d83cb7165100b9463053b35e972a92.png?generation=1793808260347373&alt=media",
    icon: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F5e0c44277189138f1bd3041ad352bf7cda7c2dc5.png?generation=1793808260338372&alt=media",
    label: "Current division",
    value: "Division 1",
    fields: [
      { label: "Current division", value: "Division 1" },
      { label: "Platform", value: "PC - Steam" },
    ],
  },
  {
    bg: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F8be903c8475a11e1c4f2c391393ef73b9df43ff2.png?generation=1793808260323538&alt=media",
    icon: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F35324093f3c6eb010360931ae1b570725d93a667.png?generation=1793808260351264&alt=media",
    label: "Desired division",
    value: "Elite",
    fields: [{ label: "Desired division", value: "Elite" }],
  },
];

export const BOOST_TEXTAREA_PLACEHOLDER = "e.g. I need it done in a week...\n";

export const BOOST_EXCLAMATION =
  "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F3ec2873fb253249d46670ddd9eb18de7213996e8.svg?generation=1793808260338837&alt=media";

export const BOOST_CUSTOMIZE = {
  title: "Customize order",
  modes: [
    { label: "Solo", active: true },
    { label: "Duo" },
  ],
  switches: [
    { label: "Stream", on: false },
    { label: "Solo queue", on: false },
    { label: "Offline mode", on: false },
  ],
  alert: {
    title: "You already have an active request",
    body: "If you'd like to submit a new one, cancel the current request first.",
    button: "Check request",
  },
};

/* Session 22 — Champions Finals variant per the user-pushed second
   capture `ui ux/Boosting-Champions-Finals/…(1).make` (origin 9f6e420,
   decoded with decode_session22_messages.py → boosting2-1920px-light-1).
   Same URL /ea-fc-boosting/b/142-4, "Champions Finals" chip active.
   Differences vs the Division Rivals capture (everything else — banner
   3dc1f3ac, deals title, Solo/Duo + switches, save-money, trust, rank-
   up, boosters, lightning, FAQ, SEO — is identical; save-money badge
   svg regenerated e7032432 → 99b185c3 per session 23's decode):
   - ONE full-width config card (no 90px icon, no radial glow) titled
     "Champions Finals" 24px bold; bg 92b3f9e9; image fade bottom-96.8
     (session 23's capture-exact offset); inner 2-col form: Current
     Rank → Rank 15 | Desired Rank → Rank 1, Platform → PC - EA
     spanning both columns (capture gridArea 2/1/3/3; in DR Platform
     sits inside card 1 at 2/1/3/2).
   - Customize panel bottom: NO active-request alert — a full-width
     dark "Get offers now" button (min-h-14 rounded-lg) + a centered
     14px "Protected by TradeShield" row (shield glyph → inline SVG,
     link-blue underline rgb(45,94,173)).
   Chips without a captured variant (Gallery/SBC/Archetype/Clubs/
   Gauntlet/Custom Request) are rendered but do NOT switch content —
   no reference defines their state, nothing invented. Session 23
   implemented the CF state statically; session 22's interactive
   switch (BoostingConfigSection + this data) supersedes it while
   keeping BOTH captured states reachable. */
export const BOOST_VARIANTS = {
  "Division Rivals": {
    cards: [
      {
        bg: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F99cc743fd2d83cb7165100b9463053b35e972a92.png?generation=1793808260347373&alt=media",
        icon: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F5e0c44277189138f1bd3041ad352bf7cda7c2dc5.png?generation=1793808260338372&alt=media",
        label: "Current division",
        value: "Division 1",
        fields: [
          { label: "Current division", value: "Division 1" },
          { label: "Platform", value: "PC - Steam" },
        ],
      },
      {
        bg: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F8be903c8475a11e1c4f2c391393ef73b9df43ff2.png?generation=1793808260323538&alt=media",
        icon: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F35324093f3c6eb010360931ae1b570725d93a667.png?generation=1793808260351264&alt=media",
        label: "Desired division",
        value: "Elite",
        fields: [{ label: "Desired division", value: "Elite" }],
      },
    ],
    customize: {
      title: "Customize order",
      modes: [
        { label: "Solo", active: true },
        { label: "Duo" },
      ],
      switches: [
        { label: "Stream", on: false },
        { label: "Solo queue", on: false },
        { label: "Offline mode", on: false },
      ],
      alert: {
        title: "You already have an active request",
        body: "If you'd like to submit a new one, cancel the current request first.",
        button: "Check request",
      },
    },
  },
  "Champions Finals": {
    cards: [
      {
        title: "Champions Finals",
        bg: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F92b3f9e977e35c54499ea0b3f9f07c2d7866afdd.png?generation=1793813798533798&alt=media",
        icon: null,
        wide: true,
        fade: 96.8,
        fields: [
          { label: "Current Rank", value: "Rank 15" },
          { label: "Desired Rank", value: "Rank 1" },
          { label: "Platform", value: "PC - EA", full: true },
        ],
      },
    ],
    customize: {
      title: "Customize order",
      modes: [
        { label: "Solo", active: true },
        { label: "Duo" },
      ],
      switches: [
        { label: "Stream", on: false },
        { label: "Solo queue", on: false },
        { label: "Offline mode", on: false },
      ],
      offerCta: {
        button: "Get offers now",
        protectionPrefix: "Protected by",
        protectionLink: "TradeShield",
      },
    },
  },
};

export const BOOST_SAVE_MONEY = {
  bg: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F863fa0bd6d89a044df7b955e0c1c46e15663e527.svg?generation=1793808260328313&alt=media",
  badge: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F99b185c373e240eda2e2431ce46cec0aa0b9c859.svg?generation=1793813798534232&alt=media",
  dragon: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F04e5475cba8817c4fb68255913a89d4168d739c2.svg?generation=1793808260438719&alt=media",
};

export const BOOST_TRUST = {
  bg: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F054d0db0f48c525aee94314b804cdb674aafbb26.png?generation=1793768744750982&alt=media",
  title: "Why trust Eldorado?",
  sub: "From start to finish, the boosting service is supervised and safe",
  checkbox:
    "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F9fd83d67e2df0f879fc4a52ceb09e2c62495082f.svg?generation=1788944034703253&alt=media",
  rows: [
    "Verified professional sellers",
    "Fast Delivery",
    "24/7 live support",
    "Secure and instant payments",
    "Buyer protection and warranty",
    "Wide selection of offers",
  ],
};

/* Trusted band: the capture's white card holds an EMPTY 150px content
   area (the reviews carousel did not render in the capture) — kept
   verbatim empty, documented. */

export const BOOST_RANKUP = {
  title: ["Effortless ", "rank-up", " process"],
  steps: [
    {
      img: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F9d6d3d9e1908337907efc34586a36435cdc5ce61.svg?generation=1793808260556915&alt=media",
      w: 108,
      h: 108,
      title: "1. Select a service",
      desc: "Select the boosting service and customize it to fit your needs",
    },
    {
      img: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2Fb165ae643f2a9138d0fdb2e1e31af77fc5d3afc3.svg?generation=1788944034691575&alt=media",
      w: 117,
      h: 105,
      title: "2. Choose an offer",
      desc: "Select the best offer from a top-rated seller",
    },
    {
      img: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F19e9e8ec354d191e71580f1b0decc4bafd21b71b.svg?generation=1788944034713536&alt=media",
      w: 120,
      h: 120,
      title: "3. Complete payment",
      desc: "Choose a convenient payment method",
    },
    {
      img: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F793beea2e27a2e306e8436dc53bbed90dfd32a5d.svg?generation=1788944034688355&alt=media",
      w: 126,
      h: 117,
      title: "4. Rank Up",
      desc: "Enjoy the rewards of a ranked account!",
    },
  ],
  cta: "Get offers now",
};

export const BOOST_BOOSTERS = {
  bg: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2Fffa5b47d483cbb5174ef8beca0b456e29f32222f.png?generation=1793808260537190&alt=media",
  badge: "Selected boosters",
  title: "Boosters with Eldorados stamp of approval",
  body: "Eldorado provides a premium boosting experience with top-rated veteran boosters, constant communication, and a money-back guarantee. Enjoy quick, secure service with our expertly selected boosters and dedicated Customer Support.",
};

export const BOOST_LIGHTNING = {
  bg: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F081b1b8f463e14d6195f68e916beecd462e4026d.png?generation=1793808260545481&alt=media",
};

/* FAQ — questions verbatim from the capture; answers scraped from live
   2026-11-04. Apostrophes are the live ' characters. */
export const BOOST_FAQS = [
  {
    q: "What is boosting and how does it work in EA Sports FC 27?",
    a: "Boosting in FC27 is when someone else is completing the in-game progress for you, whether it is Divisions, SBCs, Champions Finals, etc. Anything in the game that you are struggling with or don't have the time for, Eldorado professional boosters can take over and complete for you.",
  },
  {
    q: "Is FC 27 boosting safe?",
    a: "Eldorado provides the safest environment possible for any type of FC27 boosting requests. Our roster only consists of pro boosters that are verified - meaning no cheats and clean gameplay only. There are also plenty of rules that sellers need to follow to avoid any risks of bans - using VPN, not talking to in-game support, only doing what they are supposed to do. Your boosting is in safe hands with Eldorado.",
  },
  {
    q: "What are the prices? Delivery time?",
    a: "Once you send out your request, our boosters will start sending you offers. Initial offers already include the prices and delivery times, they also can be tweaked to your liking up until the payment is done.",
  },
  {
    q: "Which regions are supported for boosting?",
    a: "Boosting can be done in any regions. Eldorado has boosters all around the world and to be more secure, in certain cases the boosters also use a VPN to ensure the account isn't flagged for suspicious log in.",
  },
  {
    q: "Is booster going to open the packs that I have?",
    a: "No. Unless you specifically ask the booster to do so. Boosters are meant to only complete the given task and nothing else.",
  },
  {
    q: "Can I watch the booster play?",
    a: "Yes. Our boosting request forms have \"Include streaming?\" option, meaning that if chosen Yes, the booster can stream the whole boosting progress for you to watch.",
  },
  {
    q: "Do you provide services to farm coins, tradeable items, or special FUT cards?",
    a: "Yes. Any boosting requests that you have, where you can't see a category for it, falls into Special Request zone. For any FC27 tasks that you have, simply fill out Custom Request form and wait for offers from our boosters and your boosting request will start asap.",
  },
  {
    q: "Can I use Boosting Custom Requests to buy accounts or other products?",
    a: "No, custom requests are for various boosting services only. Other products, like accounts or items, must be purchased from their respective product categories.",
  },
];

export const BOOST_SEO = {
  h1: "EA Sports FC 27 Boosting Services",
  rating: "4.9",
  orders: "353,800",
  /* verbatim capture copy; the FC 27 Coins link kept verbatim (live) */
  p1: "EA Sports FC 27 is the newest iteration of FIFA series games. In EA FC 27 you can experience all the popular game modes you fell in love with when playing FIFA games including FIFA Ultimate Team, Career Mode and Champions Weekend League. FC 27 Champions Finals are the weekly culmination of the FUT Champs game mode with lucrative rewards up for grabs such as 84+ Rare Gold Players Picks, assorted packs, coins and Champions Qualification Points. With such fantastic rewards available, you should aim to reach the highest Champions Finals rank possible and that's exactly what Champions Finals boosting service on Eldorado.gg is for. Our talented players can reach any FUT Champs rank you would want at the cheapest prices possible, due to competitive boosting request placement system. Any other FC27 boosting form is also available as well, whether it is SBC, fut draft wins, division boost or anything else, we got it.",
  h2a: "Buy FC27 Division Rivals Boosting",
  p2a: "Division Rivals game mode sets players up against one another in a race to the top of the leaderboards of FC 27 Ultimate Team. Considering that every lost match puts higher division further out of reach, it is a smart decision to buy FC27 Division Rivals boosting service and reach the top fast with some of the best EA FC 27 players helping you out. This will also net you some highly sought-after rewards such as Mega Packs, Jumbo Rare Players Packs, Prime Gold Players Packs and even ",
  p2aLink: { label: "FC 27 Coins", href: "https://www.eldorado.gg/ea-fc-coins/g/142-0-0" },
  p2aEnd: ".",
  h2b: "How to buy FC27 Boosting",
  p2b: "Follow these steps to successfully buy FC27 Boosting:",
  steps: [
    "Choose the FC27 Boosting service that best fits your needs.",
    "Fill out the required information so the system can determine which booster to match you with.",
    "Click the Send Request button, and soon you will be given several offers that match your needs.",
    "Our boosters that meet your initial requirements will prepare their FC27 Boosting offers, including the price and delivery time, and send them directly to you.",
    "You can start a chat with every booster who sent in their FC27 Boosting offers and work out the details directly",
    "As you select the FC27 Boosting offer that best matches your needs, you can complete the purchase, and the boosting starts.",
    "Afterward, you will receive frequent FC27 Boosting updates and you will be able to keep track of your conversations on the initial chat window.",
  ],
  p3: "Once the FC27 Boosting offer is fully delivered, the booster will let you know via the chat or mark it as Delivered.",
};
