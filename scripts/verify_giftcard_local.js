/* Session 18 — /dashboard/offers/GiftCard geometry + visual verification:
   screenshots at 1920/1536/390 into docs/ui-ux/screenshots/session18/ plus a
   DOM probe of the capture's key values:
   - sidebar "Gift Cards" row aria-current=page with bg rgb(255,201,80)
   - h1 "Offers" 30px/36px leading, New Offer button → /become-seller
   - "Select Game" combobox present, NO "Search offers" input, NO sort button
   - empty state "Nothing found"
   Usage: NODE_PATH=$(npm root -g) node scripts/verify_giftcard_local.js [baseURL] */
const { chromium } = require("playwright");
const fs = require("fs");

const BASE = process.argv[2] || "http://localhost:3100";
const OUT = "docs/ui-ux/screenshots/session18";
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const browser = await chromium.launch();
  let failed = false;

  for (const width of [1920, 1536, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, deviceScaleFactor: 1 });
    await page.goto(BASE + "/dashboard/offers/GiftCard/", { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${OUT}/giftcard-${width}.png`, fullPage: true });

    if (width === 1920 || width === 390) {
      const probe = await page.evaluate(() => {
        const out = {};
        const h1 = document.querySelector("h1");
        out.h1 = h1 ? h1.textContent.trim() : null;
        if (h1) { const cs = getComputedStyle(h1); out.h1Font = `${cs.fontSize}/${cs.lineHeight}`; }
        const rows = Array.from(document.querySelectorAll("#dashboard-sidebar a"));
        const active = rows.find((a) => a.getAttribute("aria-current") === "page");
        out.activeLabel = active ? active.textContent.trim() : null;
        out.activeBg = active ? getComputedStyle(active).backgroundColor : null;
        const sel = Array.from(document.querySelectorAll("button, [role=combobox], select, input"))
          .map((e) => e.textContent || e.placeholder || "").join(" | ");
        out.hasSelectGame = /Select Game/.test(sel);
        out.hasSearchOffers = /Search offers/i.test(document.body.innerText) ||
          !!document.querySelector('input[placeholder="Search offers"]');
        out.hasSort = /Recommended/.test(document.body.innerText);
        out.hasNothingFound = /Nothing found/.test(document.body.innerText);
        out.newOfferHref = (document.querySelector('a[aria-label="New Offer"]') || {}).getAttribute ?
          document.querySelector('a[aria-label="New Offer"]')?.getAttribute("href") : null;
        out.pageW = document.documentElement.scrollWidth;
        return out;
      });
      const ok =
        probe.h1 === "Offers" && probe.h1Font === "30px/36px" &&
        probe.activeLabel === "Gift Cards" && probe.activeBg === "rgb(255, 201, 80)" &&
        probe.hasSelectGame && !probe.hasSearchOffers && !probe.hasSort &&
        probe.hasNothingFound && probe.newOfferHref === "/become-seller";
      if (!ok) failed = true;
      console.log(`${ok ? "PASS" : "FAIL"} probe @${width}: ${JSON.stringify(probe)}`);
    }
    await page.close();
  }
  await browser.close();
  console.log(failed ? "PROBE FAILURES" : "ALL PROBES PASS");
  process.exit(failed ? 1 : 0);
})();
