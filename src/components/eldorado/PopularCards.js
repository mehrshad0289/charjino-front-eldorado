"use client";

import { useRef, useState } from "react";
import { FA } from "./data/faCopy";

const CDN = "https://assetsdelivery.eldorado.gg/v7/_assets_";
const GCS =
  "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F";

const CARDS = [
  {
    game: "Steal a Brainrot",
    gameIcon: `${CDN}/icons/v30/259.png`,
    item: "Dragon Cannelloni",
    price: "€25.24",
    img: `${GCS}9f2623ec5eea3baac7eddd3431a97eca816db1e4.webp?generation=1793718219365373&alt=media`,
    href: "https://www.eldorado.gg/steal-a-brainrot-brainrots/oi/fd5822c4-71d7-40db-f195-08dee6586bc4",
  },
  {
    game: "Fortnite",
    gameIcon: `${CDN}/icons/v30/16.png`,
    item: "Take The L",
    price: "€117.76",
    img: `${GCS}ffef0040483afed7070ee53cf11a1f92335b3b8b.webp?generation=1793718219380883&alt=media`,
    href: "https://www.eldorado.gg/fortnite-accounts-for-sale/a/16-1-0",
  },
  {
    game: "Roblox",
    gameIcon: `${CDN}/icons/v30/70.png`,
    item: "1000 Robux",
    price: "€5.49",
    img: `${GCS}8fba78e5d5337e0408971fa6f01ab6eeb9da4fd0.webp?generation=1793718219371944&alt=media`,
    href: "https://www.eldorado.gg/buy-robux/og/c4168aa4-19aa-4afe-1bde-08df30d674d2",
  },
  {
    game: "Pokemon Go",
    gameIcon: `${CDN}/icons/v30/57.png`,
    item: "15500 PokeCoins",
    price: "€26.83",
    oldPrice: "€109.99",
    discount: "-76%*",
    img: `${GCS}418abd0409015138d4c62a7ad8c75b963b4d50d2.webp?generation=1793718219391442&alt=media`,
    href: "https://www.eldorado.gg/pokemon-go-pokecoins/t/57",
  },
];

export default function PopularCards({ items }) {
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);
  const cards = Array.isArray(items) && items.length > 0 ? items : CARDS;

  const onTrackScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("a");
    const step = card ? card.offsetWidth + 24 : 1;
    setActive(Math.min(cards.length - 1, Math.max(0, Math.round(el.scrollLeft / step))));
  };

  return (
    <section className="relative z-10 mb-6 mb-12 pt-6">
      <div className="mx-auto max-w-[1208px] px-4 md:px-6">
        <span className="block text-lg font-bold leading-[27px]">{FA.popular}</span>
        <div className="mt-4 flex overflow-hidden">
          <div
            ref={trackRef}
            onScroll={onTrackScroll}
            className="flex w-full gap-6 overflow-x-auto overflow-y-hidden whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {cards.map((c, i) => (
              <div key={c.key || c.item} className="shrink-0">
                <a
                  href={c.href}
                  className="relative flex h-[336px] w-[272px] flex-col justify-end gap-2.5 overflow-hidden rounded-lg p-6 text-sm leading-[21px] text-white md:h-80"
                >
                  {c.img ? (
                    <img
                      src={c.img}
                      alt={c.item}
                      loading={i < 2 ? "eager" : "lazy"}
                      className="pointer-events-none absolute left-0 top-0 size-full object-cover object-top"
                    />
                  ) : null}
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(30, 31, 40, 0) 50%, rgb(30, 31, 40) 92.5%)",
                    }}
                  />
                  <div className="relative flex items-center gap-1">
                    {c.gameIcon ? (
                      <img
                        src={c.gameIcon}
                        alt={c.game}
                        width="20"
                        height="20"
                        loading="lazy"
                        className="h-5 w-5 shrink-0 rounded-sm object-cover"
                      />
                    ) : null}
                    <span className="block truncate text-xs font-bold leading-[16.8px]">
                      {c.game}
                    </span>
                  </div>
                  <div className="relative flex flex-col gap-3">
                    <span className="block truncate text-2xl font-bold leading-[28.8px]">
                      {c.item}
                    </span>
                    {c.discount ? (
                      <div className="flex flex-wrap items-end gap-x-2 gap-y-1">
                        <span className="block text-xl font-bold leading-[30px] text-pricegreen">
                          {c.price}
                        </span>
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
                </a>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-3 flex justify-center gap-1.5 md:hidden">
          {cards.map((c, i) => (
            <span
              key={c.key || c.item}
              className={`h-1.5 w-1.5 rounded-full ${i === active ? "bg-ink" : "bg-cardborder"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
