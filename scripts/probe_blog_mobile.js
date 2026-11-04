/* Session 12 — mobile @390 probe: LIVE vs LOCAL /blog — header rows, sizes.
   Usage: NODE_PATH=$(npm root -g) node scripts/probe_blog_mobile.js */
const { chromium } = require("playwright");

const TARGETS = [
  ["LIVE", "https://www.eldorado.gg/blog/"],
  ["LOCAL", "http://localhost:3000/blog"],
];

(async () => {
  const browser = await chromium.launch();
  for (const [label, url] of TARGETS) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.waitForTimeout(4000);
    } catch (e) {
      console.log(label, "NAV FAIL", e.message.slice(0, 120));
      await page.close();
      continue;
    }
    const data = await page.evaluate(() => {
      const out = {};
      const $ = (s) => document.querySelector(s);
      const $$ = (s) => [...document.querySelectorAll(s)];
      const cs = (el, props) => {
        if (!el) return null;
        const c = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        const o = { w: Math.round(r.width), h: Math.round(r.height) };
        (props || []).forEach((p) => (o[p] = c.getPropertyValue(p)));
        return o;
      };

      // header structure: every direct child block of the header container
      const header = document.querySelector("header");
      out.headerH = header ? Math.round(header.getBoundingClientRect().height) : null;
      if (header) {
        out.headerRows = [...header.querySelectorAll(":scope > div > div > div > div")]
          .slice(0, 4)
          .map((d) => ({ cls: d.className.slice(0, 60), ...cs(d, ["display"]) }));
        const burger = header.querySelector('button[aria-label*="menu" i], button[aria-label*="burger" i]');
        out.burger = burger ? cs(burger) : null;
        const logo = header.querySelector("img[alt*='blog' i]");
        out.logoImg = logo ? cs(logo, ["width"]) : null;
        const shop = [...header.querySelectorAll("a")].find((a) => a.textContent.trim() === "SHOP");
        out.shopBtn = shop ? cs(shop, ["font-size", "min-width", "height"]) : null;
      }

      // The Latest heading
      const h3 = $$("h3").find((h) => /latest/i.test(h.textContent));
      out.latestH3 = h3 ? cs(h3, ["font-size", "text-align", "line-height", "letter-spacing"]) : null;
      if (h3) out.latestH3.parent = cs(h3.parentElement, ["text-align", "margin-bottom"]);

      // grid + first card
      const grid = $$("ul").find((u) => u.className.includes("grid") && u.querySelectorAll("li a").length >= 8);
      out.grid = grid ? cs(grid, ["grid-template-columns", "gap"]) : null;
      if (grid) {
        const li = grid.querySelector("li");
        out.cardLi = cs(li);
        const a = li.querySelector("a");
        out.cardA = cs(a, ["padding", "border-radius"]);
        const imgBox = a.querySelector("div");
        out.cardImgBox = cs(imgBox, ["width", "height", "min-width", "border", "border-radius"]);
        const titleDiv = [...a.querySelectorAll("div")].find((d) => d.textContent.trim().length > 20 && !d.querySelector("div"));
        out.cardTitle = titleDiv ? cs(titleDiv, ["font-size", "line-height"]) : null;
        const cat = a.querySelector(".uppercase, [class*='uppercase']");
        out.cardCat = cat ? cs(cat, ["font-size"]) : null;
      }

      // featured
      const featured = $$("a").find((a) => (a.href || "").includes("mark-darrah"));
      out.featured = featured ? cs(featured, ["height"]) : null;
      if (featured) {
        const h4 = featured.querySelector("h4");
        out.featTitle = h4 ? cs(h4, ["font-size", "line-height"]) : null;
        const overlay = featured.querySelector("div[class*='z-[2]'], div.z-\\[2\\]");
        out.featOverlay = overlay ? cs(overlay, ["padding", "max-width"]) : null;
      }

      // pagination
      const pag = $$("nav").find((n) => /next/i.test(n.textContent));
      out.pagination = pag ? cs(pag, ["gap", "margin-top"]) : null;
      if (pag) {
        const pill = pag.querySelector("span, a");
        out.pill = cs(pill, ["height", "font-size", "min-width", "padding", "border-radius"]);
        const next = [...pag.querySelectorAll("a")].pop();
        out.nextPill = next ? cs(next, ["height", "min-width"]) : null;
      }

      // highlights
      const hh = $$("h3").find((h) => /skip the grind/i.test(h.textContent));
      out.highlightsH3 = hh ? cs(hh, ["font-size", "line-height", "letter-spacing"]) : null;
      if (hh) out.highlightsH3.parent = cs(hh.parentElement, ["margin-bottom"]);
      const hlGrid = hh && hh.closest("section").querySelector("div.grid");
      out.hlGrid = hlGrid ? cs(hlGrid, ["grid-template-columns", "gap"]) : null;
      if (hlGrid) {
        const h4 = hlGrid.querySelector("h4");
        out.hlTitle = h4 ? cs(h4, ["font-size", "line-height"]) : null;
        const p = hlGrid.querySelector("p");
        out.hlText = p ? cs(p, ["font-size", "line-height"]) : null;
        const tile = hlGrid.querySelector("div.inline-flex, div[class*='inline-flex']");
        out.hlTile = tile ? cs(tile, ["width", "height", "border-radius", "margin-bottom"]) : null;
      }

      // footer
      const footer = document.querySelector("footer");
      out.footerH = footer ? Math.round(footer.getBoundingClientRect().height) : null;
      if (footer) {
        const fl = footer.querySelector("li a");
        out.footerLink = fl ? cs(fl, ["font-size", "line-height"]) : null;
        const li = footer.querySelector("li a") && footer.querySelector("li a").closest("li");
        out.footerLi = li ? cs(li, ["margin-bottom"]) : null;
        const logoImg = footer.querySelector("img");
        out.footerLogo = logoImg ? cs(logoImg, ["width", "height"]) : null;
        const payUl = footer.querySelector("ul");
        out.payUl = payUl ? cs(payUl, ["gap", "margin-bottom"]) : null;
        const payImg = payUl && payUl.querySelector("img");
        out.payImg = payImg ? cs(payImg, ["width", "height"]) : null;
      }
      return out;
    });
    console.log("=====", label, "@390 =====");
    console.log(JSON.stringify(data, null, 1));
    await page.close();
  }
  await browser.close();
})();
