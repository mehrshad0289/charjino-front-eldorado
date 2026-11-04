import HeaderBar from "../../components/eldorado/HeaderBar";
import Footer from "../../components/eldorado/Footer";
import { BLOG_ARTICLE_PAGES } from "../../components/eldorado/data/blogArticlesData";
import { BLOG_CATEGORIES } from "../../components/eldorado/data/blogCategoriesData";
import { PRODUCT_ID } from "../../components/eldorado/data/productData";

/* Utility index page (/pagelist) — session 14, user request: one page
   linking to every implemented page. No capture exists for it, so it
   reuses the site frame (HeaderBar + Footer) and design tokens
   (--color-page bg, white hairline cards, brand-yellow accents). Group
   rows are plain <a> links; blog rows come from BLOG_ARTICLE_PAGES so
   the list never drifts from the data file. Session 15: + 6 category
   archive rows from BLOG_CATEGORIES. Session 15b: + CustomItem offers.
   Session 16: + dashboard Currency / Top Up / Purchased / Sold / Loyalty
   rows (5 new routes). */

export const metadata = {
  title: "Page List - Eldorado",
  description:
    "Index of every implemented page in the Eldorado clone: main pages, shop, blog guides, company pages and account.",
};

const PRODUCT_HREF = `/efootball-accounts/oa/${PRODUCT_ID}`;

const GROUPS = [
  {
    label: "Main",
    rows: [
      { title: "Home", href: "/" },
      { title: "Influencer Program", href: "/influencer-program" },
    ],
  },
  {
    label: "Shop",
    rows: [
      { title: "eFootball Accounts (shop template)", href: "/efootball-accounts" },
      { title: "Xbox Game Pass", href: "/xbox-game-pass" },
      { title: "Xbox Gift Card", href: "/xbox-gift-card" },
      { title: "Product single (eFootball offer)", href: PRODUCT_HREF },
    ],
  },
  {
    label: "Blog",
    rows: [
      { title: "Blog landing", href: "/blog" },
      ...BLOG_CATEGORIES.map((c) => ({
        title: `${c.name} — category archive`,
        href: `/blog/${c.slug}`,
        meta: "Category",
      })),
      ...BLOG_ARTICLE_PAGES.map((a) => ({
        title: a.title,
        href: `/blog/${a.categorySlug}/${a.slug}`,
        meta: a.category,
      })),
    ],
  },
  {
    label: "Company",
    rows: [
      { title: "About Us", href: "/about-us" },
      { title: "Contact Us", href: "/contact-us" },
      { title: "Bug Bounty", href: "/bug-bounty" },
      { title: "Privacy Policy", href: "/privacy-policy" },
      { title: "Terms of Service", href: "/terms-of-service" },
    ],
  },
  {
    label: "Account",
    rows: [
      { title: "Log in", href: "/login" },
      { title: "Dashboard — Offers (Account)", href: "/dashboard/offers/Account" },
      { title: "Dashboard — Offers (Custom items)", href: "/dashboard/offers/CustomItem" },
      { title: "Dashboard — Offers (Currency)", href: "/dashboard/offers/Currency" },
      { title: "Dashboard — Offers (Top Ups)", href: "/dashboard/offers/TopUp" },
      { title: "Dashboard — Purchased orders", href: "/dashboard/orders/purchased" },
      { title: "Dashboard — Sold orders", href: "/dashboard/orders/sold" },
      { title: "Dashboard — Loyalty", href: "/dashboard/loyalty" },
      { title: "Dashboard — Wallet", href: "/dashboard/wallet" },
      { title: "Dashboard — Messages", href: "/dashboard/messages" },
      { title: "Dashboard — Feedback", href: "/dashboard/feedback" },
    ],
  },
];

function Row({ title, href, meta }) {
  return (
    <li>
      <a
        href={href}
        className="flex items-center gap-4 border-b border-cardborder px-5 py-3.5 last:border-b-0 hover:bg-[#fafafa]"
      >
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[15px] font-semibold text-ink" title={title}>
            {title}
          </span>
          <span className="mt-0.5 flex items-center gap-2">
            {meta && (
              <span className="shrink-0 text-[11px] font-bold uppercase tracking-wide text-graytext">
                {meta}
              </span>
            )}
            <code className="block truncate text-xs text-secondary">{href}</code>
          </span>
        </span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0">
          <path
            d="m6 3 5 5-5 5"
            stroke="#14131A"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </li>
  );
}

export default function PageList() {
  const total = GROUPS.reduce((n, g) => n + g.rows.length, 0);
  return (
    <>
      <HeaderBar />
      <main className="mx-auto w-full max-w-[1160px] px-4 pb-16 pt-6">
        <h1 className="text-3xl font-extrabold uppercase text-ink">Page List</h1>
        <p className="mt-2 max-w-[720px] text-[15px] leading-6 text-secondary">
          Index of every page implemented in this clone — {total} routes grouped by area. Click a
          row to open the page.
        </p>

        <div className="mt-6 grid grid-cols-1 items-start gap-5 lg:grid-cols-2">
          {GROUPS.map((g) => (
            <section
              key={g.label}
              className="overflow-hidden rounded-2xl border border-cardborder bg-card"
            >
              <header className="flex items-center gap-3 border-b border-cardborder bg-[#fafafa] px-5 py-3">
                <span className="rounded-md bg-brand px-2 py-0.5 text-xs font-bold text-ink">
                  {g.rows.length}
                </span>
                <h2 className="text-sm font-bold uppercase tracking-wide text-ink">{g.label}</h2>
              </header>
              <ul>
                {g.rows.map((r) => (
                  <Row key={r.href} {...r} />
                ))}
              </ul>
            </section>
          ))}

          <section className="overflow-hidden rounded-2xl border border-cardborder bg-card lg:col-start-2">
            <header className="flex items-center gap-3 border-b border-cardborder bg-[#fafafa] px-5 py-3">
              <span className="rounded-md bg-brand px-2 py-0.5 text-xs font-bold text-ink">1</span>
              <h2 className="text-sm font-bold uppercase tracking-wide text-ink">Utility</h2>
            </header>
            <ul>
              <Row title="Page List (this page)" href="/pagelist" />
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
