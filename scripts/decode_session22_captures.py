#!/usr/bin/env python3
"""Session 22 — decode the NEWEST user-pushed .make captures (commits
8111ede 'add file' + 9f6e420 'add file'):

  - ui ux/messages-notempty/…dashboard_messages…(1).make  (46066 bytes;
    the implemented /dashboard/messages capture `ui ux/Messages/…` is
    39875 bytes and EMPTY-state — this one is expected to be the
    conversation-open state)
  - ui ux/Boosting-Champions-Finals/…ea-fc-boosting_b_142-4…(1).make
    (57557 bytes; the implemented session-19 capture `Boosting-rivals/…`
    is 47347 bytes)

Same NATIVE fig-make framing as decode_session18_captures.py (zstd OR
deflate+4 scene-graph chunks). Reuses its helpers via import.
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

from decode_session18_captures import UIUX, SNAPDIR, scene_graph_text  # noqa: E402

import re  # noqa: E402
import zipfile  # noqa: E402

CAPTURES = {
    "msgnotempty": os.path.join(
        UIUX, "messages-notempty",
        "www_eldorado_gg_dashboard_messages_1920w_390w_1536w_default (1).make"),
    "boostfinals": os.path.join(
        UIUX, "Boosting-Champions-Finals",
        "www_eldorado_gg_ea-fc-boosting_b_142-4_1920w_390w_1536w_default (1).make"),
}


def main() -> None:
    os.makedirs(SNAPDIR, exist_ok=True)
    tags = sys.argv[1:] or list(CAPTURES)
    for tag in tags:
        path = CAPTURES[tag]
        print(f"=== {tag}: {os.path.basename(path)}")
        z = zipfile.ZipFile(path)
        fig = z.read("canvas.fig")
        text = scene_graph_text(fig, tag)
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
            fn = os.path.join(SNAPDIR, f"{tag}-{width}px-{'dark' if dark else 'light'}-{made}.tsx")
            with open(fn, "w") as f:
                f.write("import React from 'react';" + p)
            print(f"  {fn}  ({len(p)} chars)")
        if not made:
            raw = os.path.join("/tmp", f"{tag}_scene.txt")
            with open(raw, "w") as f:
                f.write(text)
            print(f"  no snapshots found; raw text saved to {raw}")


if __name__ == "__main__":
    main()
