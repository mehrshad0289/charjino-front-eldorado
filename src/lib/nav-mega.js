import { serverFetch } from "./server-fetcher";
import { apiPaths } from "./api-paths";
import { productHref, categoryHref } from "./format-toman";
import { derivedGiftPlatform, giftShopHref } from "./gift-card-shop";
import { preferFaTitle } from "./catalog-region";
import { ALL_GAMES, POPULAR_GAMES, RECENTLY_VIEWED_GAMES } from "../components/eldorado/data/referenceData";
import {
  SHOP_ACCOUNTS_HREF,
  SHOP_BOOSTING_HREF,
  SHOP_CURRENCY_HREF,
  SHOP_GIFT_CARDS_HREF,
  SHOP_ITEMS_HREF,
  SHOP_TOPUPS_HREF,
} from "../components/eldorado/data/faCopy";

const BRAND_HUB_BY_PLATFORM = {
  "google-play": "google-play",
  itunes: "apple-itunes",
  playstation: "playstation",
  steam: "steam",
  xbox: "xbox",
  valorant: "valorant",
  "free-fire": "free-fire",
};

export const NAV_VERTICALS = {
  Currency: { source: "market", offer: "Currency", landing: SHOP_CURRENCY_HREF, shopKey: "currency" },
  Accounts: { source: "market", offer: "Account", landing: SHOP_ACCOUNTS_HREF, shopKey: "accounts" },
  "Top ups": { source: "catalog", slug: "game-topup", landing: SHOP_TOPUPS_HREF, shopKey: "top-ups" },
  Items: { source: "market", offer: "CustomItem", landing: SHOP_ITEMS_HREF, promo: true, shopKey: "items" },
  Boosting: { source: "market", offer: "RequestedBoosting", landing: SHOP_BOOSTING_HREF, shopKey: "boosting" },
  "Gift cards": { source: "catalog", slug: "gift-card", landing: SHOP_GIFT_CARDS_HREF, shopKey: "gift-cards" },
};

function asRecord(value) {
  return value && typeof value === "object" ? value : {};
}

function asString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function stripRegion(title) {
  return asString(title).replace(/\s*\([^)]*\)\s*$/, "").trim();
}

const ICON_BY_NAME = new Map();
for (const row of [...RECENTLY_VIEWED_GAMES, ...POPULAR_GAMES, ...ALL_GAMES]) {
  const key = asString(row.name).toLowerCase();
  if (key && row.img && !ICON_BY_NAME.has(key)) ICON_BY_NAME.set(key, row.img);
}

function iconFor(name) {
  return ICON_BY_NAME.get(asString(name).toLowerCase()) || "";
}

function emptyMega(promo = false) {
  return { popular: [], all: [], promo };
}

function shopGameHref(shopKey, rec) {
  const id = rec.id != null ? String(rec.id) : asString(rec.game_name);
  if (!shopKey || !id) return "";
  return `/shop/${shopKey}/${encodeURIComponent(id)}`;
}

function catalogPageItems(payload) {
  return Array.isArray(payload?.items) ? payload.items : Array.isArray(payload) ? payload : [];
}

async function fetchCatalogPages(slug) {
  const first = await serverFetch(apiPaths.catalogProducts({ category: slug, page: 1, perPage: 100 }));
  const rows = [...catalogPageItems(first)];
  const totalPages = Math.min(Number(first?.meta?.totalPages) || 1, 6);
  if (totalPages <= 1) return rows;

  const rest = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, index) =>
      serverFetch(apiPaths.catalogProducts({ category: slug, page: index + 2, perPage: 100 })),
    ),
  );
  for (const payload of rest) rows.push(...catalogPageItems(payload));
  return rows;
}

const MEGA_TTL_MS = 60_000;
const megaMemo = new Map();

export async function buildNavMegaCached(verticalKey) {
  const key = `gift-search-fa:${verticalKey}`;
  const hit = megaMemo.get(key);
  if (hit && Date.now() - hit.at < MEGA_TTL_MS) return hit.data;
  const data = await buildNavMega(verticalKey);
  megaMemo.set(key, { at: Date.now(), data });
  return data;
}

function catalogHref(product, verticalKey) {
  const rec = asRecord(product);
  if (verticalKey === "Gift cards") return giftShopHref(derivedGiftPlatform(rec));
  const platform = asString(rec.platform);
  const handle = asString(rec.handle);
  const hub = BRAND_HUB_BY_PLATFORM[platform];
  if (hub) return categoryHref(hub);
  return handle ? productHref(handle) : "";
}

function uniqueCatalogGames(products, verticalKey) {
  const seen = new Map();
  for (const item of products) {
    const rec = asRecord(item);
    const handle = asString(rec.handle);
    const title = preferFaTitle(rec) || asString(rec.title) || asString(rec.titleEn);
    if (!handle || !title) continue;
    const derived = verticalKey === "Gift cards" ? derivedGiftPlatform(rec) : "";
    const platform = verticalKey === "Gift cards" ? derived : asString(rec.platform);
    const key = platform ? `p:${platform}` : `t:${stripRegion(rec.titleEn || title).toLowerCase()}`;
    const current = seen.get(key);
    const row = {
      name: stripRegion(title) || title,
      nameEn: stripRegion(asString(rec.titleEn) || asString(rec.nameEn)),
      img: asString(rec.thumbnail) || asString(rec.image),
      href: catalogHref(rec, verticalKey),
      popular: Boolean(rec.isPopular),
      platform,
    };
    if (!current) {
      seen.set(key, row);
      continue;
    }
    if (row.popular && !current.popular) seen.set(key, { ...row, img: row.img || current.img });
    else if (!current.img && row.img) current.img = row.img;
  }
  return [...seen.values()].filter((row) => row.href);
}

const POPULAR_CATALOG_PLATFORMS = [
  "xbox",
  "playstation",
  "steam",
  "itunes",
  "roblox",
  "amazon",
  "razer-gold",
  "discord",
  "valorant",
  "google-play",
  "pubg",
  "pubg-mobile",
];

function mapCatalogMega(products, verticalKey) {
  const unique = uniqueCatalogGames(products, verticalKey);
  const all = [...unique].sort((a, b) => a.name.localeCompare(b.name, "fa"));
  const flagged = unique.filter((row) => row.popular);
  const byPlatform = unique.filter((row) => POPULAR_CATALOG_PLATFORMS.includes(row.platform));
  const popular = (flagged.length > 0 ? flagged : byPlatform.length > 0 ? byPlatform : unique).slice(0, 12);
  const toRow = (row) => ({ name: row.name, nameEn: row.nameEn || "", img: row.img, href: row.href });
  return { popular: popular.map(toRow), all: all.map(toRow) };
}

function mapMarketMega(items, offer, shopKey) {
  const rows = (Array.isArray(items) ? items : [])
    .map((item) => {
      const rec = asRecord(item);
      const name = asString(rec.game_name_fa) || asString(rec.game_name);
      if (!name) return null;
      const offers = Array.isArray(rec.popular_offers) ? rec.popular_offers : [];
      const href = shopGameHref(shopKey, rec);
      if (!href) return null;
      return {
        name,
        nameEn: asString(rec.game_name),
        img: iconFor(rec.game_name) || iconFor(name),
        href,
        popular: offers.includes(offer),
        sort: Number(rec.sort_order) || 0,
      };
    })
    .filter(Boolean);
  const all = [...rows].sort((a, b) => a.name.localeCompare(b.name, "fa"));
  const popular = rows.filter((row) => row.popular).slice(0, 12);
  const bySort = [...rows].sort((a, b) => a.sort - b.sort || a.name.localeCompare(b.name, "fa"));
  const toRow = (row) => ({ name: row.name, nameEn: row.nameEn || "", img: row.img, href: row.href });
  return {
    popular: (popular.length > 0 ? popular : bySort.slice(0, 12)).map(toRow),
    all: all.map(toRow),
  };
}

export async function buildNavMega(verticalKey) {
  const config = NAV_VERTICALS[verticalKey];
  if (!config) return emptyMega(false);

  try {
    if (config.source === "catalog") {
      const products = await fetchCatalogPages(config.slug);
      const mapped = mapCatalogMega(products, verticalKey);
      return { ...mapped, promo: Boolean(config.promo) };
    }

    const payload = await serverFetch(apiPaths.marketGames(config.offer));
    const items = Array.isArray(payload?.items) ? payload.items : [];
    const mapped = mapMarketMega(items, config.offer, config.shopKey);
    return { ...mapped, promo: Boolean(config.promo) };
  } catch {
    return emptyMega(Boolean(config.promo));
  }
}
