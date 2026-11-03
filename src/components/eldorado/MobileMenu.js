"use client";

const CATEGORIES = ["Currency", "Accounts", "Top ups", "Items", "Boosting", "Gift cards"];

const LINKS = {
  Currency: "#",
  Accounts: "#",
  "Top ups": "#",
  Items: "#",
  Boosting: "#",
  "Gift cards": "#",
};

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
      <div className="relative flex h-[60px] items-center justify-center">
        <p className="text-lg font-bold text-ink">Categories</p>
        <button
          type="button"
          aria-label="Close menu"
          onClick={onClose}
          className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center text-ink"
        >
          <CloseIcon />
        </button>
      </div>

      <ul className="px-4 pt-1">
        {CATEGORIES.map((c) => (
          <li key={c} className="mb-2">
            <a
              href={LINKS[c]}
              className="flex h-14 items-center justify-between rounded-lg bg-page px-5 text-base text-ink"
            >
              {c}
              <ChevronRight />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
