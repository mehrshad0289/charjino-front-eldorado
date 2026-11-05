// Data for the three top-up/subscription shop pages (session 24), verbatim
// from the decoded user-pushed captures:
//  - prime: ui ux/shop-Subscription/…amazon-prime_t_269…prime-video-1-month…make
//    → snapshots/primevideo-1920px-light-{1,2}.tsx
//  - psplus: ui ux/shop-Nothing-found/…playstation-plus_t_s-essential-1-month…make
//    → snapshots/psplus-1920px-light-{1,2}.tsx  (the "Nothing found" state)
//  - cod: ui ux/shop-CoD-Points/…cod-points_t_35…2400-cp…make
//    → snapshots/codpoints-1920px-light-{1,2}.tsx
// Prices/labels/sellers are verbatim EUR values from the captures (extraction:
// scripts/extract_session24_shop_data.py → session24_data_draft.json).
// The generic FAQ answers were scraped live 2026-11-05 from
// eldorado.gg/playstation-plus/t/104 (collapsed in all captures; live shows
// 5 rows — the capture's 6th "Why trust Eldorado?" row is the trust-card
// heading that follows, verified by probe scripts/probe_shop_faq_live5.js).

const GCS = "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F";

export const SHOP_SUBSCRIPTION_IMAGES = {
  // generic banner artwork behind the steps section (identical asset in all
  // three captures) + the 340px fade up to rgb(246,246,246)
  artwork: `${GCS}3dc1f3acb06f6d5646426b81fc717fa1c1d29d77.png?generation=1793727745913594&alt=media`,
  primeIcon: `${GCS}70ccbdc368dd9ef46b4462e1a8aca895945c4cdf.png?generation=1793815585714529&alt=media`,
  playstationIcon: `${GCS}3b549a3861e42e71f5c94447b3f47f7bb07db8ac.png?generation=1793815808492379&alt=media`,
  codIcon: `${GCS}dfea878801121e376d97473662470868fd500d16.png?generation=1793816217552242&alt=media`,
  noResults: `${GCS}91671a13bded2708951c70c98c7f9d8f11e1ed60.svg?generation=1793785993043728&alt=media`,
  // same payment badges as the gamepass/giftcard pages (verbatim URLs in the captures)
  applePay: `${GCS}dd6e842fcce7d583e70dddf074d9307e29d69a8e.svg?generation=1793768744578617&alt=media`,
  googlePay: `${GCS}8916ddaefd4ac6e1dfdec635acab443637130fa2.svg?generation=1793768744565450&alt=media`,
  paypal: `${GCS}30c574904376dfec8831a78ecd59a0a32c9f79bb.svg?generation=1793768744543155&alt=media`,
};

export const SHOP_DISCLAIMER =
  "*The percentage compares listed price with the official in-game store price (excluding any additional fees) at the time of comparison. It's shown for reference only and doesn't imply any affiliation with or endorsement by the game's publisher. The price shown isn't final, and a payment fee is added at checkout.";

/* ============================== AMAZON PRIME ============================== */

export const PRIME_BANNER = {
  gameName: "Amazon",
  iconAlt: "amazon prime",
  icon: SHOP_SUBSCRIPTION_IMAGES.primeIcon,
  // capture hrefs verbatim; self tab internal
  tabs: [
    { key: "Subscription", href: "/amazon-prime" },
    { key: "Gift cards", href: "https://www.eldorado.gg/amazon-gift-card/v/269" },
  ],
  active: "Subscription",
};

// 2 amount variants, capture order. was for the 1-Month card comes from the
// card's own strike row (8.99); the 12-Months strike is 89.90.
export const PRIME_VARIANTS = [
  {
    label: "Prime Video - 1 Month",
    price: "1.34",
    discount: "-86%*",
    was: "8.99",
    popular: true,
    img: `${GCS}fe0d2642f7ccb987a98cc1a0b02258df803a48af.png?generation=1793815585742503&alt=media`,
  },
  {
    label: "Prime Video - 12 Months",
    price: "12.46",
    discount: "-87%*",
    was: "89.90",
    img: `${GCS}6c861ce8f14c90f30bcf46f7d83ea7d1f1919a3a.png?generation=1793815585694597&alt=media`,
  },
];

export const PRIME_DEFAULT_VARIANT = "Prime Video - 1 Month";

export const PRIME_FEATURED_OFFER = {
  regionRow: { label: "Game region", value: "Global" },
  deliveryTime: "8 min -  20 min", // double space verbatim from the capture
  stock: 5,
  total: { price: "1.34", discount: "-86%*", was: "8.99" },
  seller: {
    name: "ArsenicStore",
    avatar: `${GCS}6c5ca64ea9472fb97bb9e53f99ee9ec3065cfe29.png?generation=1793815585719114&alt=media`,
    rating: "99.9%",
    reviews: "2521",
  },
};

/* "Other sellers (13)" — 6 rows on the captured page, 3 pages (numbered
   pagination 1/2/3 verified in the capture raw + live @1920). */
export const PRIME_OTHER_SELLERS_COUNT = 13;
export const PRIME_OTHER_SELLERS_PAGES = 3;

export const PRIME_OTHER_SELLERS = [
  { name: "NOVA_GAMING", avatar: `${GCS}1ea72d936cb1cbebf854938af74c25895f919112.png?generation=1793815585779954&alt=media`, rating: "99.6%", reviews: "946", delivery: "8 min", price: "1.36", discount: "-85%*", was: "8.99" },
  { name: "MrBeast99", avatar: `${GCS}92b73b3611ec97dc4af9f17b641888666d69f936.png?generation=1793776859917403&alt=media`, rating: "99.6%", reviews: "485", delivery: "11 min", price: "1.37", discount: "-85%*", was: "8.99" },
  { name: "Nexora_Store", avatar: `${GCS}045ff05cb743ff7fe407e88cff93ddb34efb86a3.png?generation=1793776859894269&alt=media`, rating: "99.8%", reviews: "473", delivery: "14 min", price: "2.29", discount: "-75%*", was: "8.99" },
  { name: "ROYAL__STORE", avatar: `${GCS}a0ff0164f022b965c8198742550ce38d4ce0e3d3.png?generation=1793776860107065&alt=media`, rating: "99.3%", reviews: "29,247", delivery: "22 min", price: "2.29", discount: "-75%*", was: "8.99" },
  { name: "FastDealZone", avatar: `${GCS}7d16936908c6a45b9e9d76057f5c9308650a50a7.png?generation=1793776859885020&alt=media`, rating: "100%", reviews: "14,876", delivery: "1 min", price: "2.74", discount: "-70%*", was: "8.99" },
  { name: "245HOURS", avatar: `${GCS}92b73b3611ec97dc4af9f17b641888666d69f936.png?generation=1793776859917403&alt=media`, rating: "100%", reviews: "1861", delivery: "20 min", price: "2.92", discount: "-68%*", was: "8.99" },
];

export const PRIME_SEO = {
  title: "Buy Amazon Prime Video Top-Up  Stream Instantly", // double space verbatim
  orders: "12,261,600",
  blocks: [
    { p: "Top up your Amazon Prime Video balance at Eldorado.gg and start streaming your favorite movies and series in seconds. No long-term subscriptions, just fast and flexible access." },
    { p: "Get top-ups from verified sellers with secure delivery and great prices. Every transaction is protected, so you can buy with confidence." },
    { p: "Enjoy Prime Video your way - anytime, without limits." },
  ],
};

/* ============================ PLAYSTATION PLUS ============================ */

export const PS_PLUS_BANNER = {
  gameName: "PlayStation",
  iconAlt: "playstation plus",
  icon: SHOP_SUBSCRIPTION_IMAGES.playstationIcon,
  tabs: [
    { key: "Accounts", href: "https://www.eldorado.gg/psn-accounts/a/104-1-0" },
    { key: "Subscription", href: "/playstation-plus" },
    { key: "Gift cards", href: "/gift-card/playstation" },
  ],
  active: "Subscription",
};

// capture: Germany active, "Your region: Germany" hint, chips NA…Ukraine.
// Live @390 renders the chips as a single scrolling row with an inline
// "Game region: {value}" label — both handled by the chips component props.
export const PS_PLUS_REGIONS = ["NA", "UK", "Turkey", "India", "Germany", "Ukraine"];
export const PS_PLUS_DEFAULT_REGION = "Germany";

// The captured page has NO offers matching the filters: empty amount grid +
// the "Nothing found" block inside the amount card. Live currently serves
// offers (divergence documented; capture is the reference).
export const PS_PLUS_EMPTY = {
  amountLabel: "No amount selected",
  title: "Nothing found",
  text: "Sorry, but nothing matched your filters or search terms.",
};

export const PS_PLUS_SEO = {
  title: "Buy PlayStation Plus",
  orders: "12,261,600",
  blocks: [
    { p: "If you enjoy playing on your console, theres no better gift to yourself than a premium service! Buy PlayStation Plus today and discover an innovative way to approach gaming. Simply put, the service gives players access to dozens, if not hundreds, of games, both old and new. With a cheap PS Plus subscription, you will have a free range to play what you want when you want. And best of all, you will not have to buy individual games. You will simply have to cover the PlayStation Plus price to enjoy all the freedom of gameplay. You can play solo-based games for their story or join others in multiplayer worlds - theres no need to limit yourself or your game selection when you have an entire curated library to choose from. Simply grab a cheap PS Plus subscription now and enjoy your console anew!" },
    { h2: "Cheap PS Plus" },
    { p: "PSN Membership has several tiers - you can get the essential package that will cover the basics of your gaming. Or you can move up to higher tiers, which offer more perks - including a catalog of classic games and even trials for upcoming titles. With great PS Plus membership deals on Eldorado, you can find offers that best suit your needs and wants. Theres no need to buy individual games when you can buy PlayStation Plus and enjoy many various titles - from new releases to nostalgic classics - without paying for them again. With a single service, you will be able to connect with the community of other players and even be able to enjoy cloud storage. Its a good decision to buy PlayStation Plus for those who want to experience a variety of titles and genres and also those who would prefer to test out games before committing to a full-out purchase." },
    { h2: "PlayStation Plus Price" },
    { p: "A PSN Membership is a good investment for anyone who appreciates games in general. With this subscription, you can get the most out of your console. You will also be able to access new and exclusive titles without any additional hassle. And whats more, when you buy PlayStation Plus, you are not locked into a specific genre or one or two tiles. With one service, you can play many different games. If theres a series that you wish to try out, or if there are titles that might cost an arm and a leg to purchase separately, theres no better solution than buying a cheap PS Plus subscription on Eldorado. All your gaming needs will be conveniently covered by one single purchase, and you will have the option to further customize your gaming experience using the subscription tiers. Find PS Plus membership discount offers without delay, and you will never have to worry about PlayStation Plus price ever again! This is your chance to play without compromise - get the most by paying the least. Browse cheap PS Plus listings now!" },
    { h2: "How to buy PlayStation Plus" },
    { p: "Looking to buy PlayStation Plus? Heres a quick guide on how to get started:" },
    {
      list: [
        "Browse the listed PlayStation Plus offers and select what best suits your needs",
        "Carefully read the item descriptions and ensure it match what youre looking for, including potential restrictions",
        "Click the Buy Now button and make a payment with your preferred payment method",
        "Once the payment is confirmed, youll be connected to the seller via a chat window",
        "The seller will inform you how you can redeem PlayStation Plus within the specified delivery time",
        "Once the PlayStation Plus was successfully obtained, please mark the order as Received.",
      ],
    },
    { p: "And youre done! Now you can use PlayStation Plus to enhance your gaming experience." },
  ],
};

/* ============================== COD POINTS ================================ */

export const COD_BANNER = {
  gameName: "Call of Duty",
  iconAlt: "Call of Duty Points",
  icon: SHOP_SUBSCRIPTION_IMAGES.codIcon,
  tabs: [
    { key: "Accounts", href: "https://www.eldorado.gg/call-of-duty-accounts/a/35-0-0" },
    { key: "CoD Points", href: "/cod-points" },
    { key: "Items", href: "https://www.eldorado.gg/cod-skins/i/35-2-0" },
    { key: "Boosting", href: "https://www.eldorado.gg/call-of-duty-boosting/b/35-4" },
  ],
  active: "CoD Points",
};

// Step 1: platform chips (no "Your region" hint in this capture)
export const COD_PLATFORMS = ["Xbox", "Battlenet", "PlayStation"];
export const COD_DEFAULT_PLATFORM = "Xbox";

// 10 variants, capture order. 2400 CoD Points selected (the capture's own
// URL attribute_value_id=2400-cp) with the Popular tab chip.
export const COD_VARIANTS = [
  { label: "500", sub: "CoD Points", price: "5.41", img: `${GCS}d1841609aaa91ebe7518e5b813b47f1f5f757f96.png?generation=1793816217558739&alt=media` },
  { label: "1100", sub: "CoD Points", price: "10.53", img: `${GCS}bba82e75ff4e89a6c3de4bc2e5daef98a41b2e21.png?generation=1793816217576941&alt=media` },
  { label: "2400", sub: "CoD Points", price: "9.96", discount: "-51%*", was: "19.99", popular: true, img: `${GCS}fc634dd39c41a1d5b0f486fd8cd93df29def7a6d.png?generation=1793816217542944&alt=media` },
  { label: "4800", sub: "CoD Points", price: "19.95", was: "39.99", img: `${GCS}86f7f91d0d8eb0a869e7cf6a5a7bc94b46df4912.png?generation=1793816217576416&alt=media` },
  { label: "9600", sub: "CoD Points", price: "42.33", discount: "-44%*", was: "74.99", img: `${GCS}685e4ff129c224eec9fd6491c7fc1c4bc18c8d67.png?generation=1793816217562449&alt=media` },
  { label: "12000", sub: "CoD Points", price: "54.04", discount: "-46%*", was: "99.99", img: `${GCS}685e4ff129c224eec9fd6491c7fc1c4bc18c8d67.png?generation=1793816217562449&alt=media` },
  { label: "21600", sub: "CoD Points", price: "103.05", discount: "-49%*", was: "199.98", img: `${GCS}2be3c55b349ef5b74609def7f0e0a0aab3e97e75.png?generation=1793816217559226&alt=media` },
  { label: "26400", sub: "CoD Points", price: "122.58", discount: "-39%*", was: "299.97", img: `${GCS}2be3c55b349ef5b74609def7f0e0a0aab3e97e75.png?generation=1793816217559226&alt=media` },
  { label: "38400", sub: "CoD Points", price: "175.74", discount: "-42%*", was: "299.97", img: `${GCS}2be3c55b349ef5b74609def7f0e0a0aab3e97e75.png?generation=1793816217559226&alt=media` },
  { label: "BlackCell Battle Pass", price: "26.49", discount: "-12%*", was: "29.99", img: `${GCS}788a609f6ffe02b96eefc8d91988bff55600a303.png?generation=1793816217585655&alt=media` },
];

export const COD_DEFAULT_VARIANT = "2400 CoD Points";

export const COD_FEATURED_OFFER = {
  deliveryTime: "17 min -  1 h", // double space verbatim
  stock: 5,
  total: { price: "9.96", discount: "-51%*", was: "19.99" },
  seller: {
    name: "PowerXhub",
    avatar: `${GCS}3cf9d978c8dd900e0d45614ab8b78a167391d52a.png?generation=1793816217707498&alt=media`,
    rating: "100%",
    reviews: "6006",
  },
};

export const COD_OTHER_SELLERS_COUNT = 8;
export const COD_OTHER_SELLERS_PAGES = 2;

export const COD_OTHER_SELLERS = [
  { name: "CNLTeam", avatar: `${GCS}a135388df1ecabeb8e69b5849c9f9e0e9ba42267.png?generation=1793816217720069&alt=media`, rating: "99.3%", reviews: "1,452,599", delivery: "9 min", price: "9.97", discount: "-51%*", was: "19.99" },
  { name: "BoosterHub", avatar: `${GCS}40ea4846c39443a7c55b036b1ad69eff377b516b.png?generation=1793816217719768&alt=media`, rating: "99.8%", reviews: "19,258", delivery: "16 min", price: "10.86", discount: "-46%*", was: "19.99" },
  { name: "FastEasySeller", avatar: `${GCS}366bc7841b8bdbecd97aa20bbaf8dfd933b17077.png?generation=1793816217749177&alt=media`, rating: "99.5%", reviews: "501,397", delivery: "21 min", price: "10.87", discount: "-46%*", was: "19.99" },
  { name: "GAFFA", avatar: `${GCS}31af18e66ea8d2486a07bdad89a93c61d336ba46.png?generation=1793816217771350&alt=media`, rating: "99.9%", reviews: "1037", delivery: "10 min", price: "10.54", discount: "-48%*", was: "19.99" },
  { name: "245HOURS", avatar: `${GCS}92b73b3611ec97dc4af9f17b641888666d69f936.png?generation=1793776859917403&alt=media`, rating: "100%", reviews: "1861", delivery: "20 min", price: "11.45", discount: "-43%*", was: "19.99" },
  { name: "LunaGuardTrades", avatar: `${GCS}70faaf8cecde988ed71b70bd1f95e7df16c6072c.png?generation=1793816217759122&alt=media`, rating: "99.3%", reviews: "42,155", delivery: "14 min", price: "12.81", discount: "-36%*", was: "19.99" },
];

export const COD_SEO = {
  title: "Buy CoD Points Cheap",
  orders: "12,261,600",
  blocks: [
    { p: "Buy CoD Points cheap, the main currency of the Call of Duty Warzone, Black Ops 7, Cold War and MW3 games and it is used to buy Operator Packs and other bundles from the in-game store including Battle Pass and it's Tiers. Cheap Call of Duty Points is the best method that keeps you progressing through the game. CoD Points price is always on the swing but with Eldorado you can find cheap CoD Points which is an easy method for getting Call of Duty CP that you can't find anywhere else for a better price. Buy CoD Points and have endless possibilies of skins choices and other cosmetics." },
    { h2: "COD Points for Sale" },
    { p: "However, bundles are not the only item you can get with COD Points for sale. Whether youre looking for COD Points BO7 or if youre more interested in COD Points Warzone 7, you can use those same Points to unlock Battle Passes that will grant you a variety of rewards. Battle Pass is a seasonal reward system where players go through different tiers with increasingly better rewards. Battle Pass rewards can include anything from new blueprints or character outfits. Buy COD Points and experience all the game has to offer, from cosmetic changes to various utilities. Regardless if its the Battle Pass or bundles from the store, COD Points MW3 grants you access to content and features that might otherwise be out of reach. Cheap Call of Duty Points are available for sale on Eldorado together with near instant delivery times." },
    { h2: "Buy CoD BO7 Points" },
    { p: "CoD Points can also be used in Black Ops 7 and not only Warzone, meaning that this exact page is the right place for you to purchase BO7 points. Not only the points system is made comfortable in a way that you can use it throughout different Call of Duty games, but it is also a great currency that helps you unlock various new items and accessories with whom you can easily customize your gameplay experience. Buy Black Ops 7 points from Eldorado with cheap prices and enjoy your new in-game look in seconds after the purchase." },
    { h2: "CoD Points" },
    { p: "CoD points provide a route for players to achieve specific types of skins and unlock Battle Pass with 1100 CP. Call of Duty points are essential if you are looking to build up your inventory since some of the skins are only available to buy with this currency only. The amount of skins released always increase and older skins get rare so players are always quick to snap whatever is new on the market. Thankfully Eldorado.gg makes snatching CoD points even easier since you can find cheap CoD points available for all platforms. Buy CoD points from any seller for a competitive price and receive a quick delivery." },
    { h2: "How to buy COD Points" },
    { p: "Here you can find how to buy COD Points" },
    {
      list: [
        "Look through COD Points offers and pick the one that you are interested in.",
        "Choose your desired COD Points amount",
        "Click Buy Now and make the payment through your favorite payment method",
        "Once the payment is registered, the chat box will appear where you can talk with the seller",
        "The seller will guide you on how you can receive COD Points. Follow the instructions and you will be getting your COD Points in no time.",
        "Once COD Points is received, we ask to mark the order as Received and leave appropriate feedback (it is optional but much appreciated).",
      ],
    },
    { p: "That is it! Now you have your COD Points and you can continue playing the game the way you like." },
  ],
};

/* ===================== shared generic FAQ (all 3 pages) =================== */
/* 5 rows in the captures (the 6th "Why trust Eldorado?" text is the trust
   card heading that follows the FAQ, live-probed). Answers collapsed in the
   captures — scraped live 2026-11-05 (scripts/probe_shop_faq_live3.js). */
export const SHOP_GENERIC_FAQ = [
  {
    q: "What is Eldorado.gg?",
    paragraphs: [
      "Eldorado.gg is an online marketplace for a wide variety of in-game goods - currency, accounts, items, boosting, top ups. Plenty of popular games are supported on Eldorado where you can buy and sell products and services with real money.",
    ],
  },
  {
    q: "Is topping up on Eldorado safe?",
    paragraphs: [
      "Yes, top ups for any game listed on Eldorado.gg are completely safe. This is ensured by TradeShield™, our custom security system to protect both buyers and sellers from fraud.  However, to ensure the highest amount of security for all transactions, please carefully follow the sellers delivery instruction and chosen method.",
      "While for many games, top ups can be delivered with a gift code or only using your UID, in some games logging in to your account may be required. To find out which delivery method is offered, select a top up offer for the amount of your choice and read the \"Delivery instructions\" panel that appears.",
    ],
  },
  {
    q: "How to top up using Eldorado?",
    intro: "Topping up using Eldorado.gg is very simple. Just follow these steps and your account will be topped up with premium in-game currency within minutes:",
    steps: [
      "(Optional) Select server, region and device if applicable.",
      "Select the top up amount of your choice.",
      "Read \"Delivery instructions\" provided. These will let you know what information you need to provide to receive the top up. Depending on your chosen game either no information would be required and you'll simply receive a gift code or you will need to provide your UID or even login details.",
      "Press \"Buy now\" button.",
      "In the following window select your payment option, input the details and press \"Pay now\".",
      "Wait for the top up within allotted time (usually within minutes). Should the top up provider require any additional information, they will ask you directly within the chat window provided, so please do not close it while your order is being processed.",
    ],
    after: "And that's it! Using Eldorado.gg you can enjoy cheaper top ups for many games in a fast and safe manner.",
  },
  {
    q: "What is Eldorado.gg's refund and return policy?",
    paragraphs: [
      "Eldorado.gg offers refunds if the item is not delivered or not as described. Buyers can request a refund by going to the order page and raising a dispute.",
    ],
  },
  {
    q: "What if I have problems with my order?",
    paragraphs: [
      "With every order created, a chatbox is created between you and the seller, who will guide you on how to receive your order.Eldorado also has a support team who is ready to help any time, get in contact by either pressing a blue bubble on the bottom right corner or raise a dispute on your order window.",
    ],
  },
];
