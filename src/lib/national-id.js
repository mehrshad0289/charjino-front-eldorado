import { onlyDigits } from "./fa-digits";

export const NATIONAL_ID_INVALID = "کد ملی شما نادرست هست";
export const NATIONAL_ID_LENGTH = "کد ملی باید ۱۰ رقم باشد.";

export function iranianNationalIdError(value) {
  const code = onlyDigits(value);
  if (!code || code.length !== 10) {
    return NATIONAL_ID_LENGTH;
  }
  if (/^(\d)\1{9}$/.test(code)) {
    return NATIONAL_ID_INVALID;
  }
  const sum = code
    .slice(0, 9)
    .split("")
    .reduce((total, digit, index) => total + Number(digit) * (10 - index), 0);
  const remainder = sum % 11;
  const expected = remainder < 2 ? remainder : 11 - remainder;
  if (Number(code[9]) !== expected) {
    return NATIONAL_ID_INVALID;
  }
  return null;
}

export function isIranianNationalId(value) {
  return iranianNationalIdError(value) === null;
}
