import { notFound } from "next/navigation";
import Link from "next/link";
import BlogHeader from "../../../../components/eldorado/BlogHeader";
import BlogReadingProgress from "../../../../components/eldorado/BlogReadingProgress";
import BlogArticleToc from "../../../../components/eldorado/BlogArticleToc";
import BlogArticleFaq from "../../../../components/eldorado/BlogArticleFaq";
import BlogArticleShare from "../../../../components/eldorado/BlogArticleShare";
import BlogArticleRelated from "../../../../components/eldorado/BlogArticleRelated";
import Footer from "../../../../components/eldorado/Footer";
import ChatBubble from "../../../../components/eldorado/ChatBubble";
import { BlogBreadChevron } from "../../../../components/eldorado/BlogBreadcrumb";
import JsonLd from "../../../../components/seo/json-ld";
import { BLOG_BG_ART } from "../../../../components/eldorado/data/blogArticlesData";
import {
  blogCategoryPath,
  blogPostPath,
  formatBlogDate,
  formatReadingMinutes,
  loadBlogNav,
  loadBlogPost,
  mapBlogFaq,
  mapBlogToc,
  wrapTableScroll,
} from "../../../../lib/blog";
import {
  blogPostJsonLd,
  breadcrumbJsonLd,
  faqPageJsonLd,
} from "../../../../lib/json-ld";
import { mediaUrl } from "../../../../lib/store-engine";
import { absoluteUrl } from "../../../../lib/site";
import { buildMetadata } from "@/lib/seo";

export const instant = false;

export async function generateMetadata({ params }) {
  const { category, slug } = await params;
  const data = await loadBlogPost(slug);
  const post = data?.post;
  if (!post || post.category?.slug !== category) return {};
  const path = blogPostPath(post.category.slug, post.slug);
  const image = post.ogImage || post.cover;
  return buildMetadata({
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt || post.title,
    path,
    image: image ? mediaUrl(image) : undefined,
    noIndex: Boolean(post.noindex),
  });
}

export default async function BlogArticlePage({ params }) {
  const { category, slug } = await params;
  const [nav, data] = await Promise.all([loadBlogNav(), loadBlogPost(slug)]);
  const post = data?.post;
  if (!post || post.category?.slug !== category) notFound();

  const path = blogPostPath(post.category.slug, post.slug);
  const shareUrl = absoluteUrl(path);
  const authorName = post.author?.name || "شارژینو";
  const authorHref = post.author?.url || "/about-us";
  const date = formatBlogDate(post.publishedAt);
  const read = formatReadingMinutes(post.readingMinutes);
  const toc = mapBlogToc(post.toc);
  const faq = mapBlogFaq(post.faq);
  const excerpt = typeof post.excerpt === "string" ? post.excerpt.trim() : "";
  const content = wrapTableScroll(
    typeof post.content === "string" ? post.content : "",
  );
  const cover = mediaUrl(post.ogImage || post.cover);

  return (
    <div className="blog-article-page min-h-screen bg-blogpage leading-[24px] text-white">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "خانه", path: "/blog" },
          {
            name: post.category.title,
            path: blogCategoryPath(post.category.slug),
          },
          { name: post.title, path },
        ])}
      />
      <JsonLd
        data={blogPostJsonLd({
          title: post.title,
          description: post.excerpt,
          path,
          image: cover,
          datePublished: post.publishedAt,
          dateModified: post.updatedAt,
          authorName,
        })}
      />
      {faq.length ? <JsonLd data={faqPageJsonLd(faq)} /> : null}
      <BlogHeader
        games={nav.games}
        codes={nav.codes}
        allGames={nav.allGames}
        gamesAllHref={nav.gamesAllHref}
        codesAllHref={nav.codesAllHref}
      />
      <BlogReadingProgress />

      <div
        aria-hidden="true"
        className="fixed inset-x-0 top-20 bottom-0 z-0 hidden lg:block"
      >
        {/* desktop */}
        <img
          src="/blog/bg-single.png"
          alt=""
          className="absolute inset-x-0 top-0 block h-[800px] w-full max-w-full object-cover"
        />
        {/* mobile */}
      </div>

      <main className="pt-[30px]">
        <section className="pb-[30px] pt-[60px] max-lg:pt-[147px]">
          <div className="relative z-[10] mx-auto w-full max-w-[1136px] px-4 sm:px-6">
            <div className="mb-[8px] pb-[60px] max-lg:pt-6">
              <ul className="flex flex-wrap max-sm:block max-sm:leading-[24px]">
                <li className="flex items-center text-[14px] leading-[19.6px] text-[rgb(138,134,157)] max-sm:inline">
                  <Link href="/blog" className="block max-sm:inline">
                    خانه
                  </Link>
                  <BlogBreadChevron />
                </li>
                <li className="flex items-center text-[14px] leading-[19.6px] text-[rgb(138,134,157)] max-sm:hidden">
                  <a
                    href={blogCategoryPath(post.category.slug)}
                    className="block max-sm:inline"
                    dir="auto"
                  >
                    {post.category.title}
                  </a>
                  <BlogBreadChevron />
                </li>
                <li className="flex items-center text-[14px] leading-[19.6px] max-sm:inline sm:hidden">
                  …
                  <BlogBreadChevron />
                </li>
                <li
                  className="flex items-center text-[14px] leading-[19.6px] max-sm:inline"
                  dir="auto"
                >
                  {post.title}
                </li>
              </ul>
            </div>

            <div className="flex flex-wrap">
              <div className="w-full lg:w-3/4 lg:pe-[7px]">
                <div className="mb-[32px]">
                  <h1
                    className="blog-display mb-[24px] text-[32px] font-extrabold uppercase leading-[38.4px]"
                    dir="auto"
                  >
                    {post.title}
                  </h1>
                  <div className="mb-[4px] mt-[16px] flex flex-wrap items-center gap-[8px]">
                    <span className="block font-semibold leading-[22.4px]">
                      <a
                        href={authorHref}
                        className="text-[rgb(152,126,251)] underline decoration-[rgb(152,126,251)]"
                      >
                        {authorName}
                      </a>
                    </span>
                    {date ? (
                      <>
                        <span
                          aria-hidden="true"
                          className="block translate-y-[-1px] text-[22px] font-bold leading-[22.4px] text-[rgb(138,134,157)]"
                        >
                          ·
                        </span>
                        <span className="block leading-[22.4px] text-[rgb(138,134,157)]">
                          {date}
                        </span>
                      </>
                    ) : null}
                    {read ? (
                      <>
                        <span
                          aria-hidden="true"
                          className="block translate-y-[-1px] text-[22px] font-bold leading-[22.4px] text-[rgb(138,134,157)]"
                        >
                          ·
                        </span>
                        <span className="block leading-[22.4px] text-[rgb(138,134,157)]">
                          {read}
                        </span>
                      </>
                    ) : null}
                  </div>
                </div>

                {excerpt ? (
                  <section className="blog-lede pt-[20px]">
                    <p>{excerpt}</p>
                  </section>
                ) : null}

                <div className="mb-[40px] rounded-3xl pb-16 pe-6 pt-6 max-sm:px-4 max-sm:pb-10 max-sm:pt-4">
                  {content ? (
                    <div
                      className="entry"
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                  ) : null}
                  <BlogArticleShare url={shareUrl} title={post.title} />
                </div>

                <div className="lg:pe-[7px]">
                  <BlogArticleFaq items={faq} />
                  <BlogArticleRelated items={data.related || []} />
                </div>
              </div>

              <div className="w-full lg:w-1/4 lg:ps-[21px]">
                <BlogArticleToc items={toc} />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <ChatBubble />
    </div>
  );
}
