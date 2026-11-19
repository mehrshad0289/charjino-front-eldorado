import { toFaDigits } from "../../lib/fa-digits";

function pageList(current, last) {
  const set = new Set([1, last, current, current + 1, current + 2]);
  const pages = [...set].filter((n) => n >= 1 && n <= last).sort((a, b) => a - b);
  const out = [];
  for (let i = 0; i < pages.length; i += 1) {
    if (i > 0 && pages[i] - pages[i - 1] > 1) out.push("…");
    out.push(pages[i]);
  }
  return out;
}

export default function BlogPagination({ current = 1, last = 1, hrefFor }) {
  const currentPage = Number(current) || 1;
  const lastPage = Number(last) || 1;
  if (lastPage <= 1 || typeof hrefFor !== "function") return null;
  const base =
    "flex min-h-[42px] min-w-[42px] items-center justify-center rounded-lg border-[0.8px] p-0 ps-3 pe-3 text-[14px] leading-[14px]";
  const idle = `${base} border-[rgb(255,182,0)] text-[rgb(255,182,0)]`;
  const items = pageList(currentPage, lastPage);

  return (
    <nav className="mt-[48px] flex flex-wrap items-center justify-center gap-[8px]" aria-label="صفحه‌بندی">
      {items.map((item, index) =>
        item === "…" ? (
          <span aria-hidden="true" className={idle} key={`e-${index}`}>
            …
          </span>
        ) : item === currentPage ? (
          <span aria-current="page" className={`${base} border-[rgb(255,182,0)] bg-[rgb(255,182,0)] text-black`} key={item}>
            {toFaDigits(item)}
          </span>
        ) : (
          <a className={idle} href={hrefFor(item)} key={item}>
            {toFaDigits(item)}
          </a>
        ),
      )}
      {currentPage < lastPage ? (
        <a className={`${base} min-w-[72px] border-[rgb(255,182,0)] text-[rgb(255,182,0)]`} href={hrefFor(currentPage + 1)}>
          بعدی »
        </a>
      ) : null}
    </nav>
  );
}
