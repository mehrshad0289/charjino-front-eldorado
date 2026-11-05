const GCS =
  "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F";
const ROBLOX_ICON = "https://assetsdelivery.eldorado.gg/v7/_assets_/icons/v30/70.png";

const BIG = {
  name: "Robux",
  sellers: "201 sellers compete on price",
  price: "€5.49",
  per: "per 1,000 Robux",
  cta: "Buy Robux",
  href: "https://www.eldorado.gg/buy-robux/og/c4168aa4-19aa-4afe-1bde-08df30d674d2",
  img: `${GCS}bc3d741fd40991159ca8143ea21d3813125cacb0.webp?generation=1793718219576127&alt=media`,
};

const SMALL = [
  {
    name: "Gems",
    game: "Pet Simulator 99",
    price: "€1.32491",
    unit: "/ B",
    icon: `${GCS}01773feafa78723690d3922e4f3ebbc9bb6b7a74.png?generation=1793718219589938&alt=media`,
    href: "https://www.eldorado.gg/pet-simulator-99-gems/g/199-0-0",
  },
  {
    name: "Trade Tokens",
    game: "Blade Ball",
    price: "€2.98013",
    unit: "/ K",
    icon: `${GCS}ed3d8ef2c01977a57ddadb8b7ea45876b708d46f.png?generation=1793718219617079&alt=media`,
    href: "https://www.eldorado.gg/blade-ball-tokens/g/203-0-0",
  },
  {
    name: "Mushrooms",
    game: "Creatures of Sonaria",
    price: "€0.00258",
    unit: "/ K",
    icon: `${GCS}931064646e0a7517029285fb676be3952adf46e9.png?generation=1793718219744157&alt=media`,
    href: "https://www.eldorado.gg/creatures-of-sonaria-mushrooms/g/280",
  },
  {
    name: "Tokens",
    game: "Grow a Garden",
    price: "€1.61583",
    unit: "/ K",
    icon: `${GCS}8196235caeb014882ad39cf891f7b84a1c1dea77.png?generation=1793718219756788&alt=media`,
    href: "https://www.eldorado.gg/grow-a-garden-tokens/g/243",
  },
  {
    name: "Trade Tokens",
    game: "Escape Tsunami For Brainrots",
    price: "€0.5364",
    unit: "/ K",
    icon: `${GCS}20bc178e3b6219ba7a758240d869dbd7524cef50.png?generation=1793718219776189&alt=media`,
    href: "https://www.eldorado.gg/escape-tsunami-for-brainrots-tokens/g/351",
  },
  {
    name: "Gems",
    game: "Toilet Tower Defense",
    price: "€0.18401",
    unit: "/ M",
    icon: `${GCS}47624d0651666f89ae9cd91aa41208ce7c224260.png?generation=1793718219748528&alt=media`,
    href: "https://www.eldorado.gg/toilet-tower-defense-gems/g/218",
  },
];

const SHADOW =
  "shadow-[0_2px_4px_rgba(9,9,11,0.05),0_12px_8px_rgba(9,9,11,0.02)]";

export default function RobloxCurrencies({ big, items }) {
  const featured = big && big.href ? big : BIG;
  const smallCards = Array.isArray(items) && items.length > 0 ? items : SMALL;
  return (
    <section className="relative z-10 mb-12">
      <div className="mx-auto max-w-[1208px] px-4 md:px-6">
        <div className="flex flex-col gap-4">
          <span className="block text-lg font-bold leading-[27px]">ارز بازی</span>
          <div className="grid gap-6 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
            <a
              href={featured.href}
              className={`relative flex min-h-80 flex-col overflow-hidden rounded-lg p-6 text-sm leading-[21px] text-white ${SHADOW}`}
            >
              {featured.img ? (
                <img
                  src={featured.img}
                  alt={featured.name}
                  loading="lazy"
                  className="pointer-events-none absolute left-0 top-0 size-full object-cover object-top"
                />
              ) : null}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, rgba(20, 19, 26, 0.9) 0%, rgba(20, 19, 26, 0.75) 50%, rgba(20, 19, 26, 0.45) 100%)",
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(20, 19, 26, 0.35) 0%, rgba(0, 0, 0, 0) 50%, rgba(20, 19, 26, 0.6) 100%)",
                }}
              />
              <div className="relative flex items-center gap-3">
                <img
                  src={ROBLOX_ICON}
                  alt="Roblox"
                  width="40"
                  height="40"
                  loading="lazy"
                  className="h-10 w-10 shrink-0 rounded-lg object-cover"
                />
                <div className="flex flex-col gap-0.5">
                  <span className="block text-2xl font-bold leading-[28.8px]">{featured.name}</span>
                  <span className="block leading-[19.6px]">{featured.sellers}</span>
                </div>
              </div>
              <div className="relative mt-auto flex flex-col gap-5 pt-10">
                <div className="flex flex-col gap-1">
                  <span className="block text-4xl font-bold leading-[43.2px]">{featured.price}</span>
                  <span className="block text-base leading-6">{featured.per}</span>
                </div>
                <span className="block min-h-12 self-start rounded-lg bg-brand px-4 pt-3 pb-3 text-base font-bold leading-6 text-ink">
                  {featured.cta}
                </span>
              </div>
            </a>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {smallCards.map((c) => (
                <a
                  key={c.href || c.name}
                  href={c.href}
                  className={`flex h-[116px] items-center gap-4 rounded-lg bg-white p-6 text-sm leading-[21px] ${SHADOW}`}
                >
                  {c.icon ? (
                    <img
                      src={c.icon}
                      alt={c.game}
                      width="40"
                      height="40"
                      loading="lazy"
                      className="h-10 w-10 shrink-0 rounded-lg object-cover"
                    />
                  ) : (
                    <span className="h-10 w-10 shrink-0 rounded-lg bg-badgebg" />
                  )}
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="block truncate font-bold">{c.name}</span>
                    <span className="block truncate text-xs leading-[16.8px] text-graytext">
                      {c.game}
                    </span>
                    <span className="mt-1 block leading-[19.6px] text-graytext">
                      <strong className="font-bold text-ink">{c.price}</strong> {c.unit}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
