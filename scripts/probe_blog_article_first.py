#!/usr/bin/env python3
"""Session 13 — probe the FIRST (visible) blog article template on live.

Finds the h1, walks up to the single-article wrapper, dumps its child
blocks (tag/class/text/rect/key styles) plus breadcrumb, meta row, TOC,
related sections. Output: /tmp/blog_article_first.json
"""

import json
from playwright.sync_api import sync_playwright

URL = "https://www.eldorado.gg/blog/insider-interviews/mark-darrah-bioware-shutdown-dragon-age-veilguard-interview/"

JS = r"""
() => {
  const cs = (el) => el ? getComputedStyle(el) : null;
  const rect = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { top: Math.round(r.top + scrollY), h: Math.round(r.height),
             w: Math.round(r.width), left: Math.round(r.left) };
  };
  const KEY = ["fontSize","fontWeight","fontFamily","lineHeight","color","backgroundColor",
               "borderRadius","border","padding","margin","textTransform","letterSpacing","gap","display"];
  const node = (el, depth, maxdepth) => {
    if (!el || depth > maxdepth) return null;
    const c = cs(el) || {};
    const n = { tag: el.tagName, cls: (el.className||"").toString().slice(0,90), rect: rect(el) };
    if (!el.children.length) n.text = el.textContent.trim().slice(0, 100);
    if (el.tagName === "IMG") { n.src = (el.currentSrc||el.src).slice(0,150); n.alt = (el.alt||"").slice(0,80); }
    if (el.tagName === "A") n.href = (el.getAttribute("href")||"").slice(0,120);
    const st = {};
    for (const k of KEY) { const v = (c[k]||"").toString(); if (v && !["normal","none","0px","rgba(0, 0, 0, 0)","auto","block"].includes(v)) st[k] = v.slice(0,70); }
    if (Object.keys(st).length) n.st = st;
    if (depth < maxdepth) {
      const ch = [...el.children];
      n.ch = ch.map(x => node(x, depth+1, maxdepth)).filter(Boolean);
      if (ch.length > 30) n.childCount = ch.length;
    }
    return n;
  };

  const h1 = document.querySelector("h1");
  const out = {};
  // ancestor chain h1 -> 6 levels up
  let chain = [], e = h1;
  for (let i=0; i<6 && e; i++) { chain.push({ tag: e.tagName, cls: (e.className||"").toString().slice(0,90), rect: rect(e) }); e = e.parentElement; }
  out.h1Chain = chain;

  // single-article wrapper: nearest ancestor with class containing 'single'
  let wrap = h1;
  while (wrap && !/single|article/i.test((wrap.className||"").toString() + wrap.tagName)) wrap = wrap.parentElement;
  out.wrapperCls = wrap ? (wrap.className||"").toString() : null;
  // dump wrapper's parent children (page-level layout)
  out.pageTop = node(document.body.firstElementChild, 0, 1);

  // the main wrapper containing h1 + content: use h1.closest('div') with big height
  let art = h1;
  while (art && art !== document.body && rect(art).h < 3000) art = art.parentElement;
  out.firstArticle = node(art, 0, 3);

  // TOC: box with 'TABLE OF CONTENTS'
  const tocTitle = [...document.querySelectorAll("*")].find(el =>
    el.children.length === 0 && /table of contents/i.test(el.textContent||""));
  out.tocChain = [];
  let t = tocTitle;
  for (let i=0; i<4 && t; i++) { out.tocChain.push({ tag: t.tagName, cls: (t.className||"").toString().slice(0,90), rect: rect(t), st: (()=>{const c=cs(t)||{};return {fs:c.fontSize,fw:c.fontWeight,color:c.color,bg:c.backgroundColor,bd:c.border,pad:c.padding,llh:c.lineHeight,tt:c.textTransform};})() }); t = t.parentElement; }

  // meta row: find the clock icon svg's parent row
  const dateEl = [...document.querySelectorAll("*")].find(el =>
    el.children.length === 0 && /\d{1,2} [A-Z][a-z]{2} \d{4}/.test(el.textContent||"") && el.textContent.length < 30);
  out.dateChain = [];
  let de = dateEl;
  for (let i=0; i<4 && de; i++) { out.dateChain.push({ tag: de.tagName, cls: (de.className||"").toString().slice(0,90), rect: rect(de), text: (de.textContent||"").trim().slice(0,60) }); de = de.parentElement; }

  // breadcrumb container
  const home = [...document.querySelectorAll("a")].find(a => (a.textContent||"").trim() === "Home");
  out.breadcrumb = [];
  let be = home;
  for (let i=0; i<4 && be; i++) {
    const c = cs(be)||{};
    out.breadcrumb.push({ tag: be.tagName, cls: (be.className||"").toString().slice(0,90), rect: rect(be), text: (be.textContent||"").trim().slice(0,120),
      fs: c.fontSize, color: c.color });
    be = be.parentElement;
  }
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
    with open("/tmp/blog_article_first.json", "w") as f:
        json.dump(data, f, indent=1, ensure_ascii=False)
    print("saved")

if __name__ == "__main__":
    main()
