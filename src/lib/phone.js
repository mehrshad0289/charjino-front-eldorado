import { onlyDigits } from "./fa-digits";

export function toIranianMobileNational(value) {
  let digits = onlyDigits(value);
  if (digits.startsWith("0098")) digits = digits.slice(4);
  else if (digits.startsWith("98") && digits.length >= 12) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = digits.slice(1);
  return digits.slice(0, 10);
}

/** API: `09XXXXXXXXX` */
export function normalizeIranianMobile(value) {
  const national = toIranianMobileNational(value);
  if (/^9\d{9}$/.test(national)) return `0${national}`;
  return national;
}

export function isIranianMobile(value) {
  return /^09\d{9}$/.test(normalizeIranianMobile(value ?? ""));
}
