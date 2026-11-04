// Session 24b — deeper live probe: how is the shop FAQ structured on live?
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 900 } });
  const page = await ctx.newPage();
  await page.goto('https://www.eldorado.gg/playstation-plus/t/104', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(5000);
  const data = await page.evaluate(() => {
    const needle = 'Is topping up on Eldorado safe?';
    const html = document.documentElement.innerHTML;
    const at = html.indexOf(needle);
    return {
      found: at >= 0,
      // how many times each question appears
      counts: ['What is Eldorado.gg?', 'Is topping up on Eldorado safe?', 'How to top up using Eldorado?', 'refund and return policy', 'problems with my order', 'Why trust Eldorado?'].map(
        (q) => [q, (html.match(new RegExp(q.replace(/[?]/g, '\\?'), 'g')) || []).length]
      ),
      around: at >= 0 ? html.slice(at - 600, at + 1500).replace(/</g, '\n<').split('\n').filter((l) => /faq|accordion|button|p>|svg|aria/.test(l)).slice(0, 30) : [],
    };
  });
  console.log('found:', data.found);
  console.log('counts:', data.counts);
  console.log((data.around || []).join('\n').slice(0, 3000));
  await browser.close();
})();
