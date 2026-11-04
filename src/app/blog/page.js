import BlogHeader from "../../components/eldorado/BlogHeader";
import BlogFeaturedArticle from "../../components/eldorado/BlogFeaturedArticle";
import BlogArticleCard from "../../components/eldorado/BlogArticleCard";
import BlogPagination from "../../components/eldorado/BlogPagination";
import BlogHighlights from "../../components/eldorado/BlogHighlights";
import BlogCtaBanner from "../../components/eldorado/BlogCtaBanner";
import Footer from "../../components/eldorado/Footer";
import { BLOG_ARTICLES } from "../../components/eldorado/data/blogData";

/* Blog landing page (/blog) — session 12, implementing the user-pushed
   blog .make capture (native Figma file; decoded via
   scripts/decode_blog_capture.py → snapshots/blog-1920px-light-1.tsx).
   The capture is 1920-only: responsive behavior (article grid 1→2 cols
   @640, highlights 2→4 cols @768, header mobile→desktop @1024, inner
   padding @640) follows the live page (live-blog-*.png + DOM probes).
   No ChatBubble on /blog (verified live). The footer is the shared
   Footer component (matches the capture footer verbatim). */

export const metadata = {
  title: "Gaming Blog - News, Guides & Updates - Eldorado",
  description:
    "The Eldorado blog: community guides, redeem codes, tutorials and reviews, and timely news and updates for MMO, accounts, currencies and trading.",
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-blogpage leading-[24px] text-white">
      <BlogHeader />
      <main className="pt-[30px]">
        <section className="pb-14 pt-[90px] max-md:pt-20">
          <div className="relative z-[10] mx-auto w-full max-w-[1240px] pl-6 pr-6">
            <div className="rounded-3xl pb-10 pt-6 sm:pl-6 sm:pr-6">
              <BlogFeaturedArticle />
              <div
                className="mb-[32px] text-[32px] font-black uppercase leading-[38.4px] tracking-[1.28px]"
                style={{ fontFamily: "interstate, Lato, sans-serif" }}
              >
                <h3 className="uppercase">The Latest</h3>
              </div>
              <ul
                className="grid grid-cols-1 gap-[24px] sm:grid-cols-2"
                style={{ alignItems: "start" }}
              >
                {BLOG_ARTICLES.map((article) => (
                  <BlogArticleCard article={article} key={article.href} />
                ))}
              </ul>
              <BlogPagination />
            </div>
          </div>
        </section>
        <BlogHighlights />
        <BlogCtaBanner />
      </main>
      <Footer />
    </div>
  );
}
