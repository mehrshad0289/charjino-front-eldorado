// Data for the Xbox Game Pass shop page, extracted from the decoded capture
// "ui ux/extracted/snapshots/gamepass-1920px-light-1.tsx" (+ duplicate -2)
// uploaded as ui ux/shop-giftcart-gamepass-xbox/www_eldorado_gg_xbox-game-pass_t_103_attribute_value_id_xbox-ultimate-1-month_te_v0_Europe_1920w_390w_1536w_default.make
// Variant names/order/prices are verbatim from the capture (EUR display).
// FAQ answers were scraped live 2026-11-04 from
// eldorado.gg/xbox-game-pass/t/103?attribute_value_id=xbox-ultimate-1-month
// (collapsed in the capture).

const GCS = "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F";

const IMG_ESSENTIAL = `${GCS}82aac1d6593cbe5d9fee9cbe74fb625dd5a25732.png?generation=1793776859857644&alt=media`;
const IMG_PC = `${GCS}fa66618b4014c8655a76c7c48b136c0a4effa6d0.png?generation=1793776859870571&alt=media`;
const IMG_PREMIUM = `${GCS}f965aa665fb083539f85976c9d5431cac48cc9d9.png?generation=1793776859860270&alt=media`;
const IMG_ULTIMATE = `${GCS}c9c2a773bd2fabb0dac5418b747d09ee6d56cb5d.png?generation=1793776859859189&alt=media`;

export const GAME_PASS_IMAGES = {
  // same banner/backdrop assets as the gift card capture (verbatim URLs)
  bannerLogo: `${GCS}dfc6208bcbd66fc42eb981f27c8429a96f0285a1.png?generation=1793768744541913&alt=media`,
  essential: IMG_ESSENTIAL,
  pc: IMG_PC,
  premium: IMG_PREMIUM,
  ultimate: IMG_ULTIMATE,
  applePay: `${GCS}dd6e842fcce7d583e70dddf074d9307e29d69a8e.svg?generation=1793768744578617&alt=media`,
  googlePay: `${GCS}8916ddaefd4ac6e1dfdec635acab443637130fa2.svg?generation=1793768744565450&alt=media`,
  paypal: `${GCS}30c574904376dfec8831a78ecd59a0a32c9f79bb.svg?generation=1793768744543155&alt=media`,
};

// Region chips ("Game region:" step). Capture has Europe selected.
export const GAME_PASS_REGIONS = ["Global", "US", "Europe", "India"];
export const GAME_PASS_DEFAULT_REGION = "Europe";

// 19 subscription variants, capture order (alphabetical). price/discount/was
// verbatim EUR values from the capture; trial rows show a plain price.
// bestValue: live 2026-11-04 shows a "Best Value" chip on Essential 12
// Months (not present in the capture — live addition, same chip style as
// the Popular ribbon).
export const GAME_PASS_VARIANTS = [
  { label: "Xbox Essential - 1 Month", price: "6.79", discount: "-25%*", was: "8.99", img: IMG_ESSENTIAL },
  { label: "Xbox Essential - 12 Months", price: "35.28", discount: "-65%*", was: "99.96", img: IMG_ESSENTIAL, bestValue: true },
  { label: "Xbox Essential - 3 Months", price: "16.06", discount: "-36%*", was: "24.99", img: IMG_ESSENTIAL },
  { label: "Xbox Essential - 6 Months", price: "20.17", discount: "-60%*", was: "49.98", img: IMG_ESSENTIAL },
  { label: "Xbox Game Pass - PC - 1 Month", price: "8.25", discount: "-37%*", was: "12.99", img: IMG_PC },
  { label: "Xbox Game Pass - PC - 12 Months", price: "53.21", discount: "-66%*", was: "155.99", img: IMG_PC },
  { label: "Xbox Game Pass - PC - 3 Months", price: "12.89", discount: "-67%*", was: "38.99", img: IMG_PC },
  { label: "Xbox Game Pass - PC - 6 Months", price: "26.14", discount: "-67%*", was: "77.99", img: IMG_PC },
  { label: "Xbox Game Pass - PC Trial - 1 Month", price: "7.78", trial: true, img: IMG_PC },
  { label: "Xbox Game Pass - PC Trial - 14 Days", price: "5.49", trial: true, img: IMG_PC },
  { label: "Xbox Premium - 1 Month", price: "7.04", discount: "-46%*", was: "12.99", img: IMG_PREMIUM },
  { label: "Xbox Premium - 12 Months", price: "63.32", discount: "-65%*", was: "179.99", img: IMG_PREMIUM },
  { label: "Xbox Premium - 3 Months", price: "18.35", discount: "-60%*", was: "44.99", img: IMG_PREMIUM },
  { label: "Xbox Premium - 6 Months", price: "36.71", discount: "-60%*", was: "89.99", img: IMG_PREMIUM },
  { label: "Xbox Ultimate - 1 Month", price: "8.25", img: IMG_ULTIMATE, popular: true },
  { label: "Xbox Ultimate - 12 Months", price: "73.40", discount: "-71%*", was: "251.99", img: IMG_ULTIMATE },
  { label: "Xbox Ultimate - 3 Months", price: "17.89", discount: "-72%*", was: "62.99", img: IMG_ULTIMATE },
  { label: "Xbox Ultimate - 6 Months", price: "36.70", discount: "-71%*", was: "125.99", img: IMG_ULTIMATE },
  { label: "Xbox Ultimate Trial - 1 Month", price: "8.25", trial: true, img: IMG_ULTIMATE },
];

// Pre-selected attribute (the capture's own URL: attribute_value_id=xbox-ultimate-1-month)
export const GAME_PASS_DEFAULT_VARIANT = "Xbox Ultimate - 1 Month";

export const GAME_PASS_DISCLAIMER =
  "*The percentage compares listed price with the official in-game store price (excluding any additional fees) at the time of comparison. It's shown for reference only and doesn't imply any affiliation with or endorsement by the game's publisher. The price shown isn't final, and a payment fee is added at checkout.";

// Featured "Popular" offer card (capture: ThorStore offer of the selected variant)
export const GAME_PASS_FEATURED_OFFER = {
  deliveryTime: "11 min - 20 min",
  total: { price: "8.25", discount: "-61%*", was: "20.99" },
  seller: {
    name: "ThorStore",
    avatar: `${GCS}0da93045a04f7230ce00fe1bcef7969bd9933968.jpg?generation=1793776859920752&alt=media`,
    rating: "99.8%",
    reviews: "26,988",
  },
};

// "Other sellers (8)" — 6 rows per page in the capture (2 pages).
export const GAME_PASS_OTHER_SELLERS_COUNT = 8;
export const GAME_PASS_OTHER_SELLERS_PAGES = 2;

export const GAME_PASS_OTHER_SELLERS = [
  { name: "Vivi-Deals", avatar: `${GCS}4b46fcc0ebbc1b2521b7cf6840a6852827c5ab3f.jpg?generation=1793776859889269&alt=media`, rating: "100%", reviews: "19,301", delivery: "9 min", price: "8.26", discount: "-61%*", was: "20.99" },
  { name: "Gamerly", avatar: `${GCS}7d16936908c6a45b9e9d76057f5c9308650a50a7.png?generation=1793776859885020&alt=media`, rating: "100%", reviews: "10,866", delivery: "9 min", price: "9.36", discount: "-56%*", was: "20.99" },
  { name: "Zentrica", avatar: `${GCS}045ff05cb743ff7fe407e88cff93ddb34efb86a3.png?generation=1793776859894269&alt=media`, rating: "99.8%", reviews: "1499", delivery: "2 min", price: "9.64", discount: "-55%*", was: "20.99" },
  { name: "245HOURS", avatar: `${GCS}92b73b3611ec97dc4af9f17b641888666d69f936.png?generation=1793776859917403&alt=media`, rating: "100%", reviews: "1858", delivery: "20 min", price: "11.10", discount: "-48%*", was: "20.99" },
  { name: "globalgold", avatar: `${GCS}a0ff0164f022b965c8198742550ce38d4ce0e3d3.png?generation=1793776860107065&alt=media`, rating: "99.6%", reviews: "23,346", delivery: "18 min", price: "11.89", discount: "-44%*", was: "20.99" },
  { name: "games001", avatar: `${GCS}e0d4951329d36a50cdf8111f73ec380e53bba625.png?generation=1793776860052874&alt=media`, rating: "99.8%", reviews: "1112", delivery: "1 min", price: "11.92", discount: "-44%*", was: "20.99" },
];

// Answers scraped live 2026-11-04 (collapsed/empty in the capture).
export const GAME_PASS_FAQ = [
  {
    q: "How much does Xbox Game Pass cost?",
    paragraphs: [
      "This depends on your desired Xbox Game Pass plan and the region you are playing in. In general, the more expensive the default price in your region is, the bigger the discount you can get by buying Xbox Game Pass with Eldorado!In general Xbox Game Pass Prices range from 1$ for 14 day trial to 4.5$ for a month's trial of Xbox Game Pass Ultimate for the trial versions of Game Pass, while non-trial versions can range from 3$ for a month of PC Game Pass to 120$ for a year's worth of subscription to Xbox Game Pass Ultimate. The Game Pass Ultimate subscription is usually the most expensive option, while trials and console subscriptions tend to be the cheapest.",
    ],
  },
  {
    q: "Where I can find the best Xbox Game Pass deals?",
    paragraphs: [
      "Eldorado.gg offers the best deals to buy Xbox Game Pass significantly cheaper than anywhere else. Why pay 11.99$ for a PC Game Pass when you can buy it for 3$? And if you're looking for the Xbox Ultimate Game Pass, you can expect to get it for 10.96$ for the non-trial version or even 4.49$ for the trial!",
    ],
  },
  {
    q: "Can you get Xbox Game Pass for 1 Euro?",
    paragraphs: [
      "You certainly can! Eldorado always has plenty of Game Pass Trial Code & Account offers for just 1 Euro! This is the perfect opportunity to experience all that the Game Pass has to offer at the absolute lowest price. And should you be interested in longer duration subscriptions, do note that due to higher standard prices of Game Pass for European customers, the discounts we can offer for their purchase are even bigger!",
    ],
  },
  {
    q: "What is the difference between Xbox Game Pass and Ultimate Game Pass?",
    paragraphs: [
      "Xbox Game Pass Ultimate includes all the features of Xbox Game Pass, plus several other perks like Online Multiplayer of any game of your choice, not just the free games, as well as cloud gaming option, in case your hardware cannot keep up with demanding specs requirements of a particular game. The Xbox Game Pass Ultimate also includes both PC and Console subscription in one neat package, so you can share the subscription between the devices.",
    ],
  },
  {
    q: "Where can I get Xbox Game Pass Trial Code cheaply?",
    paragraphs: [
      "At Eldorado.gg of course! Eldorado always has plenty of stock of cheap Xbox Game Pass Trial codes at just 1$, so you won't need to sell your kidneys to enjoy many of the latest games that Game Pass has to offer.",
    ],
  },
  {
    q: "Is buying Xbox Game Pass worth it?",
    paragraphs: [
      "That's a question only you can answer and the best way to do it is by grabbing an Xbox Game Pass Trial Code for just 1$ and trying it out for yourself! Xbox Game Pass will grant you access to a library of games ranging from timeless classics to new releases at a much cheaper price point than it would cost to buy games individually. So, if you'll enjoy all the benefits that Xbox Game Pass has to offer, you're welcome to purchase longer subscriptions and if not, well, you've just learned a lot about yourself and your interests for the low price of a 1$ Game Pass Trial.",
    ],
  },
  {
    q: "How long do games stay on Game Pass?",
    paragraphs: [
      "That depends on an individual game and agreements between Microsoft and game publishers, some leave the game pass within a few months, while others stay as part of Game Pass for years. The average expected timeframe you can expect for a game to stay on Xbox Game Pass is 1 year. Usually, when game is about to leave Game Pass library, it is announced a couple weeks in advance, so you have time to prepare.",
    ],
  },
  {
    q: "Do you need Game Pass to play online?",
    paragraphs: [
      "While you can play Free to Play games like Fortnite and Rocket League online without a Game Pass, if you expect to play other games on an Xbox console in online multiplayer mode, you will need a Game Pass Core or Ultimate subscription.",
    ],
  },
  {
    q: "Does Xbox Game Pass include Cloud Gaming feature?",
    paragraphs: [
      "Cloud Gaming feature is exclusive to Xbox Game Pass Ultimate. While it is the most expensive of available Game Pass plans, it allows you to play highly demanding titles on any PC, Laptop, Xbox, phone, tablet or even Smart TV without installing the game locally and irrespective of game's hardware requirements. All processing of the game is done in Microsoft servers and streamed right into your screen. Only thing you should be aware of is that streaming games is a highly bandwidth intensive endeavor therefore you will need connection speed of at least 20 Mbps to enjoy Cloud Gaming with Xbox Game Pass Ultimate.",
    ],
  },
];

// SEO copy verbatim from the capture (h1 + gradient badge + blocks).
export const GAME_PASS_SEO = {
  title: "Buy Xbox Game Pass",
  orders: "12,261,600",
  blocks: [
    { p: "Would you like to experience a variety of games and genres, all in one convenient place? Well, we have a great deal for you! Buy Xbox Game Pass cheap on Eldorado and you can play an ever-changing list of titles, each fully available to download and play solo or with friends. Once purchased, the service will allow the players to try out different games available in the vast Xbox Game Pass library with no strings attached. If you prefer to jump from game to game till you find a new favorite, or if youd like to sink your teeth into a specific title and want to try it out beforehand, this is your one-stop shop for all your gaming needs. Browse the Xbox Game Pass discount offers and find the one that fits you best. After, you simply have to find your new favorite among the Xbox Game Pass for sale selections." },
    { h2: "Xbox Game Pass cheap" },
    { p: "When it comes to gaming, Xbox Game Pass covers more than one device. So, whether youre interested in Xbox Game Pass PC, you will still be able to access the games for the console without any restriction. When it comes to the games available, you can find both the newest releases you can play on day one and older classics that will evoke nostalgia. With cheap Xbox Game Pass for 1 dollar, you will be able to play games that are worth a hundred times that! Perhaps you want to catch up on an ongoing series, or maybe you prefer the old-school platformers. Xbox Game Pass has it all and more. You no longer have to break the bank to be able to play the newest releases and share the experience with the community connected via Xbox Game Pass." },
    { h2: "Xbox Game Pass Key" },
    { p: "Whats more - there are layers to the game pass. You can get a simpler, regular version that will cover only the device of your choice (console or PC), or you can obtain Xbox Game Pass Ultimate that supports the games for all the available platforms. So if you want to cover your gaming needs both on console and PC, and never lose out on playing with friends regardless of the device they use, your best bet is to grab Xbox Game Pass Ultimate deals on Eldorado. And thats not all! When it comes to Xbox Game Pass, there are different ways to keep your pass active. You can either subscribe for a monthly fee, or use Xbox Game Pass key to active the service for your account. So, youre not only able to purchase Xbox Game Pass Ultimate cheap, you will also unlock a great collection of games that you can play alone or together with friends. Among the available offers you will find Game Pass Ultimate 12 months one-time purchase, or get the same service for a shooter period. Your gaming is in your hands, so buy Xbox Game Pass today and experience the joy of unlimited gaming, solo or with friends, regardless of the device you own. Buy Xbox Game Pass cheap as your ultimate key to gaming freedom." },
    { h2: "How to buy Xbox Game Pass" },
    { p: "Looking to buy Xbox Game Pass? Heres a quick guide on how to get started:" },
    {
      list: [
        "Browse the listed Xbox Game Pass offers and select what best suits your needs",
        "Carefully read the item descriptions and ensure it match what youre looking for, including potential restrictions",
        "Click the Buy Now button and make a payment with your preferred payment method",
        "Once the payment is confirmed, youll be connected to the seller via a chat window",
        "The seller will inform you how you can redeem Xbox Game Pass in-game within the specified delivery time",
        "Once the Xbox Game Pass were successfully obtained, please mark the order as Received.",
      ],
    },
    { p: "And youre done! Now you can use Game Pass to enhance your gaming experience." },
  ],
};
