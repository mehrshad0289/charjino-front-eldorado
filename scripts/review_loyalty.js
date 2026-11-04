/* Session 16 — /dashboard/loyalty verification sweep at 1920/1536/390:
   HTTP 200, overflow, pageerrors, capture-faithful geometry markers
   (amber banner bg + min-height, 4 dimmed streak images, 2 teal progress
   bars, points card, 3 achievement cards, dedication card, sidebar active
   row). Usage: NODE_PATH=$(npm root -g) node scripts/review_loyalty.js [baseURL] */
const { chromium } = require("playwright");

const BASE = process.argv[2] || "http://localhost:3100";

(async () => {
  const b = await chromium.launch();
  let failed = false;
  for (const w of [1920, 1536, 390]) {
    const p = await b.newPage({ viewport: { width: w, height: 1000 } });
    const errs = [];
    p.on("pageerror", (e) => errs.push(String(e)));
    const resp = await p.goto(BASE + "/dashboard/loyalty/", { waitUntil: "networkidle", timeout: 60000 });
    const ov = await p.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    const d = await p.evaluate(() => {
      const byText = (t) =>
        Array.from(document.querySelectorAll("p,div,span,button")).find(
          (e) => e.innerText && e.innerText.trim() === t
        );
      const title = byText("Monthly order streak");
      const banner = title ? title.closest(".rounded-lg") : null;
      const active = document.querySelector('#dashboard-sidebar a[aria-current="page"]');
      const imgs = Array.from(document.images).filter((i) => i.alt === "Reward image");
      const dimmed = imgs.filter((i) => getComputedStyle(i.parentElement).opacity === "0.35");
      const bars = Array.from(document.querySelectorAll(".rounded-\\[1\\.25rem\\]")).filter((e) =>
        e.className.includes("bg-[rgb(0,_228,_201)]")
      );
      const h1 = document.querySelector("h1");
      return {
        h1: h1 ? h1.innerText.trim() : "",
        bannerBg: banner ? getComputedStyle(banner).backgroundColor : "",
        bannerMinH: banner ? getComputedStyle(banner).minHeight : "",
        active: active ? active.innerText.trim() : "",
        rewardImgs: imgs.length,
        dimmedCount: dimmed.length,
        tealBars: bars.length,
        hasPoints: !!byText("Available points"),
        hasRedeem: !!byText("Redeem"),
        hasCounter: !!byText("0 / 17 completed"),
        hasBrowse: !!byText("Browse Eldorado"),
        hasCritic: !!byText("Critic"),
        hasTrader: !!byText("Master Trader"),
        hasExplorer: !!byText("Explorer"),
        hasDedication: !!byText("Dedication"),
      };
    });
    const body = await p.evaluate(() => document.body.innerText);
    const checks = {
      "status 200": resp.status() === 200,
      "overflow<=0": ov <= 0,
      "no pageerrors": errs.length === 0,
      h1: d.h1 === "Eldorado Loyalty",
      "banner bg": d.bannerBg === "rgb(252, 231, 182)",
      "banner min-h 230": d.bannerMinH === "230px",
      "sidebar active Loyalty": d.active === "Loyalty",
      "7 reward imgs (4 streak + 3 achievements)": d.rewardImgs === 7,
      "4 dimmed": d.dimmedCount === 4,
      "4 teal bars (streak + 3 cards)": d.tealBars === 4,
      "points card": d.hasPoints && d.hasRedeem,
      achievements: d.hasCounter && d.hasCritic && d.hasTrader && d.hasExplorer,
      dedication: d.hasDedication && d.hasBrowse,
      caption: body.includes("Place 2 orders this month to earn +500 points."),
      "rank row": body.includes("2400 points left till Silver"),
    };
    const bad = Object.entries(checks)
      .filter(([, v]) => !v)
      .map(([k]) => k);
    if (bad.length) failed = true;
    console.log(
      `${bad.length ? "FAIL" : "PASS"} loyalty @${w} status=${resp.status()} overflow=${ov}` +
        (bad.length ? ` bad=[${bad.join(" | ")}]` : "")
    );
    await p.close();
  }
  await b.close();
  console.log(failed ? "\nLOYALTY FAILURES" : "\nLOYALTY ALL PASS");
  process.exit(failed ? 1 : 0);
})();
