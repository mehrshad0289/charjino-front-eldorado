/* Session 18 — /dashboard/settings geometry + visual verification:
   screenshots at 1920/1536/390 into docs/ui-ux/screenshots/session18/ plus a
   DOM probe of the capture's key values:
   - sidebar "Account settings" row aria-current=page, bg rgb(255,201,80)
   - h1 "Account settings" 30px/36px, no action button
   - disabled email input value mehrshad02899@gmail.com + blue "Edit" labels
   - toggle states: All email notifications OFF (unchecked), New order ON,
     Boosting offers OFF; toggle click flips state
   - "Type here..." textarea present
   Usage: NODE_PATH=$(npm root -g) node scripts/verify_settings_local.js [baseURL] */
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
    await page.goto(BASE + "/dashboard/settings/", { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${OUT}/settings-${width}.png`, fullPage: true });

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
        out.emailVal = document.querySelector('input[aria-label="Email"]')?.value || null;
        out.emailColor = document.querySelector('input[aria-label="Email"]')
          ? getComputedStyle(document.querySelector('input[aria-label="Email"]')).color : null;
        out.editLabels = Array.from(document.querySelectorAll("p")).filter((p) => p.textContent.trim() === "Edit").length;
        out.switches = Array.from(document.querySelectorAll('[role="switch"]')).map((s) => ({
          label: s.getAttribute("aria-label"), checked: s.getAttribute("aria-checked") === "true",
        }));
        out.hasTextarea = !!document.querySelector('textarea[placeholder^="Type here"]');
        out.overflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
        return out;
      });
      const st = Object.fromEntries(probe.switches.map((s) => [s.label, s.checked]));
      const ok =
        probe.h1 === "Account settings" && probe.h1Font === "30px/36px" &&
        probe.activeLabel === "Account settings" && probe.activeBg === "rgb(255, 201, 80)" &&
        probe.emailVal === "mehrshad02899@gmail.com" && probe.emailColor === "rgb(198, 198, 204)" &&
        probe.editLabels === 2 && probe.hasTextarea && probe.overflow <= 0 &&
        st["All email notifications"] === false && st["New order"] === true &&
        st["Boosting offers"] === false && st["Message received"] === true;
      if (!ok) failed = true;
      console.log(`${ok ? "PASS" : "FAIL"} probe @${width}: h1=${probe.h1} font=${probe.h1Font} active=${probe.activeLabel}/${probe.activeBg} email=${probe.emailVal} edits=${probe.editLabels} toggles=${JSON.stringify(st)}`);
      // interaction: flip master toggle once and verify aria-checked flips
      if (width === 1920) {
        const before = await page.getAttribute('[role="switch"][aria-label="All email notifications"]', "aria-checked");
        await page.click('[role="switch"][aria-label="All email notifications"]');
        const after = await page.getAttribute('[role="switch"][aria-label="All email notifications"]', "aria-checked");
        const okFlip = before === "false" && after === "true";
        if (!okFlip) failed = true;
        console.log(`${okFlip ? "PASS" : "FAIL"} toggle flip: ${before} -> ${after}`);
      }
    }
    await page.close();
  }
  await browser.close();
  console.log(failed ? "PROBE FAILURES" : "ALL PROBES PASS");
  process.exit(failed ? 1 : 0);
})();
