import { BLOG_CTA } from "./data/blogData";

/* Halloween CTA banner (blog capture): single image in a centered 786px
   white-hairline rounded frame, linking to the marketplace. */
export default function BlogCtaBanner() {
  return (
    <section>
      <div className="relative z-[10] mx-auto w-full max-w-[1240px] pl-6 pr-6">
        <div className="mx-auto mb-[48px] flex max-w-[786px] flex-wrap items-center overflow-hidden rounded-[1.5625rem] border-[0.8px] border-white text-[rgb(25,25,25)]">
          <a className="block w-full" href={BLOG_CTA.href}>
            <img alt={BLOG_CTA.alt} className="block max-w-full" src={BLOG_CTA.image} />
          </a>
        </div>
      </div>
    </section>
  );
}
