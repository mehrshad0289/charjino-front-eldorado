// Session 24 — screenshots of the 3 new pages @1920/1536/390 + live
// reference screenshots @1920 (for side-by-side comparison).
const { chromium } = require('playwright');
const fs = require('fs');

const BASE = 'http://localhost:3100';
const OUT = 'docs/ui-ux/screenshots/session24';
const PAGES = [
  { name: 'prime', local: '/amazon-prime', live: 'https://www.eldorado.gg/amazon-prime/t/269?attribute_value_id=prime-video-1-month' },
  { name: 'psplus', local: '/playstation-plus', live: 'https://www.eldorado.gg/playstation-plus/t/104' },
  { name: 'cod', local: '/cod-points', live: 'https://www.eldorado.gg/cod-points/t/35?attribute_value_id=2400-cp&te=v0&region=Xbox' },
];
const WIDTHS = [1920, 1536, 390];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  for (const p of PAGES) {
    for (const w of WIDTHS) {
      const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
      const page = await ctx.newPage();
      await page.goto(BASE + p.local, { waitUntil: 'networkidle', timeout: 60000 });
      await page.waitForTimeout(800);
      await page.screenshot({ path: `${OUT}/local-${p.name}-${w}.png`, fullPage: true });
      await ctx.close();
      console.log(`local ${p.name} @${w} done`);
    }
    // live @1920 reference
    const ctx = await browser.newContext({ viewport: { width: 1920, height: 900 } });
    const page = await ctx.newPage();
    try {
      await page.goto(p.live, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(5000);
      await page.screenshot({ path: `${OUT}/live-${p.name}-1920.png`, fullPage: true });
      console.log(`live ${p.name} @1920 done`);
    } catch (e) {
      console.log(`live ${p.name} ERR`, String(e).slice(0, 100));
    }
    await ctx.close();
  }
  await browser.close();
})();
