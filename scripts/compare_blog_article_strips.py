#!/usr/bin/env python3
"""Session 13 — side-by-side visual comparison strips LOCAL|LIVE for the
blog article pages, anchored on shared elements (top / table / faq /
related guides / footer), at the mandatory widths 1920 and 390.

Usage: python3 scripts/compare_blog_article_strips.py
Output: docs/ui-ux/screenshots/session13/cmp-*.png
"""

from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "docs" / "ui-ux" / "screenshots" / "session13"
OUT.mkdir(parents=True, exist_ok=True)

PAIRS = [
    (
        "guide",
        "http://localhost:3000/blog/steal-an-egg/steal-an-egg-mutations-guide",
        "https://www.eldorado.gg/blog/steal-an-egg/steal-an-egg-mutations-guide/",
    ),
    (
        "interview",
        "http://localhost:3000/blog/insider-interviews/mark-darrah-bioware-shutdown-dragon-age-veilguard-interview",
        "https://www.eldorado.gg/blog/insider-interviews/mark-darrah-bioware-shutdown-dragon-age-veilguard-interview/",
    ),
]

ANCHORS = {
    "top": None,
    "table": "@table",
    "faq": "@faq",
    "related": "@related",
    "footer": "footer",
}


def scroll_to(page, selector, width):
    if selector is None:
        page.evaluate("window.scrollTo(0, 0)")
    elif selector == "footer":
        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
    else:
        page.evaluate(
            """(token) => {
              let el = null;
              if (token === '@table') el = document.querySelector('.entry table');
              else if (token === '@faq')
                el = document.querySelector('.faq-box') ||
                     [...document.querySelectorAll('h2')].find(h => h.textContent.trim() === 'FAQ');
              else if (token === '@related')
                el = [...document.querySelectorAll('h2,h3')].find(
                  h => h.textContent.trim().toLowerCase() === 'related guides');
              else el = document.querySelector(token);
              if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 90);
            }""",
            selector,
            )
    page.wait_for_timeout(900)


def shoot(page, url, anchor, width, height):
    page.goto(url, wait_until="domcontentloaded", timeout=60000)
    page.wait_for_timeout(4000)
    scroll_to(page, ANCHORS[anchor], width)
    return page.screenshot()


def main():
    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        for name, local_url, live_url in PAIRS:
            widths = [1920, 390] if name == "guide" else [( 1920)]
            for w in widths:
                vh = 900 if w >= 1024 else 800
                lp = browser.new_page(viewport={"width": w, "height": vh})
                vp = browser.new_page(viewport={"width": w, "height": vh})
                for anchor in ["top", "table", "faq", "related", "footer"]:
                    if name == "interview" and anchor in ("table", "faq"):
                        continue  # no table / no FAQ on the interview article
                    li = shoot(lp, local_url, anchor, w, vh)
                    lv = shoot(vp, live_url, anchor, w, vh)
                    import io
                    li_im = Image.open(io.BytesIO(li)).convert("RGB")
                    lv_im = Image.open(io.BytesIO(lv)).convert("RGB")
                    scale = 0.55 if w >= 1024 else 0.9
                    li_im = li_im.resize((int(w * scale), int(vh * scale)))
                    lv_im = lv_im.resize((int(w * scale), int(vh * scale)))
                    strip = Image.new("RGB", (li_im.width * 2 + 8, li_im.height), (255, 0, 0))
                    strip.paste(li_im, (0, 0))
                    strip.paste(lv_im, (li_im.width + 8, 0))
                    strip.save(OUT / f"cmp-{name}-{anchor}-{w}.png")
                    print(f"cmp-{name}-{anchor}-{w}.png")
                lp.close()
                vp.close()
        browser.close()


if __name__ == "__main__":
    main()
