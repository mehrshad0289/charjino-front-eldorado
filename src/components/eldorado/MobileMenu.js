"use client";

import { useEffect, useState } from "react";
import { ALL_GAMES } from "./data/referenceData";
import { CATEGORY_NAV, FA, SHOP_ACCOUNTS_HREF } from "./data/faCopy";
import MobileCategorySheet from "./MobileCategorySheet";
import { prefetchNavMegas } from "./nav-mega-client";

const POPULAR = ALL_GAMES.slice(0, 8);

function ChevronRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m9 5 7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 5l14 14M19 5 5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function MobileMenu({ onClose }) {
  const [popular, setPopular] = useState(POPULAR);
  const [openCategory, setOpenCategory] = useState(null);

  useEffect(() => {
    prefetchNavMegas(CATEGORY_NAV.map((item) => item.key));
  }, []);

  useEffect(() => {
    fetch("/api/catalog-categories")
      .then((res) => res.json())
      .then((payload) => {
        if (payload?.success && Array.isArray(payload.data) && payload.data.length > 0) {
          setPopular(
            payload.data.slice(0, 8).map((row) => ({
              name: row.name,
              img: row.icon,
              href: row.href,
            })),
          );
        }
      })
      .catch(() => {});
  }, []);

  if (openCategory) {
    return (
      <MobileCategorySheet
        category={openCategory}
        onBack={() => setOpenCategory(null)}
        onClose={onClose}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-white" role="dialog" aria-modal="true">
      <div className="sticky top-0 flex h-[60px] items-center justify-between bg-headerdark px-4">
        <p className="text-lg font-bold text-white">{FA.menu}</p>
        <button
          type="button"
          aria-label={FA.close}
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center text-white"
        >
          <CloseIcon />
        </button>
      </div>

      <ul className="px-4 pt-4">
        {CATEGORY_NAV.map((c) => (
          <li key={c.key} className="mb-2">
            <button
              type="button"
              onClick={() => setOpenCategory(c)}
              className="flex h-14 w-full items-center justify-between rounded-lg bg-page px-5 text-start text-base text-ink"
            >
              {c.label}
              <span className="rtl:rotate-180">
                <ChevronRight />
              </span>
            </button>
          </li>
        ))}
      </ul>

      <p className="px-5 pb-1 pt-5 text-sm font-bold tracking-[0.14px] text-ink">{FA.popularGames}</p>
      <ul className="px-4 pb-6">
        {popular.map((g) => (
          <li key={g.href || g.name}>
            <a
              href={g.href || SHOP_ACCOUNTS_HREF}
              aria-label={g.name}
              className="flex h-[52px] items-center gap-3 rounded-lg px-1 text-base text-ink active:bg-page"
            >
              {g.img ? (
                <img
                  src={g.img}
                  alt=""
                  width="32"
                  height="32"
                  className="h-8 w-8 shrink-0 rounded-sm object-cover"
                />
              ) : (
                <span className="h-8 w-8 shrink-0 rounded-sm bg-badgebg" />
              )}
              <span className="min-w-0 flex-1 truncate">{g.name}</span>
              <span className="rtl:rotate-180">
                <ChevronRight />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
