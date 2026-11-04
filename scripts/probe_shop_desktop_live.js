// Session 24 — live @1920/1536 geometry for the two new shop pages.
const { chromium } = require('playwright');

const PAGES = [
  { name: 'prime', url: 'https://www.eldorado.gg/amazon-prime/t/269?attribute_value_id=prime-video-1-month' },
  { name: 'psplus', url: 'https://www.eldorado.gg/playstation-plus/t/104' },
];

(async () => {
  const browser = await chromium.launch();
  for (const p of PAGES) {
    for (const w of [1920, 1536]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
      const page = await ctx.newPage();
      await page.goto(p.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(4000);
      const g = await page.evaluate(() => {
        const r = (el) => (el ? Math.round(el.getBoundingClientRect().width) : null);
        // featured card = white card containing 'Delivery time' bold + value
        const dts = [...document.querySelectorAll('span')].filter((s) => (s.textContent || '').trim() === 'Delivery time');
        const feat = dts.length ? dts[0].closest('div[class*="bg-white"], .bg-white') : null;
        let sidebar = feat;
        for (let k = 0; k < 6 && sidebar && sidebar.parentElement; k++) {
          const par = sidebar.parentElement;
          const sib = [...par.children].filter((c) => c !== sidebar);
          if (sib.length && (par.className + '').match(/flex/) && !sidebar.className.match(/contents/)) break;
          sidebar = par;
        }
        const amount = [...document.querySelectorAll('span')].find((s) => (s.textContent || '').trim() === 'Amount');
        const amountCard = amount ? amount.closest('.bg-white') : null;
        const sellerH = [...document.querySelectorAll('div,span')].find((e) => (e.textContent || '').trim() === 'Seller' && e.children.length === 0);
        return {
          amountCardW: r(amountCard),
          featW: r(feat),
          sidebarW: r(sidebar),
          featRect: feat ? JSON.parse(JSON.stringify(feat.getBoundingClientRect())) : null,
          gap: feat && feat.parentElement ? [...feat.parentElement.children].map((c) => Math.round(c.getBoundingClientRect().width)) : null,
        };
      });
      console.log(p.name, w, JSON.stringify(g));
      await ctx.close();
    }
  }
  await browser.close();
})();
