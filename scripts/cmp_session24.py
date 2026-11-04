#!/usr/bin/env python3
"""Session 24 — side-by-side comparison strips local|live @1920 (top bands)
for the 3 new shop pages, saved as composites for visual review."""
from PIL import Image
import os

OUT = "docs/ui-ux/screenshots/session24"

def band(path, top, h):
    im = Image.open(path)
    w = im.width
    c = im.crop((0, top, w, min(top + h, im.height)))
    # scale to 700 wide for readability
    ratio = 700 / w
    return c.resize((700, int(c.height * ratio)))

def compose(pairs, out, label_h=0):
    """pairs: list of (local_img, live_img) stacked rows."""
    w = 1410  # 700 + 10 gap + 700
    total_h = sum(max(a.height, b.height) + 14 for a, b in pairs)
    canvas = Image.new("RGB", (w, total_h), (255, 0, 255))
    y = 0
    for a, b in pairs:
        canvas.paste(a, (0, y))
        canvas.paste(b, (710, y))
        y += max(a.height, b.height) + 14
    canvas.save(out)

for name in ["prime", "psplus", "cod"]:
    local = f"{OUT}/local-{name}-1920.png"
    live = f"{OUT}/live-{name}-1920.png"
    if not (os.path.exists(local) and os.path.exists(live)):
        print("skip", name)
        continue
    li = Image.open(local); lv = Image.open(live)
    print(name, "local h:", li.height, "live h:", lv.height)
    # top band (header+banner+cards zone): 0..900
    # mid band (other sellers): around 0.35*h .. capture some
    rows = [
        (band(local, 0, 900), band(live, 0, 900)),
        (band(local, 900, 900), band(live, 900, 900)),
    ]
    compose(rows, f"{OUT}/cmp-{name}-1920-top.png")
print("composites done")
