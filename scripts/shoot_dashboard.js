/* Session 16 — screenshot the 5 new routes at 1920 and 390 for visual
   comparison against the capture thumbnails. Output: /tmp/shots/*.png */
const { chromium } = require("playwright");
const ROUTES = [
  "/dashboard/loyalty/",
  "/dashboard/offers/Currency/",
  "/dashboard/offers/TopUp/",
  "/dashboard/orders/purchased/",
  "/dashboard/orders/sold/",
];
(async () => {
  const b = await chromium.launch();
  for (const r of ROUTES) {
    for (const w of [1920, 390]) {
      const p = await b.newPage({ viewport: { width: w, height: 1000 } });
      await p.goto("http://localhost:3100" + r, { waitUntil: "networkidle", timeout: 60000 });
      await p.waitForTimeout(600);
      const name = r.replaceAll("/", "_").replace(/_+$/, "");
      await p.screenshot({ path: `/tmp/shots/${name}@${w}.png`, fullPage: false });
      await p.close();
    }
  }
  await b.close();
  console.log("shots done");
})();
