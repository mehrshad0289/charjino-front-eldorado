/* Session 12 — focused LIVE probes to finalize /blog fixes.
   @390: header rows content, featured top/padding, card metrics, highlights,
         footer metrics.
   @640/768/1024: "The Latest" h3 alignment breakpoint.
   Usage: NODE_PATH=$(npm root -g) node scripts/probe_blog_live2.js */
const { chromium } = require("playwright");
const URL = "https://www.eldorado.gg/blog/";

async function probe390(browser) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(4000);
  const d = await page.evaluate(() => {
    const o = {};
    const $ = (s) => document.querySelector(s);
    const $$ = (s) => [...document.querySelectorAll(s)];
    const m = (el, props) => {
      if (!el) return null;
      const c = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      const out = { top: Math.round(r.top + scrollY), w: Math.round(r.width), h: Math.round(r.height) };
      (props || []).forEach((p) => (out[p] = c.getPropertyValue(p)));
      return out;
    };

    // header: any Games/Codes buttons inside header? second row?
    const header = $("header");
    const btns = [...header.querySelectorAll("button, a")].map((b) => ({
      t: b.textContent.trim().slice(0, 20),
      ...m(b, ["font-size", "height"]),
    }));
    o.headerButtons = btns.slice(0, 8);
    o.headerChildren = [...header.querySelectorAll("div")].slice(0, 6).map((d) => ({ c: d.className.slice(0, 70), ...m(d) }));

    // featured card top + overlay padding
    const feat = $$("a").find((a) => (a.href || "").includes("mark-darrah"));
    o.featured = feat && m(feat, ["height"]);
    if (feat) {
      const h4 = feat.querySelector("h4");
      const wrap = h4 && h4.parentElement;
      o.featWrap = wrap && m(wrap, ["padding", "max-width", "width"]);
      o.featDate = feat.querySelector("div") && m(feat.querySelector("div"), ["font-size", "margin-bottom"]);
      o.featExcerpt = (() => {
        const p = feat.querySelector("p");
        return p && m(p, ["font-size", "line-height", "-webkit-line-clamp"]);
      })();
    }

    // article list (flexible): find ul containing article links
    const artUl = $$("ul").find((u) => u.querySelector("a[href*='/blog/']") && u !== $("footer ul"));
    o.artUl = artUl && m(artUl, ["display", "grid-template-columns", "gap"]);
    if (artUl) {
      const li = artUl.querySelector("li");
      o.artLi = m(li);
      const a = li && li.querySelector("a");
      o.artA = a && m(a, ["padding", "border-radius"]);
      const imgBox = a && a.querySelector("div");
      o.artImgBox = imgBox && m(imgBox, ["width", "height", "min-width", "border", "border-radius"]);
      const textCol = imgBox && imgBox.nextElementSibling;
      o.artTextCol = textCol && m(textCol, ["padding-left"]);
      const divs = a ? [...a.querySelectorAll("div")] : [];
      const cat = divs.find((x) => getComputedStyle(x).textTransform === "uppercase" && x.textContent.length < 30);
      o.artCat = cat && m(cat, ["font-size", "margin-bottom"]);
      const title = divs.find((x) => x.textContent.length > 25 && getComputedStyle(x).textTransform !== "uppercase" && !x.querySelector("div"));
      o.artTitle = title && m(title, ["font-size", "line-height", "margin-bottom"]);
    }

    // highlights grid
    const hh = $$("h3").find((h) => /skip the grind/i.test(h.textContent));
    const sec = hh && hh.closest("section");
    const grid = sec && [...sec.querySelectorAll("div")].find((x) => getComputedStyle(x).display === "grid");
    o.hlGrid = grid && m(grid, ["grid-template-columns", "gap"]);
    if (grid) {
      const item = grid.children[0];
      const tile = item && item.querySelector("div");
      o.hlTile = tile && m(tile, ["width", "height", "border-radius", "margin-bottom"]);
      const inner = tile && tile.querySelector("div");
      o.hlIcon = inner && m(inner, ["width", "height"]);
      const h4 = item && item.querySelector("h4");
      o.hlH4 = h4 && m(h4, ["font-size", "line-height", "margin-top", "margin-bottom"]);
      const p = item && item.querySelector("p");
      o.hlP = p && m(p, ["font-size", "line-height"]);
    }

    // footer structure
    const footer = $("footer");
    o.footer = m(footer, ["padding-top", "padding-bottom"]);
    const cont = footer && footer.querySelector("div");
    o.footerCont = cont && m(cont, ["max-width", "padding-left", "padding-right"]);
    const imgs = footer ? [...footer.querySelectorAll("img")].slice(0, 12).map((i) => m(i, ["width", "height"])) : [];
    o.footerImgs = imgs;
    const linkUl = footer && [...footer.querySelectorAll("ul")].find((u) => u.textContent.includes("Help"));
    o.helpUl = linkUl && m(linkUl, ["margin-bottom"]);
    if (linkUl) {
      const li = linkUl.querySelector("li");
      o.helpLi = m(li, ["margin-bottom", "line-height"]);
      const a = li.querySelector("a");
      o.helpA = m(a, ["font-size"]);
    }
    const socialUl = footer && [...footer.querySelectorAll("ul")].find((u) => u.textContent === "" && u.querySelectorAll("img").length >= 5);
    o.socialUl = socialUl && m(socialUl, ["gap", "margin-bottom"]);
    return o;
  });
  console.log("===== LIVE @390 focused =====");
  console.log(JSON.stringify(d, null, 1));
  await page.close();
}

async function probeAlign(browser, width) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(3000);
  const r = await page.evaluate(() => {
    const h3 = [...document.querySelectorAll("h3")].find((h) => /latest/i.test(h.textContent));
    if (!h3) return null;
    const c = getComputedStyle(h3);
    const feat = [...document.querySelectorAll("a")].find((a) => (a.href || "").includes("mark-darrah"));
    return { align: c.textAlign, fs: c.fontSize, featH: feat ? Math.round(feat.getBoundingClientRect().height) : null, featTop: feat ? Math.round(feat.getBoundingClientRect().top + scrollY) : null, headerH: Math.round(document.querySelector("header").getBoundingClientRect().height) };
  });
  console.log(`LIVE @${width}:`, JSON.stringify(r));
  await page.close();
}

(async () => {
  const browser = await chromium.launch();
  await probe390(browser);
  for (const w of [640, 768, 1024]) await probeAlign(browser, w);
  await browser.close();
})();
