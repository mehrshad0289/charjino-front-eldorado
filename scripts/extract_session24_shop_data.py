#!/usr/bin/env python3
"""Session 24 — extract structured data from the 3 top-up shop captures
(primevideo, psplus, codpoints) into a JSON draft for the data files."""
import re
import json

SNAP = "ui ux/extracted/snapshots/"

def tokens_between(t, a, b, pat):
    i0, i1 = t.find(a), t.find(b)
    if i0 < 0 or i1 < 0 or i1 <= i0:
        return []
    seg = t[i0:i1]
    out = []
    for m in re.finditer(pat, seg):
        val = next((g for g in m.groups() if g), None)
        if val:
            out.append(val)
    return out

def capture_amounts(t, first_label, stop_at):
    """Amount cards: aria-label='Select X' + alt img + label + optional sub + prices."""
    if not first_label.startswith("aria-label"):
        first_label = 'aria-label="Select ' + first_label
    i0 = t.find(first_label)
    i1 = t.find(stop_at, i0)
    seg = t[i0:i1]
    cards = []
    for m in re.finditer(r'aria-label="Select ([^"]+)"\s+className="([^"]*)"', seg):
        label, cls = m.group(1).strip(), m.group(2)
        chunk = seg[m.start(): m.start() + 3400]
        img = re.search(r'alt="([^"]*)" src="([^"]+)"', chunk)
        sub = re.search(r'text-\[rgb\(106,_102,_123\)\] text-\[14px\] leading-\[19\.6px\]">([^<]*)</div>', chunk)
        price = re.search(r'text-\[rgb\(54,_117,_6\)\] text-\[16px\] leading-\[24px\]">([\d.]+)<', chunk)
        chip = re.search(r'text-\[12px\] leading-\[16\.8px\][^>]*>(-\d+%\*)<', chunk)
        was = re.search(r'line-through[^>]*>([\d.]+)<', chunk)
        plain = re.search(r'shrink-\[0\]">\s*<span>([\d.]+)</span>', chunk)
        popular = 'Popular' in chunk[:900]
        cards.append({
            "label": label,
            "selected": "outline-[rgb(255,_201,_80)]" in cls or "outline-[rgb(255, 201, 80)]" in cls,
            "popular": popular,
            "imgAlt": img.group(1) if img else None,
            "img": img.group(2).replace("&amp;", "&") if img else None,
            "sub": sub.group(1) if sub else None,
            "price": price.group(1) if price else (plain.group(1) if plain else None),
            "discount": chip.group(1) if chip else None,
            "was": was.group(1) if was else None,
        })
    return cards

SELLER_PAT = r'alt="([^"]+)" src="([^"]+)"|>(\d[\d,.]*%|100%)<|>(\d[\d,]* reviews)<|>(\d+ min)<|(-\d+%\*)<|line-through[^>]*>([\d.]+)<|text-\[rgb\(54,_117,_6\)\]\"?>([\d.]+)<'

def capture_sellers(t, start_marker):
    i0 = t.find(start_marker)
    i1 = t.find("Go to page", i0)
    seg = t[i0:i1]
    rows, cur = [], {}
    for m in re.finditer(SELLER_PAT, seg):
        g = m.groups()
        if g[0]:
            if cur: rows.append(cur)
            cur = {"name": g[0], "avatar": g[1].replace("&amp;", "&")}
        elif g[2]: cur["rating"] = g[2]
        elif g[3]: cur["reviews"] = g[3]
        elif g[4]: cur["delivery"] = g[4]
        elif g[5]: cur["discount"] = g[5]
        elif g[6]: cur["was"] = g[6]
        elif g[7]: cur["price"] = g[7]
    if cur: rows.append(cur)
    return rows

def main():
    out = {}
    prime = open(SNAP + "primevideo-1920px-light-1.tsx").read()
    ps = open(SNAP + "psplus-1920px-light-1.tsx").read()
    cod = open(SNAP + "codpoints-1920px-light-1.tsx").read()

    out["prime_amounts"] = capture_amounts(prime, "Prime Video - 1 Month ", ">Game region")
    out["prime_sellers"] = capture_sellers(prime, "Other sellers (13)")
    out["cod_amounts"] = capture_amounts(cod, "aria-label=\"Select 500", ">Delivery time")
    out["cod_sellers"] = capture_sellers(cod, "Other sellers (8)")

    # featured offers
    for name, t in [("prime", prime), ("cod", cod)]:
        i = t.find(">Total<")
        seg = t[max(0, i - 4000):i + 900]
        dt = re.search(r'Delivery time</span>\s*<div className="items-center flex text-\[rgb\(106,_102,_123\)\]">([^<]+)</div>', seg)
        price = re.search(r'text-\[rgb\(54,_117,_6\)\]\">([\d.]+)<', seg)
        chip = re.search(r'leading-\[16\.8px\]">(-\d+%\*)<', seg)
        was = re.search(r'line-through text-\[rgb\(106,_102,_123\)\][^>]*>([\d.]+)<', seg)
        stock = re.search(r'In stock: (\d+)', seg)
        out[f"{name}_featured"] = {
            "deliveryTime": dt.group(1).strip() if dt else None,
            "price": price.group(1) if price else None,
            "discount": chip.group(1) if chip else None,
            "was": was.group(1) if was else None,
            "stock": stock.group(1) if stock else None,
        }

    # sellers' featured cards (first seller after featured card = featured seller)
    for name, t, marker in [("prime", prime, "users/ArsenicStore"), ("cod", cod, "users/PowerXhub")]:
        i = t.find(marker)
        seg = t[i:i + 3000]
        name_m = re.search(r'alt="([^"]+)"', seg)
        rating = re.search(r'<div>(\d[\d,.]*%|100%)</div>', seg)
        reviews = re.search(r'>([\d,]+ reviews)<', seg)
        out[f"{name}_featured_seller"] = {
            "name": name_m.group(1) if name_m else None,
            "rating": rating.group(1) if rating else None,
            "reviews": reviews.group(1).replace(" reviews", "") if reviews else None,
        }

    # SEO paragraphs
    def seo(t, h1):
        i = t.find(h1)
        seg = t[i:i + 16000]
        ps = re.findall(r'<p className="mb-\[16px\]">([^<]+)</p>', seg)
        h2s = re.findall(r'<h2[^>]*>([^<]+)</h2>', seg)
        lis = re.findall(r'<li className="list-decimal"><p>([^<]+)</p></li>', seg)
        return {"h1": h1, "h2s": h2s, "paragraphs": ps, "list": lis}
    out["prime_seo"] = seo(prime, "Buy Amazon Prime Video")
    out["cod_seo"] = seo(cod, "Buy CoD Points Cheap")
    out["ps_seo"] = seo(ps, "Buy PlayStation Plus")

    # avatars of featured sellers
    for name, t, marker in [("prime", prime, "users/ArsenicStore"), ("cod", cod, "users/PowerXhub")]:
        i = t.find(marker)
        seg = t[i:i + 2500]
        av = re.search(r'src="([^"]+)" className="block object-cover[^"]*w-12 h-12', seg)
        out[f"{name}_featured_seller_avatar"] = av.group(1).replace("&amp;", "&") if av else None

    print(json.dumps(out, indent=1)[:400])
    with open("scripts/session24_data_draft.json", "w") as f:
        json.dump(out, f, indent=1)
    print("draft saved; prime_amounts:", len(out["prime_amounts"]), "cod_amounts:", len(out["cod_amounts"]),
          "prime_sellers:", len(out["prime_sellers"]), "cod_sellers:", len(out["cod_sellers"]))

if __name__ == "__main__":
    main()
