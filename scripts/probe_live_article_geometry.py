#!/usr/bin/env python3
"""Precise live article calibration probe @390/768/1920 (and local @1920).

Targets the REAL breadcrumb (inside the h1's section), header geometry,
container paddings, h1 position and entry-table cell styles at each width.
"""
import json
from playwright.sync_api import sync_playwright

ART_LIVE = "https://www.eldorado.gg/blog/steal-an-egg/steal-an-egg-mutations-guide/"
ART_LOCAL = "http://localhost:3111/blog/steal-an-egg/steal-an-egg-mutations-guide"

JS = """
() => {
  const out = {vw: document.documentElement.clientWidth};
  const $ = (s) => document.querySelector(s);
  const rect = (el) => { if (!el) return null; const r = el.getBoundingClientRect();
    return { x: Math.round(r.x), y: Math.round(r.y + window.scrollY), w: Math.round(r.width), h: Math.round(r.height) }; };
  const cs = (el) => el ? getComputedStyle(el) : null;

  // header (blog bar) — first header/nav-ish element at top
  const hdr = $("header") || $("nav");
  if (hdr) { const c = cs(hdr); out.header = {...rect(hdr), position: c.position}; }

  const h1 = $("h1");
  out.h1 = h1 ? {...rect(h1), fs: cs(h1).fontSize} : null;
  const sec = h1 ? h1.closest("section") : null;
  if (sec) { const c = cs(sec); out.section = { y: Math.round(sec.getBoundingClientRect().y + window.scrollY), pt: c.paddingTop, pb: c.paddingBottom }; }
  const cont = sec ? sec.querySelector("div") : null;
  if (cont) { const c = cs(cont); out.container = { ...rect(cont), pl: c.paddingLeft, pr: c.paddingRight, maxW: c.maxWidth }; }

  // REAL breadcrumb: ul inside the section, before the h1 wrapper
  if (sec) {
    const uls = [...sec.querySelectorAll("ul")].filter(u => u.textContent.includes("Home"));
    const ul = uls[0];
    if (ul) {
      const c = cs(ul);
      const lis = [...ul.children];
      out.bc = {
        ul: rect(ul), display: c.display, flexWrap: c.flexWrap, h: Math.round(ul.getBoundingClientRect().height),
        liCount: lis.length,
        li0: lis[0] ? { text: lis[0].textContent.trim().slice(0, 10), display: cs(lis[0]).display } : null,
        last: lis[lis.length-1] ? { text: lis[lis.length-1].textContent.trim().slice(0, 44), display: cs(lis[lis.length-1]).display, ...rect(lis[lis.length-1]) } : null,
        wrapStyle: cs(ul.parentElement) ? { pb: cs(ul.parentElement).paddingBottom, mb: cs(ul.parentElement).marginBottom } : null,
      };
    }
  }
  // entry table cells
  const th = $(".entry th");
  const td = $(".entry td");
  const timg = $(".entry td img");
  if (th) { const c = cs(th); out.th = { pad: c.padding, fs: c.fontSize, w: Math.round(th.getBoundingClientRect().width) }; }
  if (td) { const c = cs(td); out.td = { pad: c.padding, fs: c.fontSize }; }
  if (timg) out.tdImg = Math.round(timg.getBoundingClientRect().width);
  // lede
  const lede = $(".post-summary__content");
  if (lede) out.lede = { ...rect(lede), pFs: cs(lede.querySelector("p")) ? cs(lede.querySelector("p")).fontSize : null };
  return out;
}
"""


def probe(page, url):
    page.goto(url, wait_until="domcontentloaded", timeout=60000)
    page.wait_for_timeout(2200)
    return page.evaluate(JS)


with sync_playwright() as p:
    b = p.chromium.launch()
    for w in (390, 768, 1024, 1536, 1920):
        pg = b.new_page(viewport={"width": w, "height": 900})
        print(f"LIVE-{w}:", json.dumps(probe(pg, ART_LIVE)))
        pg.close()
    b.close()
