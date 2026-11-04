# Eldorado Home — Implementation Checkpoint

Persistent progress document. Update after every meaningful checkpoint.
Recovery protocol: read this file first, then verify everything against the
actual files and Git history — never trust previous AI claims.

---

## Current Checkpoint

- Current page: Home + desktop mega menu + `/efootball-accounts` +
  `/xbox-gift-card` + Xbox Game Pass shop `/xbox-game-pass` (NEW session 9 —
  desktop per gamepass .make capture, mobile/tablet per LIVE eldorado.gg
  @390/768/1024)
- Current section: session 9 — Xbox Game Pass page COMPLETE (component-based
  reuse of the gift card system, responsive 390→1920, verified and pushed)
- Reference files:
  - Desktop capture (session 9): `ui ux/shop-giftcart-gamepass-xbox/www_eldorado_gg_xbox-game-pass_t_103_attribute_value_id_xbox-ultimate-1-month_te_v0_Europe_1920w_390w_1536w_default.make`
    (user-pushed commit 6bbe8f2) → decoded `ui ux/extracted/snapshots/gamepass-1920px-light-1.tsx`
    (+ `-2.tsx`). 1920-only like all captures
  - Live references (session 9): full-page screenshots
    `ui ux/extracted/snapshots/live-gamepass-{390,768,1024,1536,1920}.png`
    captured from `https://www.eldorado.gg/xbox-game-pass/t/103?attribute_value_id=xbox-ultimate-1-month`
  - Next-step reference (user-pushed commit dd741ad, decoded, NOT implemented):
    `ui ux/product-single/www_eldorado_gg_efootball-accounts_oa_...make` →
    `snapshots/product-1920px-light-{1,2}.tsx` (product single page)
  - Gift card references (sessions 7-8): see session 7/8 log entries below
  - FAQ answers scraped live 2026-11-04 from the gamepass URL (collapsed/
    empty in the capture); stored in `src/components/eldorado/data/gamePassData.js`
- Implementation status (session 9 — 6 new components + page + refactors):
  - `data/gamePassData.js` — 19 subscription variants (capture order, EUR
    prices + discount badges verbatim), 4 region chips (Europe default per
    capture), featured "Popular" offer (ThorStore), 6 "Other sellers" rows
    (2 pages), 9 FAQ Q&A (live-scraped), SEO copy verbatim, asset URLs
  - `GamePassRegionChips.js` — white card "Game region: {region}" +
    single-select chips (selected: 2px yellow border on 16% tint, live
    probed class list)
  - `GamePassAmountGrid.js` — "Amount: {variant}" + variant cards (img,
    name, strike, green price + badge, ⓘ); below lg: 136px horizontal
    scroller auto-scrolled to the selected card; lg: 3-col grid;
    xl: 4-col grid (capture); selected = yellow tint + inset outline +
    Popular ribbon
  - `GamePassFeaturedOffer.js` — Popular ribbon (lg only, live), Delivery
    time / Delivery instructions rows, Total block (strike, badge, green
    24px), dark Buy now (price in label below lg), 3 reassurance rows
  - `GamePassSellerCard.js` — "Seller" heading (inside card on desktop per
    capture, outside on mobile per live @390), avatar, verified badge,
    rating + reviews link
  - `GamePassOffers.js` — "Other sellers (8)" + rows: below lg stacked
    cards (seller | strike/badge/price/clock-delivery, instructions row,
    full-width outline Buy now), lg: capture's
    `grid-cols-[0.7fr_0.3fr_120px_auto_auto]`; pagination (arrows, page
    buttons md+, "Go to page" single-select dropdown, interactive state)
  - `TrustRows.js` — NEW shared module: Shield/Bolt/Support icons + row
    layout extracted from GiftCardOfferCard (now imported by both offer
    cards)
  - Refactors for reuse (gift card page behavior unchanged):
    `GiftCardBanner` gained `active` + `iconAlt` props (Game Pass tab now
    → `/xbox-game-pass`), `GiftCardFaq` gained `items` prop,
    `GiftCardSeoText` gained `title/orders/blocks` props + the capture's
    66px yellow star with overlaid 4.9
  - `app/xbox-game-pass/page.js` — HeaderBar + CategoryNav + banner
    (active "Game Pass") + steps/offers two-col at lg (sidebar 400px) +
    reviews + process + FAQ(gamepass items) + trust + SEO(gamepass blocks)
    + Footer + ChatBubble. NO artwork backdrop, NO quantity picker (both
    capture-only; live probed without them — live is the design authority)
- Visual comparison status (side-by-side strips local|live):
  - 1920 + 1536: banner, region chips, 4-col variant grid with selected
    Popular card, disclaimer inside the white card, sidebar (featured +
    seller), other-sellers rows, pagination, reviews, process, FAQ, trust,
    SEO, footer all match structure/colors/spacing
  - 1024: live switches to 3-col grid + sidebar — matched
  - 768: live keeps the mobile flow (scroller, stacked offer cards) —
    matched after moving the switches md→lg
  - 390: stacked flow, scroller opens on the selected variant (like live),
    Popular ribbon only on the variant card, Seller heading outside
  - No horizontal overflow: scrollWidth == viewport at
    390/768/1024/1536/1920
  - Interactions verified headless: region chip select, variant select
    (label updates), FAQ accordion with real answers, Go-to-page dropdown +
    page state, banner active tab; zero console errors at all widths
- Known deviations / documented limitations:
  - Prices use the capture's EUR values (e.g. "8.25", "From" rows without
    currency prefix), not the live geo-localized HK$ — same policy as the
    gift card page (session 7)
  - "Other sellers (8)" per the capture; the live page currently shows 11
    with different sellers — capture followed (design reference file)
  - Delivery instructions rows are static (caret present; no open state
    exists in any reference — no copy invented)
  - Reviews card keeps the session-7 policy: attribution line as card
    content (live desktop carousel renders empty)
  - Region chip default "Europe" per the capture (live geo-defaults to
    "Global" from this sandbox)
  - Live's exact tablet switch is ~960-1024 (custom standard-grid);
    standard lg (1024) used — 960-1023 shows the mobile-style flow, same
    documented approximation as session 8
  - Featured-offer Buy now label shows the price below lg ("Buy now
    (8.25)") per live mobile; desktop shows plain "Buy now"
- Technical checks: `npm run build` SUCCESS (/, /efootball-accounts,
  /xbox-game-pass, /xbox-gift-card, /_not-found); route returns 200;
  interactions verified headless (see above)
- Deployment: VERIFIED — Vercel serves `/xbox-game-pass` (HTTP 200; HTML
  contains "Game region", "Other sellers", "How much does Xbox Game Pass
  cost", "Effortless buying process"), corresponding to push 42ed541;
  `/xbox-gift-card` re-verified healthy after the refactors (200, region/
  amount/FAQ markers present), `/` and `/efootball-accounts` 200
- Next exact action: on request — product-single page (decoded reference
  already in `snapshots/product-1920px-light-*.tsx`), gift card
  amount→offers step, or other gift card brands reusing these components

## Section log (append one block per completed section)

- 2026-11-04 (session 9) — Xbox Game Pass shop page (`/xbox-game-pass`),
  continuing the user's commit 6bbe8f2 which added the gamepass .make
  capture. Recovery first: cloned the repo, verified local == remote
  (session-8 tip ba34276 + user commit 6bbe8f2 on top); mid-session the
  user pushed dd741ad (product-single capture) — rebased onto it without
  force, verified remote after every push. Decoded the capture
  (94b99fd), captured the LIVE page at 390/768/1024/1536/1920 (53f6ac5),
  decoded the user-pushed product-single capture for the NEXT step
  (f0a8173), data file (cf0684a), implementation (687aac2), live-compare
  fixes (0dc788b), tablet-band fixes (fd435a2). Fix rounds driven by
  side-by-side strips: Popular ribbon desktop-only on the featured card +
  Seller heading outside the card on mobile + scroller opens on the
  selected variant + SEO badge 66px yellow star (shared component, also
  corrects the gift card page per its own capture); then the tablet band
  768-1023 keeps the mobile flow (horizontal scroller + stacked offer
  cards) with grid/row switches at lg, matching live @768 vs @1024 and
  the session-8 standard-grid finding. Previous chat link re-checked this
  session: still NOT accessible (landing page only) — nothing to recover.
  Verification: overflow=0 at 390/768/1024/1536/1920, zero console
  errors, interactions green (region chips, variant select + label,
  FAQ accordion with live answers, Go-to-page dropdown + page state,
  banner active tab), `next build` green with the new route. Known
  deviations documented in the checkpoint above (EUR capture prices,
  "Other sellers (8)", static Delivery instructions rows, reviews
  attribution policy, Europe default region, lg switch approximation).

- 2026-11-04 (session 8) — Gift card page responsive pass + shared header.
  The user reported 768-1023 rendered broken (squeezed 59px amount cards).
  Measured the LIVE page headless at 375/390/500/555/600/640/660/768/820/
  900/990/1000/1010/1024/1280 + probed real Tailwind class lists: the live
  site keeps the stacked mobile-style flow (white amount card, 24px titles,
  burger header, no catnav) through the whole tablet band and switches to
  desktop at its custom breakpoint (~960-1024; standard-grid equivalent =
  1024); trust checklist is 2-col from 640. Fixes, one verified push per
  batch: (1) all gift card components md:→lg: (sidebar+4-col grid, banner,
  process grid-3, reviews 230px card, FAQ centered title, SEO spacing),
  trust checklist md:→sm:grid-cols-2, mobile labels 18→16px + trust rows
  18px per live probes — kills the squeezed cards (f9f7b62); (2) HeaderBar/
  CategoryNav/SearchOverlay/MegaMenu md:→lg: so the mobile header survives
  to 1023 like live (b38a59b); (3) solid caret icons in FAQ / View more /
  region dropdown per live zoom-crops, session-8 screenshots committed
  (pending hash). Verification: side-by-side strips local|live at 390/768/
  1024 match; overflow=0 at 390/640/768/820/900/1024/1280/1536; all 7
  interactions green (View more 66 cards, region dropdown 5 options +
  Europe select, amount aria-pressed, FAQ accordion aria-expanded+answer,
  mobile drawer, search overlay, 1024 megamenu); `next build` green; Vercel
  serving the lg classes within a minute of push. Known deviations
  (documented): amount prices show capture-currency EUR while live renders
  the visitor's geo currency (HK$ from this sandbox) — same underlying
  numbers; live's exact tablet breakpoint is ~960-1024 vs our standard
  1024, so 960-1023 shows the mobile-style flow.

- 2026-11-04 (session 7) — Xbox gift card shop page. Recovered state from
  git (4da9ada, decoded giftcard snapshots already pushed); captured LIVE
  eldorado.gg/xbox-gift-card/v/103 headless at 390 + 1920 as references
  (committed), scraped real FAQ answers live. Implemented 10 components +
  `/xbox-gift-card` in one checkpoint push (b6992e9), then reviews-card
  height fix (7850310); every push verified by empty
  `git log origin/main..HEAD`. Visual comparison at 1920/390 against the
  live screenshots; build green; zero horizontal overflow at 390/1536/1920.

- 2026-11-03 (session 6) — Mobile rebuild + routing, driven by the user's
  report that mobile and desktop looked bad. Established that the .make
  captures contain no mobile reference (1920-only, verified by re-decoding
  all four files with the reusable `ui ux/extracted/fig_reassemble.py`), so
  the live site was captured headless at 390/1920 as the mobile reference
  (shop needs the `/a/183-1-0` suffix — bare slug 404s). Shipped in three
  verified pushes: mobile shop fixes (4313d28), mobile home rebuild +
  full category routing to /efootball-accounts (16a882d), eager menu icons
  (1f9ed2a). Progress doc updated in the same final push.

- 2026-11-03 (session 5) — Decoded the two new .make captures and shipped two
  sections, one commit+push each: (1) desktop mega menu per
  Menu_desktop.make (851c67d) — hover/pinned open, active catnav state,
  text-ink fix after first screenshot showed white-on-white; (2) shop
  accounts page per shop_account.make (e4dbf00) — full layout + 24 real
  offer cards from the capture + wiring of all mega-menu game rows to
  `/efootball-accounts`; then pagination flex-wrap fix for 390 overflow
  (eceacfd). Every push verified on remote via ls-remote. Visual checks at
  1920/1536/390; `next build` green; navigation verified headless.

- 2026-11-03 (session 4) — Decoded the user-supplied
  `www_eldorado_gg_1920w_390w_1536w_default.make` (zip → canvas.fig → TSX).
  Implemented ALL missing home sections in the .make order, one commit+push
  each: header token fixes (80358a0), image-only hero + Popular cards
  (9eb1918), Roblox banner + Recently viewed (2a37d9c), How buying works +
  Roblox currencies (4b09cde), Popular games + ChatBubble (7d0ebb6),
  trading/guarantee/footer alignment to the 1208 container (b112d8e), hero
  characters layer + screenshots (adc87ca). Every push verified on remote via
  ls-remote. Visual checks at 1920/1536/390; `next build` green; Vercel
  serving the new sections.

- 2026-11-03 — Header/search/menu system rebuilt for the new live design
  (commits a2d83d9 checkpoint → 520c5e0 final): dark header both breakpoints,
  mobile hamburger drawer, click-search overlay desktop+mobile, mobile
  category strip removed. Superseded detail: header bar color corrected to
  #0E0E11 in this session (the old probe had mistaken the search field fill
  for the bar color).

- 2026-11-03 — Design tokens + layout/metadata + HeaderBar + CategoryNav +
  Hero + CategoryCards + TradingSection + GuaranteeCards + Footer (commit
  981a896); responsive pass 1536/390 (8bc7649); build verified (962cf86).

## Backup Status

- Last successful push timestamp: 2026-11-04, session 9
- Hash of last pushed commit: `fd435a2` (chain this session: 94b99fd →
  53f6ac5 → f0a8173 → cf0684a → 687aac2 → 0dc788b → fd435a2, on top of the
  user's dd741ad/6bbe8f2; every push verified by empty
  `git log origin/main..HEAD` + ls-remote)
- Uncommitted changes: this doc update (ships in the session-9 final
  commit) + session-9 screenshots
- Unpushed commits: none
- Push auth: the user-supplied PAT is embedded in the origin URL in this
  sandbox only (transient; never committed to the repo). Future sessions
  without a token need a fine-grained PAT (Contents: read/write) or pushes
  fail with "could not read Username for 'https://github.com'".
- Recovery instructions:
  1. `git clone https://github.com/mehrshad0289/charjino-front-eldorado.git`
  2. Read this file; verify state per the protocol checklist (git status,
     local vs origin, build)
  3. Continue from "Next exact action"
