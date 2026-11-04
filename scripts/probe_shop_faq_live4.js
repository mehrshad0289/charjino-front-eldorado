// Session 24d — count live FAQ rows + get the 6th answer if any.
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 900 } });
  const page = await ctx.newPage();
  await page.goto('https://www.eldorado.gg/playstation-plus/t/104', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(5000);
  const data = await page.evaluate(() => {
    const rows = [...document.querySelectorAll('.faq-answer-text')];
    // each faq row: question text = the closest preceding heading-ish text
    const html = document.documentElement.innerHTML;
    const faqQs = [...html.matchAll(/>([^<>]{8,70}\?)<\/[a-z]+><\/div><div[^>]*><\/div><\/div><\/div><\/div><\/div><eld-contentful-rich-text/g)].map((m) => m[1]);
    // simpler: all questions followed by an answer panel
    const answers = rows.map((r) => r.textContent.trim().slice(0, 120));
    return { count: rows.length, answers, faqQs };
  });
  console.log('answer blocks:', data.count);
  data.answers.forEach((a, i) => console.log(`[${i}]`, a.slice(0, 110)));
  await browser.close();
})();
