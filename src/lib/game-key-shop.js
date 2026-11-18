import { serverFetch, ApiError } from "./server-fetcher";
import { apiPaths } from "./api-paths";
import { formatTomanPrice, productHref } from "./format-toman";
import { preferFaTitle } from "./catalog-region";
import {
  CONSOLE_PLATFORMS,
  GAME_KEY_LAUNCHERS,
  consolePlatform,
  consoleShopKey,
} from "./console-games";
import { loadProductHub, tabForStoreCategory } from "./gift-card-shop";
import { hubCardsFromCategory, loadStoreCategory } from "./store-engine";

export { GAME_KEY_LAUNCHERS };

const LAUNCHER_SET = new Set(GAME_KEY_LAUNCHERS);
const GAME_KEY_PER_PAGE = 48;

function asRecord(value) {
  return value && typeof value === "object" ? value : {};
}

function asString(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function isGameKeyLauncher(value) {
  return LAUNCHER_SET.has(asString(value).toLowerCase());
}

/** Hub slug for /shop/games/{slug}. Steam/EA/Rockstar stay their own hubs. */
export function gameKeyShopSlug(value) {
  const id = asString(value).toLowerCase();
  if (!id) return "";
  if (consolePlatform(id) || isGameKeyLauncher(id)) return id;
  return "";
}

export function isGameKeyCatalogTab(tab) {
  const rec = asRecord(tab);
  const fulfillment = asString(rec.fulfillmentType).toLowerCase();
  const group = asString(rec.catalogGroupSlug).toLowerCase();
  return fulfillment === "gamekey" || group === "game-keys";
}

export function catalogPlatformForGameKeys(shopSlug, gamesTab) {
  const fromTab = asString(asRecord(gamesTab).sourceId).toLowerCase();
  if (fromTab) return fromTab;
  const id = asString(shopSlug).toLowerCase();
  if (id === "pc") return "pc";
  if (isGameKeyLauncher(id) || consolePlatform(id)) return id;
  return consoleShopKey(id) || id;
}

export function showGameKeyCatalog({ shopSlug, sell, gamesTab }) {
  if (isGameKeyCatalogTab(gamesTab)) return true;
  if (isGameKeyLauncher(shopSlug) || shopSlug === "pc") return true;
  return !sell;
}

function mapGameKeyCard(item) {
  const rec = asRecord(item);
  const handle = asString(rec.handle);
  const name = preferFaTitle(rec) || asString(rec.title);
  if (!handle || !name) return null;
  return {
    handle,
    name,
    price: formatTomanPrice(rec.minPrice),
    img: asString(rec.thumbnail) || asString(rec.imageUrl),
    href: productHref(handle),
  };
}

export async function loadGameKeyProducts({ platform, q, page = 1, perPage = GAME_KEY_PER_PAGE } = {}) {
  const id = asString(platform).toLowerCase();
  if (!id) return { items: [], total: 0, totalPages: 1, page: 1 };
  const current = Math.max(1, Number(page) || 1);
  const size = Math.min(100, Math.max(1, Number(perPage) || GAME_KEY_PER_PAGE));
  try {
    const payload = await serverFetch(
      apiPaths.catalogProducts({
        category: "game-keys",
        platform: id,
        q: asString(q) || undefined,
        page: current,
        perPage: size,
      }),
    );
    const items = (Array.isArray(payload?.items) ? payload.items : []).map(mapGameKeyCard).filter(Boolean);
    const meta = asRecord(payload?.meta);
    const total = Number(meta.total);
    const totalPages = Number(meta.totalPages);
    return {
      items,
      total: Number.isFinite(total) ? total : items.length,
      totalPages: Number.isFinite(totalPages) && totalPages > 0 ? totalPages : 1,
      page: current,
    };
  } catch (error) {
    if (error instanceof ApiError) return { items: [], total: 0, totalPages: 1, page: current };
    throw error;
  }
}

export async function loadGameKeyShopContext(platform) {
  const slug = gameKeyShopSlug(platform) || asString(platform).toLowerCase();
  const [hub, row] = await Promise.all([loadProductHub(slug), Promise.resolve(consolePlatform(slug))]);
  const gamesTab = tabForStoreCategory(hub, "games");
  return { slug, hub, row, gamesTab };
}

export async function gamesLandingCards() {
  const consoles = CONSOLE_PLATFORMS.map((row) => ({
    key: row.key,
    title: row.title,
    text: row.text,
    img: row.image,
    href: `/shop/games/${row.key}`,
  }));
  const seen = new Set(consoles.map((row) => row.href));
  let cards = [];
  try {
    cards = hubCardsFromCategory(await loadStoreCategory("games"));
  } catch {
    cards = [];
  }
  const extra = [];
  for (const card of cards) {
    const href = asString(card.href);
    if (!href.startsWith("/shop/games/") || seen.has(href)) continue;
    seen.add(href);
    extra.push({
      key: asString(card.key) || href,
      title: asString(card.hubTitle) || asString(card.name),
      text: asString(card.tag),
      img: asString(card.img),
      href,
    });
  }
  return [...consoles, ...extra.filter((row) => row.title)];
}
