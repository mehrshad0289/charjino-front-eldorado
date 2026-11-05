/* Probe /dashboard/messages on mobile viewports: horizontal overflow,
   console errors, mystery elements, clipped screenshots of each region. */
const { chromium } = require("playwright");

const URL = "http://localhost:3112/dashboard/messages";

async function probe(browser, width, height, tag) {
  const page = await browser.newPage({ viewport: { width, height } });
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text().slice(0, 200)));
  page.on("pageerror", (e) => errors.push("PAGEERROR " + String(e).slice(0, 200)));
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);

  const info = await page.evaluate(() => {
    const de = document.documentElement;
    const vw = window.innerWidth;
    const bad = [];
    for (const el of document.querySelectorAll("body *")) {
      const r = el.getBoundingClientRect();
      if (r.width && (r.right > vw + 1 || r.left < -1)) {
        bad.push(
          `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)} right=${Math.round(r.right)} left=${Math.round(r.left)}`
        );
      }
    }
    return {
      scrollWidth: de.scrollWidth,
      innerWidth: vw,
      pageHeight: de.scrollHeight,
      offending: bad.slice(0, 12),
      hasGoogleCard: document.body.innerText.includes("preferred browser"),
      chatRect: (() => {
        const el = document.querySelector('[aria-label="Chat"]');
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { top: Math.round(r.top + window.scrollY), h: Math.round(r.height) };
      })(),
    };
  });
  console.log(`\n=== ${tag} (${width}x${height}) ===`);
  console.log(JSON.stringify(info, null, 1));
  console.log("console errors:", errors.length ? errors.slice(0, 5) : "none");

  // screenshots: chat region + full page
  const chatTop = info.chatRect ? Math.max(0, info.chatRect.top - 40) : 0;
  const chatH = Math.min(info.chatRect ? info.chatRect.h + 120 : 900, 3000);
  await page.evaluate((y) => window.scrollTo(0, y), chatTop);
  await page.waitForTimeout(300);
  await page.screenshot({
    path: `/tmp/render/msg-${tag}-chat.png`,
    clip: { x: 0, y: 0, width, height: Math.min(height, chatH) },
  });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  await page.screenshot({ path: `/tmp/render/msg-${tag}-full.png`, fullPage: true });
  await page.close();
}

(async () => {
  const browser = await chromium.launch();
  await probe(browser, 390, 844, "390");
  await probe(browser, 768, 1024, "768");
  await browser.close();
})();
