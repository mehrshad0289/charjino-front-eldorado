/* Session 15d — row inner-element computed styles on the live category page
   (item-game-cat visibility, item-title, single-content-details, item-image).
   Usage: NODE_PATH=$(npm root -g) node scripts/probe_category_row_styles.js */
const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 900 } });
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
      return o;
    };
    const cat = row.querySelector(".item-game-cat");
    const title = row.querySelector(".item-title");
    const details = row.querySelector(".single-content-details");
    const dli = details ? details.querySelectorAll("li") : [];
    const reading = details ? details.querySelector(".reading-time") : null;
    const img = row.querySelector(".item-image");
    const a = row.querySelector("a");
    const before = (el) => {
      if (!el) return null;
      const s = getComputedStyle(el, "::before");
      return { content: s.content, bg: s.backgroundImage.slice(0, 120), w: s.width, h: s.height, mr: s.marginRight };
    };
    return {
      gameCat: { ...cs(cat, ["display", "color", "font-size", "font-weight", "text-transform", "line-height", "margin"]) },
      title: { ...cs(title, ["color", "font-size", "font-weight", "line-height", "font-family", "margin"]) },
      detailsUl: details ? cs(details.querySelector("ul"), ["display", "gap", "margin", "padding"]) : null,
      dateLi: dli[0] ? cs(dli[0], ["color", "font-size", "line-height", "border", "padding"]) : null,
      dateLiBefore: before(dli[0]),
      readingLi: reading ? cs(reading, ["color", "font-size", "line-height", "padding"]) : null,
      readingBefore: before(reading),
      itemImage: cs(img, ["width", "height", "flex", "border-radius", "overflow"]),
      imgEl: cs(row.querySelector("img"), ["width", "height", "object-fit", "border-radius", "display"]),
      anchor: cs(a, ["display", "color", "text-decoration", "gap"]),
      liPad: cs(row, ["padding", "border", "background-color", "align-items", "display"]),
    };
  });
  console.log(JSON.stringify(res, null, 1));
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
