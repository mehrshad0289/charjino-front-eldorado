import HelpCenterShell from "./HelpCenterChrome";
import { HELP_COPY } from "./data/helpCenterData";
import { ChevronGlyph, PaperGlyph } from "./HelpCenterIcons";

function CollectionCard({ item }) {
  return (
    <div className="flex flex-col rounded-lg border-[0.8px] border-[rgba(26,26,26,0.15)] bg-white">
      <span className="mx-6 mt-6 flex h-6 w-6" aria-hidden="true">
        <img src={item.icon} alt="" className="size-6 object-contain" />
      </span>
      <div className="flex flex-col gap-1 px-6 pb-6 pt-4">
        <a href={`/support/collections/${item.slug}`} className="block text-[15px] font-semibold leading-[19.5px] text-[rgb(26,26,26)]">
          {item.title}
        </a>
        <p className="text-[13px] leading-[19.5px] text-[rgb(89,89,89)]">{item.summary}</p>
      </div>
    </div>
  );
}

export default function HelpCenterCollection({ collection, parent }) {
  const crumbs = [{ href: "/support", label: HELP_COPY.allCollections }];
  if (parent) crumbs.push({ href: `/support/collections/${parent.slug}`, label: parent.title });
  const children = collection.children || [];
  const articles = collection.articles || [];
  const count = children.length ? children.reduce((n, c) => n + (c.articles?.length || 0), 0) : articles.length;

  return (
    <HelpCenterShell>
      <article className="mx-auto w-full max-w-[830px] pb-16 pt-8">
        <header className="mb-8">
          <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-[14px] text-[rgb(89,89,89)]">
            {crumbs.map((c) => (
              <span key={c.href} className="flex items-center gap-2">
                <a href={c.href} className="hover:underline">
                  {c.label}
                </a>
                <span className="flex text-[rgb(89,89,89)]" aria-hidden="true">
                  <ChevronGlyph />
                </span>
              </span>
            ))}
            <span className="text-[rgb(26,26,26)]">{collection.title}</span>
          </nav>
          <h1 className="mb-3 text-[40px] font-semibold leading-[44.8px] text-[rgb(26,26,26)]">{collection.title}</h1>
          <p className="text-[18px] leading-[27.9px] text-[rgb(89,89,89)]">{collection.summary}</p>
          {count ? <div className="mt-3 text-[14px] text-[rgb(89,89,89)]">{HELP_COPY.articlesCount(count)}</div> : null}
        </header>

        {children.length > 0 ? (
          <section>
            <h2 className="mb-4 text-[22px] font-semibold leading-[28.6px]">{HELP_COPY.collections}</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {children.map((item) => (
                <CollectionCard key={item.slug} item={item} />
              ))}
            </div>
          </section>
        ) : null}

        {articles.length > 0 ? (
          <section>
            <div role="list">
              {articles.map((row) => (
                <div key={row.slug} role="listitem" className="border-b-[0.8px] border-[rgba(26,26,26,0.1)] last:border-b-0">
                  <a
                    href={row.href}
                    className="-mx-3 grid items-center gap-3 rounded-lg px-3 py-2"
                    style={{ gridTemplateColumns: "1fr 20px" }}
                  >
                    <span>
                      <span className="block text-[16px] font-semibold leading-[24.8px] text-[rgb(26,26,26)]">{row.title}</span>
                      {row.summary ? (
                        <span className="mt-0.5 block text-[14px] leading-[21.7px] text-[rgb(89,89,89)]">{row.summary}</span>
                      ) : null}
                    </span>
                    <span className="flex text-[#ffc950]" aria-hidden="true">
                      <PaperGlyph />
                    </span>
                  </a>
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </article>
    </HelpCenterShell>
  );
}

