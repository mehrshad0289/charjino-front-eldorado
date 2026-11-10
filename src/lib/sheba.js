import { toEnDigits } from "./fa-digits";

export const SHEBA_INVALID = "شبای شما نادرست هست";
export const SHEBA_FORMAT = "شبا باید با IR شروع شود و ۲۶ کاراکتر باشد.";
export const SHEBA_HOLDER = "نام صاحب حساب لازم است.";

export function normalizeSheba(value) {
  let raw = toEnDigits(value).toUpperCase().replace(/[\s\-]/g, "");
  if (/^\d{24}$/.test(raw)) raw = `IR${raw}`;
  return raw;
}

function mod97(iban) {
  const rearranged = `${iban.slice(4)}${iban.slice(0, 4)}`;
  let remainder = 0;
  for (const char of rearranged) {
    const chunk = /[A-Z]/.test(char) ? String(char.charCodeAt(0) - 55) : char;
    for (const digit of chunk) {
      remainder = (remainder * 10 + Number(digit)) % 97;
    }
  }
  return remainder;
}

export function iranianShebaError(value, { requireComplete = true } = {}) {
  const normalized = normalizeSheba(value);
  if (!normalized) return requireComplete ? SHEBA_FORMAT : null;
  if (!/^IR\d{24}$/.test(normalized)) {
    const digits = normalized.replace(/^IR/, "").replace(/\D/g, "");
    if (!requireComplete && digits.length < 24) return null;
    return SHEBA_FORMAT;
  }
  if (mod97(normalized) !== 1) return SHEBA_INVALID;
  return null;
}

export function isIranianSheba(value) {
  return iranianShebaError(value) === null;
}
