"use server";

import { loadBlogCategory } from "@/lib/blog";

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
