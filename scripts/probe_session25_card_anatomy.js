// Session 25 — extract the LIVE amount-card anatomy on the gamepass page
// (one discounted card + one non-discounted card + the amount label row),
// to arbitrate capture vs current local component styling.
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    args: ['--disable-blink-features=AutomationControlled'],
  });
  const ctx = await browser.newContext({
    viewport: { width: 1920, height: 900 },
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    locale: 'en-US',
  });
  const page = await ctx.newPage();
  await page.goto(
    'https://www.eldorado.gg/xbox-game-pass/t/103?attribute_value_id=xbox-ultimate-1-month',
    { waitUntil: 'domcontentloaded', timeout: 90000 }
  );
  await page.waitForTimeout(2500);
  const btn = page.locator('#onetrust-accept-btn-handler');
  if (await btn.count()) { try { await btn.click({ timeout: 3000 }); } catch {} }
  await page.waitForTimeout(1500);

  const data = await page.evaluate(() => {
    const out = {};
    // amount label row
    const label = [...document.querySelectorAll('div')].find((d) =>
      d.children.length === 0 && /^Amount\s*:/.test(d.textContent.trim())
    );
    out.amountLabel = label ? label.parentElement.innerText.replace(/\n/g, ' | ') : null;
    out.allAria = [...document.querySelectorAll('[aria-label]')]
      .map((e) => e.getAttribute('aria-label'))
      .filter((l) => /select|essential|amount|region/i.test(l))
      .slice(0, 25);
    // find the Essential 1 Month card (aria-label may carry a trailing space)
    const card =
      document.querySelector('[aria-label="Select Xbox Essential - 1 Month"]') ||
      [...document.querySelectorAll('[aria-label]')].find((e) =>
        /Essential - 1 Month/i.test(e.getAttribute('aria-label') || '')
      );
    if (!card) return { ...out, card: null };
    const texts = [...card.querySelectorAll('div,span')].filter(
      (n) => n.children.length === 0 && n.textContent.trim()
    );
    out.cardTexts = texts.map((n) => {
      const cs = getComputedStyle(n);
      const r = n.getBoundingClientRect();
      return {
        t: n.textContent.trim().slice(0, 40),
        size: cs.fontSize,
        weight: cs.fontWeight,
        color: cs.color,
        y: Math.round(r.top),
        strike: cs.textDecorationLine,
      };
    });
    // per-month footer present?
    out.hasPerMonth = card.innerText.includes('/ month');
    // chip (Popular/Best Value/-25%)
    const chip = card.querySelector('span');
    out.cardHTMLSnip = card.outerHTML.slice(0, 300);
    // card grid: how many columns?
    const grid = card.parentElement.parentElement;
    out.gridCols = getComputedStyle(grid).gridTemplateColumns;
    // region chips active state
    const activeChip = [...document.querySelectorAll('button')].find((b) =>
      b.textContent.trim() === 'Europe'
    );
    if (activeChip) {
      const cs = getComputedStyle(activeChip);
      out.activeRegion = {
        border: cs.borderColor, bg: cs.backgroundColor, fw: cs.fontWeight,
      };
    }
    return out;
  });
  console.log(JSON.stringify(data, null, 1));
  await browser.close();
})();
