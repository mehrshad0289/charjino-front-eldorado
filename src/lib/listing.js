import { onlyDigits, toFaDigits } from "./fa-digits";
import { defaultOfferPlatforms } from "./offer-platforms";
import { formatTomanInWords } from "./price";

export const LISTING_PRICE_MIN = 10_000;
export const LISTING_PRICE_MAX = 2_000_000_000;
export const LISTING_TITLE_MIN = 5;

export const LISTING_PHOTO_SLOTS = [
  { slot: "profile", label: "پروفایل بازی", hint: "لازم", required: true },
  { slot: "stats", label: "آمار و رنک", hint: "اختیاری", required: false },
  { slot: "inventory", label: "آیتم‌ها", hint: "اختیاری", required: false },
  { slot: "extra_1", label: "تصویر دیگر", hint: "اختیاری", required: false },
];

export const CURRENCY_PHOTO_SLOTS = [
  { slot: "profile", label: "کاور آگهی", hint: "لازم", required: true },
  { slot: "stats", label: "موجودی داخل بازی", hint: "اختیاری", required: false },
  { slot: "inventory", label: "اسکرین نرخ یا ترید", hint: "اختیاری", required: false },
  { slot: "extra_1", label: "تصویر دیگر", hint: "اختیاری", required: false },
];

export const LISTING_ATTRIBUTE_PHOTO_SLOTS = ["stats", "inventory", "extra_1"];

export function listingPhotoSlots(fields) {
  const slots = LISTING_PHOTO_SLOTS.map((row) => ({ ...row, attributeKey: "" }));
  const photoFields = (Array.isArray(fields) ? fields : []).filter((field) => field?.photo && field?.key);
  photoFields.forEach((field, index) => {
    const slotKey = field.photo_slot || LISTING_ATTRIBUTE_PHOTO_SLOTS[index];
    const row = slots.find((slot) => slot.slot === slotKey);
    if (!row) return;
    row.label = field.label_fa || row.label;
    row.attributeKey = field.key;
    row.required = field.photo_required === true;
    row.hint = row.required ? "لازم" : "اختیاری";
  });
  return slots;
}

export function listingPhotoNeeded(slot) {
  return Boolean(slot?.required);
}

export const LISTING_SECTIONS = [
  { id: "listing-game", label: "بازی" },
  { id: "listing-details", label: "مشخصات" },
  { id: "listing-media", label: "مدیا" },
  { id: "listing-price", label: "قیمت" },
];

const defaultPlatform = defaultOfferPlatforms();

export const GENERIC_LISTING_FIELDS = [
  {
    key: defaultPlatform.key,
    label_fa: defaultPlatform.label_fa,
    type: "select",
    options: defaultPlatform.options,
    option_groups: defaultPlatform.groups,
    required: false,
  },
  { key: "region", label_fa: "سرور / ریجن", type: "text", required: false },
  { key: "rank", label_fa: "رنک", type: "text", required: false },
  { key: "level", label_fa: "لول", type: "text", required: false },
];

export const LISTING_STATUS = {
  draft: { label: "پیش‌نویس", bg: "rgb(106, 102, 123)" },
  pending_review: { label: "در انتظار بررسی", bg: "rgb(255, 141, 0)" },
  active: { label: "منتشر شده", bg: "rgb(33, 150, 83)" },
  paused: { label: "متوقف", bg: "rgb(106, 102, 123)" },
  sold: { label: "فروخته‌شده", bg: "rgb(34, 33, 39)" },
  archived: { label: "بایگانی", bg: "rgb(106, 102, 123)" },
  suspended: { label: "تعلیق", bg: "rgb(232, 27, 22)" },
};

export function listingStatusMeta(status) {
  return LISTING_STATUS[status] || { label: status || "نامشخص", bg: "rgb(106, 102, 123)" };
}

export function listingShopCategory(offer) {
  if (offer === "CustomItem") return "items";
  if (offer === "Currency") return "currency";
  if (offer === "ConsoleGame") return "games";
  return "accounts";
}

export function listingShopHref(row) {
  const id = row?.id;
  if (id == null || id === "") return "";
  return `/shop/${listingShopCategory(row.offer_type)}/l/${encodeURIComponent(String(id))}`;
}

export function listingCardHref(row, editBase = "/dashboard/offers/Account") {
  if (row?.status === "active") {
    const shopHref = listingShopHref(row);
    if (shopHref) return shopHref;
  }
  return row?.id != null ? `${editBase}/${row.id}` : "";
}

export function listingMediaUrl(url) {
  const value = typeof url === "string" ? url.trim() : "";
  if (!value || value.startsWith("blob:") || value.startsWith("data:")) return value;
  if (value.startsWith("/storage/")) return value;
  if (/^https?:\/\//i.test(value)) {
    try {
      const parsed = new URL(value);
      if (parsed.pathname.startsWith("/storage/")) return `${parsed.pathname}${parsed.search}`;
    } catch {
      return value;
    }
  }
  return value;
}

export function parseToman(value) {
  const digits = onlyDigits(value);
  if (!digits) return 0;
  return Number(digits);
}

export function formatToman(value) {
  const amount = Number(value || 0);
  if (!Number.isFinite(amount)) return toFaDigits("0");
  return toFaDigits(Math.trunc(amount).toLocaleString("en-US"));
}

export function listingPriceError(value) {
  const amount = parseToman(value);
  if (amount < LISTING_PRICE_MIN) {
    return `حداقل قیمت ${formatTomanInWords(LISTING_PRICE_MIN)} است.`;
  }
  if (amount > LISTING_PRICE_MAX) {
    return `حداکثر قیمت ${formatTomanInWords(LISTING_PRICE_MAX)} است.`;
  }
  return null;
}

export function splitItemList(value) {
  return String(value || "")
    .split(/\r\n|\n|\r/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function joinItemList(items) {
  const seen = new Set();
  const out = [];
  for (const raw of Array.isArray(items) ? items : []) {
    const item = String(raw || "").trim();
    if (!item || seen.has(item)) continue;
    seen.add(item);
    out.push(item);
  }
  return out.join("\n");
}

export function schemaItemNoun(field) {
  if (field?.key === "games_list" || /بازی/.test(String(field?.label_fa || ""))) return "بازی";
  return "مورد";
}

export function schemaFieldFilled(field, attributes) {
  const value = attributes?.[field?.key];
  if (field?.multiline) return splitItemList(value).length > 0;
  return Boolean(String(value || "").trim());
}

export function schemaFieldVisible(field, attributes) {
  const when = field?.visible_when;
  if (!when?.key || !Array.isArray(when.values) || when.values.length === 0) return true;
  return when.values.includes(String(attributes?.[when.key] ?? ""));
}

export function schemaFields(raw) {
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.fields)) return raw.fields;
  return [];
}

export function emptyAttributes(fields) {
  const next = {};
  for (const field of fields) {
    if (field?.key) next[field.key] = "";
  }
  return next;
}

export function sellBlockers(seller) {
  if (!seller?.ok) return ["وضعیت فروشنده خوانده نشد."];
  return Array.isArray(seller.data?.can_sell) ? seller.data.can_sell : [];
}

export const SELL_INTRO_PATH = "/become-seller";
export const SELL_VERIFY_PATH = "/verify/status";

export function sellerHasStartedKyc(seller) {
  const profile = seller?.ok ? seller.data?.profile : null;
  if (!profile || typeof profile !== "object") return false;
  if (profile.terms_accepted_at) return true;
  if (Number(profile.kyc_level ?? 0) >= 1) return true;
  if (profile.sheba_set) return true;
  return false;
}

export function sellerGatePath(seller) {
  if (!sellBlockers(seller).length) return null;
  return sellerHasStartedKyc(seller) ? SELL_VERIFY_PATH : SELL_INTRO_PATH;
}

export function sellerGateLabel(path) {
  return path === SELL_INTRO_PATH ? "شروع احراز هویت" : "ادامه احراز / شبا";
}

export function listingSellGate(seller) {
  const href = sellerGatePath(seller);
  return {
    blockers: sellBlockers(seller),
    href,
    label: sellerGateLabel(href),
  };
}
