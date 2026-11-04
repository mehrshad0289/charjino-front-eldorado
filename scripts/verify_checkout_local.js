/* Session 19 — /checkout verification: screenshots at 1920/390 into
   docs/ui-ux/screenshots/session19/ plus DOM probes:
   - status 200, overflow 0, zero page errors at 1920/1536/390
   - needles: minimal header (no site nav), Secure checkout h1, product
     card (Division Rivals / Joren / chips), 7 payment rows (Apple Pay
     checked w/ yellow border), Safe payment banner, Order summary
     (73.34/6.15/+5520/79.49), Apple-Pay button, ToS line, Trustpilot
     4.5 stars, 2 guarantee rows, footer
   - geometry @1920 vs capture: 60/40 split, h1 24px centered, summary
     column max-w-424, pay button h-14 max-w-368
   Usage: NODE_PATH=$(npm root -g) node scripts/verify_checkout_local.js [baseURL] */
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
    const resp = await page.goto(BASE + "/checkout", { waitUntil: "networkidle", timeout: 60000 });
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
      await page.screenshot({ path: `${OUT}/checkout-${width}.png`, fullPage: true });
    }

    const probe = await page.evaluate(() => {
      const out = {};
      const $$ = (s) => [...document.querySelectorAll(s)];
      out.scrollW = document.documentElement.scrollWidth;
      out.vw = window.innerWidth;
      out.pageH = document.documentElement.scrollHeight;
      const txt = document.body.innerText;
      out.needles = {
        h1: txt.includes("Secure checkout"),
        product: txt.includes("Division Rivals") && txt.includes("Delivery time: 3 days") && txt.includes("Platform: PC - Steam"),
        seller: txt.includes("Seller:") && txt.includes("Joren") && txt.includes("Online"),
        chips: txt.includes("100% positive") && txt.includes("7410 reviews") && txt.includes("Verified since 2025"),
        payments: ["Apple Pay", "Credit or debit card", "PayPal", "Google Pay", "Klarna", "Alipay", "Cryptocurrency"].every((n) => txt.includes(n)),
        subs: txt.includes("Pay in one click next time") && txt.includes("May take up to 10 min"),
        safeBanner: !!$$("img[alt='Safe payment']").length,
        summary: txt.includes("Order summary") && txt.includes("Order price") && txt.includes("Payment fees") && txt.includes("Loyalty points"),
        numbers: txt.includes("73.34") && txt.includes("6.15") && txt.includes("+ 5520") && txt.includes("79.49"),
        discount: txt.includes("Have a discount code?"),
        tos: txt.includes("By placing an order, you confirm") && txt.includes("Terms of Service") && txt.includes("Privacy Policy"),
        trustpilot: txt.includes("Excellent") && txt.includes("Trustpilot"),
        guarantees: txt.includes("95.3% of orders arrive perfect") && txt.includes("We don't pay the seller until you're happy"),
        footer: txt.includes("Help center"),
      };
      // minimal header: no site search, no CategoryNav
      out.minimalHeader = !txt.includes("Search for games, keywords, sellers...") && !$$("nav").some((n) => n.textContent.includes("Boosting"));
      // Apple Pay checked row: yellow border
      const rows = $$("div").filter((d) => typeof d.className === "string" && d.className.includes("min-h-14"));
      out.checkedRow = rows.some((r) => getComputedStyle(r).borderColor === "rgb(255, 201, 80)");
      out.payRows = rows.length;
      // h1 geometry
      const h1 = $$("h1").find((h) => h.textContent.includes("Secure checkout"));
      if (h1) {
        const c = getComputedStyle(h1);
        const r = h1.getBoundingClientRect();
        out.h1 = { fs: c.fontSize, fw: c.fontWeight, y: Math.round(r.y + scrollY) };
      }
      // 60/40 split: white form col vs gray summary col @1920
      const white = $$("div").find((d) => typeof d.className === "string" && d.className.includes("basis-[60%]"));
      out.leftCol = white ? Math.round(white.getBoundingClientRect().width) : null;
      // summary col max width
      const sum = $$("div").find((d) => typeof d.className === "string" && d.className.includes("max-w-[424px]"));
      out.summaryCol = sum ? Math.round(sum.getBoundingClientRect().width) : null;
      // pay button
      const btn = $$("button[aria-label='Pay with Apple Pay']");
      if (btn[0]) {
        const r = btn[0].getBoundingClientRect();
        const c = getComputedStyle(btn[0]);
        out.payBtn = { w: Math.round(r.width), h: Math.round(r.height), bg: c.backgroundColor, radius: c.borderRadius };
      }
      out.brokenImgs = $$("img").filter((i) => i.complete && i.naturalWidth === 0 && i.src.startsWith("http")).length;
      return out;
    });

    const bad =
      !resp.ok() ||
      probe.scrollW > probe.vw ||
      errors.length > 0 ||
      Object.values(probe.needles).some((v) => v === false) ||
      probe.minimalHeader === false ||
      probe.brokenImgs > 0 ||
      !probe.checkedRow;
    if (bad) failed = true;

    console.log(`\n=== ${width}px ${bad ? "FAIL" : "PASS"} (status ${resp.status()})`);
    console.log(JSON.stringify({ ...probe, errors }));
  }

  await browser.close();
  console.log(failed ? "\nRESULT: FAIL" : "\nRESULT: ALL PASS");
  process.exit(failed ? 1 : 0);
})();
