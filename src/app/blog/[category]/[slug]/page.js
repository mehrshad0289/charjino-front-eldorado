import { notFound } from "next/navigation";
import BlogHeader from "../../../../components/eldorado/BlogHeader";
import BlogReadingProgress from "../../../../components/eldorado/BlogReadingProgress";
import BlogArticleToc from "../../../../components/eldorado/BlogArticleToc";
import BlogArticleFaq from "../../../../components/eldorado/BlogArticleFaq";
import BlogArticleShare from "../../../../components/eldorado/BlogArticleShare";
import BlogArticleRelated from "../../../../components/eldorado/BlogArticleRelated";
import Footer from "../../../../components/eldorado/Footer";
import ChatBubble from "../../../../components/eldorado/ChatBubble";
import {
  BLOG_ARTICLE_PAGES,
  BLOG_BG_ART,
} from "../../../../components/eldorado/data/blogArticlesData";

/* Blog article page (/blog/[category]/[slug]) — session 13, per the
   user-pushed article capture
   `ui ux/blog-single-page/www_eldorado_gg_blog_steal-an-egg_steal-an-egg-
   mutations-guide_1920w_390w_1536w_default.make` (decoded to
   snapshots/blog-article-1920px-1.tsx) + the LIVE article pages
   (live-blog-article*.png @390/768/1024/1536/1920 + DOM probes).
   Layout: fixed BlogHeader + reading-progress strip, fixed 800px hero art
   bg (single-hero-bg — live keeps it position:fixed behind the content;
   hidden on mobile where it renders 0x0), breadcrumb (Home > category >
   title, gray 14px chevrons; middle crumb collapses to "…" on mobile),
   then a 75%/25% split: left = h1 (interstate 800 uppercase 32px), meta
   row (32px avatar, purple underlined author, date, ~N min read), lede
   (white 18/36), content box (rounded-3xl, pt-24 pr-24 pb-64) with the
   real WordPress entry HTML (.entry CSS in globals.css), AI/social share
   block, FAQ accordion (only when the article has one) and Related
   Guides (BlogArticleCard grid); right = sticky Table of Contents with
   scroll-spy (li.current → yellow) + mobile floating button/bottom
   sheet. Footer without the language selector (blog footer variant),
   ChatBubble present (verified live, unlike /blog).
   Content: 11 real articles scraped from live eldorado.gg
   (scripts/extract_blog_articles_data.py → data/blogArticlesData.js).
   Known deviation: the live page infinite-scrolls the next articles
   below Related Guides — out of scope for a static clone, navigation is
   provided by the Related Guides grid instead. */

export function generateStaticParams() {
  return BLOG_ARTICLE_PAGES.map((a) => ({
    category: a.categorySlug,
    slug: a.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = BLOG_ARTICLE_PAGES.find((a) => a.slug === slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.ledeHtml
      ? article.ledeHtml.replace(/<[^>]+>/g, "").slice(0, 180)
      : undefined,
  };
}

/* Live eldorado.gg wraps every .entry table in a div.table-scroll
   (block, overflow-x: auto) so wide tables scroll instead of blowing out
   the viewport (verified live @390: wrapper 326px, overflow-x auto).
   Our entry HTML comes from the data file as raw strings, so the wrap is
   applied at render time with the same class name as live. */
function withTableScroll(html) {
  return html
    .replace(/<table(\s|>)/g, '<div class="table-scroll"><table$1')
    .replace(/<\/table>/g, "</table></div>");
}

function BreadChevron() {
  return (
    <span
      aria-hidden="true"
      className="ml-[8px] mr-[8px] inline-block h-[8.5px] w-[8.5px] rotate-45 border-r-[1.2px] border-t-[1.2px] border-[rgb(138,134,157)]"
    />
  );
}

export default async function BlogArticlePage({ params }) {
  const { category, slug } = await params;
  const article = BLOG_ARTICLE_PAGES.find(
    (a) => a.slug === slug && a.categorySlug === category
  );
  if (!article) notFound();

  return (
    <div className="blog-article-page min-h-screen bg-blogpage leading-[24px] text-white">
      <BlogHeader />
      <BlogReadingProgress />

      {/* fixed hero art bg (single-hero-bg) — behind the content */}
      <div
        aria-hidden="true"
        className="fixed left-0 right-0 top-20 bottom-0 z-0 hidden lg:block"
      >
        <img
          src={BLOG_BG_ART}
          alt=""
          className="absolute left-0 top-0 block h-[800px] w-full max-w-full object-cover"
        />
      </div>

      <main className="pt-[30px]">
        <section className="pb-[30px] pt-[60px] max-lg:pt-[178px]">
          <div className="relative z-[10] mx-auto w-full max-w-[1136px] px-6">
            {/* breadcrumb */}
            <div className="mb-[8px] pb-[60px]">
              <ul className="flex flex-wrap">
                <li className="flex items-center text-[14px] leading-[19.6px] text-[rgb(138,134,157)]">
                  <a href="/blog/" className="block">
                    Home
                  </a>
                  <BreadChevron />
                </li>
                <li className="flex items-center text-[14px] leading-[19.6px] text-[rgb(138,134,157)] max-sm:hidden">
                  <a href={article.url} className="block">
                    {article.category}
                  </a>
                  <BreadChevron />
                </li>
                <li className="flex items-center text-[14px] leading-[19.6px] sm:hidden">
                  …
                  <BreadChevron />
                </li>
                <li className="flex items-center text-[14px] leading-[19.6px]">
                  {article.title}
                </li>
              </ul>
            </div>

            <div className="flex flex-wrap items-start">
              {/* left column (75%) */}
              <div className="w-full lg:w-3/4 lg:pr-[7px]">
                <div className="mb-[32px]">
                  <h1
                    className="mb-[24px] text-[32px] font-extrabold uppercase leading-[38.4px]"
                    style={{ fontFamily: "interstate, Lato, sans-serif" }}
                  >
                    {article.title}
                  </h1>
                  <div className="mb-[4px] mt-[16px] flex flex-wrap items-center gap-[8px]">
                    {article.avatar && (
                      <img
                        alt={article.author}
                        src={article.avatar}
                        className="block h-8 w-8 shrink-0 rounded-[50%] object-cover"
                      />
                    )}
                    <span className="block font-semibold leading-[22.4px]">
                      <a
                        href={article.authorHref}
                        className="text-[rgb(152,126,251)] underline decoration-[rgb(152,126,251)]"
                      >
                        {article.author}
                      </a>
                    </span>
                    <span
                      aria-hidden="true"
                      className="block translate-y-[-1px] text-[22px] font-bold leading-[22.4px] text-[rgb(138,134,157)]"
                    >
                      ·
                    </span>
                    <span className="block leading-[22.4px] text-[rgb(138,134,157)]">
                      {article.date}
                    </span>
                    <span
                      aria-hidden="true"
                      className="block translate-y-[-1px] text-[22px] font-bold leading-[22.4px] text-[rgb(138,134,157)]"
                    >
                      ·
                    </span>
                    <span className="block leading-[22.4px] text-[rgb(138,134,157)]">
                      {article.read}
                    </span>
                  </div>
                </div>

                {article.ledeHtml && (
                  <section
                    className="blog-lede pt-[20px]"
                    dangerouslySetInnerHTML={{ __html: article.ledeHtml }}
                  />
                )}

                <div className="mb-[40px] rounded-3xl pb-16 pr-6 pt-6">
                  <div
                    className="entry"
                    dangerouslySetInnerHTML={{ __html: withTableScroll(article.entryHtml) }}
                  />
                  <BlogArticleShare url={article.url} title={article.title} />
                </div>

                <div className="lg:pr-[7px]">
                  <BlogArticleFaq items={article.faq} />
                  <BlogArticleRelated items={article.related} />
                </div>
              </div>

              {/* right column (25%) — sticky TOC (the box itself is hidden
                  below lg inside the component; mobile button/sheet are fixed) */}
              <div className="w-full lg:w-1/4 lg:pl-[21px]">
                <BlogArticleToc items={article.toc} />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer showLang={false} />
      <ChatBubble />
    </div>
  );
}
