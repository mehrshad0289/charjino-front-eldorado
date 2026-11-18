const PREFIX = "charjino:nav-recent:";

function asItem(value) {
  if (!value || typeof value !== "object") return null;
  const name = typeof value.name === "string" ? value.name.trim() : "";
  const href = typeof value.href === "string" ? value.href.trim() : "";
  if (!name || !href) return null;
  return {
    name,
    href,
    img: typeof value.img === "string" ? value.img : "",
  };
}

export function readRecentGames(vertical) {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(PREFIX + vertical);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.map(asItem).filter(Boolean).slice(0, 10);
  } catch {
    return [];
  }
}

export function pushRecentGame(vertical, item) {
  if (typeof window === "undefined") return;
  const next = asItem(item);
  if (!next) return;
  const rest = readRecentGames(vertical).filter((row) => row.href !== next.href);
  window.localStorage.setItem(PREFIX + vertical, JSON.stringify([next, ...rest].slice(0, 10)));
}

const HOME_KEY = "charjino:home-recent";
const HOME_LIMIT = 12;

function asHomeCard(value) {
  if (!value || typeof value !== "object") return null;
  const href = typeof value.href === "string" ? value.href.trim() : "";
  const item = typeof value.item === "string" ? value.item.trim() : "";
  if (!href || !item) return null;
  return {
    key: typeof value.key === "string" && value.key.trim() ? value.key.trim() : href,
    href,
    game: typeof value.game === "string" ? value.game.trim() : "",
    gameIcon: typeof value.gameIcon === "string" ? value.gameIcon : "",
    gameImg: typeof value.gameImg === "string" ? value.gameImg : "",
    item,
    price: typeof value.price === "string" ? value.price.trim() : "",
    unit: typeof value.unit === "string" ? value.unit.trim() : "",
    badge: typeof value.badge === "string" ? value.badge.trim() : "",
  };
}

export function readHomeRecent() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(HOME_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.map(asHomeCard).filter(Boolean).slice(0, HOME_LIMIT);
  } catch {
    return [];
  }
}

export function pushHomeRecent(card) {
  if (typeof window === "undefined") return;
  const next = asHomeCard(card);
  if (!next) return;
  const rest = readHomeRecent().filter((row) => row.href !== next.href);
  window.localStorage.setItem(HOME_KEY, JSON.stringify([next, ...rest].slice(0, HOME_LIMIT)));
}

export function verticalForCatalog(product) {
  const slug = product?.category?.slug || "";
  const type = product?.fulfillmentType || "";
  if (slug === "gift-card" || type === "giftcard") return "Gift cards";
  if (slug === "game-topup" || type === "topup") return "Top ups";
  if (slug === "steam-wallet" || type === "steam-topup") return "Currency";
  return "";
}
