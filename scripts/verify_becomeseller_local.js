/* Session 19 — /become-seller verification: screenshots at 1920/390 into
   docs/ui-ux/screenshots/session19/ plus DOM probes:
   - status 200, overflow 0, zero page errors at 1920/1536/390
   - needles: h1, sub, 3 pills, Why (4 cards), Tools (4 cards + chip
     colors), FAQs (7 rows), Full seller FAQ, CTA band, footer
   - geometry @1920 vs capture: h1 72px @y≈228, container 1216, hero img
     421×418, bg band h-975, tool card TRANSPARENT radius 16, FAQ max-w-768
   - FAQ accordion toggles (row 1 open/close), rich answer 4 blocks
   Usage: NODE_PATH=$(npm root -g) node scripts/verify_becomeseller_local.js [baseURL] */
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
    const resp = await page.goto(BASE + "/become-seller/", { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(600);
    // scroll through the page so lazy images load before the broken-img check
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += 800) {
        scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      scrollTo(0, 0);
    });
    await page.waitForTimeout(400);
    if (width === 1920 || width === 390) {
      await page.screenshot({ path: `${OUT}/becomeseller-${width}.png`, fullPage: true });
    }

    const probe = await page.evaluate(() => {
      const out = {};
      const $ = (s) => document.querySelector(s);
      const $$ = (s) => [...document.querySelectorAll(s)];
      out.scrollW = document.documentElement.scrollWidth;
      out.vw = window.innerWidth;
      out.pageH = document.documentElement.scrollHeight;
      const txt = document.body.innerText;
      out.needles = {
        h1: txt.includes("Start making money on Eldorado"),
        sub: txt.includes("Reach millions of verified gamers"),
        pill1: txt.includes("Safe sales") && txt.includes("Protected by TradeShield"),
        pill2: txt.includes("Global reach") && txt.includes("Millions of verified buyers worldwide"),
        pill3: txt.includes("Trusted since 2019") && txt.includes("100k+ reviews on Trustpilot") && txt.includes("4.4"),
        why: txt.includes("Why Eldorado?") && txt.includes("Fast & secure verification") && txt.includes("Fast payouts"),
        learnHow: $$("a").filter((a) => a.textContent.trim().startsWith("Learn how")).length === 4,
        tools: txt.includes("Tools to power your next sale") && txt.includes("Seller API") && txt.includes("Bulk Uploads") && txt.includes("Delivery Flexibility") && txt.includes("Influencer Growth"),
        faqTitle: txt.includes("Seller FAQs"),
        faqRows: $$("button[aria-expanded]").length === 7,
        fullFaq: txt.includes("Full seller FAQ"),
        ctaBand: txt.includes("Start selling with Eldorado") && txt.includes("all in one secure marketplace"),
        startVerification: $$("a[aria-label='Start verification']").length === 3,
      };
      const h1 = $$("h1").find((h) => h.textContent.includes("Start making money"));
      if (h1) {
        const c = getComputedStyle(h1);
        const r = h1.getBoundingClientRect();
        out.h1 = { fs: c.fontSize, fw: c.fontWeight, lh: c.lineHeight, x: Math.round(r.x), y: Math.round(r.y + scrollY), w: Math.round(r.width) };
      }
      // container
      let c = h1;
      while (c && Math.round(c.getBoundingClientRect().width) !== 1216) c = c.parentElement;
      out.container1216 = !!c;
      // hero img
      const img = $$("img").find((i) => (i.alt || "").includes("Earn money by selling"));
      if (img) {
        const r = img.getBoundingClientRect();
        out.heroImg = { w: Math.round(r.width), h: Math.round(r.height) };
      }
      // bg band
      const band = $$("div").find((d) => typeof d.className === "string" && d.className.includes("h-[975px]") && d.className.includes("bg-repeat-x"));
      out.bgBand = band ? Math.round(band.getBoundingClientRect().height) : null;
      // tool card transparency (first card w/ radius 16 containing Seller API)
      const tc = $$("div").find((d) => typeof d.className === "string" && d.textContent.includes("Seller API") && d.textContent.length < 260 && getComputedStyle(d).borderRadius === "16px" && d.textContent.includes("Bulk Uploads") === false);
      if (tc) {
        const cs = getComputedStyle(tc);
        out.toolCard = { bg: cs.backgroundColor, radius: cs.borderRadius, w: Math.round(tc.getBoundingClientRect().width) };
      }
      // chip colors
      out.chips = $$("div").filter((d) => /rgb\(79, 189, 253\)|rgb\(209, 240, 143\)|rgb\(0, 228, 201\)|rgb\(254, 169, 0\)/.test(d.style.backgroundColor || "")).length;
      // faq wrapper max width
      const fw = $$("div").find((d) => typeof d.className === "string" && d.className.includes("max-w-3xl"));
      out.faqMaxW = fw ? getComputedStyle(fw).maxWidth : null;
      // broken images (after scrolling)
      out.brokenImgs = $$("img").filter((i) => i.complete && i.naturalWidth === 0 && i.src.startsWith("http")).length;
      // green star pill
      out.greenStar = !!$$("svg").find((s) => (s.getAttribute("class") || "").includes("rgb(33"));
      return out;
    });

    // FAQ accordion toggle check
    const faq = await page.evaluate(async () => {
      const btn = [...document.querySelectorAll("button[aria-expanded]")][0];
      if (!btn) return { toggle: false };
      btn.click();
      await new Promise((r) => setTimeout(r, 150));
      const openAfterClick = btn.getAttribute("aria-expanded") === "true";
      const answerVisible = document.body.innerText.includes("Create an account, complete verification");
      // rich answer 4
      const btn4 = [...document.querySelectorAll("button[aria-expanded]")][3];
      btn4.click();
      await new Promise((r) => setTimeout(r, 150));
      const rich4 = document.body.innerText.includes("What is ID verification?") && document.body.innerText.includes("Types of verification");
      btn.click();
      btn4.click();
      await new Promise((r) => setTimeout(r, 100));
      const closedAgain = btn.getAttribute("aria-expanded") === "false" && btn4.getAttribute("aria-expanded") === "false";
      return { toggle: openAfterClick && answerVisible && closedAgain, rich4 };
    });

    const bad =
      !resp.ok() ||
      probe.scrollW > probe.vw ||
      errors.length > 0 ||
      Object.values(probe.needles).some((v) => v === false) ||
      probe.brokenImgs > 0 ||
      !faq.toggle ||
      !faq.rich4;
    if (bad) failed = true;

    console.log(`\n=== ${width}px ${bad ? "FAIL" : "PASS"} (status ${resp.status()})`);
    console.log(JSON.stringify({ ...probe, faqToggle: faq.toggle, rich4: faq.rich4, errors }));
  }

  await browser.close();
  console.log(failed ? "\nRESULT: FAIL" : "\nRESULT: ALL PASS");
  process.exit(failed ? 1 : 0);
})();
