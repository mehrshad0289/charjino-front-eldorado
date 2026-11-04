/* Session 15 — /blog/[category] geometry + interaction verification against
   the LIVE-probed numbers (scripts/probe_category_followup.js):
   @1920: breadcrumb y144, H1 y180 h55, featured 1190x358 y268, grid y715,
          row 560x160 img136, Load more 123x42 y1491
   @390:  breadcrumb y154, H1 y190 h46, featured 356x365 y261, grid y781,
          row 342x152 img106/110, Load more 123x36
   Interaction: 8 rows visible initially → Load more +8/click → button gone.
   Screenshots @1920/1536/390 → docs/ui-ux/screenshots/session15/.
   Usage: NODE_PATH=$(npm root -g) node scripts/verify_category_local.js [baseURL]
*/
const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

const BASE = process.argv[2] || "http://localhost:3100";
const OUT = path.join(__dirname, "..", "docs", "ui-ux", "screenshots", "session15");
fs.mkdirSync(OUT, { recursive: true });
const URL_ = BASE + "/blog/steal-an-egg";

const EXPECT = {
  1920: { crumbY: 144, h1Y: 180, h1H: 55, featY: 268, featW: 1190, featH: 358, gridY: 715, rowW: 560, rowH: 160, imgW: 136, lmY: 1491, lmW: 123, lmH: 42 },
  390: { crumbY: 154, h1Y: 190, h1H: 46, featY: 261, featW: 356, featH: 365, gridY: 781, rowW: 342, rowH: 152, imgW: 106, lmY: null, lmW: 123, lmH: 36 },
};
const TOL = 8; /* px tolerance for wrap/rounding differences */

(async () => {
  const browser = await chromium.launch();
  let failed = false;

  const chk = (label, got, want, tol = TOL) => {
    if (want == null) return;
    const d = Math.abs(got - want);
    const ok = d <= tol;
    if (!ok) failed = true;
    console.log(`${ok ? "ok  " : "FAIL"} ${label}: got ${got}, live ${want} (Δ${d})`);
  };

  for (const width of [1920, 1536, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const errors = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(String(e)));
    await page.goto(URL_, { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(800);
    const m = await page.evaluate(() => {
      const r = (el) => {
        if (!el) return null;
        const b = el.getBoundingClientRect();
        return { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height) };
      };
      const crumb = document.querySelector("nav[aria-label='Breadcrumb'] ul");
      const h1 = document.querySelector("h1");
      const rows = [...document.querySelectorAll("li")].filter((li) => li.querySelector("img") && li.textContent.includes("min read"));
      const visRows = rows.filter((li) => getComputedStyle(li).display !== "none");
      const grid = rows[0] ? rows[0].parentElement : null;
      const img = rows[0] && rows[0].querySelector("img");
      const lm = [...document.querySelectorAll("button")].find((b) => /load more/i.test(b.textContent));
      const feat = document.querySelector("h4") ? document.querySelector("h4").closest("a") : null;
      const overflow = document.documentElement.scrollWidth - window.innerWidth;
      return {
        crumb: r(crumb),
        h1: r(h1),
        feat: r(feat),
        grid: r(grid),
        row: r(rows[0]),
        img: r(img),
        lm: r(lm),
        totalRows: rows.length,
        visRows: visRows.length,
        lmVisible: !!lm && getComputedStyle(lm).display !== "none",
        overflow,
      };
    });

    console.log(`\n===== LOCAL /blog/steal-an-egg @${width} =====`);
    const E = EXPECT[width];
    if (E) {
      chk("breadcrumb y", m.crumb.y, E.crumbY);
      chk("H1 y", m.h1.y, E.h1Y);
      chk("H1 h", m.h1.h, E.h1H);
      chk("featured y", m.feat.y, E.featY);
      chk("featured w", m.feat.w, E.featW);
      chk("featured h", m.feat.h, E.featH);
      chk("grid y", m.grid.y, E.gridY);
      chk("row w", m.row.w, E.rowW);
      chk("row h", m.row.h, E.rowH);
      chk("img w", m.img.w, E.imgW);
      if (E.lmY) chk("Load more y", m.lm.y, E.lmY);
      chk("Load more w", m.lm ? m.lm.w : -1, E.lmW);
      chk("Load more h", m.lm ? m.lm.h : -1, E.lmH);
    }
    console.log(`rows total=${m.totalRows} visible=${m.visRows} lm=${m.lmVisible} overflow=${m.overflow} consoleErrors=${m.errors}`);

    /* interaction @1920: click through Load more */
    if (width === 1920) {
      const btn = page.locator("button:has-text('Load more')");
      const total = m.totalRows;
      let clicks = 0;
      while ((await btn.isVisible().catch(() => false)) && clicks < 10) {
        await btn.click();
        await page.waitForTimeout(250);
        clicks++;
      }
      const after = await page.evaluate(() =>
        [...document.querySelectorAll("li")].filter((li) => li.querySelector("img") && li.textContent.includes("min read") && getComputedStyle(li).display !== "none").length
      );
      const okAll = after === total;
      if (!okAll || clicks === 0) failed = true;
      console.log(`${okAll ? "ok  " : "FAIL"} Load more: ${clicks} clicks, visible ${m.visRows} → ${after}/${total}, button gone=${!(await btn.isVisible().catch(() => false))}`);
    }

    if ([1920, 1536, 390].includes(width)) {
      await page.goto(URL_, { waitUntil: "networkidle", timeout: 60000 });
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(OUT, `local-category-${width}.png`), fullPage: true });
      console.log(`saved local-category-${width}.png`);
    }
    if (m.overflow !== 0 || errors.length > 0) {
      if (errors.length) console.log("  console:", errors.slice(0, 3));
      failed = true;
    }
    await page.close();
  }

  await browser.close();
  console.log(failed ? "\nRESULT: FAIL" : "\nRESULT: PASS");
  process.exit(failed ? 1 : 0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
