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

export default function BlogCategoryRow({ article }) {
  if (!article?.href) return null;
  return (
    <li className="w-full list-none self-start">
      <a className="flex items-center rounded-2xl p-[10px]" href={article.href}>
        <div className="h-[110px] w-[110px] min-w-[110px] shrink-0 rounded-[16px] p-[2px] max-sm:h-[110px] sm:h-[140px] sm:w-[140px] sm:min-w-[140px]">
          {article.image ? (
            <img
              alt={article.title}
              className="block size-full max-w-full rounded-[14px] object-cover"
              src={article.image}
            />
          ) : (
            <div className="size-full rounded-[14px] bg-[rgb(30,31,40)]" />
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center py-1 ps-4">
          <div
            className="mb-[8px] text-[20px] font-bold leading-[26px] text-white max-sm:text-[18px] max-sm:leading-[23.4px]"
            dir="auto"
          >
            {article.title}
          </div>
          <div>
            <ul className="flex flex-wrap items-center">
              {article.date ? (
                <li className="flex items-center text-[16px] leading-[22.4px] text-[rgb(138,134,157)]">
                  {article.date}
                  {article.read ? (
                    <span
                      aria-hidden="true"
                      className="invisible ms-[6px] me-[6px] block h-[22.4px] w-[4.8px]"
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
