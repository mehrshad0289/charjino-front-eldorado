import { blogInternalHref } from "./data/blogData";
/* One category-archive row (live /blog/<category>/ @1920 + @390 probes,
   session 15): flex row — 140px square thumb (110 @<640) in a 16px-radius
   frame with a 2px transparent inset (img 136/106, 14px radius, object-
   cover, NO yellow border unlike the landing card), white 20px/26px 700
   title (18px/23.4 mobile), gray 16px date | clock ~N min read meta.
   The live row also contains .item-game-cat (purple uppercase label) but
   the theme hides it with display:none on archive pages — omitted here.
   Row paddings: anchor p-[10px] (li 160 = 140 + 2×10 @1920), text column
   pl-4 py-1 (live .reg-item-content padding 4px 0 4px 16px). */
function ClockIcon() {
  /* same 14px gray clock stand-in as BlogArticleCard (icomoon glyph decodes
     empty in the capture family; live renders a 14×14 glyph + 4px margin) */
  return (
    <span
      aria-hidden="true"
      className="mr-[4px] inline-block h-[14px] w-[14px] shrink-0 bg-[rgb(138,134,157)]"
      style={{
        WebkitMaskImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.4' stroke-linecap='round'%3E%3Ccircle cx='12' cy='12' r='9'/%3E%3Cpath d='M12 7v5l3.2 2'/%3E%3C/svg%3E\")",
        WebkitMaskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.4' stroke-linecap='round'%3E%3Ccircle cx='12' cy='12' r='9'/%3E%3Cpath d='M12 7v5l3.2 2'/%3E%3C/svg%3E\")",
        maskSize: "contain",
        maskRepeat: "no-repeat",
        maskPosition: "center",
      }}
    />
  );
}

export default function BlogCategoryRow({ article }) {
  return (
    <li
      className="w-full list-none self-start"
      /* live: rows 9+ start inline display:none, revealed by Load more */
      style={article.hidden ? { display: "none" } : undefined}
    >
      <a
        className="flex items-center rounded-2xl p-[10px]"
        href={blogInternalHref(article.href)}
      >
        <div className="h-[110px] w-[110px] min-w-[110px] shrink-0 rounded-[16px] p-[2px] max-sm:h-[110px] sm:h-[140px] sm:w-[140px] sm:min-w-[140px]">
          <img
            alt={article.title}
            className="block size-full max-w-full rounded-[14px] object-cover"
            src={article.image}
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center py-1 pl-4">
          <div className="mb-[8px] text-[20px] font-bold leading-[26px] text-white max-sm:text-[18px] max-sm:leading-[23.4px]">
            {article.title}
          </div>
          <div>
            <ul className="flex flex-wrap items-center">
              <li className="flex items-center text-[16px] leading-[22.4px] text-[rgb(138,134,157)]">
                {article.date}
                <span
                  aria-hidden="true"
                  className="ml-[6px] mr-[6px] block h-[22.4px] w-[4.8px] opacity-60"
                >
                  |
                </span>
              </li>
              <li className="flex items-center text-[16px] leading-[22.4px] text-[rgb(138,134,157)]">
                <ClockIcon />
                {article.read}
              </li>
            </ul>
          </div>
        </div>
      </a>
    </li>
  );
}
