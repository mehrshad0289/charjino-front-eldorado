/* Session 16 — find elements overflowing the viewport at 390 for /dashboard/loyalty */
const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 390, height: 900 } });
  await p.goto("http://localhost:3100/dashboard/loyalty/", { waitUntil: "networkidle" });
  const wide = await p.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const out = [];
    for (const el of document.querySelectorAll("*")) {
      const r = el.getBoundingClientRect();
      if (r.right > vw + 1 || r.left < -1) {
        out.push({
          tag: el.tagName,
          cls: String(el.className).slice(0, 80),
          text: (el.innerText || "").slice(0, 40).replace(/\n/g, " "),
          left: Math.round(r.left),
          right: Math.round(r.right),
          w: Math.round(r.width),
        });
      }
    }
    return { vw, list: out.slice(0, 25) };
  });
  console.log("viewport", wide.vw);
  for (const e of wide.list) console.log(`${e.tag} w=${e.w} L=${e.left} R=${e.right} | ${e.cls} | "${e.text}"`);
  await b.close();
})();
