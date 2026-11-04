#!/usr/bin/env python3
"""Session 19 — side-by-side comparison strips (local vs live) for
/become-seller at 1920 and 390. Splits each page into 3 vertical bands,
pairs them local|live, writes cmp-*.png files."""
from PIL import Image
import os

D = "docs/ui-ux/screenshots/session19"

def strips(local_p, live_p, out_prefix, bands=3, target_w=760):
    loc = Image.open(local_p)
    liv = Image.open(live_p)
    for i in range(bands):
        l = loc.crop((0, loc.height * i // bands, loc.width, loc.height * (i + 1) // bands))
        v = liv.crop((0, liv.height * i // bands, liv.width, liv.height * (i + 1) // bands))
        # scale each band to target_w
        lh = int(l.height * target_w / l.width)
        vh = int(v.height * target_w / v.width)
        l = l.resize((target_w, lh))
        v = v.resize((target_w, vh))
        H = max(lh, vh)
        canvas = Image.new("RGB", (target_w * 2 + 12, H), (40, 40, 40))
        canvas.paste(l, (0, 0))
        canvas.paste(v, (target_w + 12, 0))
        out = os.path.join(D, f"{out_prefix}-band{i+1}.png")
        canvas.save(out)
        print(out, canvas.size)

strips(f"{D}/becomeseller-1920.png", f"{D}/live-becomeseller-1920.png", "cmp-1920")
strips(f"{D}/becomeseller-390.png", f"{D}/live-becomeseller-390.png", "cmp-390")
