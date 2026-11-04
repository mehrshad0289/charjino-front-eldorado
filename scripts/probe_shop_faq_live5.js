// Session 24e — is 'Why trust Eldorado?' a FAQ row on live, or only a section heading?
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 900 } });
  const page = await ctx.newPage();
  await page.goto('https://www.eldorado.gg/playstation-plus/t/104', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(5000);
  const out = await page.evaluate(() => {
    const hits = [];
    document.querySelectorAll('*').forEach((el) => {
      if (el.children.length === 0 && (el.textContent || '').trim() === 'Why trust Eldorado?') {
        const path = [];
        let p = el;
        for (let k = 0; k < 6 && p; k++) { path.push(p.tagName + (p.className && typeof p.className === 'string' ? '.' + p.className.split(' ').slice(0, 2).join('.') : '')); p = p.parentElement; }
        hits.push({ tag: el.tagName, cls: String(el.className).slice(0, 60), path: path.join(' < ') });
      }
    });
    // FAQ section: find the container after 'Frequently Asked Questions'
    const h = [...document.querySelectorAll('h2, div')].find((e) => (e.textContent || '').trim() === 'Frequently Asked Questions');
    let faqRows = 0;
    if (h) {
      let sec = h.parentElement;
      for (let k = 0; k < 3 && sec; k++) {
        if (sec.querySelectorAll('.faq-answer-text').length >= 5) break;
        sec = sec.parentElement;
      }
      if (sec) faqRows = sec.querySelectorAll('.faq-answer-text').length;
    }
    return { hits, faqRows };
  });
  console.log(JSON.stringify(out, null, 1).slice(0, 1800));
  await browser.close();
})();
