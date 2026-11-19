import { BLOG_CTA } from "./data/blogData";

export default function BlogCtaBanner() {
  return (
    <section>
      <div className="relative z-[10] mx-auto w-full max-w-[1240px] ps-6 pe-6">
        <div className="mx-auto mb-[48px] flex max-w-[786px] flex-wrap items-center overflow-hidden rounded-[1.5625rem] border-[0.8px] border-white text-[rgb(25,25,25)]">
          <a className="block w-full" href="/">
            <img alt="شارژینو" className="block max-w-full" src={BLOG_CTA.image} />
          </a>
        </div>
      </div>
    </section>
  );
}
