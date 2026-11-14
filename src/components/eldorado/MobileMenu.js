"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CATEGORY_NAV, FA } from "./data/faCopy";
import MobileCategorySheet from "./MobileCategorySheet";
import { prefetchNavMegas } from "./nav-mega-client";

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
  const [openCategory, setOpenCategory] = useState(null);

  useEffect(() => {
    prefetchNavMegas(CATEGORY_NAV.map((item) => item.key));
  }, []);

  const sheet = openCategory ? (
    <MobileCategorySheet
      category={openCategory}
      onBack={() => setOpenCategory(null)}
      onClose={onClose}
    />
  ) : (
    <div
      className="shop-sheet-in fixed inset-0 z-[70] overflow-y-auto bg-white"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shop-categories-title"
    >
      <div className="relative flex h-14 items-center justify-center px-4">
        <p id="shop-categories-title" className="text-base font-bold text-ink">
          {FA.categories}
        </p>
        <button
          type="button"
          aria-label={FA.close}
          onClick={onClose}
          className="absolute end-2 flex h-10 w-10 items-center justify-center text-ink"
        >
          <CloseIcon />
        </button>
      </div>

      <ul className="px-4 pt-1">
        {CATEGORY_NAV.map((category) => (
          <li key={category.key} className="mb-2">
            {category.mega === false ? (
              <a
                href={category.href}
                onClick={onClose}
                className="flex h-14 w-full items-center justify-between rounded-lg bg-badgebg px-5 text-start text-base text-ink"
              >
                {category.label}
                <span className="text-ink rtl:rotate-180">
                  <ChevronRight />
                </span>
              </a>
            ) : (
              <button
                type="button"
                onClick={() => setOpenCategory(category)}
                className="flex h-14 w-full items-center justify-between rounded-lg bg-badgebg px-5 text-start text-base text-ink"
              >
                {category.label}
                <span className="text-ink rtl:rotate-180">
                  <ChevronRight />
                </span>
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );

  if (typeof document === "undefined") return sheet;
  return createPortal(sheet, document.body);
}
