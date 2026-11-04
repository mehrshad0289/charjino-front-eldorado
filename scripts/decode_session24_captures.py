#!/usr/bin/env python3
"""Session 24 — decode the 2 NEWEST user-pushed .make captures
(commits 12bc93a + 44073b5, both 'add file'):

  - ui ux/shop-Nothing-found/www_eldorado_gg_playstation-plus_t_s-essential-1-month_1920w_390w_1536w_default.make
  - ui ux/shop-Subscription/www_eldorado_gg_amazon-prime_t_269_attribute_value_id_prime-video-1-month_1920w_390w_1536w_default.make

Same ZIP + canvas.fig framing as decode_session22_captures.py; reuses
its helpers via decode_session18_captures.py import.
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

from decode_session22_captures import main as _unused  # noqa: F401,E402
import decode_session22_captures as d22  # noqa: E402
import zipfile  # noqa: E402
import re  # noqa: E402

CAPTURES = {
    "psplus": os.path.join(
        d22.UIUX, "shop-Nothing-found",
        "www_eldorado_gg_playstation-plus_t_s-essential-1-month_1920w_390w_1536w_default.make"),
    "primevideo": os.path.join(
        d22.UIUX, "shop-Subscription",
        "www_eldorado_gg_amazon-prime_t_269_attribute_value_id_prime-video-1-month_1920w_390w_1536w_default.make"),
}


def main() -> None:
    os.makedirs(d22.SNAPDIR, exist_ok=True)
    for tag, path in CAPTURES.items():
        print(f"=== {tag}: {os.path.basename(path)}")
        z = zipfile.ZipFile(path)
        fig = z.read("canvas.fig")
        text = d22.scene_graph_text(fig, tag)
        parts = text.split("import React from 'react';")
        print(f"  snapshot-parts: {len(parts) - 1}")
        made = 0
        for p in parts[1:]:
            if len(p) < 5000:
                continue
            made += 1
            m = re.search(r'"width":"(\d{3,4})px"', p[:800])
            width = m.group(1) if m else "?"
            dark = ("bg-[rgb(24,_24,_27)]" in p[:3000]
                    or "bg-headerdark" in p[:3000]
                    or '"#18181b"' in p[:3000])
            fn = os.path.join(d22.SNAPDIR, f"{tag}-{width}px-{'dark' if dark else 'light'}-{made}.tsx")
            with open(fn, "w") as f:
                f.write("import React from 'react';" + p)
            print(f"  wrote {os.path.basename(fn)} ({len(p)} chars)")


if __name__ == "__main__":
    main()
