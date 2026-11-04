"use client";

/* Desktop (lg+) = the search dropdown verbatim from the search-1920px-light
   capture (dark panel w-1160 rgb(30,31,40), dark input, 10 "Popular
   categories" rows h-42 with 28px icons). Live eldorado.gg has since moved
   to a white dropdown — the capture stays the reference per project rules.
   Mobile = full-screen white sheet live-verified @390 (session 3). */

/* WIRING per user request (session 3): every suggestion routes to the
   accounts shop page /efootball-accounts — the shop_account capture is the
   template for all game targets. Each item keeps its capture href for when
   those pages land. */

const SHOP_ACCOUNTS = "/efootball-accounts";

const ASSETS =
  "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F";

const ITEMS = [
  {
    name: "EA Sports FC Coins",
    icon: `${ASSETS}66c5d46b83d50db0635af829c180de5be1382d2b.png?generation=1793707881785438&alt=media`,
    href: "/ea-fc-coins/g/142-0-0",
  },
  {
    name: "Fortnite V-Bucks",
    icon: `${ASSETS}4664c538785f7e22820168170579eeb5eff85540.png?generation=1793707881614115&alt=media`,
    href: "/fortnite-vbucks/t/16",
  },
  {
    name: "Steal a Brainrot Items",
    icon: `${ASSETS}0a17ed4ea6a2751cd84bafc250a39d865fafb7d3.png?generation=1793707882041699&alt=media`,
    href: "/steal-a-brainrot-brainrots/i/259",
  },
  {
    name: "Aion 2 Kinah",
    icon: `${ASSETS}e0c3a1778dcc5625b627256aabb481449c76967a.png?generation=1793707881800295&alt=media`,
    href: "/aion-2-kinah/g/360",
  },
  {
    name: "Pokemon Go Top Ups",
    icon: `${ASSETS}da9fb18c2511873a927684eb0ff0f4e90d90a8a4.png?generation=1793707881792236&alt=media`,
    href: "/pokemon-go-pokecoins/t/57",
  },
  {
    name: "DonutSMP Money",
    icon: `${ASSETS}385dfad8dcab4bd5b7d7464672e53574c28ab994.png?generation=1793707881819290&alt=media`,
    href: "/donutsmp-money/g/278",
  },
  {
    name: "Murder Mystery 2 Items",
    icon: `${ASSETS}ddcef1e456f0f3712913fb8af1ada4799eec5b7a.png?generation=1793714848553239&alt=media`,
    href: "/mm2-shop/i/204-2-0",
  },
  {
    name: "Arc Raiders Items",
    icon: `${ASSETS}e514597295037988252e1c9b7776da7481bfbefe.png?generation=1793714848568849&alt=media`,
    href: "/arc-raiders-items/i/319",
  },
  {
    name: "Valorant Accounts",
    icon: `${ASSETS}20a636c88462c513adf0c43842967f09ee06caa8.png?generation=1793707881605547&alt=media`,
    href: "/valorant-accounts/a/32-1-0",
  },
  {
    name: "Razer Gold",
    icon: `${ASSETS}357ef947867b6f684b09a769f5d199eb0648add2.png?generation=1793714848540919&alt=media`,
    href: "/razer-gold/v/260",
  },
];

function SearchGlyph({ stroke }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke={stroke} strokeWidth="2" />
      <path d="m20 20-3.5-3.5" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function OverlayLabel() {
  return (
    <div className="pb-4 text-xs font-bold uppercase leading-[16.8px] text-navgray">
      Popular categories
    </div>
  );
}

export default function SearchOverlay({ onClose }) {
  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />

      {/* mobile: full-screen white sheet (live @390, session 3) */}
      <div className="absolute inset-0 overflow-y-auto bg-white p-3 lg:hidden">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <input
              autoFocus
              type="text"
              placeholder="Search for games, keywords, sellers..."
              className="h-[42px] w-full rounded-lg border-2 border-focusblue bg-white pl-3 pr-11 text-base text-ink outline-none placeholder:text-secondary"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2">
              <SearchGlyph stroke="#14131A" />
            </span>
          </div>
          <button type="button" onClick={onClose} className="shrink-0 text-base text-ink">
            Cancel
          </button>
        </div>

        <div className="mb-1 mt-6">
          <OverlayLabel />
        </div>

        <ul>
          {ITEMS.map((it) => (
            <li key={it.name}>
              <a href={SHOP_ACCOUNTS} className="flex items-center gap-4 py-[11px]">
                <span className="h-8 w-8 shrink-0 overflow-hidden rounded-lg">
                  <img
                    src={it.icon}
                    alt=""
                    width="32"
                    height="32"
                    className="block h-8 w-8 object-cover align-middle"
                  />
                </span>
                <span className="text-base text-ink hover:underline">{it.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* desktop: capture dropdown — backdrop-blur-xs bg-black/50 behind a
          centered w-1160 dark panel, input row pt-6 px-6 pb-4, scrollable
          body (max-h-440) with the uppercase label and 10 rows */}
      <div className="fixed left-1/2 top-3 z-[2] hidden max-h-[1200px] max-w-[1905px] -translate-x-1/2 lg:block">
        <div className="flex max-h-[530px] w-[1160px] max-w-[1857px] flex-col rounded-2xl bg-catnav">
          <div className="relative flex shrink-0 items-baseline pl-6 pr-6 pb-4 pt-6">
            <div className="relative grow">
              <input
                autoFocus
                type="text"
                placeholder="Search for games, keywords, sellers..."
                className="z-[1] inline-block h-[42px] w-full overflow-clip rounded-lg bg-dropinput pl-3 pr-8 text-ellipsis text-base text-white outline-none placeholder:text-navgray"
              />
              <span className="absolute right-2 top-1/2 z-[2] -translate-y-1/2">
                <SearchGlyph stroke="#FFFFFF" />
              </span>
            </div>
          </div>

          <div className="mb-4 mt-2 max-h-[440px] overflow-auto pl-6">
            <OverlayLabel />
            <div className="flex flex-col gap-2">
              {ITEMS.map((it) => (
                <div key={it.name}>
                  <a href={SHOP_ACCOUNTS} aria-label={it.name} className="text-sm leading-[21px]">
                    <div className="flex h-[42px] items-center gap-2 truncate rounded-lg text-base leading-6 text-white">
                      <span className="h-7 max-w-fit shrink-0 overflow-hidden rounded-sm">
                        <img
                          src={it.icon}
                          alt=""
                          width="28"
                          height="28"
                          className="block h-7 w-7 object-cover align-middle"
                        />
                      </span>
                      <span className="block overflow-hidden text-ellipsis">{it.name}</span>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
