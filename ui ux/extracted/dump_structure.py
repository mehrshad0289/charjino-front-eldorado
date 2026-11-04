#!/usr/bin/env python3
"""Dump a readable structural outline of a decoded snapshot region:
one line per element with its key classes and text (depth-indented)."""
import re, sys

path, start, end = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
src = open(path).read()[start:end]

pos = 0
depth = 0
out = []
token_re = re.compile(r'<(\w+)([^>]*)>|</\w+>|([^<>]+)')
SKIP = {"svg", "path", "circle", "rect", "line", "g", "defs", "clipPath", "mask", "style", "br"}
for m in token_re.finditer(src):
    tag, attrs, text = m.group(1), m.group(2), m.group(3)
    if tag:
        if m.group(0).startswith("</"):
            depth = max(0, depth - 1)
            continue
        if tag in SKIP:
            continue
        cls = re.search(r'className="([^"]*)"', attrs)
        c = ""
        if cls:
            keep = re.findall(
                r"(?:mt|mb|ml|mr|pt|pb|pl|pr|p|w|h|max-w|min-w|gap|text-\[|bg-\[|rounded|grid-cols|flex|grid|items-|justify-|font-|border)-?[^\s\"_]*",
                cls.group(1),
            )
            c = " ".join(keep[:14])
        alt = re.search(r'alt="([^"]*)"', attrs)
        href = re.search(r'href="([^"]*)"', attrs)
        extra = f' alt={alt.group(1)[:30]}' if alt else ""
        extra += f' href={href.group(1)[:60]}' if href else ""
        if c or extra:
            out.append("  " * depth + f"<{tag}> {c}{extra}")
        depth += 1
    elif text and text.strip():
        t = " ".join(text.split())[:90]
        if t:
            out.append("  " * depth + f'"{t}"')
print("\n".join(out))
