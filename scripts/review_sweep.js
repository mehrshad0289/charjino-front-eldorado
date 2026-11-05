/* Full-site sweep: every route from /pagelist (+ dynamic samples) x 3 widths.
   Checks: HTTP 200, horizontal overflow, visible broken images (after lazy
   settle), console/page errors. Rebuilt 2026-11-04 (recycle lost previous). */
const { chromium } = require('playwright');

const BASE = process.env.BASE || 'http://localhost:3112';
const WIDTHS = [1920, 768, 390];

async function settleLazy(page) {
  await page.evaluate(async () => {
    await new Promise((res) => {
      let y = 0;
      const step = () => {
        y += 800;
        window.scrollTo(0, y);
        if (y < document.body.scrollHeight) setTimeout(step, 60);
        else res();
      };
      step();
    });
  });
  await page.waitForLoadState('networkidle').catch(() => {});
  // poll until visible images have settled (max ~4s)
  for (let i = 0; i < 8; i++) {
    const pending = await page.evaluate(
      () =>
        [...document.images].filter(
          (im) => im.offsetParent !== null && im.complete === false
        ).length
    );
    if (pending === 0) break;
    await page.waitForTimeout(500);
  }
}

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await ctx.newPage();

  // 1) scrape route list from /pagelist
  await page.goto(`${BASE}/pagelist`, { waitUntil: 'networkidle' });
  const routes = await page.evaluate(() =>
    [...new Set([...document.querySelectorAll('a[href^="/"]')].map((a) => a.getAttribute('href')))]
      .filter((h) => !h.startsWith('/http'))
      .map((h) => h.split('?')[0].split('#')[0].replace(/\/$/, '') || '/')
  );
  // dynamic samples not linked from pagelist
  const extra = [
    '/blog/steal-an-egg/steal-an-egg-mutations-guide',
    '/efootball-accounts/oa/2f48f97f-c412-48b0-c3a4-08df0a5485be',
    '/users/NewFloat-0una',
    '/users/NewFloat-0una/shop',
    '/users/NewFloat-0una/reviews',
  ];
  const all = [...new Set([...routes, ...extra])];
  console.log(`routes scraped: ${all.length}`);

  let problems = 0;
  const report = [];
  for (const w of WIDTHS) {
    const pg = await ctx.newPage();
    await pg.setViewportSize({ width: w, height: 1080 });
    const errors = [];
    pg.on('pageerror', (e) => errors.push(String(e).slice(0, 120)));
    pg.on('console', (m) => {
      if (m.type() === 'error') errors.push(m.text().slice(0, 120));
    });
    for (const r of all) {
      try {
        const resp = await pg.goto(`${BASE}${r}`, { waitUntil: 'networkidle', timeout: 30000 });
        await settleLazy(pg);
        const status = resp ? resp.status() : 0;
        const overflow = await pg.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
        const broken = await pg.evaluate(
          () =>
            [...document.images].filter(
              (im) => im.offsetParent !== null && (!im.complete || im.naturalWidth === 0)
            ).length
        );
        const realErrors = errors.splice(0).filter(
          (e) => !/net::|Failed to load resource|the server responded with a status/.test(e) || status !== 200
        );
        if (status !== 200 || overflow || broken > 0 || realErrors.length) {
          problems++;
          report.push(`  [${w}] ${r} -> status=${status} overflow=${overflow} broken=${broken} errors=${realErrors.length} ${realErrors[0] || ''}`);
        }
      } catch (e) {
        problems++;
        report.push(`  [${w}] ${r} -> EXCEPTION ${String(e).slice(0, 100)}`);
      }
    }
    await pg.close();
  }
  console.log(`probed ${all.length} routes x ${WIDTHS.length} widths; problems: ${problems}`);
  if (report.length) console.log(report.join('\n'));
  await browser.close();
  process.exit(problems ? 1 : 0);
})();
