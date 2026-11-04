// Session 24c — extract the 6 generic FAQ questions + full answers from live.
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 900 } });
  const page = await ctx.newPage();
  await page.goto('https://www.eldorado.gg/playstation-plus/t/104', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(5000);
  const data = await page.evaluate(() => {
    const html = document.documentElement.innerHTML;
    const qs = [
      'What is Eldorado.gg?',
      'Is topping up on Eldorado safe?',
      'How to top up using Eldorado?',
      "What is Eldorado.gg's refund and return policy?",
      'What if I have problems with my order?',
      'Why trust Eldorado?',
    ];
    return qs.map((q) => {
      const at = html.indexOf(q);
      if (at < 0) return { q, err: 'not found' };
      // answer = next faq-answer-text rich-text block after the question
      const m = html.slice(at).match(/rich-text faq-answer-text">([\s\S]*?)<\/div>\s*<\/eld-contentful-rich-text>/);
      const ans = m
        ? m[1]
            .replace(/<[^>]+>/g, '\n')
            .replace(/\n{2,}/g, '\n')
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .replace(/&#x27;|&#39;/g, "'")
            .trim()
        : null;
      return { q, ans };
    });
  });
  for (const d of data) {
    console.log('\n=== Q:', d.q);
    console.log(d.ans ? d.ans.slice(0, 1600) : d.err || 'NO ANSWER');
  }
  await browser.close();
})();
