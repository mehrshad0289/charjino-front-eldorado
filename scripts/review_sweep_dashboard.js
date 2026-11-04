/* Session 16 — dashboard family review sweep: the 4 new routes
   (/dashboard/offers/Currency, /dashboard/offers/TopUp,
   /dashboard/orders/purchased, /dashboard/orders/sold) at the mandatory
   widths 1920/1536/390, plus the existing Account page as a regression
   guard after the DashboardFilters conditional refactor. Checks: HTTP
   status, overflow, console/page errors, broken images, content markers
   (title text, filter labels, empty-state text) and input placeholders
   (attributes, not innerText).
   Usage: NODE_PATH=$(npm root -g) node scripts/review_sweep_dashboard.js [baseURL]
*/
const { chromium } = require("playwright");

const BASE = process.argv[2] || "http://localhost:3100";
const WIDTHS = [1920, 1536, 390];

const CASES = [
  {
    route: "/dashboard/offers/Currency/",
    markers: ["Offers", "Select Game", "Nothing found", "Try to adjust filters", "Want to pause all your offers?", "New Offer"],
    absent: ["Search offers", "Recommended"],
  },
  {
    route: "/dashboard/offers/TopUp/",
    markers: ["Offers", "Select Game", "Nothing found", "Try to adjust filters", "Want to pause all your offers?", "New Offer"],
    absent: ["Search offers", "Recommended"],
  },
  {
    route: "/dashboard/offers/GiftCard/",
    markers: ["Offers", "Select Game", "Nothing found", "Try to adjust filters", "Want to pause all your offers?", "New Offer", "Gift Cards"],
    absent: ["Search offers", "Recommended"],
  },
  {
    route: "/dashboard/orders/purchased/",
    markers: ["Purchased orders", "All statuses", "Recent", "Nothing found", "You have no purchased orders"],
    absent: ["Search Orders", "Download invoice", "New Offer", "Want to pause"],
  },
  {
    route: "/dashboard/orders/sold/",
    markers: ["Sold orders", "All statuses", "Recent", "Download invoice", "You have no sold orders"],
    absent: ["New Offer", "Want to pause"],
    placeholders: ["Search Orders"],
  },
  {
    route: "/dashboard/offers/Account/",
    markers: ["Offers", "Select Game", "Recommended", "Nothing found"],
    absent: [],
    placeholders: ["Search offers"],
  },
];

(async () => {
  const browser = await chromium.launch();
  let failed = false;
  let total = 0;

  for (const c of CASES) {
    for (const width of WIDTHS) {
      total++;
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      const errors = [];
      page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
      page.on("pageerror", (e) => errors.push(String(e)));
      let status = 0;
      try {
        const resp = await page.goto(BASE + c.route, { waitUntil: "networkidle", timeout: 60000 });
        status = resp ? resp.status() : 0;
        await page.waitForTimeout(400);
      } catch (e) {
        console.log(`FAIL ${c.route} @${width}: nav error ${String(e).slice(0, 80)}`);
        failed = true;
        await page.close();
        continue;
      }
      const body = await page.evaluate(() => document.body.innerText);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      /* placeholder text lives in attributes, not innerText */
      const phOk = c.placeholders
        ? await page.evaluate(
            (list) => list.every((p) => !!document.querySelector(`input[placeholder="${p}"]`)),
            c.placeholders
          )
        : true;
      const brokenImgs = await page.evaluate(() =>
        Array.from(document.images)
          .filter((i) => i.complete && i.naturalWidth === 0 && i.offsetParent !== null)
          .map((i) => i.src.slice(0, 90))
      );
      const missing = c.markers.filter((m) => !body.includes(m));
      const present = c.absent.filter((m) => body.includes(m));
      const ok =
        status === 200 &&
        overflow <= 0 &&
        errors.length === 0 &&
        brokenImgs.length === 0 &&
        missing.length === 0 &&
        present.length === 0 &&
        phOk;
      if (!ok) failed = true;
      console.log(
        `${ok ? "PASS" : "FAIL"} ${c.route} @${width} status=${status} overflow=${overflow} errors=${errors.length} brokenImgs=${brokenImgs.length}` +
          (missing.length ? ` missing=[${missing.join(" | ")}]` : "") +
          (present.length ? ` unexpected=[${present.join(" | ")}]` : "") +
          (!phOk ? ` placeholders-missing=[${(c.placeholders || []).join(" | ")}]` : "") +
          (brokenImgs.length ? ` imgs=[${brokenImgs.join(", ")}]` : "") +
          (errors.length ? ` err0=${String(errors[0]).slice(0, 100)}` : "")
      );
      await page.close();
    }
  }
  await browser.close();
  console.log(`\n${total} combos, ${failed ? "FAILURES PRESENT" : "ALL PASS"}`);
  process.exit(failed ? 1 : 0);
})();
