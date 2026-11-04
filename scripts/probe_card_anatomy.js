// Measure inner anatomy of the first amount card: local vs live @1920
const { chromium } = require('playwright');

async function measure(browser, name, url) {
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 900 }, userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36' });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 }).catch(() => {});
  await page.waitForTimeout(2500);
  const btn = page.locator('#onetrust-accept-btn-handler');
  if (await btn.count()) { try { await btn.click({ timeout: 3000 }); } catch {} }
  await page.waitForTimeout(1500);
  const d = await page.evaluate(() => {
    // visible desktop card (width > 200)
    const card = [...document.querySelectorAll('button[aria-label^="Select Xbox Essential"]')].map(b => b.getBoundingClientRect()).find(r => r.width > 200);
    if (!card) return null;
    const btnEl = [...document.querySelectorAll('button[aria-label^="Select Xbox Essential"]')].find(b => b.getBoundingClientRect().width > 200);
    const parts = {};
    const abs = (el) => { const r = el.getBoundingClientRect(); return { top: Math.round(r.top - card.top), h: Math.round(r.height) }; };
    const img = btnEl.querySelector('img'); if (img) parts.icon = abs(img);
    const title = [...btnEl.querySelectorAll('div')].find(el => el.children.length === 0 && el.textContent.trim().startsWith('Xbox Essential')); if (title) parts.title = abs(title);
    const strike = [...btnEl.querySelectorAll('div,span')].find(el => getComputedStyle(el).textDecorationLine.includes('line-through') && el.children.length === 0); if (strike) parts.strike = abs(strike);
    const price = [...btnEl.querySelectorAll('span')].find(el => /6\.79|HK\$60\.53/.test(el.textContent.trim())); if (price) parts.price = abs(price);
    const foot = [...btnEl.querySelectorAll('div')].filter(el => /\/ month$/.test(el.textContent.trim())).pop(); if (foot) parts.footer = abs(foot);
    return { cardH: Math.round(card.height), cardW: Math.round(card.width), parts };
  });
  console.log(`${name}: ${JSON.stringify(d)}`);
  await ctx.close();
}

(async () => {
  const browser = await chromium.launch();
  await measure(browser, 'live ', 'https://www.eldorado.gg/xbox-game-pass/t/103?attribute_value_id=xbox-ultimate-1-month');
  await measure(browser, 'local', 'http://localhost:3100/xbox-game-pass');
  await browser.close();
})();
