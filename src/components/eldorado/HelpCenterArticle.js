import HelpCenterShell from "./HelpCenterChrome";
import { getCollection, HELP_COPY } from "./data/helpCenterData";
import { ChevronGlyph } from "./HelpCenterIcons";

function Blocks({ body }) {
  return (body || []).map((block, i) => {
    if (block.type === "h2") {
      return (
        <h2 key={i} className="mb-3 mt-8 text-[22px] font-semibold leading-[27.5px]">
          {block.text}
        </h2>
      );
    }
    if (block.type === "ol") {
      return (
        <ol key={i} className="mb-4 list-decimal space-y-2 pl-6">
          {block.items.map((item) => (
            <li key={item} className="text-[15px] leading-[23.25px]">
              {item}
            </li>
          ))}
        </ol>
      );
    }
    if (block.type === "ul") {
      return (
        <ul key={i} className="mb-4 list-disc space-y-2 pl-6">
          {block.items.map((item) => (
            <li key={item} className="text-[15px] leading-[23.25px]">
              {item}
            </li>
          ))}
        </ul>
      );
    }
    return (
      <p key={i} className="mb-4 text-[15px] leading-[23.25px]">
        {block.text}
      </p>
    );
  });
}

export default function HelpCenterArticle({ article }) {
  const col = article.collection ? getCollection(article.collection) : null;

  return (
    <HelpCenterShell activeSlug={article.slug}>
      <article className="mx-auto w-full max-w-[830px] pb-16 pt-8">
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-[14px] text-[rgb(89,89,89)]">
          <a href="/support" className="hover:underline">
            {HELP_COPY.allCollections}
          </a>
          <span className="flex" aria-hidden="true">
            <ChevronGlyph />
          </span>
          {col ? (
            <>
              <a href={`/support/collections/${col.slug}`} className="hover:underline">
                {col.title}
              </a>
              <span className="flex" aria-hidden="true">
                <ChevronGlyph />
              </span>
            </>
          ) : null}
          <span className="text-[rgb(26,26,26)]">{article.title}</span>
        </nav>
        <header className="mb-8 border-b-[0.8px] border-[rgba(26,26,26,0.15)] pb-8">
          <h1 className="mb-3 text-[36px] font-semibold leading-[40.32px]">{article.title}</h1>
          {article.description ? <p className="mb-6 text-[18px] leading-[27.9px] text-[rgb(89,89,89)]">{article.description}</p> : null}
          {article.updated ? <time className="text-[13px] leading-[18.2px] text-[rgb(89,89,89)]">{article.updated}</time> : null}
        </header>
        <div>
          <Blocks body={article.body} />
        </div>
      </article>
    </HelpCenterShell>
  );
}
