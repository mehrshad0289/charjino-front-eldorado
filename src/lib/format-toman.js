export function formatTomanNumber(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) return "";
  return Math.round(amount).toLocaleString("fa-IR");
}

export function formatTomanPrice(value) {
  const formatted = formatTomanNumber(value);
  return formatted ? `${formatted} تومان` : "";
}

export function discountLabel(price, originalPrice) {
  const current = Number(price);
  const original = Number(originalPrice);
  if (!Number.isFinite(current) || !Number.isFinite(original) || original <= current || current <= 0) {
    return null;
  }
  const pct = Math.round(((original - current) / original) * 100);
  if (pct <= 0) return null;
  return `-${pct}%`;
}

export function productHref(handle) {
  return `/catalog/${encodeURIComponent(handle)}`;
}

export function categoryHref(slug) {
  return `/catalog/category/${encodeURIComponent(slug)}`;
}

export function shopTopupHref(hubKey) {
  const id = typeof hubKey === "string" ? hubKey.trim() : "";
  if (!id) return "";
  return `/shop/top-ups/${encodeURIComponent(id)}`;
}
