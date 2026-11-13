#!/usr/bin/env python3
"""Decode the wallet .make capture into TSX snapshots."""
import io
import os
import re
import struct
import zipfile
import zlib

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
MAKE = os.path.join(os.path.dirname(ROOT), "www_eldorado_gg_dashboard_wallet_1920w_390w_1536w_default.make")
SNAPDIR = os.path.join(ROOT, "ui ux", "extracted", "snapshots")


def try_deflate(data: bytes):
    try:
        d = zlib.decompressobj(wbits=-15)
        out = d.decompress(data)
        if len(out) > 200:
            return out
    except Exception:
        pass
    return None


def try_zstd(data: bytes):
    try:
        import zstandard as zstd

        return zstd.ZstdDecompressor().stream_reader(io.BytesIO(data)).read()
    except Exception:
        return None


def scene_graph_text(fig: bytes) -> str:
    out = []
    off = 8
    n = 0
    while off + 4 <= len(fig):
        (u32,) = struct.unpack("<I", fig[off : off + 4])
        if off == 8:
            (clen,) = struct.unpack("<I", fig[off + 4 : off + 8])
            payload = fig[off + 8 : off + 8 + clen]
            data = try_deflate(payload)
            if data is None:
                break
            out.append(data)
            off = off + 8 + clen
        else:
            clen = u32
            payload = fig[off + 4 : off + 4 + clen]
            data = try_zstd(payload)
            if data is None:
                data = try_deflate(payload[4:])
            if data is None:
                data = try_deflate(payload)
            if data is None:
                break
            out.append(data)
            off = off + 4 + clen
        n += 1
    blob = b"\n".join(out)
    keep = bytes(b for b in blob if 32 <= b < 127 or b in (9, 10, 13))
    return keep.decode("ascii", "replace")


def main() -> None:
    os.makedirs(SNAPDIR, exist_ok=True)
    z = zipfile.ZipFile(MAKE)
    fig = z.read("canvas.fig")
    text = scene_graph_text(fig)
    parts = text.split("import React from 'react';")
    print("snapshot-parts", len(parts) - 1)
    for i, part in enumerate(parts[1:], 1):
        m = re.search(r'"width":"(\d{3,4})px"', part[:2000])
        width = m.group(1) if m else "unk"
        fn = os.path.join(SNAPDIR, f"wallet-{width}px-light-{i}.tsx")
        with open(fn, "w", encoding="utf-8") as f:
            f.write("import React from 'react';" + part)
        print(fn, "chars", len(part))
        for pat in ("assasin", "assassin", "88ee8d54", "465px", "Balance", "Wallet", "linear-gradient", "object-cover"):
            print(" ", pat, part.count(pat))


if __name__ == "__main__":
    main()
