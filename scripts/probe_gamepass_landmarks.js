// Deep probe: find y-positions of key landmarks by text search, local + live @1920/@390
const { chromium } = require('playwright');

const PAGES = [
  { name: 'local', url: 'http://localhost:3100/xbox-game-pass' },
  { name: 'live', url: 'https://www.eldorado.gg/xbox-game-pass/t/103?attribute_value_id=xbox-ultimate-1-month' },
];
const WIDTHS = [1920, 390];

const NEEDLES = [
  'Available regions', 'Amount', 'Game Pass tokens', 'Other sellers',
  'Seller information', 'Trusted by thousands', 'Effortless buying process',
  'Frequently Asked Questions', 'Why trust Eldorado', 'Add to cart', 'Total',
];

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
        await page.waitForTimeout(1000);
        const data = await page.evaluate((needles) => {
          const out = [];
          const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
          const seen = new Set();
          while (walker.nextNode()) {
            const t = walker.currentNode.textContent.trim();
            if (!t) continue;
            for (const n of needles) {
              if (t.startsWith(n) && !seen.has(n)) {
                seen.add(n);
                const el = walker.currentNode.parentElement;
                const r = el.getBoundingClientRect();
                out.push({ needle: n, y: Math.round(r.y + window.scrollY), x: Math.round(r.x), w: Math.round(r.width), h: Math.round(r.height), tag: el.tagName, t: t.slice(0, 50) });
              }
            }
          }
          out.sort((a, b) => a.y - b.y);
          // banner strip: first big img in main or header region
          const banner = [...document.querySelectorAll('img')].map((el) => el.getBoundingClientRect()).filter((r) => r.width > 800 && r.height > 200).map((r) => ({ y: Math.round(r.y + window.scrollY), h: Math.round(r.height), w: Math.round(r.width) }));
          // first seller row element after "Other sellers"
          const rows = [...document.querySelectorAll('button')].filter((b) => /seller information/i.test(b.textContent)).slice(0, 2).map((b) => { const r = b.getBoundingClientRect(); return { y: Math.round(r.y + window.scrollY), x: Math.round(r.x), w: Math.round(r.width), h: Math.round(r.height) }; });
          return { out, banner, rows, pageH: document.documentElement.scrollHeight };
        }, NEEDLES);
        console.log(`\n===== ${p.name} @${w} pageH=${data.pageH} bannerStrip=${JSON.stringify(data.banner.slice(0, 2))} sellerInfoBtns=${JSON.stringify(data.rows)} =====`);
        for (const o of data.out) console.log(`y=${o.y} x=${o.x} ${o.w}x${o.h} <${o.tag}> "${o.t}"`);
      } catch (e) {
        console.log(`${p.name} @${w} FAILED ${String(e).slice(0, 120)}`);
      }
      await ctx.close();
    }
  }
  await browser.close();
})();
