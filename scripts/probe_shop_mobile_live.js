// Session 24 — live @390 anatomy for amazon-prime + playstation-plus
// (mobile responsive source of truth; captures are 1920-only).
const { chromium } = require('playwright');

const PAGES = [
  { name: 'prime', url: 'https://www.eldorado.gg/amazon-prime/t/269?attribute_value_id=prime-video-1-month' },
  { name: 'psplus', url: 'https://www.eldorado.gg/playstation-plus/t/104' },
];

(async () => {
  const browser = await chromium.launch();
  for (const p of PAGES) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    try {
      await page.goto(p.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(4500);
      const info = await page.evaluate(() => {
        const q = (sel) => document.querySelector(sel);
        const vis = (el) => el && el.offsetParent !== null;
        const order = [];
        // top-level landmarks in DOM order
        const bannerBg = [...document.querySelectorAll('img')].find((i) => /banner background/i.test(i.alt || ''));
        const banners = [...document.querySelectorAll('img')].filter((i) => (i.alt || '').match(/banner/i)).map((i) => ({ alt: i.alt, w: i.clientWidth, h: i.clientHeight }));
        const section = [...document.querySelectorAll('section')].map((s) => ({
          w: s.clientWidth,
          childClasses: [...s.children].slice(0, 6).map((c) => `${c.tagName}.${String(c.className).slice(0, 40)}`),
        }));
        // amount cards mobile: scroller?
        const amountCards = [...document.querySelectorAll('[aria-label^="Select "]')].map((c) => ({ label: c.getAttribute('aria-label'), w: c.clientWidth }));
        // other sellers rows
        const sellers = [...document.querySelectorAll('a[href*="/users/"]')].slice(0, 4).map((a) => a.textContent.trim().slice(0, 24));
        const overflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
        return { banners, sectionCount: section.length, section, amountCards, sellers, overflow, bannerBg: !!bannerBg };
      });
      console.log(`\n===== ${p.name} @390 =====`);
      console.log(JSON.stringify(info, null, 1).slice(0, 2600));
      await page.screenshot({ path: `docs/ui-ux/screenshots/session24/live-${p.name}-390.png`, fullPage: false });
    } catch (e) {
      console.log(`${p.name} ERR`, String(e).slice(0, 140));
    }
    await ctx.close();
  }
  await browser.close();
})();
