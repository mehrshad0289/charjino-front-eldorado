/* Session 15f — what sits between H1 and the featured card on MOBILE,
   and the featured card wrapper geometry (card vs img).
   Usage: NODE_PATH=$(npm root -g) node scripts/probe_category_mobile_gap.js */
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
    const h1 = document.querySelector("h1");
    const bigImg = [...document.images].find((i) => i.getBoundingClientRect().width > 300);
    const card = bigImg ? bigImg.closest("a") || bigImg.closest("div") : null;
    const cardWrap = card ? card.parentElement : null;
    /* walk siblings between h1 and the featured wrapper */
    const between = [];
    let el = h1.nextElementSibling;
    const stop = cardWrap || card;
    while (el && el !== stop && between.length < 8) {
      between.push({
        tag: el.tagName,
        cls: (el.className || "").toString().slice(0, 90),
        rect: (() => {
          const b = el.getBoundingClientRect();
          return { y: Math.round(b.y), h: Math.round(b.height) };
        })(),
        text: el.textContent.replace(/\s+/g, " ").trim().slice(0, 60),
      });
      el = el.nextElementSibling;
    }
    const rb = (e) => {
      if (!e) return null;
      const b = e.getBoundingClientRect();
      return { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height) };
    };
    /* anything VISIBLE in the gap band y 240..410 */
    const band = [...document.querySelectorAll("div, ul, nav, section")]
      .filter((e) => {
        const b = e.getBoundingClientRect();
        return b.height > 20 && b.height < 200 && b.y > 235 && b.y < 420 && b.width > 100;
      })
      .slice(0, 8)
      .map((e) => ({
        tag: e.tagName,
        cls: (e.className || "").toString().slice(0, 70),
        rect: rb(e),
        text: e.textContent.replace(/\s+/g, " ").trim().slice(0, 40),
      }));
    return {
      h1Rect: rb(h1),
      h1MarginBottom: getComputedStyle(h1).marginBottom,
      featuredImg: rb(bigImg),
      featuredCard: rb(card),
      featuredWrap: rb(cardWrap),
      between,
      band,
    };
  });
  console.log(JSON.stringify(res, null, 1));
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
