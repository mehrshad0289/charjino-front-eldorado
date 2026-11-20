"use server";

import { ApiError, serverFetch } from "@/lib/server-fetcher";
import { ensureAccessToken } from "@/lib/ensure-access-token";
import { apiPaths } from "@/lib/api-paths";
import {
  BLOG_COMMENTS_PER_PAGE,
  loadBlogCategory,
  loadBlogComments,
  mapBlogComment,
} from "@/lib/blog";

function toActionMessage(error) {
  if (error instanceof ApiError && error.message) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return "درخواست انجام نشد";
}

function bearerHeaders(accessToken) {
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
}

function fromAuthError(error, message) {
  if (error instanceof ApiError && error.statusCode === 401) {
    return { ok: false, unauthorized: true, message };
  }
  return { ok: false, message: toActionMessage(error) };
}

export async function loadMoreBlogCategoryPosts(slug, offset) {
  const nextOffset = Math.max(0, Number(offset) || 0);
  try {
    const data = await loadBlogCategory(String(slug || ""), nextOffset, 8);
    if (!data) return { rows: [], offset: nextOffset, total: 0 };
    return {
      rows: data.items,
      offset: nextOffset + data.items.length,
      total: data.meta.total,
    };
  } catch {
    return { rows: [], offset: nextOffset, total: 0 };
  }
}

export async function loadMoreBlogComments(slug, page) {
  const nextPage = Math.max(1, Math.trunc(Number(page) || 1));
  try {
    const data = await loadBlogComments(String(slug || ""), nextPage);
    return {
      ok: true,
      items: data.items,
      meta: data.meta,
    };
  } catch {
    return { ok: false, items: [], meta: { page: nextPage, perPage: BLOG_COMMENTS_PER_PAGE, total: 0, totalPages: 1 } };
  }
}

export async function postBlogComment(slug, body, parentId) {
  const key = String(slug || "").trim();
  const text = String(body || "").trim();
  if (!key) return { ok: false, message: "مطلب پیدا نشد." };
  if (text.length < 3) return { ok: false, message: "متن نظر خیلی کوتاه است." };
  if (text.length > 1000) return { ok: false, message: "متن نظر حداکثر ۱۰۰۰ کاراکتر است." };
  const accessToken = await ensureAccessToken();
  if (!accessToken) return { ok: false, unauthorized: true, message: "برای ثبت نظر وارد شوید." };
  const payload = { body: text };
  const parent = Number(parentId);
  if (Number.isInteger(parent) && parent > 0) payload.parentId = parent;
  try {
    const data = await serverFetch(apiPaths.blogPostComments(key), {
      method: "POST",
      headers: bearerHeaders(accessToken),
      body: JSON.stringify(payload),
    });
    return { ok: true, comment: mapBlogComment(data), message: "نظر ثبت شد و پس از تأیید نمایش داده می‌شود." };
  } catch (error) {
    return fromAuthError(error, "برای ثبت نظر وارد شوید.");
  }
}

export async function likeBlogComment(commentId) {
  const id = Number(commentId);
  if (!Number.isInteger(id) || id < 1) return { ok: false, message: "نظر پیدا نشد." };
  const accessToken = await ensureAccessToken();
  if (!accessToken) return { ok: false, unauthorized: true, message: "برای پسندیدن وارد شوید." };
  try {
    const data = await serverFetch(apiPaths.blogCommentLike(id), {
      method: "POST",
      headers: bearerHeaders(accessToken),
    });
    return {
      ok: true,
      liked: Boolean(data?.liked),
      likesCount: Number(data?.likesCount) || 0,
    };
  } catch (error) {
    return fromAuthError(error, "برای پسندیدن وارد شوید.");
  }
}
