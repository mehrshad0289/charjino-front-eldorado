// Session 22 — verify /dashboard/messages against the messages-notempty capture:
// geometry @1920, interactions (chips + toggle), mobile overflow @390.
const { chromium } = require('playwright');

const BASE = process.env.BASE || 'http://localhost:3100';

(async () => {
  const browser = await chromium.launch();
  const results = [];
  const problems = [];

  // --- geometry @1920
  {
    const ctx = await browser.newContext({ viewport: { width: 1920, height: 1000 } });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e).slice(0, 150)));
    await page.goto(`${BASE}/dashboard/messages`, { waitUntil: 'networkidle', timeout: 60000 });
    const g = await page.evaluate(() => {
      const box = (sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: Math.round(r.x), y: Math.round(r.y + scrollY), w: Math.round(r.width), h: Math.round(r.height) };
      };
      const chat = document.querySelector('div[aria-label="Chat"]');
      const chips = [...document.querySelectorAll('button[aria-label="All"], button[aria-label="Boosting"], button[aria-label="Orders"], button[aria-label="Support"], button[aria-label="Pre-purchase"]')];
      const allBtn = document.querySelector('button[aria-label="All"]');
      const boostBtn = document.querySelector('button[aria-label="Boosting"]');
      const allStyle = allBtn ? getComputedStyle(allBtn) : null;
      const boostStyle = boostBtn ? getComputedStyle(boostBtn) : null;
      const toggle = document.querySelector('input[aria-label="Unread messages only"]');
      const track = toggle ? toggle.nextElementSibling : null;
      const knob = track ? track.nextElementSibling : null;
      const trackR = track ? track.getBoundingClientRect() : null;
      const knobR = knob ? knob.getBoundingClientRect() : null;
      return {
        wrapper: box('main .relative.mt-\\[14px\\]'),
        h1: box('h1'),
        chatBox: chat ? { w: Math.round(chat.getBoundingClientRect().width), h: Math.round(chat.getBoundingClientRect().height) } : null,
        chipCount: chips.length,
        allBg: allStyle ? allStyle.backgroundColor : null,
        allColor: allStyle ? allStyle.color : null,
        allH: allBtn ? Math.round(allBtn.getBoundingClientRect().height) : null,
        allW: allBtn ? Math.round(allBtn.getBoundingClientRect().width) : null,
        boostBg: boostStyle ? boostStyle.backgroundColor : null,
        track: trackR ? { w: Math.round(trackR.width), h: Math.round(trackR.height) } : null,
        knob: knobR ? { w: Math.round(knobR.width), h: Math.round(knobR.height) } : null,
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    });
    const exp = {
      wrapperH: 900, wrapperW: 1048, chipCount: 5, allH: 42,
      allBg: 'rgb(34, 33, 39)', allColor: 'rgb(255, 255, 255)',
      boostBg: 'rgb(244, 244, 244)', trackW: 48, trackH: 20, knobW: 24, knobH: 24,
    };
    const checks = [
      ['wrapper.h', g.wrapper && g.wrapper.h, exp.wrapperH],
      ['wrapper.w', g.wrapper && g.wrapper.w, exp.wrapperW],
      ['chat.w', g.chatBox && g.chatBox.w, 1000], // >=
      ['chipCount', g.chipCount, exp.chipCount],
      ['all.h', g.allH, exp.allH],
      ['all.bg', g.allBg, exp.allBg],
      ['all.color', g.allColor, exp.allColor],
      ['boost.bg', g.boostBg, exp.boostBg],
      ['track.w', g.track && g.track.w, exp.trackW],
      ['track.h', g.track && g.track.h, exp.trackH],
      ['knob.w', g.knob && g.knob.w, exp.knobW],
      ['knob.h', g.knob && g.knob.h, exp.knobH],
      ['overflow', g.overflow, 0],
    ];
    for (const [name, got, want] of checks) {
      const pass = name === 'chat.w' ? got >= want : got === want;
      results.push(`${pass ? 'PASS' : 'FAIL'} ${name}: got=${got} want=${want}${name === 'chat.w' ? '+' : ''}`);
      if (!pass) problems.push(`${name}=${got} (want ${want})`);
    }
    // badges
    const badges = await page.evaluate(() => {
      const spans = [...document.querySelectorAll('button span')].filter((s) => /^(26|9\+)$/.test(s.textContent.trim()));
      return spans.map((s) => { const r = s.getBoundingClientRect(); const b = s.closest('button').getBoundingClientRect();
        return { text: s.textContent.trim(), btn: s.closest('button').getAttribute('aria-label'), overhang: Math.round(b.right - r.right), top: Math.round(r.top - b.top) }; });
    });
    results.push(`badges: ${JSON.stringify(badges)}`);
    if (badges.length !== 2) problems.push(`badge count ${badges.length}`);

    // --- interactions: chip select + toggle flip
    await page.click('button[aria-label="Boosting"]');
    const afterChip = await page.evaluate(() => ({
      boostBg: getComputedStyle(document.querySelector('button[aria-label="Boosting"]')).backgroundColor,
      allBg: getComputedStyle(document.querySelector('button[aria-label="All"]')).backgroundColor,
    }));
    const chipOK = afterChip.boostBg === 'rgb(34, 33, 39)' && afterChip.allBg === 'rgb(244, 244, 244)';
    results.push(`${chipOK ? 'PASS' : 'FAIL'} chip select: All→Boosting styles swapped`);
    if (!chipOK) problems.push('chip select failed');
    await page.click('input[aria-label="Unread messages only"]');
    await page.waitForTimeout(200);
    const afterToggle = await page.evaluate(() => {
      const t = document.querySelector('input[aria-label="Unread messages only"]');
      const track = t.nextElementSibling, knob = track.nextElementSibling;
      return { checked: t.checked, trackBg: getComputedStyle(track).backgroundColor, knobBg: getComputedStyle(knob).backgroundColor, knobLeft: Math.round(knob.getBoundingClientRect().left) };
    });
    const tOK = afterToggle.checked && afterToggle.trackBg === 'rgba(71, 131, 255, 0.2)' && afterToggle.knobBg === 'rgb(71, 131, 255)';
    results.push(`${tOK ? 'PASS' : 'FAIL'} toggle ON: checked, track ${afterToggle.trackBg}, knob ${afterToggle.knobBg}`);
    if (!tOK) problems.push('toggle flip failed');
    // back to All + off for the record
    if (errors.length) problems.push(`pageerrors: ${errors.join(' | ')}`);
    await ctx.close();
  }

  // --- mobile @390
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/dashboard/messages`, { waitUntil: 'networkidle', timeout: 60000 });
    const m = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      chipRowWraps: (() => { const row = document.querySelector('button[aria-label="Boosting"]').parentElement.parentElement; return row.getBoundingClientRect().height > 60; })(),
    }));
    results.push(`${m.overflow === 0 ? 'PASS' : 'FAIL'} @390 overflow=${m.overflow}, chips wrapped=${m.chipRowWraps}`);
    if (m.overflow !== 0) problems.push(`@390 overflow ${m.overflow}`);
    await page.screenshot({ path: '/tmp/messages-390.png', fullPage: true });
    await ctx.close();
  }

  await browser.close();
  results.forEach((r) => console.log(r));
  console.log(problems.length ? `PROBLEMS: ${problems.join(' ; ')}` : 'ALL PASS');
  process.exitCode = problems.length ? 1 : 0;
})();
