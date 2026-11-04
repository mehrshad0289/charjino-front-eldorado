import { BLOG_PAGINATION } from "./data/blogData";

/* Pagination (blog capture @1920): centered 42px pill row — active page 1
   with yellow fill + black text, yellow-bordered 2 / 3 / … / 26, then a
   72px "Next »" link (text verbatim, live-verified). */
export default function BlogPagination() {
  const base =
    "flex min-h-[42px] min-w-[42px] items-center justify-center rounded-lg border-[0.8px] p-0 pl-3 pr-3 text-[14px] leading-[14px]";
  const idle = `${base} border-[rgb(255,182,0)] text-[rgb(255,182,0)]`;

  return (
    <nav className="mt-[48px] flex flex-wrap items-center justify-center gap-[8px]">
      <span
        aria-current="page"
        className={`${base} border-[rgb(255,182,0)] bg-[rgb(255,182,0)] text-black`}
      >
        {BLOG_PAGINATION.current}
      </span>
      {BLOG_PAGINATION.pages.map((p) => (
        <a
          className={idle}
          href={`https://www.eldorado.gg/blog/page/${p}/`}
          key={p}
        >
          {p}
        </a>
      ))}
      <span aria-hidden="true" className={idle}>
        …
      </span>
      <a className={idle} href={`https://www.eldorado.gg/blog/page/${BLOG_PAGINATION.last}/`}>
        {BLOG_PAGINATION.last}
      </a>
      <a
        className={`${base} min-w-[72px] border-[rgb(255,182,0)] text-[rgb(255,182,0)]`}
        href={BLOG_PAGINATION.nextHref}
      >
        Next »
      </a>
    </nav>
  );
}
