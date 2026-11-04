/* Session 18 — quick probe: which tab does the LIVE profile root URL
   (/users/NewFloat-0una, no suffix) default to? */
const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1000 } });
  await p.goto("https://www.eldorado.gg/users/NewFloat-0una", { waitUntil: "networkidle", timeout: 90000 }).catch((e) => console.log("nav:", String(e).slice(0, 80)));
  await p.waitForTimeout(2500);
  console.log("final URL:", p.url());
  const t = await p.evaluate(() => {
    const main = document.querySelector("main") || document.body;
    const active = document.querySelector(".user-panel-tabs__tab.active");
    return { text: main.innerText.slice(0, 300), activeTab: active ? active.textContent.trim() : null };
  });
  console.log(JSON.stringify(t, null, 1));
  await b.close();
})();
