/* Session 16 — geometry probe at 1920 for the 4 new dashboard routes,
   checked against the decoded capture values (the captures are 1920-only):
   Currency/TopUp: game select 148px, content max-w 1048;
   Purchased/Sold: dropdowns min-w 200px, content gap 32px below header,
   filter row mb 14px; Sold: search 200px, invoice button min-w 200px
   right-aligned. Usage: NODE_PATH=$(npm root -g) node scripts/probe_dashboard_geometry.js [baseURL]
*/
const { chromium } = require("playwright");

const BASE = process.argv[2] || "http://localhost:3100";

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1000 } });
  let failed = false;

  const check = (route, name, actual, expected) => {
    const ok = actual === expected;
    if (!ok) failed = true;
    console.log(`${ok ? "OK  " : "DIFF"} ${route} ${name}: ${actual} (capture ${expected})`);
  };

  // Currency
  await page.goto(BASE + "/dashboard/offers/Currency/", { waitUntil: "networkidle" });
  let m = await page.evaluate(() => {
    const select = document.querySelector('button[aria-label="Single-select searchable dropdown"]');
    const content = select ? select.closest(".max-w-\\[1048px\\]") : null;
    const h1 = document.querySelector("h1");
    return {
      selectW: select ? Math.round(select.getBoundingClientRect().width) : -1,
      contentW: content ? Math.round(content.getBoundingClientRect().width) : -1,
      selectText: select ? select.innerText.trim() : "",
      h1: h1 ? h1.innerText.trim() : "",
    };
  });
  check("/currency", "game select width", m.selectW, 148);
  check("/currency", "content width", m.contentW, 1048);
  check("/currency", "select label", m.selectText, "Select Game");
  check("/currency", "h1", m.h1, "Offers");

  // TopUp — same content, different sidebar active
  await page.goto(BASE + "/dashboard/offers/TopUp/", { waitUntil: "networkidle" });
  m = await page.evaluate(() => {
    const active = document.querySelector('#dashboard-sidebar a[aria-current="page"]');
    return active ? active.innerText.trim() : "";
  });
  check("/topup", "sidebar active row", m, "Top Ups");

  // Currency sidebar active
  await page.goto(BASE + "/dashboard/offers/Currency/", { waitUntil: "networkidle" });
  m = await page.evaluate(() => {
    const active = document.querySelector('#dashboard-sidebar a[aria-current="page"]');
    return active ? active.innerText.trim() : "";
  });
  check("/currency", "sidebar active row", m, "Currency");

  // Purchased
  await page.goto(BASE + "/dashboard/orders/purchased/", { waitUntil: "networkidle" });
  m = await page.evaluate(() => {
    const h1 = document.querySelector("h1");
    const combos = Array.from(document.querySelectorAll('button[role="combobox"]'));
    const row = combos.length ? combos[0].closest(".mb-\\[14px\\]") : null;
    const content = row ? row.parentElement : null;
    const header = h1 ? h1.closest("div.flex.min-h-\\[106px\\]") || h1.parentElement.parentElement : null;
    const gap = header && row ? Math.round(row.getBoundingClientRect().top - header.getBoundingClientRect().bottom) : -1;
    const active = document.querySelector('#dashboard-sidebar a[aria-current="page"]');
    return {
      h1: h1 ? h1.innerText.trim() : "",
      comboTexts: combos.map((b) => b.innerText.trim()),
      comboWs: combos.map((b) => Math.round(b.getBoundingClientRect().width)),
      rowMb: row ? getComputedStyle(row).marginBottom : "",
      gap,
      active: active ? active.innerText.trim() : "",
    };
  });
  check("/purchased", "h1", m.h1, "Purchased orders");
  check("/purchased", "combobox labels", m.comboTexts.join("|"), "All statuses|Recent");
  check("/purchased", "combobox widths", m.comboWs.join("|"), "200|200");
  check("/purchased", "row margin-bottom", m.rowMb, "14px");
  check("/purchased", "header→filters gap", m.gap, 32);
  check("/purchased", "sidebar active row", m.active, "Purchased orders");

  // Sold
  await page.goto(BASE + "/dashboard/orders/sold/", { waitUntil: "networkidle" });
  m = await page.evaluate(() => {
    const h1 = document.querySelector("h1");
    const combos = Array.from(document.querySelectorAll('button[role="combobox"]'));
    const input = document.querySelector('input[placeholder="Search Orders"]');
    const btn = document.querySelector('button[aria-label="Download invoice"]');
    const active = document.querySelector('#dashboard-sidebar a[aria-current="page"]');
    const content = input ? input.closest(".max-w-\\[1048px\\]") : null;
    const cRight = content ? content.getBoundingClientRect().right : -1;
    const bRight = btn ? btn.getBoundingClientRect().right : -1;
    return {
      h1: h1 ? h1.innerText.trim() : "",
      comboTexts: combos.map((b) => b.innerText.trim()),
      inputW: input ? Math.round(input.getBoundingClientRect().width) : -1,
      btnText: btn ? btn.innerText.trim() : "",
      btnW: btn ? Math.round(btn.getBoundingClientRect().width) : -1,
      btnRightFlush: Math.round(cRight - bRight),
      active: active ? active.innerText.trim() : "",
    };
  });
  check("/sold", "h1", m.h1, "Sold orders");
  check("/sold", "combobox labels", m.comboTexts.join("|"), "All statuses|Recent");
  check("/sold", "search width", m.inputW, 200);
  check("/sold", "invoice button", m.btnText, "Download invoice");
  check("/sold", "invoice min-width", m.btnW, 200);
  check("/sold", "button flush with content right (container pr 24)", m.btnRightFlush, 24);
  check("/sold", "sidebar active row", m.active, "Sold orders");

  await browser.close();
  console.log(failed ? "\nGEOMETRY DIFFS FOUND" : "\nGEOMETRY ALL OK");
  process.exit(failed ? 1 : 0);
})();
