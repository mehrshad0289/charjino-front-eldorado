import BlogHeader from "../../components/eldorado/BlogHeader";
import BlogFeaturedArticle from "../../components/eldorado/BlogFeaturedArticle";
import BlogArticleCard from "../../components/eldorado/BlogArticleCard";
import BlogPagination from "../../components/eldorado/BlogPagination";
import BlogHighlights from "../../components/eldorado/BlogHighlights";
import BlogCtaBanner from "../../components/eldorado/BlogCtaBanner";
import BlogFooter from "../../components/eldorado/BlogFooter";
import { BLOG_ARTICLES } from "../../components/eldorado/data/blogData";

/* Blog landing page (/blog) — session 12 + 12c merge, implementing the
   user-pushed blog .make capture (native Figma file; decoded via
   scripts/decode_blog_capture.py → snapshots/blog-1920px-light-1.tsx).
   The capture is 1920-only: responsive behavior follows the live page
   (live-blog-*.png + DOM/pixel probes scripts/probe_blog_*.js):
   - root font: Lato via the layout.js <html> variable (session-12 font
     fix on origin) — no per-page override needed
   - header: FIXED at every width with the 2-row mobile layout (row 1
     70px + hairline, centered 20px Games/Codes row 76px + hairline =
     149px total, pixel-measured on live-blog-390.png). The featured card
     clears it via section padding: <640 pt-[147px] → card top ≈201px
     like live; 640-1023 pt-20 → ≈135px like live @640; lg pt-[90px]
     → ≈145px like live @1024
   - article grid 1→2 cols @640, highlights 2→4 cols @768
   - "The Latest" heading is centered <640, left-aligned ≥640 (live)
   - highlights + footer containers use px-4 <768 while the article/CTA
     containers keep px-6 (live: hlGrid 358px vs cardsUl 342px @390)
   - footer: the blog variant (BlogFooter) — the blog capture footer is
     NOT the marketplace footer: title-case 16px links, 1240px container,
     no language selector, mobile hides the last 3 payment icons (live
     + capture verified). The shared Footer keeps its showLang prop
     (session-12 origin commit) for marketplace pages.
   - No ChatBubble on /blog (verified live). */

export const metadata = {
  title: "Gaming Blog - News, Guides & Updates - Eldorado",
  description:
    "The Eldorado blog: community guides, redeem codes, tutorials and reviews, and timely news and updates for MMO, accounts, currencies and trading.",
};

export default function BlogPage() {
  return (
    <div className="blog-lato min-h-screen bg-blogpage leading-[24px] text-white">
      {/* blog-lato: live /blog renders Google Lato (fonts.gstatic v25), not
          the marketplace's self-hosted Lato cut — see globals.css note */}
      <BlogHeader />
      <main className="pt-[30px]">
        <section className="pb-14 max-sm:pt-[147px] sm:pt-20 lg:pt-[90px]">
          <div className="relative z-[10] mx-auto w-full max-w-[1240px] pl-6 pr-6">
            <div className="rounded-3xl pb-10 pt-6 sm:pl-6 sm:pr-6">
              <BlogFeaturedArticle />
              <div
                className="mb-[32px] text-center text-[32px] font-black uppercase leading-[38.4px] tracking-[1.28px] max-sm:text-center sm:text-start"
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
      <BlogFooter />
    </div>
  );
}
