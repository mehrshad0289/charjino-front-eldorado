#!/usr/bin/env python3
"""Session 19 — decode the user-pushed become-seller .make capture
(origin 4b8246c "nfluencer-program", merged 02e63b4).

Same native fig-make pipeline as decode_session18_captures.py:
  magic 'fig-make'(8)
  chunk 0: [u32 87][u32 clen][raw-deflate data(clen)]   -> schema
  then [u32 clen][zstd frame]  OR  [u32 clen][u32 ?][deflate]  -> scene graph
Printable runs concatenated, split on 'import React' snapshot boundary,
classified by width + dark/light.

Usage: python3 scripts/decode_session19_becomeseller.py
"""
import io
import os
import re
import struct
import sys
import zipfile
import zlib

HERE = os.path.dirname(os.path.abspath(__file__))
UIUX = os.path.join(HERE, "..", "ui ux")
SNAPDIR = os.path.join(UIUX, "extracted", "snapshots")

CAPTURES = {
    "becomeseller": os.path.join(
        UIUX, "become-seller",
        "www_eldorado_gg_become-seller_1920w_390w_1536w_default.make"),
    # user-pushed 5e937e0 (session 19): checkout for a boosting order
    "checkout": os.path.join(
        UIUX, "checkout",
        "www_eldorauantity_1_category_RequestedBoosting_gameId_142_1920w_390w_1536w_default.make"),
}


def try_zstd(data: bytes):
    try:
        import zstandard as zstd
        return zstd.ZstdDecompressor().stream_reader(io.BytesIO(data)).read()
    except Exception:
        return None


def try_deflate(data: bytes):
    try:
        d = zlib.decompressobj(wbits=-15)
        out = d.decompress(data)
        if len(out) > 200:
            return out
    except Exception:
        pass
    return None


def scene_graph_text(fig: bytes, tag: str) -> str:
    out = []
    off = 8
    n = 0
    variants = []
    while off + 4 <= len(fig):
        (u32,) = struct.unpack("<I", fig[off:off + 4])
        if off == 8:
            (clen,) = struct.unpack("<I", fig[off + 4:off + 8])
            payload = fig[off + 8:off + 8 + clen]
            data = try_deflate(payload)
            if data is None:
                print(f"  [{tag}] chunk0 deflate FAILED at clen={clen}")
                break
            out.append(data)
            off = off + 8 + clen
            variants.append("deflate")
        else:
            clen = u32
            payload = fig[off + 4:off + 4 + clen]
            data = try_zstd(payload)
            kind = "zstd"
            if data is None:
                data = try_deflate(payload[4:])
                kind = "deflate+4"
                if data is None:
                    data = try_deflate(payload)
                    kind = "deflate+0"
            if data is None:
                print(f"  [{tag}] chunk {n} undecodable (clen={clen}) — stop")
                break
            variants.append(kind)
            out.append(data)
            off = off + 4 + clen
        n += 1
    print(f"  [{tag}] chunks={n} variants={variants} bytes={sum(len(b) for b in out)}")
    blob = b"\n".join(out)
    keep = bytes(b for b in blob if 32 <= b < 127 or b in (9, 10, 13))
    return keep.decode("ascii", "replace")


def main() -> None:
    os.makedirs(SNAPDIR, exist_ok=True)
    tags = sys.argv[1:] or list(CAPTURES)
    for tag in tags:
      decode_tag(tag)

def decode_tag(tag: str) -> None:
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
