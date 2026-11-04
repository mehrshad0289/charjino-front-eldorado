// Session 25 — gift-card shop page (gamepass capture) mobile->desktop sweep.
// Captures screenshots + health metrics for LOCAL /xbox-game-pass and LIVE
// eldorado.gg/xbox-game-pass/t/103?attribute_value_id=xbox-ultimate-1-month
// at the mandatory 390 / 1536 / 1920 widths.
const { chromium } = require('playwright');
const fs = require('fs');

const OUT = '/tmp/session25';
fs.mkdirSync(OUT, { recursive: true });

const WIDTHS = [390, 1536, 1920];
const LOCAL = 'http://localhost:3100/xbox-game-pass';
const LIVE =
  'https://www.eldorado.gg/xbox-game-pass/t/103?attribute_value_id=xbox-ultimate-1-month';

async function capture(browser, tag, url, w) {
  const ctx = await browser.newContext({
    viewport: { width: w, height: 900 },
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    locale: 'en-US',
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text().slice(0, 120));
  });
  page.on('pageerror', (e) => errors.push('PAGEERROR ' + String(e).slice(0, 120)));
  let status = 0;
  try {
    const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
    status = resp.status();
    await page.waitForTimeout(2500);
    // accept cookies on the live site
    const btn = page.locator('#onetrust-accept-btn-handler');
    if (await btn.count()) {
      try { await btn.click({ timeout: 3000 }); } catch {}
      await page.waitForTimeout(1200);
    }
    // scroll through to force lazy content
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += 800) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 100));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(1200);
    const m = await page.evaluate(() => {
      const doc = document.documentElement;
      const broken = [...document.images]
        .filter((im) => im.complete && im.naturalWidth === 0 && im.src.startsWith('http'))
        .map((im) => im.src.slice(0, 100));
      return {
        pageH: Math.round(doc.scrollHeight),
        overflow: doc.scrollWidth - doc.clientWidth,
        broken,
      };
    });
    await page.screenshot({ path: `${OUT}/${tag}-${w}.png`, fullPage: true });
    console.log(
      `${tag} w=${w} status=${status} pageH=${m.pageH} overflow=${m.overflow}` +
        (m.broken.length ? ` broken=${m.broken.length}:${m.broken.slice(0, 3).join(',')}` : '') +
        (errors.length ? ` errors=${errors.length}:${errors.slice(0, 2).join(' | ')}` : '')
    );
  } catch (e) {
    console.log(`${tag} w=${w} FAILED: ${String(e).slice(0, 160)}`);
  }
  await ctx.close();
}

(async () => {
  const browser = await chromium.launch({
    args: ['--disable-blink-features=AutomationControlled'],
  });
  for (const w of WIDTHS) await capture(browser, 'local', LOCAL, w);
  for (const w of WIDTHS) await capture(browser, 'live', LIVE, w);
  await browser.close();
})();
