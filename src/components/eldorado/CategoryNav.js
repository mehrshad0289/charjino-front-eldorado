"use client";

import { useEffect, useRef, useState } from "react";
import MegaMenu from "./MegaMenu";
import { CATEGORY_NAV, FA } from "./data/faCopy";
import { loadNavMega, peekNavMega, prefetchNavMegas } from "./nav-mega-client";

function HeadsetIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 13a8 8 0 1 1 16 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <rect x="3" y="13" width="4" height="6" rx="1.5" fill="currentColor" />
      <rect x="17" y="13" width="4" height="6" rx="1.5" fill="currentColor" />
      <path d="M19 19v1a2 2 0 0 1-2 2h-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path
        d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M18.7 5.3l-1.8 1.8M7.1 16.9l-1.8 1.8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function CategoryNav({ activeCategory = null }) {
  const [openCategory, setOpenCategory] = useState(null);
  const [settled, setSettled] = useState({});
  const triggersRef = useRef(null);
  const megaRef = useRef(null);

  const markSettled = (key) => {
    setSettled((prev) => (prev[key] ? prev : { ...prev, [key]: true }));
  };

  useEffect(() => {
    const keys = CATEGORY_NAV.map((item) => item.key);
    prefetchNavMegas(keys);
    keys.forEach((key) => {
      loadNavMega(key).finally(() => markSettled(key));
    });
  }, []);

  const openMenu = (key) => {
    setOpenCategory(key);
    loadNavMega(key).finally(() => markSettled(key));
  };
  const closeMenu = () => {
    setOpenCategory(null);
  };
  const toggleMenu = (key) => {
    if (openCategory === key) closeMenu();
    else openMenu(key);
  };
  const showMega = Boolean(openCategory && (peekNavMega(openCategory) || settled[openCategory]));

  useEffect(() => {
    if (!openCategory) return undefined;
    const onPointerDown = (event) => {
      const target = event.target;
      if (triggersRef.current?.contains(target)) return;
      if (megaRef.current?.contains(target)) return;
      closeMenu();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [openCategory]);

  return (
    <>
    <nav
      className={`hidden bg-catnav text-white lg:fixed lg:inset-x-0 lg:top-[var(--shop-header-bar)] lg:block ${
        openCategory ? "z-[1001]" : "z-40"
      }`}
    >
      <div className="flex h-10 items-center justify-between lg:px-6">
        <ul ref={triggersRef} className="ms-3 flex items-center overflow-x-auto whitespace-nowrap">
          {CATEGORY_NAV.map((c) => {
            const expanded = openCategory === c.key;
            const active = expanded || activeCategory === c.key;
            return (
              <li key={c.key}>
                <button
                  type="button"
                  aria-expanded={expanded}
                  aria-haspopup="true"
                  aria-controls={expanded ? `nav-mega-${c.key}` : undefined}
                  onClick={() => toggleMenu(c.key)}
                  className={`flex h-10 items-center gap-1 px-3 pb-0.5 text-sm font-bold tracking-[0.48px] ${
                    active ? "rounded-t-sm bg-catactive text-white" : "text-white hover:text-brand"
                  }`}
                >
                  {c.label}
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden="true"
                    className={`mt-1 text-navgray ${expanded ? "rotate-180" : ""}`}
                  >
                    <path
                      d="m2.5 4.5 3.5 3 3.5-3"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-2 text-sm lg:flex">
          <a href="/support" className="flex h-10 items-center gap-2 px-[14px] text-navgray hover:text-brand">
            <HeadsetIcon />
            {FA.support}
          </a>
          <button type="button" className="flex h-10 items-center gap-2 px-1.5 text-navgray hover:text-brand">
            <GlobeIcon />
            <span>
              {FA.language} <span className="opacity-60">|</span> {FA.toman}
            </span>
          </button>
          <button
            type="button"
            aria-label={FA.themeToggle}
            className="rounded-sm bg-searchstroke p-1 text-white hover:text-brand"
          >
            <SunIcon />
          </button>
          <button type="button" aria-label={FA.darkTheme} className="p-1 text-white hover:text-brand">
            <MoonIcon />
          </button>
        </div>
      </div>

      {showMega ? (
        <div ref={megaRef}>
          <MegaMenu
            key={openCategory}
            categoryKey={openCategory}
            onClose={closeMenu}
            fallbackHref={CATEGORY_NAV.find((c) => c.key === openCategory)?.href}
          />
        </div>
      ) : null}
    </nav>
    <div className="hidden h-10 lg:block" aria-hidden="true" />
    </>
  );
}
