#!/usr/bin/env python3
"""Verify local article geometry matches live calibration at 390/768/1920."""
import json
import os
import signal
import subprocess
import time
from playwright.sync_api import sync_playwright

ROOT = "/home/z/my-project/charjino-front-eldorado"
ART_LOCAL = "http://localhost:3111/blog/steal-an-egg/steal-an-egg-mutations-guide"

# live targets: {width: {h1_y, ul_y, ul_h, cont_pl, section_pt, th_pad, th_fs, td_img}}
LIVE = {
    390: {"h1_y": 278, "ul_y": 162, "ul_h": 48, "cont_pl": 16, "section_pt": 108,
          "th": "14px 8px", "th_fs": "14px", "td_img": 66},
    768: {"h1_y": 250, "ul_y": 162, "ul_h": 20, "cont_pl": 24, "section_pt": 108,
          "th": "14px 20px", "th_fs": "16px", "td_img": 121},
    1920: {"h1_y": 178, "ul_y": 90, "ul_h": 20, "cont_pl": 24, "section_pt": 60,
           "th": "14px 20px", "th_fs": "16px", "td_img": 140},
}

JS = """
() => {
  const out = {};
  const $ = (s) => document.querySelector(s);
  const y = (el) => el ? Math.round(el.getBoundingClientRect().y + window.scrollY) : null;
  const h = (el) => el ? Math.round(el.getBoundingClientRect().height) : null;
  const h1 = $("h1");
  out.h1_y = y(h1);
  const sec = h1 ? h1.closest("section") : null;
  out.section_pt = sec ? getComputedStyle(sec).paddingTop : null;
  const cont = sec ? sec.querySelector("div") : null;
  out.cont_pl = cont ? getComputedStyle(cont).paddingLeft : null;
  const ul = sec ? [...sec.querySelectorAll("ul")].find(u => u.textContent.includes("Home")) : null;
  out.ul_y = y(ul);
  out.ul_h = h(ul);
  const th = $(".entry th");
  out.th = th ? getComputedStyle(th).padding + " / " + getComputedStyle(th).fontSize : null;
  const timg = $(".entry td img");
  out.td_img = timg ? Math.round(timg.getBoundingClientRect().width) : null;
  out.overflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
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
    ok = True
    try:
        with sync_playwright() as p:
            b = p.chromium.launch()
            for w, t in LIVE.items():
                pg = b.new_page(viewport={"width": w, "height": 900})
                pg.goto(ART_LOCAL, wait_until="networkidle", timeout=60000)
                pg.wait_for_timeout(1200)
                r = pg.evaluate(JS)
                diffs = []
                for k, v in t.items():
                    got = r.get(k)
                    if got != v:
                        diffs.append(f"{k}: got {got}, live {v}")
                status = "MATCH" if not diffs else "DIFF -> " + "; ".join(diffs)
                if diffs:
                    ok = False
                print(f"{w}: overflow={r['overflow']} | {status}")
                pg.close()
            b.close()
    finally:
        os.killpg(os.getpgid(server.pid), signal.SIGTERM)
    print("ALL MATCH" if ok else "HAS DIFFS")


if __name__ == "__main__":
    main()
