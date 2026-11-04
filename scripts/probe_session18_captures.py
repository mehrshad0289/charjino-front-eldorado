#!/usr/bin/env python3
"""Identify the .make variant for the session-18 captures (Gift Cards,
Account settings, View Profile) by inspecting the archive members and
the compression framing after the schema chunk."""
import zipfile, sys, struct

CANDIDATES = [
    ("ui ux/Gift Cards/www_eldorado_gg_dashboard_offers_GiftCard_1920w_390w_1536w_default.make", "giftcard"),
    ("ui ux/Account settings/www_eldorado_gg_dashboard_settings_1920w_390w_1536w_default.make", "settings"),
    ("ui ux/View Profile/About/www_eldorado_gg_users_NewFloat-0una_about_1920w_390w_1536w_default.make", "vp-about"),
    ("ui ux/View Profile/Reviews/www_eldorado_gg_users_NewFloat-0una_reviews_1920w_390w_1536w_default.h2d", "vp-reviews"),
    ("ui ux/View Profile/Shop/www_eldorado_gg_users_NewFloat-0una_shop_Currency_1920w_390w_1536w_default (1).make", "vp-shop"),
]

for path, tag in CANDIDATES:
    print(f"=== {tag}: {path}")
    try:
        z = zipfile.ZipFile(path)
        names = z.namelist()
        print(f"  zip members: {names}")
        for n in names:
            data = z.read(n)
            print(f"  {n}: {len(data)} bytes  head={data[:24].hex()}")
            if n.endswith(".fig"):
                # walk chunks: [u32 len][u32 type][payload]
                off = 0
                idx = 0
                while off + 8 <= len(data) and idx < 12:
                    (ln,) = struct.unpack(">I", data[off:off+4])
                    (ty,) = struct.unpack(">I", data[off+4:off+8])
                    nxt = data[off+8:off+8+min(ln, 16)]
                    print(f"    chunk@{off} type={ty} len={ln} head={nxt.hex()}")
                    off += 8 + ln
                    idx += 1
    except zipfile.BadZipFile:
        data = open(path, "rb").read()
        print(f"  NOT a zip: {len(data)} bytes head={data[:40].hex()}")
        try:
            t = data[:200].decode("utf-8", "replace")
            print(f"  text head: {t!r}")
        except Exception:
            pass
    except Exception as e:
        print(f"  ERROR: {e}")
    print()
