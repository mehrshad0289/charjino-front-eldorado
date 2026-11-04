#!/usr/bin/env python3
"""Probe LIVE article page table/entry behavior at 390 (how do tables fit?)."""
import json
import time
from playwright.sync_api import sync_playwright

URL = "https://www.eldorado.gg/blog/steal-an-egg/steal-an-egg-mutations-guide/"

JS = """
() => {
  const out = {vw: document.documentElement.clientWidth,
               overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth};
  const t = document.querySelector('.entry table, article table');
  out.tableCount = document.querySelectorAll('table').length;
  if (t) {
    const cs = getComputedStyle(t);
    const r = t.getBoundingClientRect();
    out.table = {w: Math.round(r.width), display: cs.display, overflowX: cs.overflowX,
                 tableLayout: cs.tableLayout, fontSize: cs.fontSize,
                 parentCls: t.parentElement.className.slice(0, 80),
                 parentOverflow: getComputedStyle(t.parentElement).overflowX,
                 parentDisplay: getComputedStyle(t.parentElement).display};
    const wrap = t.parentElement;
    out.wrapW = Math.round(wrap.getBoundingClientRect().width);
  }
  // entry container
  const e = document.querySelector('.entry');
  if (e) { const cs = getComputedStyle(e); out.entry = {w: Math.round(e.getBoundingClientRect().width), fontSize: cs.fontSize}; }
  return out;
}
"""


def main():
    with sync_playwright() as p:
        b = p.chromium.launch()
        for w in (390, 1920):
            pg = b.new_page(viewport={"width": w, "height": 900})
            pg.goto(URL, wait_until="domcontentloaded", timeout=60000)
            pg.wait_for_timeout(2500)
            print(w, json.dumps(pg.evaluate(JS), indent=1))
            pg.close()
        b.close()


if __name__ == "__main__":
    main()
