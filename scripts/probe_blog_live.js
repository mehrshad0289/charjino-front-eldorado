/* Session 12 — probe LIVE eldorado.gg/blog vs LOCAL /blog: section offsets,
   footer variant details, featured excerpt clamp, card title metrics.
   Usage: NODE_PATH=$(npm root -g) node scripts/probe_blog_live.js */
const { chromium } = require("playwright");

const TARGETS = [
  ["LIVE", "https://www.eldorado.gg/blog/"],
  ["LOCAL", "http://localhost:3000/blog"],
];

async function probe(browser, label, url) {
  const page = await browser.newPage({ viewport: { width: 1920, height: 900 } });
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(4000);
  } catch (e) {
    console.log(label, "NAV FAIL", e.message.slice(0, 120));
    await page.close();
    return;
  }
  const data = await page.evaluate(() => {
    const out = {};
    const $ = (s) => document.querySelector(s);
    const $$ = (s) => [...document.querySelectorAll(s)];
    const rect = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const y = window.scrollY;
      return { top: Math.round(r.top + y), h: Math.round(r.height), w: Math.round(r.width), left: Math.round(r.left) };
    };
    out.pageH = document.documentElement.scrollHeight;

    // header
    out.header = rect(document.querySelector("header"));

    // featured card + excerpt
    const featuredLink = $$("a").find((a) =>
      (a.href || "").includes("mark-darrah")
    );
    out.featured = rect(featuredLink);
    if (featuredLink) {
      const overlay = featuredLink.querySelector("div.absolute");
      const h4 = featuredLink.querySelector("h4");
      out.featuredTitle = h4 ? { ...rect(h4), fontSize: getComputedStyle(h4).fontSize, fontFamily: getComputedStyle(h4).fontFamily.slice(0, 40), lines: Math.round(h4.getBoundingClientRect().height / parseFloat(getComputedStyle(h4).lineHeight || 36)) } : null;
      const ps = [...featuredLink.querySelectorAll("p")];
      if (ps.length) {
        const p = ps[0];
        const cs = getComputedStyle(p.parentElement);
        out.featuredExcerpt = {
          text: p.textContent.slice(0, 260),
          h: Math.round(p.getBoundingClientRect().height),
          fontSize: cs.fontSize,
          lineClamp: cs.webkitLineClamp || cs.getPropertyValue("-webkit-line-clamp") || "none",
          maxH: cs.maxHeight,
          overflow: cs.overflow,
          parentW: Math.round(p.parentElement.getBoundingClientRect().width),
        };
      }
      const overlayBox = featuredLink.querySelector("div.z-\\[2\\], div[class*='z-[2]']");
      if (overlayBox) {
        const cs = getComputedStyle(overlayBox);
        out.featuredOverlay = { padding: cs.padding, maxW: cs.maxWidth, w: Math.round(overlayBox.getBoundingClientRect().width) };
      }
    }

    // "The Latest" grid + first card title
    const grid = $$("ul").find((u) => u.className.includes("grid") && u.querySelectorAll("li a").length >= 8);
    if (grid) {
      const cs = getComputedStyle(grid);
      out.grid = { cols: cs.gridTemplateColumns, gap: cs.gap, w: Math.round(grid.getBoundingClientRect().width) };
      const a = grid.querySelector("li a");
      const titleDiv = a && [...a.querySelectorAll("div")].find((d) => d.textContent.trim().length > 20 && !d.querySelector("div"));
      if (titleDiv) {
        const tcs = getComputedStyle(titleDiv);
        out.cardTitle = { fontSize: tcs.fontSize, fontWeight: tcs.fontWeight, letterSpacing: tcs.letterSpacing, w: Math.round(titleDiv.getBoundingClientRect().width), fontFamily: tcs.fontFamily.slice(0, 40) };
      }
    }

    // footer
    const footer = document.querySelector("footer");
    out.footer = rect(footer);
    if (footer) {
      out.footerLang = !!footer.querySelector("button[aria-haspopup], [class*='language'], [class*='locale']");
      out.footerLangText = (footer.querySelector("button[aria-haspopup]") || {}).textContent || null;
      out.footerLinks = [...footer.querySelectorAll("ul li a")].slice(0, 26).map((a) => a.textContent.trim()).filter(Boolean);
      out.footerHasPreferredSource = !!footer.querySelector("img[alt*='preferred' i], a[aria-label*='preferred' i]");
      const fl = footer.querySelector("li a");
      if (fl) out.footerLinkStyle = { fontSize: getComputedStyle(fl).fontSize, lineHeight: getComputedStyle(fl).lineHeight, mb: getComputedStyle(fl.parentElement).marginBottom, textTransform: getComputedStyle(fl).textTransform };
      out.footerInner = rect(footer.querySelector("div"));
    }

    // highlights heading
    const h3 = $$("h3").find((h) => /skip the grind/i.test(h.textContent));
    out.highlightsH3 = h3 ? { ...rect(h3), fontSize: getComputedStyle(h3).fontSize, fontFamily: getComputedStyle(h3).fontFamily.slice(0, 40) } : null;

    // pagination
    const pag = $$("nav").find((n) => /next/i.test(n.textContent));
    out.pagination = rect(pag);
    if (pag) {
      const pill = pag.querySelector("a, span");
      const pcs = getComputedStyle(pill);
      out.pillStyle = { h: Math.round(pill.getBoundingClientRect().height), fontSize: pcs.fontSize, pad: pcs.padding, minW: pcs.minWidth };
    }
    return out;
  });
  console.log("=====", label, "=====");
  console.log(JSON.stringify(data, null, 1));
  await page.close();
}

(async () => {
  const browser = await chromium.launch();
  for (const [label, url] of TARGETS) await probe(browser, label, url);
  await browser.close();
})();
