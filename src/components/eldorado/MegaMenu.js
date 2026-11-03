"use client";

import { useEffect, useRef, useState } from "react";
import { RECENTLY_VIEWED_GAMES, POPULAR_GAMES, ALL_GAMES } from "./data/referenceData";

const SHOP_ACCOUNTS_HREF = "/efootball-accounts";

function GameRow({ game }) {
  return (
    <a href={SHOP_ACCOUNTS_HREF} aria-label={game.name} className="text-[14px] leading-[21px]">
      <div className="flex h-[42px] items-center gap-2 truncate rounded-lg text-[16px] leading-[24px] hover:bg-page">
        <div className="h-7 max-w-fit shrink-0 overflow-hidden rounded-sm">
          <img
            alt={game.name}
            src={game.img}
            className="block h-7 w-7 object-cover align-middle"
          />
        </div>
        <span className="block overflow-hidden text-ellipsis">{game.name}</span>
      </div>
    </a>
  );
}

function GameSection({ title, games }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-[14px] font-bold leading-[19.6px] tracking-[0.14px]">{title}</p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        {games.map((g) => (
          <div key={g.name}>
            <GameRow game={g} />
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

export default function MegaMenu({ onClose }) {
  const [query, setQuery] = useState("");
  const panelRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const all = query.trim()
    ? ALL_GAMES.filter((g) => g.name.toLowerCase().includes(query.trim().toLowerCase()))
    : ALL_GAMES;

  return (
    <>
      {/* backdrop: click anywhere outside closes the panel */}
      <div className="fixed inset-0 z-[1002]" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        className="absolute inset-x-0 top-full z-[1003] mx-5 hidden md:block"
      >
        <div className="flex max-w-[1070px] overflow-hidden rounded-[10px] bg-white text-ink shadow-[rgba(47,47,55,0.15)_0px_2px_4px_0px,rgba(47,47,55,0.1)_0px_24px_60px_0px,rgba(47,47,55,0.05)_0px_12px_24px_0px]">
          <div className="w-[63%]">
            <div className="flex flex-col gap-6 bg-white p-6">
              <GameSection title="Recently viewed games" games={RECENTLY_VIEWED_GAMES} />
              <GameSection title="Popular games" games={POPULAR_GAMES} />
            </div>
          </div>
          <div className="w-[37%]">
            <div className="relative h-full bg-badgebg">
              <div className="absolute inset-x-0 bottom-0 top-6 flex flex-col gap-4 overflow-y-auto pb-2 pl-6 pr-4">
                <p className="text-[14px] font-bold leading-[19.6px] tracking-[0.14px]">All games</p>
                <div className="relative">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for game"
                    aria-label="Search for game"
                    className="block h-[42px] w-full rounded-lg border-2 border-inputgray bg-white py-[7px] pl-3 pr-9 text-[14px] leading-[19.2px] outline-none placeholder:text-ink focus:border-focusblue"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <SearchIcon />
                  </div>
                </div>
                <div>
                  {all.map((g) => (
                    <div key={g.name} className="pb-1">
                      <GameRow game={g} />
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
