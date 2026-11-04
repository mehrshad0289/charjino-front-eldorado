/* Session 15e — mobile row styles on the live category page @390.
   Usage: NODE_PATH=$(npm root -g) node scripts/probe_category_row_mobile.js */
const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 900 } });
  await page.goto("https://www.eldorado.gg/blog/steal-an-egg/", {
    waitUntil: "networkidle",
    timeout: 90000,
  });
  await page.waitForTimeout(1200);
  const res = await page.evaluate(() => {
    const row = [...document.querySelectorAll("li")].find(
      (li) => li.querySelector("img") && li.textContent.includes("min read") && !li.closest(".games-switcher")
    );
    const cs = (el, props) => {
      if (!el) return null;
      const s = getComputedStyle(el);
      const o = {};
      for (const p of props) o[p] = s.getPropertyValue(p);
      const b = el.getBoundingClientRect();
      o._rect = { w: Math.round(b.width), h: Math.round(b.height) };
      return o;
    };
    const title = row.querySelector(".item-title");
    const imgBox = row.querySelector(".item-image");
    const img = row.querySelector("img");
    const a = row.querySelector("a");
    const content = row.querySelector(".reg-item-content");
    return {
      row: cs(row, ["padding", "height"]),
      anchor: cs(a, ["display", "gap", "align-items"]),
      imgBox: cs(imgBox, ["width", "height", "border-radius", "padding"]),
      img: cs(img, ["width", "height", "border-radius"]),
      title: cs(title, ["font-size", "line-height", "font-weight", "color", "margin"]),
      content: cs(content, ["margin", "padding", "display"]),
      featuredImg: (() => {
        const big = [...document.images].find((i) => i.closest(".single-hero, .cat-hero, .featured, [class*='hero']"));
        return big ? cs(big, ["width", "height", "border-radius"]) : null;
      })(),
      featAny: [...document.images]
        .filter((i) => i.getBoundingClientRect().width > 300)
        .map((i) => ({ w: Math.round(i.getBoundingClientRect().width), h: Math.round(i.getBoundingClientRect().height), src: i.currentSrc.slice(0, 90) })),
    };
  });
  console.log(JSON.stringify(res, null, 1));
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
