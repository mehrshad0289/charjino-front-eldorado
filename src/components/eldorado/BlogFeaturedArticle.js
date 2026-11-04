import { BLOG_FEATURED, blogInternalHref } from "./data/blogData";

/* Featured article card (blog capture @1920): 358px image card with a
   bottom-left overlay — yellow date, 28px black title, gray excerpt — over
   a "to right top" black gradient. Overlay padding per the capture:
   pt-8 pr-10 pb-8 pl-10. The excerpt is clamped to 2 lines (live probe:
   -webkit-line-clamp 2, h=56 = 2×28). Mobile <640 (live @390): 365px
   card, 16px overlay padding, 24px/31.2px bold-700 title + 16px/24px
   date (live-probed, session-12 origin commit), 18px/25.2px excerpt,
   full-width overlay — switches back to the desktop card at 640 (live
   featH @640 = 358). */
export default function BlogFeaturedArticle() {
  return (
    <div className="mb-[64px]">
      <div className="relative max-h-[360px] overflow-hidden rounded-2xl border-[0.8px] border-white max-sm:max-h-[370px]">
        <a
          className="relative block h-[358px] overflow-hidden rounded-[0.9375rem] max-sm:h-[365px]"
          href={blogInternalHref(BLOG_FEATURED.href)}
        >
          <div className="absolute left-0 top-0 size-full min-h-[358px] overflow-hidden rounded-[0.9375rem] max-sm:min-h-[365px]">
            <img
              alt={BLOG_FEATURED.alt}
              className="absolute bottom-0 left-0 right-0 top-0 block size-full max-w-full object-cover"
              src={BLOG_FEATURED.image}
            />
          </div>
          <div
            className="pointer-events-none absolute bottom-0 left-0 right-0 top-0 z-[1] rounded-[0.9375rem]"
            style={{
              backgroundImage:
                "linear-gradient(to right top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.45) 40%, rgba(0, 0, 0, 0) 70%)",
            }}
          />
          <div className="absolute bottom-0 left-0 z-[2] max-w-[60%] py-8 pr-10 pl-10 max-sm:max-w-full max-sm:p-4">
            <div className="mb-[8px] text-[18px] font-bold leading-[27px] text-[rgb(255,182,0)] max-sm:text-[16px] max-sm:leading-[24px]">
              {BLOG_FEATURED.date}
            </div>
            <h4 className="mb-[10px] text-[28px] font-black leading-[36.4px] max-sm:text-[24px] max-sm:font-bold max-sm:leading-[31.2px]">
              {BLOG_FEATURED.title}
            </h4>
            <div className="text-[20px] leading-[28px] text-[rgb(138,134,157)] max-sm:text-[18px] max-sm:leading-[25.2px]">
              <p
                className="overflow-hidden"
                style={{
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 2,
                }}
              >
                {BLOG_FEATURED.excerpt}
              </p>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}
