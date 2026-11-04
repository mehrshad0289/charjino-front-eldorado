#!/usr/bin/env python3
"""High-res zoom crops from live captures for styling details."""
from PIL import Image

OUT = '/tmp/gamepass-sweep'

def zoom(src, x0, y0, x1, y1, name, scale=1.6):
    im = Image.open(f'{OUT}/{src}').convert('RGB')
    c = im.crop((x0, y0, x1, y1))
    if scale != 1:
        c = c.resize((round(c.width * scale), round(c.height * scale)), Image.LANCZOS)
    c.save(f'{OUT}/zoom-{name}.jpg', quality=82)
    print(f'zoom-{name}.jpg {c.size}')

# live desktop amount cards row 1 (Essential 1M + 12M w/ Best Value)
zoom('live-1920.png', 348, 380, 790, 660, 'd-cards', 1.6)
# live desktop selected card (Ultimate 1M, row4 col3)
zoom('live-1920.png', 738, 800, 1130, 1090, 'd-selected', 1.6)
# live mobile total/buy/addtocart region
zoom('live-390.png', 0, 740, 390, 960, 'm-buy', 1.7)
# live mobile trustpilot heading
zoom('live-390.png', 0, 2760, 390, 2930, 'm-trust', 1.7)
# live desktop sidebar stepper + total + buttons
zoom('live-1920.png', 1140, 280, 1530, 700, 'd-sidebar', 1.5)
