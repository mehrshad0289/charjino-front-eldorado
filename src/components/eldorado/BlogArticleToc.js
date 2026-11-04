"use client";

import { useEffect, useState } from "react";

/* Table of Contents for blog article pages (article capture + live):
   desktop = sticky box `sticky top-20 w-[25%] pl-[21px]` with
   bg rgb(20,19,26), 0.8px white border, rounded-2xl, 24px/16px padding,
   900 uppercase 14px/0.42px title, links 16px/19.2 rgb(138,134,157)
   (level 3 = 14px), active item yellow rgb(255,182,0) via `li.current`
   scroll-spy (live verified @scrollY 2500/4200).
   Mobile = hidden box + floating 45px button (wp theme Table of Contents
   Button.svg, fixed right-[14px], vertically centered) opening a bottom
   sheet (live @390 screenshot: dark sheet, centered title + X, level-2
   white 18px, deeper levels gray/indented). Sheet is our approximation
   of the live popup (only Games/Codes-style links observable). */

function tocTextCls(level, inSheet) {
  if (level <= 2) return inSheet ? "text-[18px] leading-[27px] text-white" : "text-[16px] leading-[19.2px]";
  return inSheet
    ? level === 3
      ? "text-[16px] leading-[24px] text-[rgb(191,187,212)]"
      : "text-[15px] leading-[22px] text-[rgb(138,134,157)]"
    : "text-[14px] leading-[19.2px]";
}

export default function BlogArticleToc({ items }) {
  /* live @scroll 0 shows NO highlighted item (committed full-page capture);
     the yellow li.current appears only after a heading is passed
     (live verified @scrollY 2500/4200) — so start empty. */
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!items.length) return undefined;
    const heads = items
      .map((i) => document.getElementById(i.anchor))
      .filter(Boolean);
    if (!heads.length) return undefined;
    const onScroll = () => {
      const y = window.scrollY + 160;
      let cur = "";
      for (const h of heads) {
        if (h.getBoundingClientRect().top + window.scrollY <= y) cur = h.id;
      }
      setActive(cur);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [items]);

  if (!items.length) return null;

  const list = (inSheet) => (
    <ul>
      {items.map((item) => (
        <li
          key={item.anchor + item.text}
          className={`mb-[6px] list-none ${inSheet ? "mb-[14px]" : ""} ${
            !inSheet && active === item.anchor ? "current" : ""
          }`}
        >
          <a
            href={`#${item.anchor}`}
            onClick={() => setOpen(false)}
            className={`block rounded-[0.3125rem] p-2 text-[rgb(138,134,157)] ${
              inSheet ? "px-2 py-1" : ""
            } ${tocTextCls(item.level, inSheet)} ${
              !inSheet && active === item.anchor
                ? "!text-[rgb(255,182,0)]"
                : ""
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
      {/* desktop sticky box */}
      <div className="sticky top-20 hidden lg:block">
        <div className="flex grow flex-col rounded-2xl border-[0.8px] border-white bg-[rgb(20,19,26)] min-h-[150px] pb-6 pl-4 pr-4 pt-6">
          <div className="mb-[24px] shrink-0 text-center text-[14px] font-black uppercase leading-[19.6px] tracking-[0.42px]">
            Table of Contents
          </div>
          <div className="max-h-[900px] grow overflow-auto">{list(false)}</div>
        </div>
      </div>

      {/* mobile floating button */}
      <button
        type="button"
        aria-label="Table of Contents"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="fixed right-[14px] top-1/2 z-[900] hidden -translate-y-1/2 max-lg:block"
      >
        {/* live: wp themes eldorado img/Table of Contents Button.svg (45x45) */}
        <span className="flex h-[45px] w-[45px] items-center justify-center rounded-lg bg-[rgb(30,31,40)] shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
          <svg width="20" height="16" viewBox="0 0 20 16" fill="none" aria-hidden="true">
            <path d="M1 1h18M1 8h18M1 15h12" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
      </button>

      {/* mobile bottom sheet */}
      {open && (
        <div className="fixed inset-0 z-[950] max-lg:block" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[75vh] overflow-auto rounded-t-3xl bg-[rgb(20,19,26)] px-4 pb-10 pt-5">
            <div className="relative mb-5 flex items-center justify-center border-b-[0.8px] border-[rgb(42,42,48)] pb-4">
              <span className="text-[20px] font-bold text-white">Table of Contents</span>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setOpen(false)}
                className="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-white"
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
