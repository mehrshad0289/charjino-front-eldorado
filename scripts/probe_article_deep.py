#!/usr/bin/env python3
"""Deep probe: bg-art wrapper computed style + page overflow + entry img CSS."""
import json
import os
import signal
import subprocess
import time
from playwright.sync_api import sync_playwright

ROOT = Path_ROOT = "/home/z/my-project/charjino-front-eldorado"
URL = "http://localhost:3111/blog/steal-an-egg/steal-an-egg-mutations-guide"

JS = """
() => {
  const out = {};
  out.overflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
  out.scrollW = document.documentElement.scrollWidth;
  const wrap = document.querySelector('div.fixed.top-20') || [...document.querySelectorAll('div')].find(d => d.className.includes('top-20 bottom-0'));
  if (wrap) {
    const cs = getComputedStyle(wrap);
    out.wrap = { display: cs.display, position: cs.position, w: Math.round(wrap.getBoundingClientRect().width) };
    const img = wrap.querySelector('img');
    if (img) {
      const ics = getComputedStyle(img);
      const r = img.getBoundingClientRect();
      out.img = { display: ics.display, w: Math.round(r.width), natural: img.naturalWidth, complete: img.complete };
    }
  }
  const e = document.querySelector('.entry img');
  if (e) {
    const cs = getComputedStyle(e);
    out.entryImg = { maxW: cs.maxWidth, h: cs.height, w: Math.round(e.getBoundingClientRect().width), cls: (e.className||'').slice(0,60) };
  }
  const imgs = [...document.querySelectorAll('.entry img')];
  out.entryImgCount = imgs.length;
  out.wideEntryImgs = imgs.filter(i => i.getBoundingClientRect().right > 391).length;
  return out;
}
"""


def main():
    subprocess.run(["pkill", "-f", "next start"], check=False)
    subprocess.run(["pkill", "-f", "next-server"], check=False)
    time.sleep(1)
    server = subprocess.Popen(["npm", "start", "--", "-p", "3111"], cwd=ROOT,
                              stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
                              preexec_fn=os.setsid)
    time.sleep(6)
    try:
        with sync_playwright() as p:
            b = p.chromium.launch()
            for w in (390, 1920):
                pg = b.new_page(viewport={"width": w, "height": 900})
                pg.goto(URL, wait_until="networkidle", timeout=60000)
                pg.wait_for_timeout(1200)
                print(w, json.dumps(pg.evaluate(JS)))
                pg.close()
            b.close()
    finally:
        os.killpg(os.getpgid(server.pid), signal.SIGTERM)


if __name__ == "__main__":
    main()
