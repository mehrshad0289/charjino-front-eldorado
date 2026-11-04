#!/usr/bin/env python3
"""Session 18 — decode the NEW user-pushed .make captures.

All five files are NATIVE fig-make containers like the blog/contact
captures (scripts/decode_blog_capture.py framing):

  magic 'fig-make'(8)
  chunk 0: [u32 87][u32 clen][raw-deflate data(clen)]   -> schema
  then EITHER [u32 clen][zstd frame(clen)]               -> scene graph (blog/contact/16)
       OR     [u32 clen][u32 ?][raw-deflate data(clen)]  -> scene graph (session-17 wallet/messages variant)

We try zstd first; if the frame does not validate, retry as raw-deflate
with a 4-byte skip. Printable runs are concatenated, split on the
'import React' snapshot boundary and classified by width.

Usage: python3 scripts/decode_session18_captures.py [tag ...]
Tags: giftcard settings vpabout vpshop (vp-reviews .h2d is handled separately)
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
    "dashgiftcard": os.path.join(
        UIUX, "Gift Cards",
        "www_eldorado_gg_dashboard_offers_GiftCard_1920w_390w_1536w_default.make"),
    "settings": os.path.join(
        UIUX, "Account settings",
        "www_eldorado_gg_dashboard_settings_1920w_390w_1536w_default.make"),
    "vpabout": os.path.join(
        UIUX, "View Profile", "About",
        "www_eldorado_gg_users_NewFloat-0una_about_1920w_390w_1536w_default.make"),
    "vpshop": os.path.join(
        UIUX, "View Profile", "Shop",
        "www_eldorado_gg_users_NewFloat-0una_shop_Currency_1920w_390w_1536w_default (1).make"),
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
    off = 8  # skip magic
    n = 0
    variants = []
    while off + 4 <= len(fig):
        (u32,) = struct.unpack("<I", fig[off:off + 4])
        if off == 8:
            # chunk 0: [u32 type=87][u32 clen][deflate data(clen)]
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
            # later chunks: [u32 clen][zstd frame] OR [u32 clen][u32 ?][deflate data]
            clen = u32
            payload = fig[off + 4:off + 4 + clen]
            data = try_zstd(payload)
            kind = "zstd"
            if data is None:
                data = try_deflate(payload[4:])  # session-17 variant: 4-byte skip
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
                continue  # schema noise, not a snapshot
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
