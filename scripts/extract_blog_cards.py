#!/usr/bin/env python3
"""Extract per-card data v2: split top-level <li> cards on gridArea markers."""
import re
import html as htmllib

p = "/home/z/my-project/charjino-front-eldorado/ui ux/extracted/snapshots/blog-1920px-light-1.tsx"
src = open(p).read()

ul_start = src.index('<ul className="grid-cols-2 grid gap-[24px]"')
# the latest-grid <ul> ends right before the pagination <nav>
nav_start = src.index("<nav")
block = src[ul_start:nav_start]

# top-level cards start with <li className="self-start list-none w-full" style={{"gridArea":...}}
starts = [m.start() for m in re.finditer(r'<li className="self-start list-none w-full"', block)]
starts.append(len(block))
print(f"{len(starts)-1} cards")
for i in range(len(starts) - 1):
    c = block[starts[i]:starts[i + 1]]
    href = htmllib.unescape(re.search(r'href="([^"]*)"', c).group(1))
    img = re.search(r'src="([^"]*)"', c).group(1)
    alt = htmllib.unescape(re.search(r'alt="([^"]*)"', c).group(1))
    texts = re.findall(r">([^<>]+)<", c)
    texts = [htmllib.unescape(t).strip() for t in texts if t.strip() and re.search(r"[A-Za-z0-9]", t)]
    area = re.search(r'"gridArea":"([^"]*)"', c).group(1)
    print(f"--- card {i+1} area={area} ---")
    print(" cat/title/date/read:", texts)
    print(" href:", href)
    print(" img:", img[:150])
    print(" alt:", alt)

# section-2 (Play Smart) icons: find the grid-cols-4 part
g4 = src.index("grid-cols-4 grid gap-[24px]")
seg = src[g4:g4 + 6000]
print("\n=== section-2 icon srcs ===")
for m in re.finditer(r'src="([^"]*)"', seg):
    print(m.group(1)[:150])

# check section-2 first div full attrs (bg color of icon circles)
print("\n=== icon circle divs ===")
for m in re.finditer(r'<div className="items-center inline-flex justify-center text-center w-\[60px\] h-\[60px\][^"]*" style=\{\{"backgroundColor":"([^"]*)"', src):
    print(m.group(1))
