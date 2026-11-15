"use client";

import { useEffect, useMemo, useState } from "react";
import { FA } from "./data/faCopy";
import { peekNavMega } from "./nav-mega-client";
import ShopNoResults from "./ShopNoResults";
import {
  collectOtherMegaHits,
  filterMegaGames,
  mapSmartSearchItems,
  uniqueMegaGames,
} from "../../lib/mega-gift-search";

const VERTICAL_LABELS = {
  Currency: FA.currency,
  Accounts: FA.accounts,
  "Top ups": FA.topUps,
  Items: FA.items,
  Boosting: FA.boosting,
  "Gift cards": FA.giftCards,
};

const SEARCH_LABELS = {
  giftCards: FA.giftCards,
  topUps: FA.topUps,
  currency: FA.currency,
  accounts: FA.accounts,
  items: FA.items,
  boosting: FA.boosting,
  games: FA.games,
};

const VERTICAL_GROUP = {
  "Gift cards": "gift-card",
  "Top ups": "game-topup",
  Games: "game-keys",
  Currency: "steam-wallet",
};

function loadSearch(url) {
  return fetch(url)
    .then((res) => res.json())
    .catch(() => null);
}

export function useMegaSearch(categoryKey, query, localGames) {
  const q = String(query || "").trim();
  const group = VERTICAL_GROUP[categoryKey] || "";
  const ownLabel = VERTICAL_LABELS[categoryKey] || "";
  const local = useMemo(
    () => (q ? filterMegaGames(localGames, q) : []),
    [q, localGames],
  );
  const [remote, setRemote] = useState({ q: "", scoped: [], global: [] });
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (q.length < 2) {
      setRemote({ q, scoped: [], global: [] });
      setPending(false);
      return undefined;
    }
    let cancelled = false;
    setPending(true);
    const timer = window.setTimeout(() => {
      const encoded = encodeURIComponent(q);
      const scopedUrl = group
        ? `/api/search?q=${encoded}&per_page=20&mode=products&group=${encodeURIComponent(group)}`
        : "";
      Promise.all([
        scopedUrl ? loadSearch(scopedUrl) : Promise.resolve(null),
        loadSearch(`/api/search?q=${encoded}&per_page=12&mode=auto`),
      ])
        .then(([scopedPayload, globalPayload]) => {
          if (cancelled) return;
          setRemote({
            q,
            scoped: mapSmartSearchItems(scopedPayload?.data?.items, SEARCH_LABELS),
            global: mapSmartSearchItems(globalPayload?.data?.items, SEARCH_LABELS),
          });
        })
        .finally(() => {
          if (!cancelled) setPending(false);
        });
    }, 220);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [q, group]);

  if (!q) {
    return { kind: "browse", rows: Array.isArray(localGames) ? localGames : [], pending: false, showCategory: false };
  }
  if (q.length >= 2 && remote.q !== q) {
    if (local.length > 0) {
      return { kind: "match", rows: local, pending: true, showCategory: false };
    }
    return { kind: "pending", rows: [], pending: true, showCategory: false };
  }
  const fresh = remote.q === q ? remote : { scoped: [], global: [] };
  const inVertical = uniqueMegaGames([
    ...fresh.scoped,
    ...local,
    ...fresh.global.filter((row) => ownLabel && row.category === ownLabel),
  ]);
  if (inVertical.length > 0) {
    return { kind: "match", rows: inVertical, pending, showCategory: false };
  }
  const other = uniqueMegaGames([
    ...fresh.global.filter((row) => !ownLabel || row.category !== ownLabel),
    ...collectOtherMegaHits(q, peekNavMega, VERTICAL_LABELS),
  ]);
  if (other.length > 0) {
    return { kind: "other", rows: other, pending: false, showCategory: true };
  }
  const waiting = pending || (q.length >= 2 && remote.q !== q);
  return { kind: waiting ? "pending" : "empty", rows: [], pending: waiting, showCategory: false };
}

function InfoCircleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 11v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="7.8" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function GiftNotSoldBanner() {
  return (
    <div
      role="status"
      className="mb-1 flex gap-3 rounded-lg bg-[rgba(71,131,255,0.12)] px-4 py-3 text-ink"
    >
      <div className="shrink-0 text-focusblue">
        <InfoCircleIcon />
      </div>
      <div className="flex min-w-0 flex-col gap-1">
        <span className="block text-[16px] font-bold leading-[22px]">{FA.giftNotSoldDirectly}</span>
        <span className="block text-[14px] leading-[19.6px] text-graytext">{FA.giftGetThroughOther}</span>
      </div>
    </div>
  );
}

export function GiftMegaEmpty() {
  return <ShopNoResults title={FA.nothingFound} text={FA.nothingFoundHint} />;
}

function SearchGlyph() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="#14131a" strokeWidth="2" />
      <path d="m20 20-3.5-3.5" stroke="#14131a" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ClearGlyph() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" stroke="#14131a" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function MegaSearchField({ query, onChange, onClear, className = "", inputClassName = "" }) {
  const hasQuery = String(query || "").length > 0;
  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        value={query}
        onChange={(e) => onChange(e.target.value)}
        placeholder={FA.searchForGame}
        aria-label={FA.searchForGame}
        dir="rtl"
        className={
          inputClassName ||
          "block h-[42px] w-full rounded-lg border-2 border-inputgray bg-white py-[7px] ps-3 pe-9 text-[14px] leading-[19.2px] outline-none placeholder:text-ink focus:border-focusblue"
        }
      />
      <div className="absolute end-2 top-1/2 -translate-y-1/2">
        {hasQuery ? (
          <button
            type="button"
            aria-label={FA.clearSearch}
            onClick={onClear}
            className="flex h-6 w-6 items-center justify-center"
          >
            <ClearGlyph />
          </button>
        ) : (
          <SearchGlyph />
        )}
      </div>
    </div>
  );
}
