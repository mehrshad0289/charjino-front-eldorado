/* Session 15 — deep-probe the LIVE category page anatomy (steal-an-egg
   reference) @1920 + @390 AND scrape all 6 category article lists.
   Outputs geometry JSON to stdout and writes scripts/category-data.json.
   Usage: NODE_PATH=$(npm root -g) node scripts/scrape_category_pages.js */
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const CATEGORIES = [
  "steal-an-egg",
  "steal-a-brainrot-en",
  "league-of-legends",
  "ea-fc-27-en",
  "murder-mystery-2-en",
  "insider-interviews",
];
const OUT = path.join(__dirname, "category-data.json");

/* row finder: li with an img + blog article link, not the games switcher.
   Injected into the BROWSER context (functions cannot be serialized). */
const ROW_COLLECTOR = `() => [...document.querySelectorAll("li")].filter((li) => {
  if (li.closest(".games-switcher")) return false;
  const a = li.querySelector("a[href*='/blog/']");
  const img = li.querySelector("img");
  return a && img && li.textContent.includes("min read");
})`;

(async () => {
  const browser = await chromium.launch();

  /* ---------- 1) GEOMETRY PROBE @1920 + @390 ---------- */
  for (const width of [1920, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto("https://www.eldorado.gg/blog/steal-an-egg/", {
      waitUntil: "networkidle",
      timeout: 90000,
    });
    await page.waitForTimeout(1200);
    const g = await page.evaluate((ROW_COLLECTOR) => {
      const pick = (el, props) => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        const out = { rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) } };
        for (const p of props || []) out[p] = cs.getPropertyValue(p);
        return out;
      };
      const h1 = document.querySelector("h1.games-cat-title, h1");
      const breadcrumb = [...document.querySelectorAll("span, ul, div, nav")].find(
        (e) => e.textContent.trim().startsWith("Home") && e.textContent.includes("Steal an Egg") && e.children.length <= 6 && e.textContent.trim().length < 40
      );
      const rows = eval(ROW_COLLECTOR)();
      const first = rows[0];
      const img = first && first.querySelector("img");
      const title = first && [...first.querySelectorAll("a, h2, h3, span, p")].find((e) => e.textContent.trim().length > 20);
      const meta = first && [...first.querySelectorAll("*")].filter((e) => /min read/.test(e.textContent) && e.children.length === 0).pop();
      const loadMore = [...document.querySelectorAll("button")].find((b) => /load more/i.test(b.textContent));
      /* featured = the big banner card (img > 300px wide) */
      const featImg = [...document.images].find((i) => i.width > 800 && i.getBoundingClientRect().width > 800);
      const featCard = featImg && featImg.closest("a, div, article");
      const grid = first && first.parentElement;
      return {
        h1: { ...pick(h1, ["font-size", "font-family", "font-weight", "line-height", "letter-spacing", "text-transform", "color", "margin-bottom"]) },
        breadcrumb: breadcrumb ? { text: breadcrumb.textContent.trim(), cls: (breadcrumb.className || "").toString().slice(0, 80) } : null,
        row: {
          li: pick(first, ["padding", "background", "border-radius"]),
          img: img ? { ...pick(img, ["border-radius", "border"]), rect: img.getBoundingClientRect().toJSON() } : null,
          title: title ? pick(title, ["font-size", "font-weight", "line-height", "color", "font-family"]) : null,
          meta: meta ? pick(meta, ["font-size", "color"]) : null,
        },
        grid: grid ? pick(grid, ["display", "grid-template-columns", "gap", "column-gap", "row-gap", "padding"]) : null,
        rowGapY: rows.length > 1 ? Math.round(rows[1].getBoundingClientRect().y - rows[0].getBoundingClientRect().y - rows[0].getBoundingClientRect().height) : null,
        loadMore: loadMore ? { ...pick(loadMore, ["background", "color", "font-size", "font-weight", "border-radius", "padding"]), text: loadMore.textContent.trim() } : null,
        featured: featCard ? pick(featCard, ["border-radius", "border"]) : null,
        featImgW: featImg ? featImg.getBoundingClientRect().width : null,
        featImgH: featImg ? featImg.getBoundingClientRect().height : null,
        rowCount: rows.length,
        bodyFont: getComputedStyle(document.body).fontFamily,
      };
    }, ROW_COLLECTOR);
    console.log(`\n===== GEOMETRY @${width} =====`);
    console.log(JSON.stringify(g, null, 1));
    await page.close();
  }

  /* ---------- 2) SCRAPE ALL 6 CATEGORIES ---------- */
  const data = {};
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 900 } });
  const page = await ctx.newPage();
  for (const cat of CATEGORIES) {
    await page.goto(`https://www.eldorado.gg/blog/${cat}/`, {
      waitUntil: "networkidle",
      timeout: 90000,
    });
    await page.waitForTimeout(1000);
    /* click Load more until it disappears to get the FULL list */
    for (let i = 0; i < 10; i++) {
      const btn = page.locator("button.js-more-items-cats, button:has-text('Load more')").first();
      if (!(await btn.isVisible().catch(() => false))) break;
      await btn.click().catch(() => {});
      await page.waitForTimeout(900);
    }
    const scraped = await page.evaluate((ROW_COLLECTOR) => {
      const title = document.querySelector("h1");
      /* featured banner: large image card ABOVE the row grid */
      const bigImg = [...document.images].find((i) => i.getBoundingClientRect().width > 700);
      let featured = null;
      if (bigImg) {
        const card = bigImg.closest("a") || bigImg.closest("div");
        const link = card && card.closest("a");
        const date = [...card.querySelectorAll("*")].find((e) => /^\d{1,2} \w{3} \d{4}$/.test(e.textContent.trim()));
        const h = card.querySelector(".featured-title, .item-title, h4") || [...card.querySelectorAll("h2, h3")].find((e) => e.textContent.trim().length > 10);
        const p = card.querySelector("p");
        featured = {
          href: link ? link.getAttribute("href") : bigImg.closest("a")?.getAttribute("href") || null,
          image: bigImg.currentSrc || bigImg.src,
          date: date ? date.textContent.trim() : null,
          title: h ? h.textContent.trim() : null,
          excerpt: p ? p.textContent.trim() : null,
        };
      }
      const rows = eval(ROW_COLLECTOR)().map((li) => {
        const a = li.querySelector("a[href*='/blog/']");
        const img = li.querySelector("img");
        const tcs = li.textContent.replace(/\s+/g, " ");
        const date = (tcs.match(/(\d{1,2} \w{3} \d{4})/) || [])[1] || null;
        const read = (tcs.match(/~\d+ min read/) || [])[0] || null;
        const titleEl = li.querySelector(".item-title");
        return {
          href: a ? a.getAttribute("href") : null,
          image: img ? img.currentSrc || img.src : null,
          title: titleEl ? titleEl.textContent.trim() : null,
          date,
          read,
        };
      });
      return {
        h1: title ? title.textContent.trim() : null,
        featured,
        rows,
      };
    }, ROW_COLLECTOR);
    data[cat] = scraped;
    console.log(`${cat}: h1="${scraped.h1}" featured=${scraped.featured ? "yes" : "no"} rows=${scraped.rows.length}`);
  }

  fs.writeFileSync(OUT, JSON.stringify(data, null, 2));
  console.log(`\nwrote ${OUT}`);
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
