// Session 24 — full DOM-order landmark probe @390 (both pages).
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
    await page.goto(p.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(4500);
    const marks = await page.evaluate(() => {
      const out = [];
      const push = (label) => out.push(label);
      // walk main section children
      const sec = document.querySelector('section') || document.querySelector('main');
      const walk = (el, depth) => {
        if (!el || depth > 3) return;
        for (const c of el.children) {
          const t = (c.textContent || '').trim().slice(0, 40);
          const cls = String(c.className).slice(0, 50);
          const isImg = c.tagName === 'IMG';
          if (isImg) push(`IMG[${Math.round(c.clientWidth)}x${Math.round(c.clientHeight)}] alt="${(c.alt || '').slice(0, 30)}"`);
          else if (t && depth <= 2) push(`${'  '.repeat(depth)}${c.tagName} ${cls ? '·' + cls.split(' ').slice(0, 3).join(' ') : ''} :: ${t}`);
          walk(c, depth + 1);
        }
      };
      // top-level: header, banner, section children only (skip deep)
      const main = document.querySelector('main');
      if (main) {
        for (const c of main.children) {
          const t = (c.textContent || '').trim().slice(0, 36);
          push(`TOP ${c.tagName}.${String(c.className).split(' ').slice(0, 2).join('.')} :: ${t}`);
        }
      }
      // featured/amount cards + headings order
      const headingSel = ['h1', 'h2', 'h3', '[aria-label^="Select "]', '[aria-label="No results"]', 'button'];
      // capture the sequence of key markers by vertical position
      const markers = [];
      document.querySelectorAll('*').forEach((el) => {
        if (el.children.length) return;
        const txt = (el.textContent || '').trim();
        if (/^(Amount|Game region|Delivery time|Delivery instructions|In stock|Total|Buy now|Seller|Other sellers|Trusted by thousands|Effortless buying process|Frequently Asked Questions|Why trust|Buy Amazon|Buy PlayStation)/.test(txt) && txt.length < 70) {
          const r = el.getBoundingClientRect();
          const y = r.top + window.scrollY;
          if (!markers.find((m) => m.txt === txt)) markers.push({ txt: txt.slice(0, 46), y: Math.round(y) });
        }
      });
      markers.sort((a, b) => a.y - b.y);
      return { tops: out.slice(0, 8), markers: markers.slice(0, 40) };
    });
    console.log(`\n===== ${p.name} @390 order =====`);
    marks.markers.forEach((m) => console.log(`${String(m.y).padStart(6)}  ${m.txt}`));
    await ctx.close();
  }
  await browser.close();
})();
