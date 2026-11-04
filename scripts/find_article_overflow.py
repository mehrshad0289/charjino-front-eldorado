#!/usr/bin/env python3
"""Find horizontal-overflow culprits on the local article page at 390."""
import json
import os
import signal
import subprocess
import time
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path("/home/z/my-project/charjino-front-eldorado")
URL = "http://localhost:3111/blog/steal-an-egg/steal-an-egg-mutations-guide"

FIND_JS = """
(w) => {
  const out = [];
  const vw = document.documentElement.clientWidth;
  for (const el of document.querySelectorAll('*')) {
    const r = el.getBoundingClientRect();
    if (r.right > vw + 1 || r.left < -1) {
      const cs = getComputedStyle(el);
      out.push({
        tag: el.tagName.toLowerCase(),
        cls: (el.className && el.className.baseVal !== undefined ? el.className.baseVal : el.className || '').toString().slice(0, 90),
        left: Math.round(r.left), right: Math.round(r.right), w: Math.round(r.width),
        parent: el.parentElement ? el.parentElement.tagName.toLowerCase() + '.' + (el.parentElement.className||'').toString().slice(0,50) : '',
      });
      if (out.length > 25) break;
    }
  }
  return { vw, out };
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
            pg = b.new_page(viewport={"width": 390, "height": 900})
            pg.goto(URL, wait_until="networkidle", timeout=60000)
            pg.wait_for_timeout(1000)
            res = pg.evaluate(FIND_JS)
            print(json.dumps(res, indent=1))
            b.close()
    finally:
        os.killpg(os.getpgid(server.pid), signal.SIGTERM)


if __name__ == "__main__":
    main()
