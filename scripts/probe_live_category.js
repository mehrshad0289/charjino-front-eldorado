/* Session 15 — probe the LIVE category page (e.g. /blog/steal-an-egg/)
   to spec the internal /blog/[category] route:
   - header variant, title block, list row anatomy (image? title? date?
     read time? description?), "Load more" geometry, highlights/CTA
     presence, footer variant
   - full-page screenshots @1920 + @390 as references
   Usage: NODE_PATH=$(npm root -g) node scripts/probe_live_category.js [url]
*/
const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

const URL_ = process.argv[2] || "https://www.eldorado.gg/blog/steal-an-egg/";
const OUT = path.join(__dirname, "..", "docs", "ui-ux", "screenshots", "session15");
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const browser = await chromium.launch();

  for (const width of [1920, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto(URL_, { waitUntil: "networkidle", timeout: 90000 });
    await page.waitForTimeout(1500);

    const info = await page.evaluate(() => {
      const q = (s) => document.querySelector(s);
      const txt = (s) => (q(s) ? q(s).textContent.trim().slice(0, 120) : null);
      const rows = [...document.querySelectorAll("li, article")].slice(0, 6);
      const listRow = [...document.querySelectorAll("a[href*='/blog/']")]
        .map((a) => a.closest("li"))
        .filter(Boolean);
      const h1 = q("h1");
      const imgs = [...document.images].slice(0, 8).map((i) => ({
        src: i.currentSrc.slice(0, 140),
        w: i.width,
        h: i.height,
      }));
      /* find the article list container: ul/ol with several links */
      let list = null;
      for (const ul of document.querySelectorAll("ul, ol")) {
        const links = ul.querySelectorAll("a[href*='/blog/']");
        if (links.length >= 5) {
          list = ul;
          break;
        }
      }
      const firstRows = list
        ? [...list.children].slice(0, 3).map((li) => {
            const a = li.querySelector("a[href*='/blog/']");
            return {
              tag: li.firstElementChild ? li.firstElementChild.tagName : null,
              cls: (li.className || "").slice(0, 150),
              href: a ? a.getAttribute("href") : null,
              text: li.textContent.trim().replace(/\s+/g, " ").slice(0, 220),
              img: li.querySelector("img")
                ? li.querySelector("img").currentSrc.slice(0, 140)
                : null,
              imgW: li.querySelector("img") ? li.querySelector("img").width : null,
              imgH: li.querySelector("img") ? li.querySelector("img").height : null,
              childTags: [...li.querySelectorAll("*")]
                .slice(0, 10)
                .map((e) => e.tagName + (e.className && typeof e.className === "string" ? "." + e.className.split(" ").slice(0, 2).join(".") : ""))
                .join(","),
            };
          })
        : null;
      return {
        title: document.title.slice(0, 100),
        h1: h1 ? { text: h1.textContent.trim(), cls: h1.className.slice(0, 100), style: h1.getAttribute("style") } : null,
        listRows: firstRows,
        listCls: list ? list.className.slice(0, 120) : null,
        listParentCls: list && list.parentElement ? list.parentElement.className.slice(0, 120) : null,
        rowH: list && list.children[0] ? list.children[0].getBoundingClientRect().height : null,
        rowW: list && list.children[0] ? list.children[0].getBoundingClientRect().width : null,
        rowCount: list ? list.children.length : 0,
        loadMore: (() => {
          const b = [...document.querySelectorAll("button, a")].find((e) =>
            /load more/i.test(e.textContent)
          );
          if (!b) return null;
          const r = b.getBoundingClientRect();
          return { tag: b.tagName, cls: (b.className || "").slice(0, 120), w: r.width, h: r.height, text: b.textContent.trim().slice(0, 40) };
        })(),
        playSmart: !![...document.querySelectorAll("h3")].find((h) => /play smart/i.test(h.textContent)),
        ctaBanner: !!document.querySelector("img[alt*='Halloween' i], img[alt*='alloween']"),
        scrollW: document.documentElement.scrollWidth,
        scrollH: document.documentElement.scrollHeight,
        imgs,
      };
    });

    console.log(`\n===== WIDTH ${width} =====`);
    console.log(JSON.stringify(info, null, 1));

    await page.screenshot({
      path: path.join(OUT, `live-category-${width}.png`),
      fullPage: true,
    });
    console.log(`saved live-category-${width}.png`);
    await page.close();
  }

  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
