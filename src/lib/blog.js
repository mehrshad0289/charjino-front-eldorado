import { cache } from "react";
import { apiPaths } from "./api-paths";
import { ApiError, serverFetch } from "./server-fetcher";
import { mediaUrl } from "./store-engine";

function asRecord(value) {
  return value && typeof value === "object" ? value : {};
}

function asString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function emptyMeta() {
  return { page: 1, perPage: 10, total: 0, totalPages: 1, offset: null };
}

function emptyHub() {
  return {
    categories: [],
    games: [],
    codes: [],
    allGames: [],
    gamesAllHref: "/blog",
    codesAllHref: "/blog",
    featured: null,
    latest: [],
    meta: emptyMeta(),
    seo: {},
  };
}

export function blogCategoryPath(slug) {
  const value = asString(slug);
  return value ? `/blog/${encodeURIComponent(value)}` : "/blog";
}

export function blogPostPath(categorySlug, postSlug) {
  const category = asString(categorySlug);
  const slug = asString(postSlug);
  if (!category || !slug) return "";
  return `/blog/${encodeURIComponent(category)}/${encodeURIComponent(slug)}`;
}

export function formatBlogDate(iso) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("fa-IR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatReadingMinutes(minutes) {
  const n = Number(minutes);
  if (!Number.isFinite(n) || n <= 0) return "";
  return `مطالعهٔ ${new Intl.NumberFormat("fa-IR").format(Math.round(n))} دقیقه`;
}

export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function wrapTableScroll(html) {
  const source = typeof html === "string" ? html : "";
  if (!source) return "";
  return source.replace(/<table[^>]*>[\s\S]*?<\/table>/g, (match, offset, full) => {
    const before = full.slice(Math.max(0, offset - 80), offset);
    return /class="[^"]*table-scroll[^"]*"\s*>\s*$/.test(before) ? match : `<div class="table-scroll">${match}</div>`;
  });
}

function mapNavItem(item, parentImage = "") {
  const rec = asRecord(item);
  const slug = asString(rec.slug);
  const title = asString(rec.title);
  if (!slug || !title) return null;
  const image = mediaUrl(rec.image) || parentImage || "";
  const children = asArray(rec.children)
    .map((child) => mapNavItem(child, image))
    .filter(Boolean);
  return { slug, title, href: blogCategoryPath(slug), image, children };
}

export function mapBlogNavCategories(items) {
  return asArray(items).map((item) => mapNavItem(item)).filter(Boolean);
}

function haystack(item) {
  return `${item?.slug || ""} ${item?.title || ""}`.toLowerCase();
}

function looksLikeCodes(item) {
  return /code|codes|کد/.test(haystack(item));
}

function looksLikeGamesRoot(item) {
  const slug = asString(item?.slug).toLowerCase();
  const title = asString(item?.title);
  return /^(games|game|bazi|بازی|بازیها|بازی‌ها)$/i.test(slug) || /^(games|بازی‌ها|بازیها|بازی)$/i.test(title);
}

function looksLikeCodesRoot(item) {
  const slug = asString(item?.slug).toLowerCase();
  const title = asString(item?.title);
  return /^(codes|code|کد|کدها)$/i.test(slug) || /^(codes|کدها|کد)$/i.test(title);
}

function flattenNav(rows) {
  const out = [];
  for (const row of asArray(rows)) {
    const kids = asArray(row.children);
    if (kids.length) {
      for (const kid of kids) {
        out.push({
          slug: kid.slug,
          title: kid.title,
          href: kid.href || blogCategoryPath(kid.slug),
          image: kid.image || row.image || "",
        });
      }
    } else if (row.slug && row.title) {
      out.push({
        slug: row.slug,
        title: row.title,
        href: row.href || blogCategoryPath(row.slug),
        image: row.image || "",
      });
    }
  }
  return out;
}

function sortNav(items) {
  return [...items].sort((a, b) => a.title.localeCompare(b.title, "en", { sensitivity: "base" }));
}

function uniqueNav(items) {
  const seen = new Set();
  return asArray(items).filter((item) => {
    const slug = asString(item?.slug);
    if (!slug || seen.has(slug)) return false;
    seen.add(slug);
    return true;
  });
}

function childrenOfRoot(root) {
  if (!root) return [];
  const kids = asArray(root.children);
  return flattenNav(kids.length ? kids : []);
}

export function splitBlogNav(categories) {
  const list = asArray(categories);
  const gamesRoot = list.find(looksLikeGamesRoot);
  const codesRoot = list.find(looksLikeCodesRoot);
  const rest = list.filter((item) => item !== gamesRoot && item !== codesRoot);
  const leftover = flattenNav(rest.filter((item) => !looksLikeCodes(item)));
  const leftoverCodes = flattenNav(rest.filter(looksLikeCodes));
  const games = uniqueNav(sortNav([...childrenOfRoot(gamesRoot), ...leftover]));
  const codes = uniqueNav(sortNav([...childrenOfRoot(codesRoot), ...leftoverCodes]));
  return {
    games,
    codes,
    allGames: games,
    gamesAllHref: gamesRoot ? blogCategoryPath(gamesRoot.slug) : "/blog",
    codesAllHref: codesRoot ? blogCategoryPath(codesRoot.slug) : "/blog",
  };
}

export function mapBlogCard(post) {
  const rec = asRecord(post);
  const category = asRecord(rec.category);
  const href = blogPostPath(category.slug, rec.slug);
  if (!href) return null;
  return {
    href,
    title: asString(rec.title),
    category: asString(category.title),
    categoryHref: blogCategoryPath(category.slug),
    date: formatBlogDate(rec.publishedAt),
    read: formatReadingMinutes(rec.readingMinutes),
    image: mediaUrl(rec.cover),
    excerpt: asString(rec.excerpt),
    alt: asString(rec.coverAlt) || asString(rec.title),
  };
}

export function mapBlogFeatured(post) {
  const card = mapBlogCard(post);
  if (!card) return null;
  return {
    href: card.href,
    image: card.image,
    alt: card.alt,
    date: card.date,
    title: card.title,
    excerpt: card.excerpt,
  };
}

export function mapBlogToc(items) {
  return asArray(items)
    .map((item) => {
      const rec = asRecord(item);
      const text = asString(rec.text);
      const anchor = asString(rec.anchor || rec.id);
      const level = Number(rec.level) || 2;
      if (!text || !anchor) return null;
      return { text, anchor, level };
    })
    .filter(Boolean);
}

export function mapBlogFaq(items) {
  return asArray(items)
    .map((item) => {
      const rec = asRecord(item);
      const q = asString(rec.question || rec.q);
      const a = asString(rec.answer || rec.a);
      if (!q || !a) return null;
      return { q, a, aHtml: `<p>${escapeHtml(a)}</p>` };
    })
    .filter(Boolean);
}

function mapMeta(meta) {
  const rec = asRecord(meta);
  const page = Number(rec.page) || 1;
  const perPage = Number(rec.perPage) || 10;
  const total = Number(rec.total) || 0;
  const totalPages =
    Number(rec.totalPages) || Math.max(1, Math.ceil(total / Math.max(1, perPage)));
  const offset = rec.offset == null ? null : Number(rec.offset);
  return { page, perPage, total, totalPages, offset: Number.isFinite(offset) ? offset : null };
}

export const loadBlogHub = cache(async (page = 1, perPage = 10) => {
  try {
    const data = await serverFetch(apiPaths.blogHub({ page, perPage }));
    const rec = asRecord(data);
    const categories = mapBlogNavCategories(rec.categories);
    return {
      categories,
      ...splitBlogNav(categories),
      featured: mapBlogFeatured(rec.featured),
      latest: asArray(rec.latest || rec.items)
        .map(mapBlogCard)
        .filter(Boolean),
      meta: mapMeta(rec.meta),
      seo: asRecord(rec.seo),
    };
  } catch (error) {
    if (error instanceof ApiError) return emptyHub();
    return emptyHub();
  }
});

export const loadBlogCategories = cache(async () => {
  try {
    const data = await serverFetch(apiPaths.blogCategories);
    return mapBlogNavCategories(asRecord(data).items);
  } catch {
    return [];
  }
});

export const loadBlogNav = cache(async () => splitBlogNav(await loadBlogCategories()));

export const loadBlogCategory = cache(async (slug, offset = 0, perPage = 8) => {
  try {
    const data = await serverFetch(apiPaths.blogCategory(slug, { offset, perPage }));
    const rec = asRecord(data);
    return {
      category: asRecord(rec.category),
      items: asArray(rec.items).map(mapBlogCard).filter(Boolean),
      meta: mapMeta(rec.meta),
      seo: asRecord(rec.seo),
    };
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) return null;
    throw error;
  }
});

export const loadBlogPost = cache(async (slug) => {
  try {
    const data = await serverFetch(apiPaths.blogPost(slug));
    const rec = asRecord(data);
    const post = asRecord(rec.post);
    if (!asString(post.slug)) return null;
    return {
      post,
      related: asArray(rec.related).map(mapBlogCard).filter(Boolean),
    };
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) return null;
    throw error;
  }
});
