import { serverFetch, ApiError } from "./server-fetcher";
import { apiPaths } from "./api-paths";
import { formatTomanPrice } from "./format-toman";

function asRecord(value) {
  return value && typeof value === "object" ? value : {};
}

function asString(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function giftShopHref(platform) {
  const id = normalizeGiftPlatform(platform);
  return id ? `/gift-card/${encodeURIComponent(id)}` : "";
}

export function normalizeGiftPlatform(value) {
  const id = asString(value).toLowerCase();
  if (!id || id.length > 80 || !/^[a-z0-9][a-z0-9._-]*$/.test(id)) return "";
  return id;
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

export function giftShopSeo(brandLabel) {
  const name = asString(brandLabel) || "گیفت کارت";
  return {
    title: `خرید گیفت کارت ${name}`,
    blocks: [
      {
        p: `خرید گیفت کارت ${name} با تومان از شارژینو. از مگا‌منو برند را پیدا کنید، بعد ریجن و مبلغ را از کاتالوگ انتخاب کنید؛ پس از پرداخت، کد در سفارش شما قرار می‌گیرد.`,
      },
      { h2: "روش خرید" },
      {
        list: [
          "در مگا‌منو گیفت کارت را جستجو و انتخاب کنید",
          "در این صفحه ریجن و مبلغ را انتخاب کنید",
          "دکمه خرید را بزنید و پرداخت را کامل کنید",
          "پس از تأیید، کد را از سفارش بردارید و در پلتفرم رسمی ردیم کنید",
        ],
      },
    ],
  };
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
  return derivedGiftPlatform(rec) === id || normalizeGiftPlatform(rec.handle) === id;
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

export async function loadGiftCardShop(platform) {
  const id = normalizeGiftPlatform(platform);
  const empty = { platform: id, gameName: "", brandLabel: "", regions: [], amounts: [], bannerIcon: "" };
  if (!id) return empty;

  let products = [];
  try {
    products = await fetchGiftProductsByPlatform(id);
  } catch (error) {
    if (!(error instanceof ApiError)) throw error;
    products = [];
  }

  try {
    const byHandle = await fetchGiftProductByHandle(id);
    if (byHandle) products = mergeGiftProducts([...products, byHandle]);
  } catch (error) {
    if (!(error instanceof ApiError)) throw error;
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
    const thumbnail = asString(rec.thumbnail);
    if (!bannerIcon && thumbnail) bannerIcon = thumbnail;
    if (!gameName) {
      gameName = stripRegion(rec.title) || stripRegion(rec.titleEn) || rec.brand || id;
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
      amounts.push({
        key: `${handle}:${sku.id || name}`,
        label: skuLabel(gameName, name),
        from: formatTomanPrice(price),
        img: thumbnail,
        region: asString(sku.region) || region,
        href: null,
        handle,
        sort: denominationSort(name),
        name,
      });
    }
  }

  regions.sort((a, b) => a.localeCompare(b, "en"));
  amounts.sort((a, b) => a.sort - b.sort || a.label.localeCompare(b.label, "en"));

  return {
    platform: id,
    gameName,
    brandLabel: gameName,
    regions,
    amounts,
    bannerIcon,
  };
}
