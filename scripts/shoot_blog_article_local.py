#!/usr/bin/env python3
"""Session 13 — capture LOCAL blog article pages for visual comparison.

Full-page screenshots at the mandatory widths (1920/1536/1024/768/390)
for the mutations guide (has the user-pushed .make capture) and the Mark
Darrah interview (featured, no FAQ), plus console-error + overflow checks
and interaction probes (FAQ toggle, TOC scroll-spy, mobile sheet).

Usage: python3 scripts/shoot_blog_article_local.py
Output: docs/ui-ux/screenshots/session13/local-*.png + /tmp/local_article_checks.json
"""

import json
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "docs" / "ui-ux" / "screenshots" / "session13"
OUT.mkdir(parents=True, exist_ok=True)

PAGES = [
    ("guide", "http://localhost:3000/blog/steal-an-egg/steal-an-egg-mutations-guide"),
    ("interview", "http://localhost:3000/blog/insider-interviews/mark-darrah-bioware-shutdown-dragon-age-veilguard-interview"),
]
WIDTHS = [1920, 1536, 1024, 768, 390]

CHECK_JS = """
() => {
  const out = {};
  out.overflowX = document.documentElement.scrollWidth - document.documentElement.clientWidth;
  out.pageH = document.documentElement.scrollHeight;
  out.h1 = document.querySelector("h1")?.textContent.trim().slice(0, 60) || null;
  out.tocItems = document.querySelectorAll(".toc-item, [class*='toc'] li").length;
  out.faqCount = document.querySelectorAll("[aria-expanded]").length;
  out.entryImgs = document.querySelectorAll(".entry img").length;
  out.consoleOk = true;
  return out;
}
"""

def main():
    report = {}
    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        for prefix, url in PAGES:
            errors = []
            for w in WIDTHS:
                page = browser.new_page(viewport={"width": w, "height": 900})
                page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
                page.on("pageerror", lambda e: errors.append(str(e)))
                try:
                    page.goto(url, wait_until="domcontentloaded", timeout=60000)
                    page.wait_for_timeout(4500)
                    page.screenshot(path=str(OUT / f"local-{prefix}-{w}.png"), full_page=True)
                    report[f"{prefix}@{w}"] = page.evaluate(CHECK_JS)
                except Exception as e:
                    report[f"{prefix}@{w}"] = {"error": str(e)[:200]}
                finally:
                    page.close()
            report[f"{prefix}-console-errors"] = errors[:10]

        # interactions @1920 (guide): FAQ toggle + TOC spy + progress bar
        page = browser.new_page(viewport={"width": 1920, "height": 900})
        page.goto(PAGES[0][1], wait_until="domcontentloaded", timeout=60000)
        page.wait_for_timeout(4000)
        inter = {}
        # progress bar width grows after scroll
        w0 = page.evaluate("document.querySelector('.pointer-events-none span')?.style.width || 'none'")
        page.evaluate("window.scrollTo(0, 4000)")
        page.wait_for_timeout(800)
        w1 = page.evaluate("document.querySelector('.pointer-events-none span')?.style.width || 'none'")
        inter["progress"] = [w0, w1]
        # TOC spy: active item color at depth
        inter["tocActive"] = page.evaluate("""() => {
          const cur = document.querySelector('.toc-item.current a');
          return cur ? {text: cur.textContent.trim().slice(0,40), color: getComputedStyle(cur).color} : null;
        }""")
        # FAQ accordion toggle
        inter["faq"] = page.evaluate("""() => {
          const btns = [...document.querySelectorAll('[aria-expanded]')];
          if (!btns.length) return 'no faq';
          const first = btns[0];
          const before = first.getAttribute('aria-expanded');
          first.click();
          return {count: btns.length, before, after: first.getAttribute('aria-expanded')};
        }""")
        report["interactions-1920"] = inter
        page.close()

        # mobile interactions @390 (guide): toc button opens sheet
        page = browser.new_page(viewport={"width": 390, "height": 800})
        page.goto(PAGES[0][1], wait_until="domcontentloaded", timeout=60000)
        page.wait_for_timeout(4000)
        mob = {}
        mob["tocBtnVisible"] = page.evaluate("""() => {
          const b = [...document.querySelectorAll('button')].find(b => b.getAttribute('aria-label') === 'Table of Contents');
          if (!b) return false;
          const r = b.getBoundingClientRect();
          return {t: Math.round(r.top), l: Math.round(r.left), w: Math.round(r.width)};
        }""")
        page.click("button[aria-label='Table of Contents']")
        page.wait_for_timeout(800)
        mob["sheetOpen"] = page.evaluate("""() => {
          const dlg = document.querySelector('[role=dialog]');
          return dlg ? {items: dlg.querySelectorAll('a').length, h: Math.round(dlg.getBoundingClientRect().height)} : null;
        }""")
        page.screenshot(path=str(OUT / "local-guide-390-toc-sheet.png"))
        page.click("button[aria-label='Close']")
        page.wait_for_timeout(500)
        mob["sheetClosed"] = page.evaluate("!document.querySelector('[role=dialog]')")
        report["interactions-390"] = mob
        page.close()
        browser.close()
    Path("/tmp/local_article_checks.json").write_text(json.dumps(report, indent=1, ensure_ascii=False))
    print(json.dumps(report, indent=1, ensure_ascii=False))

if __name__ == "__main__":
    main()
