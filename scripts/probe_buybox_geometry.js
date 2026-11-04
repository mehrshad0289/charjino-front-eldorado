// Precise x/w geometry of live mobile buy-box vs local
const { chromium } = require('playwright');

async function measure(browser, name, url) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 900 }, userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36' });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 }).catch(() => {});
  await page.waitForTimeout(3000);
  const btn = page.locator('#onetrust-accept-btn-handler');
  if (await btn.count()) { try { await btn.click({ timeout: 3000 }); } catch {} }
  await page.evaluate(async () => { for (let y = 0; y < 2500; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } window.scrollTo(0, 0); });
  await page.waitForTimeout(1500);
  const data = await page.evaluate(() => {
    const byText = (txt) => {
      for (const el of document.querySelectorAll('div,span,button,h1,h2,p')) {
        if ((el.textContent || '').trim().startsWith(txt)) {
          const r = el.getBoundingClientRect();
          if (r.width > 0) return { x: Math.round(r.x), w: Math.round(r.width), y: Math.round(r.y + scrollY) };
        }
      }
      return null;
    };
    // first full-width dark Buy now button in the featured flow
    const buynow = [...document.querySelectorAll('button')].filter(b => b.textContent.trim() === 'Buy now').map(b => { const r = b.getBoundingClientRect(); return { x: Math.round(r.x), w: Math.round(r.width), y: Math.round(r.y + scrollY) }; });
    // white card edges: find the region-card (bg-white) ancestors
    const cards = [...document.querySelectorAll('div')].filter(d => getComputedStyle(d).backgroundColor === 'rgb(255, 255, 255)' && d.getBoundingClientRect().width > 300).slice(0, 4).map(d => { const r = d.getBoundingClientRect(); return { x: Math.round(r.x), w: Math.round(r.width), y: Math.round(r.y + scrollY), h: Math.round(r.height) }; });
    return {
      gameRegion: byText('Game region'),
      deliveryTime: byText('Delivery time'),
      inStock: byText('In stock'),
      amount: byText('Amount'),
      buynow: buynow.slice(0, 3),
      cards,
    };
  });
  console.log(`\n=== ${name} @390 ===`);
  console.log(JSON.stringify(data));
  await ctx.close();
}

(async () => {
  const browser = await chromium.launch();
  await measure(browser, 'live', 'https://www.eldorado.gg/xbox-game-pass/t/103?attribute_value_id=xbox-ultimate-1-month');
  await measure(browser, 'local', 'http://localhost:3100/xbox-game-pass');
  await browser.close();
})();
