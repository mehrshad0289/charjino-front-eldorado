/* Session 15c — decisive probe: which rows are HIDDEN (display:none) on the
   live category page at 1920 vs 390, and the Load more button state.
   Usage: NODE_PATH=$(npm root -g) node scripts/probe_category_hidden.js */
const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  for (const width of [1920, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto("https://www.eldorado.gg/blog/steal-an-egg/", {
      waitUntil: "networkidle",
      timeout: 90000,
    });
    await page.waitForTimeout(1200);
    const res = await page.evaluate(() => {
      const rows = [...document.querySelectorAll("li")].filter((li) => {
        if (li.closest(".games-switcher")) return false;
        return li.querySelector("img") && li.textContent.includes("min read");
      });
      const states = rows.map((li, i) => {
        const cs = getComputedStyle(li);
        return `${i + 1}:${cs.display}`;
      });
      const lm = [...document.querySelectorAll("button")].find((b) => /load more/i.test(b.textContent));
      const grid = rows[0] ? rows[0].parentElement : null;
      return {
        total: rows.length,
        states: states.join(" "),
        loadMoreDisplay: lm ? getComputedStyle(lm).display : "none",
        gridCls: grid ? grid.className : null,
        /* hidden-by rule: check li index 10 inline style + matched CSS */
        li10StyleAttr: rows[9] ? rows[9].getAttribute("style") : null,
        li1StyleAttr: rows[0] ? rows[0].getAttribute("style") : null,
      };
    });
    console.log(`===== ${width} =====`);
    console.log(JSON.stringify(res, null, 1));
    await page.close();
  }
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
