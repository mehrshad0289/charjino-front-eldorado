import { notFound } from "next/navigation";
import BlogHeader from "../../../components/eldorado/BlogHeader";
import BlogFeaturedArticle from "../../../components/eldorado/BlogFeaturedArticle";
import BlogCategoryGrid from "../../../components/eldorado/BlogCategoryGrid";
import BlogFooter from "../../../components/eldorado/BlogFooter";
import { BLOG_CATEGORIES } from "../../../components/eldorado/data/blogCategoriesData";

/* Blog category archive page (/blog/[category]) — session 15. There is NO
   .make capture for the category pages (the blog capture is the 1920
   landing only); per project convention the LIVE site is the reference and
   every metric below was DOM-probed on eldorado.gg/blog/steal-an-egg/ at
   1920 + 390 (scripts/probe_category_*.js + scrape_category_pages.js):
   - container 1240px: px-4 <640 (breadcrumb x16), px-6 ≥640 (x364)
   - breadcrumb ul y=144 @1920 (main pt-30 + section pt-90 + mt-6), y=154
     @390 (pt-108 <1024 like the article page + mt-4); "Home" links to
     /blog/, current category crumb is plain text — 14px/19.6 gray
     rgb(138,134,157) with the same 28px chevron box as the article page
   - H1 .games-cat-title: interstate 900 uppercase 32px/35.2 (24px/26.4
     <640), py-10px (rect h 55/46), white, mt-4
   - featured banner = the category's newest article (live
     .archive-featured-item): same anatomy as the landing featured card —
     reused BlogFeaturedArticle with the `article` prop; mt-8 (24 <640),
     mb-0 (the grid wrapper owns the spacing)
   - rows grid: 2×560 gap-24 (1 col <640), wrapper px-6 lg:px-12 (row x=388
     @1920 = 340+48, x=24 @390); mt-[88px] (mt-[154px] <640 — live
     .archive-box spacing incl. the reserved mobile band above the list)
   - rows 9+ hidden (live inline display:none) behind the yellow Load more
     button (BlogCategoryGrid, +8 per click, disappears when exhausted —
     live-verified behavior)
   - footer: the blog footer variant (identical to /blog — live verified:
     payment icons row + wordmark + tagline + socials + 3 link columns +
     legal row, no language selector)
   Data: scraped live 2026-11-04 into data/blogCategoriesData.js (6
   categories, 71 rows); row hrefs rewrite to the internal article routes
   via blogInternalHref exactly like the landing page. */

export function generateStaticParams() {
  return BLOG_CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }) {
  const { category } = await params;
  const cat = BLOG_CATEGORIES.find((c) => c.slug === category);
  if (!cat) return {};
  return {
    title: `${cat.name} Archives - Eldorado Blog`,
    description: `The latest ${cat.name} articles from the Eldorado blog: guides, updates and reviews.`,
  };
}

function BreadChevron() {
  /* same 28px chevron box as the article breadcrumb (verified there vs
     live: 8.5px glyph + 10 + 9.5 margins) */
  return (
    <span
      aria-hidden="true"
      className="ml-[10px] mr-[9.5px] inline-block h-[8.5px] w-[8.5px] rotate-45 border-r-[1.2px] border-t-[1.2px] border-[rgb(138,134,157)]"
    />
  );
}

export default async function BlogCategoryPage({ params }) {
  const { category } = await params;
  const cat = BLOG_CATEGORIES.find((c) => c.slug === category);
  if (!cat) notFound();

  return (
    <div className="blog-lato min-h-screen bg-blogpage leading-[24px] text-white">
      <BlogHeader />
      <main className="pt-[30px]">
        <section className="pb-14 max-sm:pt-[108px] sm:pt-20 lg:pt-[90px]">
          <div className="relative z-[10] mx-auto w-full max-w-[1240px] px-4 sm:px-6">
            {/* breadcrumb: live <ul><li><a>Home</a></li><li>{category}</li></ul> */}
            <nav className="mt-4 sm:mt-6" aria-label="Breadcrumb">
              <ul className="flex flex-wrap items-center">
                <li className="flex items-center text-[14px] leading-[19.6px] text-[rgb(138,134,157)]">
                  <a href="/blog/">Home</a>
                  <BreadChevron />
                </li>
                <li className="flex items-center text-[14px] leading-[19.6px] text-[rgb(138,134,157)]">
                  {cat.name}
                </li>
              </ul>
            </nav>
            <h1
              className="mt-4 py-[10px] text-[32px] font-black uppercase leading-[35.2px] max-sm:text-[24px] max-sm:leading-[26.4px]"
              style={{ fontFamily: "interstate, Lato, sans-serif" }}
            >
              {cat.name}
            </h1>
            <BlogFeaturedArticle
              article={cat.featured}
              className="mt-8 max-sm:mt-6"
            />
          </div>
          <div className="relative z-[10] mx-auto mt-[88px] w-full max-w-[1240px] px-6 max-sm:mt-[154px] lg:px-12">
            <BlogCategoryGrid rows={cat.rows} />
          </div>
        </section>
      </main>
      <BlogFooter />
    </div>
  );
}
