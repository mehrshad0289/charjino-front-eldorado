import { serverFetch, ApiError } from "./server-fetcher";
import { apiPaths } from "./api-paths";
import { catalogRegionLabel, preferFaTitle } from "./catalog-region";
import { safeNextPath } from "./safe-path";

const STORAGE_PREFIX = "charjino.catalogCheckout.";
const SKIP_REQUIREMENT = new Set(["instantuseack", "instant_use_ack", "id_ack", "idack"]);
const SECRET_REQUIREMENT = new Set(["account_password", "backup_code"]);
const DEVICE_FIELD = new Set(["gamedevice", "game_device"]);

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

export function catalogRequirements(fields, extras = {}) {
  const out = {};
  for (const [rawKey, rawValue] of Object.entries(asRecord(fields))) {
    const key = String(rawKey || "").trim();
    if (!key || SKIP_REQUIREMENT.has(key.toLowerCase())) continue;
    const text = SECRET_REQUIREMENT.has(key) ? String(rawValue ?? "") : String(rawValue ?? "").trim();
    if (text === "") continue;
    out[key] = text;
  }
  if (extras.idAck) out.id_ack = "1";
  return out;
}

export function catalogValidationMode(product) {
  const validation = asRecord(asRecord(product?.purchaseSchema).validation);
  return String(validation.mode || "").trim().toLowerCase();
}

export function catalogNeedsIdAck(product) {
  const mode = catalogValidationMode(product);
  if (mode === "ack") return true;
  if (mode === "fazer" || mode === "api" || mode === "codm_store" || mode === "steam_check") return false;
  const fulfillment = String(product?.fulfillmentType || "").trim().toLowerCase();
  const validateMode = String(product?.validateMode || "").trim().toLowerCase();
  return fulfillment === "topup" && validateMode === "manual";
}

export function catalogIsTopup(product) {
  return String(product?.fulfillmentType || "").trim().toLowerCase() === "topup";
}

export function catalogRegionNote(product) {
  const schema = asRecord(product?.purchaseSchema);
  return String(schema.regionNote || product?.regionNote || "").trim();
}

export function catalogInputFields(product) {
  return catalogVisibleInputFields(product?.inputFields, {});
}

export function catalogVisibleInputFields(fields, values) {
  const device = String(asRecord(values).gameDevice || asRecord(values).game_device || "").trim();
  return (Array.isArray(fields) ? fields : [])
    .map((raw) => asRecord(raw))
    .filter((field) => {
      const name = String(field.name || field.key || "")
        .trim()
        .toLowerCase();
      if (!name || DEVICE_FIELD.has(name)) return false;
      const forDevices = Array.isArray(field.forDevices) ? field.forDevices : [];
      if (forDevices.length === 0) return true;
      return device !== "" && forDevices.includes(device);
    });
}

export function missingRequiredCatalogField(fields, values) {
  const rec = asRecord(values);
  for (const raw of Array.isArray(fields) ? fields : []) {
    const field = asRecord(raw);
    const name = String(field.name || field.key || "").trim();
    if (!name || field.required === false) continue;
    if (String(rec[name] ?? "").trim() === "") return String(field.label || name);
  }
  return "";
}

export function isCatalogAckValue(value) {
  if (value === true || value === 1) return true;
  const text = String(value ?? "")
    .trim()
    .toLowerCase();
  return text === "1" || text === "true" || text === "on" || text === "yes";
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
    regionNote: "",
    fulfillmentType: "",
    needsIdAck: false,
    inputFields: [],
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
      regionNote: catalogRegionNote(product),
      fulfillmentType: String(product?.fulfillmentType || "").trim().toLowerCase(),
      needsIdAck: catalogNeedsIdAck(product),
      inputFields: catalogInputFields(product),
    };
  } catch (error) {
    if (error instanceof ApiError && (error.statusCode === 404 || error.statusCode === 422)) return emptyCheckout(id);
    throw error;
  }
}
