#!/usr/bin/env python3
"""Session 19 — verify every asset URL in the checkout capture
individually (handles both &amp;-escaped img srcs and raw-& style URLs)."""
import re
import subprocess
import sys

SNAP = "ui ux/extracted/snapshots/checkout-1920px-light-1.tsx"

s = open(SNAP).read()
# img srcs carry &amp; entities; style urls carry raw &
urls = set()
for m in re.findall(r'https://storage\.googleapis\.com[^"\s]+?(?:&amp;alt=media|&alt=media)', s):
    urls.add(m.replace("&amp;", "&"))

fail = 0
for u in sorted(urls):
    r = subprocess.run(
        ["curl", "-s", "-o", "/dev/null", "-w", "%{http_code} %{content_type}", "--max-time", "20", u],
        capture_output=True, text=True)
    ok = r.stdout.startswith("200")
    if not ok:
        fail += 1
    print(f"{'OK ' if ok else 'FAIL'} {r.stdout.strip()}  {u[:105]}")
print(f"\n{len(urls)} URLs, {fail} failures")
sys.exit(1 if fail else 0)
