import HelpCenterShell from "./HelpCenterChrome";
import { HELP_COPY, HELP_HOME_COLLECTIONS, HELP_IMG, HELP_MOST_VIEWED } from "./data/helpCenterData";
import { PaperGlyph, SearchGlyph } from "./HelpCenterIcons";

function CollectionCard({ item }) {
  return (
    <div
      className="flex flex-col rounded-lg border-[0.8px] border-[rgba(26,26,26,0.15)] bg-white"
      data-testid="docs-home-collection-card"
    >
      <span className="mx-6 mt-6 flex h-6 w-6" aria-hidden="true">
        <img src={item.icon} alt="" className="size-6 object-contain" />
      </span>
      <div className="flex flex-col gap-1 px-6 pb-6 pt-4">
        <a href={item.href} className="block text-[15px] font-semibold leading-[19.5px] text-[rgb(26,26,26)]">
          {item.title}
        </a>
        <p className="text-[13px] leading-[19.5px] text-[rgb(89,89,89)]">{item.summary}</p>
      </div>
    </div>
  );
}

export default function HelpCenterHome() {
  const hero = (
    <header
      className="flex min-h-[245px] items-end justify-center bg-black bg-cover bg-center px-8 py-16 text-center"
      style={{ backgroundImage: `url("${HELP_IMG.hero}")` }}
      data-testid="docs-home-hero"
    >
      <div className="flex w-[760px] max-w-full flex-col items-center">
        <h1 className="max-w-[696px] text-[60px] font-medium leading-[67.2px] text-white">{HELP_COPY.howCanWeHelp}</h1>
        <a
          href="/support"
          aria-label="Search docs (Ctrl K)"
          className="mt-12 flex h-[49px] w-[640px] max-w-full items-center gap-3 rounded-lg border-[0.8px] border-[rgba(26,26,26,0.15)] bg-white px-4 py-3 text-left text-[15px] leading-[23.25px] text-[rgb(89,89,89)] shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
        >
          <span className="flex text-[rgb(89,89,89)]" aria-hidden="true">
            <SearchGlyph />
          </span>
          <span className="grow">{HELP_COPY.searchArticles}</span>
          <kbd className="text-[12px] leading-3 text-[rgb(89,89,89)]" style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>
            Ctrl K
          </kbd>
        </a>
      </div>
    </header>
  );

  return (
    <HelpCenterShell hero={hero}>
      <main id="docs-main" className="mx-auto flex min-h-full w-full max-w-[830px] flex-col pb-16 pt-8">
        <div className="flex flex-col gap-12">
          <section>
            <h2 className="mb-4 text-[22px] font-semibold leading-[28.6px] text-[rgb(26,26,26)]">{HELP_COPY.mostViewed}</h2>
            <div role="list">
              {HELP_MOST_VIEWED.map((row) => (
                <div key={row.slug} role="listitem" className="border-b-[0.8px] border-[rgba(26,26,26,0.1)] last:border-b-0">
                  <a
                    href={row.href}
                    className="-mx-3 grid items-center gap-3 rounded-lg px-3 py-2"
                    style={{ gridTemplateColumns: "1fr 20px" }}
                  >
                    <span className="text-[14px] font-semibold leading-[21.7px] text-[rgb(26,26,26)]">{row.title}</span>
                    <span className="flex text-[#ffc950]" aria-hidden="true">
                      <PaperGlyph />
                    </span>
                  </a>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-[22px] font-semibold leading-[28.6px] text-[rgb(26,26,26)]">{HELP_COPY.collections}</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3" role="list">
              {HELP_HOME_COLLECTIONS.map((item) => (
                <div key={item.slug} role="listitem">
                  <CollectionCard item={item} />
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border-[0.8px] border-[rgba(26,26,26,0.15)] bg-black p-6 text-center text-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <h2 className="mb-4 text-[22px] font-semibold leading-[28.6px]">{HELP_COPY.stillNeed}</h2>
            <div className="text-[15px] leading-[23.25px]">{HELP_COPY.stillDesc}</div>
            <a
              href="/contact-us"
              className="mt-6 inline-flex rounded-[6px] bg-[rgb(255,201,80)] px-4 py-2 text-[15px] font-semibold leading-[23.25px] text-black"
            >
              {HELP_COPY.contact}
            </a>
          </section>
        </div>
      </main>
    </HelpCenterShell>
  );
}
