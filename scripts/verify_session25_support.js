// Session 25 — verify /support/articles/8408997-seller-rules against the
// Seller-rules capture: geometry @1920, capture-exact values, sidebar/TOC
// structure, interactions, mobile overflow @390.
const { chromium } = require('playwright');

const BASE = process.env.BASE || 'http://localhost:3100';
const results = [];
const problems = [];
const check = (name, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  const detail = ok ? '' : '  got=' + JSON.stringify(got) + ' want=' + JSON.stringify(want);
  results.push((ok ? 'PASS ' : 'FAIL ') + name + detail);
  if (!ok) problems.push(name);
};

(async () => {
  const browser = await chromium.launch();

  // ---------- @1920 ----------
  {
    const ctx = await browser.newContext({ viewport: { width: 1920, height: 1000 } });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e).slice(0, 150)));
    await page.goto(`${BASE}/support/articles/8408997-seller-rules`, { waitUntil: 'networkidle', timeout: 60000 });

    const g = await page.evaluate(() => {
      const cs = (el) => (el ? getComputedStyle(el) : null);
      const info = (el) => {
        if (!el) return null;
        const s = cs(el);
        const r = el.getBoundingClientRect();
        return { w: Math.round(r.width), h: Math.round(r.height), x: Math.round(r.x), y: Math.round(r.y + scrollY), pos: s.position, fs: s.fontSize, lh: s.lineHeight, fw: +s.fontWeight, color: s.color, bg: s.backgroundColor, ff: s.fontFamily };
      };
      const q = (sel) => document.querySelector(sel);
      const qa = (sel) => [...document.querySelectorAll(sel)];
      const header = q('header[role="banner"]');
      const aside = q('aside[aria-label="Docs navigation"]');
      const h1 = q('h1');
      const desc = h1 ? h1.nextElementSibling : null;
      const time = q('time');
      const copyBtn = qa('button').find((b) => b.textContent.includes('Copy for LLM'));
      const moreBtn = q('button[aria-label="More article actions"]');
      const h2s = qa('article h2');
      const intro = q('article > p');
      const table = q('article table');
      const ths = qa('article th');
      const tds = qa('article td');
      const legend = q('legend');
      const feedbackBtns = legend ? [...legend.closest('fieldset').querySelectorAll('button')] : [];
      const related = q('section[aria-label="Related articles"], article ~ div a[href*="start-selling"]');
      const tocNav = q('nav[aria-label="On this page"]');
      const tocTitle = tocNav ? tocNav.firstElementChild : null;
      const tocItems = tocNav ? [...tocNav.querySelectorAll('a')] : [];
      const tocFirst = tocItems[0];
      const activeBar = tocNav ? tocNav.querySelector('span[aria-hidden="true"]') : null;
      const sideLinks = aside ? [...aside.querySelectorAll('a')] : [];
      const sellerRules = sideLinks.find((a) => a.textContent.trim() === 'Seller rules');
      const blueBars = aside ? [...aside.querySelectorAll('span')].filter((s) => cs(s) && cs(s).width === '2px' && cs(s).backgroundColor === 'rgb(2, 88, 217)') : [];
      const icons = aside ? [...aside.querySelectorAll('img')].filter((i) => (i.src || '').includes('.png')) : [];
      const chevrons = aside ? [...aside.querySelectorAll('img')].filter((i) => (i.src || '').includes('.svg')) : [];
      const expandBuying = q('button[aria-label="Collapse Buying"]');
      const crumb = q('nav[aria-label="Breadcrumb"]');
      const crumbText = crumb ? crumb.textContent.replace(/\s+/g, ' ').trim() : null;
      const search = q('button[aria-label="Search docs (Ctrl K)"]');
      const kbd = q('kbd');
      // no-extra-fees li structure
      const feeLi = qa('article li').find((li) => li.textContent.includes('No extra fees'));
      const feePs = feeLi ? [...feeLi.querySelectorAll(':scope > p')] : [];
      const feeNested = feeLi ? feeLi.querySelectorAll(':scope > ul > li').length : 0;
      const exceptionInLi = feeLi ? !![...feeLi.querySelectorAll(':scope > p b')].find((b) => b.textContent.includes('Exception:')) : false;
      const includesBold = feePs.length ? +cs(feePs[0]).fontWeight : null;
      // initial-response bold order
      const initLi = qa('article li').find((li) => li.textContent.includes('Initial response'));
      const initBold = initLi ? [...initLi.querySelectorAll('b')].map((b) => b.textContent.trim().slice(0, 24)) : [];
      const initApiRegular = initLi ? [...initLi.querySelectorAll('p')].some((p) => p.childNodes.length && p.textContent.includes('Messages sent through the seller API')) : false;
      return {
        header: { ...info(header), h: header ? Math.round(header.getBoundingClientRect().height) : null },
        logo: !!q('a[aria-label="Help Center home"] img'),
        navLinks: [...(q('nav[aria-label="Help center links"]')?.querySelectorAll('a') ?? [])].map((a) => a.textContent.trim()),
        lang: [...(header?.querySelectorAll('div') ?? [])].some((d) => d.textContent.trim() === 'English'),
        search: info(search),
        kbdFont: kbd ? cs(kbd).fontFamily : null,
        aside: info(aside),
        sideIconCount: icons.length,
        sideChevronCount: chevrons.length,
        blueBarCount: blueBars.length,
        blueBar: blueBars[0] ? { w: cs(blueBars[0]).width, h: cs(blueBars[0]).height, bg: cs(blueBars[0]).backgroundColor } : null,
        sellerRulesColor: sellerRules ? cs(sellerRules).color : null,
        crumbText,
        h1: info(h1),
        desc: info(desc),
        timeText: time ? time.textContent.trim() : null,
        copyBtn: copyBtn ? Math.round(copyBtn.getBoundingClientRect().height) : null,
        moreBtn: !!moreBtn,
        h2Count: h2s.length,
        h2Ids: h2s.map((h) => h.id),
        h2First: info(h2s[0]),
        intro: intro ? { fw: +cs(intro.querySelector('b') || intro).fontWeight, ta: cs(intro).textAlign } : null,
        tableRows: table ? table.querySelectorAll('tr').length : 0,
        thBg: ths[0] ? cs(ths[0]).backgroundColor : null,
        tdPadTop: tds[3] ? cs(tds[3]).paddingTop : null,
        legendText: legend ? legend.textContent.trim() : null,
        feedbackBtnCount: feedbackBtns.length,
        relatedOk: !!related,
        tocTitle: tocTitle ? { fs: cs(tocTitle).fontSize, fw: +cs(tocTitle).fontWeight } : null,
        tocPos: tocNav ? cs(tocNav.closest('div')).position : null,
        tocTop: tocNav ? Math.round(tocNav.closest('div').getBoundingClientRect().top + scrollY) : null,
        tocRight: tocNav ? Math.round(innerWidth - tocNav.closest('div').getBoundingClientRect().right) : null,
        tocW: tocNav ? Math.round(tocNav.closest('div').getBoundingClientRect().width) : null,
        tocItemCount: tocItems.length,
        tocItemFirst: tocFirst ? { fs: cs(tocFirst).fontSize, color: cs(tocFirst).color, href: tocFirst.getAttribute('href') } : null,
        tocBar: activeBar ? { w: cs(activeBar).width, h: cs(activeBar).height } : null,
        feePsCount: feePs.length,
        includesBold,
        feeNested,
        exceptionInLi,
        initBold,
      };
    });

    check('header fixed h-60 black', [g.header.pos, g.header.h, g.header.bg], ['fixed', 60, 'rgb(0, 0, 0)']);
    check('logo img present', g.logo, true);
    check('header nav links', g.navLinks, ['Explore Eldorado', 'Contact us']);
    check('language English present', g.lang, true);
    check('search pill kbd JetBrains Mono', [!!g.search, /JetBrains Mono/.test(g.kbdFont || '')], [true, true]);
    check('aside fixed 276 top-60 border', [g.aside.pos, g.aside.w, g.aside.y], ['fixed', 276, 60]);
    check('sidebar 6 png icons', g.sideIconCount, 6);
    check('sidebar chevron imgs >= 14', g.sideChevronCount >= 14, true);
    check('active article blue', g.sellerRulesColor, 'rgb(2, 88, 217)');
    check('single blue 2px bar in sidebar', [g.blueBarCount, g.blueBar && g.blueBar.w, g.blueBar && g.blueBar.h], [1, '2px', '16px']);
    check('breadcrumb text', g.crumbText.replace(/\s+/g, ''), 'AllCollectionsRulesandguidelinesSellerrules');
    check('h1 36/40.32 semibold', [g.h1.fs, g.h1.lh, g.h1.fw], ['36px', '40.32px', 600]);
    check('description 18/27.9 gray', [g.desc.fs, g.desc.lh, g.desc.color], ['18px', '27.9px', 'rgb(89, 89, 89)']);
    check('updated meta', g.timeText, 'Updated over a week ago');
    check('Copy-for-LLM h-32 + more btn', [g.copyBtn, g.moreBtn], [32, true]);
    check('8 h2 sections', g.h2Count, 8);
    check('h2 ids = capture hashes', g.h2Ids, ['h_888aa7be53', 'h_177602eb7b', 'h_d9c22283bf', 'h_361566e7a1', 'h_5611213f2e', 'h_3be8f054fc', 'h_80317bd49f', 'h_3767554cc0']);
    check('h2 22/27.5 semibold', [g.h2First.fs, g.h2First.lh, g.h2First.fw], ['22px', '27.5px', 600]);
    check('intro bold + justify', [g.intro.fw, g.intro.ta], [700, 'justify']);
    check('table 3x3 + th bg + td pt-2', [g.tableRows, g.thBg, g.tdPadTop], [3, 'rgba(232, 232, 232, 0.5)', '8px']);
    check('feedback legend + 2 buttons (no Submit)', [g.legendText, g.feedbackBtnCount], ['Did this answer your question?', 2]);
    check('related articles present', g.relatedOk, true);
    check('TOC fixed top-60 right-16 w-240', [g.tocPos, g.tocTop, g.tocRight, g.tocW], ['fixed', 60, 16, 240]);
    check('TOC title 13px semibold', [g.tocTitle.fs, g.tocTitle.fw], ['13px', 600]);
    check('TOC 8 items, first blue #h_888aa7be53', [g.tocItemCount, g.tocItemFirst.color, g.tocItemFirst.href], [8, 'rgb(2, 88, 217)', '#h_888aa7be53']);
    check('TOC first 2px bar', [g.tocBar && g.tocBar.w, g.tocBar && g.tocBar.h], ['2px', '16px']);
    check('no-extra-fees: plain "This includes" + nested 3 + Exception inside li', [g.includesBold, g.feeNested, g.exceptionInLi], [400, 3, true]);
    check('initial-response bolds = lead + mid-sentence', g.initBold.map((s) => s.slice(0, 12)), ['Initial resp', 'If theres no']);
    check('no page errors', errors, []);

    // --- interactions
    const buyingBefore = await page.evaluate(() => !![...document.querySelectorAll('a')].find((a) => a.textContent.trim() === 'Payments' && a.closest('aside')));
    await page.click('button[aria-label="Collapse Buying"]');
    const buyingAfter = await page.evaluate(() => ({
      paymentsGone: ![...document.querySelectorAll('aside a')].some((a) => a.textContent.trim() === 'Payments'),
      aria: document.querySelector('button[aria-label="Expand Buying"]') ? 'Expand Buying' : null,
    }));
    check('collapse Buying hides children + aria flips', [buyingBefore, buyingAfter.paymentsGone, buyingAfter.aria], [true, true, 'Expand Buying']);
    await page.click('button[aria-label="Expand Buying"]');
    const buyingRestored = await page.evaluate(() => !![...document.querySelectorAll('aside a')].find((a) => a.textContent.trim() === 'Payments'));
    check('re-expand Buying restores', buyingRestored, true);

    await ctx.close();
  }

  // ---------- @390 ----------
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/support/articles/8408997-seller-rules`, { waitUntil: 'networkidle', timeout: 60000 });
    const m = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      tocHidden: (() => { const nav = document.querySelector('nav[aria-label="On this page"]'); if (!nav) return true; let el = nav; while (el && el !== document.body) { if (getComputedStyle(el).display === 'none') return true; el = el.parentElement; } return false; })(),
      asideStatic: getComputedStyle(document.querySelector('aside[aria-label="Docs navigation"]')).position,
      status: 'ok',
    }));
    check('@390 overflow 0', m.overflow, 0);
    check('@390 TOC hidden', m.tocHidden, true);
    check('@390 aside static', m.asideStatic, 'static');
    await ctx.close();
  }

  console.log(results.join('\n'));
  console.log(problems.length ? `\n${problems.length} FAIL: ${problems.join(', ')}` : '\nALL PASS');
  await browser.close();
  process.exit(problems.length ? 1 : 0);
})();
