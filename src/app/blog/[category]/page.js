import { notFound } from "next/navigation";
import Link from "next/link";
import BlogHeader from "../../../components/eldorado/BlogHeader";
import BlogFeaturedArticle from "../../../components/eldorado/BlogFeaturedArticle";
import BlogCategoryGrid from "../../../components/eldorado/BlogCategoryGrid";
import Footer from "../../../components/eldorado/Footer";
import { BlogBreadChevron } from "../../../components/eldorado/BlogBreadcrumb";
import JsonLd from "../../../components/seo/json-ld";
import { blogCategoryPath, loadBlogCategory, loadBlogNav } from "../../../lib/blog";
import { breadcrumbJsonLd, collectionPageJsonLd } from "../../../lib/json-ld";
import { buildMetadata } from "@/lib/seo";

export const instant = false;

export async function generateMetadata({ params }) {
  const { category } = await params;
  const banner = await loadBlogCategory(category, 0, 1);
  if (!banner || !banner.category) return {};
  const seo = banner.seo || {};
  const title = seo.title || `${banner.category.title} | بلاگ شارژینو`;
  return buildMetadata({
    title,
    description: seo.description || banner.category.description || `مطالب ${banner.category.title} در بلاگ شارژینو.`,
    path: blogCategoryPath(banner.category.slug),
    noIndex: Boolean(seo.noindex || banner.category.noindex),
  });
}

export default async function BlogCategoryPage({ params }) {
  const { category } = await params;
  const [nav, banner, rows] = await Promise.all([
    loadBlogNav(),
    loadBlogCategory(category, 0, 1),
    loadBlogCategory(category, 1, 8),
  ]);
  if (!banner || !banner.category) notFound();

  const featuredCard = banner.items[0] || null;
  const title = banner.category.title;
  const path = blogCategoryPath(banner.category.slug);
  const rowItems = rows?.items || [];
  const total = banner.meta.total || rows?.meta.total || 0;

  return (
    <div className="blog-lato min-h-screen bg-blogpage leading-[24px] text-white">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "خانه", path: "/blog" },
          { name: title, path },
        ])}
      />
      <JsonLd
        data={collectionPageJsonLd({
          name: title,
          description: banner.seo?.description || banner.category.description,
          path,
        })}
      />
      <BlogHeader
        games={nav.games}
        codes={nav.codes}
        allGames={nav.allGames}
        gamesAllHref={nav.gamesAllHref}
        codesAllHref={nav.codesAllHref}
      />
      <main className="pt-[30px]">
        <section className="pb-14 max-sm:pt-[147px] sm:pt-20 lg:pt-[90px]">
          <div className="relative z-[10] mx-auto w-full max-w-[1240px] px-4 sm:px-6">
            <nav className="mt-4 sm:mt-6" aria-label="نان‌ریزه">
              <ul className="flex flex-wrap items-center">
                <li className="flex items-center text-[14px] leading-[19.6px] text-[rgb(138,134,157)]">
                  <Link href="/blog">خانه</Link>
                  <BlogBreadChevron />
                </li>
                <li className="flex items-center text-[14px] leading-[19.6px] text-[rgb(138,134,157)]" dir="auto">
                  {title}
                </li>
              </ul>
            </nav>
            <h1
              className="blog-display mt-4 py-[10px] text-[32px] font-black uppercase leading-[35.2px] max-sm:text-[24px] max-sm:leading-[26.4px]"
              dir="auto"
            >
              {title}
            </h1>
            {featuredCard ? <BlogFeaturedArticle article={featuredCard} className="mt-8 max-sm:mt-6" /> : null}
          </div>
          <div className="relative z-[10] mx-auto mt-[88px] w-full max-w-[1240px] px-6 max-sm:mt-[154px] lg:px-12">
            <BlogCategoryGrid
              categorySlug={banner.category.slug}
              initialRows={rowItems}
              initialOffset={1 + rowItems.length}
              total={total}
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
