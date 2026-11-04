#!/usr/bin/env python3
"""Session 14 — capture LOCAL article + listing pages for visual comparison.

Runs against the local `next start` server. Screenshots:
  /tmp/shots/local-article-<w>.png       (mutations guide, 3 widths)
  /tmp/shots/local-article-listing-<w>.png (/blog listing sanity re-check)
Also dumps a DOM probe JSON with key geometry for diffing vs live probes.
"""

import json
import os
import signal
import subprocess
import sys
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path("/home/z/my-project/charjino-front-eldorado")
OUT = Path("/tmp/shots")
OUT.mkdir(parents=True, exist_ok=True)

ART = "http://localhost:3111/blog/steal-an-egg/steal-an-egg-mutations-guide"
LISTING = "http://localhost:3111/blog"

WIDTHS = [1920, 1536, 390]

PROBE_JS = """
() => {
  const out = {};
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const rect = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const y = window.scrollY;
    return { x: Math.round(r.x), y: Math.round(r.y + y), w: Math.round(r.width), h: Math.round(r.height) };
  };
  const cs = (el) => el ? getComputedStyle(el) : null;
  out.pageH = document.documentElement.scrollHeight;
  out.overflowX = document.documentElement.scrollWidth - document.documentElement.clientWidth;
  out.h1 = rect($("h1"));
  out.h1Font = cs($("h1"))?.fontFamily?.slice(0, 60);
  out.h1Size = cs($("h1"))?.fontSize;
  out.entry = rect($(".entry"));
  out.toc = rect($("aside") || $("[data-toc]") || $(".toc"));
  out.breadcrumb = rect($("main ul"));
  out.relatedH3 = $$("h3").map(h => h.textContent.trim().slice(0, 40));
  out.imgBroken = $$("img").filter(i => i.complete && i.naturalWidth === 0).map(i => i.src.slice(0, 90));
  out.console = window.__errs || [];
  return out;
}
"""


def main():
    subprocess.run(["pkill", "-f", "next start"], check=False)
    subprocess.run(["pkill", "-f", "next-server"], check=False)
    time.sleep(1)
    server = subprocess.Popen(
        ["npm", "start", "--", "-p", "3111"],
        cwd=ROOT,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        preexec_fn=os.setsid,
    )
    time.sleep(6)
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch()
            for w in WIDTHS:
                for label, url in (("article", ART), ("listing", LISTING)):
                    pg = browser.new_page(viewport={"width": w, "height": 1000})
                    errs = []
                    pg.on("console", lambda m, e=errs: e.append(m.text) if m.type == "error" else None)
                    pg.goto(url, wait_until="networkidle", timeout=60000)
                    pg.wait_for_timeout(1200)
                    pg.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                    pg.wait_for_timeout(1500)
                    pg.evaluate("window.scrollTo(0, 0)")
                    pg.wait_for_timeout(600)
                    pg.screenshot(path=str(OUT / f"local-{label}-{w}.png"), full_page=True)
                    if label == "article":
                        probe = pg.evaluate(PROBE_JS)
                        probe["consoleErrors"] = errs
                        (OUT / f"probe-article-{w}.json").write_text(json.dumps(probe, indent=1))
                    print(f"{label}@{w}: shot ok, consoleErrors={len(errs)}")
                    pg.close()
            browser.close()
    finally:
        os.killpg(os.getpgid(server.pid), signal.SIGTERM)
    print("done")


if __name__ == "__main__":
    sys.exit(main())
