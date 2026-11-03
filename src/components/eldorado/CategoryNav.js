"use client";

import { useState } from "react";
import MegaMenu from "./MegaMenu";

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

/* WIRING (user request: «روی هر کدام زد دسته اکانت همین باز شود»): every
   category routes to the accounts shop page — the shop_account capture is the
   template for all categories until their own captures exist. */
const SHOP_ACCOUNTS = "/efootball-accounts";

const CATEGORIES = ["Currency", "Accounts", "Top ups", "Items", "Boosting", "Gift cards"];

export default function CategoryNav({ activeCategory = null }) {
  const [openCategory, setOpenCategory] = useState(null);
  const [pinned, setPinned] = useState(false);

  const openMenu = (name) => {
    if (name === "Accounts") {
      setOpenCategory("Accounts");
    }
  };
  const closeMenu = () => {
    setOpenCategory(null);
    setPinned(false);
  };

  return (
    <nav
      className={`relative hidden bg-catnav text-white md:block ${
        openCategory ? "z-[1001]" : "z-30"
      }`}
      onMouseLeave={() => {
        if (!pinned) closeMenu();
      }}
    >
      <div className="flex h-10 items-center justify-between md:px-6">
        <ul className="ml-3 flex items-center overflow-x-auto whitespace-nowrap">
          {CATEGORIES.map((c) => {
            const active = openCategory === c || activeCategory === c;
            const isAccounts = c === "Accounts";
            return (
              <li key={c}>
                <a
                  href={SHOP_ACCOUNTS}
                  aria-expanded={isAccounts ? openCategory === "Accounts" : undefined}
                  aria-haspopup={isAccounts ? "true" : undefined}
                  onMouseEnter={() => openMenu(c)}
                  onClick={(e) => {
                    if (isAccounts) {
                      e.preventDefault();
                      setOpenCategory("Accounts");
                      setPinned(true);
                    }
                  }}
                  className={`flex h-10 items-center gap-1 px-3 pb-0.5 text-sm font-bold tracking-[0.48px] ${
                    active ? "rounded-t-sm bg-catactive text-white" : "text-white hover:text-brand"
                  }`}
                >
                  {c}
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden="true"
                    className={`mt-1 text-navgray ${active ? "rotate-180" : ""}`}
                  >
                    <path
                      d="m2.5 4.5 3.5 3 3.5-3"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-2 text-sm md:flex">
          <a href="#" className="flex h-10 items-center gap-2 px-[14px] text-navgray hover:text-brand">
            <HeadsetIcon />
            24/7 live support
          </a>
          <button type="button" className="flex h-10 items-center gap-2 px-1.5 text-navgray hover:text-brand">
            <GlobeIcon />
            <span>
              English <span className="opacity-60">|</span> EUR - €
            </span>
          </button>
          <button
            type="button"
            aria-label="Toggle theme"
            className="rounded-sm bg-searchstroke p-1 text-white hover:text-brand"
          >
            <SunIcon />
          </button>
          <button type="button" aria-label="Dark theme" className="p-1 text-white hover:text-brand">
            <MoonIcon />
          </button>
        </div>
      </div>

      {openCategory === "Accounts" && <MegaMenu onClose={closeMenu} />}
    </nav>
  );
}
