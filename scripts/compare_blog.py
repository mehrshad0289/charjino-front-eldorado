#!/usr/bin/env python3
"""Side-by-side comparison strips: local /blog vs live eldorado.gg/blog.
Scales both to the same width and stacks them vertically (local top)."""
from PIL import Image
import sys

def strip(local_path, live_path, out_path, target_w=900):
    loc = Image.open(local_path)
    liv = Image.open(live_path)
    # scale to same width
    def scale(im, w):
        h = round(im.height * w / im.width)
        return im.resize((w, h), Image.LANCZOS)
    loc_s = scale(loc, target_w)
    liv_s = scale(liv, target_w)
    canvas = Image.new("RGB", (target_w * 2 + 12, max(loc_s.height, liv_s.height)), (40, 40, 40))
    canvas.paste(loc_s, (0, 0))
    canvas.paste(liv_s, (target_w + 12, 0))
    canvas.save(out_path, quality=80)
    print(out_path, canvas.size)

if __name__ == "__main__":
    base_live = "/home/z/my-project/charjino-front-eldorado/ui ux/extracted/snapshots"
    for w in sys.argv[1:] or ["1920", "390"]:
        strip(
            f"/tmp/local_blog/local-blog-{w}.png",
            f"{base_live}/live-blog-{w}.png",
            f"/tmp/compare-blog-{w}.jpg",
        )
