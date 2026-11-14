"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FA } from "./data/faCopy";

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 5l14 14M19 5 5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function ShopBottomSheet({ open, title, onClose, children, footer = null }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[80] lg:hidden" role="dialog" aria-modal="true" aria-labelledby="shop-bottom-sheet-title">
      <button
        type="button"
        aria-label={FA.close}
        className="shop-backdrop-in absolute inset-0 bg-ink/45 backdrop-blur-[10px]"
        onClick={onClose}
      />
      <div className="shop-sheet-up absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col overflow-hidden rounded-t-[20px] bg-white shadow-[0_-12px_40px_rgba(0,0,0,0.18)]">
        <div className="flex justify-center pt-2.5" aria-hidden="true">
          <span className="h-1 w-10 rounded-full bg-hairline" />
        </div>
        <div className="relative flex h-14 shrink-0 items-center justify-center px-4">
          <p id="shop-bottom-sheet-title" className="text-[18px] font-bold text-ink">
            {title}
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
        <div className={`min-h-0 flex-1 overflow-y-auto px-4 ${footer ? "pb-4" : "pb-[max(1.25rem,env(safe-area-inset-bottom))]"}`}>
          {children}
        </div>
        {footer ? (
          <div className="shrink-0 border-t border-cardborder bg-white px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
            {footer}
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
