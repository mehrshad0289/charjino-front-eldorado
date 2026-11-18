export const GA_UNKNOWN = "نامعلوم";

export const SENSITIVE_QUERY_RE =
  /^(e-?mail|mail|phone|mobile|tel|sms|name|first[_-]?name|last[_-]?name|full[_-]?name|national[_-]?code|national[_-]?id|order(_?id|_?number|_?code)?|number|token|otp|pass(word)?|pin|authority|ref(_)?id|track(ing|_?id)?|user(_?id)?|player(_?id)?|phone[_-]?number|mobile[_-]?number|username|code)$/i;

const ID_SEGMENTS = [
  { prefix: ["dashboard", "orders"] },
  { prefix: ["dashboard", "tickets"], skip: "new" },
  { prefix: ["dashboard", "offers"] },
  { prefix: ["orders"] },
  { prefix: ["users"] },
  { prefix: ["contact-us"] },
  { prefix: ["shop", "accounts", "l"] },
  { prefix: ["shop", "items", "l"] },
  { prefix: ["shop", "currency", "l"] },
  { prefix: ["shop", "games", "l"] },
];

export function isSensitiveGaQueryKey(key) {
  return SENSITIVE_QUERY_RE.test(String(key).trim());
}

export function sanitizeGaPathname(pathname) {
  const parts = String(pathname || "").split("/").filter((part, index) => index === 0 || part.length > 0);
  for (const rule of ID_SEGMENTS) {
    const start = parts[0] === "" ? 1 : 0;
    const matches = rule.prefix.every((seg, i) => parts[start + i] === seg);
    const idIndex = start + rule.prefix.length;
    const id = parts[idIndex];
    if (!matches || !id) continue;
    if (rule.skip && id === rule.skip) continue;
    parts[idIndex] = GA_UNKNOWN;
  }
  return parts.join("/") || "/";
}

export function sanitizeGaPageLocation(raw, base = "https://charjino.ir") {
  let url;
  try {
    url = new URL(raw, base);
  } catch {
    return raw || GA_UNKNOWN;
  }
  url.pathname = sanitizeGaPathname(url.pathname);
  const next = new URLSearchParams();
  url.searchParams.forEach((value, key) => {
    next.set(key, isSensitiveGaQueryKey(key) ? GA_UNKNOWN : value);
  });
  url.search = next.toString();
  url.hash = "";
  return url.toString();
}
