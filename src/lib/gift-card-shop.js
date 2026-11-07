import { serverFetch, ApiError } from "./server-fetcher";
import { apiPaths } from "./api-paths";
import { formatTomanPrice } from "./format-toman";
import { preferFaTitle } from "./catalog-region";

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

export function giftHubPlatform(value) {
  const id = normalizeGiftPlatform(value);
  if (isPlayStationPlusPlatform(id)) return "playstation";
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
    if (!isGiftCardProduct(rec)) return rec;
    const href = giftShopHrefFromProduct(rec);
    return href ? { ...rec, href } : rec;
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

function catalogPageItems(payload) {
  return Array.isArray(payload?.items) ? payload.items : Array.isArray(payload) ? payload : [];
}

function stripRegion(title) {
  return asString(title).replace(/\s*\([^)]*\)\s*$/, "").trim();
}

function denominationSort(name) {
  const match = String(name).match(/(\d+(?:\.\d+)?)/);
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

async function fetchGiftProductsByPlatform(platform) {
  return fetchGiftProductPages({ category: "gift-card", platform });
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
  return { platform: id, gameName: "", brandLabel: "", bannerName: "", regions: [], amounts: [], bannerIcon: "" };
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

export async function loadGiftCardShop(platform) {
  const id = normalizeGiftPlatform(platform);
  if (!id) return emptyShop(id);
  const aliases = platformQueryIds(id);

  let products = [];
  for (const alias of aliases) {
    try {
      products = mergeGiftProducts([...products, ...(await fetchGiftProductsByPlatform(alias))]);
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
