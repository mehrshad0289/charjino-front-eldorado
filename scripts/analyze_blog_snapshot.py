#!/usr/bin/env python3
"""Analyze the decoded blog snapshot: outline of sections, headings, links,
images, and key text so the implementation mirrors the capture exactly."""
import re
import html as htmllib

p = "/home/z/my-project/charjino-front-eldorado/ui ux/extracted/snapshots/blog-1920px-light-1.tsx"
src = open(p).read()

# 1. structural outline: section/header/main/footer/ul/li/h1-h6/a/img/button with classes (truncated)
depth = 0
pos = 0
out = []
for m in re.finditer(r"<(/?)(header|main|section|footer|ul|li|h1|h2|h3|h4|h5|h6|a|img|button|div|span|p|nav|aside)([^>]*)>", src):
    close, tag, attrs = m.group(1), m.group(2), m.group(3)
    if close:
        depth = max(depth - 1, 0)
        continue
    cls = re.search(r'className="([^"]*)"', attrs)
    href = re.search(r'href="([^"]*)"', attrs)
    alt = re.search(r'alt="([^"]*)"', attrs)
    if tag in ("div", "span", "p") and not cls:
        continue
    indent = "  " * min(depth, 12)
    info = [indent + tag]
    if cls:
        info.append("C=" + cls.group(1)[:110])
    if href:
        info.append("H=" + htmllib.unescape(href.group(1))[:100])
    if alt:
        info.append("A=" + htmllib.unescape(alt.group(1))[:80])
    out.append(" | ".join(info))
    if not tag in ("img",):
        depth += 1
print("\n".join(out[:200]))
