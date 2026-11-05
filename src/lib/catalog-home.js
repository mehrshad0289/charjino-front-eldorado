import { serverFetch, ApiError } from "./server-fetcher";
import { apiPaths } from "./api-paths";
import { discountLabel, formatTomanPrice, productHref, categoryHref } from "./format-toman";
import { giftShopHrefFromProduct, isGiftCardProduct } from "./gift-card-shop";

function asRecord(value) {
  return value && typeof value === "object" ? value : {};
}

function asString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function asNumber(value) {
  const amount = typeof value === "number" ? value : Number(value);
  return Number.isFinite(amount) ? amount : 0;
}

function productHandle(item) {
  const raw = asRecord(item);
  return asString(raw.handle) || asString(raw.slug);
}

export async function getCatalogHome() {
  try {
    const data = await serverFetch(apiPaths.catalogHome);
    return { ok: true, data };
  } catch (error) {
    const message = error instanceof ApiError ? error.message : "کاتالوگ در دسترس نیست";
    return { ok: false, message };
  }
}

export async function getCatalogCategories() {
  try {
    const data = await serverFetch(apiPaths.catalogCategories);
    return { ok: true, data: Array.isArray(data) ? data : [] };
  } catch (error) {
    const message = error instanceof ApiError ? error.message : "دسته‌ها در دسترس نیست";
    return { ok: false, message, data: [] };
  }
}

export function mapPopularCards(home) {
  const popular = Array.isArray(home?.popular) ? home.popular : [];
  const flashByHandle = new Map();
  for (const row of Array.isArray(home?.flashSale) ? home.flashSale : []) {
    const rec = asRecord(row);
    const handle = asString(rec.productHandle) || asString(rec.slug);
    if (handle) flashByHandle.set(handle, rec);
  }
  return popular
    .map((item) => {
      const rec = asRecord(item);
      const handle = productHandle(rec);
      const title = asString(rec.title) || asString(rec.name);
      if (!handle || !title) return null;
      const flash = flashByHandle.get(handle);
      const priceValue = flash ? asNumber(flash.price) : asNumber(rec.price ?? rec.minPrice);
      const original = asNumber(flash?.originalPrice ?? asRecord(flash?.badge).originalPrice ?? asRecord(rec.badge).originalPrice);
      const discount = original > 0 ? discountLabel(priceValue, original) : null;
      const image = asString(rec.thumbnail) || asString(rec.image);
      const game = asString(rec.categoryName) || asString(asRecord(rec.badge).publisher);
      return {
        key: handle,
        game,
        gameIcon: image,
        item: title,
        price: formatTomanPrice(priceValue),
        oldPrice: discount ? formatTomanPrice(original) : "",
        discount: discount || "",
        img: image,
        href: isGiftCardProduct(rec) ? giftShopHrefFromProduct(rec) || productHref(handle) : productHref(handle),
      };
    })
    .filter(Boolean)
    .slice(0, 8);
}

export function mapPopularGames(home, categories = []) {
  const fromCategories = mapCategorySuggestions(categories).slice(0, 9);
  if (fromCategories.length > 0) {
    return fromCategories.map((row) => ({
      key: row.href,
      name: row.name,
      tag: "",
      img: row.icon,
      href: row.href,
    }));
  }
  const groups = Array.isArray(home?.groups) ? home.groups : [];
  return groups
    .filter((group) => asString(group?.slug) && asString(group?.name))
    .slice(0, 9)
    .map((group) => ({
      key: group.slug,
      name: group.name,
      tag: "",
      img: "",
      href: categoryHref(group.slug),
    }));
}

export async function getCatalogCategoryPage(slug) {
  try {
    const data = await serverFetch(apiPaths.catalogCategory(slug));
    return { ok: true, data };
  } catch (error) {
    const message = error instanceof ApiError ? error.message : "دسته در دسترس نیست";
    return { ok: false, message, data: { category: {}, products: [] } };
  }
}

export function mapCategorySuggestions(categories) {
  if (!Array.isArray(categories)) return [];
  return categories
    .filter((row) => asString(row?.slug) && asString(row?.title))
    .map((row) => ({
      name: row.title,
      icon: asString(row.imageUrl),
      href: categoryHref(row.slug),
    }));
}

export function mapCurrencyCards(page) {
  const products = Array.isArray(page?.products) ? page.products : [];
  const rows = products
    .map((item) => {
      const rec = asRecord(item);
      const handle = productHandle(rec);
      const title = asString(rec.title) || asString(rec.name);
      if (!handle || !title) return null;
      const image = asString(rec.thumbnail) || asString(rec.image);
      return {
        name: title,
        game: asString(rec.categoryName) || asString(asRecord(rec.badge).publisher),
        price: formatTomanPrice(rec.price ?? rec.minPrice),
        unit: "",
        icon: image,
        href: isGiftCardProduct(rec) ? giftShopHrefFromProduct(rec) || productHref(handle) : productHref(handle),
        img: image,
        sellers: asString(rec.categoryName),
        per: asString(asRecord(rec.badge).publisher),
        cta: "خرید",
      };
    })
    .filter(Boolean);
  if (rows.length === 0) return { big: null, small: [] };
  const first = rows[0];
  return {
    big: {
      name: first.name,
      sellers: first.sellers,
      price: first.price,
      per: first.per,
      cta: first.cta,
      href: first.href,
      img: first.img,
    },
    small: rows.slice(1, 7),
  };
}
