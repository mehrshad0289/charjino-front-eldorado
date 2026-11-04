"use client";

import { useEffect, useState } from "react";

/* Reading-progress strip under the fixed blog header (article capture:
   `absolute top-full h-2 bg-[rgb(30,31,40)]` with a yellow rgb(255,201,80)
   fill span — live it tracks scroll depth, verified at scrollY 2500).
   Header heights: 149px mobile (two rows) → 71px desktop (lg). */

export default function BlogReadingProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setPct(max > 0 ? Math.min(100, (el.scrollTop / max) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 right-0 top-[149px] z-[499] h-2 bg-[rgb(30,31,40)] lg:top-[71px]"
    >
      <span
        className="block h-full bg-[rgb(255,201,80)]"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
