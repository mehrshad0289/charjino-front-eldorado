// Session 22 — verify the two-capture variant switch on /ea-fc-boosting/b/142-4
const { chromium } = require('playwright');

const BASE = process.env.BASE || 'http://localhost:3100';
const P = [];

function expect(name, got, want) {
  const pass = want === ">" ? got >= 2 : typeof want === "object" ? JSON.stringify(got) === JSON.stringify(want) : got === want;
  console.log(`${pass ? "PASS" : "FAIL"} ${name}: got=${JSON.stringify(got)}${want === ">" ? " (>=2)" : ` want=${JSON.stringify(want)}`}`);
  if (!pass) P.push(name);
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1000 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 120)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 120)); });
  await page.goto(`${BASE}/ea-fc-boosting/b/142-4`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);

  const dom = () => page.evaluate(() => ({
    activeChip: document.querySelector('button[aria-pressed="true"]')?.textContent.trim(),
    cardTitles: [...document.querySelectorAll('form')].length && [...document.querySelectorAll('div.font-bold.text-\\[24px\\], div.text-\\[24px\\].font-bold')].map((e) => e.textContent.trim()),
    labels: [...document.querySelectorAll('form .mb-\\[6px\\], form div.mb-\\[6px\\]')].map((e) => e.textContent.trim()),
    comboboxValues: [...document.querySelectorAll('[role="combobox"] span.truncate, [role="combobox"] .grow span')].map((e) => e.textContent.trim()).slice(0, 4),
    hasAlert: !!document.querySelector('img[alt="Exclamation mark"]'),
    alertText: document.querySelector('img[alt="Exclamation mark"]')?.closest('div')?.parentElement?.querySelector('p.font-bold')?.textContent.trim() || null,
    getOffersBtns: [...document.querySelectorAll('button[aria-label="Get offers now"]')].filter((b) => b.offsetParent !== null).length,
    tradeShield: [...document.querySelectorAll('span')].filter((s) => s.textContent === 'TradeShield' && s.offsetParent !== null).length,
    cardBgs: [...document.querySelectorAll('img[alt="Background image"]')].map((i) => i.src.match(/%2F([0-9a-f]{8})/)[1]),
    cardIcons: [...document.querySelectorAll('img[alt="Card header icon"]')].filter((i) => i.offsetParent !== null).length,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  }));

  console.log('--- default (Division Rivals):');
  let d = await dom();
  expect('activeChip', d.activeChip, 'Division Rivals');
  expect('labels', d.labels, ['Current division', 'Platform', 'Desired division', 'Provide any additional information']);
  expect('hasAlert', d.hasAlert, true);
  expect('alertText', d.alertText, 'You already have an active request');
  expect('getOffersBtns (2 permanent band CTAs)', d.getOffersBtns, 2);
  expect('cardIcons', d.cardIcons, 2);
  expect('cardBgs', d.cardBgs, ['99cc743f', '8be903c8']);
  expect('overflow', d.overflow, 0);

  console.log('--- click Champions Finals:');
  await page.click('button:has-text("Champions Finals")');
  await page.waitForTimeout(300);
  d = await dom();
  expect('activeChip', d.activeChip, 'Champions Finals');
  expect('labels', d.labels, ['Current Rank', 'Desired Rank', 'Platform', 'Provide any additional information']);
  expect('comboboxValues', d.comboboxValues, ['Rank 15', 'Rank 1', 'PC - EA']);
  expect('hasAlert', d.hasAlert, false);
  expect('getOffersBtns (2 band + 1 panel)', d.getOffersBtns, 3);
  expect('tradeShield', d.tradeShield, 1);
  expect('cardBgs', d.cardBgs, ['92b3f9e9']);
  expect('cardIcons', d.cardIcons, 0);
  expect('overflow', d.overflow, 0);
  await page.screenshot({ path: '/tmp/boosting-cf-1920.png', fullPage: false });

  console.log('--- click back Division Rivals:');
  await page.click('button:has-text("Division Rivals")');
  await page.waitForTimeout(300);
  d = await dom();
  expect('activeChip', d.activeChip, 'Division Rivals');
  expect('hasAlert', d.hasAlert, true);

  console.log('--- click a non-captured chip (Gallery Boost):');
  await page.click('button:has-text("Gallery Boost")');
  await page.waitForTimeout(300);
  d = await dom();
  expect('activeChip unchanged', d.activeChip, 'Division Rivals');

  console.log('--- mobile @390 (default):');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(400);
  d = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  }));
  expect('@390 overflow', d.overflow, 0);
  expect('pageerrors', errors.length, 0);
  await browser.close();
  console.log(P.length ? `PROBLEMS: ${P.join('; ')}` : 'ALL PASS');
  process.exitCode = P.length ? 1 : 0;
})();
