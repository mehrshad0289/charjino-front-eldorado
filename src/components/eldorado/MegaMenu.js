"use client";

import { useEffect, useRef, useState } from "react";
import { ALL_GAMES, POPULAR_GAMES } from "./data/referenceData";
import { FA, SHOP_ACCOUNTS_HREF, SHOP_ITEMS_HREF } from "./data/faCopy";
import { loadNavMega, peekNavMega } from "./nav-mega-client";
import { readRecentGames } from "./nav-recent";

const PROMO_ICONS = [
  {
    name: "Adopt Me",
    img: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F09f4f3f2ab5b2ca48f64d306c12715a3409338a4.png?generation=1793707881976101&alt=media",
  },
  {
    name: "Steal a Brainrot",
    img: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2Fc4478aee66dba9269e21eee0885b714d4cc0bd09.png?generation=1793707881973502&alt=media",
  },
  {
    name: "Murder Mystery 2",
    img: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F9ae1bc8b838e87fd31d440a610207d7ce184c422.png?generation=1793707881972455&alt=media",
  },
];

function GameRow({ game, fallbackHref }) {
  const href = game.href || fallbackHref || SHOP_ACCOUNTS_HREF;
  const img = game.img || game.icon || "";
  return (
    <a href={href} aria-label={game.name} className="text-[14px] leading-[21px]">
      <div className="flex h-[42px] items-center gap-2 truncate rounded-lg text-[16px] leading-[24px] hover:bg-page">
        {img ? (
          <div className="h-7 max-w-fit shrink-0 overflow-hidden rounded-sm">
            <img alt={game.name} src={img} className="block h-7 w-7 object-cover align-middle" />
          </div>
        ) : (
          <span className="block h-7 w-7 shrink-0 rounded-sm bg-badgebg" />
        )}
        <span className="block overflow-hidden text-ellipsis">{game.name}</span>
      </div>
    </a>
  );
}

function GameSection({ title, games, fallbackHref }) {
  if (!games.length) return null;
  return (
    <div className="flex flex-col gap-4">
      <p className="text-[14px] font-bold leading-[19.6px] tracking-[0.14px]">{title}</p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        {games.map((g) => (
          <div key={g.href + g.name}>
            <GameRow game={g} fallbackHref={fallbackHref} />
          </div>
        ))}
      </div>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="#14131a" strokeWidth="2" />
      <path d="m20 20-3.5-3.5" stroke="#14131a" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function ItemsPromo() {
  return (
    <div className="flex items-center gap-4 rounded-lg bg-page p-5">
      <div className="flex grow basis-0 flex-col gap-1">
        <span className="block font-bold">{FA.robloxPriceHistory}</span>
        <span className="block text-[14px] text-graytext">{FA.robloxPriceHistoryHint}</span>
      </div>
      <div className="flex items-center">
        {PROMO_ICONS.map((icon, index) => (
          <div
            key={icon.name}
            className={`flex h-8 w-8 shrink-0 items-center justify-center ${index < PROMO_ICONS.length - 1 ? "-me-2" : ""}`}
          >
            <div
              className="h-7 w-7 overflow-hidden rounded-md border-2 border-searchstroke"
              style={{ transform: `rotate(${[6.91, -1.03, -6.01][index]}deg)` }}
            >
              <img alt={icon.name} src={icon.img} className="block h-7 w-7 object-cover" />
            </div>
          </div>
        ))}
      </div>
      <a
        href={SHOP_ITEMS_HREF}
        aria-label={FA.priceHistory}
        className="inline-flex min-h-[42px] min-w-[70px] items-center justify-center gap-1.5 rounded-lg bg-brand px-4 py-2.5 text-[14px] font-bold leading-[16.8px] text-ink"
      >
        {FA.priceHistory}
      </a>
    </div>
  );
}

function applyMegaData(data, categoryKey, setters) {
  const nextPopular = Array.isArray(data.popular) ? data.popular : [];
  const nextAll = Array.isArray(data.all) ? data.all : [];
  setters.setPopular(nextPopular);
  setters.setAllGames(nextAll);
  setters.setShowPromo(Boolean(data.promo));
  const stored = readRecentGames(categoryKey);
  setters.setRecent(stored.length > 0 ? stored : nextPopular.slice(0, 2));
}

export default function MegaMenu({ onClose, categoryKey, fallbackHref = SHOP_ACCOUNTS_HREF }) {
  const cached = peekNavMega(categoryKey);
  const [query, setQuery] = useState("");
  const [popular, setPopular] = useState(() => (Array.isArray(cached?.popular) ? cached.popular : []));
  const [allGames, setAllGames] = useState(() => (Array.isArray(cached?.all) ? cached.all : []));
  const [recent, setRecent] = useState(() => {
    if (typeof window === "undefined") return [];
    const stored = readRecentGames(categoryKey);
    if (stored.length > 0) return stored;
    return Array.isArray(cached?.popular) ? cached.popular.slice(0, 2) : [];
  });
  const [showPromo, setShowPromo] = useState(() => Boolean(cached?.promo) || categoryKey === "Items");
  const panelRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    let cancelled = false;
    const setters = { setPopular, setAllGames, setShowPromo, setRecent };
    const existing = peekNavMega(categoryKey);
    if (existing) applyMegaData(existing, categoryKey, setters);

    loadNavMega(categoryKey).then((data) => {
      if (cancelled) return;
      if (data) {
        applyMegaData(data, categoryKey, setters);
        return;
      }
      if (peekNavMega(categoryKey)) return;
      applyMegaData(
        { popular: POPULAR_GAMES, all: ALL_GAMES, promo: categoryKey === "Items" },
        categoryKey,
        setters,
      );
    });
    return () => {
      cancelled = true;
    };
  }, [categoryKey]);

  const q = query.trim().toLowerCase();
  const source = allGames.length > 0 ? allGames : [];
  const all = q ? source.filter((g) => g.name.toLowerCase().includes(q)) : source;
  const popularRows = popular.slice(0, 12);

  return (
    <>
      <div className="fixed inset-0 z-[1002]" onClick={onClose} aria-hidden="true" />
      <div ref={panelRef} className="absolute inset-x-0 top-full z-[1003] mx-5 hidden lg:block">
        <div className="flex max-w-[1070px] overflow-hidden rounded-[10px] bg-white text-ink shadow-[rgba(47,47,55,0.15)_0px_2px_4px_0px,rgba(47,47,55,0.1)_0px_24px_60px_0px,rgba(47,47,55,0.05)_0px_12px_24px_0px]">
          <div className="w-[63%]">
            <div className="flex flex-col gap-6 bg-white p-6">
              {showPromo ? <ItemsPromo /> : null}
              <GameSection title={FA.recentlyViewedGames} games={recent} fallbackHref={fallbackHref} />
              <GameSection title={FA.popularGames} games={popularRows} fallbackHref={fallbackHref} />
            </div>
          </div>
          <div className="w-[37%]">
            <div className="relative h-full bg-badgebg">
              <div className="absolute inset-x-0 bottom-0 top-6 flex flex-col gap-4 overflow-y-auto pb-2 ps-6 pe-4">
                <p className="text-[14px] font-bold leading-[19.6px] tracking-[0.14px]">{FA.allGames}</p>
                <div className="relative">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={FA.searchForGame}
                    aria-label={FA.searchForGame}
                    className="block h-[42px] w-full rounded-lg border-2 border-inputgray bg-white py-[7px] ps-3 pe-9 text-[14px] leading-[19.2px] outline-none placeholder:text-ink focus:border-focusblue"
                  />
                  <div className="absolute end-2 top-1/2 -translate-y-1/2">
                    <SearchIcon />
                  </div>
                </div>
                <div>
                  {all.map((g) => (
                    <div key={g.href + g.name} className="pb-1">
                      <GameRow game={g} fallbackHref={fallbackHref} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
