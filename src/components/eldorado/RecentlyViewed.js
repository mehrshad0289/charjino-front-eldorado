import { FA } from "./data/faCopy";

const CDN = "https://assetsdelivery.eldorado.gg/v7/_assets_";
const GCS =
  "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F";

const CARD = {
  game: "Steal a Brainrot",
  gameIcon: `${CDN}/icons/v30/259.png`,
  gameImg: `${GCS}f528040fff716634931b4d12cd442287def84d05.png?generation=1793707881599945&alt=media`,
  item: "DRAGON CANNELLONI",
  price: "€11.50",
  unit: "/ unit",
  badge: "Items",
  href: "https://www.eldorado.gg/steal-a-brainrot-brainrots/oi/093ef8d4-da49-4fd2-1cd8-08de837250ef",
};

export default function RecentlyViewed({ items }) {
  const cards = Array.isArray(items) && items.length > 0 ? items : [CARD];
  return (
    <section className="relative z-10 mb-12">
      <div className="mx-auto max-w-[1208px] px-4 md:px-6">
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <span className="block text-lg font-bold leading-[27px]">{FA.recentlyViewedGames}</span>
          </div>
          <div className="flex w-full overflow-x-auto overflow-y-hidden whitespace-nowrap">
            {cards.map((card) => (
              <div key={card.href} className="shrink-0 pb-1">
                <a
                  href={card.href}
                  className="flex h-60 w-[272px] flex-col whitespace-normal rounded-lg bg-white text-sm leading-[21px] shadow-[0_2px_4px_rgba(9,9,11,0.05),0_12px_8px_rgba(9,9,11,0.02)]"
                >
                  <div className="relative flex w-full items-center justify-between gap-1 overflow-hidden rounded-t-lg border-b-[0.8px] border-cardborder bg-badgebg p-4">
                    <img
                      src={card.gameImg}
                      alt=""
                      loading="lazy"
                      className="pointer-events-none absolute left-0 top-0 size-full object-cover object-top"
                    />
                    <div className="relative z-[1] flex items-center gap-3">
                      <img
                        src={card.gameIcon}
                        alt={card.game}
                        width="40"
                        height="40"
                        loading="lazy"
                        className="h-10 w-10 shrink-0 rounded-lg object-cover"
                      />
                      <span className="block overflow-hidden font-bold leading-[19.6px]">
                        {card.game}
                      </span>
                    </div>
                    <div className="relative z-[1]">
                      <span className="flex max-w-fit items-center justify-center rounded-lg bg-badgebg px-3 pt-[5px] pb-[6px]">
                        {card.badge}
                      </span>
                    </div>
                  </div>
                  <div className="flex grow flex-col p-4">
                    <span className="block overflow-hidden font-bold">{card.item}</span>
                    <div className="mt-auto">
                      <strong className="text-xl font-bold leading-[30px]">{card.price} </strong>
                      <span className="inline-flex items-center gap-1 text-lg leading-[27px]">
                        {card.unit}
                      </span>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
