#!/usr/bin/env python3
"""Session 18 — generate src/components/eldorado/data/shopItemData.js from
the extracted card JSON (/tmp/shopitem_cards.json) + the verbatim SEO text
from the decoded snapshot (shopitem-1920px-light-1.tsx)."""
import json
import re

cards = json.load(open("/tmp/shopitem_cards.json"))
s = open("ui ux/extracted/snapshots/shopitem-1920px-light-1.tsx").read()

# verbatim SEO region: from the first SEO paragraph OPEN TAG to the last </p>
i = s.find("Roblox is a free to play video game")
i = s.rfind("<p", 0, i)  # include the opening tag of the first paragraph
j = s.find("</main>", i)
seg = s[i:j]

# convert to HTML: p/a/h2 with the capture's classes
seg = seg[: seg.rfind("</p>") + 4]
seg = re.sub(r"<pseudo[^>]*>.*?</pseudo>", "", seg, flags=re.S)
seg = re.sub(r'style=\{\{[^}]*\}\}', "", seg)
seg = seg.replace("className=", "class=")
seg = re.sub(r">\s+<", "><", seg)

# sanity
for tag in ["p", "a", "h2"]:
    o = len(re.findall(f"<{tag}[ >]", seg))
    c = len(re.findall(f"</{tag}>", seg))
    assert o == c, (tag, o, c)
print("seo html:", len(seg), "chars;",
      {t: seg.count(f"<{t}") for t in ["p", "h2", "a"]})
assert "`" not in seg and "${" not in seg

lines = []
lines.append('''/* Session 18 — /roblox-items shop-item category page, verbatim from the
   user-pushed capture `ui ux/shop-item/…roblox-items…make` (decoded
   snapshots/shopitem-1920px-light-1.tsx by
   scripts/decode_session18_captures.py; cards extracted by
   scripts/extract_shopitem_cards.py, SEO text by
   scripts/generate_shopitem_data.js). Capture quirks kept verbatim:
   all 24 offer cards carry the SAME Roblox thumbnail asset (lazy-load
   capture artifact), delivery times are 20 min except two 1 h rows. */

const ASSET = "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F";

export const SHOP_ITEM_GAME = {
  name: "Roblox",
  icon: `${ASSET}6bd89c168a9f90453af21035f84fea8a34b5b07e.png?generation=1793805755122899&alt=media`,
  banner: `${ASSET}3dc1f3acb06f6d5646426b81fc717fa1c1d29d77.png?generation=1793727745913594&alt=media`,
};

/* Dark game sub-nav (h-14, bg rgb(40,40,54)): icon + game name left,
   centered tabs, active tab white w/ 2px white underline + yellow glow. */
export const SHOP_ITEM_TABS = [
  { label: "Robux", href: "/buy-robux" },
  { label: "Accounts", href: "/roblox-accounts-for-sale" },
  { label: "Top ups", href: "/top-up-roblox" },
  { label: "Items", href: "/roblox-items", active: true },
  { label: "Boosting", href: "/roblox-boosting" },
  { label: "Gift cards", href: "/roblox-gift-card" },
];

export const SHOP_ITEM_FILTERS = {
  title: "Filters",
  priceLabel: "Price ()",
  ranges: [
    { label: "0 - 50", icon: `${ASSET}3e4bfca158d2f5453fdd12f07c44781b93190788.svg?generation=1793805755105370&alt=media` },
    { label: "50 - 150", icon: `${ASSET}c1de6e8d1a50c878d9cf240db59d90304f655f68.svg?generation=1793805755120841&alt=media` },
    { label: "150 - 300", icon: `${ASSET}f83fbb8215060e1803d60f8558c0d30a62b5b047.svg?generation=1793805755139922&alt=media` },
    { label: "300+", icon: `${ASSET}9702cde3e7bee1a1ff1794b941fd1ea3ad08b652.svg?generation=1793805755176479&alt=media` },
  ],
  gameLabel: "Game",
  gameSearch: "Search Game",
  games: [
    { label: "Steal a Brainrot", icon: `${ASSET}06f2c5fb3c862b06a0a1790236612e7af548dd2a.svg?generation=1793805755122231&alt=media` },
    { label: "Grand Piece Online", icon: `${ASSET}036ce8cbbdfbb6322cd82cd2c4f60bfb6e576cb9.svg?generation=1793805755121646&alt=media` },
    { label: "Murder Mystery 2", icon: `${ASSET}a3f4b09b07a8066a68627775d84e3fcf5b262e94.svg?generation=1793805755151499&alt=media` },
    { label: "Blox Fruits", icon: `${ASSET}821712858a07d9f1d9c7be7dc6d1265dced7b63c.svg?generation=1793805755152844&alt=media` },
    { label: "Rivals", icon: `${ASSET}4a36cae0a34823003a28828b0446ba04990d2e66.svg?generation=1793805755299547&alt=media` },
  ],
  showMore: "Show more (33)",
};

/* Selected-filter chips above the grid (white pills, outline rgb(231,231,231)). */
export const SHOP_ITEM_CHIPS = [
  "Anime Adventures",
  "Robux",
  "MM2",
  "Headless",
  "Rivals",
  "Anime Dice",
  "Steal an Egg",
  "YBA",
  "Kukirin Life",
  "Steal A Pet And Ride It",
];

export const SHOP_ITEM_TOOLBAR = {
  resultCount: "31057 items found",
  sortLabel: "Recommended",
  sortIcon: "sort",
};

export const SHOP_ITEM_OFFERS = ''')
lines.append(json.dumps(cards, indent=2, ensure_ascii=False).replace("&amp;", "&").replace('"/', '"/', 1))
lines.append(''';

export const SHOP_ITEM_PAGINATION = {
  pages: [1, 2, 3, 4, 5],
  last: 1000,
  next: "Next",
  active: 1,
};

/* Trust row between pagination and the SEO block. */
export const SHOP_ITEM_TRUST = { prefix: "From last", orders: "386,200", suffix: "orders" };

export const SHOP_ITEM_SEO_HTML = `''' + seg + '''`;
''')

open("src/components/eldorado/data/shopItemData.js", "w").write("\n".join(lines))
print("written shopItemData.js")
