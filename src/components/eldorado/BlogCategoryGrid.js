"use client";

import { useState } from "react";
import { loadMoreBlogCategoryPosts } from "@/actions/blog.actions";
import BlogCategoryRow from "./BlogCategoryRow";

export default function BlogCategoryGrid({ categorySlug, initialRows = [], initialOffset = 1, total = 0 }) {
  const [rows, setRows] = useState(Array.isArray(initialRows) ? initialRows : []);
  const [offset, setOffset] = useState(Number(initialOffset) || 1);
  const [count, setCount] = useState(Number(total) || 0);
  const [pending, setPending] = useState(false);
  const hasMore = offset < count;

  async function onMore() {
    if (pending || !hasMore || !categorySlug) return;
    setPending(true);
    try {
      const result = await loadMoreBlogCategoryPosts(categorySlug, offset);
      setRows((prev) => [...prev, ...(result.rows || [])]);
      setOffset(Number(result.offset) || offset);
      setCount(Number(result.total) || count);
    } finally {
      setPending(false);
    }
  }

  if (!rows.length && !hasMore) return null;

  return (
    <>
      <ul className="grid grid-cols-1 gap-[24px] sm:grid-cols-2" style={{ alignItems: "start" }}>
        {rows.map((article) => (
          <BlogCategoryRow key={article.href} article={article} />
        ))}
      </ul>
      {hasMore ? (
        <div className="mt-16 flex justify-center">
          <button
            type="button"
            disabled={pending}
            onClick={onMore}
            className="blog-display rounded-lg bg-[rgb(255,183,0)] px-4 pb-[5px] pt-[5px] text-[18px] font-extrabold leading-[26px] text-black max-sm:leading-[26px] sm:py-[8px] disabled:opacity-60"
          >
            بیشتر
          </button>
        </div>
      ) : null}
    </>
  );
}
