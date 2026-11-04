#!/usr/bin/env python3
"""Re-measure article geometry AFTER all images are fully decoded.

The session-14 sweep showed transient mis-measurements (tdH 153 vs 201,
entryH 10219 vs 10836) while entry images were still decoding — an img
with width/height attrs renders its aspect box immediately, but the
sequence of probes vs decode timing made some reads land early. This
probe waits for every <img> decode + fonts.ready before measuring.
"""
import json
import os
import signal
import subprocess
import time
from playwright.sync_api import sync_playwright

ROOT = "/home/z/my-project/charjino-front-eldorado"
ART_LOCAL = "http://localhost:3111/blog/steal-an-egg/steal-an-egg-mutations-guide"

WAIT_JS = """async () => {
  await document.fonts.ready;
  const t0 = Date.now();
  while (Date.now() - t0 < 8000) {
    const pending = [...document.images].filter(i => !i.complete).length;
    if (!pending) break;
    await new Promise(r => setTimeout(r, 250));
  }
  return [...document.images].filter(i => !i.complete).length;
}"""

JS = """() => {
  const e = document.querySelector('.entry');
  const t = e.querySelector('table');
  const rows = [...t.querySelectorAll('tbody tr')];
  const y = (el) => Math.round(el.getBoundingClientRect().y + window.scrollY);
  return {
    entryH: Math.round(e.getBoundingClientRect().height),
    h2s: [...e.querySelectorAll('h2')].map(y),
    tableH: Math.round(t.getBoundingClientRect().height),
    rowHs: rows.slice(0, 5).map(r => Math.round(r.getBoundingClientRect().height)),
    shareY: null,
    pageH: document.documentElement.scrollHeight,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  };
}"""


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
            for w in (1920, 390):
                pg = b.new_page(viewport={"width": w, "height": 900})
                pg.goto(ART_LOCAL, wait_until="networkidle", timeout=60000)
                pg.evaluate(WAIT_JS)
                pg.wait_for_timeout(400)
                print(w, json.dumps(pg.evaluate(JS)))
                pg.close()
            b.close()
    finally:
        os.killpg(os.getpgid(server.pid), signal.SIGTERM)


if __name__ == "__main__":
    main()
