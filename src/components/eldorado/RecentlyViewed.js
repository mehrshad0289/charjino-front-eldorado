"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FA } from "./data/faCopy";
import { readHomeRecent } from "./nav-recent";

const SHADOW =
  "shadow-[0_2px_4px_rgba(9,9,11,0.05),0_12px_8px_rgba(9,9,11,0.02)]";

function mergeCards(server, local) {
  const seen = new Set();
  const out = [];
  for (const row of [...(Array.isArray(server) ? server : []), ...(Array.isArray(local) ? local : [])]) {
    const href = String(row?.href || "").trim();
    const item = String(row?.item || "").trim();
    if (!href || !item || seen.has(href)) continue;
    seen.add(href);
    out.push(row);
  }
  return out.slice(0, 12);
}

function RecentCard({ card, index }) {
  const href = String(card.href || "").trim();
  if (!href) return null;
  return (
    <div className={`shrink-0 pb-1 ${index > 0 ? "ps-6" : ""}`}>
      <Link
        href={href}
        prefetch
        draggable={false}
        className={`flex h-60 w-[272px] flex-col whitespace-normal rounded-lg bg-white text-sm leading-[21px] text-ink ${SHADOW}`}
      >
        <div className="relative flex w-full items-center justify-between gap-1 overflow-hidden rounded-t-lg border-b-[0.8px] border-cardborder bg-badgebg p-4">
          
            <img
              src="/home/city-banner-desktop.webp"
              alt=""
              draggable={false}
              loading={index < 2 ? "eager" : "lazy"}
              className="pointer-events-none absolute start-0 top-0 size-full object-cover object-top"
            />
           
          <div className="relative z-[1] flex min-w-0 items-center gap-3">
            {card.gameIcon ? (
              <img
                src={card.gameIcon}
                alt=""
                width="40"
                height="40"
                draggable={false}
                loading="lazy"
                className="h-10 w-10 shrink-0 rounded-lg object-cover"
              />
            ) : (
              <span className="h-10 w-10 shrink-0 rounded-lg bg-badgebg" />
            )}
            {card.game ? (
              <span className="block overflow-hidden font-bold leading-[19.6px]" dir="auto">
                {card.game}
              </span>
            ) : null}
          </div>
          {card.badge ? (
            <div className="relative z-[1] shrink-0">
              <span className="flex max-w-fit items-center justify-center rounded-lg bg-badgebg px-3 pb-[6px] pt-[5px]">
                {card.badge}
              </span>
            </div>
          ) : null}
        </div>
        <div className="flex grow flex-col p-4">
          <span className="block overflow-hidden font-bold" dir="auto">
            {card.item}
          </span>
          {card.price ? (
            <div className="mt-auto">
              <strong className="text-xl font-bold leading-[30px]">{card.price} </strong>
              {card.unit ? (
                <span className="inline-flex items-center gap-1 text-lg leading-[27px]">{card.unit}</span>
              ) : null}
            </div>
          ) : null}
        </div>
      </Link>
    </div>
  );
}

export default function RecentlyViewed({ items }) {
  const [cards, setCards] = useState(() => mergeCards(items, []));

  useEffect(() => {
    setCards(mergeCards(items, readHomeRecent()));
  }, [items]);

  if (cards.length === 0) return null;

  return (
    <section className="relative z-10 mb-12">
      <div className="mx-auto max-w-[1208px] md:px-6">
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <span className="block text-lg font-bold leading-[27px]">{FA.recentlyViewed}</span>
          </div>
          <div className="flex overflow-hidden">
            <div className="recent-cards-scroller flex w-full overflow-x-auto overflow-y-hidden whitespace-nowrap">
              {cards.map((card, index) => (
                <RecentCard key={card.key || card.href} card={card} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
