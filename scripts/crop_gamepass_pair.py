#!/usr/bin/env python3
"""Targeted local|live crops for /xbox-game-pass comparison.
Account for live scrollbar (15px) when picking x-ranges."""
from PIL import Image
import sys

OUT = '/tmp/gamepass-sweep'
PAIR_TARGET = 1450  # max pair width

# (width, y0, y1, x0, x1, name)  x in CSS px of LOCAL (no scrollbar); live shifted by its own layout
CROPS = [
    (1920, 0, 700, 340, 1590, 'd-top'),          # header + banner + chips + amount label + token select + sidebar top
    (1920, 650, 1720, 340, 1590, 'd-grid-side'), # amount grid bottom + featured + seller card + Add to cart
    (1920, 1640, 2470, 340, 1590, 'd-sellers'),  # Other sellers + rows + pagination + gap to trustpilot
    (390, 0, 900, 0, 390, 'm-top'),              # header + banner + chips + amount + featured
    (390, 850, 1900, 0, 390, 'm-mid'),           # featured bottom + sellers start
    (390, 1850, 2900, 0, 390, 'm-sellers'),      # sellers + pagination + trustpilot start
]

def crop_pair(width, y0, y1, x0, x1, name):
    loc = Image.open(f'{OUT}/local-{width}.png').convert('RGB')
    liv = Image.open(f'{OUT}/live-{width}.png').convert('RGB')
    lc = loc.crop((x0, y0, x1, y1))
    # live: same CSS x but page shifted left by scrollbar/2 relative? keep same x; widths differ (1905 vs 1920)
    lvc = liv.crop((x0, y0, min(x1, liv.width), y1))
    h = max(lc.height, lvc.height)
    pair = Image.new('RGB', (lc.width + lvc.width + 10, h), (255, 60, 60))
    pair.paste(lc, (0, 0))
    pair.paste(lvc, (lc.width + 10, 0))
    if pair.width > PAIR_TARGET:
        s = PAIR_TARGET / pair.width
        pair = pair.resize((PAIR_TARGET, round(h * s)), Image.LANCZOS)
    pair.save(f'{OUT}/crop-{name}.jpg', quality=80)
    print(f'crop-{name}.jpg {pair.size}')

for args in CROPS:
    crop_pair(*args)
