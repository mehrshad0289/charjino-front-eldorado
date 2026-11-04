// Does the cart icon appear on live home/giftcard mobile AFTER full load + scroll?
const { chromium } = require('playwright');

const URLS = [
  ['home', 'https://www.eldorado.gg/'],
  ['giftcard', 'https://www.eldorado.gg/xbox-gift-card/v/103'],
];

(async () => {
  const browser = await chromium.launch();
  for (const [name, url] of URLS) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 900 }, userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36' });
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 }).catch(() => {});
    await page.waitForTimeout(3000);
    const btn = page.locator('#onetrust-accept-btn-handler');
    if (await btn.count()) { try { await btn.click({ timeout: 3000 }); } catch {} }
    await page.evaluate(async () => { for (let y = 0; y < 3000; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 150)); } window.scrollTo(0, 0); });
    await page.waitForTimeout(2500);
    await page.screenshot({ path: `/tmp/gamepass-sweep/hdr2-${name}.png`, clip: { x: 0, y: 0, width: 390, height: 120 } });
    console.log(`hdr2-${name}.png saved`);
    await ctx.close();
  }
  await browser.close();
})();
