import { apiPaths } from "../api-paths";
import { CONSOLE_PLATFORMS } from "../console-games";
import { listingShopHref } from "../listing";
import { NAV_VERTICALS, buildNavMegaCached } from "../nav-mega";
import { serverFetch, ApiError } from "../server-fetcher";
import { STORE_CATEGORY_KEYS } from "../store-engine";
import { absoluteUrl } from "../site";
import { LISTING_MAX_PAGES, LISTING_PER_PAGE, SITEMAP_CHUNK_SIZE, SITEMAP_FRESH_MS, SITEMAP_REVALIDATE_DEBOUNCE_MS } from "./config";
import { markStale, readChunk, writeChunk } from "./file-cache";
import { listingFileIds, parseSitemapFileId, sitemapFileId } from "./ids";
import { chunkPublicUrl, sitemapIndexXml, sitemapLastmod, urlsetXml } from "./xml";

const inflight = new Map();
let revalidateTimer = null;

const STATIC_PATHS = [
  "/",
  ...STORE_CATEGORY_KEYS.map((key) => `/shop/${key}`),
  ...CONSOLE_PLATFORMS.map((row) => `/shop/games/${row.key}`),
  "/become-seller",
  "/contact-us",
  "/playstation-plus",
  "/xbox-game-pass",
];

function chunkKey(id) {
  return `chunk-${id}`;
}

function indexKey() {
  return "index";
}

function isFresh(chunk) {
  return Boolean(chunk && chunk.generatedAt > 0 && Date.now() - chunk.generatedAt < SITEMAP_FRESH_MS);
}

function uniqueLocs(paths) {
  const seen = new Set();
  const locs = [];
  for (const path of paths) {
    const raw = String(path || "").split("?")[0].trim();
    if (!raw || !raw.startsWith("/") || seen.has(raw)) continue;
    seen.add(raw);
    locs.push(absoluteUrl(raw));
  }
  return locs;
}

async function buildPagesChunk() {
  const locs = uniqueLocs(STATIC_PATHS);
  return { generatedAt: Date.now(), locs, lastmods: locs.map(() => null), excluded: 0, lastError: null };
}

async function buildHubsChunk() {
  const paths = [];
  for (const key of Object.keys(NAV_VERTICALS)) {
    try {
      const mega = await buildNavMegaCached(key);
      for (const row of [...(mega.popular || []), ...(mega.all || [])]) {
        const href = String(row?.href || "").split("?")[0];
        if (href.startsWith("/")) paths.push(href);
      }
    } catch {
      /* keep other verticals */
    }
  }
  const locs = uniqueLocs(paths);
  return { generatedAt: Date.now(), locs, lastmods: locs.map(() => null), excluded: 0, lastError: null };
}

function listingRows(payload) {
  return Array.isArray(payload?.items) ? payload.items : Array.isArray(payload) ? payload : [];
}

const PUBLIC_OFFERS = ["Account", "CustomItem", "Currency", "ConsoleGame"];

async function fetchListingPage(page, offer) {
  try {
    return await serverFetch(
      apiPaths.marketListings({
        page,
        perPage: LISTING_PER_PAGE,
        sort: "newest",
        offer,
      }),
    );
  } catch (error) {
    if (error instanceof ApiError) return { items: [], meta: null };
    throw error;
  }
}

async function collectOfferListings(offer) {
  const first = await fetchListingPage(1, offer);
  const rows = [...listingRows(first)];
  const total = Number(first?.meta?.total);
  const totalPages = Math.min(
    Number(first?.meta?.totalPages) || Math.max(1, Math.ceil((Number.isFinite(total) ? total : rows.length) / LISTING_PER_PAGE)),
    LISTING_MAX_PAGES,
  );
  for (let page = 2; page <= totalPages; page += 1) {
    const payload = await fetchListingPage(page, offer);
    rows.push(...listingRows(payload));
  }
  return rows;
}

async function collectListings() {
  const rows = [];
  for (const offer of PUBLIC_OFFERS) {
    rows.push(...(await collectOfferListings(offer)));
  }
  const locs = [];
  const lastmods = [];
  let excluded = 0;
  const seen = new Set();
  for (const row of rows) {
    const href = listingShopHref(row);
    if (!href || seen.has(href)) {
      excluded += 1;
      continue;
    }
    seen.add(href);
    locs.push(absoluteUrl(href));
    lastmods.push(sitemapLastmod(row.updated_at || row.updatedAt || row.created_at) || null);
  }
  return { locs, lastmods, excluded, total: locs.length };
}

async function buildListingsChunk(chunk) {
  const all = await collectListings();
  const start = (chunk - 1) * SITEMAP_CHUNK_SIZE;
  const locs = all.locs.slice(start, start + SITEMAP_CHUNK_SIZE);
  const lastmods = all.lastmods.slice(start, start + SITEMAP_CHUNK_SIZE);
  return {
    generatedAt: Date.now(),
    locs,
    lastmods,
    excluded: all.excluded,
    lastError: null,
    meta: { listingsTotal: all.total },
  };
}

async function buildChunk(id) {
  const parsed = parseSitemapFileId(id);
  if (!parsed) {
    return { generatedAt: Date.now(), locs: [], lastmods: [], excluded: 0, lastError: "unknown-id" };
  }
  if (parsed.kind === "pages") return buildPagesChunk();
  if (parsed.kind === "hubs") return buildHubsChunk();
  return buildListingsChunk(parsed.chunk);
}

async function loadChunk(id) {
  const key = chunkKey(id);
  const cached = readChunk(key);
  if (isFresh(cached)) return cached;
  if (inflight.has(key)) return inflight.get(key);
  const pending = buildChunk(id)
    .then((chunk) => {
      writeChunk(key, chunk);
      return chunk;
    })
    .catch((error) => {
      if (cached) {
        return { ...cached, lastError: String(error?.message || error) };
      }
      return { generatedAt: Date.now(), locs: [], lastmods: [], excluded: 0, lastError: String(error?.message || error) };
    })
    .finally(() => {
      inflight.delete(key);
    });
  inflight.set(key, pending);
  return pending;
}

async function listingTotalForIndex() {
  let total = 0;
  for (const offer of PUBLIC_OFFERS) {
    const first = await fetchListingPage(1, offer);
    const count = Number(first?.meta?.total);
    total += Number.isFinite(count) ? count : listingRows(first).length;
  }
  return total;
}

export async function listSitemapIds() {
  let total = 0;
  try {
    total = await listingTotalForIndex();
  } catch {
    total = 0;
  }
  return [sitemapFileId("pages"), sitemapFileId("hubs"), ...listingFileIds(total || 1, SITEMAP_CHUNK_SIZE)];
}

export async function sitemapIndexDocument() {
  const ids = await listSitemapIds();
  const xml = sitemapIndexXml(ids.map((id) => ({ loc: chunkPublicUrl(id) })));
  writeChunk(indexKey(), { generatedAt: Date.now(), locs: ids.map((id) => chunkPublicUrl(id)), lastmods: [], excluded: 0 });
  return xml;
}

export function fallbackSitemapIndexXml() {
  const cached = readChunk(indexKey());
  if (cached?.locs?.length) {
    return sitemapIndexXml(cached.locs);
  }
  return sitemapIndexXml([
    { loc: chunkPublicUrl("pages") },
    { loc: chunkPublicUrl("hubs") },
    { loc: chunkPublicUrl("listings") },
  ]);
}

export async function sitemapXmlForId(id) {
  const chunk = await loadChunk(id);
  const urls = (chunk.locs || []).map((loc, index) => ({
    loc,
    lastmod: chunk.lastmods?.[index] || undefined,
  }));
  return urlsetXml(urls);
}

export function requestSitemapRevalidate() {
  if (revalidateTimer) clearTimeout(revalidateTimer);
  revalidateTimer = setTimeout(() => {
    markStale(indexKey());
    markStale(chunkKey("pages"));
    markStale(chunkKey("hubs"));
    markStale(chunkKey("listings"));
    for (let i = 2; i <= 20; i += 1) markStale(chunkKey(`listings-${i}`));
  }, SITEMAP_REVALIDATE_DEBOUNCE_MS);
}

export async function sitemapStatus() {
  const ids = await listSitemapIds();
  return {
    ids,
    chunks: ids.map((id) => {
      const chunk = readChunk(chunkKey(id));
      return {
        id,
        fresh: isFresh(chunk),
        urls: chunk?.locs?.length || 0,
        generatedAt: chunk?.generatedAt || 0,
        lastError: chunk?.lastError || null,
      };
    }),
  };
}
