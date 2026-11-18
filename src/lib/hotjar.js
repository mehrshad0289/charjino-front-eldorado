const BLOCKED_PREFIXES = ["/login", "/dashboard", "/checkout", "/payments", "/orders", "/verify"];

export function hotjarPathOnly(pathname) {
  const base = String(pathname || "").split("?")[0]?.split("#")[0]?.trim();
  return base && base.length > 0 ? base : "/";
}

export function isHotjarAllowedPath(pathname) {
  const path = hotjarPathOnly(pathname);
  return !BLOCKED_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

export const hotjarSuppress = { "data-hj-suppress": "", "data-cs-mask": "" };
