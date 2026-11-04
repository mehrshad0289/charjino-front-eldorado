#!/usr/bin/env python3
"""Session 18 — extract the DSA page content VERBATIM from the decoded
snapshot (dsa-1920px-light-1.tsx) into a Tailwind-classed HTML string for
legalData.js (same convention as the session-17c privacy/terms extraction):
JSX className -> class, drop style objects/pseudo elements, keep p/ul/li/b/a.
Writes /tmp/dsa_html.txt."""
import re

SNAP = "ui ux/extracted/snapshots/dsa-1920px-light-1.tsx"

s = open(SNAP).read()

# content region: the 682px column between the CategoryNav and the footer
start = s.find('<p className="mb-[16px]')
end = s.rfind("</main>")
assert start != -1 and end != -1 and end > start, (start, end)
seg = s[start:end]

# close the final content element cleanly: cut at the last complete tag
last_p = seg.rfind("</p>")
last_ul = seg.rfind("</ul>")
seg = seg[: max(last_p, last_ul) + 4]

# strip html.to.design artifacts
seg = re.sub(r"<pseudo[^>]*>.*?</pseudo>", "", seg, flags=re.S)
seg = re.sub(r"<pseudo[^>]*/?>", "", seg)
seg = re.sub(r'style=\{\{[^}]*\}\}', "", seg)
# self-closing artifacts with empty content spans (icomoon glyphs)
seg = re.sub(r'<span className="block w-6 h-6[^"]*"[^>]*>\s*</span>', "", seg)
seg = re.sub(r'<div className="overflow-hidden w-6 h-6">\s*</div>', "", seg)

# JSX -> HTML
seg = seg.replace("className=", "class=")
seg = seg.replace("{`" + '"' + "`}", "")  # safety no-op
seg = re.sub(r">\s+<", "><", seg)

open("/tmp/dsa_html.txt", "w").write(seg)
print("chars:", len(seg))
print(seg[:600])
print("...")
print(seg[-400:])
