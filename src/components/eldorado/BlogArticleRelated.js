import BlogArticleCard from "./BlogArticleCard";

/* "Related Guides" box at the end of blog article pages (article capture:
   interstate-900 uppercase 32px/1.28px-tracking heading `mb-[32px]` +
   `grid-cols-2 gap-[24px]` card grid). Cards are the exact "The Latest"
   card design (140px yellow-bordered thumb, purple category, 20px title,
   date | clock ~N min read) → reuse BlogArticleCard. Links prefer the
   internal /blog/[category]/[slug] page when the target is one of the 11
   cloned articles, else the real eldorado.gg URL (capture hrefs). */

export default function BlogArticleRelated({ items }) {
  if (!items || !items.length) return null;

  return (
    <div className="mb-[24px]">
      <div
        className="mb-[32px] text-[32px] font-black uppercase leading-[38.4px] tracking-[1.28px]"
        style={{ fontFamily: "interstate, Lato, sans-serif" }}
      >
        <h2 className="uppercase">Related Guides</h2>
      </div>
      <ul className="grid grid-cols-1 gap-[24px] sm:grid-cols-2">
        {items.map((r, i) => (
          <BlogArticleCard
            key={r.href + i}
            article={{
              href: r.internalHref && r.internalHref.startsWith("/blog/") ? r.internalHref : r.href,
              category: r.category,
              title: r.title,
              date: r.date,
              read: r.read,
              image: r.image,
            }}
          />
        ))}
      </ul>
    </div>
  );
}
