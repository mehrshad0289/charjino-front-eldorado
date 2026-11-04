#!/usr/bin/env python3
"""Session 13 — deep DOM structure probe of the LIVE blog article page.

Dumps the first-article DOM tree (tag/class/text/styles per block),
breadcrumb + TOC + meta row details, and the exact boundary of the first
article (the live page infinite-scrolls more articles below — we only
implement ONE article per page and document the deviation).

Usage: python3 scripts/probe_blog_article_structure.py > /tmp/blog_article_structure.json
"""

import json
from playwright.sync_api import sync_playwright

URL = "https://www.eldorado.gg/blog/insider-interviews/mark-darrah-bioware-shutdown-dragon-age-veilguard-interview/"

JS = """
() => {
  const out = {};
  const cs = (el) => el ? getComputedStyle(el) : null;
  const rect = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { top: Math.round(r.top + scrollY), h: Math.round(r.height),
             w: Math.round(r.width), left: Math.round(r.left) };
  };
  const brief = (el, depth) => {
    if (!el || depth > 4) return null;
    const c = cs(el) || {};
    const node = {
      tag: el.tagName,
      cls: (el.className || "").toString().slice(0, 100),
      text: el.children.length === 0 ? el.textContent.trim().slice(0, 80) : undefined,
      rect: rect(el),
    };
    if (el.tagName === "IMG") { node.src = (el.currentSrc || el.src).slice(0, 150); node.alt = el.alt; }
    const styleKeys = ["fontSize","fontWeight","fontFamily","lineHeight","color","backgroundColor",
                       "borderRadius","border","padding","margin","textTransform","letterSpacing","display","gap"];
    const st = {};
    for (const k of styleKeys) { const v = c[k]; if (v && v !== "normal" && v !== "none" && v !== "0px" && v !== "rgba(0, 0, 0, 0)") st[k] = (v||"").toString().slice(0, 70); }
    if (Object.keys(st).length) node.styles = st;
    if (depth < 4 && el.children.length && el.children.length <= 40) {
      node.children = [...el.children].map(ch => brief(ch, depth + 1)).filter(Boolean);
    } else if (el.children.length > 40) {
      node.childCount = el.children.length;
    }
    return node;
  };

  // breadcrumb
  const crumbWrap = [...document.querySelectorAll("nav, div")].find(d =>
    d.children.length && d.textContent.includes("Home") && d.textContent.includes("Insider") && d.children.length < 8);
  out.breadcrumb = brief(crumbWrap, 2);

  // article root: the <article> tag or main content wrapper
  const art = document.querySelector("article") ||
              [...document.querySelectorAll("main > div > div")].find(d => d.querySelector("h1"));
  out.articleRoot = brief(art, 2);

  // TOC box
  const toc = [...document.querySelectorAll("div,aside,nav")].find(d =>
    d.textContent.trim().startsWith("TABLE OF CONTENTS") && d.textContent.length < 400);
  out.toc = brief(toc, 3);

  // meta row under h1 (avatar + author + date + read)
  const meta = [...document.querySelectorAll("div,p,span")].find(d =>
    /\d{1,2} \w{3} \d{4}/.test(d.textContent) && d.textContent.includes("min read") && d.children.length < 10 && d.textContent.length < 120);
  out.metaRow = brief(meta, 3);

  // first article boundary: article element height
  out.articleRect = rect(art);

  // section heading style: the visible "Key takeaways" h2
  const h2s = [...document.querySelectorAll("h2")];
  const kt = h2s.find(h => h.textContent.trim() === "Key takeaways");
  out.keyTakeawaysH2 = brief(kt, 1);
  // the list under it
  if (kt) {
    let n = kt.nextElementSibling, blocks = [];
    for (let i = 0; i < 3 && n; i++) { blocks.push(brief(n, 2)); n = n.nextElementSibling; }
    out.afterKT = blocks;
  }
  // Q&A: first h3 after "Full interview" h2
  const fi = h2s.find(h => (h.textContent||"").includes("Full interview"));
  if (fi) {
    let n = fi.nextElementSibling, blocks = [];
    for (let i = 0; i < 6 && n; i++) { blocks.push(brief(n, 2)); n = n.nextElementSibling; }
    out.afterFullInterview = blocks;
  }
  // related section "Exclusive Eldorado.gg interviews"
  const rel = h2s.find(h => (h.textContent||"").includes("Exclusive Eldorado.gg interviews"));
  out.relatedH2 = brief(rel, 1);
  if (rel) {
    let n = rel.nextElementSibling, blocks = [];
    for (let i = 0; i < 3 && n; i++) { blocks.push(brief(n, 3)); n = n.nextElementSibling; }
    out.afterRelated = blocks;
  }
  // "Related Guides" section
  const rg = [...document.querySelectorAll("h2,h3")].find(h => (h.textContent||"").trim() === "Related Guides");
  out.relatedGuidesH2 = brief(rg, 1);
  if (rg) {
    let n = rg.nextElementSibling, blocks = [];
    for (let i = 0; i < 3 && n; i++) { blocks.push(brief(n, 3)); n = n.nextElementSibling; }
    out.afterRelatedGuides = blocks;
  }
  // ChatBubble presence
  out.chatBubble = !!([...document.querySelectorAll("div,button,iframe")].find(e =>
    (e.className||"").toString().toLowerCase().includes("chat") ||
    (e.id||"").toLowerCase().includes("chat")));
  out.footer = rect(document.querySelector("footer"));
  return out;
}
"""

def main():
    with sync_playwright() as pw:
        b = pw.chromium.launch()
        page = b.new_page(viewport={"width": 1920, "height": 900})
        page.goto(URL, wait_until="domcontentloaded", timeout=60000)
        page.wait_for_timeout(5000)
        data = page.evaluate(JS)
        b.close()
    print(json.dumps(data, indent=1, ensure_ascii=False))

if __name__ == "__main__":
    main()
