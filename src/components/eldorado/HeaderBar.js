"use client";

import { useEffect, useState } from "react";
import Logo from "./Logo";
import SearchOverlay from "./SearchOverlay";
import MobileMenu from "./MobileMenu";

function SearchIcon({ className = "", stroke = "#a0a0aa" }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <circle cx="11" cy="11" r="7" stroke={stroke} strokeWidth="2" />
      <path d="m20 20-3.5-3.5" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function BurgerIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 6.5h18M3 12h18M3 17.5h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 2.8 13 5a7.2 7.2 0 0 1 2.1.9l2.3-.9 1.6 1.6-.9 2.3c.42.65.72 1.36.9 2.1l2.2 1v2.2l-2.2 1a7.2 7.2 0 0 1-.9 2.1l.9 2.3-1.6 1.6-2.3-.9a7.2 7.2 0 0 1-2.1.9l-1 2.2h-2.2l-1-2.2a7.2 7.2 0 0 1-2.1-.9l-2.3.9-1.6-1.6.9-2.3a7.2 7.2 0 0 1-.9-2.1l-2.2-1v-2.2l2.2-1c.18-.74.48-1.45.9-2.1L4 6.6 5.6 5l2.3.9A7.2 7.2 0 0 1 10 5l1-2.2h1Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function HeaderBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen || searchOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, searchOpen]);

  useEffect(() => {
    if (!menuOpen && !searchOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen, searchOpen]);

  return (
    <header className="relative z-40 bg-headerdark">
      <div className="flex h-[60px] items-center px-4 pt-2.5 md:px-6 md:pt-0">
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
          className="-ml-2 mr-1 flex h-[42px] w-[42px] items-center justify-center text-white md:hidden"
        >
          <BurgerIcon />
        </button>

        <a href="/" aria-label="Eldorado logo" className="shrink-0">
          <Logo color="#FFFFFF" className="hidden md:block" />
          <Logo iconOnly className="md:hidden" />
        </a>

        <div className="hidden flex-1 justify-center pl-16 md:flex">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex h-10 w-full max-w-[1162px] items-center gap-2.5 rounded-lg border-2 border-searchstroke px-3.5 text-left text-sm text-secondary"
          >
            <SearchIcon />
            <span className="truncate">Search for games, keywords, sellers...</span>
          </button>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-1">
          <button
            type="button"
            className="h-[42px] rounded-lg bg-brand px-4 text-sm font-bold text-ink"
          >
            Log in
          </button>
          <button
            type="button"
            aria-label="Settings"
            className="flex h-[42px] w-[42px] items-center justify-center text-white md:hidden"
          >
            <GearIcon />
          </button>
        </div>
      </div>

      {/* mobile search row (inside the dark header) */}
      <div className="px-4 pb-3 md:hidden">
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="flex h-[42px] w-full items-center gap-2.5 rounded-lg border-2 border-searchstroke px-3 text-left text-sm"
        >
          <SearchIcon />
          <span className="truncate text-white/60">Search for games, keywords, sellers...</span>
        </button>
      </div>

      {menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} />}
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </header>
  );
}
