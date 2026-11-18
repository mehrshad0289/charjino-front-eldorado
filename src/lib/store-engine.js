import { serverFetch, ApiError } from "./server-fetcher";
import { apiPaths } from "./api-paths";
import { ensureAccessToken } from "./ensure-access-token";
import { getBackendUrl } from "./env";
import { toFaDigits } from "./fa-digits";
import { productHref } from "./format-toman";
import { formatTomanInWords } from "./price";
import {
  giftShopGroupKey,
  isGiftShopProduct,
  loadProductHub,
  storefrontProductHref,
  tabForStoreCategory,
} from "./gift-card-shop";
import { preferFaTitle } from "./catalog-region";
import { humanizeTopupHub, joinTopupSearchText, pickTopupDisplayName, topupShopHref } from "./topup-hub";
import { looksLikeNumericRange, numericExtent } from "./numeric-facet";

export const STORE_CATEGORY_KEYS = ["currency", "accounts", "top-ups", "items", "boosting", "games", "gift-cards"];

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
  if (categoryKey === "games") return href.includes("/shop/games/");
  if (categoryKey === "currency") return href.includes("/shop/currency/");
  return href.includes(`/shop/${categoryKey}/`);
}

function compactHubLabel(value) {
  return asString(value)
    .toLowerCase()
    .replace(/[\s\u200c\-_·]+/g, "");
}

function parentGameGroupKey(card) {
  const id = asString(card.gameKey) || asString(card.gameId);
  if (id) return `id:${id}`;
  return `name:${compactHubLabel(card.gameTitleFa) || compactHubLabel(card.gameTitle) || compactHubLabel(card.key)}`;
}

function labelTopupHubCards(cards) {
  const counts = new Map();
  for (const card of cards) {
    const group = parentGameGroupKey(card);
    counts.set(group, (counts.get(group) || 0) + 1);
  }
  return cards.map((card) => {
    const gameFa = asString(card.gameTitleFa);
    const gameEn = asString(card.gameTitle);
    const game = gameFa || gameEn;
    const tag = asString(card.tag);
    const siblings = counts.get(parentGameGroupKey(card)) || 1;
    const name = game
      ? siblings > 1 && tag && compactHubLabel(tag) !== compactHubLabel(game)
        ? `${game} · ${tag}`
        : game
      : pickTopupDisplayName({
          hubKey: card.key,
          hubTitle: card.hubTitle || card.name,
          nameEn: gameEn,
          faTitle: gameFa,
        });
    return {
      ...card,
      name,
      nameEn: joinTopupSearchText(name, gameEn, gameFa, card.hubTitle, tag, card.key, humanizeTopupHub(card.key)),
    };
  });
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
    const topupHref = tabs
      .map((tab) => asString(asRecord(tab).href))
      .find((path) => path.startsWith("/shop/top-ups/"));
    let href = categoryKey === "top-ups" ? topupHref || asString(item.href) : asString(item.href);
    if (categoryKey === "top-ups" && hubKey) {
      href = topupShopHref(hubKey) || href;
    }
    if (!href.startsWith("/") || seen.has(href)) continue;
    seen.add(href);
    const gameTitle = asString(row.gameTitle);
    const gameTitleFa = asString(row.gameTitleFa);
    cards.push({
      key: hubKey || href,
      name: gameTitleFa || gameTitle || title,
      gameKey: asString(row.gameKey),
      gameId: row.gameId != null ? String(row.gameId) : "",
      gameTitle,
      gameTitleFa,
      tag: asString(item.label),
      hubTitle: title,
      img: "",
      href,
    });
  }
  if (categoryKey === "top-ups") return labelTopupHubCards(cards);
  return cards.map((card) => ({
    ...card,
    name: card.gameTitleFa || card.gameTitle || card.name,
  }));
}

function normShopName(value) {
  return asString(value).toLowerCase().replace(/\s+/g, " ").trim();
}

export async function loadCurrencyOfferGames() {
  try {
    const payload = await serverFetch(apiPaths.marketCurrencyOfferGames);
    return Array.isArray(payload?.items) ? payload.items : [];
  } catch (error) {
    if (error instanceof ApiError) return [];
    throw error;
  }
}

export async function loadItemOfferGames() {
  try {
    const payload = await serverFetch(apiPaths.marketItemOfferGames);
    return Array.isArray(payload?.items) ? payload.items : [];
  } catch (error) {
    if (error instanceof ApiError) return [];
    throw error;
  }
}

export function catalogNumberFacets(setup) {
  const seen = new Set();
  const fields = [];
  for (const type of Array.isArray(setup?.types) ? setup.types : []) {
    for (const filter of Array.isArray(type.filters) ? type.filters : []) {
      const key = asString(filter.key);
      if (asString(filter.input_type) !== "number" || !key || seen.has(key)) continue;
      seen.add(key);
      fields.push({ key, label_fa: asString(filter.name) || key.split("|").pop() || key, type: "number" });
    }
  }
  return fields;
}

export function mergeFacetFields(fields, extra) {
  const out = [...(Array.isArray(fields) ? fields : [])];
  const keys = new Set(out.map((field) => field.key));
  for (const field of Array.isArray(extra) ? extra : []) {
    if (!field?.key || keys.has(field.key)) continue;
    keys.add(field.key);
    out.push(field);
  }
  return out;
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
      const href = storefrontProductHref(rec) || productHref(handle);
      const groupKey = gift || isGiftShopProduct(rec) ? giftShopGroupKey(rec) || href : href;
      if (!href || seen.has(groupKey) || seen.has(href)) continue;
      seen.add(groupKey);
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

export async function loadPlatformListings({ platform, offer, q, perPage = 60 } = {}) {
  const id = asString(platform);
  if (!id) return { items: [], meta: null };
  try {
    const payload = await serverFetch(
      apiPaths.marketListings({
        platform: id,
        offer: asString(offer) || undefined,
        q: asString(q) || undefined,
        page: 1,
        perPage: Math.min(60, Math.max(1, Number(perPage) || 60)),
      }),
    );
    return {
      items: Array.isArray(payload?.items) ? payload.items : [],
      meta: payload?.meta || null,
    };
  } catch (error) {
    if (error instanceof ApiError) return { items: [], meta: null };
    throw error;
  }
}

export async function loadMarketListings(game, offer, perPage = 24) {
  const name = asString(game);
  if (!name) return { items: [], meta: null };
  try {
    const payload = await serverFetch(
      apiPaths.marketListings({
        game: name,
        offer: asString(offer) || undefined,
        page: 1,
        perPage: Math.min(60, Math.max(1, Number(perPage) || 24)),
      }),
    );
    return {
      items: Array.isArray(payload?.items) ? payload.items : [],
      meta: payload?.meta || null,
    };
  } catch (error) {
    if (error instanceof ApiError) return { items: [], meta: null };
    throw error;
  }
}

export function shopCategoryForOffer(offer) {
  if (offer === "CustomItem") return "items";
  if (offer === "Currency") return "currency";
  if (offer === "ConsoleGame") return "games";
  return "accounts";
}

export async function loadPublicProfile(slug) {
  const key = asString(slug);
  if (!key) return null;
  try {
    return asRecord(await serverFetch(apiPaths.marketPublicProfile(key)));
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) return null;
    throw error;
  }
}

export async function loadSellerPublicListings(sellerId, params = {}) {
  const id = asString(sellerId);
  if (!id) return { items: [], meta: null };
  try {
    const payload = await serverFetch(
      apiPaths.marketSellerPublicListings(id, {
        offer: asString(params.offer) || undefined,
        game: asString(params.game) || undefined,
        page: params.page || 1,
        perPage: Math.min(60, Math.max(1, Number(params.perPage) || 24)),
      }),
    );
    return {
      items: Array.isArray(payload?.items) ? payload.items : [],
      meta: payload?.meta || null,
    };
  } catch (error) {
    if (error instanceof ApiError) return { items: [], meta: null };
    throw error;
  }
}

export async function loadSellerPublicReviews(sellerId, params = {}) {
  const id = asString(sellerId);
  if (!id) return { items: [], meta: null, rating_avg: null, rating_count: 0 };
  try {
    const payload = await serverFetch(
      apiPaths.marketSellerPublicReviews(id, {
        sentiment: asString(params.sentiment) || undefined,
        page: params.page || 1,
        perPage: Math.min(20, Math.max(1, Number(params.perPage) || 20)),
      }),
    );
    return {
      items: Array.isArray(payload?.items) ? payload.items : [],
      meta: payload?.meta || null,
      rating_avg: payload?.rating_avg ?? null,
      rating_count: payload?.rating_count ?? 0,
    };
  } catch (error) {
    if (error instanceof ApiError) return { items: [], meta: null, rating_avg: null, rating_count: 0 };
    throw error;
  }
}

export async function loadMarketListing(id) {
  const listingId = String(id || "").trim();
  if (!listingId) return null;
  try {
    const accessToken = await ensureAccessToken();
    const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
    return asRecord(await serverFetch(apiPaths.marketListing(listingId), { headers }));
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) return null;
    throw error;
  }
}

export function mediaUrl(url) {
  const value = asString(url);
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) {
    try {
      const parsed = new URL(value);
      if (parsed.pathname.startsWith("/storage/")) {
        return `${parsed.pathname}${parsed.search}`;
      }
    } catch {
      return value;
    }
    return value;
  }
  if (value.startsWith("/storage/")) return value;
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
  const itemTypeName = asString(rec.item_type_name);
  const delivery = asString(rec.delivery_label);
  const filterLabels = { ...asRecord(rec.filter_labels) };
  if (categoryKey === "currency") {
    if (!filterLabels.region) filterLabels.region = "ریجن یا سرور";
    if (!filterLabels.delivery_method) filterLabels.delivery_method = "تحویل";
  }
  const attributes = { ...asRecord(rec.attributes) };
  if (itemTypeName) attributes.item_type = itemTypeName;
  if (delivery) attributes.delivery_method = delivery;
  for (const row of Array.isArray(rec.card_attributes) ? rec.card_attributes : []) {
    const item = asRecord(row);
    const key = asString(item.key);
    const value = asString(item.value);
    if (key && value) attributes[key] = value;
  }
  const unitLabel = asString(rec.price_unit_label);
  const firstImage = Array.isArray(rec.images) ? asRecord(rec.images[0]) : {};
  const currencyDesc = [delivery, asString(attributes.region), unitLabel ? `هر ${unitLabel}` : ""]
    .filter(Boolean)
    .join(" · ");
  return {
    href: `/shop/${categoryKey}/l/${encodeURIComponent(id)}`,
    title: asString(rec.title) || asString(rec.game_name),
    desc:
      categoryKey === "currency"
        ? currencyDesc || asString(rec.description) || asString(rec.game_name)
        : chips.join(" · ") || itemTypeName || asString(rec.description) || asString(rec.game_name),
    img: mediaUrl(cover.url || firstImage.url || rec.cover),
    seller: asString(seller.name) || "فروشنده",
    sellerHref: asString(seller.slug)
      ? `/users/${encodeURIComponent(asString(seller.slug))}`
      : asString(seller.id)
        ? `/users/${encodeURIComponent(asString(seller.id))}`
        : "",
    rating: sellerRating(seller),
    price: Number.isFinite(price) && price > 0 ? formatTomanInWords(price) : "",
    priceAmount: Number.isFinite(price) ? price : 0,
    priceWords: Number.isFinite(price) && price > 0 ? formatTomanInWords(price) : "",
    attributes,
    filterLabels,
    delivery:
      categoryKey === "currency" && rec.delivery_minutes != null
        ? `${toFaDigits(Number(rec.delivery_minutes))} دقیقه`
        : delivery || (categoryKey === "items" || categoryKey === "currency" || categoryKey === "games" ? "" : "پس از پرداخت"),
    itemTypeName,
    stock: rec.stock != null ? Number(rec.stock) : null,
    minQuantity: rec.min_quantity != null ? Number(rec.min_quantity) : 1,
    priceUnit: asString(rec.price_unit),
    priceUnitLabel: asString(rec.price_unit_label),
    deliveryMinutes: rec.delivery_minutes != null ? Number(rec.delivery_minutes) : null,
    listingId: id,
  };
}

export function listingToShopCard(listing) {
  const rec = asRecord(listing);
  const card = listingToOffer(rec, shopCategoryForOffer(rec.offer_type));
  if (!card) return null;
  return {
    id: String(rec.id),
    href: card.href,
    title: card.title,
    gameName: asString(rec.game_name),
    img: card.img,
    price: card.price,
    priceAmount: card.priceAmount,
    priceWords: card.priceWords,
    delivery: card.delivery,
  };
}

function countMapToOptions(counts) {
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0]), "fa"))
    .map(([value, count]) => ({ value, count }));
}

export function itemFacetsFromOffers(offers) {
  const typeCounts = new Map();
  const deliveryCounts = new Map();
  const extra = new Map();
  const labels = { item_type: "نوع آیتم", delivery_method: "تحویل" };
  for (const offer of Array.isArray(offers) ? offers : []) {
    const type = asString(offer.itemTypeName || offer.attributes?.item_type);
    if (type) typeCounts.set(type, (typeCounts.get(type) || 0) + 1);
    const delivery = asString(offer.attributes?.delivery_method);
    if (delivery) deliveryCounts.set(delivery, (deliveryCounts.get(delivery) || 0) + 1);
    Object.assign(labels, asRecord(offer.filterLabels));
    const attributes = asRecord(offer.attributes);
    for (const [key, raw] of Object.entries(attributes)) {
      if (key === "item_type" || key === "delivery_method") continue;
      const value = Array.isArray(raw) ? raw.map(asString).filter(Boolean).join("، ") : asString(raw);
      if (!key || !value || value.length > 48) continue;
      if (!extra.has(key)) extra.set(key, new Map());
      const inner = extra.get(key);
      inner.set(value, (inner.get(value) || 0) + 1);
    }
  }
  const fields = [];
  if (typeCounts.size) {
    fields.push({ key: "item_type", label_fa: labels.item_type, type: "select", options: countMapToOptions(typeCounts) });
  }
  if (deliveryCounts.size) {
    fields.push({ key: "delivery_method", label_fa: labels.delivery_method, type: "select", options: countMapToOptions(deliveryCounts) });
  }
  for (const [key, counts] of extra) {
    if (counts.size < 1) continue;
    const values = [...counts.keys()];
    if (looksLikeNumericRange(values)) {
      const extent = numericExtent(values);
      if (extent && extent.max > extent.min) {
        fields.push({
          key,
          label_fa: asString(labels[key]) || key.split("|").pop() || key,
          type: "number",
          min: extent.min,
          max: extent.max,
          count: [...counts.values()].reduce((sum, count) => sum + count, 0),
        });
        continue;
      }
    }
    const unique = [...counts.values()].every((count) => count === 1);
    if (unique && counts.size > 8) continue;
    fields.push({
      key,
      label_fa: asString(labels[key]) || key.split("|").pop() || key,
      type: "select",
      options: countMapToOptions(counts),
    });
  }
  return fields;
}

export const ITEM_PRICE_PRESETS = [
  { id: "0-100000", min: 0, max: 100000, label: "تا ۱۰۰ هزار" },
  { id: "100000-500000", min: 100000, max: 500000, label: "۱۰۰ تا ۵۰۰ هزار" },
  { id: "500000-2000000", min: 500000, max: 2000000, label: "۵۰۰ هزار تا ۲ میلیون" },
  { id: "2000000+", min: 2000000, max: null, label: "۲ میلیون به بالا" },
];

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
