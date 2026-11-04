#!/usr/bin/env python3
"""Session 25 — update ELDORADO-HOME-IMPLEMENTATION.md:
1) resolve the stale session-22 merge-conflict markers (keep BOTH log
   entries, ONE Backup Status),
2) write the session-25 gamepass capture-exact round into the
   Current Checkpoint + section log,
3) refresh Backup Status with the current push state."""
import re

DOC = "/home/z/my-project/charjino-front-eldorado/docs/ui-ux/ELDORADO-HOME-IMPLEMENTATION.md"

with open(DOC, encoding="utf-8") as f:
    lines = f.read().split("\n")

# ---- locate the conflict block (1-indexed from the grep: 1361/1409/1481)
i_start = next(i for i, l in enumerate(lines) if l.startswith("<<<<<<< HEAD"))
i_mid = next(i for i, l in enumerate(lines) if l == "=======")
i_end = next(i for i, l in enumerate(lines) if l.startswith(">>>>>>> f0b896c"))

head_side = lines[i_start + 1 : i_mid]          # session-23/25 notes + Backup Status
tail_side = lines[i_mid + 1 : i_end]            # session-22 notes + Backup Status

# split each side into (log entry part, Backup Status part)
def split_backup(side):
    idx = side.index("## Backup Status")
    return side[:idx], side[idx:]

head_log, head_backup = split_backup(head_side)
tail_log, tail_backup = split_backup(tail_side)

# HEAD Backup Status is the newer one (session 23) — keep its bullets
# only if we cannot write a fresher one; we WILL write a fresh one, so
# both sides' backup bullets are dropped.

shared_tail = lines[i_end + 1 :]                # Uncommitted/Push auth/gotchas

# ---- build the fresh Backup Status (session 25)
backup = [
    "## Backup Status",
    "",
    "- Last successful push timestamp: 2026-11-05, session 25 (gamepass",
    "  capture-exact card-anatomy round; this doc commit is the last push)",
    "- Hash of last pushed commit: this docs commit, preceded by `2daa1b4`",
    "  (merge of the parallel session-25 Seller-rules article), `32373be`",
    "  (gamepass capture-exact fixes), `316668a` (merge of the parallel",
    "  session-24 comparison round), `502ffe7` (session-25 decode",
    "  checkpoint). Every push verified by empty `git log origin/main..HEAD`",
    "  immediately after; two rejections resolved fetch+merge (never force).",
]
# keep the still-valid shared-tail bullets from the HEAD backup tail:
# the shared tail starts with stale "Uncommitted/Unpushed" lines — replace them
tail_keep = []
for i, l in enumerate(shared_tail):
    if l.startswith("- Push auth:") or l.startswith("- Sandbox gotchas") or l.startswith("  - "):
        tail_keep = shared_tail[i:]
        break

doc_new = (
    lines[:i_start]
    + head_log          # session-23 entry + parallel session-25 seller-rules note
    + tail_log          # session-22 entry (history kept)
    + backup
    + tail_keep
)

# ---- Current Checkpoint header updates
text = "\n".join(doc_new)

# 1) Current page line — append the session-25 note
text = text.replace(
    "+ `/xbox-game-pass` responsive\n  re-verification (session 21 — COMPLETE) + `/dashboard/messages`\n  rebuilt to the not-empty capture (session 23 — COMPLETE)",
    "+ `/xbox-game-pass` responsive\n  re-verification (session 21 — COMPLETE) + `/dashboard/messages`\n  rebuilt to the not-empty capture (session 23 — COMPLETE) +\n  `/xbox-game-pass` capture-exact card anatomy (session 25 — COMPLETE)\n  + `/support/articles/8408997-seller-rules` (parallel session 25)",
)

# 2) demote the old Current section, insert the session-25 one above it
old_cs = "- Current section: session 23 — the two user-pushed \"add file\""
new_cs = (
    "- Current section: session 25 — gift-card shop page (gamepass\n"
    "  capture) re-verified mobile->desktop and made capture-exact. The\n"
    "  user-pushed `ui ux/shop-giftcart-gamepass-xbox/…xbox-ultimate-1-month\n"
    "  …Europe…make` capture re-decoded\n"
    "  (scripts/decode_session25_capture.py → snapshots/xboxgp-europe-1920px-\n"
    "  light-{1,2}.tsx — byte-identical to the session-18 gamepass decode, so\n"
    "  the captured STATE was already implemented; this session arbitrated\n"
    "  the card anatomy against BOTH authorities: the capture and a fresh\n"
    "  live probe 2026-11-05, which now CONVERGE). Fixes\n"
    "  (GamePassAmountGrid/GamePassFeaturedOffer/gamePassData/page):\n"
    "  amount cards = 14px/19.6 label (bold when selected), price ROW first\n"
    "  (bold green 16px + discount chip) with the strike row BELOW (14px\n"
    "  line-through + 16px info icon, gap-8) — supersedes the 2026-11-04\n"
    "  strike-above/18px render; Popular chip = flush top tab (yellow bg,\n"
    "  rounded-bl/br-lg, star + 12px bold); Best Value chip DROPPED (absent\n"
    "  in capture AND today's live); \"/ month\" footer 12px per live;\n"
    "  featured-offer Total = chip + bold green 20px price row FIRST, strike\n"
    "  row (16px info icon + 16px line-through) below; Add to cart now\n"
    "  MOBILE-ONLY (live @390 keeps it; live @1920 and the capture dropped\n"
    "  it); region chips inlineMobile per live @390 (\"Game region: Europe\"\n"
    "  one-liner; the split header + \"Your region:\" hint stays desktop per\n"
    "  the capture). Verified: eslint 0 errors, build green 72 pages (after\n"
    "  merging the parallel Seller-rules article), local @390/1536/1920 =\n"
    "  200 / overflow 0 / 0 broken imgs / 0 errors, pageH 5839 vs live 5805\n"
    "  @1920 (was 6007), 8757 vs live 8904 @390 (live carries geo-only\n"
    "  extras: HK$ prices, savings banner, All-sellers filter chips +\n"
    "  Current-offer highlight — documented, capture-verbatim wins).\n"
    "  Probe scripts: probe_session25_gamepass.js (3-width sweep),\n"
    "  probe_session25_card_anatomy.js (live DOM anatomy),\n"
    "  crop_session25_pair.py (local|live composites).\n"
    "- Previous section: session 23 — the two user-pushed \"add file\""
)
assert old_cs in text
text = text.replace(old_cs, new_cs)

# 3) session-25 log entry at the top of the section log (before the 2026-11-05 session-23 entry)
log_marker = "- 2026-11-05 (session 23) — the two user-pushed \"add file\" captures"
log_entry = (
    "- 2026-11-05 (session 25, gamepass round) — the gift-card shop page\n"
    "  (`ui ux/shop-giftcart-gamepass-xbox/` capture) re-handled\n"
    "  mobile->desktop per user instruction as a continuation of the\n"
    "  session-24 shop round. Recovery first: fresh sandbox clone,\n"
    "  clean tree, all prior commits verified on origin; TWO parallel-\n"
    "  session push rejections resolved via fetch+merge (99dce3f\n"
    "  session-24 comparison round; 1acab47 Seller-rules article).\n"
    "  Capture re-decoded (byte-identical to session-18) → the work is\n"
    "  arbitration + fixes, not re-implementation: live probe\n"
    "  2026-11-05 shows the live card anatomy NOW matches the capture\n"
    "  (price row first, strike below) — the local render lagged one\n"
    "  probe generation behind. Fixes listed in the Current Checkpoint;\n"
    "  verification: eslint 0 / build green 72 / 3x3 widths PASS /\n"
    "  screenshots compared side-by-side (top, grid+sidebar, sellers,\n"
    "  reviews/process/FAQ/SEO @1920; 7 strips @390). Push chain:\n"
    "  502ffe7 checkpoint → 316668a merge → 32373be fixes → 2daa1b4\n"
    "  merge → this doc commit.\n"
)
assert log_marker in text
text = text.replace(log_marker, log_entry + log_marker)

with open(DOC, "w", encoding="utf-8") as f:
    f.write(text)

# sanity: no conflict markers remain
assert "<<<<<<<" not in text and ">>>>>>>" not in text
rest = [l for l in text.split("\n") if l == "======="]
print("doc updated; remaining bare ======= lines:", len(rest))
print("Backup Status sections:", text.count("## Backup Status"))
