import { serverFetch, ApiError } from "./server-fetcher";
import { apiPaths } from "./api-paths";
import { getBackendUrl } from "./env";
import { toFaDigits } from "./fa-digits";
import { formatTomanPrice, productHref } from "./format-toman";
import {
  giftShopHrefFromProduct,
  isGiftCardProduct,
  isTopupProduct,
  loadProductHub,
  shopTopupHrefFromProduct,
  tabForStoreCategory,
} from "./gift-card-shop";
import { preferFaTitle } from "./catalog-region";
import { pickTopupDisplayName, topupShopHref } from "./topup-hub";

export const STORE_CATEGORY_KEYS = ["currency", "accounts", "top-ups", "items", "boosting", "gift-cards"];

function asRecord(value) {
  return value && typeof value === "object" ? value : {};
}

function asString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function catalogPageItems(payload) {
  return Array.isArray(payload?.items) ? payload.items : Array.isArray(payload) ? payload : [];
}

export function isStoreCategoryKey(value) {
  return STORE_CATEGORY_KEYS.includes(asString(value).toLowerCase());
}

export async function loadStoreCategories() {
  try {
    const data = await serverFetch(apiPaths.catalogStoreCategories);
    return Array.isArray(data?.items) ? data.items : [];
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) return [];
    throw error;
  }
}

export async function loadStoreCategory(key) {
  const id = asString(key).toLowerCase();
  if (!isStoreCategoryKey(id)) return null;
  try {
    return asRecord(await serverFetch(apiPaths.catalogStoreCategory(id)));
  } catch (error) {
    if (error instanceof ApiError && (error.statusCode === 404 || error.statusCode === 503)) return null;
    throw error;
  }
}

function tabMatchesStoreCategory(tab, categoryKey) {
  const item = asRecord(tab);
  if (asString(item.storeCategory) === categoryKey) return true;
  const href = asString(item.href);
  if (categoryKey === "top-ups") return href.includes("/shop/top-ups/");
  if (categoryKey === "gift-cards") {
    return (
      href.startsWith("/gift-card/") ||
      href.includes("/shop/gift-cards/") ||
      href === "/playstation-plus" ||
      href === "/xbox-game-pass"
    );
  }
  if (categoryKey === "accounts") return href.includes("/shop/accounts/");
  if (categoryKey === "boosting") return href.includes("/shop/boosting/");
  if (categoryKey === "currency") return href.includes("/shop/currency/");
  return href.includes(`/shop/${categoryKey}/`);
}

export function hubCardsFromCategory(category) {
  const rec = asRecord(category);
  const categoryKey = asString(rec.key);
  const seen = new Set();
  const cards = [];
  for (const hub of Array.isArray(rec.hubs) ? rec.hubs : []) {
    const row = asRecord(hub);
    const tabs = (Array.isArray(row.tabs) ? row.tabs : []).filter((tab) => tabMatchesStoreCategory(tab, categoryKey));
    const hubKey = asString(row.hubKey);
    const title = asString(row.title) || hubKey;
    const item = asRecord(tabs[0]);
    let href = asString(item.href);
    if (categoryKey === "top-ups" && hubKey && href.startsWith("/shop/top-ups/")) {
      href = topupShopHref(hubKey) || href;
    }
    if (!href.startsWith("/") || seen.has(href)) continue;
    seen.add(href);
    const gameTitle = asString(row.gameTitle);
    const gameTitleFa = asString(row.gameTitleFa);
    cards.push({
      key: hubKey || href,
      name:
        categoryKey === "top-ups"
          ? pickTopupDisplayName({ hubKey, hubTitle: title })
          : gameTitleFa || gameTitle || title,
      gameTitle,
      gameTitleFa,
      tag: asString(item.label),
      img: "",
      href,
    });
  }
  return cards;
}

function normShopName(value) {
  return asString(value).toLowerCase().replace(/\s+/g, " ").trim();
}

export async function currencyHubKeyForMarket(raw) {
  const game = await resolveMarketGame("currency", raw);
  if (!game) return "";
  const cards = hubCardsFromCategory(await loadStoreCategory("currency"));
  const names = new Set([game.game_name, game.game_name_fa].map(normShopName).filter(Boolean));
  const hit = cards.find((card) =>
    [card.name, card.gameTitle, card.gameTitleFa].some((label) => names.has(normShopName(label))),
  );
  return asString(hit?.key);
}

export async function loadCatalogGroupCards(slug, { gift = false } = {}) {
  if (!asString(slug)) return [];
  try {
    const first = await serverFetch(apiPaths.catalogProducts({ category: slug, page: 1, perPage: 100 }));
    const rows = [...catalogPageItems(first)];
    const seen = new Set();
    const items = [];
    for (const row of rows) {
      const rec = asRecord(row);
      const handle = asString(rec.handle);
      const title = preferFaTitle(rec) || asString(rec.title);
      if (!handle || !title) continue;
      const href = gift || isGiftCardProduct(rec)
        ? giftShopHrefFromProduct(rec)
        : isTopupProduct(rec)
          ? shopTopupHrefFromProduct(rec)
          : productHref(handle);
      if (!href || seen.has(href)) continue;
      seen.add(href);
      items.push({
        key: href,
        name: title,
        tag: asString(rec.categoryName),
        img: asString(rec.thumbnail) || asString(rec.imageUrl),
        href,
      });
    }
    return items;
  } catch (error) {
    if (error instanceof ApiError) return [];
    throw error;
  }
}

export async function loadMarketGameCards(offer, categoryKey) {
  if (!asString(offer) || !asString(categoryKey)) return [];
  try {
    const payload = await serverFetch(apiPaths.marketGames(offer));
    const items = Array.isArray(payload?.items) ? payload.items : [];
    return items
      .map((row) => {
        const rec = asRecord(row);
        const name = asString(rec.game_name_fa) || asString(rec.game_name);
        const id = rec.id != null ? String(rec.id) : asString(rec.game_name);
        if (!name || !id) return null;
        return {
          key: id,
          name,
          tag: asString(rec.publisher),
          img: "",
          href: `/shop/${categoryKey}/${encodeURIComponent(id)}`,
          gameName: asString(rec.game_name),
        };
      })
      .filter(Boolean);
  } catch (error) {
    if (error instanceof ApiError) return [];
    throw error;
  }
}

export async function loadMarketListings(game) {
  const name = asString(game);
  if (!name) return { items: [], meta: null };
  try {
    const payload = await serverFetch(apiPaths.marketListings({ game: name, page: 1, perPage: 24 }));
    return {
      items: Array.isArray(payload?.items) ? payload.items : [],
      meta: payload?.meta || null,
    };
  } catch (error) {
    if (error instanceof ApiError) return { items: [], meta: null };
    throw error;
  }
}

export async function loadMarketListing(id) {
  const listingId = String(id || "").trim();
  if (!listingId) return null;
  try {
    return asRecord(await serverFetch(apiPaths.marketListing(listingId)));
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) return null;
    throw error;
  }
}

export function mediaUrl(url) {
  const value = asString(url);
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  const origin = getBackendUrl().replace(/\/api\/?$/, "");
  return `${origin}${value.startsWith("/") ? value : `/${value}`}`;
}

function listingChips(rec) {
  return (Array.isArray(rec.card_attributes) ? rec.card_attributes : [])
    .map((row) => {
      const item = asRecord(row);
      const label = asString(item.label_fa) || asString(item.key);
      const value = asString(item.value);
      return label && value ? `${label}: ${value}` : value || label;
    })
    .filter(Boolean);
}

function sellerRating(seller) {
  const count = Number(seller.rating_count || 0);
  const avg = Number(seller.rating_avg);
  if (!count || !Number.isFinite(avg)) return "";
  return `${toFaDigits(avg.toFixed(1))} (${toFaDigits(count)})`;
}

export function listingToOffer(listing, categoryKey) {
  const rec = asRecord(listing);
  const id = rec.id != null ? String(rec.id) : "";
  if (!id) return null;
  const price = Number(rec.price_amount ?? rec.price);
  const seller = asRecord(rec.seller);
  const cover = asRecord(rec.cover_image);
  const chips = listingChips(rec);
  return {
    href: `/shop/${categoryKey}/l/${encodeURIComponent(id)}`,
    title: asString(rec.title) || asString(rec.game_name),
    desc: chips.join(" · ") || asString(rec.description) || asString(rec.game_name),
    img: mediaUrl(cover.url || rec.cover),
    seller: asString(seller.name) || "فروشنده",
    rating: sellerRating(seller),
    price: Number.isFinite(price) && price > 0 ? formatTomanPrice(price) : "",
    priceAmount: Number.isFinite(price) ? price : 0,
    attributes: asRecord(rec.attributes),
    delivery: "پس از پرداخت",
  };
}

export async function loadMarketFacets(game) {
  const name = asString(game);
  if (!name) return [];
  try {
    const payload = await serverFetch(apiPaths.marketListingFacets(name));
    return Array.isArray(payload?.fields) ? payload.fields : [];
  } catch (error) {
    if (error instanceof ApiError) return [];
    throw error;
  }
}

export async function resolveMarketGame(categoryKey, hub) {
  const needle = decodeURIComponent(asString(hub));
  if (!needle) return null;
  try {
    const payload = await serverFetch(apiPaths.marketGames());
    const items = Array.isArray(payload?.items) ? payload.items : [];
    const fromList =
      items.find((row) => String(asRecord(row).id) === needle) ||
      items.find((row) => asString(asRecord(row).game_name) === needle);
    if (fromList) return fromList;
    const catalogHub = await loadProductHub(needle);
    const tab = tabForStoreCategory(catalogHub, categoryKey);
    const sourceId = asString(asRecord(tab).sourceId);
    if (!sourceId) return null;
    return (
      items.find((row) => String(asRecord(row).id) === sourceId) ||
      items.find((row) => asString(asRecord(row).game_name) === sourceId) ||
      null
    );
  } catch (error) {
    if (error instanceof ApiError) return null;
    throw error;
  }
}
