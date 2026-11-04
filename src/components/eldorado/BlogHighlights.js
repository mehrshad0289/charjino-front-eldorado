import { BLOG_HIGHLIGHTS, BLOG_HIGHLIGHTS_TITLE } from "./data/blogData";

/* "Play Smart. Skip the Grind." strip (blog capture @1920): centered
   interstate-black uppercase h3, then a 4-col grid (2 cols on mobile per
   live @390, switch at 768 per live probe) of centered items — 60px
   rounded-xl colored tile with a 33px icon, 24px bold title, gray 18px
   copy. */
export default function BlogHighlights() {
  return (
    <section className="pb-16 max-md:pb-10">
      <div className="relative z-[10] mx-auto w-full max-w-[1240px] pl-6 pr-6">
        <div className="mb-[48px] text-center">
          <h3
            className="text-center text-[32px] font-black uppercase leading-[48px] tracking-[1.28px]"
            style={{ fontFamily: "interstate, Lato, sans-serif" }}
          >
            {BLOG_HIGHLIGHTS_TITLE}
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-[24px] md:grid-cols-4">
          {BLOG_HIGHLIGHTS.map((item) => (
            <div className="text-center" key={item.title}>
              <div
                className="mb-[16px] inline-flex h-[60px] w-[60px] items-center justify-center rounded-xl text-center"
                style={{ backgroundColor: item.bg }}
              >
                <div className="h-[33px] w-[33px] overflow-hidden text-center">
                  <img alt="" className="block size-full" src={item.icon} />
                </div>
              </div>
              <h4 className="mb-[20px] mt-[5px] text-center text-[24px] font-bold leading-[31.2px]">
                {item.title}
              </h4>
              <p className="text-center text-[18px] leading-[27px] text-[rgb(138,134,157)]">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
