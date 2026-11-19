import BlogHeader from "../../components/eldorado/BlogHeader";
import BlogFeaturedArticle from "../../components/eldorado/BlogFeaturedArticle";
import BlogArticleCard from "../../components/eldorado/BlogArticleCard";
import BlogPagination from "../../components/eldorado/BlogPagination";
import BlogHighlights from "../../components/eldorado/BlogHighlights";
import BlogCtaBanner from "../../components/eldorado/BlogCtaBanner";
import Footer from "../../components/eldorado/Footer";
import JsonLd from "../../components/seo/json-ld";
import { loadBlogHub } from "../../lib/blog";
import { breadcrumbJsonLd, collectionPageJsonLd } from "../../lib/json-ld";
import { buildMetadata } from "@/lib/seo";

export const instant = false;

function pageNumber(searchParams) {
  const raw = Number(searchParams?.page);
  return Number.isFinite(raw) && raw > 1 ? Math.floor(raw) : 1;
}

function hubHref(page) {
  return page > 1 ? `/blog?page=${page}` : "/blog";
}

export async function generateMetadata({ searchParams }) {
  const page = pageNumber(await searchParams);
  const hub = await loadBlogHub(page, 10);
  const seo = hub.seo || {};
  return buildMetadata({
    title: seo.title || "بلاگ | شارژینو",
    description: seo.description || "آموزش خرید شارژ بازی و گیفت کارت در وبلاگ شارژینو.",
    path: hubHref(page),
    noIndex: Boolean(seo.noindex),
  });
}

export default async function BlogPage({ searchParams }) {
  const page = pageNumber(await searchParams);
  const hub = await loadBlogHub(page, 10);

  return (
    <div className="blog-lato min-h-screen bg-blogpage leading-[24px] text-white">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "خانه", path: "/" },
          { name: "بلاگ", path: "/blog" },
        ])}
      />
      <JsonLd data={collectionPageJsonLd({ name: "بلاگ شارژینو", description: hub.seo?.description, path: "/blog" })} />
      <BlogHeader
        games={hub.games}
        codes={hub.codes}
        allGames={hub.allGames}
        gamesLabel={hub.gamesLabel}
        codesLabel={hub.codesLabel}
        gamesAllHref={hub.gamesAllHref}
        codesAllHref={hub.codesAllHref}
      />
      <main className="pt-[30px]">
        <section className="pb-14 max-sm:pt-[147px] sm:pt-20 lg:pt-[90px]">
          <div className="relative z-[10] mx-auto w-full max-w-[1240px] ps-6 pe-6">
            <div className="rounded-3xl pb-10 pt-6 sm:ps-6 sm:pe-6">
              {hub.featured ? <BlogFeaturedArticle article={hub.featured} /> : null}
              <div className="blog-display mb-[32px] text-center text-[32px] font-black uppercase leading-[38.4px] tracking-[1.28px] max-sm:text-center sm:text-start">
                <h3 className="uppercase">تازه‌ها</h3>
              </div>
              {hub.latest.length > 0 ? (
                <ul className="grid grid-cols-1 gap-[24px] sm:grid-cols-2" style={{ alignItems: "start" }}>
                  {hub.latest.map((article) => (
                    <BlogArticleCard article={article} key={article.href} />
                  ))}
                </ul>
              ) : null}
              <BlogPagination current={hub.meta.page} last={hub.meta.totalPages} hrefFor={hubHref} />
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
