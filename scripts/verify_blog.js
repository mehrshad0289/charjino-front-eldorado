/* Session 12 — /blog technical verification + screenshots (matches the
   per-session verify pattern used in sessions 9-11).
   - overflow (scrollWidth vs viewport) at 390/768/1024/1536/1920
   - console errors at every width
   - screenshots: full-page @1920/1536/390 → docs/ui-ux/screenshots/session12/
   - interaction: mobile burger drawer opens + closes (live-derived behavior)
   Usage: NODE_PATH=$(npm root -g) node scripts/verify_blog.js [baseURL] */
const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

const BASE = process.argv[2] || "http://localhost:3000";
const OUT = path.join(__dirname, "..", "docs", "ui-ux", "screenshots", "session12");
fs.mkdirSync(OUT, { recursive: true });

const WIDTHS = [390, 768, 1024, 1536, 1920];

(async () => {
  const browser = await chromium.launch();
  let failed = false;

  for (const width of WIDTHS) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const errors = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(String(e)));
    await page.goto(BASE + "/blog", { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(700);

    const metrics = await page.evaluate(() => ({
      scrollW: document.documentElement.scrollWidth,
      innerW: window.innerWidth,
      scrollH: document.documentElement.scrollHeight,
      imgsBroken: [...document.images]
        .filter((i) => i.complete && i.naturalWidth === 0)
        .map((i) => i.src.slice(0, 120)),
    }));
    const overflow = metrics.scrollW - metrics.innerW;
    console.log(
      `w=${width} overflow=${overflow} scrollH=${metrics.scrollH} consoleErrors=${errors.length} brokenImgs=${metrics.imgsBroken.length}`
    );
    if (overflow > 0) failed = true;
    if (metrics.imgsBroken.length) {
      console.log("  broken:", metrics.imgsBroken);
      failed = true;
    }
    if (errors.length) {
      console.log("  console:", errors.slice(0, 5));
      failed = true;
    }

    if ([1920, 1536, 390].includes(width)) {
      await page.screenshot({
        path: path.join(OUT, `blog-${width}.png`),
        fullPage: true,
      });
      console.log(`  saved ${OUT}/blog-${width}.png`);
    }

    if (width === 390) {
      // interaction: burger drawer open/close (live-derived mobile header)
      const burger = page.locator('button[aria-label="Open menu"]');
      await burger.click();
      await page.waitForTimeout(300);
      const drawerVisible = await page
        .locator('button[aria-label="Close menu"]')
        .isVisible();
      const gamesVisible = await page
        .locator("nav >> text=Games")
        .first()
        .isVisible()
        .catch(() => false);
      console.log(`drawer open visible=${drawerVisible} gamesLink=${gamesVisible}`);
      await page.locator('button[aria-label="Close menu"]').click();
      await page.waitForTimeout(300);
      const drawerGone = (await page.locator('button[aria-label="Close menu"]').count()) === 0;
      console.log(`drawer closed=${drawerGone}`);
      if (!drawerVisible || !drawerGone) failed = true;
    }

    await page.close();
  }

  await browser.close();
  console.log(failed ? "RESULT: FAIL" : "RESULT: PASS");
  process.exit(failed ? 1 : 0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
