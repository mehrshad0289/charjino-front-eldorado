import { ApiError, serverFetch } from "./server-fetcher";
import { apiPaths } from "./api-paths";
import { ensureAccessToken } from "./ensure-access-token";
import { formatTomanPrice } from "./format-toman";
import { listingShopHref } from "./listing";
import { mediaUrl } from "./store-engine";

function asRecord(value) {
  return value && typeof value === "object" ? value : {};
}

function asString(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function offerTypeBadge(offer) {
  if (offer === "CustomItem") return "آیتم";
  if (offer === "Currency") return "ارز";
  if (offer === "ConsoleGame") return "بازی";
  if (offer === "RequestedBoosting") return "بوستینگ";
  return "اکانت";
}

export function mapListingToRecentlyViewed(listing) {
  const rec = asRecord(listing);
  const href = listingShopHref(rec);
  if (!href) return null;
  const cover =
    mediaUrl(asRecord(rec.cover_image).url) ||
    mediaUrl(asRecord(Array.isArray(rec.images) ? rec.images[0] : {}).url);
  const priceAmount = Number(rec.price_amount ?? rec.price);
  const price = Number.isFinite(priceAmount) && priceAmount > 0 ? formatTomanPrice(priceAmount) : "";
  const unitLabel = asString(rec.price_unit_label);
  const game = asString(rec.game_name);
  const item = asString(rec.title) || game;
  if (!item) return null;
  return {
    key: rec.id != null ? String(rec.id) : href,
    href,
    game,
    gameIcon: cover,
    gameImg: cover,
    item,
    price,
    unit: unitLabel ? `/ ${unitLabel}` : "",
    badge: offerTypeBadge(rec.offer_type),
  };
}

export async function loadRecentlyViewed() {
  const accessToken = await ensureAccessToken();
  if (!accessToken) return [];
  try {
    const data = await serverFetch(apiPaths.marketRecentlyViewed, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const items = Array.isArray(data?.items) ? data.items : [];
    return items.map(mapListingToRecentlyViewed).filter(Boolean);
  } catch (error) {
    if (
      error instanceof ApiError &&
      (error.statusCode === 401 || error.statusCode === 404 || error.statusCode === 503)
    ) {
      return [];
    }
    return [];
  }
}
