"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CATEGORY_NAV, FA } from "./data/faCopy";
import { MegaSearchField } from "./GiftMegaSearch";
import { filterMegaGames } from "../../lib/mega-gift-search";
import PopularGames from "./PopularGames";
import ShopNoResults from "./ShopNoResults";

const NAV_TO_SHOP = {
  Accounts: "accounts",
  "Top ups": "top-ups",
  Items: "items",
  Games: "games",
  "Gift cards": "gift-cards",
  Currency: "currency",
};

export default function ShopGamesToolbar({ items, categoryKey = "" }) {
  const games = Array.isArray(items) ? items : [];
  const [query, setQuery] = useState("");
  const shown = useMemo(() => filterMegaGames(games, query), [games, query]);
  const categories = CATEGORY_NAV.filter((item) => NAV_TO_SHOP[item.key]);

  return (
    <>
      <div className="mx-auto mb-4 max-w-[1208px] px-4 md:px-6">
        <MegaSearchField query={query} onChange={setQuery} onClear={() => setQuery("")} />
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label={FA.categories}>
          {categories.map((item) => {
            const key = NAV_TO_SHOP[item.key];
            const active = key === categoryKey;
            return (
              <Link
                key={item.key}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`inline-flex min-h-[34px] items-center rounded-full px-3 text-[14px] leading-[20px] ${
                  active
                    ? "bg-brand font-bold text-ink"
                    : "bg-white text-ink outline outline-[0.8px] outline-cardborder"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
      {shown.length ? (
        <PopularGames items={shown} title={null} />
      ) : (
        <div className="mx-auto max-w-[1208px] px-4 md:px-6">
          <ShopNoResults title={FA.nothingFound} text={FA.nothingFoundHint} />
        </div>
      )}
    </>
  );
}
