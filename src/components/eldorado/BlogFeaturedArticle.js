import { BLOG_FEATURED } from "./data/blogData";

/* Featured article card (blog capture @1920): 358px image card with a
   bottom-left overlay — yellow date, 28px black title, gray excerpt — over
   a "to right top" black gradient. max-h-360 frame with a white hairline
   border. Mobile keeps the same overlay structure (live @390) with a 24px
   title. */
export default function BlogFeaturedArticle() {
  return (
    <div className="mb-[64px]">
      <div className="relative max-h-[360px] overflow-hidden rounded-2xl border-[0.8px] border-white">
        <a
          className="relative block h-[358px] overflow-hidden rounded-[0.9375rem]"
          href={BLOG_FEATURED.href}
        >
          <div className="absolute left-0 top-0 size-full min-h-[358px] overflow-hidden rounded-[0.9375rem]">
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
          <div className="absolute bottom-0 left-0 z-[2] max-w-[60%] p-8 pr-10 max-md:max-w-full max-md:p-5 max-md:pr-6">
            <div className="mb-[8px] text-[18px] font-bold leading-[27px] text-[rgb(255,182,0)]">
              {BLOG_FEATURED.date}
            </div>
            <h4 className="mb-[10px] text-[28px] font-black leading-[36.4px] max-md:text-[24px]">
              {BLOG_FEATURED.title}
            </h4>
            <div className="flow-root overflow-hidden text-[20px] leading-[28px] text-[rgb(138,134,157)] max-md:text-[16px] max-md:leading-[24px]">
              <p className="flow-root overflow-hidden">{BLOG_FEATURED.excerpt}</p>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}
