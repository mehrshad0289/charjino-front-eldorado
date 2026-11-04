// Measure amount-card and seller-row heights, local vs live @1920
const { chromium } = require('playwright');

async function measure(browser, name, url) {
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 900 }, userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36' });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 }).catch(() => {});
  await page.waitForTimeout(2500);
  const btn = page.locator('#onetrust-accept-btn-handler');
  if (await btn.count()) { try { await btn.click({ timeout: 3000 }); } catch {} }
  await page.evaluate(async () => { for (let y = 0; y < 2600; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } window.scrollTo(0, 0); });
  await page.waitForTimeout(1200);
  const d = await page.evaluate(() => {
    const cards = [...document.querySelectorAll('button[aria-label^="Select Xbox"]')].filter(b => b.getBoundingClientRect().width > 100).slice(0, 2).map(b => { const r = b.getBoundingClientRect(); return { y: Math.round(r.y + scrollY), h: Math.round(r.height), w: Math.round(r.width) }; });
    // seller rows: white rounded cards after "Other sellers"
    const h2 = [...document.querySelectorAll('*')].find(e => e.children.length === 0 && /^Other sellers \(/.test((e.textContent || '').trim()) && e.getBoundingClientRect().height > 0);
    const rows = [...document.querySelectorAll('div')].filter(el => el.className && String(el.className).includes && String(el.className).indexOf('overflow-hidden') >= 0 && el.querySelector('button[aria-label="Buy now"]')).slice(0, 2).map(el => { const r = el.getBoundingClientRect(); return { y: Math.round(r.y + scrollY), h: Math.round(r.height), w: Math.round(r.width) }; });
    const grid = document.querySelector('button[aria-label^="Select Xbox"]')?.parentElement?.parentElement;
    const g = grid ? { y: Math.round(grid.getBoundingClientRect().y + scrollY), h: Math.round(grid.getBoundingClientRect().height) } : null;
    return { cards, rows, grid: g, pageH: document.documentElement.scrollHeight };
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
