/* Session 18 — probe the LIVE user profile pages (About / Reviews / Shop)
   for the Reviews tab content (the user-pushed .h2d capture is an
   undecodable container) and to cross-check the About/Shop snapshots.
   Extracts the main content region texts + geometry of key elements.
   Usage: NODE_PATH=$(npm root -g) node scripts/probe_viewprofile_live.js [tab] */
const { chromium } = require("playwright");

const TAB = process.argv[2] || "reviews";
const URL = `https://www.eldorado.gg/users/NewFloat-0una/${TAB}`;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1000 } });
  await page.goto(URL, { waitUntil: "networkidle", timeout: 90000 }).catch((e) => console.log("nav:", String(e).slice(0, 90)));
  await page.waitForTimeout(2500);

  const data = await page.evaluate(() => {
    const out = { url: location.href, title: document.title };
    const main = document.querySelector("main") || document.body;
    out.mainText = main.innerText.slice(0, 2500);
    const h1 = main.querySelector("h1");
    out.h1 = h1 ? h1.textContent.trim() : null;
    // geometry: banner, profile card, tabs, review cards
    const g = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
    };
    out.banner = g('img[alt="User page banner"]');
    out.avatar = g('img[alt="Profile avatar"]');
    out.tabs = Array.from(main.querySelectorAll("a[href*='/reviews'], a[href*='/shop'], a[href*='/about']"))
      .slice(0, 3)
      .map((a) => ({ text: a.textContent.trim(), cls: a.className.slice(0, 60) }));
    out.reviewCards = Array.from(main.querySelectorAll("article, [class*='review']")).slice(0, 4).map((c) => ({
      cls: c.className.slice(0, 70),
      text: c.textContent.trim().slice(0, 200),
      box: (() => { const r = c.getBoundingClientRect(); return `${Math.round(r.width)}x${Math.round(r.height)}`; })(),
    }));
    return out;
  });
  console.log(JSON.stringify(data, null, 1));
  await page.screenshot({ path: `docs/ui-ux/screenshots/session18/live-vp-${TAB}-1920.png`, fullPage: true });
  const m = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await m.goto(URL, { waitUntil: "networkidle", timeout: 90000 }).catch(() => {});
  await m.waitForTimeout(2000);
  await m.screenshot({ path: `docs/ui-ux/screenshots/session18/live-vp-${TAB}-390.png`, fullPage: true });
  await browser.close();
})();
