#!/usr/bin/env python3
"""Session 13 — scrape the 11 blog articles (featured + 10 "The Latest")
from LIVE eldorado.gg into a JS data module for /blog/[category]/[slug].

Per project convention the live site is the source of truth (the article
template has only the user-pushed mutations-guide capture as a 1920 design
reference; the other 10 articles exist only live). For every article we
keep the REAL WordPress content: lede, full entry HTML (sanitized), FAQ
accordion, Table of Contents with levels, related guides, author + meta.

Usage: python3 scripts/extract_blog_articles_data.py
Output: src/components/eldorado/data/blogArticlesData.js (module with
        BLOG_ARTICLE_PAGES + BLOG_BG_ART)
"""

import json
import re
import sys
from pathlib import Path
from urllib.parse import urljoin
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "src" / "components" / "eldorado" / "data" / "blogArticlesData.js"

# The 11 articles linked from /blog (session-12 capture hrefs, live-verified)
ARTICLE_URLS = [
    # verbatim hrefs from the session-12 blog capture (data/blogData.js)
    "https://www.eldorado.gg/blog/steal-an-egg/steal-an-egg-mutations-guide/",
    "https://www.eldorado.gg/blog/steal-an-egg/steal-an-egg-headless-horseman-and-paranoid-pete-update/",
    "https://www.eldorado.gg/blog/steal-a-brainrot-en/steal-a-brainrot-traits-guide/",
    "https://www.eldorado.gg/blog/steal-a-brainrot-en/all-brainrots-in-steal-a-brainrot/",
    "https://www.eldorado.gg/blog/league-of-legends/league-of-legends-worlds-2026-guide/",
    "https://www.eldorado.gg/blog/ea-fc-27-en/ea-fc-27-make-coins-fast/",
    "https://www.eldorado.gg/blog/league-of-legends/league-of-legends-riot-points/",
    "https://www.eldorado.gg/blog/ea-fc-27-en/ea-fc-27-evolutions-guide/",
    "https://www.eldorado.gg/blog/murder-mystery-2-en/mm2-halloween-event-2026/",
    "https://www.eldorado.gg/blog/murder-mystery-2-en/mm2-all-weapons-list/",
    "https://www.eldorado.gg/blog/insider-interviews/mark-darrah-bioware-shutdown-dragon-age-veilguard-interview/",
]

HERO_BG = "https://www.eldorado.gg/blog/wp-content/uploads/2025/02/bg-single.png"

# share button icon svgs (verbatim from the article capture, h2d bucket)
SHARE_BTNS = [
    ("Share in Claude", "646456ce883dbc82837cf78cc4cfd7f3233c4ef4.svg?generation=1793791941306463"),
    ("Share in ChatGPT", "8a1bfae54665e7f6af4d96a6a880f529272f816b.svg?generation=1793791941373859"),
    ("Share in X", None),   # filled after first article scrape (URLs from capture)
    ("Share in LinkedIn", None),
]

EXTRACT_JS = r"""
() => {
  const abs = (u) => { try { return new URL(u, document.baseURI).href; } catch { return u; } };
  const out = {};
  const h1 = document.querySelector("h1");
  out.title = h1 ? h1.textContent.trim() : "";

  // meta
  const meta = document.querySelector(".single-post-meta");
  out.author = meta?.querySelector(".single-post-meta__author a")?.textContent.trim() || "";
  out.authorHref = meta?.querySelector(".single-post-meta__author a")?.href || "";
  out.avatar = meta?.querySelector(".single-post-meta__avatar")?.src || "";
  out.date = meta?.querySelector(".single-post-meta__date")?.textContent.trim() || "";
  out.read = meta?.querySelector(".single-post-meta__readtime")?.textContent.trim() || "";

  // breadcrumb category (2nd li)
  const lis = [...document.querySelectorAll(".breads li")];
  out.category = lis.length > 1 ? lis[1].textContent.trim() : "";
  out.categoryHref = lis[1]?.querySelector("a")?.href || "";

  // lede
  const lede = document.querySelector("section.post-summary");
  out.ledeHtml = lede ? lede.innerHTML.trim() : "";

  // entry
  const entry = document.querySelector(".entry");
  out.entryHtml = entry ? entry.innerHTML.trim() : "";

  // toc
  const tocLis = [...document.querySelectorAll(".toc-box-links li")];
  out.toc = tocLis.map(li => {
    const a = li.querySelector("a");
    const m = (li.className || "").match(/toc-level-(\d+)/);
    return a ? { text: a.textContent.trim(), anchor: (a.getAttribute("href") || "").split("#")[1] || "", level: m ? +m[1] : 2 } : null;
  }).filter(Boolean);

  // FAQ
  const faqBox = document.querySelector(".faq-box");
  if (faqBox) {
    out.faq = [...faqBox.querySelectorAll(".accordion-item")].map(li => {
      const q = li.querySelector(".accordion-title");
      const a = li.querySelector(".accordion-content");
      return { q: q ? q.textContent.trim() : "", aHtml: a ? a.innerHTML.trim() : "" };
    });
  } else out.faq = [];

  // related guides: the box after faq (or after entry) containing "Related Guides"
  let relBox = null;
  const rgH = [...document.querySelectorAll("h2")].find(h => (h.textContent || "").trim().toLowerCase() === "related guides");
  if (rgH) relBox = rgH.closest(".single-content-bottom-box") || rgH.closest("div");
  if (relBox) {
    out.related = [...relBox.querySelectorAll("ul > li > a")].filter(a => a.querySelector("img")).map(a => {
      const kids = [...a.querySelectorAll("div")];
      const cat = kids.find(d => d.textContent.trim() && d.className.toString().includes("uppercase") === false && getComputedStyle(d).textTransform === "uppercase" && d.textContent.length < 40);
      // title = the 20px bold div
      const title = kids.find(d => getComputedStyle(d).fontSize === "20px");
      const dateRead = [...a.querySelectorAll("li")].map(li => li.textContent.trim());
      const img = a.querySelector("img");
      return {
        href: a.href,
        category: cat ? cat.textContent.trim() : "",
        title: title ? title.textContent.trim() : (kids[1]?.textContent.trim() || ""),
        date: dateRead[0] || "",
        read: (dateRead[1] || "").trim(),
        image: img ? img.src : "",
      };
    });
  } else out.related = [];
  return out;
}
"""

def sanitize(html: str) -> str:
    if not html:
        return ""
    html = re.sub(r"<script\b[^>]*>.*?</script>", "", html, flags=re.S | re.I)
    html = re.sub(r"<style\b[^>]*>.*?</style>", "", html, flags=re.S | re.I)
    html = re.sub(r'<(no)?script\b[^>]*/?>', "", html, flags=re.I)
    html = re.sub(r'\son\w+="[^"]*"', "", html, flags=re.I)
    html = re.sub(r"\son\w+='[^']*'", "", html, flags=re.I)
    # only allow youtube iframes (interview embeds)
    def iframe_fix(m):
        tag = m.group(0)
        src = re.search(r'src="([^"]+)"', tag)
        if src and "youtube" in src.group(1):
            return tag
        return ""
    html = re.sub(r"<iframe\b[^>]*>.*?</iframe>", iframe_fix, html, flags=re.S | re.I)
    html = re.sub(r"<iframe\b[^>]*/>", iframe_fix, html, flags=re.I)
    html = re.sub(r"\n\s*\n+", "\n", html)
    return html.strip()

def js_str(s: str) -> str:
    return json.dumps(s, ensure_ascii=False)

def main():
    only = sys.argv[1] if len(sys.argv) > 1 else None
    urls = [u for u in ARTICLE_URLS if not only or only in u]
    articles = []
    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        page = browser.new_page(viewport={"width": 1920, "height": 900})
        for i, url in enumerate(urls):
            try:
                page.goto(url, wait_until="domcontentloaded", timeout=60000)
                page.wait_for_timeout(3500)
                data = page.evaluate(EXTRACT_JS)
                slug = [p for p in url.split("/") if p][-1]
                category = url.split("/blog/")[1].split("/")[0]
                art = {
                    "slug": slug,
                    "category": data.get("category") or category.replace("-", " ").title(),
                    "categorySlug": category,
                    "title": data["title"],
                    "author": data["author"],
                    "authorHref": data["authorHref"],
                    "avatar": data["avatar"],
                    "date": data["date"],
                    "read": data["read"],
                    "ledeHtml": sanitize(data["ledeHtml"]),
                    "entryHtml": sanitize(data["entryHtml"]),
                    "toc": data["toc"],
                    "faq": [{"q": f["q"], "aHtml": sanitize(f["aHtml"])} for f in data["faq"]],
                    "related": data["related"],
                    "url": url,
                }
                articles.append(art)
                n_ch = len(art["entryHtml"])
                print(f"[{i+1}/{len(urls)}] {slug} — entry {n_ch//1024}KB, toc {len(art['toc'])}, faq {len(art['faq'])}, rel {len(art['related'])}")
            except Exception as e:
                print(f"FAIL {url}: {e}", file=sys.stderr)
        browser.close()

    # internal links: entry <a> + related cards pointing at our 11 articles
    slug_set = {a["slug"] for a in articles}
    def to_internal(href, category_slug):
        m = re.search(r"/blog/([^/]+)/([^/]+)/?$", href or "")
        if m and m.group(2) in slug_set:
            return f"/blog/{m.group(1)}/{m.group(2)}/"
        return href
    for a in articles:
        for r in a["related"]:
            r["internalHref"] = to_internal(r["href"], a["categorySlug"])

    # ---- write the JS module ----
    lines = []
    lines.append("/* Blog article pages (/blog/[category]/[slug]) data — session 13.\n")
    lines.append("   Scraped verbatim from LIVE eldorado.gg (the responsive source of\n")
    lines.append("   truth; the mutations-guide article also has the user-pushed .make\n")
    lines.append("   capture `ui ux/blog-single-page/...steal-an-egg-mutations-guide...make`\n")
    lines.append("   as the 1920 design reference). WordPress content kept as HTML blocks\n")
    lines.append("   and rendered through the .entry CSS in globals.css; scripts/handlers\n")
    lines.append("   stripped, non-YouTube iframes removed. Article cards on /blog link to\n")
    lines.append("   these pages internally (related-guide links stay external unless the\n")
    lines.append("   target is one of the 11 pages). */\n\n")
    lines.append(f"export const BLOG_BG_ART = {js_str(HERO_BG)};\n\n")
    lines.append("export const BLOG_SHARE_BTNS = [\n")
    for label, fid in SHARE_BTNS:
        if fid is None:
            continue
        lines.append(f"  {{ label: {js_str(label)}, icon: `https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F{fid}&alt=media` }},\n")
    # grab X + LinkedIn icon URLs from the capture snapshot
    snap = ROOT / "ui ux" / "extracted" / "snapshots" / "blog-article-1920px-1.tsx"
    if snap.exists():
        s = snap.read_text()
        tw = re.search(r'aria-label="Share in (?:X|Twitter)"[^>]*backgroundImage\\?":\\?"url\(\\\\"([^\\]+)\\\\"', s)
        li = re.search(r'aria-label="Share in LinkedIn"[^>]*backgroundImage\\?":\\?"url\(\\\\"([^\\]+)\\\\"', s)
        twu = tw.group(1) if tw else None
        liu = li.group(1) if li else None
        if twu:
            twu = twu.replace("\\u0026", "&").replace("&amp;", "&")
            lines.append(f"  {{ label: 'Share in X', icon: {js_str(twu)} }},\n")
        if liu:
            liu = liu.replace("\\u0026", "&").replace("&amp;", "&")
            lines.append(f"  {{ label: 'Share in LinkedIn', icon: {js_str(liu)} }},\n")
    lines.append("];\n\n")
    lines.append("export const BLOG_ARTICLE_PAGES = [\n")
    for a in articles:
        lines.append("  {\n")
        for k in ["slug", "category", "categorySlug", "title", "author", "authorHref", "avatar", "date", "read", "url"]:
            lines.append(f"    {k}: {js_str(a[k])},\n")
        lines.append(f"    ledeHtml: {js_str(a['ledeHtml'])},\n")
        lines.append(f"    entryHtml: {js_str(a['entryHtml'])},\n")
        lines.append("    toc: [\n")
        for t in a["toc"]:
            lines.append(f"      {{ text: {js_str(t['text'])}, anchor: {js_str(t['anchor'])}, level: {t['level']} }},\n")
        lines.append("    ],\n")
        lines.append("    faq: [\n")
        for f in a["faq"]:
            lines.append(f"      {{ q: {js_str(f['q'])}, aHtml: {js_str(f['aHtml'])} }},\n")
        lines.append("    ],\n")
        lines.append("    related: [\n")
        for r in a["related"]:
            lines.append("      {\n")
            for k in ["href", "internalHref", "category", "title", "date", "read", "image"]:
                lines.append(f"        {k}: {js_str(r.get(k, ''))},\n")
            lines.append("      },\n")
        lines.append("    ],\n")
        lines.append("  },\n")
    lines.append("];\n")
    OUT.write_text("".join(lines))
    print(f"wrote {OUT} ({OUT.stat().st_size//1024}KB)")

if __name__ == "__main__":
    main()
