import { blogInternalHref } from "./data/blogData";
/* One "The Latest" article row (blog capture @1920): 140px yellow-bordered
   thumbnail, purple uppercase category, white 20px title, gray date |
   clock ~N min read meta. Mobile <640 (live @390 probes): 110px thumbnail
   (live 110×110), 14px category (live 14px), 18px title; grid goes 1-col
   below 640 (live probed). */

function ClockIcon() {
  /* capture renders a 14px gray glyph (icomoon, decodes empty) — inline SVG
     clock stand-in per the project-wide pattern */
  return (
    <span
      aria-hidden="true"
      className="mr-[4px] inline-block h-[14px] w-[14px] shrink-0 bg-[rgb(138,134,157)]"
      style={{
       WebkitMaskImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.4' stroke-linecap='round'%3E%3Ccircle cx='12' cy='12' r='9'/%3E%3Cpath d='M12 7v5l3.2 2'/%3E%3C/svg%3E\")",
        WebkitMaskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.4' stroke-linecap='round'%3E%3Ccircle cx='12' cy='12' r='9'/%3E%3Cpath d='M12 7v5l3.2 2'/%3E%3C/svg%3E\")",
        maskSize: "contain",
        maskRepeat: "no-repeat",
        maskPosition: "center",
      }}
    />
  );
}

export default function BlogArticleCard({ article }) {
  return (
    <li className="w-full list-none self-start">
      <a className="relative flex items-center rounded-2xl p-[10px]" href={blogInternalHref(article.href)}>
        <div className="relative h-[110px] w-[110px] min-w-[110px] shrink-0 overflow-hidden rounded-2xl border-2 border-[rgb(255,182,0)] sm:h-[140px] sm:w-[140px] sm:min-w-[140px]">
          <img
            alt={article.title}
            className="absolute left-0 top-0 block size-full max-w-full object-cover"
            src={article.image}
          />
        </div>
        {/* flex-1: the live text column takes the full remaining width
            (~384px @1920) — without it the column shrinks to max-content
            (378px) and the longest titles wrap one word early vs live */}
        <div className="flex min-w-0 flex-1 flex-col justify-center pb-1 pl-4 pt-1">
          <div className="mb-[4px] text-[16px] font-bold uppercase leading-[22.4px] text-[rgb(152,126,251)] max-sm:text-[14px] max-sm:leading-[20px]">
            {article.category}
          </div>
          <div className="mb-[8px] text-[20px] font-bold leading-[26px] text-white max-sm:text-[18px] max-sm:leading-[24px]">
            {article.title}
          </div>
          <div>
            {/* live @390: date+pipe on line 1, clock+read on line 2 (screenshot;
                the details container is ~196px there) — one line @640+ */}
            <ul className="flex flex-wrap items-center max-sm:flex-col max-sm:items-start">
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
