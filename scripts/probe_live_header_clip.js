// Small clipped screenshots of live mobile headers (top 120px)
const { chromium } = require('playwright');

const URLS = [
  ['home', 'https://www.eldorado.gg/'],
  ['gp', 'https://www.eldorado.gg/xbox-game-pass/t/103?attribute_value_id=xbox-ultimate-1-month'],
];

(async () => {
  const browser = await chromium.launch();
  for (const [name, url] of URLS) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 900 }, userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36' });
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
    await page.waitForTimeout(3000);
    const btn = page.locator('#onetrust-accept-btn-handler');
    if (await btn.count()) { try { await btn.click({ timeout: 3000 }); } catch {} }
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `/tmp/gamepass-sweep/hdr-${name}.png`, clip: { x: 0, y: 0, width: 390, height: 120 } });
    console.log(`hdr-${name}.png saved`);
    await ctx.close();
  }
  await browser.close();
})();
