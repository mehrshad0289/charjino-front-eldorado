// Session 24 — probe live eldorado.gg for the generic shop FAQ answers
// (collapsed in both new captures) + mobile @390 layout notes for the
// amazon-prime and playstation-plus pages.
const { chromium } = require('playwright');

const PAGES = [
  'https://www.eldorado.gg/amazon-prime/t/269?attribute_value_id=prime-video-1-month',
  'https://www.eldorado.gg/playstation-plus/t/104',
];

(async () => {
  const browser = await chromium.launch();
  for (const url of PAGES) {
    const ctx = await browser.newContext({ viewport: { width: 1920, height: 900 } });
    const page = await ctx.newPage();
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(4000);
      const faq = await page.evaluate(() => {
        const out = [];
        document.querySelectorAll('details, [class*="accordion" i], [class*="faq" i] *').forEach(() => {});
        // generic approach: find the FAQ section by heading, then list q/a pairs
        const h2s = [...document.querySelectorAll('h2')];
        const faqH = h2s.find((h) => /frequently asked/i.test(h.textContent || ''));
        if (faqH) {
          let sec = faqH.closest('section') || faqH.parentElement;
          for (let k = 0; k < 3 && sec && sec.querySelectorAll('button,summary').length < 2; k++) sec = sec.parentElement;
          if (sec) {
            sec.querySelectorAll('button, summary, [role="button"]').forEach((b) => {
              const row = b.closest('div');
              const q = (b.textContent || '').trim().slice(0, 120);
              // answer usually a sibling p/div
              let ans = '';
              let el = row;
              for (let k = 0; k < 4 && el; k++) {
                el = el.nextElementSibling;
                if (el && el.textContent && el.textContent.trim().length > 40) { ans = el.textContent.trim().slice(0, 700); break; }
              }
              if (q && q.length > 8) out.push({ q, ans });
            });
          }
        }
        return out;
      });
      console.log('=== FAQ', url.slice(0, 70));
      faq.forEach((f) => console.log('- Q:', f.q, '\n  A:', f.ans.slice(0, 500)));
    } catch (e) {
      console.log('ERR', url.slice(0, 60), String(e).slice(0, 120));
    }
    await ctx.close();
  }
  await browser.close();
})();
