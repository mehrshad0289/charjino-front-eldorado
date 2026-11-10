export function safeNextPath(raw, fallback = "/") {
  if (!raw) return fallback;
  const value = String(raw).trim();
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return fallback;
  }
  if (value.includes("://")) return fallback;
  if (value.startsWith("/login")) return fallback;
  return value;
}
