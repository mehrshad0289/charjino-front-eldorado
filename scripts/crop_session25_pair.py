#!/usr/bin/env python3
"""Session 25 — local|live side-by-side composites for /xbox-game-pass.
Adapted from crop_gamepass_pair.py; sources in /tmp/session25."""
from PIL import Image
import sys

OUT = '/tmp/session25'
PAIR_TARGET = 1450

# (width, y0, y1, x0, x1, name)
CROPS = [
    (1920, 0, 760, 340, 1590, 'd1-top'),            # header + banner + region chips + amount label
    (1920, 700, 1760, 340, 1590, 'd2-grid-side'),   # amount grid + featured + seller card
    (1920, 1700, 2560, 340, 1590, 'd3-sellers'),    # Other sellers + rows + pagination
    (1920, 2500, 3600, 340, 1590, 'd4-reviews'),    # trustpilot reviews + process start
    (1920, 3500, 4700, 340, 1590, 'd5-process'),    # process steps + faq start
    (1920, 4600, 6007, 340, 1590, 'd6-faq-seo'),    # FAQ + trust + SEO + footer start
    (390, 0, 950, 0, 390, 'm1-top'),                # header + banner + chips + amount label
    (390, 900, 2000, 0, 390, 'm2-featured'),        # featured + seller + other sellers start
    (390, 1950, 3100, 0, 390, 'm3-sellers'),        # sellers rows + pagination + reviews
    (390, 3050, 4300, 0, 390, 'm4-reviews'),        # reviews + process
    (390, 4250, 5600, 0, 390, 'm5-process-faq'),    # process + faq
    (390, 5550, 6900, 0, 390, 'm6-faq-trust'),      # faq + trust + seo
    (390, 6850, 8775, 0, 390, 'm7-seo-footer'),     # seo + footer
]

def crop_pair(width, y0, y1, x0, x1, name):
    loc = Image.open(f'{OUT}/local-{width}.png').convert('RGB')
    liv = Image.open(f'{OUT}/live-{width}.png').convert('RGB')
    lc = loc.crop((x0, y0, x1, min(y1, loc.height)))
    lvc = liv.crop((x0, y0, min(x1, liv.width), min(y1, liv.height)))
    h = max(lc.height, lvc.height)
    pair = Image.new('RGB', (lc.width + lvc.width + 10, h), (255, 60, 60))
    pair.paste(lc, (0, 0))
    pair.paste(lvc, (lc.width + 10, 0))
    if pair.width > PAIR_TARGET:
        ratio = PAIR_TARGET / pair.width
        pair = pair.resize((PAIR_TARGET, int(pair.height * ratio)))
    pair.save(f'{OUT}/{name}.png')
    print(f'{name}: {pair.width}x{pair.height}')

for spec in CROPS:
    crop_pair(*spec)
