export const SITEMAP_KINDS = ["pages", "hubs", "listings"];

export function sitemapFileId(kind, chunk = 1) {
  if (kind === "pages" || kind === "hubs") return kind;
  return chunk <= 1 ? kind : `${kind}-${chunk}`;
}

export function parseSitemapFileId(id) {
  const raw = String(id || "")
    .trim()
    .toLowerCase()
    .replace(/\.xml$/i, "");
  if (raw === "pages" || raw === "hubs") {
    return { kind: raw, chunk: 1 };
  }
  const match = /^(listings)(?:-(\d+))?$/.exec(raw);
  if (!match) return null;
  const chunk = match[2] ? Number.parseInt(match[2], 10) : 1;
  if (!Number.isFinite(chunk) || chunk < 1) return null;
  return { kind: match[1], chunk };
}

export function listingFileIds(total, chunkSize) {
  const n = Math.max(1, Math.ceil(Math.max(0, total) / chunkSize));
  return Array.from({ length: n }, (_, index) => sitemapFileId("listings", index + 1));
}
