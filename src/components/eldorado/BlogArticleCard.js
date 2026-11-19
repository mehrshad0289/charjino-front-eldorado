function ClockIcon() {
  return (
    <span
      aria-hidden="true"
      className="me-[4px] inline-block h-[14px] w-[14px] shrink-0 bg-[rgb(138,134,157)]"
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

export default function BlogArticleCard({ article }) {
  if (!article?.href) return null;
  return (
    <li className="w-full list-none self-start">
      <a className="relative flex items-center rounded-2xl p-[10px]" href={article.href}>
        <div className="relative h-[110px] w-[110px] min-w-[110px] shrink-0 overflow-hidden rounded-2xl border-2 border-[rgb(255,182,0)] sm:h-[140px] sm:w-[140px] sm:min-w-[140px]">
          {article.image ? (
            <img
              alt={article.title}
              className="absolute inset-0 block size-full max-w-full object-cover"
              src={article.image}
            />
          ) : (
            <div className="absolute inset-0 bg-[rgb(30,31,40)]" />
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center pb-1 ps-4 pt-1">
          {article.category ? (
            <div
              className="mb-[4px] text-[16px] font-bold uppercase leading-[22.4px] text-[rgb(152,126,251)] max-sm:text-[14px] max-sm:leading-[20px]"
              dir="auto"
            >
              {article.category}
            </div>
          ) : null}
          <div
            className="mb-[8px] text-[20px] font-bold leading-[26px] text-white max-sm:text-[18px] max-sm:leading-[24px]"
            dir="auto"
          >
            {article.title}
          </div>
          <div>
            <ul className="flex flex-wrap items-center max-sm:flex-col max-sm:items-start">
              {article.date ? (
                <li className="flex items-center text-[16px] leading-[22.4px] text-[rgb(138,134,157)]">
                  {article.date}
                  {article.read ? (
                    <span
                      aria-hidden="true"
                      className="ms-[6px] me-[6px] block h-[22.4px] w-[4.8px] opacity-60"
                    >
                      |
                    </span>
                  ) : null}
                </li>
              ) : null}
              {article.read ? (
                <li className="flex items-center text-[16px] leading-[22.4px] text-[rgb(138,134,157)]">
                  <ClockIcon />
                  {article.read}
                </li>
              ) : null}
            </ul>
          </div>
        </div>
      </a>
    </li>
  );
}
