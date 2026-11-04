// Capture LIVE eldorado.gg gamepass page at all widths for side-by-side comparison
const { chromium } = require('playwright');
const fs = require('fs');

const WIDTHS = [390, 768, 1024, 1536, 1920];
const URL = 'https://www.eldorado.gg/xbox-game-pass/t/103?attribute_value_id=xbox-ultimate-1-month';
const OUT = '/tmp/gamepass-sweep';

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ args: ['--disable-blink-features=AutomationControlled'] });
  for (const w of WIDTHS) {
    const ctx = await browser.newContext({
      viewport: { width: w, height: 900 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      locale: 'en-US',
    });
    const page = await ctx.newPage();
    try {
      // accept cookies if the banner blocks rendering
      await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 90000 });
      await page.waitForTimeout(2500);
      const btn = page.locator('#onetrust-accept-btn-handler');
      if (await btn.count()) { try { await btn.click({ timeout: 3000 }); } catch {} }
      await page.waitForTimeout(1500);
      // scroll through to force lazy images
      await page.evaluate(async () => {
        for (let y = 0; y < document.documentElement.scrollHeight; y += 800) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 120));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(1500);
      const metrics = await page.evaluate(() => {
        const doc = document.documentElement;
        return { pageH: Math.round(doc.scrollHeight), overflow: doc.scrollWidth - doc.clientWidth };
      });
      await page.screenshot({ path: `${OUT}/live-${w}.png`, fullPage: true });
      console.log(`live w=${w} pageH=${metrics.pageH} overflow=${metrics.overflow}`);
    } catch (e) {
      console.log(`live w=${w} FAILED: ${String(e).slice(0, 150)}`);
    }
    await ctx.close();
  }
  await browser.close();
})();
