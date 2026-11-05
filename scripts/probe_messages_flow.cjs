/* Interaction probe for the mobile single-pane chat flow:
   list view → tap conversation → thread view (back button) → send.
   Also desktop 1920 regression check of the two-pane layout. */
const { chromium } = require("playwright");

const URL = "http://localhost:3112/dashboard/messages";

async function shot(page, path, clip) {
  await page.screenshot({ path, ...(clip ? { clip } : {}) });
}

(async () => {
  const browser = await chromium.launch();

  // --- mobile 390 ---
  const m = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await m.goto(URL, { waitUntil: "networkidle" });
  await m.waitForTimeout(500);
  const box = await m.evaluate(() => {
    const el = document.querySelector('[aria-label="Chat"]');
    const r = el.getBoundingClientRect();
    return { top: Math.round(r.top + window.scrollY), h: Math.round(r.height) };
  });
  console.log("390 chat box:", box, "pageHeight:", await m.evaluate(() => document.documentElement.scrollHeight));

  // list view (scroll so the chat top is 60px below viewport top)
  const listY = Math.max(0, box.top - 60);
  await m.evaluate((y) => window.scrollTo(0, y), listY);
  await m.waitForTimeout(250);
  await shot(m, "/tmp/render/flow-390-list.png", { x: 0, y: 0, width: 390, height: 700 });

  // tap CNLTeam → thread view
  await m.click('button:has-text("CNLTeam")');
  await m.waitForTimeout(400);
  const t1 = await m.evaluate(() => {
    const el = document.querySelector('[aria-label="Chat with CNLTeam"]');
    const sc = el.querySelector(".overflow-y-auto");
    return { visible: !!el && el.offsetHeight > 0, scrolledToBottom: Math.abs(sc.scrollTop + sc.clientHeight - sc.scrollHeight) < 2 };
  });
  console.log("390 CNLTeam thread:", t1);
  await m.evaluate((y) => window.scrollTo(0, y), listY);
  await m.waitForTimeout(250);
  await shot(m, "/tmp/render/flow-390-thread.png", { x: 0, y: 0, width: 390, height: 700 });

  // back → list; then PowerXhub → send a message
  await m.click('[aria-label="Back to conversations"]');
  await m.waitForTimeout(300);
  const listBack = await m.evaluate(() => {
    const aside = document.querySelector('[aria-label="Conversations"]');
    return { listVisible: aside.offsetHeight > 0 };
  });
  console.log("390 after back:", listBack);
  await m.click('button:has-text("PowerXhub")');
  await m.waitForTimeout(300);
  await m.fill('[aria-label="Type a message"]', "Mobile send test — works!");
  await m.click('[aria-label="Send message"]');
  await m.waitForTimeout(300);
  const sent = await m.evaluate(() => {
    const el = document.querySelector('[aria-label="Chat with PowerXhub"]');
    const sc = el.querySelector(".overflow-y-auto");
    return {
      bubbleCount: el.querySelectorAll(".rounded-2xl").length,
      atBottom: Math.abs(sc.scrollTop + sc.clientHeight - sc.scrollHeight) < 2,
      hasText: el.innerHTML.includes("Mobile send test"),
    };
  });
  console.log("390 send result:", sent);
  await m.evaluate((y) => window.scrollTo(0, y), listY);
  await m.waitForTimeout(250);
  await shot(m, "/tmp/render/flow-390-sent.png", { x: 0, y: 0, width: 390, height: 700 });
  await m.close();

  // --- tablet 768 ---
  const t = await browser.newPage({ viewport: { width: 768, height: 1024 } });
  await t.goto(URL, { waitUntil: "networkidle" });
  await t.waitForTimeout(500);
  const tb = await t.evaluate(() => {
    const el = document.querySelector('[aria-label="Chat"]');
    const r = el.getBoundingClientRect();
    return { top: Math.round(r.top + window.scrollY), h: Math.round(r.height) };
  });
  console.log("768 chat box:", tb);
  await t.evaluate((y) => window.scrollTo(0, y), Math.max(0, tb.top - 60));
  await t.waitForTimeout(250);
  await shot(t, "/tmp/render/flow-768-list.png", { x: 0, y: 0, width: 768, height: 800 });
  await t.click('button:has-text("CNLTeam")');
  await t.waitForTimeout(350);
  await t.evaluate((y) => window.scrollTo(0, y), Math.max(0, tb.top - 60));
  await t.waitForTimeout(250);
  await shot(t, "/tmp/render/flow-768-thread.png", { x: 0, y: 0, width: 768, height: 800 });
  await t.close();

  // --- desktop 1920 regression ---
  const d = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await d.goto(URL, { waitUntil: "networkidle" });
  await d.waitForTimeout(500);
  const db = await d.evaluate(() => {
    const el = document.querySelector('[aria-label="Chat"]');
    const r = el.getBoundingClientRect();
    const aside = document.querySelector('[aria-label="Conversations"]');
    const thread = document.querySelector('[aria-label^="Chat with"]');
    return {
      chat: { top: Math.round(r.top + window.scrollY), h: Math.round(r.height) },
      twoPane: aside.offsetHeight > 0 && thread.offsetHeight > 0,
      asideW: Math.round(aside.getBoundingClientRect().width),
      scrollW: document.documentElement.scrollWidth,
    };
  });
  console.log("1920 desktop:", db);
  await d.evaluate((y) => window.scrollTo(0, y), Math.max(0, db.chat.top - 80));
  await d.waitForTimeout(250);
  await shot(d, "/tmp/render/flow-1920.png", { x: 0, y: 0, width: 1920, height: 900 });
  await d.close();

  await browser.close();
})();
