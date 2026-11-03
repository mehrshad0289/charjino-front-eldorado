const CDN = "https://assetsdelivery.eldorado.gg/v7/_assets_";

const icon = (n) => `${CDN}/icons/v30/${n}.png`;

const CARDS = [
  {
    title: "Popular accounts",
    cols: 2,
    mobileCount: 5,
    items: [
      ["Fortnite", 16, "/efootball-accounts"],
      ["Rainbow Six Siege X", 48, "/efootball-accounts"],
      ["Roblox", 70, "/efootball-accounts"],
      ["Old School RuneScape", 10, "/efootball-accounts"],
      ["Pokemon Go", 57, "/efootball-accounts"],
      ["Valorant", 32, "/efootball-accounts"],
      ["Grand Theft Auto 5", 25, "/efootball-accounts"],
      ["League of Legends", 17, "/efootball-accounts"],
      ["Minecraft", 61, "/efootball-accounts"],
      ["Clash of Clans", 18, "/efootball-accounts"],
    ],
  },
  {
    title: "Popular currencies",
    cols: 1,
    mobileCount: 5,
    items: [
      ["EA Sports FC Coins", 142, "/efootball-accounts"],
      ["Aion 2 Kinah", 360, "/efootball-accounts"],
      ["DonutSMP Money", 278, "/efootball-accounts"],
      ["Roblox Robux", 70, "/efootball-accounts"],
      ["Old School RuneScape Gold", 10, "/efootball-accounts"],
    ],
  },
  {
    title: "Popular boosting services",
    cols: 2,
    mobileCount: 2,
    items: [
      ["EA Sports FC", 142, "/efootball-accounts"],
      ["Call of Duty", 35, "/efootball-accounts"],
      ["Valorant", 32, "/efootball-accounts"],
      ["Brawl Stars", 56, "/efootball-accounts"],
    ],
  },
  {
    title: "Popular items",
    cols: 1,
    mobileCount: 2,
    items: [
      ["Anime Adventures", 229, "/efootball-accounts"],
      ["Steal a Brainrot", 259, "/efootball-accounts"],
    ],
  },
];

function Card({ title, cols, mobileCount, items }) {
  /* live @390 rows show the category type under the game name */
  const type = title.replace(/^Popular /, "").replace(/ services$/, "");
  return (
    <div className="rounded-lg bg-card p-6 md:h-[325px]">
      <h3 className="mb-5 text-xl font-bold text-ink">{title}</h3>
      <ul className={`grid gap-x-6 gap-y-1.5 md:gap-y-3.5 ${cols === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}>
        {items.map(([name, n, href], i) => (
          <li key={name} className={i >= mobileCount ? "hidden md:block" : ""}>
            <a
              href={href}
              className="flex items-center gap-3 rounded-lg py-1.5 text-sm text-linkblue hover:underline md:h-6 md:gap-2 md:py-0"
            >
              <img
                src={icon(n)}
                alt=""
                width="24"
                height="24"
                className="h-9 w-9 shrink-0 rounded-md object-cover md:h-6 md:w-6"
                loading="lazy"
              />
              <span className="flex min-w-0 flex-col md:hidden">
                <span className="truncate font-medium leading-[19.6px] text-ink">{name}</span>
                <span className="text-xs leading-[16px] text-graytext">{type}</span>
              </span>
              <span className="hidden truncate md:block">{name}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function CategoryCards() {
  return (
    <section className="relative z-10 bg-page md:-mt-[89px]">
      <div className="mx-auto max-w-[1160px] px-4 md:px-0">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[765px_1fr]">
          <Card {...CARDS[0]} />
          <Card {...CARDS[1]} />
          <Card {...CARDS[2]} />
          <Card {...CARDS[3]} />
        </div>
      </div>
    </section>
  );
}
