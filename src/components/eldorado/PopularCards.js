"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { FA } from "./data/faCopy";

function OfferCard({ c, i }) {
  const href = String(c.href || "").trim();
  if (!href) return null;
  return (
    <Link
      href={href}
      prefetch
      draggable={false}
      className="relative flex h-[336px] w-[272px] flex-col justify-end gap-2.5 overflow-hidden rounded-lg p-6 text-sm leading-[21px] text-white md:h-80"
    >
      {c.img ? (
        <img
          src={c.img}
          alt={c.item}
          draggable={false}
          loading={i < 2 ? "eager" : "lazy"}
          className="pointer-events-none absolute start-0 top-0 size-full object-cover object-top"
        />
      ) : null}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "linear-gradient(rgba(30, 31, 40, 0) 50%, rgb(30, 31, 40) 92.5%)",
        }}
      />
      <div className="relative flex items-center gap-1">
        {c.gameIcon ? (
          <img
            src={c.gameIcon}
            alt={c.game}
            width="20"
            height="20"
            draggable={false}
            loading="lazy"
            className="h-5 w-5 shrink-0 rounded-sm object-cover"
          />
        ) : null}
        <span className="block truncate text-xs font-bold leading-[16.8px]">{c.game}</span>
      </div>
      <div className="relative flex flex-col gap-3">
        <span className="block truncate text-2xl font-bold leading-[28.8px]" dir="auto">
          {c.item}
        </span>
        {c.discount ? (
          <div className="flex flex-wrap items-end gap-x-2 gap-y-1">
            <span className="block text-xl font-bold leading-[30px] text-pricegreen">{c.price}</span>
            <span className="block rounded-sm bg-pricegreen/20 px-1 py-0.5 text-xs font-bold leading-[16.8px] text-pricegreen">
              {c.discount}
            </span>
            <s className="mb-0.5 block leading-[19.6px]">{c.oldPrice}</s>
          </div>
        ) : (
          <span className="block text-xl font-bold leading-[30px]">{c.price}</span>
        )}
      </div>
      <div className="relative mt-1 md:hidden">
        <span className="flex h-9 items-center justify-center rounded-lg bg-brand text-sm font-bold text-ink">
          {FA.buyNow}
        </span>
      </div>
    </Link>
  );
}

export default function PopularCards({ items, title }) {
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);
  const cards = Array.isArray(items) ? items.filter((row) => String(row?.href || "").trim()) : [];

  const onTrackScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("a");
    const step = card ? card.offsetWidth + 24 : 1;
    const max = Math.max(1, el.scrollWidth - el.clientWidth);
    const pos = Math.min(max, Math.max(0, Math.abs(el.scrollLeft)));
    setActive(Math.min(cards.length - 1, Math.max(0, Math.round(pos / step))));
  };

  if (cards.length === 0) return null;

  return (
    <section className="relative z-10 mb-12 pt-6">
      <div className="mx-auto max-w-[1208px] px-4 md:px-6">
        <span className="block text-lg font-bold leading-[27px]">{title || FA.popular}</span>
        <div className="mt-4 flex overflow-hidden">
          <div
            ref={trackRef}
            onScroll={onTrackScroll}
            onDragStart={(event) => event.preventDefault()}
            className="popular-cards-scroller flex w-full overflow-x-auto overflow-y-hidden whitespace-nowrap"
          >
            {cards.map((c, i) => (
              <div key={c.key || c.item} className={`shrink-0 ${i > 0 ? "ps-6" : ""}`}>
                <OfferCard c={c} i={i} />
              </div>
            ))}
          </div>
        </div>
        {cards.length > 1 ? (
          <div className="mt-3 flex justify-center gap-1.5 md:hidden">
            {cards.map((c, i) => (
              <span
                key={c.key || c.item}
                className={`h-1.5 w-1.5 rounded-full ${i === active ? "bg-ink" : "bg-cardborder"}`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
