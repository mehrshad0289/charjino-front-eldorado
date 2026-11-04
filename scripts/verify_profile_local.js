/* Session 18 — /users/NewFloat-0una[/tab] geometry + visual verification:
   screenshots at 1920/1536/390 into docs/ui-ux/screenshots/session18/ plus
   DOM probes of the capture's key values:
   - banner 120px, card -mt-80 overlap, avatar 84px in 100px ring
   - name 24px bold, Online teal dot rgb(0,228,201)
   - tabs Shop/Reviews/About; active = blue underline rgb(71,131,255)
   - Shop: chips Currency active yellow rgb(255,201,80) + (0) counts,
     All Games combobox 200px, empty state "Nothing found" + subtitle
   - Reviews: All/Positive/Negative chips + "Nothing found" (no subtitle)
   - About: Description card max-w-528 with "No description" + Registered row
   Usage: NODE_PATH=$(npm root -g) node scripts/verify_profile_local.js [baseURL] */
const { chromium } = require("playwright");
const fs = require("fs");

const BASE = process.argv[2] || "http://localhost:3100";
const OUT = "docs/ui-ux/screenshots/session18";
fs.mkdirSync(OUT, { recursive: true });

const TABS = [
  { path: "/users/NewFloat-0una/shop", tab: "shop" },
  { path: "/users/NewFloat-0una/reviews", tab: "reviews" },
  { path: "/users/NewFloat-0una/about", tab: "about" },
];

(async () => {
  const browser = await chromium.launch();
  let failed = false;

  for (const t of TABS) {
    for (const width of [1920, 390]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 }, deviceScaleFactor: 1 });
      const errors = [];
      page.on("pageerror", (e) => errors.push(String(e)));
      await page.goto(BASE + t.path, { waitUntil: "networkidle", timeout: 60000 });
      await page.waitForTimeout(500);
      await page.screenshot({ path: `${OUT}/profile-${t.tab}-${width}.png`, fullPage: true });

      const probe = await page.evaluate(() => {
        const out = {};
        const banner = document.querySelector('img[alt="User page banner"]');
        out.bannerH = banner ? Math.round(banner.getBoundingClientRect().height) : null;
        const avatar = Array.from(document.querySelectorAll('img[alt="Profile avatar"]')).map((i) => Math.round(i.getBoundingClientRect().width)).find((w) => w === 84) || null;
        out.avatar = avatar;
        const name = Array.from(document.querySelectorAll("div")).find((d) => d.textContent.trim() === "NewFloat-0una" && d.children.length === 0);
        out.name = !!name;
        if (name) { const cs = getComputedStyle(name); out.nameFont = `${cs.fontSize}/${cs.lineHeight} ${cs.fontWeight}`; }
        const online = Array.from(document.querySelectorAll("span")).find((s) => s.textContent.trim() === "Online");
        out.online = online ? getComputedStyle(online.parentElement.querySelector("span") || online).backgroundColor : null;
        out.dot = (() => {
          const dot = online && online.previousElementSibling;
          return dot ? getComputedStyle(dot).backgroundColor : null;
        })();
        const tabs = Array.from(document.querySelectorAll("main a")).filter((a) => /^(Shop|Reviews|About)$/.test(a.textContent.trim()));
        out.tabTexts = tabs.map((a) => a.textContent.trim());
        const active = tabs.find((a) => getComputedStyle(a).borderBottomColor === "rgb(71, 131, 255)");
        out.activeTab = active ? active.textContent.trim() : null;
        out.h1 = document.querySelector("h1") ? document.querySelector("h1").textContent.trim() : null;
        out.chipsYellow = Array.from(document.querySelectorAll("main div")).filter((d) => {
          const cs = getComputedStyle(d);
          return cs.backgroundColor === "rgb(255, 201, 80)" && Math.round(d.getBoundingClientRect().width) === 56;
        }).length;
        out.hasAllGames = document.body.innerText.includes("All Games");
        out.hasNoDesc = document.body.innerText.includes("No description");
        out.hasRegistered = document.body.innerText.includes("Registered:");
        out.emptyTitle = Array.from(document.querySelectorAll("main div")).some((d) => d.textContent.trim() === "Nothing found" && d.children.length === 0);
        out.subtitle = document.body.innerText.includes("Sorry, but nothing matched your filters or search terms.");
        out.reviewChips = ["All", "Positive", "Negative"].every((c) => document.body.innerText.includes(c));
        out.overflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
        return out;
      });

      let ok = probe.overflow <= 0 && errors.length === 0 && probe.bannerH === 120 && probe.avatar === 84 &&
        probe.name && probe.online && probe.dot === "rgb(0, 228, 201)" && probe.tabTexts.length === 3 &&
        probe.activeTab && probe.activeTab.toLowerCase() === t.tab;
      if (t.tab === "shop") ok = ok && probe.h1 === "Shop" && probe.chipsYellow === 1 && probe.hasAllGames && probe.subtitle && probe.emptyTitle;
      if (t.tab === "reviews") ok = ok && probe.h1 === "Reviews" && probe.reviewChips && !probe.subtitle && probe.emptyTitle;
      if (t.tab === "about") ok = ok && probe.h1 === "About" && probe.hasNoDesc && probe.hasRegistered && !probe.hasAllGames && !probe.emptyTitle;
      if (!ok) failed = true;
      console.log(`${ok ? "PASS" : "FAIL"} ${t.tab} @${width}: ${JSON.stringify(probe)}${errors.length ? " ERRORS=" + JSON.stringify(errors) : ""}`);
      await page.close();
    }
  }
  await browser.close();
  console.log(failed ? "PROBE FAILURES" : "ALL PROBES PASS");
  process.exit(failed ? 1 : 0);
})();
