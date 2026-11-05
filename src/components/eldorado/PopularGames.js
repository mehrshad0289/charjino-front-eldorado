import { FA } from "./data/faCopy";

const GCS =
  "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F";

const GAMES = [
  { name: "Fortnite V-Bucks", tag: "Top ups", img: `${GCS}00f8b44f1c2bc17588632c5e03b2931b09260f31.png?generation=1793718219774624&alt=media`, href: "/efootball-accounts" },
  { name: "Roblox Gift Cards", tag: "Gift cards", img: `${GCS}c82bd636225645fec5da6f7d27c7be1c4cdc9a60.png?generation=1793718219576813&alt=media`, href: "/efootball-accounts" },
  { name: "EA Sports FC Coins", tag: "Currency", img: `${GCS}73b8c4a254b1b6b979e55799023bdc3300547a95.png?generation=1793718219747415&alt=media`, href: "/efootball-accounts" },
  { name: "Steal a Brainrot", tag: "Items", img: `${GCS}c3ce0c829f2b9aad84c307ef212a77e4ce45a91a.png?generation=1793718219557258&alt=media`, href: "/efootball-accounts" },
  { name: "Arc Raiders", tag: "Items", img: `${GCS}0d44076dcb95b12885a124aee2342330e295fbc9.png?generation=1793718219760760&alt=media`, href: "/efootball-accounts" },
  { name: "DonutSMP Money", tag: "Currency", img: `${GCS}519d9508c64bcd17f2f4e894550b4ed22e73a66a.png?generation=1793718219787497&alt=media`, href: "/efootball-accounts" },
  { name: "Pokemon Go Top Ups", tag: "Top ups", img: `${GCS}ce4f2653e0bdd8cc343a4a49d5e8747cea6eeb54.png?generation=1793718219806421&alt=media`, href: "/efootball-accounts" },
  { name: "Valorant", tag: "Accounts", img: `${GCS}4184f9315f15f88edb02e55fef3afb0ae45c04f1.png?generation=1793718219793600&alt=media`, href: "/efootball-accounts" },
  { name: "Murder Mystery 2", tag: "Items", img: `${GCS}c0ba43b727684b6b08614ea7ffe7502039d5d099.png?generation=1793718219930605&alt=media`, href: "/efootball-accounts" },
];

const SHADOW =
  "shadow-[0_2px_4px_rgba(9,9,11,0.05),0_12px_8px_rgba(9,9,11,0.02)]";

export default function PopularGames({ items, title }) {
  const games = Array.isArray(items) && items.length > 0 ? items : GAMES;
  const heading = title === null ? null : title || FA.popularGames;
  return (
    <section className="relative z-10 mb-12">
      <div className="mx-auto max-w-[1208px] px-4 md:px-6">
        <div className="flex flex-col gap-4">
          {heading ? (
            <span className="block text-lg font-bold leading-[27px]">{heading}</span>
          ) : null}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {games.map((row) => (
              <a
                key={row.key || row.name}
                href={row.href}
                className={`flex min-w-0 items-center gap-3 rounded-lg bg-white p-6 text-sm leading-[21px] text-linkblue ${SHADOW}`}
              >
                {row.img ? (
                  <img
                    src={row.img}
                    alt={row.name}
                    width="40"
                    height="40"
                    loading="lazy"
                    className="h-10 w-10 shrink-0 rounded-sm object-cover"
                  />
                ) : (
                  <span className="h-10 w-10 shrink-0 rounded-sm bg-badgebg" />
                )}
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="block truncate font-bold leading-[19.6px] text-ink">{row.name}</span>
                  {row.tag ? (
                    <span className="block text-xs leading-[16.8px] text-graytext">{row.tag}</span>
                  ) : null}
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
