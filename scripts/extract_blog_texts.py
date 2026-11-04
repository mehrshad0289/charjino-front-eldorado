#!/usr/bin/env python3
"""Extract every text node + count cards + check footer from blog snapshot."""
import re
import html as htmllib

p = "/home/z/my-project/charjino-front-eldorado/ui ux/extracted/snapshots/blog-1920px-light-1.tsx"
src = open(p).read()

print("=== footer present? ===", "footer" in src.lower())
print("=== <main> count:", src.count("<main"))
print("=== section count:", src.count("<section"))

# text nodes: text between > and < that has letters
texts = []
for m in re.finditer(r">([^<>]{2,})<", src):
    t = htmllib.unescape(m.group(1)).strip()
    if t and re.search(r"[A-Za-z]", t):
        texts.append(t)
# dedupe preserving order
seen = set()
uniq = [t for t in texts if not (t in seen or seen.add(t))]
print("=== text nodes (%d unique) ===" % len(uniq))
for t in uniq:
    print(repr(t))

print("\n=== article card count (140x140 imgs):", len(re.findall(r"w-\[140px\]", src)))
print("=== pagination spans/links ===")
nav = src[src.index("<nav"):]
for m in re.finditer(r"<(a|span)[^>]*>([^<]*)</", nav):
    print(m.group(1), repr(m.group(2).strip()))
