// Session 22 — full-site health sweep: every route @1920 + @390.
// Checks: HTTP status, horizontal overflow, console/page errors, broken imgs.
const { chromium } = require('playwright');

const BASE = process.env.BASE || 'http://localhost:3100';
const WIDTHS = [1920, 390];

// concrete instances for dynamic routes
const DYNAMIC = {
  '/blog/[category]': '/blog/steal-an-egg',
  '/blog/[category]/[slug]': '/blog/steal-an-egg/steal-an-egg-mutations-guide',
  '/efootball-accounts/oa/[id]': '/efootball-accounts/oa/2f48f97f-c412-48b0-c3a4-08df0a5485be',
  '/users/[username]/[[...tab]]': '/users/NewFloat-0una',
};

const routes = require('fs')
  .readFileSync(__dirname + '/all_routes.txt', 'utf8')
  .split('\n')
  .map((s) => s.trim())
  .filter(Boolean);

(async () => {
  const browser = await chromium.launch();
  const problems = [];
  let checked = 0;
  for (const route of routes) {
    const path = DYNAMIC[route] || route;
    for (const w of WIDTHS) {
      const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
      const page = await ctx.newPage();
      const errors = [];
      page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 150)); });
      page.on('pageerror', (e) => errors.push('PAGEERROR ' + String(e).slice(0, 150)));
      let status = 0;
      try {
        const resp = await page.goto(BASE + path, { waitUntil: 'networkidle', timeout: 60000 });
        status = resp.status();
        await page.waitForTimeout(600);
        const m = await page.evaluate(() => {
          const doc = document.documentElement;
          const overflow = doc.scrollWidth - doc.clientWidth;
          const broken = [...document.images]
            .filter((im) => im.complete && im.naturalWidth === 0 && im.src.startsWith('http'))
            .map((im) => im.src.slice(0, 90));
          const lazyHidden = [...document.images].filter((im) => !im.complete).length;
          return { overflow, broken, lazyHidden };
        });
        checked++;
        const bad = [];
        if (status !== 200) bad.push(`status=${status}`);
        if (m.overflow > 0) bad.push(`overflow=${m.overflow}`);
        if (m.broken.length) bad.push(`brokenImgs=${m.broken.length}:${m.broken.slice(0, 3).join(',')}`);
        if (errors.length) bad.push(`errors=${errors.length}:${errors.slice(0, 2).join(' | ')}`);
        if (bad.length) problems.push(`[${w}] ${path} — ${bad.join(' ; ')}`);
      } catch (e) {
        problems.push(`[${w}] ${path} — NAV FAIL ${String(e).slice(0, 150)}`);
      }
      await ctx.close();
    }
  }
  await browser.close();
  console.log(`checked ${checked} page-loads across ${routes.length} routes x ${WIDTHS.length} widths`);
  if (problems.length) {
    console.log('PROBLEMS:');
    problems.forEach((p) => console.log(' - ' + p));
    process.exitCode = 1;
  } else {
    console.log('ALL PASS (status 200, overflow 0, 0 broken imgs, 0 errors)');
  }
})();
