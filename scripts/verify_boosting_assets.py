#!/usr/bin/env python3
"""Session 19 — verify every NEW asset URL in the boosting capture
individually (session-13 lesson: each URL carries its own `generation`
param; dedupe shared URLs like the trust checkbox)."""
import re
import subprocess
import sys

SNAP = "ui ux/extracted/snapshots/boosting-1920px-light-1.tsx"

s = open(SNAP).read()
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
    print(f"{'OK ' if ok else 'FAIL'} {r.stdout.strip()}  {u[:100]}")
print(f"\n{len(urls)} unique URLs, {fail} failures")
sys.exit(1 if fail else 0)
