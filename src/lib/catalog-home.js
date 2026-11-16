import { serverFetch, ApiError } from "./server-fetcher";
import { apiPaths } from "./api-paths";
import { discountLabel, formatTomanPrice, productHref } from "./format-toman";
import { storefrontGroupHref, storefrontProductHref } from "./gift-card-shop";
import { SHOP_GIFT_CARDS_HREF } from "../components/eldorado/data/faCopy";

const CURRENCY_GROUP_SLUG = "game-topup";
const CURRENCY_CTA = "خرید";

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

function badgeOf(item) {
  return asRecord(asRecord(item).badge);
}

function categorySlugOf(item, fallback = "") {
  const rec = asRecord(item);
  return (
    asString(fallback) ||
    asString(rec.categorySlug) ||
    asString(asRecord(rec.category).slug) ||
    asString(badgeOf(rec).category)
  );
}

function enrichHomeProduct(item, groupSlug = "") {
  const rec = asRecord(item);
  const handle = productHandle(rec);
  const slug = categorySlugOf(rec, groupSlug);
  return {
    ...rec,
    handle,
    slug: handle,
    platform: asString(rec.platform) || asString(badgeOf(rec).platform),
    categorySlug: slug,
    category: rec.category || { slug },
  };
}

function homeProductHref(item, groupSlug = "") {
  const rec = enrichHomeProduct(item, groupSlug);
  const handle = asString(rec.handle);
  if (!handle) return "";
  return storefrontProductHref(rec) || productHref(handle);
}

function groupHref(slug) {
  return storefrontGroupHref(slug) || SHOP_GIFT_CARDS_HREF;
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
      const href = homeProductHref(rec);
      if (!handle || !title || !href) return null;
      const flash = flashByHandle.get(handle);
      const priceValue = flash ? asNumber(flash.price) : asNumber(rec.price ?? rec.minPrice);
      const original = asNumber(flash?.originalPrice ?? asRecord(flash?.badge).originalPrice ?? badgeOf(rec).originalPrice);
      const discount = original > 0 ? discountLabel(priceValue, original) : null;
      const image = asString(rec.thumbnail) || asString(rec.image);
      const game = asString(rec.categoryName) || asString(badgeOf(rec).publisher);
      return {
        key: handle,
        game,
        gameIcon: image,
        item: title,
        price: formatTomanPrice(priceValue),
        oldPrice: discount ? formatTomanPrice(original) : "",
        discount: discount || "",
        img: image,
        href,
      };
    })
    .filter(Boolean)
    .slice(0, 8);
}

export function mapPopularGames(home) {
  const groups = Array.isArray(home?.groups) ? home.groups : [];
  return groups
    .filter((group) => asString(group?.slug) && asString(group?.name))
    .map((group) => ({
      key: group.slug,
      name: group.name,
      tag: "",
      img: asString(group.imageUrl),
      href: groupHref(group.slug),
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
      href: groupHref(row.slug),
    }));
}

function mapHomeProductsToCurrency(products, groupSlug) {
  const rows = (Array.isArray(products) ? products : [])
    .map((item) => {
      const rec = asRecord(item);
      const handle = productHandle(rec);
      const title = asString(rec.title) || asString(rec.name);
      const href = homeProductHref(rec, groupSlug);
      if (!handle || !title || !href) return null;
      const image = asString(rec.thumbnail) || asString(rec.image);
      const game = asString(rec.categoryName) || asString(badgeOf(rec).publisher);
      return {
        key: handle,
        name: title,
        game,
        price: formatTomanPrice(rec.price ?? rec.minPrice),
        unit: "",
        icon: image,
        href,
        img: image,
        sellers: game,
        per: asString(badgeOf(rec).platform),
        cta: CURRENCY_CTA,
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

export function mapCurrencyCards(home) {
  const groups = Array.isArray(home?.groups) ? home.groups : [];
  const group = groups.find((row) => asString(row?.slug) === CURRENCY_GROUP_SLUG);
  return mapHomeProductsToCurrency(group?.products, CURRENCY_GROUP_SLUG);
}
