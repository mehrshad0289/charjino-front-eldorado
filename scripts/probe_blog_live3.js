/* Session 12 — final micro-probe @390 LIVE: article card metrics + CTA. */
const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto("https://www.eldorado.gg/blog/", { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(4000);
  const d = await page.evaluate(() => {
    const o = {};
    const m = (el, props) => {
      if (!el) return null;
      const c = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      const out = { left: Math.round(r.left), top: Math.round(r.top + scrollY), w: Math.round(r.width), h: Math.round(r.height) };
      (props || []).forEach((p) => (out[p] = c.getPropertyValue(p)));
      return out;
    };
    // article card via href
    const a = [...document.querySelectorAll("a")].find((x) => (x.href || "").includes("steal-an-egg-mutations-guide"));
    o.cardA = m(a, ["padding", "border-radius"]);
    if (a) {
      const imgBox = a.querySelector("div");
      o.cardImg = m(imgBox, ["width", "height", "min-width", "border", "border-radius"]);
      const divs = [...a.querySelectorAll("div")];
      const cat = divs.find((x) => getComputedStyle(x).textTransform === "uppercase");
      o.cardCat = m(cat, ["font-size", "margin-bottom"]);
      const title = divs.find((x) => x.textContent.length > 25 && !x.querySelector("div") && getComputedStyle(x).textTransform !== "uppercase");
      o.cardTitle = m(title, ["font-size", "line-height", "margin-bottom"]);
      const meta = divs.find((x) => /min read/.test(x.textContent));
      o.cardMeta = m(meta, ["font-size"]);
      const metaLi = a.querySelector("ul li");
      o.cardMetaLi = m(metaLi, ["font-size"]);
    }
    // the grid/list container of cards
    const ul = a && a.closest("ul");
    o.cardsUl = m(ul, ["grid-template-columns", "gap"]);
    const sect = ul && ul.closest("section");
    const cont = sect && sect.querySelector(":scope > div");
    o.sectionCont = m(cont, ["padding-left", "padding-right", "max-width"]);
    // heading container
    const h3 = [...document.querySelectorAll("h3")].find((h) => /latest/i.test(h.textContent));
    o.latestH3Box = m(h3);
    o.latestCont = m(h3 && h3.closest("section").querySelector(":scope > div"), ["padding-left", "padding-right"]);
    // CTA banner
    const cta = [...document.querySelectorAll("a")].find((x) => x.querySelector("img[alt*='halloween' i]"));
    o.ctaA = m(cta);
    const ctaCont = cta && cta.closest("section").querySelector(":scope > div");
    o.ctaCont = m(ctaCont, ["padding-left", "padding-right"]);
    const ctaImg = cta && cta.querySelector("img");
    o.ctaImg = m(ctaImg);
    // footer logo + socials + badge sizes
    const footer = document.querySelector("footer");
    const fimgs = [...footer.querySelectorAll("img")].map((i) => ({ alt: (i.alt || "").slice(0, 24), ...m(i, ["width", "height"]) }));
    o.footerImgs = fimgs;
    // footer columns layout @390
    const helpA = [...footer.querySelectorAll("a")].find((x) => x.textContent.trim() === "Help Center");
    const col = helpA && helpA.closest("div.grow, div[class*='grow']");
    o.footerCol = m(col, ["max-width", "padding"]);
    return o;
  });
  console.log(JSON.stringify(d, null, 1));
  await browser.close();
})();
