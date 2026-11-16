"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FA } from "./data/faCopy";
import { mapSmartSearchItems } from "../../lib/mega-gift-search";

function SearchGlyph({ stroke }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke={stroke} strokeWidth="2" />
      <path d="m20 20-3.5-3.5" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function OverlayLabel() {
  return (
    <div className="pb-4 text-xs font-bold uppercase leading-[16.8px] text-navgray">
      {FA.popularCategories}
    </div>
  );
}

function ResultRows({ items, desktop, onSelect }) {
  return items.map((it) => (
    <div key={it.href + it.name}>
      <Link href={it.href || "/"} prefetch aria-label={it.name} onClick={onSelect} className="text-sm leading-[21px]">
        {desktop ? (
          <div className="flex h-[42px] items-center gap-2 truncate rounded-lg text-base leading-6 text-white">
            {it.icon ? (
              <span className="h-7 max-w-fit shrink-0 overflow-hidden rounded-sm">
                <img src={it.icon} alt="" width="28" height="28" className="block h-7 w-7 object-cover align-middle" />
              </span>
            ) : null}
            <span className="block min-w-0 flex-1 overflow-hidden text-ellipsis" dir="auto">
              {it.name}
            </span>
            {it.category ? <span className="shrink-0 text-xs text-navgray">{it.category}</span> : null}
          </div>
        ) : (
          <span className="flex items-center gap-4 py-[11px]">
            {it.icon ? (
              <span className="h-8 w-8 shrink-0 overflow-hidden rounded-lg">
                <img src={it.icon} alt="" width="32" height="32" className="block h-8 w-8 object-cover align-middle" />
              </span>
            ) : null}
            <span className="min-w-0 flex-1 truncate text-base text-ink hover:underline" dir="auto">
              {it.name}
            </span>
            {it.category ? <span className="shrink-0 text-sm text-graytext">{it.category}</span> : null}
          </span>
        )}
      </Link>
    </div>
  ));
}

const SEARCH_LABELS = {
  giftCards: FA.giftCards,
  topUps: FA.topUps,
  currency: FA.currency,
  accounts: FA.accounts,
  items: FA.items,
  boosting: FA.boosting,
  games: FA.games,
};

export default function SearchOverlay({ onClose }) {
  const [query, setQuery] = useState("");
  const [idleItems, setIdleItems] = useState([]);
  const [results, setResults] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/catalog-categories")
      .then((res) => res.json())
      .then((payload) => {
        if (!cancelled && payload?.success && Array.isArray(payload.data)) {
          setIdleItems(payload.data);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults(null);
      return undefined;
    }
    let cancelled = false;
    const timer = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(q)}&mode=auto&per_page=12`)
        .then((res) => res.json())
        .then((payload) => {
          if (cancelled) return;
          const items = mapSmartSearchItems(payload?.data?.items, SEARCH_LABELS).map((row) => ({
            name: row.name,
            icon: row.img,
            href: row.href,
            category: row.category,
          }));
          setResults(items);
        })
        .catch(() => {
          if (!cancelled) setResults([]);
        });
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  const list = results ?? idleItems;

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />

      <div className="absolute inset-0 overflow-y-auto bg-white p-3 lg:hidden">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={FA.search}
              className="h-[42px] w-full rounded-lg border-2 border-focusblue bg-white ps-3 pe-11 text-base text-ink outline-none placeholder:text-graytext"
            />
            <span className="absolute end-3 top-1/2 -translate-y-1/2">
              <SearchGlyph stroke="#14131A" />
            </span>
          </div>
          <button type="button" onClick={onClose} className="shrink-0 text-base text-ink">
            {FA.cancel}
          </button>
        </div>

        <div className="mb-1 mt-6">
          {results === null ? <OverlayLabel /> : null}
          {results && results.length === 0 ? (
            <p className="py-6 text-center text-sm text-graytext">{FA.nothingFound}</p>
          ) : null}
        </div>

        <ul>
          <ResultRows items={list} desktop={false} onSelect={onClose} />
        </ul>
      </div>

      <div className="fixed left-1/2 top-3 z-[2] hidden max-h-[1200px] max-w-[1905px] -translate-x-1/2 lg:block">
        <div className="flex max-h-[530px] w-[1160px] max-w-[1857px] flex-col rounded-2xl bg-catnav">
          <div className="relative flex shrink-0 items-baseline px-6 pb-4 pt-6">
            <div className="relative grow">
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={FA.search}
                className="z-[1] inline-block h-[42px] w-full overflow-clip rounded-lg bg-dropinput px-3 text-ellipsis text-base text-white outline-none placeholder:text-navgray"
              />
              <span className="absolute end-2 top-1/2 z-[2] -translate-y-1/2">
                <SearchGlyph stroke="#FFFFFF" />
              </span>
            </div>
          </div>

          <div className="mb-4 mt-2 max-h-[440px] overflow-auto px-6">
            {results === null ? <OverlayLabel /> : null}
            {results && results.length === 0 ? (
              <p className="py-6 text-center text-sm text-navgray">{FA.nothingFound}</p>
            ) : null}
            <div className="flex flex-col gap-2">
              <ResultRows items={list} desktop onSelect={onClose} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
