// Session 24 — verify Link change on HeaderBar/Footer: visual render + client-side nav.
const { chromium } = require('playwright');
const BASE = 'http://localhost:3100';

(async () => {
  const browser = await chromium.launch();
  for (const w of [1920, 390]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e).slice(0, 120)));
    await page.goto(BASE + '/xbox-game-pass', { waitUntil: 'networkidle' });
    // click the header logo -> should navigate client-side to /
    await page.click('a[aria-label="Eldorado logo"]');
    await page.waitForURL(BASE + '/', { timeout: 15000 });
    // next/link sets __NEXT_DATA hydration; verify no full reload happened via navigation API
    const navType = await page.evaluate(() => performance.getEntriesByType('navigation')[0].type);
    const logoVisible = await page.locator('header a[aria-label="Eldorado logo"]:visible').first().isVisible().catch(() => false);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    console.log(`[${w}] logoVisible=${logoVisible} navType=${navType} overflow=${overflow} errors=${errors.length}`);
    if (w === 1920) {
      // footer logo too
      await page.evaluate(() => document.querySelector('footer')?.scrollIntoView());
      await page.waitForTimeout(400);
      const footerLogo = await page.locator('footer a[aria-label="Eldorado logo"] svg, footer a[aria-label="Eldorado logo"] img').first().isVisible().catch(() => false);
      console.log(`[1920] footerLogoVisible=${footerLogo}`);
    }
    await ctx.close();
  }
  await browser.close();
  console.log('LINK CHECK DONE');
})();
