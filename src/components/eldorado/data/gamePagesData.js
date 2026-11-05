import { SHOP_SUBSCRIPTION_IMAGES } from "./shopSubscriptionData";

/* Game shop pages for the internal links that pointed at live
   eldorado.gg game routes (SearchOverlay results, related links) —
   session 26, user request: "all pages must exist and be linked from
   /pagelist". NO user-pushed captures exist for these routes, so every
   page is a TEMPLATE INSTANCE of the capture-built shop anatomy
   (cod-points wiring: dark banner strip with game tabs, platform/region
   chips + amount card + disclaimer flow, featured offer + seller card,
   other-sellers table, reviews/process/FAQ/trust/SEO bands) fed from
   this config. Seller names/avatars are the capture-verbatim seller
   pool; amounts/prices follow each game's official store tiers where
   they are public (Fortnite V-Bucks, PokéCoins, Razer Gold pins,
   Robux) and are template-generated elsewhere — documented here, not
   invented silently. Tab links to sibling shop types keep their live
   eldorado.gg URLs (only this clone's own routes are internal). */

const GCS = "https://storage.googleapis.com/";

export const GAME_SELLER_POOL = [
  { name: "PowerXhub", avatar: `${GCS}download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F3cf9d978c8dd900e0d45614ab8b78a167391d52a.png?generation=1793816217707498&alt=media`, rating: "100%", reviews: "6,006" },
  { name: "CNLTeam", avatar: `${GCS}download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2Fa135388df1ecabeb8e69b5849c9f9e0e9ba42267.png?generation=1793816217720069&alt=media`, rating: "99.3%", reviews: "1,452,599" },
  { name: "BoosterHub", avatar: `${GCS}download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F40ea4846c39443a7c55b036b1ad69eff377b516b.png?generation=1793816217719768&alt=media`, rating: "99.8%", reviews: "19,258" },
  { name: "FastEasySeller", avatar: `${GCS}download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F366bc7841b8bdbecd97aa20bbaf8dfd933b17077.png?generation=1793816217749177&alt=media`, rating: "99.5%", reviews: "501,397" },
  { name: "GAFFA", avatar: `${GCS}download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F31af18e66ea8d2486a07bdad89a93c61d336ba46.png?generation=1793816217771350&alt=media`, rating: "99.9%", reviews: "1,037" },
  { name: "245HOURS", avatar: `${GCS}download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F92b73b3611ec97dc4af9f17b641888666d69f936.png?generation=1793776859917403&alt=media`, rating: "100%", reviews: "1,861" },
  { name: "LunaGuardTrades", avatar: `${GCS}download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F70faaf8cecde988ed71b70bd1f95e7df16c6072c.png?generation=1793816217759122&alt=media`, rating: "99.3%", reviews: "42,155" },
];

const S = GAME_SELLER_POOL;

/* helper: build the 6-row other-sellers table around a base price */
function sellers(base, was, discount, deliveries) {
  return S.slice(1).map((s, i) => ({
    ...s,
    delivery: deliveries[i % deliveries.length],
    price: (base + i * 0.42).toFixed(2),
    discount,
    was,
  }));
}

const DELIVERIES = ["9 min", "16 min", "21 min", "10 min", "20 min", "14 min"];

/* amount-card artwork: no per-game GCS assets exist for these routes, so
   the template reuses the CoD Points coin png (the shop template's own
   asset) for currency-style variants and the generic banner logo
   otherwise — GameShopPage passes them through unchanged. */
const COIN_IMG = `${GCS}download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2Ffc634dd39c41a1d5b0f486fd8cd93df29def7a6d.png?generation=1793816217542944&alt=media`;
const BOX_IMG = `${GCS}download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F788a609f6ffe02b96eefc8d91988bff55600a303.png?generation=1793816217585655&alt=media`;

function v(label, sub, price, opts = {}) {
  return { label, sub, price, img: opts.box ? BOX_IMG : COIN_IMG, ...opts };
}

function seo(title, orders, intro, h2, body) {
  return {
    title,
    orders,
    blocks: [{ p: intro }, { h2 }, { p: body }],
  };
}

export const GAME_PAGES = {
  "aion-2-kinah": {
    path: "/aion-2-kinah/g/360",
    category: "Currency",
    banner: {
      gameName: "Aion 2",
      iconAlt: "Aion 2 Kinah",
      tabs: [
        { key: "Accounts", href: "https://www.eldorado.gg/aion-2-accounts/a/371-0-0" },
        { key: "Currency", href: "/aion-2-kinah/g/360" },
        { key: "Items", href: "https://www.eldorado.gg/aion-2-items/i/371-2-0" },
        { key: "Boosting", href: "https://www.eldorado.gg/aion-2-boosting/b/371-4" },
      ],
      active: "Currency",
    },
    regionLabel: "Game region",
    regions: ["Europe", "North America", "Asia"],
    defaultRegion: "Europe",
    variants: [
      v("100M", "Kinah", "4.99"),
      v("500M", "Kinah", "19.99"),
      v("1B", "Kinah", "34.99", { discount: "-30%*", was: "49.99", popular: true }),
      v("2B", "Kinah", "64.99", { discount: "-35%*", was: "99.99" }),
      v("5B", "Kinah", "149.99", { discount: "-40%*", was: "249.99" }),
    ],
    defaultVariant: "1B Kinah",
    featured: {
      deliveryTime: "15 min - 1 h",
      stock: 7,
      total: { price: "34.99", discount: "-30%*", was: "49.99" },
      seller: S[0],
    },
    others: { count: 6, pages: 1, rows: sellers(35.4, "49.99", "-30%*", DELIVERIES) },
    seo: seo(
      "Buy Aion 2 Kinah Cheap",
      "128,411",
      "Buy Aion 2 Kinah cheap — the main currency of Aion 2 used for gear, trade board purchases and crafting materials. Kinah from verified sellers with TradeShield buyer protection and delivery times starting at 15 minutes, so you can skip the grind and go straight to endgame progression.",
      "Aion 2 Kinah for Sale",
      "Every Kinah offer on this page is delivered through the in-game trade or mail system by a verified seller. Compare prices across regions, pick the amount that fits your goal and complete the checkout — the seller delivers while you keep playing. Larger Kinah packs carry the biggest percentage savings compared with the official exchange."
    ),
  },

  "arc-raiders-items": {
    path: "/arc-raiders-items/i/319",
    category: "Items",
    banner: {
      gameName: "ARC Raiders",
      iconAlt: "ARC Raiders items",
      tabs: [
        { key: "Accounts", href: "https://www.eldorado.gg/arc-raiders-accounts/a/319-1-0" },
        { key: "Currency", href: "https://www.eldorado.gg/arc-raiders-currency/g/319-0-0" },
        { key: "Items", href: "/arc-raiders-items/i/319" },
        { key: "Boosting", href: "https://www.eldorado.gg/arc-raiders-boosting/b/319-4" },
      ],
      active: "Items",
    },
    regionLabel: "Game platform",
    regions: ["PC", "PlayStation 5", "Xbox Series X|S"],
    defaultRegion: "PC",
    variants: [
      v("Starter pack", "Items bundle", "6.99", { box: true }),
      v("Raider bundle", "Items bundle", "14.99", { box: true }),
      v("Veteran bundle", "Items bundle", "29.99", { discount: "-25%*", was: "39.99", box: true, popular: true }),
      v("Legendary cache", "Items bundle", "49.99", { discount: "-30%*", was: "69.99", box: true }),
      v("Full inventory", "Items bundle", "89.99", { discount: "-36%*", was: "139.99", box: true }),
    ],
    defaultVariant: "Veteran bundle Items bundle",
    featured: {
      deliveryTime: "20 min - 2 h",
      stock: 4,
      total: { price: "29.99", discount: "-25%*", was: "39.99" },
      seller: S[2],
    },
    others: { count: 6, pages: 1, rows: sellers(30.4, "39.99", "-25%*", DELIVERIES) },
    seo: seo(
      "Buy ARC Raiders Items Cheap",
      "34,120",
      "Buy ARC Raiders items from verified sellers — weapons, consumables, crafting materials and full gear bundles delivered face-to-face or through the in-game market. Skip the raid grind and equip your raider with the loadout you need for the next extraction.",
      "ARC Raiders Items for Sale",
      "Item offers are listed by sellers with public feedback scores and TradeShield protection. Bundles are assembled from in-game loot and delivered on your server; pick a bundle, checkout and coordinate the delivery in the order chat. Stock updates in real time as sellers list new caches."
    ),
  },

  "buy-robux": {
    path: "/buy-robux",
    category: "Currency",
    banner: {
      gameName: "Roblox",
      iconAlt: "Robux",
      tabs: [
        { key: "Accounts", href: "https://www.eldorado.gg/roblox-accounts-for-sale" },
        { key: "Robux", href: "/buy-robux" },
        { key: "Items", href: "https://www.eldorado.gg/roblox-items" },
        { key: "Boosting", href: "https://www.eldorado.gg/roblox-boosting" },
      ],
      active: "Robux",
    },
    regionLabel: "",
    regions: null,
    defaultRegion: null,
    variants: [
      v("400", "Robux", "4.99"),
      v("800", "Robux", "9.99"),
      v("1700", "Robux", "19.99", { discount: "-20%*", was: "24.99", popular: true }),
      v("4500", "Robux", "49.99", { discount: "-17%*", was: "59.99" }),
      v("10000", "Robux", "99.99", { discount: "-23%*", was: "124.99" }),
    ],
    defaultVariant: "1700 Robux",
    featured: {
      deliveryTime: "5 min - 30 min",
      stock: 12,
      total: { price: "19.99", discount: "-20%*", was: "24.99" },
      seller: S[0],
    },
    others: { count: 6, pages: 1, rows: sellers(20.3, "24.99", "-20%*", ["5 min", "8 min", "12 min", "6 min", "15 min", "9 min"]) },
    seo: seo(
      "Buy Robux Cheap",
      "3,204,881",
      "Buy Robux cheap and get your Roblox balance topped up by verified sellers in minutes. Robux is the Roblox currency used for avatar accessories, game passes and developer products — compare offers below and pick the pack that fits your budget.",
      "Robux for Sale",
      "Robux offers are delivered through group payouts or game passes, both official Roblox systems, so your account stays safe. Every seller on this page is identity-verified with public feedback. Larger Robux packs carry the best price per Robux compared with the official store."
    ),
  },

  "donutsmp-money": {
    path: "/donutsmp-money/g/278",
    category: "Currency",
    banner: {
      gameName: "DonutSMP",
      iconAlt: "DonutSMP money",
      tabs: [
        { key: "Accounts", href: "https://www.eldorado.gg/donutsmp-accounts/a/278-1-0" },
        { key: "Currency", href: "/donutsmp-money/g/278" },
        { key: "Items", href: "https://www.eldorado.gg/donutsmp-items/i/278-2-0" },
        { key: "Boosting", href: "https://www.eldorado.gg/donutsmp-boosting/b/278-4" },
      ],
      active: "Currency",
    },
    regionLabel: "",
    regions: null,
    defaultRegion: null,
    variants: [
      v("1M", "Money", "3.49"),
      v("10M", "Money", "9.99", { discount: "-70%*", was: "34.90", popular: true }),
      v("100M", "Money", "24.99", { discount: "-92%*", was: "349.00" }),
      v("250M", "Money", "49.99", { discount: "-94%*", was: "872.50" }),
      v("500M", "Money", "89.99", { discount: "-95%*", was: "1,745.00" }),
    ],
    defaultVariant: "10M Money",
    featured: {
      deliveryTime: "10 min - 1 h",
      stock: 9,
      total: { price: "9.99", discount: "-70%*", was: "34.90" },
      seller: S[1],
    },
    others: { count: 6, pages: 1, rows: sellers(10.2, "34.90", "-70%*", DELIVERIES) },
    seo: seo(
      "Buy DonutSMP Money Cheap",
      "86,402",
      "Buy DonutSMP money cheap from verified sellers and jump straight into trading, building and beacon-crafting on the DonutSMP server. In-game cash is delivered in person at your island or through the server's trade system.",
      "DonutSMP Money for Sale",
      "Money offers are delivered face-to-face or via chest transactions on DonutSMP. Compare seller ratings, delivery times and price per million below — bulk packs carry the steepest discounts compared with small top-ups."
    ),
  },

  "ea-fc-coins": {
    path: "/ea-fc-coins/g/142-0-0",
    category: "Currency",
    banner: {
      gameName: "EA FC 27",
      iconAlt: "EA FC coins",
      tabs: [
        { key: "Accounts", href: "https://www.eldorado.gg/ea-fc-accounts/a/142-1-0" },
        { key: "Coins", href: "/ea-fc-coins/g/142-0-0" },
        { key: "Items", href: "https://www.eldorado.gg/ea-fc-items/i/142-2-0" },
        { key: "Boosting", href: "/ea-fc-boosting/b/142-4" },
      ],
      active: "Coins",
    },
    regionLabel: "Game platform",
    regions: ["Console", "PC"],
    defaultRegion: "Console",
    variants: [
      v("100K", "Coins", "12.99"),
      v("200K", "Coins", "24.99"),
      v("300K", "Coins", "34.99", { discount: "-13%*", was: "39.99", popular: true }),
      v("500K", "Coins", "54.99", { discount: "-15%*", was: "64.99" }),
      v("1M", "Coins", "99.99", { discount: "-23%*", was: "129.99" }),
    ],
    defaultVariant: "300K Coins",
    featured: {
      deliveryTime: "30 min - 2 h",
      stock: 6,
      total: { price: "34.99", discount: "-13%*", was: "39.99" },
      seller: S[3],
    },
    others: { count: 6, pages: 1, rows: sellers(35.6, "39.99", "-13%*", DELIVERIES) },
    seo: seo(
      "Buy EA FC Coins Cheap",
      "5,849,020",
      "Buy EA FC 27 coins cheap and sign the players you actually want. Coins are the Ultimate Team currency for the transfer market, packs and SBCs — verified sellers deliver through the auction house with a comfortable margin so your account stays protected.",
      "EA FC Coins for Sale",
      "Coin transfers are done via the transfer market using the player-tax method, the safest delivery route for Ultimate Team. Choose your platform (Console or PC), pick an amount and the seller lists a card for you to buy. Delivery windows and per-100K pricing are shown on every offer."
    ),
  },

  "fortnite-vbucks": {
    path: "/fortnite-vbucks/t/16",
    category: "Top ups",
    banner: {
      gameName: "Fortnite",
      iconAlt: "Fortnite V-Bucks",
      tabs: [
        { key: "Accounts", href: "https://www.eldorado.gg/fortnite-accounts/a/16-1-0" },
        { key: "V-Bucks", href: "/fortnite-vbucks/t/16" },
        { key: "Items", href: "https://www.eldorado.gg/fortnite-items/i/16-2-0" },
        { key: "Boosting", href: "https://www.eldorado.gg/fortnite-boosting/b/16-4" },
      ],
      active: "V-Bucks",
    },
    regionLabel: "Game platform",
    regions: ["PC", "PlayStation", "Xbox", "Nintendo Switch"],
    defaultRegion: "PC",
    variants: [
      v("1,000", "V-Bucks", "8.99"),
      v("2,800", "V-Bucks", "22.99"),
      v("5,000", "V-Bucks", "31.99", { discount: "-20%*", was: "39.99", popular: true }),
      v("13,500", "V-Bucks", "76.99", { discount: "-15%*", was: "89.99" }),
    ],
    defaultVariant: "5,000 V-Bucks",
    featured: {
      deliveryTime: "15 min - 1 h",
      stock: 8,
      total: { price: "31.99", discount: "-20%*", was: "39.99" },
      seller: S[4],
    },
    others: { count: 6, pages: 1, rows: sellers(32.4, "39.99", "-20%*", DELIVERIES) },
    seo: seo(
      "Buy Fortnite V-Bucks Cheap",
      "2,096,314",
      "Buy Fortnite V-Bucks cheap — V-Bucks are the Fortnite currency for the Item Shop, Battle Pass and Crew cosmetics. Verified sellers top up your account directly or gift the amount through the gifting system, with TradeShield protection on every order.",
      "Fortnite V-Bucks for Sale",
      "V-Bucks amounts below match the official store tiers, so you always know the saving. Pick your platform, choose an amount and checkout — the seller delivers while the Epic Games store keeps its own balance untouched. Battle Pass tiers and starter packs are available from the same sellers."
    ),
  },

  "mm2-shop": {
    path: "/mm2-shop/i/204-2-0",
    category: "Items",
    banner: {
      gameName: "Murder Mystery 2",
      iconAlt: "MM2 items",
      tabs: [
        { key: "Accounts", href: "https://www.eldorado.gg/mm2-accounts/a/204-1-0" },
        { key: "Currency", href: "https://www.eldorado.gg/mm2-currency/g/204-0-0" },
        { key: "Items", href: "/mm2-shop/i/204-2-0" },
        { key: "Boosting", href: "https://www.eldorado.gg/mm2-boosting/b/204-4" },
      ],
      active: "Items",
    },
    regionLabel: "",
    regions: null,
    defaultRegion: null,
    variants: [
      v("Godly knife", "MM2 item", "7.99", { box: true }),
      v("Ancient set", "MM2 items", "19.99", { box: true, popular: true }),
      v("Chroma knife", "MM2 item", "39.99", { discount: "-20%*", was: "49.99", box: true }),
      v("Chroma gun set", "MM2 items", "59.99", { discount: "-25%*", was: "79.99", box: true }),
      v("Inventory upgrade", "MM2 bundle", "99.99", { discount: "-33%*", was: "149.99", box: true }),
    ],
    defaultVariant: "Ancient set MM2 items",
    featured: {
      deliveryTime: "10 min - 45 min",
      stock: 11,
      total: { price: "19.99" },
      seller: S[5],
    },
    others: { count: 6, pages: 1, rows: sellers(20.4, null, null, DELIVERIES) },
    seo: seo(
      "Buy MM2 Items Cheap",
      "412,338",
      "Buy Murder Mystery 2 items from verified sellers — godly and ancient knives, chroma sets and guns delivered in-game through the trade window. TradeShield keeps every MM2 trade protected until you confirm the items arrived.",
      "MM2 Items for Sale",
      "Every MM2 offer is traded hand-to-hand inside Murder Mystery 2, so you see the items land in your inventory before the order completes. Sellers list their full stock with public feedback scores; bundles save the most compared with single-item purchases."
    ),
  },

  "pokemon-go-pokecoins": {
    path: "/pokemon-go-pokecoins/t/57",
    category: "Top ups",
    banner: {
      gameName: "Pokémon GO",
      iconAlt: "PokéCoins",
      tabs: [
        { key: "Accounts", href: "https://www.eldorado.gg/pokemon-go-accounts/a/57-1-0" },
        { key: "PokéCoins", href: "/pokemon-go-pokecoins/t/57" },
        { key: "Items", href: "https://www.eldorado.gg/pokemon-go-items/i/57-2-0" },
        { key: "Boosting", href: "https://www.eldorado.gg/pokemon-go-boosting/b/57-4" },
      ],
      active: "PokéCoins",
    },
    regionLabel: "",
    regions: null,
    defaultRegion: null,
    variants: [
      v("550", "PokéCoins", "4.99"),
      v("1,200", "PokéCoins", "9.99"),
      v("2,500", "PokéCoins", "19.99"),
      v("5,200", "PokéCoins", "39.99", { discount: "-20%*", was: "49.99", popular: true }),
      v("14,500", "PokéCoins", "89.99", { discount: "-10%*", was: "99.99" }),
    ],
    defaultVariant: "5,200 PokéCoins",
    featured: {
      deliveryTime: "20 min - 3 h",
      stock: 5,
      total: { price: "39.99", discount: "-20%*", was: "49.99" },
      seller: S[6],
    },
    others: { count: 6, pages: 1, rows: sellers(40.6, "49.99", "-20%*", DELIVERIES) },
    seo: seo(
      "Buy PokéCoins Cheap",
      "918,664",
      "Buy PokéCoins cheap and stock up on Poké Balls, Incense, Raid Passes and storage upgrades without grinding Gyms. PokéCoins are the Pokémon GO currency — verified sellers deliver the coins to your account with buyer protection on every order.",
      "PokéCoins for Sale",
      "PokéCoin top-ups below follow the official in-app tiers so the saving is always visible. Delivery is done through the shop receipt method by sellers who handle hundreds of orders a week. Larger packs are the cheapest way to keep your item bag and Pokémon storage maxed out."
    ),
  },

  "razer-gold": {
    path: "/razer-gold/v/260",
    category: "Gift cards",
    banner: {
      gameName: "Razer Gold",
      iconAlt: "Razer Gold pin",
      tabs: [
        { key: "Gift cards", href: "/razer-gold/v/260" },
        { key: "Accounts", href: "https://www.eldorado.gg/razer-gold-accounts/a/260-1-0" },
      ],
      active: "Gift cards",
    },
    regionLabel: "Pin region",
    regions: ["Global", "United States", "Europe"],
    defaultRegion: "Global",
    variants: [
      v("5 USD", "Razer Gold pin", "5.49"),
      v("10 USD", "Razer Gold pin", "10.49"),
      v("20 USD", "Razer Gold pin", "20.49", { discount: "-5%*", was: "21.49", popular: true }),
      v("50 USD", "Razer Gold pin", "50.49", { discount: "-8%*", was: "54.99" }),
      v("100 USD", "Razer Gold pin", "98.99", { discount: "-11%*", was: "109.99" }),
    ],
    defaultVariant: "20 USD Razer Gold pin",
    featured: {
      deliveryTime: "5 min - 30 min",
      stock: 15,
      total: { price: "20.49", discount: "-5%*", was: "21.49" },
      seller: S[0],
    },
    others: { count: 6, pages: 1, rows: sellers(20.9, "21.49", "-5%*", ["5 min", "7 min", "11 min", "6 min", "14 min", "9 min"]) },
    seo: seo(
      "Buy Razer Gold Cheap",
      "204,559",
      "Buy Razer Gold pins cheap and pay for games, in-game purchases and Razer Cortex rewards with one balance. Codes are delivered digitally within minutes of checkout — redeem at gold.razer.com and the amount lands in your Razer Gold wallet instantly.",
      "Razer Gold Pins for Sale",
      "Pin codes below cover the Global, United States and Europe regions — match the region to your Razer account before checkout. Every code is scanned from a sealed stock and sent through the order chat, with TradeShield covering the purchase until the code redeems successfully."
    ),
  },

  "roblox-accounts-for-sale": {
    path: "/roblox-accounts-for-sale",
    category: "Accounts",
    banner: {
      gameName: "Roblox",
      iconAlt: "Roblox accounts",
      tabs: [
        { key: "Accounts", href: "/roblox-accounts-for-sale" },
        { key: "Robux", href: "/buy-robux" },
        { key: "Items", href: "https://www.eldorado.gg/roblox-items" },
        { key: "Boosting", href: "https://www.eldorado.gg/roblox-boosting" },
      ],
      active: "Accounts",
    },
    regionLabel: "",
    regions: null,
    defaultRegion: null,
    variants: [
      v("Starter", "Account", "12.99", { box: true }),
      v("Limiteds", "Account", "29.99", { box: true, popular: true }),
      v("Rich inventory", "Account", "59.99", { discount: "-20%*", was: "74.99", box: true }),
      v("OG username", "Account", "99.99", { box: true }),
      v("Collector", "Account", "199.99", { discount: "-25%*", was: "264.99", box: true }),
    ],
    defaultVariant: "Limiteds Account",
    featured: {
      deliveryTime: "30 min - 6 h",
      stock: 3,
      total: { price: "29.99" },
      seller: S[2],
    },
    others: { count: 6, pages: 1, rows: sellers(30.8, null, null, DELIVERIES) },
    seo: seo(
      "Roblox Accounts For Sale",
      "776,042",
      "Roblox accounts for sale — starter accounts, limited-heavy inventories, OG usernames and collector accounts with full access. Every account comes with the original email access so you can secure it right after delivery.",
      "Buy Roblox Accounts",
      "Account offers list the exact Robux balance, limiteds and badges included, so you know what you are buying before checkout. Sellers hand over credentials through the order chat and remain available for the recovery period. TradeShield holds the payment until you confirm full access."
    ),
  },

  "roblox-boosting": {
    path: "/roblox-boosting",
    category: "Boosting",
    banner: {
      gameName: "Roblox",
      iconAlt: "Roblox boosting",
      tabs: [
        { key: "Accounts", href: "https://www.eldorado.gg/roblox-accounts-for-sale" },
        { key: "Robux", href: "/buy-robux" },
        { key: "Items", href: "https://www.eldorado.gg/roblox-items" },
        { key: "Boosting", href: "/roblox-boosting" },
      ],
      active: "Boosting",
    },
    regionLabel: "",
    regions: null,
    defaultRegion: null,
    variants: [
      v("Game completion", "Boosting", "14.99"),
      v("Badge hunt", "Boosting", "19.99"),
      v("Pet sim carry", "Boosting", "29.99", { popular: true }),
      v("Tower carry", "Boosting", "34.99"),
      v("Bee swarm boost", "Boosting", "44.99", { discount: "-15%*", was: "52.99" }),
    ],
    defaultVariant: "Pet sim carry Boosting",
    featured: {
      deliveryTime: "1 h - 24 h",
      stock: 4,
      total: { price: "29.99" },
      seller: S[1],
    },
    others: { count: 6, pages: 1, rows: sellers(30.5, null, null, ["1 h", "2 h", "4 h", "3 h", "6 h", "5 h"]) },
    seo: seo(
      "Roblox Boosting Services",
      "143,207",
      "Roblox boosting services from verified sellers — game completions, badge hunts, pet-sim and tower carries done by experienced players. Pick a service, chat the schedule and watch the progress land on your account.",
      "Roblox Boosting for Sale",
      "Boosters list exactly what the service covers — wins, badges, levels or items farmed — with the delivery window on the offer. Duo-mode carries let you play alongside the booster; piloted services are covered by TradeShield until you confirm the result."
    ),
  },

  "roblox-gift-card": {
    path: "/roblox-gift-card",
    category: "Gift cards",
    banner: {
      gameName: "Roblox",
      iconAlt: "Roblox gift card",
      tabs: [
        { key: "Gift cards", href: "/roblox-gift-card" },
        { key: "Robux", href: "/buy-robux" },
        { key: "Accounts", href: "https://www.eldorado.gg/roblox-accounts-for-sale" },
      ],
      active: "Gift cards",
    },
    regionLabel: "Card region",
    regions: ["Global", "United States", "Europe"],
    defaultRegion: "Global",
    variants: [
      v("10 USD", "Gift card", "10.49"),
      v("25 USD", "Gift card", "25.49", { popular: true }),
      v("50 USD", "Gift card", "50.49", { discount: "-4%*", was: "52.49" }),
      v("100 USD", "Gift card", "99.49", { discount: "-7%*", was: "106.99" }),
    ],
    defaultVariant: "25 USD Gift card",
    featured: {
      deliveryTime: "5 min - 30 min",
      stock: 18,
      total: { price: "25.49" },
      seller: S[4],
    },
    others: { count: 6, pages: 1, rows: sellers(25.9, null, null, ["5 min", "6 min", "9 min", "7 min", "12 min", "8 min"]) },
    seo: seo(
      "Buy Roblox Gift Cards Cheap",
      "512,093",
      "Buy Roblox gift cards cheap — digital codes delivered in minutes, redeemable for Robux or a Roblox Premium subscription. Pick the card region that matches your account and pay with your usual checkout method.",
      "Roblox Gift Cards for Sale",
      "Gift card codes are scanned from sealed stock and delivered through the order chat, usually within five minutes. Codes redeem at roblox.com/redeem for Robux credit or Premium time. TradeShield protects the purchase until the code redeems on your account."
    ),
  },

  "steal-a-brainrot-brainrots": {
    path: "/steal-a-brainrot-brainrots/i/259",
    category: "Items",
    banner: {
      gameName: "Steal a Brainrot",
      iconAlt: "Steal a Brainrot brainrots",
      tabs: [
        { key: "Accounts", href: "https://www.eldorado.gg/steal-a-brainrot-accounts/a/259-1-0" },
        { key: "Currency", href: "https://www.eldorado.gg/steal-a-brainrot-currency/g/259-0-0" },
        { key: "Brainrots", href: "/steal-a-brainrot-brainrots/i/259" },
        { key: "Boosting", href: "https://www.eldorado.gg/steal-a-brainrot-boosting/b/259-4" },
      ],
      active: "Brainrots",
    },
    regionLabel: "",
    regions: null,
    defaultRegion: null,
    variants: [
      v("Rare pack", "Brainrots", "6.99", { box: true }),
      v("Epic pack", "Brainrots", "14.99", { box: true, popular: true }),
      v("Legendary pack", "Brainrots", "29.99", { discount: "-20%*", was: "37.49", box: true }),
      v("Mythic pack", "Brainrots", "49.99", { discount: "-25%*", was: "66.49", box: true }),
      v("Secret Brainrot", "Brainrots", "99.99", { box: true }),
    ],
    defaultVariant: "Epic pack Brainrots",
    featured: {
      deliveryTime: "10 min - 1 h",
      stock: 7,
      total: { price: "14.99" },
      seller: S[3],
    },
    others: { count: 6, pages: 1, rows: sellers(15.3, null, null, DELIVERIES) },
    seo: seo(
      "Buy Steal a Brainrot Brainrots Cheap",
      "1,044,616",
      "Buy Steal a Brainrot brainrots from verified sellers — rare, epic, legendary and secret brainrots delivered to your base in-game. Skip the server luck and get the collection you are hunting for with TradeShield on every trade.",
      "Steal a Brainrot Brainrots for Sale",
      "Brainrot offers are delivered face-to-face on your server: the seller joins, drops the brainrot at your base and the order completes once you confirm. Packs bundle several brainrots at a lower price per unit than single picks."
    ),
  },

  "valorant-accounts": {
    path: "/valorant-accounts/a/32-1-0",
    category: "Accounts",
    banner: {
      gameName: "Valorant",
      iconAlt: "Valorant accounts",
      tabs: [
        { key: "Accounts", href: "/valorant-accounts/a/32-1-0" },
        { key: "Currency", href: "https://www.eldorado.gg/valorant-points/g/32-0-0" },
        { key: "Items", href: "https://www.eldorado.gg/valorant-items/i/32-2-0" },
        { key: "Boosting", href: "https://www.eldorado.gg/valorant-boosting/b/32-4" },
      ],
      active: "Accounts",
    },
    regionLabel: "Account region",
    regions: ["Europe", "North America", "Asia", "MENA"],
    defaultRegion: "Europe",
    variants: [
      v("Unranked", "Account", "14.99", { box: true }),
      v("Gold", "Account", "24.99", { box: true, popular: true }),
      v("Immortal", "Account", "59.99", { discount: "-20%*", was: "74.99", box: true }),
      v("Rare skins", "Account", "89.99", { box: true }),
      v("Radiant", "Account", "189.99", { discount: "-24%*", was: "249.99", box: true }),
    ],
    defaultVariant: "Gold Account",
    featured: {
      deliveryTime: "30 min - 6 h",
      stock: 4,
      total: { price: "24.99" },
      seller: S[5],
    },
    others: { count: 6, pages: 1, rows: sellers(25.6, null, null, DELIVERIES) },
    seo: seo(
      "Valorant Accounts For Sale",
      "388,221",
      "Valorant accounts for sale — unranked starters, ranked-ready Gold and Immortal accounts, rare-skin inventories and Radiant accounts with full access. Every account ships with the original email so you can secure it immediately after delivery.",
      "Buy Valorant Accounts",
      "Account offers list the exact rank, agents unlocked and skins included. Sellers hand over credentials through the order chat and stay available for the recovery window. TradeShield holds the payment until you confirm full access to the account."
    ),
  },

  "top-up-roblox": {
    path: "/top-up-roblox",
    category: "Top ups",
    banner: {
      gameName: "Roblox",
      iconAlt: "Roblox top up",
      tabs: [
        { key: "Robux", href: "/top-up-roblox" },
        { key: "Gift cards", href: "/roblox-gift-card" },
        { key: "Accounts", href: "https://www.eldorado.gg/roblox-accounts-for-sale" },
      ],
      active: "Robux",
    },
    regionLabel: "",
    regions: null,
    defaultRegion: null,
    variants: [
      v("400", "Robux", "4.99"),
      v("800", "Robux", "9.99"),
      v("1700", "Robux", "19.99", { discount: "-20%*", was: "24.99", popular: true }),
      v("4500", "Robux", "49.99", { discount: "-17%*", was: "59.99" }),
      v("10000", "Robux", "99.99", { discount: "-23%*", was: "124.99" }),
    ],
    defaultVariant: "1700 Robux",
    featured: {
      deliveryTime: "5 min - 30 min",
      stock: 12,
      total: { price: "19.99", discount: "-20%*", was: "24.99" },
      seller: S[0],
    },
    others: { count: 6, pages: 1, rows: sellers(20.3, "24.99", "-20%*", ["5 min", "8 min", "12 min", "6 min", "15 min", "9 min"]) },
    seo: seo(
      "Roblox Top Up — Buy Robux",
      "3,204,881",
      "Roblox top up — buy Robux from verified sellers and have your balance topped up in minutes. Robux works across every Roblox experience for game passes, avatar items and developer products.",
      "Roblox Robux Top Up",
      "Top-up offers use official Roblox delivery paths (group payout or game pass) so the balance lands on your own account safely. Compare price per Robux across the packs below — bigger packs win every time against the official store price."
    ),
  },
};

export const GAME_DISCLAIMER =
  "*The percentage compares listed price with the official in-game store price (excluding any additional fees) at the time of comparison. It's shown for reference only and doesn't imply any affiliation with or endorsement by the game's publisher. The price shown isn't final, and a payment fee is added at checkout.";
