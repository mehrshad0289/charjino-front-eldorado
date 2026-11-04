#!/usr/bin/env python3
"""Session 22 — extract the visible-text outline of the decoded
messages2 snapshots in document order, with the enclosing tag's key
classes/styles, to recover the page anatomy for implementation."""
import re
import sys

PATHS = [
    "ui ux/extracted/snapshots/messages2-1920px-light-1.tsx",
]

TAG_RE = re.compile(r"<(bdi|span|div|h1|h2|h3|p|button|a|input|img|textarea)\b([^>]*)>", re.S)
TEXT_CHUNK_RE = re.compile(r">([^<>{}]+)<")


def clean(s: str) -> str:
    return re.sub(r"\s+", " ", s).strip()


for path in PATHS:
    src = open(path).read()
    print(f"===== {path} ({len(src)} chars)")
    # walk tags; collect text directly following each opening tag before the next tag
    events = []
    for m in TAG_RE.finditer(src):
        tag, attrs = m.group(1), m.group(2)
        cls = re.search(r'className="([^"]*)"', attrs)
        style = re.search(r'style=\{\{"([^"]*)"?', attrs)
        alt = re.search(r'alt="([^"]*)"', attrs)
        events.append((m.start(), "open", tag, clean(cls.group(1))[:150] if cls else "",
                       clean(alt.group(1))[:80] if alt else ""))
    textevents = [(m.start(), "text", clean(m.group(1))) for m in TEXT_CHUNK_RE.finditer(src)]
    stream = sorted(events + textevents, key=lambda e: e[0])
    stack = []
    out = 0
    for pos, kind, *rest in stream:
        if kind == "open":
            stack.append(rest[0])  # tag
            if rest[1] or rest[2]:
                pass
        else:
            text = rest[0] if rest else ""
            if not text:
                continue
            parent = stack[-1] if stack else "?"
            print(f"[{parent}] {text[:110]}")
            out += 1
            if out > 400:
                sys.exit(0)
        # naive close tracking: skip (good enough for outline)
