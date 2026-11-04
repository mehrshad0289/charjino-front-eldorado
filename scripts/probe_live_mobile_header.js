// Check mobile header: cart icon presence on live home + giftcard + gamepass
const { chromium } = require('playwright');

const URLS = [
  ['home', 'https://www.eldorado.gg/'],
  ['giftcard', 'https://www.eldorado.gg/xbox-gift-card/v/103'],
  ['gamepass', 'https://www.eldorado.gg/xbox-game-pass/t/103?attribute_value_id=xbox-ultimate-1-month'],
];

(async () => {
  const browser = await chromium.launch();
  for (const [name, url] of URLS) {
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 900 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    });
    const page = await ctx.newPage();
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
      await page.waitForTimeout(2500);
      const btn = page.locator('#onetrust-accept-btn-handler');
      if (await btn.count()) { try { await btn.click({ timeout: 3000 }); } catch {} }
      await page.waitForTimeout(1200);
      const info = await page.evaluate(() => {
        // buttons/links in the top 120px of the page
        const out = [];
        for (const el of document.querySelectorAll('header a, header button, [class*="header"] a, [class*="header"] button')) {
          const r = el.getBoundingClientRect();
          if (r.y < 130 && r.width > 0) out.push({ tag: el.tagName, t: (el.textContent || '').trim().slice(0, 24), x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), aria: el.getAttribute('aria-label') });
        }
        out.sort((a, b) => a.x - b.x);
        return out;
      });
      console.log(`\n=== ${name} @390 header ===`);
      for (const i of info) console.log(`x=${i.x} y=${i.y} ${i.w}x${i.h} <${i.tag}> aria="${i.aria}" "${i.t}"`);
    } catch (e) {
      console.log(`${name} FAILED ${String(e).slice(0, 100)}`);
    }
    await ctx.close();
  }
  await browser.close();
})();
