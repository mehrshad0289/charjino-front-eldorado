/* Session 18 — /dmca + /dsa verification: screenshots at 1920/390 into
   docs/ui-ux/screenshots/session18/ plus DOM probes:
   - DMCA: banner img present, h2 48px "DMCA Copyright Notice", 2 role=status
     boxes, mailto link, ul counts (6 + 3), max-w-768 column
   - DSA: h-less 682px column (LegalDoc), DSA Article 11/12/13/14 markers,
     6 ul lists, digitalservicesact@eldorado.gg links
   Usage: NODE_PATH=$(npm root -g) node scripts/verify_legal18_local.js [baseURL] */
const { chromium } = require("playwright");
const fs = require("fs");

const BASE = process.argv[2] || "http://localhost:3100";
const OUT = "docs/ui-ux/screenshots/session18";
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const browser = await chromium.launch();
  let failed = false;

  for (const route of ["/dmca/", "/dsa/"]) {
    for (const width of [1920, 390]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 }, deviceScaleFactor: 1 });
      const errors = [];
      page.on("pageerror", (e) => errors.push(String(e)));
      await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 60000 });
      await page.waitForTimeout(400);
      await page.screenshot({ path: `${OUT.replace("session18", "session18")}${route === "/dmca/" ? "/dmca" : "/dsa"}-${width}.png`, fullPage: true });

      const probe = await page.evaluate(() => {
        const out = {};
        const txt = document.body.innerText;
        out.banner = !!document.querySelector('img[alt="Preview photo"]');
        const h2 = document.querySelector("h2");
        out.h2 = h2 ? h2.textContent.trim() : null;
        out.h2Font = h2 ? getComputedStyle(h2).fontSize : null;
        out.statusBoxes = document.querySelectorAll('[role="status"]').length;
        out.mailto = document.querySelector('a[href^="mailto:ip-dmca@eldorado.gg"]') ? "dmca" :
          document.querySelector('a[href^="mailto:digitalservicesact@eldorado.gg"]') ? "dsa" : null;
        out.ulCount = document.querySelectorAll("main ul").length;
        out.article11 = txt.includes("DSA Article 11");
        out.article12 = txt.includes("DSA Article 12");
        out.article13 = txt.includes("DSA Article 13");
        out.article21 = txt.includes("Article 21");
        out.overflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
        return out;
      });

      let ok = probe.overflow <= 0 && errors.length === 0;
      if (route === "/dmca/") {
        ok = ok && probe.banner && probe.h2 === "DMCA Copyright Notice" && probe.h2Font === "48px" &&
          probe.statusBoxes === 2 && probe.mailto === "dmca" && probe.ulCount === 2;
      } else {
        ok = ok && !probe.banner && !probe.h2 && probe.statusBoxes === 0 && probe.mailto === "dsa" &&
          probe.ulCount === 6 && probe.article11 && probe.article12 && probe.article13 && probe.article21;
      }
      if (!ok) failed = true;
      console.log(`${ok ? "PASS" : "FAIL"} ${route} @${width}: ${JSON.stringify(probe)}`);
      await page.close();
    }
  }
  await browser.close();
  console.log(failed ? "PROBE FAILURES" : "ALL PROBES PASS");
  process.exit(failed ? 1 : 0);
})();
