// Interaction + sanity sweep for gamepass + giftcard pages
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  for (const w of [1920, 390]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e).slice(0, 80)));
    await page.goto('http://localhost:3100/xbox-game-pass', { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(1500);
    const r = {};
    // region chip select (first Global chip, force)
    const chip = page.locator('button:has-text("Global")').first();
    await chip.click({ force: true });
    r.chipPressed = await chip.getAttribute('aria-pressed');
    // amount card select — click the visible one via evaluate
    r.cardSel = await page.evaluate(() => {
      const b = [...document.querySelectorAll('button[aria-label^="Select Xbox Premium - 3 Months"]')].find((x) => x.getBoundingClientRect().width > 0);
      if (!b) return 'not-found';
      b.click();
      return b.getAttribute('aria-pressed') + ' label=' + document.querySelector('[class*="text-graytext"]')?.parentElement?.textContent?.slice(0, 60);
    });
    await page.waitForTimeout(200);
    // FAQ accordion
    r.faq = await page.evaluate(() => {
      const b = [...document.querySelectorAll('button[aria-expanded]')].find((x) => x.getBoundingClientRect().width > 0);
      if (!b) return 'none';
      const before = b.getAttribute('aria-expanded');
      b.click();
      return before + '->clicked';
    });
    await page.waitForTimeout(300);
    // stepper +
    r.qty = await page.evaluate(() => {
      const b = [...document.querySelectorAll('button[aria-label="Increase quantity"]')].find((x) => x.getBoundingClientRect().width > 0);
      const inp = [...document.querySelectorAll('input[aria-label="Quantity picker field"]')].find((x) => x.getBoundingClientRect().width > 0);
      if (!b || !inp) return 'none';
      b.click();
      return getComputedStyle(inp).display === 'none' ? 'readonly-ok' : inp.value;
    });
    // go-to-page dropdown
    r.dropdown = await page.evaluate(() => {
      const b = [...document.querySelectorAll('button[aria-label="Single-select dropdown"]')].find((x) => x.getBoundingClientRect().width > 0);
      if (!b) return 'none';
      b.click();
      return 'clicked';
    });
    await page.waitForTimeout(250);
    r.options = await page.evaluate(() => document.querySelectorAll('[role="listbox"] [role="option"]').length);
    // add to cart visible
    r.atc = await page.evaluate(() => [...document.querySelectorAll('button[aria-label="Add to cart"]')].filter((x) => x.getBoundingClientRect().width > 0).length);
    r.overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    r.brokenImgs = await page.evaluate(() => [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && i.src).length);
    console.log(`gp @${w}: ${JSON.stringify(r)} pageErrors=${errors.length}`);
    await ctx.close();
  }
  for (const w of [1920, 390]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e).slice(0, 80)));
    const resp = await page.goto('http://localhost:3100/xbox-gift-card', { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(1200);
    const m = await page.evaluate(() => ({
      pageH: document.documentElement.scrollHeight,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      bannerSingleRow: !!document.querySelector('.flex.h-11.items-center.justify-between'),
      bannerStacked: !!document.querySelector('.flex.h-11.items-center.px-4'),
      reviewsHeading: (() => { const s = [...document.querySelectorAll('span')].find((e) => e.textContent.trim().startsWith('Trusted by thousands')); return s ? getComputedStyle(s).fontSize : 'none'; })(),
    }));
    console.log(`gift @${w}: ${resp.status()} ${JSON.stringify(m)} pageErrors=${errors.length}`);
    await ctx.close();
  }
  await browser.close();
})();
