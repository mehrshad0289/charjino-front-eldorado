import Link from "next/link";
import ShopNoResults from "./ShopNoResults";
import { FA } from "./data/faCopy";
import { toFaDigits } from "../../lib/fa-digits";

function listHref(base, { q, page }) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

export default function GameKeyCatalog({
  href,
  q = "",
  keys = [],
  page = 1,
  totalPages = 1,
  intro = null,
}) {
  const hasKeys = Array.isArray(keys) && keys.length > 0;
  const pages = Math.max(1, Number(totalPages) || 1);
  const current = Math.min(pages, Math.max(1, Number(page) || 1));

  return (
    <div className="mx-auto w-full max-w-[1208px] px-4 py-8 md:px-6">
      {intro?.text ? <p className="max-w-[640px] text-[15px] leading-7 text-graytext">{intro.text}</p> : null}
      {intro?.services?.length ? (
        <ul className="mt-4 flex flex-col gap-2">
          {intro.services.map((service) => (
            <li key={service.href + service.title}>
              <Link href={service.href} className="text-[15px] font-bold text-linkblue">
                {service.title}
              </Link>
              <span className="ms-2 text-[14px] text-graytext">{service.text}</span>
            </li>
          ))}
        </ul>
      ) : null}
      <form className={`${intro?.text || intro?.services?.length ? "mt-6" : ""} flex flex-wrap gap-2`} action={href}>
        <input
          name="q"
          defaultValue={q}
          placeholder="اسم بازی"
          aria-label="اسم بازی"
          className="h-[42px] w-full max-w-[360px] rounded-lg bg-white px-3 text-[14px]"
        />
        <button type="submit" className="h-[42px] rounded-lg bg-brand px-4 text-[14px] font-bold text-ink">
          جستجو
        </button>
      </form>
      {hasKeys ? (
        <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {keys.map((item) => (
            <li key={item.handle}>
              <Link href={item.href} className="flex items-center gap-3 rounded-xl bg-white p-3">
                {item.img ? (
                  <img src={item.img} alt="" className="h-14 w-14 shrink-0 rounded-lg object-cover" />
                ) : (
                  <span className="h-14 w-14 shrink-0 rounded-lg bg-badgebg" />
                )}
                <span className="min-w-0">
                  <span className="block truncate font-bold" dir="auto">
                    {item.name}
                  </span>
                  {item.price ? <span className="mt-1 block text-[14px] text-graytext">{item.price}</span> : null}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-6">
          <ShopNoResults title={FA.nothingFound} text={q ? FA.nothingFoundHint : FA.shopEmpty} />
        </div>
      )}
      {pages > 1 ? (
        <nav className="mt-6 flex flex-wrap items-center gap-2" aria-label={FA.games}>
          {current > 1 ? (
            <Link href={listHref(href, { q, page: current - 1 })} className="text-[14px] font-bold text-linkblue">
              {toFaDigits(current - 1)}
            </Link>
          ) : null}
          <span className="text-[14px] font-bold">{toFaDigits(current)}</span>
          {current < pages ? (
            <Link href={listHref(href, { q, page: current + 1 })} className="text-[14px] font-bold text-linkblue">
              {toFaDigits(current + 1)}
            </Link>
          ) : null}
        </nav>
      ) : null}
    </div>
  );
}
