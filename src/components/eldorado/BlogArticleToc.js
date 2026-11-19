"use client";

import { useEffect, useState } from "react";

function tocTextCls(level, inSheet) {
  if (level <= 2) return inSheet ? "text-[18px] leading-[27px] text-white" : "text-[16px] leading-[19.2px]";
  return inSheet
    ? level === 3
      ? "text-[16px] leading-[24px] text-[rgb(191,187,212)]"
      : "text-[15px] leading-[22px] text-[rgb(138,134,157)]"
    : "text-[14px] leading-[19.2px]";
}

let tocScrollFrame = 0;

function headingOffset() {
  return window.matchMedia("(min-width: 1024px)").matches ? 96 : 170;
}

function scrollToHeading(anchor) {
  const el = document.getElementById(anchor);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const target = Math.max(0, el.getBoundingClientRect().top + window.scrollY - headingOffset());
  window.history.replaceState(null, "", `#${anchor}`);
  if (reduce) {
    window.scrollTo(0, target);
    return;
  }
  const start = window.scrollY;
  const distance = target - start;
  if (Math.abs(distance) < 2) return;
  const duration = Math.min(900, Math.max(480, Math.abs(distance) * 0.42));
  const started = performance.now();
  cancelAnimationFrame(tocScrollFrame);
  const step = (now) => {
    const t = Math.min(1, (now - started) / duration);
    const eased = t < 0.5 ? 4 * t * t * t : 1 - (2 - 2 * t) ** 3 / 2;
    window.scrollTo(0, start + distance * eased);
    if (t < 1) tocScrollFrame = requestAnimationFrame(step);
  };
  tocScrollFrame = requestAnimationFrame(step);
}

export default function BlogArticleToc({ items }) {
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);
  const listItems = Array.isArray(items) ? items : [];

  useEffect(() => {
    if (!listItems.length) return undefined;
    const heads = listItems.map((item) => document.getElementById(item.anchor)).filter(Boolean);
    if (!heads.length) return undefined;
    const onScroll = () => {
      const y = window.scrollY + 160;
      let cur = "";
      for (const heading of heads) {
        if (heading.getBoundingClientRect().top + window.scrollY <= y) cur = heading.id;
      }
      setActive(cur);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [listItems]);

  if (!listItems.length) return null;

  const list = (inSheet) => (
    <ul>
      {listItems.map((item) => (
        <li
          key={item.anchor + item.text}
          className={`mb-[6px] list-none ${inSheet ? "mb-[14px]" : ""} ${
            !inSheet && active === item.anchor ? "current" : ""
          }`}
        >
          <a
            href={`#${item.anchor}`}
            onClick={(event) => {
              event.preventDefault();
              setOpen(false);
              if (inSheet) {
                window.setTimeout(() => scrollToHeading(item.anchor), 180);
              } else {
                scrollToHeading(item.anchor);
              }
            }}
            className={`block rounded-[0.3125rem] p-2 text-[rgb(138,134,157)] ${
              inSheet ? "px-2 py-1" : ""
            } ${tocTextCls(item.level, inSheet)} ${
              !inSheet && active === item.anchor ? "!text-[rgb(255,182,0)]" : ""
            }`}
          >
            {item.text}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <div className="sticky top-20 hidden lg:block">
        <div className="flex min-h-[150px] grow flex-col rounded-2xl border-[0.8px] border-white bg-[rgb(20,19,26)] pb-6 ps-4 pe-4 pt-6">
          <div className="mb-[24px] shrink-0 text-center text-[14px] font-black uppercase leading-[19.6px] tracking-[0.42px]">
            فهرست مطالب
          </div>
          <div className="max-h-[900px] grow overflow-auto">{list(false)}</div>
        </div>
      </div>

      <button
        type="button"
        aria-label="فهرست مطالب"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="fixed end-[14px] top-1/2 z-[900] hidden -translate-y-1/2 max-lg:block"
      >
        <span className="flex h-[45px] w-[45px] items-center justify-center rounded-lg bg-[rgb(30,31,40)] shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
          <svg width="20" height="16" viewBox="0 0 20 16" fill="none" aria-hidden="true">
            <path d="M1 1h18M1 8h18M1 15h12" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[950] max-lg:block" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[75vh] overflow-auto rounded-t-3xl bg-[rgb(20,19,26)] px-4 pb-10 pt-5">
            <div className="relative mb-5 flex items-center justify-center border-b-[0.8px] border-[rgb(42,42,48)] pb-4">
              <span className="text-[20px] font-bold text-white">فهرست مطالب</span>
              <button
                type="button"
                aria-label="بستن"
                onClick={() => setOpen(false)}
                className="absolute end-1 top-1/2 -translate-y-1/2 p-2 text-white"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M2 2l12 12M14 2L2 14" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            {list(true)}
          </div>
        </div>
      )}
    </>
  );
}
