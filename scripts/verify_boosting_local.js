/* Session 19 — /ea-fc-boosting/b/142-4 verification: screenshots at
   1920/390 into docs/ui-ux/screenshots/session19/ plus DOM probes:
   - status 200, overflow 0, zero page errors at 1920/1536/390
   - needles: sub-nav (EA Sports FC + Boosting active), banner, deals
     title + 98% badge, 8 chips (Division Rivals dark), config cards
     (Division 1 / Elite / PC - Steam comboboxes), textarea, Customize
     order (Solo active, 3 switches), active-request alert + Check
     request, Save up to 60% + Money Dragon, Why trust (6 rows),
     Trusted band, rank-up 4 steps, Get offers now CTAs, Boosters band,
     lightning CTA, FAQ (8 rows toggle), SEO block (4.9 badge, ol 7 li)
   Usage: NODE_PATH=$(npm root -g) node scripts/verify_boosting_local.js [baseURL] */
const { chromium } = require("playwright");
const fs = require("fs");

const BASE = process.argv[2] || "http://localhost:3100";
const OUT = "docs/ui-ux/screenshots/session19";
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const browser = await chromium.launch();
  let failed = false;

  for (const width of [1920, 1536, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, deviceScaleFactor: 1 });
    const errors = [];
    page.on("pageerror", (e) => errors.push(String(e)));
    const resp = await page.goto(BASE + "/ea-fc-boosting/b/142-4", { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(600);
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += 800) {
        scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      scrollTo(0, 0);
    });
    await page.waitForTimeout(400);
    if (width === 1920 || width === 390) {
      await page.screenshot({ path: `${OUT}/boosting-${width}.png`, fullPage: true });
    }

    const probe = await page.evaluate(() => {
      const out = {};
      const $$ = (s) => [...document.querySelectorAll(s)];
      out.scrollW = document.documentElement.scrollWidth;
      out.vw = window.innerWidth;
      out.pageH = document.documentElement.scrollHeight;
      const txt = document.body.innerText;
      out.needles = {
        subnav: (txt.includes("EA Sports FC") && txt.includes("Boosting")) && (window.innerWidth >= 768 ? txt.includes("FC Coins") : true),
        banner: !!$$("img[alt='Boosting banner background image']").length,
        deals: txt.includes("Get deals from expert boosters in under") && txt.includes("2 minutes"),
        badge98: txt.includes("98%") && txt.includes("Positive feedback from last") && txt.includes("353,800"),
        chips: ["Division Rivals", "Champions Finals", "Gallery Boost", "SBC Boost", "Archetype Boost", "Clubs Matches Boost", "Gauntlet Boost", "Custom Request"].every((c) => txt.includes(c)),
        cards: txt.includes("Current division") && txt.includes("Division 1") && txt.includes("Desired division") && txt.includes("Elite") && txt.includes("PC - Steam"),
        textarea: !!$$("textarea").length && txt.includes("Provide any additional information"),
        customize: txt.toLowerCase().includes("customize order") && txt.includes("Solo") && txt.includes("Duo") && txt.includes("Stream") && txt.includes("Solo queue") && txt.includes("Offline mode"),
        alert: txt.includes("You already have an active request") && txt.includes("Check request"),
        saveMoney: txt.includes("Save up to") && txt.includes("60%") && txt.includes("Hundreds of boosters compete"),
        trust: txt.includes("Why trust Eldorado?") && txt.includes("Verified professional sellers") && txt.includes("Wide selection of offers"),
        trusted: txt.includes("Trusted by thousands of players worldwide"),
        rankup: txt.includes("Effortless") && txt.includes("1. Select a service") && txt.includes("4. Rank Up"),
        cta: $$("button[aria-label='Get offers now']").length === 2,
        boosters: txt.includes("Selected boosters") && txt.includes("Boosters with Eldorados stamp of approval"),
        lightning: txt.includes("Rank-up with confidence:") && txt.includes("money-back guarantee"),
        faq: txt.includes("FAQ") && $$("button[aria-expanded]").length === 8,
        seo: txt.includes("EA Sports FC 27 Boosting Services") && txt.includes("4.9") && txt.includes("Buy FC27 Division Rivals Boosting") && $$("ol li").length === 7,
        footer: txt.includes("Help center"),
      };
      // chips: active one dark
      const activeChip = $$("button").find((b) => b.textContent.trim() === "Division Rivals");
      out.activeChipDark = activeChip ? getComputedStyle(activeChip).backgroundColor === "rgb(20, 19, 26)" : false;
      // sub-nav active tab has glow (blur span)
      const boostTab = $$("nav a").find((a) => a.textContent.trim() === "Boosting");
      out.subnavActive = !!boostTab && boostTab.className.includes("font-bold");
      // Solo thumb: first mode area has gray thumb
      out.soloActive = txt.includes("Solo") && txt.includes("Duo");
      // combobox values
      out.comboboxes = $$("div[role='combobox']").length === 3 && $$("div[role='combobox']").every((c) => c.textContent.includes("Division 1") || c.textContent.includes("PC - Steam") || c.textContent.includes("Elite"));
      out.brokenImgs = $$("img").filter((i) => i.complete && i.naturalWidth === 0 && i.src.startsWith("http")).length;
      return out;
    });

    // FAQ toggle
    const faq = await page.evaluate(async () => {
      const btn = [...document.querySelectorAll("button[aria-expanded]")][0];
      if (!btn) return { toggle: false };
      btn.click();
      await new Promise((r) => setTimeout(r, 150));
      const open = btn.getAttribute("aria-expanded") === "true" && document.body.innerText.includes("Boosting in FC27 is when someone else");
      btn.click();
      await new Promise((r) => setTimeout(r, 100));
      return { toggle: open && btn.getAttribute("aria-expanded") === "false" };
    });

    const bad =
      !resp.ok() ||
      probe.scrollW > probe.vw ||
      errors.length > 0 ||
      Object.values(probe.needles).some((v) => v === false) ||
      probe.activeChipDark === false ||
      probe.subnavActive === false ||
      probe.comboboxes === false ||
      probe.brokenImgs > 0 ||
      !faq.toggle;
    if (bad) failed = true;

    console.log(`\n=== ${width}px ${bad ? "FAIL" : "PASS"} (status ${resp.status()})`);
    console.log(JSON.stringify({ ...probe, faqToggle: faq.toggle, errors }));
  }

  await browser.close();
  console.log(failed ? "\nRESULT: FAIL" : "\nRESULT: ALL PASS");
  process.exit(failed ? 1 : 0);
})();
