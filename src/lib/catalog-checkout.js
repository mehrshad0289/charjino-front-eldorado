import { serverFetch, ApiError } from "./server-fetcher";
import { apiPaths } from "./api-paths";
import { catalogRegionLabel, preferFaTitle } from "./catalog-region";
import { safeNextPath } from "./safe-path";

const STORAGE_PREFIX = "charjino.catalogCheckout.";
const SKIP_REQUIREMENT = new Set(["instantuseack", "instant_use_ack"]);
const SECRET_REQUIREMENT = new Set(["account_password", "backup_code"]);

function asRecord(value) {
  return value && typeof value === "object" ? value : {};
}

export function catalogCheckoutHref({ skuId, handle = "", couponCode = "", from = "" }) {
  const search = new URLSearchParams();
  search.set("sku", String(skuId));
  if (handle) search.set("handle", String(handle));
  if (couponCode) search.set("coupon", String(couponCode).slice(0, 32));
  const back = safeNextPath(from, "");
  if (back) search.set("from", back);
  return `/checkout?${search.toString()}`;
}

export function catalogOrderHref(number) {
  return `/dashboard/orders/purchased/${encodeURIComponent(String(number || "").trim())}`;
}

export function checkoutIdempotencyKey() {
  const uuid =
    typeof globalThis.crypto?.randomUUID === "function"
      ? globalThis.crypto.randomUUID()
      : `${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}`;
  return `chk-${uuid}`.slice(0, 80);
}

export function saveCatalogCheckoutDraft(skuId, draft) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(
      `${STORAGE_PREFIX}${skuId}`,
      JSON.stringify({
        fields: asRecord(draft?.fields),
        couponCode: String(draft?.couponCode || "").trim(),
        handle: String(draft?.handle || "").trim(),
        from: String(draft?.from || "").trim(),
      }),
    );
  } catch {
    // Private mode can block sessionStorage; checkout still works with query params.
  }
}

export function readCatalogCheckoutDraft(skuId) {
  if (typeof window === "undefined") return { fields: {}, couponCode: "", handle: "", from: "" };
  try {
    const raw = window.sessionStorage.getItem(`${STORAGE_PREFIX}${skuId}`);
    const parsed = raw ? JSON.parse(raw) : {};
    return {
      fields: asRecord(parsed?.fields),
      couponCode: String(parsed?.couponCode || "").trim(),
      handle: String(parsed?.handle || "").trim(),
      from: String(parsed?.from || "").trim(),
    };
  } catch {
    return { fields: {}, couponCode: "", handle: "", from: "" };
  }
}

export function catalogRequirements(fields) {
  const out = {};
  for (const [rawKey, rawValue] of Object.entries(asRecord(fields))) {
    const key = String(rawKey || "").trim();
    if (!key || SKIP_REQUIREMENT.has(key.toLowerCase())) continue;
    const text = SECRET_REQUIREMENT.has(key) ? String(rawValue ?? "") : String(rawValue ?? "").trim();
    if (text === "") continue;
    out[key] = text;
  }
  return out;
}

function emptyCheckout(id) {
  return {
    product: null,
    sku: { id },
    title: "سفارش",
    skuName: "",
    image: "",
    price: 0,
    region: "",
  };
}

export async function loadCatalogCheckout(skuId, handle) {
  const id = Number(skuId);
  if (!Number.isInteger(id) || id < 1) return null;
  const slug = String(handle || "").trim();
  if (!slug) return emptyCheckout(id);
  try {
    const product = await serverFetch(apiPaths.catalogProduct(slug));
    const skus = Array.isArray(product?.skus) ? product.skus : [];
    const sku = skus.find((row) => Number(row?.id) === id);
    if (!sku) return emptyCheckout(id);
    return {
      product,
      sku,
      title: preferFaTitle(product) || String(product?.title || "سفارش"),
      skuName: String(sku.name || sku.nameEn || ""),
      image: String(product?.thumbnail || product?.imageUrl || product?.image || ""),
      price: Number(sku.price) || 0,
      region: catalogRegionLabel(sku.region) || String(sku.region || ""),
    };
  } catch (error) {
    if (error instanceof ApiError && (error.statusCode === 404 || error.statusCode === 422)) return emptyCheckout(id);
    throw error;
  }
}
