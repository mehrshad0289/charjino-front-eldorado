#!/usr/bin/env python3
"""Extract readable structure (text nodes, images, buttons, headings, hrefs)
from a decoded html.to.design TSX snapshot between two char offsets."""
import re, sys

path, start, end = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
src = open(path).read()[start:end]

out = []
i = 0
# crude tokenizer for jsx text and attrs
for m in re.finditer(
    r'(?:src|href)="([^"]+)"|(?:alt|title|placeholder|aria-label)="([^"]*)"|>\s*([A-Za-z0-9][^<>{}\n]{1,120})\s*<',
    src,
):
    s, t, txt = m.group(1), m.group(2), m.group(3)
    if s:
        out.append(("URL " if ".svg" not in s and ".png" not in s else "IMG ") + s[:110])
    elif t:
        out.append("ATTR " + t[:110])
    else:
        txt = " ".join(txt.split())
        if txt and not txt.startswith(("px", "#", "rgb", "var(")):
            out.append("TXT  " + txt[:110])
prev = None
for o in out:
    if o != prev:
        print(o)
    prev = o
