"use client";

const CDN = "https://assetsdelivery.eldorado.gg/v7/_assets_";

const ITEMS = [
  ["EA Sports FC Coins", 142, "/ea-fc-coins/g/142-0-0"],
  ["Fortnite V-Bucks", 16, "/fortnite-vbucks/t/16"],
  ["Steal a Brainrot Items", 259, "/steal-a-brainrot-brainrots/i/259"],
  ["Aion 2 Kinah", 360, "/aion-2-kinah/g/360"],
  ["Pokemon Go Top Ups", 57, "/pokemon-go-pokecoins/t/57"],
  ["DonutSMP Money", 278, "/donutsmp-money/g/278"],
  ["Murder Mystery 2 Items", 204, "/mm2-shop/i/204-2-0"],
  ["Arc Raiders Items", 319, "/arc-raiders-items/i/319"],
  ["Valorant Accounts", 32, "/valorant-accounts/a/32-1-0"],
  ["Razer Gold", 260, "/razer-gold/v/260"],
];

function DarkSearchIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="#14131A" strokeWidth="2" />
      <path d="m20 20-3.5-3.5" stroke="#14131A" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function SearchOverlay({ onClose }) {
  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-[rgba(12,12,16,0.55)]" onClick={onClose} />

      <div className="absolute inset-x-0 bottom-0 top-0 overflow-y-auto bg-white p-3 md:bottom-auto md:top-3 md:mx-auto md:h-fit md:max-h-[530px] md:w-[1160px] md:max-w-[calc(100vw-40px)] md:rounded-xl md:p-6">
        <div className="flex items-center gap-3 md:hidden">
          <div className="relative flex-1">
            <input
              autoFocus
              type="text"
              placeholder="Search for games, keywords, sellers..."
              className="h-[42px] w-full rounded-lg border-2 border-focusblue bg-white pl-3 pr-11 text-base text-ink outline-none placeholder:text-secondary"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2">
              <DarkSearchIcon />
            </span>
          </div>
          <button type="button" onClick={onClose} className="shrink-0 text-base text-ink">
            Cancel
          </button>
        </div>

        <div className="relative hidden md:block">
          <input
            autoFocus
            type="text"
            placeholder="Search for games, keywords, sellers..."
            className="h-[42px] w-full rounded-lg border-2 border-focusblue bg-white pl-4 pr-12 text-base text-ink outline-none placeholder:text-secondary"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2">
            <DarkSearchIcon />
          </span>
        </div>

        <p className="mb-1 mt-6 text-xs font-bold uppercase text-labelgray md:mt-5">
          Popular categories
        </p>

        <ul>
          {ITEMS.map(([name, n, href]) => (
            <li key={name}>
              <a href={href} className="flex items-center gap-4 py-[11px] md:gap-3 md:py-[9px]">
                <img
                  src={`${CDN}/icons/v30/${n}.png`}
                  alt=""
                  width="32"
                  height="32"
                  className="h-8 w-8 rounded-lg object-cover md:h-7 md:w-7 md:rounded-md"
                  loading="lazy"
                />
                <span className="text-base text-ink hover:underline">{name}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
