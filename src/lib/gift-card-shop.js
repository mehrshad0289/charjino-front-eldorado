import { serverFetch, ApiError } from "./server-fetcher";
import { apiPaths } from "./api-paths";
import { discountLabel, formatTomanPrice, shopTopupHref } from "./format-toman";
import { preferFaTitle } from "./catalog-region";
import { canonicalTopupHrefKey, pickTopupDisplayName, topupHubKeyFromProduct } from "./topup-hub";

function asRecord(value) {
  return value && typeof value === "object" ? value : {};
}

function asString(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeGiftPlatform(value) {
  const id = asString(value).toLowerCase();
  if (!id || id.length > 80 || !/^[a-z0-9][a-z0-9._-]*$/.test(id)) return "";
  return id;
}

export function isPlayStationPlusPlatform(value) {
  const id = normalizeGiftPlatform(value);
  return id === "playstation-plus" || id === "ps-plus";
}

export function isXboxGamePassPlatform(value) {
  return normalizeGiftPlatform(value) === "xbox-game-pass";
}

export function giftHubPlatform(value) {
  const id = normalizeGiftPlatform(value);
  if (isPlayStationPlusPlatform(id)) return "playstation";
  if (isXboxGamePassPlatform(id)) return "xbox";
  return id;
}

export function giftCardHubHref(platform) {
  const hub = giftHubPlatform(platform);
  return hub ? `/gift-card/${encodeURIComponent(hub)}` : "";
}

export function giftShopHref(platform) {
  const id = normalizeGiftPlatform(platform);
  if (!id) return "";
  if (isPlayStationPlusPlatform(id)) return "/playstation-plus";
  if (isXboxGamePassPlatform(id)) return "/xbox-game-pass";
  return `/gift-card/${encodeURIComponent(id)}`;
}

function platformQueryIds(id) {
  return isPlayStationPlusPlatform(id) ? ["playstation-plus", "ps-plus"] : [id];
}

export function isGiftCardProduct(product) {
  const rec = asRecord(product);
  const slug = asString(rec.category?.slug || rec.categorySlug || rec.product_type).toLowerCase();
  if (slug === "gift-card") return true;
  const name = `${asString(rec.categoryName)} ${asString(rec.group)}`;
  return /گیفت|gift\s*-?\s*card/i.test(name);
}

export function isTopupProduct(product) {
  const rec = asRecord(product);
  const slug = asString(rec.category?.slug || rec.categorySlug || rec.product_type).toLowerCase();
  if (slug === "game-topup" || slug === "topup") return true;
  return asString(rec.fulfillmentType).toLowerCase() === "topup";
}

export function shopTopupHrefFromProduct(product) {
  const hub = topupHubKeyFromProduct(product);
  return hub ? shopTopupHref(hub) : "";
}

export function derivedGiftPlatform(product) {
  const rec = asRecord(product);
  return normalizeGiftPlatform(rec.platform) || normalizeGiftPlatform(rec.handle);
}

export function giftShopHrefFromProduct(product) {
  return giftShopHref(derivedGiftPlatform(product));
}

export function rewriteGiftSearchItems(items) {
  return (Array.isArray(items) ? items : []).map((row) => {
    const rec = asRecord(row);
    if (isGiftCardProduct(rec)) {
      const href = giftShopHrefFromProduct(rec);
      return href ? { ...rec, href } : rec;
    }
    if (isTopupProduct(rec)) {
      const href = shopTopupHrefFromProduct(rec);
      return href ? { ...rec, href } : rec;
    }
    return rec;
  });
}

export function giftShopBannerName(gameName, platform) {
  const cleaned = asString(gameName)
    .replace(/\s*gift\s*cards?\s*/gi, " ")
    .replace(/\s*گیفت[\s\u200c]*کارت\s*/gi, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
  return cleaned || asString(platform) || gameName;
}

const FC_FAMILY = {
  "fc-points": { label: "پوینت", href: "/shop/top-ups/fc-points" },
  "fc-coins": { label: "کوین", href: "/shop/top-ups/fc-coins" },
};

export function isFcFamilyHub(hubKey) {
  return Boolean(FC_FAMILY[asString(hubKey).toLowerCase()]);
}

export function fcFamilyBannerName(hubKey, fallback) {
  return isFcFamilyHub(hubKey) ? "EA Sports FC 27" : fallback;
}

export function topupTabsFromShop(shop, fallbackTabs, hubKey) {
  const siblings = Array.isArray(shop?.siblings) ? shop.siblings : [];
  const family = siblings
    .map((item) => ({
      key: asString(item?.key),
      label: asString(item?.label),
      href: asString(item?.href),
    }))
    .filter((item) => item.key && item.label && item.href.startsWith("/"));
  const merged = sortBannerTabs(mergeBannerTabs(family, fallbackTabs));
  if (merged.length >= 2) return merged;
  if (family.length >= 2) return family;
  return mergeFcFamilyTabs(fallbackTabs, hubKey);
}

function mergeBannerTabs(primary, extra) {
  const seen = new Set();
  const out = [];
  for (const raw of [...(Array.isArray(primary) ? primary : []), ...(Array.isArray(extra) ? extra : [])]) {
    const href = asString(raw?.href);
    const key = asString(raw?.key);
    const label = asString(raw?.label);
    if (!href.startsWith("/") || !key || !label || seen.has(href)) continue;
    seen.add(href);
    out.push({ key, label, href, sortOrder: Number(raw?.sortOrder) || 0 });
  }
  return out;
}

export function topupBannerName(shop, hubKey, fallback) {
  const siblings = Array.isArray(shop?.siblings) ? shop.siblings : [];
  const gameTitle = asString(shop?.gameTitleFa) || asString(shop?.gameTitle);
  if (siblings.length >= 2 && gameTitle) return gameTitle;
  return fcFamilyBannerName(hubKey, fallback);
}

export function mergeFcFamilyTabs(tabs, hubKey) {
  if (!isFcFamilyHub(hubKey)) return Array.isArray(tabs) ? tabs : [];
  const family = [
    { key: "fc-points", label: FC_FAMILY["fc-points"].label, href: FC_FAMILY["fc-points"].href },
    { key: "fc-coins", label: FC_FAMILY["fc-coins"].label, href: FC_FAMILY["fc-coins"].href },
  ];
  const rest = (Array.isArray(tabs) ? tabs : []).filter(
    (tab) => tab?.key !== "top-up" && !FC_FAMILY[asString(tab?.key).toLowerCase()],
  );
  return [...family, ...rest];
}

function catalogPageItems(payload) {
  return Array.isArray(payload?.items) ? payload.items : Array.isArray(payload) ? payload : [];
}

function stripRegion(title) {
  return asString(title).replace(/\s*\([^)]*\)\s*$/, "").trim();
}

function toLatinDigits(value) {
  return String(value)
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٬,]/g, "");
}

function denominationSort(name) {
  const match = toLatinDigits(name).match(/(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
}

function skuLabel(brandLabel, skuName) {
  const name = asString(skuName);
  if (!name) return brandLabel;
  if (!brandLabel) return name;
  const lower = name.toLowerCase();
  if (lower.startsWith(brandLabel.toLowerCase())) return name;
  return `${brandLabel} ${name}`;
}

function belongsToShop(product, id) {
  const rec = asRecord(product);
  if (!isGiftCardProduct(rec)) return false;
  const aliases = platformQueryIds(id);
  const derived = derivedGiftPlatform(rec);
  const handle = normalizeGiftPlatform(rec.handle);
  return aliases.includes(derived) || aliases.includes(handle);
}

function mergeGiftProducts(rows) {
  const seen = new Map();
  for (const item of rows) {
    const rec = asRecord(item);
    const handle = asString(rec.handle);
    if (!handle) continue;
    const prev = seen.get(handle);
    if (!prev) {
      seen.set(handle, rec);
      continue;
    }
    const prevSkus = Array.isArray(prev.skus) ? prev.skus.length : 0;
    const nextSkus = Array.isArray(rec.skus) ? rec.skus.length : 0;
    if (nextSkus > prevSkus) seen.set(handle, rec);
  }
  return [...seen.values()];
}

async function fetchGiftProductPages(params) {
  const first = await serverFetch(apiPaths.catalogProducts({ ...params, page: 1, perPage: 100, withSkus: true }));
  const rows = [...catalogPageItems(first)];
  const totalPages = Math.min(Number(first?.meta?.totalPages) || 1, 6);
  if (totalPages <= 1) return rows;
  const rest = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, index) =>
      serverFetch(apiPaths.catalogProducts({ ...params, page: index + 2, perPage: 100, withSkus: true })),
    ),
  );
  for (const payload of rest) rows.push(...catalogPageItems(payload));
  return rows;
}

async function fetchGiftProductsByPlatform(platform, giftDelivery = "standard") {
  return fetchGiftProductPages({ category: "gift-card", platform, giftDelivery });
}

async function fetchGiftProductsByQuery(id) {
  return fetchGiftProductPages({ category: "gift-card", q: id });
}

async function fetchGiftProductByHandle(id) {
  try {
    const product = await serverFetch(apiPaths.catalogProduct(id));
    return belongsToShop(product, id) ? product : null;
  } catch (error) {
    if (!(error instanceof ApiError)) throw error;
    return null;
  }
}

function emptyShop(id) {
  return {
    platform: id,
    gameName: "",
    brandLabel: "",
    bannerName: "",
    regions: [],
    amounts: [],
    bannerIcon: "",
    buyerFieldsByHandle: {},
    shop: null,
  };
}

const GENERIC_TOPUP_REGION = /^(ir|iran|global|worldwide|ww|all|any|default|none|n\/a)$/i;

function isGenericTopupRegion(value) {
  const raw = asString(value);
  return !raw || GENERIC_TOPUP_REGION.test(raw);
}

function pickerRegionsForTopup(regions) {
  const unique = [];
  const seen = new Set();
  for (const raw of Array.isArray(regions) ? regions : []) {
    const value = asString(raw);
    if (isGenericTopupRegion(value)) continue;
    const key = value.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(value);
  }
  return unique.length >= 2 ? unique : [];
}

function topupSkuTitle(gameName, skuName) {
  const name = asString(skuName);
  const brand = asString(gameName);
  if (!name) return brand;
  if (brand && name.toLowerCase().startsWith(brand.toLowerCase())) {
    return name.slice(brand.length).replace(/^[\s\-–:]+/, "").trim() || name;
  }
  return name;
}

function splitTopupDenomination(name, unit) {
  const raw = asString(name);
  const unitText = asString(unit);
  const match = raw.match(/^([0-9۰-۹][0-9۰-۹,٬]*)(?:[\s\u200c]+)+(.+)$/u);
  if (match) return { label: match[1], sub: match[2].trim() };
  if (/^[0-9۰-۹][0-9۰-۹,٬]*$/u.test(raw) && unitText) return { label: raw, sub: unitText };
  return { label: raw || unitText, sub: "" };
}

function chargeUnit(value) {
  const raw = asString(value);
  if (!raw || raw.length > 16) return "";
  if (/شناسه|بازیکن|player|login/i.test(raw)) return "";
  return raw;
}

function normalizeTopupUnit(value) {
  const raw = asString(value).toLowerCase();
  if (/یوسی|\buc\b/.test(raw)) return "uc";
  if (/کوین|\bcoins?\b/.test(raw)) return "coin";
  return raw.replace(/\s+/g, "");
}

function packDedupeKey(row) {
  const n = row.sort;
  const device = asString(row.region).toLowerCase();
  if (Number.isFinite(n) && n !== Number.MAX_SAFE_INTEGER) {
    return `${n}:${normalizeTopupUnit(row.sub || row.name)}:${device}`;
  }
  return `name:${asString(row.name || row.label).toLowerCase()}:${device}`;
}

function dedupeTopupAmounts(rows) {
  const best = new Map();
  for (const row of rows) {
    const key = packDedupeKey(row);
    const prev = best.get(key);
    if (!prev || (Number(row.priceValue) || Infinity) < (Number(prev.priceValue) || Infinity)) {
      best.set(key, row);
    }
  }
  return [...best.values()];
}

export async function loadGiftBrandPage(platform) {
  const id = normalizeGiftPlatform(platform);
  if (!id) return null;
  try {
    const page = await serverFetch(apiPaths.catalogGiftBrandPage(id));
    return asRecord(page);
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) return null;
    throw error;
  }
}

export async function loadProductHub(hubKey) {
  const id = normalizeGiftPlatform(hubKey);
  if (!id) return null;
  try {
    const hub = await serverFetch(apiPaths.catalogProductHub(id));
    return asRecord(hub);
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) return null;
    throw error;
  }
}

const HUB_TAB_ORDER = ["top-up", "gift-cards", "accounts", "items", "boosting", "currency"];

export function bannerTabsFromHub(hub) {
  const rec = asRecord(hub);
  const tabs = [];
  for (const raw of Array.isArray(rec.tabs) ? rec.tabs : []) {
    const tab = asRecord(raw);
    const key = asString(tab.tabKey);
    const label = asString(tab.label);
    const href = asString(tab.href);
    if (!key || !label || !href || !href.startsWith("/")) continue;
    tabs.push({ key, label, href, sortOrder: Number(tab.sortOrder) || 0 });
  }
  return sortBannerTabs(tabs);
}

function sortBannerTabs(tabs) {
  return [...tabs].sort((a, b) => {
    const ai = HUB_TAB_ORDER.indexOf(a.key);
    const bi = HUB_TAB_ORDER.indexOf(b.key);
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return (a.sortOrder || 0) - (b.sortOrder || 0);
  });
}

export async function loadHubByMarketGame(source) {
  const id = typeof source === "number" ? String(source) : asString(source);
  if (!id) return null;
  try {
    return asRecord(await serverFetch(apiPaths.catalogProductHubByMarketGame(id)));
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) return null;
    throw error;
  }
}

export function activeHubTabKey(tabs, href, fallbackKey = "gift-cards") {
  const rows = Array.isArray(tabs) ? tabs : [];
  const current = rows.find((tab) => asString(tab.href) === href);
  if (current) return asString(current.key);
  const fallback = rows.find((tab) => asString(tab.key) === fallbackKey);
  return fallback ? asString(fallback.key) : asString(rows[0]?.key);
}

export function tabForStoreCategory(hub, categoryKey) {
  const key = asString(categoryKey || "").toLowerCase();
  const tabs = Array.isArray(hub?.tabs) ? hub.tabs : [];
  return (
    tabs.find((raw) => {
      const tab = asRecord(raw);
      if (asString(tab.storeCategory).toLowerCase() === key) return true;
      if (key === "top-ups") {
        return (
          asString(tab.tabKey) === "top-up" ||
          asString(tab.fulfillmentType) === "topup" ||
          asString(tab.catalogGroupSlug) === "game-topup"
        );
      }
      if (key === "gift-cards") {
        return asString(tab.tabKey) === "gift-cards" || asString(tab.renderer) === "code-card";
      }
      if (key === "accounts") {
        const tabKey = asString(tab.tabKey);
        return tabKey === "accounts" || (asString(tab.renderer) === "account-listing" && tabKey !== "items" && tabKey !== "currency");
      }
      if (key === "boosting") {
        return asString(tab.tabKey) === "boosting" || asString(tab.renderer) === "service-request";
      }
      if (key === "items") {
        return asString(tab.tabKey) === "items";
      }
      if (key === "currency") {
        const hubCategory = asString(hub?.storeCategoryKey).toLowerCase();
        return (
          asString(tab.tabKey) === "currency" ||
          asString(tab.storeCategory).toLowerCase() === "currency" ||
          (hubCategory === "currency" &&
            (asString(tab.tabKey) === "top-up" || asString(tab.fulfillmentType) === "topup" || asString(tab.href).includes("/shop/currency/")))
        );
      }
      return false;
    }) || null
  );
}

function mapGiftBrandBlocks(page) {
  const blocks = [];
  const intro = asString(page.intro);
  if (intro) blocks.push({ p: intro });
  for (const raw of Array.isArray(page.blocks) ? page.blocks : []) {
    const block = asRecord(raw);
    const type = asString(block.type);
    const text = asString(block.text);
    const items = (Array.isArray(block.items) ? block.items : []).map(asString).filter(Boolean);
    if ((type === "h2" || type === "p") && text) {
      blocks.push(type === "h2" ? { h2: text } : { p: text });
      continue;
    }
    if (type === "ul" && items.length) blocks.push({ ul: items });
    if (type === "ol" && items.length) blocks.push({ list: items });
  }
  const howTo = page.howTo && typeof page.howTo === "object" ? asRecord(page.howTo) : null;
  if (howTo) {
    const title = asString(howTo.title);
    const howIntro = asString(howTo.intro);
    const steps = (Array.isArray(howTo.steps) ? howTo.steps : []).map(asString).filter(Boolean);
    const after = asString(howTo.after);
    if (title) blocks.push({ h2: title });
    if (howIntro) blocks.push({ p: howIntro });
    if (steps.length) blocks.push({ list: steps });
    if (after) blocks.push({ p: after });
  }
  return blocks;
}

export function giftBrandPageSeo(page, fallbackTitle) {
  if (!page) return null;
  const rec = asRecord(page);
  const blocks = mapGiftBrandBlocks(rec);
  const title = asString(rec.h1) || asString(fallbackTitle);
  if (!title && blocks.length === 0) return null;
  return { title, blocks };
}

export function giftBrandPageMeta(page, fallback) {
  const rec = asRecord(page);
  const seo = asRecord(rec.seo);
  return {
    title: asString(seo.title) || asString(rec.h1) || asString(fallback?.title),
    description: asString(seo.description) || asString(fallback?.description),
  };
}

function matchesGiftDelivery(product, giftDelivery) {
  const rec = asRecord(product);
  const instant = rec.instantUse === true || asString(rec.giftDelivery) === "instant_use";
  return giftDelivery === "instant_use" ? instant : !instant;
}

export async function loadGiftCardShop(platform, options = {}) {
  const id = normalizeGiftPlatform(platform);
  if (!id) return emptyShop(id);
  const giftDelivery = asString(options.giftDelivery) || "standard";
  const aliases = platformQueryIds(id);

  let products = [];
  for (const alias of aliases) {
    try {
      products = mergeGiftProducts([...products, ...(await fetchGiftProductsByPlatform(alias, giftDelivery))]);
    } catch (error) {
      if (!(error instanceof ApiError)) throw error;
    }
    try {
      const byHandle = await fetchGiftProductByHandle(alias);
      if (byHandle) products = mergeGiftProducts([...products, byHandle]);
    } catch (error) {
      if (!(error instanceof ApiError)) throw error;
    }
  }

  if (products.length === 0) {
    try {
      products = (await fetchGiftProductsByQuery(id)).filter((item) => belongsToShop(item, id));
    } catch (error) {
      if (!(error instanceof ApiError)) throw error;
      products = [];
    }
  }
  products = products.filter((item) => belongsToShop(item, id) && matchesGiftDelivery(item, giftDelivery));

  const regions = [];
  const seenRegion = new Set();
  const amounts = [];
  let bannerIcon = "";
  let gameName = "";

  for (const item of products) {
    const rec = asRecord(item);
    const handle = asString(rec.handle);
    const region = asString(rec.region);
    const thumbnail = asString(rec.thumbnail) || asString(rec.imageUrl) || asString(rec.image);
    if (!bannerIcon && thumbnail) bannerIcon = thumbnail;
    if (!gameName) {
      gameName = stripRegion(preferFaTitle(rec)) || stripRegion(rec.title) || stripRegion(rec.titleEn) || rec.brand || id;
    }
    if (region && !seenRegion.has(region)) {
      seenRegion.add(region);
      regions.push(region);
    }
    const skus = Array.isArray(rec.skus) ? rec.skus : [];
    if (!handle || skus.length === 0) continue;
    for (const raw of skus) {
      const sku = asRecord(raw);
      const price = Number(sku.price);
      const name = asString(sku.name) || asString(sku.nameEn);
      if (!Number.isFinite(price) || price <= 0) continue;
      const amountRegion = asString(sku.region) || region;
      if (amountRegion && !seenRegion.has(amountRegion)) {
        seenRegion.add(amountRegion);
        regions.push(amountRegion);
      }
      amounts.push({
        key: `${handle}:${sku.id || name}`,
        skuId: sku.id || null,
        label: skuLabel(gameName, name),
        from: formatTomanPrice(price),
        img: thumbnail,
        region: amountRegion,
        href: null,
        handle,
        sort: denominationSort(name),
        name,
        instantUse: rec.instantUse === true || asString(rec.giftDelivery) === "instant_use",
      });
    }
  }

  regions.sort((a, b) => a.localeCompare(b, "fa"));
  amounts.sort((a, b) => a.sort - b.sort || a.label.localeCompare(b.label, "fa"));

  return {
    platform: id,
    gameName,
    brandLabel: gameName,
    bannerName: giftShopBannerName(gameName, id),
    regions,
    amounts,
    bannerIcon,
  };
}

function belongsToTopupShop(product, id) {
  const rec = asRecord(product);
  const want = canonicalTopupHrefKey(id) || normalizeGiftPlatform(id);
  if (!want) return false;
  const platform = canonicalTopupHrefKey(rec.platform) || normalizeGiftPlatform(rec.platform);
  const handle = canonicalTopupHrefKey(rec.handle) || normalizeGiftPlatform(rec.handle);
  const hub = canonicalTopupHrefKey(topupHubKeyFromProduct(rec));
  return hub === want || platform === want || handle === want;
}

async function fetchTopupProductsByPlatform(platform) {
  return fetchGiftProductPages({ category: "game-topup", platform });
}

function pickTopupShop(details) {
  let fallback = null;
  for (const rec of details) {
    const shop = asRecord(rec.shop);
    const hasShop =
      Boolean(asString(shop.identity)) ||
      (Array.isArray(shop.devices) && shop.devices.length > 0) ||
      Boolean(asString(shop.noticeTitle)) ||
      Boolean(asString(shop.noticeBody)) ||
      Boolean(asString(shop.description)) ||
      (Array.isArray(shop.faq) && shop.faq.length > 0) ||
      (Array.isArray(shop.siblings) && shop.siblings.length > 1);
    if (!hasShop) continue;
    if (asString(rec.code).startsWith("local-topup-")) return shop;
    if (!fallback) fallback = shop;
  }
  return fallback;
}

async function loadTopupDetails(products) {
  const handles = [];
  const seen = new Set();
  for (const item of products) {
    const handle = asString(asRecord(item).handle);
    if (!handle || seen.has(handle)) continue;
    seen.add(handle);
    handles.push(handle);
    if (handles.length >= 24) break;
  }
  const details = await Promise.all(
    handles.map(async (handle) => {
      try {
        return asRecord(await serverFetch(apiPaths.catalogProduct(handle)));
      } catch (error) {
        if (!(error instanceof ApiError)) throw error;
        return { handle, inputFields: [] };
      }
    }),
  );
  const buyerFieldsByHandle = {};
  for (const detail of details) {
    const handle = asString(detail.handle);
    if (!handle) continue;
    buyerFieldsByHandle[handle] = Array.isArray(detail.inputFields) ? detail.inputFields : [];
  }
  return { buyerFieldsByHandle, shop: pickTopupShop(details) };
}

export async function loadTopupShop(platform) {
  const id = normalizeGiftPlatform(platform);
  if (!id) return emptyShop(id);
  let products = [];
  try {
    products = mergeGiftProducts(await fetchTopupProductsByPlatform(id));
  } catch (error) {
    if (!(error instanceof ApiError)) throw error;
    products = [];
  }
  products = products.filter((item) => belongsToTopupShop(item, id));

  const regions = [];
  const seenRegion = new Set();
  const amounts = [];
  let bannerIcon = "";
  let gameName = "";

  for (const item of products) {
    const rec = asRecord(item);
    const handle = asString(rec.handle);
    const region = asString(rec.region);
    const thumbnail = asString(rec.thumbnail) || asString(rec.imageUrl) || asString(rec.image);
    if (!bannerIcon && thumbnail) bannerIcon = thumbnail;
    if (!gameName) {
      gameName =
        pickTopupDisplayName({
          hubKey: id,
          nameEn: rec.titleEn || rec.nameEn || rec.brand,
          faTitle: preferFaTitle(rec) || rec.title,
        }) ||
        stripRegion(preferFaTitle(rec)) ||
        stripRegion(rec.title) ||
        stripRegion(rec.titleEn) ||
        rec.brand ||
        id;
    }
    if (region && !seenRegion.has(region)) {
      seenRegion.add(region);
      regions.push(region);
    }
    const unit = chargeUnit(rec.subtitle);
    const skus = Array.isArray(rec.skus) ? rec.skus : [];
    if (!handle || skus.length === 0) continue;
    for (const raw of skus) {
      const sku = asRecord(raw);
      const price = Number(sku.price);
      const name = asString(sku.name) || asString(sku.nameEn);
      if (!Number.isFinite(price) || price <= 0) continue;
      const amountRegion = asString(sku.region) || region;
      if (amountRegion && !seenRegion.has(amountRegion)) {
        seenRegion.add(amountRegion);
        regions.push(amountRegion);
      }
      const title = topupSkuTitle(gameName, name);
      const split = splitTopupDenomination(title, unit);
      const original = Number(sku.originalPrice);
      const sale = discountLabel(price, original);
      amounts.push({
        key: `${handle}:${sku.id || name}`,
        skuId: sku.id || null,
        label: split.label,
        sub: split.sub,
        from: formatTomanPrice(price),
        priceValue: price,
        discount: sale ? `${sale}*` : "",
        was: sale ? formatTomanPrice(original) : "",
        img: thumbnail,
        region: isGenericTopupRegion(amountRegion) ? "" : amountRegion,
        href: null,
        handle,
        sort: denominationSort(name),
        name: title,
        instantUse: false,
        popular: false,
      });
    }
  }

  const uniqueAmounts = dedupeTopupAmounts(amounts).sort((a, b) => {
    const aPack = a.sub ? 0 : 1;
    const bPack = b.sub ? 0 : 1;
    return aPack - bPack || a.sort - b.sort || a.label.localeCompare(b.label, "fa");
  });
  const popularIndex = uniqueAmounts.length >= 3 ? Math.min(2, uniqueAmounts.length - 1) : 0;
  if (uniqueAmounts[popularIndex]) uniqueAmounts[popularIndex].popular = true;
  const { buyerFieldsByHandle, shop } = await loadTopupDetails(products);
  const configuredDevices = Array.isArray(shop?.devices) ? shop.devices.filter((item) => asString(item?.key)) : [];
  const pickerRegions = configuredDevices.length > 0 ? [] : pickerRegionsForTopup(regions);

  return {
    platform: id,
    gameName,
    brandLabel: gameName,
    bannerName: fcFamilyBannerName(id, giftShopBannerName(gameName, id)),
    regions: pickerRegions,
    amounts: uniqueAmounts,
    bannerIcon,
    buyerFieldsByHandle,
    shop,
  };
}
