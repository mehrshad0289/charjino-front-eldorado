"use client";

import { ALL_GAMES } from "./data/referenceData";

/* Mobile burger menu (mobile has no captured design — structured after the
   live eldorado.gg mobile menu patterns: category list + popular games rows).
   WIRING per user request: every entry routes to the accounts shop page
   /efootball-accounts (the shop_account capture is the template). */

const SHOP_ACCOUNTS = "/efootball-accounts";
const CATEGORIES = ["Currency", "Accounts", "Top ups", "Items", "Boosting", "Gift cards"];
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
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-white" role="dialog" aria-modal="true">
      <div className="sticky top-0 flex h-[60px] items-center justify-between bg-headerdark px-4">
        <p className="text-lg font-bold text-white">Menu</p>
        <button
          type="button"
          aria-label="Close menu"
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center text-white"
        >
          <CloseIcon />
        </button>
      </div>

      <ul className="px-4 pt-4">
        {CATEGORIES.map((c) => (
          <li key={c} className="mb-2">
            <a
              href={SHOP_ACCOUNTS}
              className="flex h-14 items-center justify-between rounded-lg bg-page px-5 text-base text-ink"
            >
              {c}
              <ChevronRight />
            </a>
          </li>
        ))}
      </ul>

      <p className="px-5 pb-1 pt-5 text-sm font-bold tracking-[0.14px] text-ink">Popular games</p>
      <ul className="px-4 pb-6">
        {POPULAR.map((g) => (
          <li key={g.name}>
            <a
              href={SHOP_ACCOUNTS}
              aria-label={g.name}
              className="flex h-[52px] items-center gap-3 rounded-lg px-1 text-base text-ink active:bg-page"
            >
              <img
                src={g.img}
                alt=""
                width="32"
                height="32"
                className="h-8 w-8 shrink-0 rounded-sm object-cover"
              />
              <span className="min-w-0 flex-1 truncate">{g.name}</span>
              <ChevronRight />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
