#!/usr/bin/env python3
"""Session 13 — capture LIVE eldorado.gg blog ARTICLE pages as references.

The blog landing (/blog) was completed in session 12. The remaining blog
work is the article page (progress doc "Next exact action": blog article
page — no capture pushed yet). Per project convention the LIVE site is
the responsive source of truth, so we capture full-page screenshots at
1920/1536/1024/768/390 for two articles (featured interview + a guide
article) and dump a DOM probe (offsets, fonts, colors, structure).

Usage: python3 scripts/capture_blog_article_live.py
Outputs:
  ui ux/extracted/snapshots/live-blog-article-<w>.png
  ui ux/extracted/snapshots/live-blog-article-guide-<w>.png
  /tmp/blog_article_probe.json
"""

import json
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
SNAP = ROOT / "ui ux" / "extracted" / "snapshots"
SNAP.mkdir(parents=True, exist_ok=True)

ARTICLES = [
    ("live-blog-article", "https://www.eldorado.gg/blog/insider-interviews/mark-darrah-bioware-shutdown-dragon-age-veilguard-interview/"),
    ("live-blog-article-guide", "https://www.eldorado.gg/blog/steal-an-egg/steal-an-egg-mutations-guide/"),
]
WIDTHS = [1920, 1536, 1024, 768, 390]

PROBE_JS = """
() => {
  const out = {};
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const cs = (el) => el ? getComputedStyle(el) : null;
  const rect = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { top: Math.round(r.top + scrollY), h: Math.round(r.height),
             w: Math.round(r.width), left: Math.round(r.left) };
  };

  out.pageH = document.documentElement.scrollHeight;
  out.scrollW = document.documentElement.scrollWidth;
  out.innerWidth = innerWidth;
  out.title = document.title;

  // header
  const header = $("header") || $$("div").find(d => d.querySelector("img[alt*='Blog']"));
  out.header = rect(header);
  if (header) { const c = cs(header); out.headerBg = c.backgroundColor; }

  // main content container: find <article> or the widest text column
  const article = $("article") || $("main");
  out.article = rect(article);

  // breadcrumb
  const crumbs = $$("a").filter(a => (a.href||"").includes("/blog")).slice(0, 6)
    .map(a => ({ text: a.textContent.trim().slice(0, 60), href: a.getAttribute("href"),
                 fs: cs(a) ? cs(a).fontSize : null, color: cs(a) ? cs(a).color : null }));
  out.blogLinksTop = crumbs;

  // h1
  const h1 = $("h1");
  out.h1 = rect(h1);
  if (h1) { const c = cs(h1); out.h1Style = { fontSize: c.fontSize, weight: c.fontWeight,
      family: c.fontFamily.slice(0, 80), lineHeight: c.lineHeight, color: c.color,
      letterSpacing: c.letterSpacing, text: h1.textContent.trim().slice(0, 90) }; }

  // meta row (date / read time) — look near h1
  out.h1Siblings = h1 && h1.parentElement
    ? [...h1.parentElement.children].map(el => ({
        tag: el.tagName, cls: (el.className||"").toString().slice(0, 80),
        text: el.textContent.trim().slice(0, 80) })).slice(0, 8)
    : null;

  // hero image
  const heroImg = $$("img").find(i => i.naturalWidth > 600 && rect(i) && rect(i).w > 500);
  out.heroImg = rect(heroImg);
  if (heroImg) out.heroImgSrc = (heroImg.currentSrc || heroImg.src).slice(0, 160);

  // content typography sample
  const contentPs = $$("article p, main p").filter(p => p.textContent.trim().length > 100);
  out.pCount = $$("p").length;
  if (contentPs[0]) { const c = cs(contentPs[0]);
    out.pStyle = { fontSize: c.fontSize, lineHeight: c.lineHeight, family: c.fontFamily.slice(0,60),
                   color: c.color, mb: c.marginBottom, w: rect(contentPs[0]).w };
    out.contentCol = rect(contentPs[0]); }
  const h2 = $$("h2")[0], h3 = $$("h3")[0];
  if (h2) { const c = cs(h2); out.h2Style = { fontSize: c.fontSize, weight: c.fontWeight,
      family: c.fontFamily.slice(0,60), mt: c.marginTop, mb: c.marginBottom,
      color: c.color, text: h2.textContent.trim().slice(0,60) }; }
  if (h3) { const c = cs(h3); out.h3Style = { fontSize: c.fontSize, weight: c.fontWeight,
      family: c.fontFamily.slice(0,60), text: h3.textContent.trim().slice(0,60) }; }
  const ul = $("article ul, main ul");
  if (ul) { const c = cs(ul); const li = ul.querySelector("li");
    out.ulStyle = { fs: cs(li) ? cs(li).fontSize : null, listStyle: c.listStyleType,
                    pl: c.paddingLeft, marker: cs(ul.querySelector("li") && ul.querySelector("li").marker || ul) ? (cs(ul, "::marker")||{}).color : null }; }

  // links inside content
  const aInContent = $$("article a, main a").filter(a => a.textContent.trim().length > 2);
  if (aInContent[0]) { const c = cs(aInContent[0]); out.aStyle = { color: c.color,
      deco: c.textDecorationLine, weight: c.fontWeight }; }
  out.contentLinks = aInContent.slice(0, 10).map(a => ({ text: a.textContent.trim().slice(0,50), href: a.getAttribute("href") }));

  // figures / inline images inside content
  out.inlineImgs = $$("article img, main img").filter(i => rect(i) && rect(i).w > 100)
    .map(i => ({ src: (i.currentSrc||i.src).slice(0,140), w: rect(i).w, h: rect(i).h })).slice(0, 12);

  // author / tags / share
  out.authorish = $$("[class*='author'], [class*='Author']").slice(0,3).map(e => ({cls: (e.className||"").toString().slice(0,60), text: e.textContent.trim().slice(0,80)}));
  out.tagish = $$("[class*='tag'], [class*='Tag']").slice(0,6).map(e => ({cls: (e.className||"").toString().slice(0,60), text: e.textContent.trim().slice(0,60)}));

  // sections after content: related, more articles, CTA
  const h2s = $$("h2,h3").map(h => ({ tag: h.tagName, text: h.textContent.trim().slice(0, 70), top: Math.round(h.getBoundingClientRect().top + scrollY) }));
  out.headings = h2s.slice(0, 25);

  // footer presence
  const footer = $("footer");
  out.footer = rect(footer);

  // body bg + text color
  const bc = cs(document.body);
  out.bodyBg = bc.backgroundColor; out.bodyColor = bc.color;

  // sample of long content first 3 paragraphs text
  out.sampleParas = contentPs.slice(0, 3).map(p => p.textContent.trim().slice(0, 200));

  return out;
}
"""

def main():
    import argparse
    only_probe = "--probe-only" in sys.argv
    results = {}
    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        for prefix, url in ARTICLES:
            for w in WIDTHS:
                page = browser.new_page(viewport={"width": w, "height": 900})
                try:
                    page.goto(url, wait_until="domcontentloaded", timeout=60000)
                    page.wait_for_timeout(5000)
                    # dismiss potential cookie banner
                    for sel in ["button:has-text('Accept')", "button:has-text('Agree')", "#onetrust-accept-btn-handler"]:
                        try:
                            page.locator(sel).first.click(timeout=1500)
                            page.wait_for_timeout(500)
                            break
                        except Exception:
                            pass
                    page.wait_for_timeout(1000)
                    if not only_probe:
                        page.screenshot(path=str(SNAP / f"{prefix}-{w}.png"), full_page=True)
                        print(f"saved {prefix}-{w}.png")
                    if w in (1920, 390):
                        results[f"{prefix}@{w}"] = page.evaluate(PROBE_JS)
                except Exception as e:
                    print(f"FAIL {prefix}@{w}: {e}")
                finally:
                    page.close()
        browser.close()
    out = Path("/tmp/blog_article_probe.json")
    out.write_text(json.dumps(results, indent=1, ensure_ascii=False))
    print(f"probe -> {out}")

if __name__ == "__main__":
    main()
