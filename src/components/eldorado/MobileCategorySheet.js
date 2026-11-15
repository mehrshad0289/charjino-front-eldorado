"use client";

import { useEffect, useState } from "react";
import { FA } from "./data/faCopy";
import { GiftMegaEmpty, GiftNotSoldBanner, MegaSearchField, useMegaSearch } from "./GiftMegaSearch";
import { ItemsPromo } from "./MegaMenu";
import { loadNavMega, peekNavMega } from "./nav-mega-client";

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 5l14 14M19 5 5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function BackChevron() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M14.5 5.5 8 12l6.5 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GameRow({ game, fallbackHref, showCategory = false }) {
  const href = game.href || fallbackHref;
  const img = game.img || game.icon || "";
  const category = showCategory ? game.category : "";
  return (
    <a href={href} aria-label={game.name} className="flex items-center gap-4 py-[11px] text-base text-ink">
      {img ? (
        <span className="h-8 w-8 shrink-0 overflow-hidden rounded-lg">
          <img src={img} alt="" width="32" height="32" className="block h-8 w-8 object-cover align-middle" />
        </span>
      ) : (
        <span className="h-8 w-8 shrink-0 rounded-lg bg-badgebg" />
      )}
      <span className="min-w-0 flex-1 truncate">{game.name}</span>
      {category ? <span className="shrink-0 text-sm text-graytext">{category}</span> : null}
    </a>
  );
}

function GameList({ title, games, fallbackHref, showCategory = false }) {
  if (!games.length) return null;
  return (
    <div className="pt-6">
      {title ? <p className="pb-1 text-sm font-bold tracking-[0.14px] text-ink">{title}</p> : null}
      <ul>
        {games.map((game) => (
          <li key={`${game.category || ""}:${game.href || ""}:${game.name}`}>
            <GameRow game={game} fallbackHref={fallbackHref} showCategory={showCategory} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function applyMegaData(data, setters) {
  const nextPopular = Array.isArray(data.popular) ? data.popular : [];
  const nextAll = Array.isArray(data.all) ? data.all : [];
  setters.setPopular(nextPopular);
  setters.setAllGames(nextAll);
  setters.setShowPromo(Boolean(data.promo));
}

export default function MobileCategorySheet({ category, onBack, onClose }) {
  const categoryKey = category.key;
  const cached = peekNavMega(categoryKey);
  const [query, setQuery] = useState("");
  const [popular, setPopular] = useState(() => (Array.isArray(cached?.popular) ? cached.popular : []));
  const [allGames, setAllGames] = useState(() => (Array.isArray(cached?.all) ? cached.all : []));
  const [showPromo, setShowPromo] = useState(() => Boolean(cached?.promo) || categoryKey === "Items");

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      e.stopPropagation();
      onBack();
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [onBack]);

  useEffect(() => {
    let cancelled = false;
    const setters = { setPopular, setAllGames, setShowPromo };
    const existing = peekNavMega(categoryKey);
    if (existing) applyMegaData(existing, setters);

    loadNavMega(categoryKey).then((data) => {
      if (cancelled) return;
      if (data) {
        applyMegaData(data, setters);
        return;
      }
      if (peekNavMega(categoryKey)) return;
      applyMegaData({ popular: [], all: [], promo: categoryKey === "Items" }, setters);
    });
    return () => {
      cancelled = true;
    };
  }, [categoryKey]);

  const search = useMegaSearch(categoryKey, query, allGames);
  const filtered = search.rows;
  const showCategory = search.showCategory;

  return (
    <div className="shop-sheet-in fixed inset-0 z-[70] overflow-y-auto bg-white text-ink" role="dialog" aria-modal="true">
      <div className="sticky top-0 z-10 bg-white">
        <div className="relative flex h-14 items-center justify-between px-2">
          <button
            type="button"
            aria-label={FA.menu}
            onClick={onBack}
            className="flex h-10 w-10 items-center justify-center text-ink"
          >
            <span className="rtl:rotate-180">
              <BackChevron />
            </span>
          </button>
          <p className="pointer-events-none absolute inset-x-12 text-center text-base font-bold">{category.label}</p>
          <button
            type="button"
            aria-label={FA.close}
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center text-ink"
          >
            <CloseIcon />
          </button>
        </div>
      </div>

      <div className="px-4">
        <MegaSearchField
          query={query}
          onChange={setQuery}
          onClear={() => setQuery("")}
          inputClassName="block h-[42px] w-full rounded-lg bg-inputgray py-[7px] ps-3 pe-11 text-base text-ink outline-none placeholder:text-graytext"
        />
      </div>

      <div className="px-4 pb-24">
        {query ? (
          <>
            {categoryKey === "Gift cards" && search.kind === "other" ? (
              <div className="pt-6">
                <GiftNotSoldBanner />
              </div>
            ) : null}
            {search.kind === "empty" ? (
              <div className="pt-6">
                <GiftMegaEmpty />
              </div>
            ) : null}
            {search.kind === "pending" ? null : (
              <GameList games={filtered} fallbackHref={category.href} showCategory={showCategory} />
            )}
          </>
        ) : (
          <>
            {showPromo ? (
              <div className="pt-6">
                <ItemsPromo />
              </div>
            ) : null}
            <GameList title={FA.popularGames} games={popular.slice(0, 12)} fallbackHref={category.href} />
            <GameList title={FA.allGames} games={filtered} fallbackHref={category.href} />
          </>
        )}
      </div>
    </div>
  );
}
