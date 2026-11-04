#!/usr/bin/env python3
"""Inspect the blog .make document stream: find what text markers exist."""
import os, sys, zipfile, zlib, re

HERE = os.path.dirname(os.path.abspath(__file__))
UIUX = os.path.join(HERE, "..", "ui ux")
sys.path.insert(0, os.path.join(UIUX, "extracted"))
from fig_reassemble import inflate_all, keep_printable  # noqa: E402

target = os.path.join(UIUX, "blog", "www_eldorado_gg_blog_1920w_390w_1536w_default.make")
z = zipfile.ZipFile(target)
print("zip entries:", z.namelist())
fig = z.read("canvas.fig")
streams = inflate_all(fig)
doc = max(streams, key=len)
text = keep_printable(doc)
open("/tmp/blog_doc.txt", "w").write(text)
print("doc length:", len(doc), "printable:", len(text))
# look for common markers
for marker in ["import React", "from 'react'", "className", "<div", "function", "export default", "width", "1920", "html.to.design"]:
    idxs = [m.start() for m in re.finditer(re.escape(marker), text)][:5]
    print(f"{marker!r}: {len(idxs)} hits, first at {idxs[:3]}")
print("--- first 600 chars ---")
print(text[:600])
