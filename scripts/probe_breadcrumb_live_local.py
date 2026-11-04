#!/usr/bin/env python3
"""Probe breadcrumb geometry live vs local @390 + live table cell styles."""
import json
import os
import signal
import subprocess
import time
from playwright.sync_api import sync_playwright

ROOT = "/home/z/my-project/charjino-front-eldorado"
ART_LIVE = "https://www.eldorado.gg/blog/steal-an-egg/steal-an-egg-mutations-guide/"
ART_LOCAL = "http://localhost:3111/blog/steal-an-egg/steal-an-egg-mutations-guide"

JS = """
() => {
  const out = {};
  const $ = (s) => document.querySelector(s);
  const rect = (el) => { if (!el) return null; const r = el.getBoundingClientRect();
    return { x: Math.round(r.x), y: Math.round(r.y + window.scrollY), w: Math.round(r.width), h: Math.round(r.height) }; };
  const cs = (el) => el ? getComputedStyle(el) : null;
  // breadcrumb
  const bc = $("nav .breadcrumbs, nav.breadcrumbs") || [...document.querySelectorAll("nav, div")].find(d => d.className && String(d.className).includes && String(d.className).includes("breadcrumb"));
  const ul = bc ? bc.querySelector("ul") : $("ul");
  out.breadcrumbUl = rect(ul);
  const ulcs = ul ? cs(ul) : null;
  if (ulcs) out.ulStyle = { display: ulcs.display, flexWrap: ulcs.flexWrap };
  if (ul) {
    const lis = [...ul.querySelectorAll("li")];
    out.liCount = lis.length;
    out.liStyles = lis.slice(0, 4).map(li => { const c = cs(li);
      return { display: c.display, text: li.textContent.trim().slice(0, 28) }; });
    const lastLi = lis[lis.length - 1];
    out.lastLi = rect(lastLi);
    const lastA = lastLi.querySelector("a");
    if (lastA) { const c = cs(lastA); out.lastLink = { display: c.display }; }
  }
  const h1 = $("h1");
  out.h1 = rect(h1);
  if (h1) out.h1Size = cs(h1).fontSize;
  // table cells
  const th = $(".entry th, table th");
  const td = $(".entry td, table td");
  if (th) { const c = cs(th); out.th = { pad: c.padding, fs: c.fontSize, w: Math.round(th.getBoundingClientRect().width) }; }
  if (td) { const c = cs(td); out.td = { pad: c.padding, fs: c.fontSize }; }
  const img = $(".entry table img");
  if (img) out.tdImg = Math.round(img.getBoundingClientRect().width);
  // section padding above breadcrumb
  const sec = h1 ? h1.closest("section") : null;
  if (sec) { const c = cs(sec); out.section = { pt: c.paddingTop, pb: c.paddingBottom }; }
  const bcWrap = ul ? ul.parentElement : null;
  if (bcWrap) { const c = cs(bcWrap); out.bcWrap = { pb: c.paddingBottom, mb: c.marginBottom }; }
  return out;
}
"""


def probe(url, w=390):
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page(viewport={"width": w, "height": 900})
        pg.goto(url, wait_until="domcontentloaded", timeout=60000)
        pg.wait_for_timeout(2500)
        res = pg.evaluate(JS)
        b.close()
        return res


print("LIVE-390:", json.dumps(probe(ART_LIVE), indent=1))

subprocess.run(["pkill", "-f", "next start"], check=False)
subprocess.run(["pkill", "-f", "next-server"], check=False)
time.sleep(1)
server = subprocess.Popen(["npm", "start", "--", "-p", "3111"], cwd=ROOT,
                          stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
                          preexec_fn=os.setsid)
time.sleep(6)
try:
    print("LOCAL-390:", json.dumps(probe(ART_LOCAL), indent=1))
finally:
    os.killpg(os.getpgid(server.pid), signal.SIGTERM)
