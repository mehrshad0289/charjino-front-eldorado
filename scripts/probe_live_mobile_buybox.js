// Inspect live mobile buy box structure around Total/price/buttons
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  });
  const page = await ctx.newPage();
  await page.goto('https://www.eldorado.gg/xbox-game-pass/t/103?attribute_value_id=xbox-ultimate-1-month', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForTimeout(3000);
  const btn = page.locator('#onetrust-accept-btn-handler');
  if (await btn.count()) { try { await btn.click({ timeout: 3000 }); } catch {} }
  await page.waitForTimeout(1500);
  const info = await page.evaluate(() => {
    const out = [];
    // find every element whose own text starts with Total
    for (const el of document.querySelectorAll('div,span,p')) {
      const t = (el.childNodes.length && [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim()) || '';
      if (t.startsWith('Total')) {
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        let p = el.parentElement, chain = [];
        for (let i = 0; i < 4 && p; i++) { chain.push(`${p.tagName}.${String(p.className).slice(0, 80)}`); p = p.parentElement; }
        out.push({ t: t.slice(0, 30), y: Math.round(r.y + scrollY), x: Math.round(r.x), w: Math.round(r.width), h: Math.round(r.height), disp: cs.display, chain });
      }
    }
    // add-to-cart buttons + their classes
    const atc = [...document.querySelectorAll('button')].filter(b => /add to cart/i.test(b.textContent)).map(b => ({ y: Math.round(b.getBoundingClientRect().y + scrollY), cls: String(b.className).slice(0, 160) }));
    const bn = [...document.querySelectorAll('button')].filter(b => b.textContent.trim() === 'Buy now').slice(0, 3).map(b => ({ y: Math.round(b.getBoundingClientRect().y + scrollY), cls: String(b.className).slice(0, 100) }));
    // banner strip height
    const big = [...document.querySelectorAll('img')].map(el => el.getBoundingClientRect()).filter(r => r.width > 300).map(r => ({ y: Math.round(r.y + scrollY), h: Math.round(r.height), w: Math.round(r.width) }));
    return { totals: out.slice(0, 6), atc, bn, big: big.slice(0, 4) };
  });
  console.log(JSON.stringify(info, null, 1));
  await browser.close();
})();
