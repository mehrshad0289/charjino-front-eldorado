// Sweep /xbox-game-pass at 390/768/1024/1536/1920 — screenshots + overflow + console errors
const { chromium } = require('playwright');

const WIDTHS = [390, 768, 1024, 1536, 1920];
const BASE = process.env.BASE || 'http://localhost:3100';
const OUT = '/tmp/gamepass-sweep';

(async () => {
  const fs = require('fs');
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const results = [];
  for (const w of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    const errors = [];
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 200)); });
    page.on('pageerror', (e) => errors.push('PAGEERROR ' + String(e).slice(0, 200)));
    const resp = await page.goto(`${BASE}/xbox-game-pass`, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(1200);
    const metrics = await page.evaluate(() => {
      const doc = document.documentElement;
      const overflow = doc.scrollWidth - doc.clientWidth;
      // key section probes
      const q = (sel) => document.querySelector(sel);
      const box = (sel) => { const el = q(sel); if (!el) return null; const r = el.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y + window.scrollY), w: Math.round(r.width), h: Math.round(r.height) }; };
      return {
        pageH: Math.round(doc.scrollHeight),
        overflow,
        banner: box('img[alt*="game pass" i], img[alt*="Game Pass" i]'),
        h1: box('h1'),
      };
    });
    await page.screenshot({ path: `${OUT}/local-${w}.png`, fullPage: true });
    results.push({ w, status: resp.status(), ...metrics, errors: errors.slice(0, 5) });
    await ctx.close();
  }
  await browser.close();
  for (const r of results) {
    console.log(`w=${r.w} status=${r.status} pageH=${r.pageH} overflow=${r.overflow} h1=${JSON.stringify(r.h1)} errors=${r.errors.length ? JSON.stringify(r.errors) : 0}`);
  }
})();
