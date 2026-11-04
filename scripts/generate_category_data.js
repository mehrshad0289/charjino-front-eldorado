/* Session 15 — generates src/components/eldorado/data/blogCategoriesData.js
   from scripts/category-data.json (scraped live by scrape_category_pages.js).
   Re-run after re-scraping: node scripts/generate_category_data.js
*/
const fs = require("fs");
const path = require("path");

const SRC = path.join(__dirname, "category-data.json");
const OUT = path.join(
  __dirname,
  "..",
  "src",
  "components",
  "eldorado",
  "data",
  "blogCategoriesData.js"
);

const data = JSON.parse(fs.readFileSync(SRC, "utf8"));

const header = `/* Blog category archive pages (/blog/[category]) data — scraped LIVE from
   eldorado.gg/blog/<slug>/ on 2026-11-04 (session 15,
   scripts/scrape_category_pages.js → scripts/category-data.json →
   scripts/generate_category_data.js). There is NO .make capture for the
   category pages (the blog capture is the 1920 landing only) — per project
   convention the live site is the reference; all geometry (H1, featured
   banner, row anatomy, Load more) was DOM-probed live at 1920 + 390.
   Each category = newest article as the featured banner + the remaining
   rows in live order (live hides rows 9+ behind "Load more", inline
   display:none — reproduced client-side in BlogCategoryGrid).
   Row/featured hrefs stay the live eldorado.gg URLs; blogInternalHref()
   (data/blogData.js) rewrites the 11 internally-implemented articles to
   /blog/[category]/[slug]/ exactly like the landing page cards. */

export const BLOG_CATEGORIES = [
`;

const entries = Object.entries(data).map(([slug, v]) => {
  const esc = (s) => String(s).replace(/\\/g, "\\\\").replace(/'/g, "\\'");
  const featured = `    featured: {
      href: '${esc(v.featured.href)}',
      image: '${esc(v.featured.image)}',
      alt: '${esc(v.featured.title)}',
      date: '${esc(v.featured.date)}',
      title: '${esc(v.featured.title)}',
      excerpt: '${esc(v.featured.excerpt)}',
    },`;
  const rows = v.rows
    .map(
      (r) => `      {
        href: '${esc(r.href)}',
        image: '${esc(r.image)}',
        title: '${esc(r.title)}',
        date: '${esc(r.date)}',
        read: '${esc(r.read)}',
      },`
    )
    .join("\n");
  return `  {
    slug: '${esc(slug)}',
    name: '${esc(v.h1)}',
${featured}
    rows: [
${rows}
    ],
  },`;
});

const footer = `
];

/* The category nav labels, newest-first (featured dates) — used by
   /pagelist and any future category pickers. */
export const BLOG_CATEGORY_SLUGS = [
${Object.entries(data)
  .map(([slug, v]) => `  '${slug.replace(/'/g, "\\'")}',`)
  .join("\n")}
];

export default BLOG_CATEGORIES;
`;

fs.writeFileSync(OUT, header + entries.join("\n") + footer);
console.log(
  `wrote ${OUT} — ${Object.keys(data).length} categories, ${Object.values(data).reduce((n, v) => n + v.rows.length, 0)} rows`
);
