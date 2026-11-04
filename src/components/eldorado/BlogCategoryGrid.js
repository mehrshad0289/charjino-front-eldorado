"use client";

import { useState } from "react";
import BlogCategoryRow from "./BlogCategoryRow";

/* Category archive grid + "Load more" (live /blog/<category>/ probes,
   session 15). Live renders ALL rows in the DOM and hides rows 9+ with
   inline display:none; the yellow "Load more" button (123×42, radius 8,
   interstate 800 18px black on rgb(255,183,0); 36px tall <640) reveals
   more per click and disappears once everything is visible (verified:
   the button is gone after revealing all rows live). Grid: 2 cols × 560
   gap 24 @≥640, 1 col @<640. Vertical rhythm: grid mt 88px (154 <640 —
   live .archive-box spacing incl. the reserved switcher band), button
   row mt-16 (64 both widths). */
export default function BlogCategoryGrid({ rows }) {
  const INITIAL = 8;
  const BATCH = 8;
  const [visible, setVisible] = useState(INITIAL);
  const hasMore = visible < rows.length;

  return (
    <>
      <ul
        className="grid grid-cols-1 gap-[24px] sm:grid-cols-2"
        style={{ alignItems: "start" }}
      >
        {rows.map((article, i) => (
          <BlogCategoryRow
            key={article.href}
            article={i < visible ? article : { ...article, hidden: true }}
          />
        ))}
      </ul>
      {hasMore && (
        <div className="mt-16 flex justify-center">
          <button
            type="button"
            onClick={() => setVisible((v) => Math.min(v + BATCH, rows.length))}
            className="rounded-lg px-4 pb-[5px] pt-[5px] text-[18px] font-extrabold leading-[26px] text-black max-sm:leading-[26px] sm:py-[8px]"
            style={{
              backgroundColor: "rgb(255, 183, 0)",
              fontFamily: "interstate, Lato, sans-serif",
            }}
          >
            Load more
          </button>
        </div>
      )}
    </>
  );
}
