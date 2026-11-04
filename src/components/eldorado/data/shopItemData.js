/* Session 18 — /roblox-items shop-item category page, verbatim from the
   user-pushed capture `ui ux/shop-item/…roblox-items…make` (decoded
   snapshots/shopitem-1920px-light-1.tsx by
   scripts/decode_session18_captures.py; cards extracted by
   scripts/extract_shopitem_cards.py, SEO text by
   scripts/generate_shopitem_data.js). Capture quirks kept verbatim:
   all 24 offer cards carry the SAME Roblox thumbnail asset (lazy-load
   capture artifact), delivery times are 20 min except two 1 h rows. */

const ASSET = "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F";

export const SHOP_ITEM_GAME = {
  name: "Roblox",
  icon: `${ASSET}6bd89c168a9f90453af21035f84fea8a34b5b07e.png?generation=1793805755122899&alt=media`,
  banner: `${ASSET}3dc1f3acb06f6d5646426b81fc717fa1c1d29d77.png?generation=1793727745913594&alt=media`,
};

/* Dark game sub-nav (h-14, bg rgb(40,40,54)): icon + game name left,
   centered tabs, active tab white w/ 2px white underline + yellow glow. */
export const SHOP_ITEM_TABS = [
  { label: "Robux", href: "/buy-robux" },
  { label: "Accounts", href: "/roblox-accounts-for-sale" },
  { label: "Top ups", href: "/top-up-roblox" },
  { label: "Items", href: "/roblox-items", active: true },
  { label: "Boosting", href: "/roblox-boosting" },
  { label: "Gift cards", href: "/roblox-gift-card" },
];

export const SHOP_ITEM_FILTERS = {
  title: "Filters",
  priceLabel: "Price ()",
  ranges: [
    { label: "0 - 50", icon: `${ASSET}3e4bfca158d2f5453fdd12f07c44781b93190788.svg?generation=1793805755105370&alt=media` },
    { label: "50 - 150", icon: `${ASSET}c1de6e8d1a50c878d9cf240db59d90304f655f68.svg?generation=1793805755120841&alt=media` },
    { label: "150 - 300", icon: `${ASSET}f83fbb8215060e1803d60f8558c0d30a62b5b047.svg?generation=1793805755139922&alt=media` },
    { label: "300+", icon: `${ASSET}9702cde3e7bee1a1ff1794b941fd1ea3ad08b652.svg?generation=1793805755176479&alt=media` },
  ],
  gameLabel: "Game",
  gameSearch: "Search Game",
  games: [
    { label: "Steal a Brainrot", icon: `${ASSET}06f2c5fb3c862b06a0a1790236612e7af548dd2a.svg?generation=1793805755122231&alt=media` },
    { label: "Grand Piece Online", icon: `${ASSET}036ce8cbbdfbb6322cd82cd2c4f60bfb6e576cb9.svg?generation=1793805755121646&alt=media` },
    { label: "Murder Mystery 2", icon: `${ASSET}a3f4b09b07a8066a68627775d84e3fcf5b262e94.svg?generation=1793805755151499&alt=media` },
    { label: "Blox Fruits", icon: `${ASSET}821712858a07d9f1d9c7be7dc6d1265dced7b63c.svg?generation=1793805755152844&alt=media` },
    { label: "Rivals", icon: `${ASSET}4a36cae0a34823003a28828b0446ba04990d2e66.svg?generation=1793805755299547&alt=media` },
  ],
  showMore: "Show more (33)",
};

/* Selected-filter chips above the grid (white pills, outline rgb(231,231,231)). */
export const SHOP_ITEM_CHIPS = [
  "Anime Adventures",
  "Robux",
  "MM2",
  "Headless",
  "Rivals",
  "Anime Dice",
  "Steal an Egg",
  "YBA",
  "Kukirin Life",
  "Steal A Pet And Ride It",
];

export const SHOP_ITEM_TOOLBAR = {
  resultCount: "31057 items found",
  sortLabel: "Recommended",
  sortIcon: "sort",
};

export const SHOP_ITEM_OFFERS = 
[
  {
    "href": "https://www.eldorado.gg/roblox-items/oi/3f065911-9d13-4b31-0691-08def39aa693",
    "tags": [
      "Other"
    ],
    "title": "+1 Anime Eyes - VIP+ [699R]",
    "img": "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F7a1248a3fabc75aa183ac3b726bf61bf2e6de170.png?generation=1793805755314288&alt=media",
    "seller": "ggbomshop",
    "online": true,
    "rating": "99.7%&nbsp;(44,839)",
    "price": "4.79",
    "unit": "/ unit",
    "delivery": "20 min"
  },
  {
    "href": "https://www.eldorado.gg/roblox-items/oi/af67f552-6f66-4a7c-dc7d-08df2f5e7ffb",
    "tags": [
      "Other"
    ],
    "title": "Chop A Forest 2X GEMS",
    "img": "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F7a1248a3fabc75aa183ac3b726bf61bf2e6de170.png?generation=1793805755314288&alt=media",
    "seller": "FedeoInc",
    "online": true,
    "rating": "99.8%&nbsp;(18,866)",
    "price": "1.24",
    "unit": "/ unit",
    "delivery": "20 min"
  },
  {
    "href": "https://www.eldorado.gg/roblox-items/oi/28f27b09-2107-44d0-f54d-08dec300fdb0",
    "tags": [
      "Murder Mystery 2"
    ],
    "title": "Gemstone",
    "img": "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F7a1248a3fabc75aa183ac3b726bf61bf2e6de170.png?generation=1793805755314288&alt=media",
    "seller": "Bolt_Gaming",
    "online": true,
    "rating": "99.9%&nbsp;(55,192)",
    "price": "0.78",
    "unit": "/ unit",
    "delivery": "20 min"
  },
  {
    "href": "https://www.eldorado.gg/roblox-items/oi/72e44a68-9c83-4323-16b2-08deb25083c9",
    "tags": [
      "The Strongest Battlegrounds"
    ],
    "title": "The Strongest Battlegrounds&gt;SUPER EMERALDS",
    "img": "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F7a1248a3fabc75aa183ac3b726bf61bf2e6de170.png?generation=1793805755314288&alt=media",
    "seller": "SunRise",
    "online": true,
    "rating": "99.2%&nbsp;(205,344)",
    "price": "1.41",
    "unit": "/ unit",
    "delivery": "20 min"
  },
  {
    "href": "https://www.eldorado.gg/roblox-items/oi/fe46b291-9dd6-4539-377d-08df03403df2",
    "tags": [
      "Murder Mystery 2"
    ],
    "title": "CandyMM2",
    "img": "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F7a1248a3fabc75aa183ac3b726bf61bf2e6de170.png?generation=1793805755314288&alt=media",
    "seller": "Ryuu-Loot",
    "online": true,
    "rating": "99.2%&nbsp;(12,103)",
    "price": "4.57",
    "unit": "/ unit",
    "delivery": "20 min"
  },
  {
    "href": "https://www.eldorado.gg/roblox-items/oi/a8796910-9827-49c1-568d-08deb70a76a7",
    "tags": [
      "Adopt Me"
    ],
    "title": "Turtle FR -Adopt Me",
    "img": "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F7a1248a3fabc75aa183ac3b726bf61bf2e6de170.png?generation=1793805755314288&alt=media",
    "seller": "Bolt_Gaming",
    "online": true,
    "rating": "99.9%&nbsp;(55,192)",
    "price": "12.82",
    "unit": "/ unit",
    "delivery": "20 min"
  },
  {
    "href": "https://www.eldorado.gg/roblox-items/oi/cba20cf1-aed9-48b5-0e03-08def6af1dd2",
    "tags": [
      "Other"
    ],
    "title": "Anime Capture&gt;2x Gems",
    "img": "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F7a1248a3fabc75aa183ac3b726bf61bf2e6de170.png?generation=1793805755314288&alt=media",
    "seller": "SunRise",
    "online": true,
    "rating": "99.2%&nbsp;(205,344)",
    "price": "2.13",
    "unit": "/ unit",
    "delivery": "20 min"
  },
  {
    "href": "https://www.eldorado.gg/roblox-items/oi/1b9a7e0f-f840-4491-53ad-08df03403c69",
    "tags": [
      "Other"
    ],
    "title": "4K 4000 GemsPS99",
    "img": "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F7a1248a3fabc75aa183ac3b726bf61bf2e6de170.png?generation=1793805755314288&alt=media",
    "seller": "Ryuu-Loot",
    "online": true,
    "rating": "99.2%&nbsp;(12,103)",
    "price": "0.00001",
    "unit": "/ unit",
    "delivery": "20 min"
  },
  {
    "href": "https://www.eldorado.gg/roblox-items/oi/7398d4d7-bec3-4503-a1ca-08df052b2f96",
    "tags": [
      "Blox Fruits"
    ],
    "title": "Permanent Yeti Blox Fruits",
    "img": "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F7a1248a3fabc75aa183ac3b726bf61bf2e6de170.png?generation=1793805755314288&alt=media",
    "seller": "Ryuu-Loot",
    "online": true,
    "rating": "99.2%&nbsp;(12,103)",
    "price": "23.14",
    "unit": "/ unit",
    "delivery": "20 min"
  },
  {
    "href": "https://www.eldorado.gg/roblox-items/oi/055b1063-4a5a-4585-7495-08def39aab74",
    "tags": [
      "Other"
    ],
    "title": "Red Seer - MM2",
    "img": "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F7a1248a3fabc75aa183ac3b726bf61bf2e6de170.png?generation=1793805755314288&alt=media",
    "seller": "Bolt_Gaming",
    "online": true,
    "rating": "99.9%&nbsp;(55,192)",
    "price": "0.72",
    "unit": "/ unit",
    "delivery": "20 min"
  },
  {
    "href": "https://www.eldorado.gg/roblox-items/oi/2f1dae69-98c4-40fc-5cf0-08dec786604b",
    "tags": [
      "Sniper Duels"
    ],
    "title": "Sniper Duels - 1000 Gems800R",
    "img": "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F7a1248a3fabc75aa183ac3b726bf61bf2e6de170.png?generation=1793805755314288&alt=media",
    "seller": "Hellenshop",
    "online": true,
    "rating": "98.4%&nbsp;(199,393)",
    "price": "5.13",
    "unit": "/ unit",
    "delivery": "20 min"
  },
  {
    "href": "https://www.eldorado.gg/roblox-items/oi/7aeebbdb-6059-4c0f-8401-08deed6678a4",
    "tags": [
      "Driving Empire"
    ],
    "title": "Driving Empire&gt;2025 Lamborghini Temerario GT3",
    "img": "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F7a1248a3fabc75aa183ac3b726bf61bf2e6de170.png?generation=1793805755314288&alt=media",
    "seller": "SunRise",
    "online": true,
    "rating": "99.2%&nbsp;(205,344)",
    "price": "16.11",
    "unit": "/ unit",
    "delivery": "20 min"
  },
  {
    "href": "https://www.eldorado.gg/roblox-items/oi/19a675d7-8c81-4773-a754-08df029a5e34",
    "tags": [
      "Sniper Duels"
    ],
    "title": "Sniper Duels - 500 Gems",
    "img": "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F7a1248a3fabc75aa183ac3b726bf61bf2e6de170.png?generation=1793805755314288&alt=media",
    "seller": "Ryuu-Loot",
    "online": true,
    "rating": "99.2%&nbsp;(12,103)",
    "price": "3.66",
    "unit": "/ unit",
    "delivery": "20 min"
  },
  {
    "href": "https://www.eldorado.gg/roblox-items/oi/dd935813-6b29-4624-05f3-08df336282fc",
    "tags": [
      "Grand Piece Online"
    ],
    "title": "1M Peli [Trade] - GPO",
    "img": "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F7a1248a3fabc75aa183ac3b726bf61bf2e6de170.png?generation=1793805755314288&alt=media",
    "seller": "Ryuu-Loot",
    "online": true,
    "rating": "99.2%&nbsp;(12,103)",
    "price": "6.09",
    "unit": "/ unit",
    "delivery": "20 min"
  },
  {
    "href": "https://www.eldorado.gg/roblox-items/oi/057a0c57-8b19-498c-ed04-08df302c5e75",
    "tags": [
      "Other"
    ],
    "title": "Chop A Forest - 2x Gems [199R]",
    "img": "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F7a1248a3fabc75aa183ac3b726bf61bf2e6de170.png?generation=1793805755314288&alt=media",
    "seller": "BloxHive",
    "online": true,
    "rating": "99.1%&nbsp;(578)",
    "price": "1.46",
    "unit": "/ unit",
    "delivery": "20 min"
  },
  {
    "href": "https://www.eldorado.gg/roblox-items/oi/4b00034a-dd78-4a96-19b9-08df0fe80929",
    "tags": [
      "Dress to Impress"
    ],
    "title": "Dress to Impress 2 X MONEY",
    "img": "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F7a1248a3fabc75aa183ac3b726bf61bf2e6de170.png?generation=1793805755314288&alt=media",
    "seller": "FedeoInc",
    "online": true,
    "rating": "99.8%&nbsp;(18,866)",
    "price": "2.48",
    "unit": "/ unit",
    "delivery": "20 min"
  },
  {
    "href": "https://www.eldorado.gg/roblox-items/oi/721efa90-97c1-4ed2-9d5d-08deec9374d7",
    "tags": [
      "BlockSpin"
    ],
    "title": "BlockSpin - HUMVEE [8000R]",
    "img": "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F7a1248a3fabc75aa183ac3b726bf61bf2e6de170.png?generation=1793805755314288&alt=media",
    "seller": "ggbomshop",
    "online": true,
    "rating": "99.7%&nbsp;(44,839)",
    "price": "52.86",
    "unit": "/ unit",
    "delivery": "20 min"
  },
  {
    "href": "https://www.eldorado.gg/roblox-items/oi/f634d260-95bb-46ba-9320-936940d9edf0",
    "tags": [
      "Blox Fruits"
    ],
    "title": "Blox Fruits - Gas2500R",
    "img": "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F7a1248a3fabc75aa183ac3b726bf61bf2e6de170.png?generation=1793805755314288&alt=media",
    "seller": "Hellenshop",
    "online": true,
    "rating": "98.4%&nbsp;(199,393)",
    "price": "15.49",
    "unit": "/ unit",
    "delivery": "1 h"
  },
  {
    "href": "https://www.eldorado.gg/roblox-items/oi/1516b9cb-b30a-4973-9c91-3944476eecb8",
    "tags": [
      "Other"
    ],
    "title": "Blade Ball | VIP Pass",
    "img": "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F7a1248a3fabc75aa183ac3b726bf61bf2e6de170.png?generation=1793805755314288&alt=media",
    "seller": "SYNX-STORE",
    "online": true,
    "rating": "",
    "price": "1.09",
    "unit": "/ unit",
    "delivery": "20 min"
  },
  {
    "href": "https://www.eldorado.gg/roblox-items/oi/2274e9c3-94ca-4e32-fa2c-08df09875756",
    "tags": [
      "Grand Piece Online"
    ],
    "title": "Leopard Fruit | GPO",
    "img": "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F7a1248a3fabc75aa183ac3b726bf61bf2e6de170.png?generation=1793805755314288&alt=media",
    "seller": "PTLShopGame",
    "online": true,
    "rating": "99.8%&nbsp;(45,241)",
    "price": "3.66",
    "unit": "/ unit",
    "delivery": "20 min"
  },
  {
    "href": "https://www.eldorado.gg/roblox-items/oi/d40f0d81-609a-4dc5-8106-5d4587ba8a4e",
    "tags": [
      "BlockSpin"
    ],
    "title": "BlockSpin MANSION",
    "img": "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F7a1248a3fabc75aa183ac3b726bf61bf2e6de170.png?generation=1793805755314288&alt=media",
    "seller": "FedeoInc",
    "online": true,
    "rating": "99.8%&nbsp;(18,866)",
    "price": "18.68",
    "unit": "/ unit",
    "delivery": "20 min"
  },
  {
    "href": "https://www.eldorado.gg/roblox-items/oi/0636ca4c-2e5b-4f88-7e07-08df1571b102",
    "tags": [
      "Jailbreak"
    ],
    "title": "Jailbreak - VIP750R",
    "img": "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F7a1248a3fabc75aa183ac3b726bf61bf2e6de170.png?generation=1793805755314288&alt=media",
    "seller": "Hellenshop",
    "online": true,
    "rating": "98.4%&nbsp;(199,393)",
    "price": "4.94",
    "unit": "/ unit",
    "delivery": "1 h"
  },
  {
    "href": "https://www.eldorado.gg/roblox-items/oi/014a571c-3634-4840-d53c-08defcf7f6b7",
    "tags": [
      "Driving Empire"
    ],
    "title": "Driving Empire - 600K Cash [800R]",
    "img": "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F7a1248a3fabc75aa183ac3b726bf61bf2e6de170.png?generation=1793805755314288&alt=media",
    "seller": "ggbomshop",
    "online": true,
    "rating": "99.7%&nbsp;(44,839)",
    "price": "5.47",
    "unit": "/ unit",
    "delivery": "20 min"
  },
  {
    "href": "https://www.eldorado.gg/roblox-items/oi/74837bbd-a1c7-4487-9a08-8fd357ef76dd",
    "tags": [
      "Dress to Impress"
    ],
    "title": "Dress To Impress&gt;2x Money",
    "img": "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F7a1248a3fabc75aa183ac3b726bf61bf2e6de170.png?generation=1793805755314288&alt=media",
    "seller": "SunRise",
    "online": true,
    "rating": "99.2%&nbsp;(205,344)",
    "price": "2.55",
    "unit": "/ unit",
    "delivery": "20 min"
  }
]
;

export const SHOP_ITEM_PAGINATION = {
  pages: [1, 2, 3, 4, 5],
  last: 1000,
  next: "Next",
  active: 1,
};

/* Trust row between pagination and the SEO block. */
export const SHOP_ITEM_TRUST = { prefix: "From last", orders: "386,200", suffix: "orders" };

export const SHOP_ITEM_SEO_HTML = `<p class="mb-[16px]">Roblox is a free to play video game that has tons of different type of items that you can acquire throughout your Roblox journey. Roblox items for sale will help you stand out in the Roblox community crowd, no matter where you are, players will recognize your flashy avatar with the most unique Roblox items that ever existed or even the most wanted Jailbreak cars. In Eldorado, you can find variety of Roblox items, ranging from Roblox Gym League items for sale, to all types of Roblox clothes and Roblox hats for various games, Royale High halos, GPO items such as mochi, all seeing eye and mera, Jailbreak toys, Roblox accessories,<a href="https://www.eldorado.gg/roblox-groups-for-sale/i/70-2-0" class="text-[rgb(45,_94,_173)]">Roblox groups</a> and even if you're looking to move an extra step you can purchase <a href="https://www.eldorado.gg/buy-robux/g/70-0-0" class="text-[rgb(45,_94,_173)]">Roblox Robux</a>. Only on this platform you have tons of Roblox items such as Da Hood skins and even <a href="https://www.eldorado.gg/roblox-offsale/a/70-1-0" class="text-[rgb(45,_94,_173)]">Roblox Accounts with Offsale Items</a> that will improve your Roblox experience and take your gameplay to the next level.</p><h2 class="font-bold leading-[19px]">Buy Jailbreak Cars, GPO Fruits</h2><p class="mb-[16px]">Roblox has variety of games on its platform. Everytime there are new games released that can get really popular. The more popular ones that you can find on this page are Jailbreak, Toilet Tower Defense, Grand Piece Online, Da Hood. At Eldorado.gg, we have plenty of Roblox items offers for these games. Our offers include Jailbreak cars, Royale High diamonds and sets, Toilet Tower Defense units and more. Buy Jailbreak cars cheap from Eldorado and elevate your experience right away.</p><p class="mb-[16px]">There are also new games coming every day to Roblox platform, games like Da Hood, All Star Tower Defense, Pet Simulator X are freshly developed and thanks to Roblox they get recognition quickly and jump straight up with the player count. Eldorado has all of these Roblox games covered, whether you need ASTD units, PSX items, AUT skins, Toilet Tower Defense items or anything else from games like Deepwoken gems and Lumber Tycoon 2, you can find it right away with one simple search. Buy Lumber Tycoon 2 axes and GPO fruits instantly.</p><h2 class="font-bold leading-[19px]">How to buy Roblox Items</h2><p class="mb-[16px]">Looking to buy Roblox items? Heres a quick guide on how to get started:</p><ol class="ml-[30px] mb-[20px]"><li class="list-decimal"><p>Browse the listed Roblox items offers and select what best suits your needs</p></li><li class="list-decimal"><p>Carefully read the item descriptions and ensure it match what youre looking for, including potential restrictions</p></li><li class="list-decimal"><p>Click the Buy Now button and make a payment with your preferred payment method</p></li><li class="list-decimal"><p>Once the payment is confirmed, youll be connected to the seller via a chat window</p></li><li class="list-decimal"><p>The seller will inform you how you can redeem Roblox items in-game within the specified delivery time</p></li><li class="list-decimal"><p>Once the Roblox items were successfully obtained, please mark the order as Received.</p></li></ol><p class="mb-[16px]">And youre done! Now you can use Roblox items to enhance your gaming experience.</p><p class="mb-[16px]">Eldorado is not affiliated, associated, authorized, endorsed by, or in any way officially connected with Roblox Corporation, Roblox or any of its subsidiaries or its affiliates. The official Roblox website can be found at: https://www.roblox.com/ The names Roblox, Robux as well as related names, marks, emblems and images are registered trademarks of their respective owners. Use of trademarks is covered by fair use principles under EU Regulation 2017/1001, Article 14.</p>`;
