#!/usr/bin/env python3
"""Session 14 — build local|live side-by-side strips for the blog ARTICLE page.

Takes aligned crops from the local capture and the committed live reference
(ui ux/extracted/snapshots/live-blog-article-guide-<w>.png). Because the
live page infinite-scrolls extra articles below Related Guides, the bottom
strip compares the FOOTER region (last N px of each page) rather than
absolute offsets.

Outputs /tmp/shots/cmp-<w>-<name>.png (two columns, labeled).
"""

from PIL import Image, ImageDraw

LIVE = "ui ux/extracted/snapshots/live-blog-article-guide-{w}.png"
LOCAL = "/tmp/shots/local-article-{w}.png"
OUT = "/tmp/shots"

# (name, width, live_top, local_top, height)
REGIONS = [
    ("top", 1920, 0, 0, 2200),
    ("top", 390, 0, 0, 2400),
    ("entry-mid", 1920, 4200, 3600, 2000),
    ("entry-mid", 390, 5200, 4600, 2400),
    ("bottom", 1920, -2400, -2400, 2400),
    ("bottom", 390, -2600, -2600, 2600),
]


def crop(im, top, h):
    if top < 0:
        top = max(0, im.height + top)
    h = min(h, im.height - top)
    return im.crop((0, top, im.width, top + h))


def strip(name, w, live_t, local_t, h):
    live = Image.open(LIVE.format(w=w)).convert("RGB")
    local = Image.open(LOCAL.format(w=w)).convert("RGB")
    lc = crop(live, live_t, h)
    kc = crop(local, local_t, h)
    H = max(lc.height, kc.height)
    canvas = Image.new("RGB", (live.width + local.width + 12, H), (255, 0, 255))
    canvas.paste(lc, (0, 0))
    canvas.paste(kc, (live.width + 12, 0))
    d = ImageDraw.Draw(canvas)
    d.rectangle([0, 0, 90, 26], fill=(255, 0, 0))
    d.text((6, 6), "LIVE", fill=(255, 255, 255))
    d.rectangle([live.width + 12, 0, live.width + 102, 26], fill=(0, 90, 255))
    d.text((live.width + 18, 6), "LOCAL", fill=(255, 255, 255))
    # downscale to keep file small
    scale = 1400 / canvas.width if canvas.width > 1400 else 1
    if scale < 1:
        canvas = canvas.resize((int(canvas.width * scale), int(canvas.height * scale)))
    canvas.save(f"{OUT}/cmp-{w}-{name}.png")
    print(f"cmp-{w}-{name}.png", canvas.size)


for name, w, lt, kt, h in REGIONS:
    strip(name, w, lt, kt, h)
