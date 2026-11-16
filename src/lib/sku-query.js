export function skuIdFromQuery(raw) {
  const value = Array.isArray(raw) ? raw[0] : raw;
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export function hrefWithSku(href, rawSku) {
  const id = skuIdFromQuery(rawSku);
  const path = typeof href === "string" ? href : "";
  if (!path || !id || /[?&]sku=\d+/.test(path)) return path;
  return `${path}${path.includes("?") ? "&" : "?"}sku=${id}`;
}

export function amountForSku(amounts, rawSku) {
  const id = skuIdFromQuery(rawSku);
  if (!id) return null;
  return (Array.isArray(amounts) ? amounts : []).find((row) => Number(row?.skuId) === id) || null;
}
