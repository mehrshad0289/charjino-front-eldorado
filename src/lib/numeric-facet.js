export function parseFacetNumber(value) {
  if (value == null || value === "") return null;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const text = String(value).trim().replace(/,/g, "");
  if (!/^-?\d+(\.\d+)?$/.test(text)) return null;
  const next = Number(text);
  return Number.isFinite(next) ? next : null;
}

export function numericExtent(values) {
  const nums = [];
  for (const value of values) {
    const next = parseFacetNumber(value);
    if (next != null) nums.push(next);
  }
  if (!nums.length) return null;
  return { min: Math.min(...nums), max: Math.max(...nums), count: nums.length };
}

export function looksLikeNumericRange(values) {
  const list = [...values].filter((value) => value != null && String(value).trim() !== "");
  if (list.length < 2) return false;
  const nums = list.map(parseFacetNumber);
  if (nums.some((value) => value == null)) return false;
  const unique = [...new Set(nums)];
  return unique.length >= 2 && Math.max(...unique) > Math.min(...unique);
}

export function rangeStep(min, max) {
  const span = Math.abs(Number(max) - Number(min));
  if (!Number.isFinite(span) || span <= 50) return 1;
  if (span <= 500) return 1;
  if (span <= 5_000) return 10;
  if (span <= 50_000) return 100;
  if (span <= 500_000) return 1_000;
  if (span <= 5_000_000) return 10_000;
  return 100_000;
}

export function formatFacetNumber(value) {
  const next = parseFacetNumber(value);
  if (next == null) return "";
  return next.toLocaleString("fa-IR");
}

export function bandEdge(value) {
  if (value == null || value === "") return null;
  const next = Number(value);
  return Number.isFinite(next) ? next : null;
}

export function rangeFromBounds(lo, hi, bounds) {
  if (!bounds) return { min: "", max: "" };
  const min = lo <= bounds.min ? "" : String(lo);
  const max = hi >= bounds.max ? "" : String(hi);
  return { min, max };
}
