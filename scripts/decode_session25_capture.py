#!/usr/bin/env python3
"""Session 25 — decode the NEWEST user-pushed .make capture:

  - ui ux/shop-giftcart-gamepass-xbox/www_eldorado_gg_xbox-game-pass_t_103_attribute_value_id_xbox-ultimate-1-month_te_v0_Europe_1920w_390w_1536w_default.make

Same ZIP + canvas.fig framing as decode_session24_captures.py; reuses
the session-22/18 helpers via import.
"""
import os
import sys
import re
import zipfile

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

from decode_session22_captures import main as _unused  # noqa: F401,E402
import decode_session22_captures as d22  # noqa: E402

CAPTURE = os.path.join(
    d22.UIUX, "shop-giftcart-gamepass-xbox",
    "www_eldorado_gg_xbox-game-pass_t_103_attribute_value_id_xbox-ultimate-1-month_te_v0_Europe_1920w_390w_1536w_default.make")


def main() -> None:
    os.makedirs(d22.SNAPDIR, exist_ok=True)
    print(f"=== xboxgp-europe: {os.path.basename(CAPTURE)}")
    z = zipfile.ZipFile(CAPTURE)
    fig = z.read("canvas.fig")
    text = d22.scene_graph_text(fig, "xboxgp-europe")
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
        fn = os.path.join(d22.SNAPDIR, f"xboxgp-europe-{width}px-{'dark' if dark else 'light'}-{made}.tsx")
        with open(fn, "w") as f:
            f.write("import React from 'react';" + p)
        print(f"  wrote {os.path.basename(fn)} ({len(p)} chars)")
    if not made:
        raw = os.path.join("/tmp", "xboxgp-europe_scene.txt")
        with open(raw, "w") as f:
            f.write(text)
        print(f"  no snapshots found; raw text saved to {raw}")


if __name__ == "__main__":
    main()
