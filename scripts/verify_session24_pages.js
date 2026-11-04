// Session 24 — verify the 3 new top-up shop pages locally:
// status / overflow / errors / broken imgs / key content needles +
// interactions (chips, amount select, FAQ, pagination, stepper) @1920/1536/390.
const { chromium } = require('playwright');

const BASE = 'http://localhost:3100';
const PAGES = [
  {
    path: '/amazon-prime',
    needles: ['Amazon', 'Subscription', 'Gift cards', 'Amount', 'Prime Video - 1 Month', 'Popular', '1.34', '-86%*', 'Game region', 'Global', 'Delivery time', 'ArsenicStore', 'Other sellers (13)', 'NOVA_GAMING', 'Go to page:', 'Trusted by thousands of players worldwide', 'Effortless buying process', 'Frequently Asked Questions', 'Why trust Eldorado?', 'Buy Amazon Prime Video Top-Up'],
    desktopOnly: ['In stock: 5'], // stepper is desktop-only per live @390
  },
  {
    path: '/playstation-plus',
    needles: ['PlayStation', 'Accounts', 'Subscription', 'Gift cards', 'Game region', 'Germany', 'Ukraine', 'No amount selected', 'Nothing found', 'Sorry, but nothing matched your filters or search terms.', 'Trusted by thousands of players worldwide', 'Frequently Asked Questions', 'Buy PlayStation Plus'],
    mobileOnly: ['Game region:'], // inline header per live psplus @390 (innerText renders "Game region:\nGermany")
  },
  {
    path: '/cod-points',
    needles: ['Call of Duty', 'CoD Points', 'Game platform', 'Xbox', 'Battlenet', 'PlayStation', 'Amount', '2400 CoD Points', 'Popular', '9.96', '-51%*', 'PowerXhub', 'Other sellers (8)', 'CNLTeam', 'Go to page:', 'Buy CoD Points Cheap', 'COD Points for Sale'],
    desktopOnly: ['In stock: 5'],
  },
];

(async () => {
  const browser = await chromium.launch();
  let allOk = true;
  for (const p of PAGES) {
    for (const w of [1920, 1536, 390]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
      const page = await ctx.newPage();
      const errors = [];
      page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 120)); });
      page.on('pageerror', (e) => errors.push('PAGEERROR ' + String(e).slice(0, 120)));
      const resp = await page.goto(BASE + p.path, { waitUntil: 'networkidle', timeout: 60000 });
      await page.waitForTimeout(600);
      const m = await page.evaluate(() => {
        const overflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
        const broken = [...document.images]
          .filter((im) => im.complete && im.naturalWidth === 0 && im.src.startsWith('http'))
          .map((im) => im.src.slice(0, 90));
        return { overflow, broken, text: document.body.innerText };
      });
      const missing = p.needles.filter((n) => !m.text.includes(n));
      if (w === 1920 && p.desktopOnly) missing.push(...p.desktopOnly.filter((n) => !m.text.includes(n)));
      if (w === 390 && p.mobileOnly) missing.push(...p.mobileOnly.filter((n) => !m.text.includes(n)));
      const bad = [];
      if (resp.status() !== 200) bad.push(`status=${resp.status()}`);
      if (m.overflow > 0) bad.push(`overflow=${m.overflow}`);
      if (m.broken.length) bad.push(`broken=${m.broken.length}`);
      if (errors.length) bad.push(`errors=${errors.length}`);
      if (missing.length) bad.push(`missing: ${missing.join(' | ').slice(0, 200)}`);
      console.log(`[${w}] ${p.path} ${bad.length ? 'FAIL ' + bad.join(' ; ') : 'PASS'}`);
      if (bad.length) allOk = false;
      if (w === 390 && p.path === '/amazon-prime') {
        // interaction checks on prime mobile: select 12-months card
        const card = page.locator('[aria-label="Select Prime Video - 12 Months"]').first();
        await card.click();
        const label = await page.locator('span:has-text("Amount:")').first().textContent();
        console.log('  prime select 12M -> Amount label:', JSON.stringify(label));
      }
      if (w === 1920 && p.path === '/cod-points') {
        const chip = page.locator('button:has-text("Battlenet")').first();
        await chip.click();
        const pressed = await chip.getAttribute('aria-pressed');
        console.log('  cod Battlenet aria-pressed after click:', pressed);
        const faqBtn = page.locator('button:has-text("What is Eldorado.gg?")').first();
        await faqBtn.click();
        const expanded = await faqBtn.getAttribute('aria-expanded');
        console.log('  cod FAQ expanded:', expanded);
      }
      await ctx.close();
    }
  }
  await browser.close();
  console.log(allOk ? 'ALL 390/1536/1920 CHECKS PASS' : 'SOME CHECKS FAILED');
})();
