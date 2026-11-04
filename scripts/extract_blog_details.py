#!/usr/bin/env python3
"""Remaining blog snapshot details: full URLs, featured block, section-2
structure, header logo, meta rows."""
import re
import html as htmllib

p = "/home/z/my-project/charjino-front-eldorado/ui ux/extracted/snapshots/blog-1920px-light-1.tsx"
src = open(p).read()

print("=== featured article block (full) ===")
i = src.index("mark-darrah")
start = src.rindex("<a", 0, i)
end = src.index("</a>", i) + 4
print(htmllib.unescape(src[start:end]))

print("\n=== full image/icon URLs ===")
for m in re.finditer(r'src="(https://storage\.googleapis\.com[^"]*)"', src):
    print(htmllib.unescape(m.group(1)))
