#!/usr/bin/env python3
"""Session 12 — decode the blog .make capture.

Unlike the earlier html.to.design .make files, this capture is a NATIVE
Figma file: canvas.fig = 'fig-make' chunked container where chunk 0 is the
schema (raw deflate) and chunk 1 is a zstd frame holding the scene graph
with the full html.to.design App.tsx snapshots embedded as strings.

Layout (verified on this file):
  magic 'fig-make'(8) | u32 type=87 | u32 clen=30850 | raw-deflate data(clen)
  then: u32 clen=8638 | zstd frame(clen) -> scene graph (App.tsx text)

Output: ui ux/extracted/snapshots/blog-1920px-light-N.tsx
"""
import io
import os
import re
import struct
import sys
import zipfile

import zstandard as zstd

HERE = os.path.dirname(os.path.abspath(__file__))
UIUX = os.path.join(HERE, "..", "ui ux")
SNAPDIR = os.path.join(UIUX, "extracted", "snapshots")
TARGET = os.path.join(UIUX, "blog", "www_eldorado_gg_blog_1920w_390w_1536w_default.make")


def scene_graph_text(fig: bytes) -> str:
    """Walk the fig-make chunks and return the zstd scene-graph bytes as text."""
    out = []
    off = 8  # skip magic
    n = 0
    while off + 4 <= len(fig):
        (u32,) = struct.unpack("<I", fig[off : off + 4])
        if off == 8:
            # chunk 0: [u32 ?][u32 clen][deflate data(clen)]
            (clen,) = struct.unpack("<I", fig[off + 4 : off + 8])
            d = zlib_obj = __import__("zlib").decompressobj(wbits=-15)
            data = d.decompress(fig[off + 8 : off + 8 + clen])
            out.append(data)
            off = off + 8 + clen
        else:
            # later chunks: [u32 clen][zstd frame(clen)]
            data = fig[off + 4 : off + 4 + u32]
            out.append(zstd.ZstdDecompressor().stream_reader(io.BytesIO(data)).read())
            off = off + 4 + u32
        n += 1
    print(f"chunks parsed: {n}, scene graph bytes: {sum(len(b) for b in out)}")
    blob = b"\n".join(out)
    keep = bytes(b for b in blob if 32 <= b < 127 or b in (9, 10, 13))
    return keep.decode("ascii", "replace")


def main() -> None:
    os.makedirs(SNAPDIR, exist_ok=True)
    z = zipfile.ZipFile(TARGET)
    fig = z.read("canvas.fig")
    text = scene_graph_text(fig)

    parts = text.split("import React from 'react';")
    print(f"snapshot-parts: {len(parts) - 1}")
    made = 0
    for p in parts[1:]:
        if len(p) < 5000:
            continue  # schema noise, not a snapshot
        made += 1
        m = re.search(r'"width":"(\d{3,4})px"', p[:800])
        width = m.group(1) if m else "?"
        dark = (
            "bg-[rgb(24,_24,_27)]" in p[:3000]
            or "bg-headerdark" in p[:3000]
            or '"#18181b"' in p[:3000]
        )
        fn = os.path.join(SNAPDIR, f"blog-{width}px-{'dark' if dark else 'light'}-{made}.tsx")
        with open(fn, "w") as f:
            f.write("import React from 'react';" + p)
        print(f"  {fn}  ({len(p)} chars)")
    if not made:
        # fallback: save the raw scene graph text for manual analysis
        with open("/tmp/blog_scene.txt", "w") as f:
            f.write(text)
        print("no snapshots found; raw text saved to /tmp/blog_scene.txt")


if __name__ == "__main__":
    main()
