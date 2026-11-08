"use client";

import { useEffect, useMemo, useState } from "react";
import { FA } from "./data/faCopy";
import { peekNavMega } from "./nav-mega-client";
import ShopNoResults from "./ShopNoResults";
import {
  collectOtherMegaHits,
  filterMegaGames,
  partitionSearchItems,
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
};

export function useGiftMegaSearch(enabled, query, giftGames) {
  const q = String(query || "").trim();
  const localGift = useMemo(
    () => (enabled && q ? filterMegaGames(giftGames, q) : []),
    [enabled, q, giftGames],
  );
  const [remote, setRemote] = useState({ gift: [], other: [], q: "" });
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!enabled || !q || localGift.length > 0) {
      setRemote({ gift: [], other: [], q });
      setPending(false);
      return undefined;
    }

    let cancelled = false;
    setPending(true);
    const timer = window.setTimeout(() => {
      const encoded = encodeURIComponent(q);
      const load = (url) =>
        fetch(url)
          .then((res) => res.json())
          .catch(() => null);
      Promise.all([
        load(`/api/search?q=${encoded}&per_page=20&group=gift-card`),
        load(`/api/search?q=${encoded}&per_page=20`),
      ])
        .then(([giftPayload, allPayload]) => {
          if (cancelled) return;
          const groupedGift = partitionSearchItems(giftPayload?.data?.items, SEARCH_LABELS).gift;
          const split = partitionSearchItems(allPayload?.data?.items, SEARCH_LABELS);
          setRemote({
            q,
            gift: groupedGift.length > 0 ? groupedGift : split.gift,
            other: split.other,
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
  }, [enabled, q, localGift.length]);

  const freshRemote = remote.q === q ? remote : { gift: [], other: [] };

  if (!enabled) {
    return { kind: "plain", rows: [], pending: false };
  }
  if (!q) {
    return { kind: "all", rows: Array.isArray(giftGames) ? giftGames : [], pending: false };
  }
  if (localGift.length > 0) {
    return { kind: "gift", rows: localGift, pending: false };
  }
  if (freshRemote.gift.length > 0) {
    return { kind: "gift", rows: freshRemote.gift, pending: false };
  }
  const other = uniqueMegaGames([
    ...collectOtherMegaHits(q, peekNavMega, VERTICAL_LABELS),
    ...freshRemote.other,
  ]);
  if (other.length > 0) {
    return { kind: "other", rows: other, pending: false };
  }
  const waiting = pending || remote.q !== q;
  return { kind: waiting ? "pending" : "empty", rows: [], pending: waiting };
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
