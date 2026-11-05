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

export function verticalForCatalog(product) {
  const slug = product?.category?.slug || "";
  const type = product?.fulfillmentType || "";
  if (slug === "gift-card" || type === "giftcard") return "Gift cards";
  if (slug === "game-topup" || type === "topup") return "Top ups";
  if (slug === "steam-wallet" || type === "steam-topup") return "Currency";
  return "";
}
