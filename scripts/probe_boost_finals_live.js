// Session 23 — live probe of eldorado.gg/ea-fc-boosting/b/142-4 after the
// user-pushed Champions-Finals capture (9f6e420). Verifies: active chip,
// config card anatomy (title/fields/values), customize panel CTA, and the
// @390 field stacking. Public page — no login needed.
const { chromium } = require('playwright');

(async () => {
  const b = await chromium.launch();
  for (const width of [1920, 390]) {
    const p = await b.newPage({ viewport: { width, height: 900 } });
    try {
      await p.goto('https://www.eldorado.gg/ea-fc-boosting/b/142-4', { waitUntil: 'domcontentloaded', timeout: 45000 });
      await p.waitForTimeout(4000);
      const res = await p.evaluate(() => {
        const txt = (sel) => Array.from(document.querySelectorAll(sel)).map((e) => e.textContent.trim());
        const chips = txt('button');
        const h1 = document.querySelector('h1')?.textContent || '';
        // config card: find "Current Rank" label
        const labels = Array.from(document.querySelectorAll('div')).filter(d => d.children.length === 0 && /Current Rank|Desired Rank|Platform|Current division|Desired division/.test(d.textContent.trim())).map(d => d.textContent.trim());
        const combos = Array.from(document.querySelectorAll('[role="combobox"]')).map(c => c.textContent.trim()).slice(0, 6);
        const btns = Array.from(document.querySelectorAll('button')).map(b2 => b2.textContent.trim()).filter(t => /Get offers now|Check request|Customize/i.test(t));
        // card titles 24px bold
        const titles = Array.from(document.querySelectorAll('div.font-bold')).map(d => d.textContent.trim()).filter(t => /Rivals|Finals|Boost|Request/.test(t)).slice(0, 10);
        return { h1, chips: chips.slice(0, 14), labels: [...new Set(labels)], combos, btns: [...new Set(btns)], titles };
      });
      console.log(`@${width}`, JSON.stringify(res, null, 1));
      await p.screenshot({ path: `/tmp/render/live-boost-${width}.png`, fullPage: false });
    } catch (e) {
      console.log(`@${width} ERROR`, e.message.slice(0, 200));
    }
    await p.close();
  }
  await b.close();
})();
