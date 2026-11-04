#!/usr/bin/env python3
"""Extract blog capture zip contents: meta.json, thumbnail, images list."""
import os, sys, zipfile

HERE = os.path.dirname(os.path.abspath(__file__))
UIUX = os.path.join(HERE, "..", "ui ux")
target = os.path.join(UIUX, "blog", "www_eldorado_gg_blog_1920w_390w_1536w_default.make")
z = zipfile.ZipFile(target)
outdir = "/tmp/blog_zip"
z.extractall(outdir)
for n in z.namelist():
    info = z.getinfo(n)
    print(f"{n}  ({info.file_size} bytes)")
print("--- meta.json ---")
print(z.read("meta.json").decode("utf-8", "replace")[:2000])
