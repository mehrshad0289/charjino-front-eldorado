#!/usr/bin/env python3
"""Build side-by-side local|live comparison strips for /xbox-game-pass.
Each width -> pair image (resized), split into segments, arranged in a grid."""
from PIL import Image
import os

OUT = '/tmp/gamepass-sweep'
PAIR_W = 340   # per side
SEG_H = 1350   # segment height in output px

def build(width):
    loc = Image.open(f'{OUT}/local-{width}.png').convert('RGB')
    liv = Image.open(f'{OUT}/live-{width}.png').convert('RGB')
    def rs(im):
        h = round(im.height * PAIR_W / im.width)
        return im.resize((PAIR_W, h), Image.LANCZOS)
    loc, liv = rs(loc), rs(liv)
    h = max(loc.height, liv.height)
    pair = Image.new('RGB', (PAIR_W * 2 + 12, h), (255, 0, 0))
    pair.paste(loc, (0, 0))
    pair.paste(liv, (PAIR_W + 12, 0))
    n = (h + SEG_H - 1) // SEG_H
    cols = 2 if n > 1 else 1
    rows = (n + cols - 1) // cols
    grid = Image.new('RGB', (cols * (pair.width + 8) - 8, rows * (SEG_H + 8) - 8), (40, 40, 40))
    for i in range(n):
        seg = pair.crop((0, i * SEG_H, pair.width, min((i + 1) * SEG_H, h)))
        c, r = i % cols, i // cols
        grid.paste(seg, (c * (pair.width + 8), r * (SEG_H + 8)))
    grid.save(f'{OUT}/cmp-{width}.jpg', quality=72)
    print(f'cmp-{width}.jpg: {grid.size}, segments={n}')

for w in [1920, 1536, 1024, 768, 390]:
    build(w)
