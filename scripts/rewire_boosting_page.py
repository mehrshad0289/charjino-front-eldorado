#!/usr/bin/env python3
"""Session 22 — rewire /ea-fc-boosting/b/142-4/page.js: replace the
chips → why-trust block (now inside the client BoostingConfigSection)
with a single component call, and drop the imports that moved into it."""
import re

PATH = "src/app/ea-fc-boosting/b/142-4/page.js"
src = open(PATH).read()

# 1. shrink the import list from eaFcBoostingData
old_imports = """import {
  BOOST_GAME,
  BOOST_TABS,
  BOOST_BANNER,
  BOOST_DEALS_TITLE,
  BOOST_CHIPS,
  BOOST_CARDS,
  BOOST_TEXTAREA_PLACEHOLDER,
  BOOST_EXCLAMATION,
  BOOST_CUSTOMIZE,
  BOOST_SAVE_MONEY,
  BOOST_TRUST,
  BOOST_RANKUP,
  BOOST_BOOSTERS,
  BOOST_LIGHTNING,
  BOOST_FAQS,
  BOOST_SEO,
} from "../../../../components/eldorado/data/eaFcBoostingData";"""
new_imports = """import BoostingConfigSection from "../../../../components/eldorado/BoostingConfigSection";
import {
  BOOST_GAME,
  BOOST_TABS,
  BOOST_BANNER,
  BOOST_DEALS_TITLE,
  BOOST_RANKUP,
  BOOST_BOOSTERS,
  BOOST_LIGHTNING,
  BOOST_FAQS,
  BOOST_SEO,
} from "../../../../components/eldorado/data/eaFcBoostingData";"""
assert old_imports in src, "import block not found"
src = src.replace(old_imports, new_imports)

# 2. replace the chips→why-trust block with the component call
start = src.index("          {/* Chips scroller */}")
end_marker = "        </section>"
end = src.index(end_marker, start)
src = src[:start] + "          <BoostingConfigSection />\n\n" + src[end:]

# 3. note the session-22 change in the header comment
src = src.replace(
    "   Responsive below 1920 follows live eldorado.gg/ea-fc-boosting/b/142-4",
    "   Session 22: chips/cards/textarea/customize/save-money/why-trust\n"
    "   moved into the client BoostingConfigSection — the user pushed a\n"
    "   SECOND capture of this URL with the Champions Finals chip active\n"
    "   (ui ux/Boosting-Champions-Finals/, origin 9f6e420) and the two\n"
    "   captured states now switch on chip click (data: BOOST_VARIANTS;\n"
    "   other chips are no-ops — no captured reference).\n"
    "   Responsive below 1920 follows live eldorado.gg/ea-fc-boosting/b/142-4",
)
open(PATH, "w").write(src)
print("rewired OK; lines:", len(src.splitlines()))
