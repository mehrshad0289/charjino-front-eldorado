#!/usr/bin/env python3
"""Session 12 — side-by-side comparison strips: live eldorado.gg/blog (left)
vs local charjino /blog (right). Output → docs/ui-ux/screenshots/session12/."""
import sys
from PIL import Image, ImageDraw

LIVE_DIR = "ui ux/extracted/snapshots"
OUT_DIR = "docs/ui-ux/screenshots/session12"

def strip(live_path, local_path, out_name, y0, y1, label):
    live = Image.open(live_path)
    local = Image.open(local_path)
    # clamp y1 to both heights
    h1 = min(y1, live.height)
    h2 = min(y1, local.height)
    left = live.crop((0, y0, live.width, h1))
    right = local.crop((0, y0, local.width, h2))
    h = max(left.height, right.height)
    gap = 24
    canvas = Image.new("RGB", (live.width * 2 + gap, h + 30), (255, 0, 255))
    canvas.paste(left, (0, 30))
    canvas.paste(right, (live.width + gap, 30))
    d = ImageDraw.Draw(canvas)
    d.text((8, 6), f"LIVE {label} (h={live.height})", fill=(255, 255, 0))
    d.text((live.width + gap + 8, 6), f"LOCAL {label} (h={local.height})", fill=(0, 255, 255))
    canvas.save(f"{OUT_DIR}/{out_name}")
    print(out_name, canvas.size)

# Desktop 1920 — two vertical chunks
strip(f"{LIVE_DIR}/live-blog-1920.png", f"{OUT_DIR}/blog-1920.png",
      "cmp-1920-top.png", 0, 1500, "@1920 top")
strip(f"{LIVE_DIR}/live-blog-1920.png", f"{OUT_DIR}/blog-1920.png",
      "cmp-1920-bottom.png", 1500, 2931, "@1920 bottom")
# Mobile 390 — two vertical chunks
strip(f"{LIVE_DIR}/live-blog-390.png", f"{OUT_DIR}/blog-390.png",
      "cmp-390-top.png", 0, 2600, "@390 top")
strip(f"{LIVE_DIR}/live-blog-390.png", f"{OUT_DIR}/blog-390.png",
      "cmp-390-bottom.png", 2600, 5210, "@390 bottom")
