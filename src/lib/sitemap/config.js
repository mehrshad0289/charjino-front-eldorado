import { timingSafeEqual } from "crypto";

export const SITEMAP_CHUNK_SIZE = 2000;
export const SITEMAP_FRESH_MS = 60 * 60 * 1000;
export const SITEMAP_CACHE_CONTROL = "public, s-maxage=3600, stale-while-revalidate=86400";
export const SITEMAP_REVALIDATE_DEBOUNCE_MS = 3000;
export const LISTING_PER_PAGE = 60;
export const LISTING_MAX_PAGES = 30;

export function sitemapSecret() {
  return process.env.REVALIDATE_SECRET?.trim() ?? "";
}

export function secretMatches(provided) {
  const expected = sitemapSecret();
  if (!expected) return false;
  const given = provided?.trim() ?? "";
  const expectedBuf = Buffer.from(expected);
  const givenBuf = Buffer.from(given);
  if (expectedBuf.length !== givenBuf.length) {
    timingSafeEqual(expectedBuf, expectedBuf);
    return false;
  }
  return timingSafeEqual(expectedBuf, givenBuf);
}
