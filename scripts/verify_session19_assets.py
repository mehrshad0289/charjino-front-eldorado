#!/usr/bin/env python3
"""Session 19 — verify every NEW asset URL in the become-seller capture
individually (session-13 lesson: each URL carries its own `generation`
param — never batch-verify with a shared param)."""
import re
import subprocess
import sys

SNAP = "ui ux/extracted/snapshots/becomeseller-1920px-light-1.tsx"

s = open(SNAP).read()
urls = sorted(set(re.findall(r'https://storage\.googleapis\.com[^"\s&]+(?:&amp;[^"\s]*)?', s)))
# normalize the JSX &amp; entity back to &
urls = [u.replace("&amp;", "&") for u in urls]

fail = 0
for u in urls:
    r = subprocess.run(
        ["curl", "-s", "-o", "/dev/null", "-w", "%{http_code} %{content_type}",
         "--max-time", "20", u],
        capture_output=True, text=True)
    code = r.stdout.strip()
    ok = code.startswith("200")
    if not ok:
        fail += 1
    print(f"{'OK ' if ok else 'FAIL'} {code}  {u[:110]}")
print(f"\n{len(urls)} URLs, {fail} failures")
sys.exit(1 if fail else 0)
