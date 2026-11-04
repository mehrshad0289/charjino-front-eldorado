const HERO_FADE = "linear-gradient(rgba(246,246,246,0) 0%, rgb(246,246,246) 100%)";

/* Full-width page hero used by /about-us and /contact-us: the banner image
   (object-top) sits behind everything and fades into the page background via
   the capture's bottom-half gradient. Optional breadcrumb row and a centered
   title; extra content (contact's help cards) renders below the title inside
   the same hero, like the capture. */
export default function PageHero({
  image,
  imageOpacity = 1,
  breadcrumb = null,
  title,
  titleClassName = "text-[48px] leading-[52.8px]",
  minHeightClass = "",
  children,
}) {
  return (
    <div className="relative flex flex-col bg-page pt-24 pb-16">
      <img
        alt={image.alt}
        src={image.src}
        style={{ opacity: imageOpacity }}
        className="pointer-events-none absolute left-0 top-0 block size-full max-w-full object-cover object-top align-middle"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 top-1/2 z-[1]"
        style={{ backgroundImage: HERO_FADE }}
      />
      <div className="relative z-[2] mx-auto flex w-full max-w-[1440px] flex-col">
        {breadcrumb && (
          <nav aria-label="Breadcrumb" className="flex flex-wrap">
            {breadcrumb.map((item, i) => (
              <span key={item.label} className="flex items-center">
                {i > 0 && (
                  <span aria-hidden="true" className="p-1 text-graytext">
                    <ChevronRight />
                  </span>
                )}
                <a
                  href={item.href}
                  className={`block text-[14px] leading-[19.6px] text-graytext ${item.bold ? "font-bold" : ""}`}
                >
                  {item.label}
                </a>
              </span>
            ))}
          </nav>
        )}
        <div className={`flex items-center justify-center ${minHeightClass}`}>
          <h1 className={`text-center font-bold ${titleClassName}`}>{title}</h1>
        </div>
        {children}
      </div>
    </div>
  );
}

function ChevronRight() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="m4.5 2.5 3.5 3.5-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
