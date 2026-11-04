/* Session 15 — full BLOG review sweep per the standing protocol:
   /blog + every article in BLOG_ARTICLE_PAGES x mandatory widths
   1920/1536/390 (plus 768/1024 for the landing), checking:
   HTTP status, overflow (scrollWidth - innerWidth), console/page errors,
   broken images. Usage: NODE_PATH=$(npm root -g) node scripts/review_sweep_blog.js [baseURL]
*/
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const BASE = process.argv[2] || "http://localhost:3100";
const dataSrc = fs.readFileSync(
  path.join(__dirname, "..", "src", "components", "eldorado", "data", "blogArticlesData.js"),
  "utf8"
);
const slugs = [...dataSrc.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
const cats = [...dataSrc.matchAll(/categorySlug:\s*"([^"]+)"/g)].map((m) => m[1]);
const articles = slugs.map((s, i) => ({ category: cats[i], slug: s }));

const ROUTES = ["/blog"];
for (const a of articles) ROUTES.push(`/blog/${a.category}/${a.slug}/`);
const LANDING_WIDTHS = [1920, 1536, 1024, 768, 390];
const ARTICLE_WIDTHS = [1920, 1536, 390];

(async () => {
  const browser = await chromium.launch();
  let failed = false;
  let total = 0;

  async function probe(route, width) {
    total++;
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const errors = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(String(e)));
    let status = 0;
    try {
      const resp = await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 60000 });
      status = resp ? resp.status() : 0;
      await page.waitForTimeout(500);
    } catch (e) {
      console.log(`FAIL ${route} @${width}: nav error ${String(e).slice(0, 80)}`);
      failed = true;
      await page.close();
      return;
    }
    const m = await page.evaluate(() => ({
      scrollW: document.documentElement.scrollWidth,
      innerW: window.innerWidth,
      broken: [...document.images]
        .filter((i) => i.complete && i.naturalWidth === 0)
        .map((i) => i.src.slice(0, 100)),
    }));
    const overflow = m.scrollW - m.innerW;
    const bad =
      status !== 200 || overflow > 0 || errors.length > 0 || m.broken.length > 0;
    if (bad) {
      failed = true;
      console.log(
        `FAIL ${route} @${width} status=${status} overflow=${overflow} errors=${errors.length} broken=${m.broken.length}`
      );
      if (errors.length) console.log("  console:", errors.slice(0, 3));
      if (m.broken.length) console.log("  broken:", m.broken.slice(0, 5));
    }
    await page.close();
  }

  for (const w of LANDING_WIDTHS) await probe("/blog", w);
  for (const r of ROUTES.slice(1)) for (const w of ARTICLE_WIDTHS) await probe(r, w);

  await browser.close();
  console.log(`\nProbed ${total} route-width combos`);
  console.log(failed ? "RESULT: FAIL" : "RESULT: PASS");
  process.exit(failed ? 1 : 0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
