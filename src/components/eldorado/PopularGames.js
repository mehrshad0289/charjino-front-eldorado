import { FA } from "./data/faCopy";
import ShopNoResults from "./ShopNoResults";

const SHADOW =
  "shadow-[0_2px_4px_rgba(9,9,11,0.05),0_12px_8px_rgba(9,9,11,0.02)]";

export default function PopularGames({ items, title }) {
  const games = Array.isArray(items) ? items : [];
  const heading = title === null ? null : title || FA.popularGames;
  if (games.length === 0) {
    return (
      <section className="relative z-10 mb-12">
        <div className="mx-auto max-w-[1208px] px-4 md:px-6">
          {heading ? (
            <span className="mb-4 block text-lg font-bold leading-[27px]">{heading}</span>
          ) : null}
          <ShopNoResults title={FA.nothingFound} text={FA.shopEmpty} />
        </div>
      </section>
    );
  }
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
