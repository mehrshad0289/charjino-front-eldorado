import BlogArticleCard from "./BlogArticleCard";

export default function BlogArticleRelated({ items }) {
  if (!items || !items.length) return null;

  return (
    <div className="mb-[24px]">
      <div className="blog-display mb-[32px] text-[32px] font-black uppercase leading-[38.4px] tracking-[1.28px]">
        <h2 className="uppercase">موضوعات مرتبط</h2>
      </div>
      <ul className="grid grid-cols-1 gap-[24px] sm:grid-cols-2">
        {items.map((article, i) => (
          <BlogArticleCard key={(article.href || "") + i} article={article} />
        ))}
      </ul>
    </div>
  );
}
