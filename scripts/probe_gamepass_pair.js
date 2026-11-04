// Probe key element positions on local + live gamepass pages @1920 and @390
const { chromium } = require('playwright');

const PAGES = [
  { name: 'local', url: 'http://localhost:3100/xbox-game-pass' },
  { name: 'live', url: 'https://www.eldorado.gg/xbox-game-pass/t/103?attribute_value_id=xbox-ultimate-1-month' },
];
const WIDTHS = [1920, 390];

const SELS = {
  header: 'header, [class*="header"]',
  banner: 'img[alt*="ame Pass" i]',
  chips: '[aria-label*="region" i], [class*="region"]',
  amountsGrid: '[class*="amount"], [class*="variant"]',
  featured: '[class*="eatured"], [class*="elected-offer"]',
  sellersH2: 'h2',
  rows: '[class*="offer-row"], [class*="eller"]',
  reviews: '[class*="rustpilot"], [class*="eview"]',
  process: 'h3, h2',
  faq: 'details, [class*="accordion"], [class*="faq"]',
  seo: 'h2, h3',
  footer: 'footer',
};

(async () => {
  const browser = await chromium.launch();
  for (const w of WIDTHS) {
    for (const p of PAGES) {
      const ctx = await browser.newContext({
        viewport: { width: w, height: 900 },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      });
      const page = await ctx.newPage();
      try {
        await page.goto(p.url, { waitUntil: 'domcontentloaded', timeout: 90000 });
        await page.waitForTimeout(2200);
        const btn = page.locator('#onetrust-accept-btn-handler');
        if (await btn.count()) { try { await btn.click({ timeout: 3000 }); } catch {} }
        await page.waitForTimeout(1200);
        const data = await page.evaluate(() => {
          const abs = (el) => { const r = el.getBoundingClientRect(); return { y: Math.round(r.y + window.scrollY), x: Math.round(r.x), w: Math.round(r.width), h: Math.round(r.height), t: (el.textContent || '').trim().slice(0, 60) }; };
          const out = {};
          // all h1/h2/h3 headings give a section map
          out.headings = [...document.querySelectorAll('h1,h2,h3')].slice(0, 40).map(abs);
          out.imgs = [...document.querySelectorAll('main img, header img')].slice(0, 8).map(abs);
          out.buttons = [...document.querySelectorAll('button')].filter(b => /buy now|add to cart/i.test(b.textContent)).slice(0, 6).map(abs);
          out.pageH = document.documentElement.scrollHeight;
          return out;
        });
        console.log(`\n===== ${p.name} @${w} pageH=${data.pageH} =====`);
        for (const h of data.headings) console.log(`H y=${h.y} x=${h.x} ${h.w}x${h.h} "${h.t}"`);
        for (const b of data.buttons) console.log(`BTN y=${b.y} x=${b.x} ${b.w}x${b.h} "${b.t}"`);
        for (const im of data.imgs) console.log(`IMG y=${im.y} x=${im.x} ${im.w}x${im.h} alt="${im.t}"`);
      } catch (e) {
        console.log(`${p.name} @${w} FAILED ${String(e).slice(0, 120)}`);
      }
      await ctx.close();
    }
  }
  await browser.close();
})();
