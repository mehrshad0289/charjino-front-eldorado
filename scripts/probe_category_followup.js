/* Session 15b — follow-up category-page probe:
   breadcrumb geometry, row inner HTML anatomy, Load more batching,
   vertical spacing chain @1920 + @390, (re)saves live-category-W.png.
   Usage: NODE_PATH=$(npm root -g) node scripts/probe_category_followup.js */
const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

const OUT = path.join(__dirname, "..", "docs", "ui-ux", "screenshots", "session15");
fs.mkdirSync(OUT, { recursive: true });
const URL_ = "https://www.eldorado.gg/blog/steal-an-egg/";

(async () => {
  const browser = await chromium.launch();
  for (const width of [1920, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto(URL_, { waitUntil: "networkidle", timeout: 90000 });
    await page.waitForTimeout(1200);

    const info = await page.evaluate(() => {
      const r = (el) => {
        if (!el) return null;
        const b = el.getBoundingClientRect();
        return { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height) };
      };
      /* breadcrumb: anchor "Home" near the top */
      const home = [...document.querySelectorAll("a")].find((a) => a.textContent.trim() === "Home" && a.getBoundingClientRect().y < 250);
      const crumbWrap = home ? (home.closest("nav") || home.closest("ul") || home.parentElement) : null;
      const h1 = document.querySelector("h1");
      const rows = [...document.querySelectorAll("li")].filter((li) => {
        if (li.closest(".games-switcher")) return false;
        return li.querySelector("img") && li.textContent.includes("min read");
      });
      const first = rows[0];
      const lm = [...document.querySelectorAll("button")].find((b) => /load more/i.test(b.textContent));
      return {
        breadcrumb: {
          homeRect: home ? r(home) : null,
          homeCls: home ? home.className.toString().slice(0, 80) : null,
          wrapRect: r(crumbWrap),
          wrapCls: crumbWrap ? (crumbWrap.className || crumbWrap.tagName).toString().slice(0, 100) : null,
          text: crumbWrap ? crumbWrap.textContent.replace(/\s+/g, " ").trim().slice(0, 60) : null,
          html: crumbWrap ? crumbWrap.outerHTML.slice(0, 700) : null,
        },
        h1Rect: r(h1),
        rowHtml: first ? first.outerHTML.replace(/\s+/g, " ").slice(0, 1500) : null,
        rowCountInitial: rows.length,
        loadMoreVisible: lm ? lm.getBoundingClientRect().height > 0 : false,
        gridRect: first ? r(first.parentElement) : null,
        loadMoreRect: r(lm),
        lmMarginTop: lm ? getComputedStyle(lm).marginBottom + "/" + getComputedStyle(lm).marginTop : null,
      };
    });
    console.log(`\n===== ${width} =====`);
    console.log(JSON.stringify(info, null, 1));

    /* batching: click Load more ONCE, count rows again */
    const lm = page.locator("button:has-text('Load more')").first();
    if (await lm.isVisible().catch(() => false)) {
      await lm.click();
      await page.waitForTimeout(1200);
      const after = await page.evaluate(() =>
        [...document.querySelectorAll("li")].filter((li) => {
          if (li.closest(".games-switcher")) return false;
          return li.querySelector("img") && li.textContent.includes("min read");
        }).length
      );
      console.log(`rows after 1 Load-more click: ${after}`);
    }
    await page.screenshot({ path: path.join(OUT, `live-category-${width}.png`), fullPage: true });
    console.log(`saved live-category-${width}.png`);
    await page.close();
  }
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
