import { onlyDigits } from "./fa-digits";

const MAX_PRICE_DIGITS = 12;

export function sanitizePriceInput(value) {
  const digits = onlyDigits(String(value ?? "")).slice(0, MAX_PRICE_DIGITS);
  return digits.replace(/^0+(?=\d)/, "");
}

export function formatTomanNumber(value) {
  const normalized = sanitizePriceInput(value);
  return normalized ? Number(normalized).toLocaleString("fa-IR") : "";
}

export function formatTomanInWords(value) {
  const normalized = sanitizePriceInput(value);
  if (!normalized) return "";

  const amount = Number(normalized);
  if (!Number.isFinite(amount)) return "";
  if (amount === 0) return "۰ تومان";

  const groups = [
    { value: Math.floor(amount / 1_000_000_000), label: "میلیارد" },
    { value: Math.floor((amount % 1_000_000_000) / 1_000_000), label: "میلیون" },
    { value: Math.floor((amount % 1_000_000) / 1_000), label: "هزار" },
    { value: amount % 1_000, label: "" },
  ].filter((group) => group.value > 0);

  return `${groups
    .map((group) =>
      group.label
        ? `${group.value.toLocaleString("fa-IR")} ${group.label}`
        : group.value.toLocaleString("fa-IR"),
    )
    .join(" و ")} تومان`;
}
