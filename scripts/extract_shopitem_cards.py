#!/usr/bin/env python3
"""Session 18 — extract the 24 Roblox-item offer cards from the decoded
snapshot (shopitem-1920px-light-1.tsx) into JSON for shopItemData.js.
Per card: game tag(s), title, seller, online dot, rating, price, unit,
delivery, image URL. Writes /tmp/shopitem_cards.json."""
import json
import re

s = open("ui ux/extracted/snapshots/shopitem-1920px-light-1.tsx").read()

# each card anchor
anchors = [m.start() for m in re.finditer(r'<a href="https://www\.eldorado\.gg/roblox-items/oi/', s)]
anchors.append(s.find('<button aria-label="Next page"'))
cards = []
for a, b in zip(anchors, anchors[1:]):
    card = s[a:b]
    if len(card) < 500:
        continue
    def txt(pattern, default=""):
        m = re.search(pattern, card)
        return m.group(1).strip() if m else default
    href = txt(r'<a href="([^"]+)"')
    head_end = card.find("max-h-[38px]")
    game_tags = re.findall(r'<span className="block">([^<]{1,40})</span>', card[:head_end])
    title = txt(r'leading-\[19\.6px\] max-h-\[38px\]">([^<]+)')
    img = txt(r'<img alt="[^"]*" src="([^"]+)"')
    seller = txt(r'<strong className="block font-bold truncate">([^<]+)')
    online = 'className="text-[rgb(0,_228,_201)]"' in card
    rating = txt(r'(\d\d?\.\d%&nbsp;\([\d,]+\))')
    price = txt(r'aria-label="amount-price" className="font-bold text-\[18px\] leading-\[27px\]">([^<]+?)\s*</strong>')
    unit = "/ unit" if "/ unit" in card else ""
    m = re.search(r'leading-\[17px\]">.*?<div>([^<]{1,12})</div>', card, re.S)
    delivery = m.group(1).strip() if m else ""
    cards.append({
        "href": href,
        "tags": game_tags[:2],
        "title": title,
        "img": img,
        "seller": seller,
        "online": online,
        "rating": rating,
        "price": price,
        "unit": unit,
        "delivery": delivery,
    })

print(json.dumps(cards[:3], indent=1)[:800])
print("cards:", len(cards))
missing = [i for i, c in enumerate(cards) if not (c["title"] and c["seller"] and c["price"] and c["img"])]
print("incomplete:", missing)
json.dump(cards, open("/tmp/shopitem_cards.json", "w"), indent=1)
