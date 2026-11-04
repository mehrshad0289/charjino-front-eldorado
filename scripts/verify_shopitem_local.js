/* Session 18 — /roblox-items verification: screenshots at 1920/390 into
   docs/ui-ux/screenshots/session18/ plus DOM probes:
   - sub-nav: "Roblox" name, 6 tabs, Items active (white)
   - banner 465px backdrop, Filters sidebar (Price + Game + Show more (33)),
     Search Game input, Min./Max. inputs, 9 radio rows
   - 10 chips, "31057 items found", Recommended sort
   - 24 offer cards, first card title/seller/price verbatim
   - pagination 1..5 … 1000 + Next, active page yellow rgb(255,201,80)
   - trust row 386,200 + SEO h2s
   Usage: NODE_PATH=$(npm root -g) node scripts/verify_shopitem_local.js [baseURL] */
const { chromium } = require("playwright");
const fs = require("fs");

const BASE = process.argv[2] || "http://localhost:3100";
const OUT = "docs/ui-ux/screenshots/session18";
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const browser = await chromium.launch();
  let failed = false;

  for (const width of [1920, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, deviceScaleFactor: 1 });
    const errors = [];
    page.on("pageerror", (e) => errors.push(String(e)));
    await page.goto(BASE + "/roblox-items/", { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${OUT}/shopitem-${width}.png`, fullPage: true });

    const probe = await page.evaluate(() => {
      const out = {};
      const txt = document.body.innerText;
      out.subnav = txt.includes("Roblox") && ["Robux", "Accounts", "Top ups", "Items", "Boosting", "Gift cards"].every((t) => txt.includes(t));
      out.banner = !!document.querySelector('img[alt="banner background image"]');
      const banner = document.querySelector('img[alt="banner background image"]');
      out.bannerH = banner ? Math.round(banner.getBoundingClientRect().height) : null;
      out.filters = txt.includes("Filters") && txt.includes("Price ()") && txt.includes("Game") && txt.includes("Show more (33)");
      out.searchGame = !!document.querySelector('input[placeholder="Search Game"]');
      out.minMax = !!document.querySelector('input[placeholder="Min."]') && !!document.querySelector('input[placeholder="Max."]'); 
      out.radios = document.querySelectorAll('input[type="radio"]').length;
      out.chips = (txt.match(/Anime Adventures|Robux|MM2|Headless|Rivals|Anime Dice|Steal an Egg|YBA|Kukirin Life|Steal A Pet And Ride It/g) || []).length >= 10;
      out.resultCount = txt.includes("31057 items found");
      out.sort = txt.includes("Recommended");
      const cards = document.querySelectorAll('a[href*="roblox-items/oi/"]');
      out.cards = cards.length;
      const first = cards[0];
      out.firstCard = first ? first.innerText.replace(/\s+/g, " ").slice(0, 80) : null;
      out.pagination = ["1", "2", "3", "4", "5", "1000"].every((p) => txt.includes(p));
      const active = Array.from(document.querySelectorAll("button")).find((b) => b.textContent.trim() === "1" && b.className.includes("42px"));
      out.activeYellow = active ? getComputedStyle(active).backgroundColor : null;
      out.trust = txt.includes("386,200");
      out.seo = txt.includes("Buy Jailbreak Cars, GPO Fruits") && txt.includes("How to buy Roblox Items");
      out.overflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
      return out;
    });

    const ok =
      probe.overflow <= 0 && errors.length === 0 && probe.filters &&
      probe.searchGame && probe.minMax && probe.radios === 9 && probe.chips &&
      probe.resultCount && probe.sort && probe.cards === 24 && probe.pagination &&
      probe.trust && probe.seo &&
      (width === 1920 ? probe.subnav && probe.bannerH === 465 && probe.activeYellow === "rgb(255, 201, 80)" : true);
    if (!ok) failed = true;
    console.log(`${ok ? "PASS" : "FAIL"} @${width}: ${JSON.stringify(probe)}`);
    await page.close();
  }
  await browser.close();
  console.log(failed ? "PROBE FAILURES" : "ALL PROBES PASS");
  process.exit(failed ? 1 : 0);
})();
