const { chromium } = require('playwright');

// Probe v2: find the REAL search dropdown (contains "Popular categories" or the search input), dump structure.
(async () => {
  const b = await chromium.launch();

  for (const width of [1920, 390]) {
    const p = await b.newPage({ viewport: { width, height: 1080 } });
    await p.goto('https://www.eldorado.gg/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await p.waitForTimeout(2500);
    // dismiss cookie banners if any
    await p.evaluate(() => {
      document.querySelectorAll('button').forEach((bt) => {
        const t = (bt.textContent || '').toLowerCase();
        if (t.includes('accept') || t.includes('agree') || t.includes('got it')) bt.click();
      });
    });
    await p.waitForTimeout(800);
    const clicked = await p.evaluate(() => {
      const els = [...document.querySelectorAll('input[placeholder*="Search for games"], button[aria-label*="earch"], [role="button"]')];
      for (const el of els) {
        if ((el.getAttribute('placeholder') || '').includes('Search for games')) {
          el.click();
          return 'input';
        }
      }
      // fallback: click any header search-ish button
      const hb = [...document.querySelectorAll('header button')].find((x) =>
        (x.getAttribute('aria-label') || '').toLowerCase().includes('search')
      );
      if (hb) {
        hb.click();
        return 'header button';
      }
      return null;
    });
    console.log(`[${width}] clicked:`, clicked);
    await p.waitForTimeout(1800);

    const info = await p.evaluate(() => {
      // any element whose text starts with "Popular categories"
      const all = [...document.querySelectorAll('div, section')];
      const host = all.find((e) => e.querySelector('input[placeholder*="Search for games"]') && e.textContent.includes('Popular categories'));
      if (!host) return { found: false, dialogs: document.querySelectorAll('[role="dialog"]').length, inputs: document.querySelectorAll('input').length };
      const panel = host.querySelector('input[placeholder*="Search for games"]').closest('div[class*="rounded"], div[style], section') || host;
      const pcs = getComputedStyle(panel);
      const inp = host.querySelector('input[placeholder*="Search for games"]');
      const ics = getComputedStyle(inp);
      const items = [...host.querySelectorAll('a')]
        .filter((a) => a.querySelector('img'))
        .slice(0, 14)
        .map((a) => ({
          t: a.textContent.trim().slice(0, 44),
          href: (a.getAttribute('href') || '').replace('https://www.eldorado.gg', ''),
          img: (a.querySelector('img') || {}).src,
          ih: a.querySelector('img') ? getComputedStyle(a.querySelector('img')).height : null,
          rowh: getComputedStyle(a).height,
        }));
      const bodyText = host.innerText.split('\n').map((s) => s.trim()).filter(Boolean).slice(0, 25);
      return {
        found: true,
        panel: { bg: pcs.backgroundColor, radius: pcs.borderRadius, w: pcs.width, maxH: pcs.maxHeight, shadow: pcs.boxShadow.slice(0, 80) },
        input: { bg: ics.backgroundColor, color: ics.color, h: ics.height, radius: ics.borderRadius, ph: inp.placeholder },
        nImgLinks: host.querySelectorAll('a img').length,
        items,
        bodyText,
      };
    });
    console.log(`[${width}]`, JSON.stringify(info, null, 1).slice(0, 3500));
    await p.screenshot({ path: `docs/ui-ux/screenshots/session13/live-search-${width}.png` });
    await p.close();
  }
  await b.close();
  console.log('done');
})().catch((e) => {
  console.error('ERR', e.message);
  process.exit(1);
});
