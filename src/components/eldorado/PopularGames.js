const GCS =
  "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F";

const GAMES = [
  ["Fortnite V-Bucks", "Top ups", "00f8b44f1c2bc17588632c5e03b2931b09260f31.png?generation=1793718219774624", "/efootball-accounts"],
  ["Roblox Gift Cards", "Gift cards", "c82bd636225645fec5da6f7d27c7be1c4cdc9a60.png?generation=1793718219576813", "/efootball-accounts"],
  ["EA Sports FC Coins", "Currency", "73b8c4a254b1b6b979e55799023bdc3300547a95.png?generation=1793718219747415", "/efootball-accounts"],
  ["Steal a Brainrot", "Items", "c3ce0c829f2b9aad84c307ef212a77e4ce45a91a.png?generation=1793718219557258", "/efootball-accounts"],
  ["Arc Raiders", "Items", "0d44076dcb95b12885a124aee2342330e295fbc9.png?generation=1793718219760760", "/efootball-accounts"],
  ["DonutSMP Money", "Currency", "519d9508c64bcd17f2f4e894550b4ed22e73a66a.png?generation=1793718219787497", "/efootball-accounts"],
  ["Pokemon Go Top Ups", "Top ups", "ce4f2653e0bdd8cc343a4a49d5e8747cea6eeb54.png?generation=1793718219806421", "/efootball-accounts"],
  ["Valorant", "Accounts", "4184f9315f15f88edb02e55fef3afb0ae45c04f1.png?generation=1793718219793600", "/efootball-accounts"],
  ["Murder Mystery 2", "Items", "c0ba43b727684b6b08614ea7ffe7502039d5d099.png?generation=1793718219930605", "/efootball-accounts"],
];

const SHADOW =
  "shadow-[0_2px_4px_rgba(9,9,11,0.05),0_12px_8px_rgba(9,9,11,0.02)]";

export default function PopularGames() {
  return (
    <section className="relative z-10 mb-12">
      <div className="mx-auto max-w-[1208px] px-4 md:px-6">
        <div className="flex flex-col gap-4">
          <span className="block text-lg font-bold leading-[27px]">Popular games</span>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {GAMES.map(([name, tag, img, href]) => (
              <a
                key={name}
                href={href}
                className={`flex min-w-0 items-center gap-3 rounded-lg bg-white p-6 text-sm leading-[21px] text-linkblue ${SHADOW}`}
              >
                <img
                  src={`${GCS}${img}&alt=media`}
                  alt={name}
                  width="40"
                  height="40"
                  loading="lazy"
                  className="h-10 w-10 shrink-0 rounded-sm object-cover"
                />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="block truncate font-bold leading-[19.6px] text-ink">{name}</span>
                  <span className="block text-xs leading-[16.8px] text-graytext">{tag}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
