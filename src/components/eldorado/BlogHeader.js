"use client";

import { useState } from "react";
import Logo from "./Logo";
import { BLOG_LOGO } from "./data/blogData";

function Caret({ color = "currentColor", className = "ml-[7px] inline-block h-6 w-[20.5px] align-middle" }) {
  /* The capture's chevron glyph (icomoon) decodes empty — filled-triangle
     SVG stand-in per the project-wide pattern (live zoom shows a solid
     ▼ after Games/Codes/EN on both breakpoints). */
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill={color}
      viewBox="0 0 24 24"
    >
      <path d="M12 19.2 3.4 6h17.2L12 19.2Z" />
    </svg>
  );
}

function BurgerIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="26" viewBox="0 0 24 24" width="26">
      <path d="M3 6.5h18M3 12h18M3 17.5h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* Blog landing header (blog .make capture @1920 + live /blog mobile
   reference, pixel-measured): standalone blog bar — logo, Games (yellow) +
   Codes (purple) dropdown buttons, EN language button, yellow SHOP button.
   Unlike the marketplace HeaderBar there is no search / sign-in / category
   strip. Fixed bar over rgb(14,13,18) page.
   Mobile/tablet <1024 (live @390 pixels): row 1 = logo icon (-ml-2) THEN
   burger, right EN▾ (caret <1024) + SHOP, container px-4, 70px + hairline;
   row 2 = centered Games/Codes 16px in 55px buttons + hairline (header
   totals 149px, hairlines y=70/148). The header stays FIXED at every
   width (session-12 origin model, live-probed); the featured card clears
   it via the section padding (pt-147 <640 → card top ≈201px like live,
   pt-20 @640-1023 → ≈135px, pt-[90px] lg+ → ≈145px). */
export default function BlogHeader() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <header className="fixed left-0 right-0 top-0 z-[500] w-full">
      <div className="relative z-[22] border-b-[0.8px] bg-headerdark" style={{ borderBottomColor: "rgb(42, 42, 48)" }}>
        <div className="relative z-[10] mx-auto w-full max-w-full pl-6 pr-6 max-sm:pl-4 max-sm:pr-4">
          {/* Desktop row */}
          <div className="hidden items-center justify-between lg:flex">
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="mr-[8px]">
                  <a
                    aria-label="Eldorado Blog"
                    className="flex min-h-[70px] items-center"
                    href="https://www.eldorado.gg/blog/"
                  >
                    <img
                      alt="Eldorado Blog"
                      className="block max-w-full align-middle"
                      height="40"
                      src={BLOG_LOGO}
                      width="202"
                    />
                  </a>
                </div>
              </div>
              <div className="relative mt-[10px] flex items-center">
                <button
                  aria-haspopup="true"
                  className="ml-[8px] border-[0.8px] border-black/0 bg-black/0 p-2 pl-[9px] pr-[9px] text-center text-[20px] font-extrabold leading-[20px] text-[rgb(255,182,0)]"
                  style={{ fontFamily: "interstate, Lato, sans-serif" }}
                  type="button"
                >
                  <span className="text-center">Games</span>
                  <Caret color="rgb(255, 182, 0)" />
                </button>
              </div>
              <div className="relative mt-[10px] flex items-center">
                <button
                  aria-haspopup="true"
                  className="ml-[8px] border-[0.8px] border-black/0 bg-black/0 p-2 pl-[9px] pr-[9px] text-center text-[20px] font-extrabold leading-[20px] text-[rgb(152,126,251)]"
                  style={{ fontFamily: "interstate, Lato, sans-serif" }}
                  type="button"
                >
                  <span className="text-center">Codes</span>
                  <Caret color="rgb(152, 126, 251)" />
                </button>
              </div>
            </div>
            <div className="relative ml-auto mr-[8px] flex items-center gap-[8px]">
              <button
                className="flex items-center justify-start rounded-md border-[0.8px] border-black/0 bg-black/0 p-2 pl-[7px] pr-[7px] text-[14px] font-semibold uppercase leading-[14px] tracking-normal text-white"
                type="button"
              >
                {/* Globe icon — data URI verbatim from the capture */}
                <span
                  aria-hidden="true"
                  className="h-[18px] w-[18px] shrink-0 bg-center bg-contain bg-no-repeat"
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='9'/%3E%3Cline x1='3' y1='12' x2='21' y2='12'/%3E%3Cpath d='M12 3a14 14 0 0 1 3.5 9 14 14 0 0 1-3.5 9 14 14 0 0 1-3.5-9A14 14 0 0 1 12 3z'/%3E%3C/svg%3E\")",
                  }}
                />
                <span className="block uppercase">EN</span>
              </button>
            </div>
            <div>
              <a
                className="inline-flex h-10 min-h-10 min-w-[84px] items-center justify-center whitespace-nowrap rounded-lg bg-[rgb(255,182,0)] p-0 pl-[14px] pr-[14px] text-[18px] font-extrabold leading-[21.6px] text-[rgb(20,19,26)]"
                href="https://www.eldorado.gg/"
                style={{ fontFamily: "interstate, Lato, sans-serif" }}
              >
                SHOP
              </a>
            </div>
          </div>

          {/* Mobile (live /blog @390, pixel-measured): row 1 = logo icon
              (-ml-2) THEN burger, right EN▾ + SHOP; container px-4;
              70px row + hairline (live y=0..71) */}
          <div className="flex items-center justify-between lg:hidden">
            <div className="flex items-center">
              <a aria-label="Eldorado Blog" className="-ml-2 flex items-center" href="https://www.eldorado.gg/blog/">
                <Logo color="#ffffff" iconOnly size={40} />
              </a>
              <button
                aria-label="Open menu"
                className="flex h-[70px] w-10 items-center justify-center text-white"
                onClick={() => setDrawerOpen(true)}
                type="button"
              >
                <BurgerIcon />
              </button>
            </div>
            <div className="flex items-center gap-[8px]">
              <button
                className="flex items-center justify-start rounded-md border-[0.8px] border-black/0 bg-black/0 p-2 pl-[7px] pr-[7px] text-[14px] font-semibold uppercase leading-[14px] text-white"
                type="button"
              >
                {/* live mobile language switcher is a dropdown — "EN ▾" with
                    NO globe icon @390 (globe shows ≥1024 only); caret <1024
                    only (the 1920 capture EN button has none) */}
                <span className="block uppercase">EN</span>
                <Caret
                  className="ml-[2px] inline-block h-[11px] w-[11px] align-middle"
                  color="currentColor"
                />
              </button>
              <a
                className="inline-flex h-10 min-h-10 min-w-[84px] items-center justify-center whitespace-nowrap rounded-lg bg-[rgb(255,182,0)] p-0 pl-[14px] pr-[14px] text-[18px] font-extrabold leading-[21.6px] text-[rgb(20,19,26)]"
                href="https://www.eldorado.gg/"
                style={{ fontFamily: "interstate, Lato, sans-serif" }}
              >
                SHOP
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* Secondary nav row — live /blog @390: centered Games (yellow) +
          Codes (purple) at 20px (same as desktop; text rows y=102-114,
          "Games" ≈62px wide) in 55px buttons, row y=72..148 (76px) with its
          own hairline; header totals 149px (probe headerH=149, hairlines at
          y=70-71 and y=148). Same row 640-1023 (fixed header, content slides
          under — live featTop=135 @640); hidden ≥1024 (live headerH=71). */}
      <div
        className="flex items-center justify-center gap-[52px] border-b-[0.8px] bg-headerdark py-[10px] lg:hidden"
        style={{ borderBottomColor: "rgb(42, 42, 48)" }}
      >
        <button
          aria-haspopup="true"
          className="flex min-h-[55px] items-center border-[0.8px] border-black/0 bg-black/0 p-2 pl-[9px] pr-[9px] text-center text-[20px] font-extrabold leading-[20px] text-[rgb(255,182,0)]"
          style={{ fontFamily: "interstate, Lato, sans-serif" }}
          type="button"
        >
          <span className="text-center">Games</span>
          <Caret color="rgb(255, 182, 0)" />
        </button>
        <button
          aria-haspopup="true"
          className="flex min-h-[55px] items-center border-[0.8px] border-black/0 bg-black/0 p-2 pl-[9px] pr-[9px] text-center text-[20px] font-extrabold leading-[20px] text-[rgb(152,126,251)]"
          style={{ fontFamily: "interstate, Lato, sans-serif" }}
          type="button"
        >
          <span className="text-center">Codes</span>
          <Caret color="rgb(152, 126, 251)" />
        </button>
      </div>

      {/* Mobile drawer — live /blog shows a hamburger popup with Games/Codes
          links (hamburger-popup__menu); no capture reference for more content
          → minimal drawer, documented approximation */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[600] bg-headerdark lg:hidden">
          <div className="flex items-center justify-between px-4 py-[15px]">
            <button
              aria-label="Close menu"
              className="flex h-10 w-10 items-center justify-center text-2xl text-white"
              onClick={() => setDrawerOpen(false)}
              type="button"
            >
              ×
            </button>
            <a aria-label="Eldorado Blog" className="flex items-center" href="https://www.eldorado.gg/blog/">
              <Logo color="#ffffff" iconOnly size={40} />
            </a>
            <a
              className="inline-flex h-10 min-h-10 min-w-[84px] items-center justify-center whitespace-nowrap rounded-lg bg-[rgb(255,182,0)] p-0 pl-[14px] pr-[14px] text-[18px] font-extrabold leading-[21.6px] text-[rgb(20,19,26)]"
              href="https://www.eldorado.gg/"
              style={{ fontFamily: "interstate, Lato, sans-serif" }}
            >
              SHOP
            </a>
          </div>
          <nav className="flex flex-col items-center gap-6 pt-10">
            <a
              className="text-[20px] font-extrabold text-[rgb(255,182,0)]"
              href="https://www.eldorado.gg/"
              onClick={() => setDrawerOpen(false)}
              style={{ fontFamily: "interstate, Lato, sans-serif" }}
            >
              Games
            </a>
            <a
              className="text-[20px] font-extrabold text-[rgb(152,126,251)]"
              href="https://www.eldorado.gg/"
              onClick={() => setDrawerOpen(false)}
              style={{ fontFamily: "interstate, Lato, sans-serif" }}
            >
              Codes
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
