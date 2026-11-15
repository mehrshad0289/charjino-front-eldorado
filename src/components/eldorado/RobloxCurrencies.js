const SHADOW =
  "shadow-[0_2px_4px_rgba(9,9,11,0.05),0_12px_8px_rgba(9,9,11,0.02)]";

export default function RobloxCurrencies({ big, items }) {
  const featured = big && big.href ? big : null;
  const smallCards = Array.isArray(items) ? items.filter((row) => row?.href) : [];
  if (!featured) return null;
  const featuredIcon = featured.img || featured.icon;
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
                  className="pointer-events-none absolute start-0 top-0 size-full object-cover object-top"
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
                {featuredIcon ? (
                  <img
                    src={featuredIcon}
                    alt=""
                    width="40"
                    height="40"
                    loading="lazy"
                    className="h-10 w-10 shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <span className="h-10 w-10 shrink-0 rounded-lg bg-white/20" />
                )}
                <div className="flex flex-col gap-0.5">
                  <span className="block text-2xl font-bold leading-[28.8px]" dir="auto">
                    {featured.name}
                  </span>
                  {featured.sellers ? (
                    <span className="block leading-[19.6px]">{featured.sellers}</span>
                  ) : null}
                </div>
              </div>
              <div className="relative mt-auto flex flex-col gap-5 pt-10">
                <div className="flex flex-col gap-1">
                  <span className="block text-4xl font-bold leading-[43.2px]">{featured.price}</span>
                  {featured.per ? <span className="block text-base leading-6">{featured.per}</span> : null}
                </div>
                <span className="block min-h-12 self-start rounded-lg bg-brand px-4 pt-3 pb-3 text-base font-bold leading-6 text-ink">
                  {featured.cta || "خرید"}
                </span>
              </div>
            </a>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {smallCards.map((c) => (
                <a
                  key={c.key || `${c.href}-${c.name}`}
                  href={c.href}
                  className={`flex h-[116px] items-center gap-4 rounded-lg bg-white p-6 text-sm leading-[21px] ${SHADOW}`}
                >
                  {c.icon ? (
                    <img
                      src={c.icon}
                      alt=""
                      width="40"
                      height="40"
                      loading="lazy"
                      className="h-10 w-10 shrink-0 rounded-lg object-cover"
                    />
                  ) : (
                    <span className="h-10 w-10 shrink-0 rounded-lg bg-badgebg" />
                  )}
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="block truncate font-bold" dir="auto">
                      {c.name}
                    </span>
                    {c.game ? (
                      <span className="block truncate text-xs leading-[16.8px] text-graytext">{c.game}</span>
                    ) : null}
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
