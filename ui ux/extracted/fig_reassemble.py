#!/usr/bin/env python3
"""Reassemble full html.to.design TSX snapshots from the inflated document
stream: keep ALL printable runs (no min length), concatenate, split on the
'import React' snapshot boundary, then classify each snapshot by its width."""
import sys, zipfile, zlib, re, os

def inflate_all(data):
    out, i = [], 0
    while i < len(data) - 2:
        try:
            d = zlib.decompressobj(wbits=-15)
            chunk = d.decompress(data[i:])
            if len(chunk) > 50:
                out.append(chunk)
            consumed = len(data) - i - len(d.unused_data)
            i += max(consumed, 1)
        except Exception:
            i += 1
    return out

def keep_printable(data):
    return bytes(b for b in data if 32 <= b < 127 or b in (9, 10, 13)).decode("ascii", "replace")

def reassemble(fig_bytes, outdir, tag):
    os.makedirs(outdir, exist_ok=True)
    streams = inflate_all(fig_bytes)
    doc = max(streams, key=len)  # document chunk holds the snapshots
    text = keep_printable(doc)
    parts = text.split("import React from 'react';")
    print(f"[{tag}] streams={[len(s) for s in streams]} doclen={len(doc)} printable={len(text)} snapshot-parts={len(parts)-1}")
    n = 0
    for p in parts[1:]:
        if len(p) < 5000:
            continue  # schema noise, not a snapshot
        n += 1
        m = re.search(r'"width":"(\d{3,4})px"', p[:800])
        width = m.group(1) if m else "?"
        # light/dark: html.to.design dark captures set a bg color near top
        dark = 'bg-[rgb(24,_24,_27)]' in p[:3000] or 'bg-headerdark' in p[:3000] or '"#18181b"' in p[:3000]
        fn = os.path.join(outdir, f"{tag}-{width}px-{'dark' if dark else 'light'}-{n}.tsx")
        with open(fn, "w") as f:
            f.write("import React from 'react';" + p)
        print(f"  {fn}  ({len(p)} chars)")
    return n

if __name__ == "__main__":
    for path, tag in [
        ("home/www_eldorado_gg_1920w_390w_1536w_default_light_dark_home.make", "home"),
        ("shop_account/www_eldorado_gg_efootball-accounts_a_183-1-0_pageSize_24_1920w_390w_1366w_default_shop_accounts.make", "shop"),
        ("Menu_desktop/www_eldorado_gg_1920w_390w_1366w_default_menu_desktop.make", "menu"),
        ("home/زمانی که اینپوت سرچ رامیزنسم در حالت موبایلو دسکتاپ/www_eldorado_gg_1920w_390w_1536w_default_light_dark_click-search.make", "search"),
    ]:
        z = zipfile.ZipFile(path)
        reassemble(z.read("canvas.fig"), "extracted/snapshots", tag)
