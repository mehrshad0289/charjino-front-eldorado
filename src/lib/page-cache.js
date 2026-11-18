export const PAGE_CACHE_CONTROL = "public, s-maxage=60, stale-while-revalidate=300";

const PUBLIC_EXACT = new Set([
  "/",
  "/become-seller",
  "/contact-us",
  "/playstation-plus",
  "/xbox-game-pass",
]);

const PUBLIC_PREFIXES = [
  "/shop/",
  "/gift-card/",
  "/catalog/",
  "/users/",
  "/top-up-",
];

export function isPublicCachePath(pathname) {
  const path = String(pathname || "").split("?")[0] || "/";
  if (PUBLIC_EXACT.has(path)) return true;
  return PUBLIC_PREFIXES.some((prefix) => path === prefix.slice(0, -1) || path.startsWith(prefix));
}

export function isSitemapPath(pathname) {
  const path = String(pathname || "").split("?")[0] || "/";
  return path === "/sitemap.xml" || path.startsWith("/sitemap/") || path.startsWith("/sitemaps/");
}
