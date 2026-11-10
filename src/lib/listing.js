import { onlyDigits, toFaDigits } from "./fa-digits";

export const LISTING_PRICE_MIN = 10_000;
export const LISTING_PRICE_MAX = 2_000_000_000;
export const LISTING_TITLE_MIN = 5;

export const LISTING_PHOTO_SLOTS = [
  { slot: "profile", label: "پروفایل بازی", hint: "لازم", required: true },
  { slot: "stats", label: "آمار و رنک", hint: "اختیاری", required: false },
  { slot: "inventory", label: "آیتم‌ها", hint: "اختیاری", required: false },
  { slot: "extra_1", label: "تصویر دیگر", hint: "اختیاری", required: false },
];

export const LISTING_SECTIONS = [
  { id: "listing-game", label: "بازی" },
  { id: "listing-details", label: "مشخصات" },
  { id: "listing-media", label: "مدیا" },
  { id: "listing-price", label: "قیمت" },
];

export const GENERIC_LISTING_FIELDS = [
  { key: "platform", label_fa: "پلتفرم", type: "text", required: false },
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
    return `حداقل قیمت ${formatToman(LISTING_PRICE_MIN)} تومان است.`;
  }
  if (amount > LISTING_PRICE_MAX) {
    return `حداکثر قیمت ${formatToman(LISTING_PRICE_MAX)} تومان است.`;
  }
  return null;
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
