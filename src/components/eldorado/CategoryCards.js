const CDN = "https://assetsdelivery.eldorado.gg/v7/_assets_";

const icon = (n) => `${CDN}/icons/v30/${n}.png`;

const CARDS = [
  {
    title: "Popular accounts",
    cols: 2,
    mobileCount: 5,
    items: [
      ["Fortnite", 16, "/fortnite-accounts/a/85"],
      ["Rainbow Six Siege X", 48, "/rainbow-six-accounts/a/34"],
      ["Roblox", 70, "/roblox-accounts/a/120"],
      ["Old School RuneScape", 10, "/osrs-accounts/a/13"],
      ["Pokemon Go", 57, "/pokemon-go-accounts/a/36"],
      ["Valorant", 32, "/valorant-accounts/a/60"],
      ["Grand Theft Auto 5", 25, "/gta-5-accounts/a/61"],
      ["League of Legends", 17, "/league-of-legends-accounts/a/18"],
      ["Minecraft", 61, "/minecraft-accounts/a/68"],
      ["Clash of Clans", 18, "/clash-of-clans-accounts/a/50"],
    ],
  },
  {
    title: "Popular currencies",
    cols: 1,
    mobileCount: 5,
    items: [
      ["EA Sports FC Coins", 142, "/ea-fc-coins/g/142-0-0"],
      ["Aion 2 Kinah", 360, "/aion-2-kinah/g/360"],
      ["DonutSMP Money", 278, "/donutsmp-money/g/278"],
      ["Roblox Robux", 70, "/buy-robux/g/70-0-0"],
      ["Old School RuneScape Gold", 10, "/osrs-gold/g/10-0-0"],
    ],
  },
  {
    title: "Popular boosting services",
    cols: 2,
    mobileCount: 2,
    items: [
      ["EA Sports FC", 142, "/ea-fc-boosting/b/142"],
      ["Call of Duty", 35, "/call-of-duty-boosting/b/35"],
      ["Valorant", 32, "/valorant-boosting/b/32"],
      ["Brawl Stars", 56, "/brawl-stars-boosting/b/56"],
    ],
  },
  {
    title: "Popular items",
    cols: 1,
    mobileCount: 2,
    items: [
      ["Anime Adventures", 229, "/anime-adventures-items/t/229"],
      ["Steal a Brainrot", 259, "/steal-a-brainrot-brainrots/i/259"],
    ],
  },
];

function Card({ title, cols, mobileCount, items }) {
  return (
    <div className="rounded-lg bg-card p-6 md:h-[325px]">
      <h3 className="mb-5 text-xl font-bold text-ink">{title}</h3>
      <ul className={`grid gap-x-6 gap-y-3.5 ${cols === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}>
        {items.map(([name, n, href], i) => (
          <li key={name} className={i >= mobileCount ? "hidden md:block" : ""}>
            <a
              href={href}
              className="flex h-6 items-center gap-2 text-sm text-linkblue hover:underline"
            >
              <img
                src={icon(n)}
                alt=""
                width="24"
                height="24"
                className="h-6 w-6 shrink-0 rounded-md object-cover"
                loading="lazy"
              />
              <span className="truncate">{name}</span>
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
