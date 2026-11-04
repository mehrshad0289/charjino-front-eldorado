# Eldorado Home — Implementation Checkpoint

Persistent progress document. Update after every meaningful checkpoint.
Recovery protocol: read this file first, then verify everything against the
actual files and Git history — never trust previous AI claims.

---

## Current Checkpoint

- Current page: Home + desktop mega menu + `/efootball-accounts` +
  `/xbox-game-pass` + `/xbox-gift-card` + product-single
  `/efootball-accounts/oa/[id]` (NEW session 10 — desktop per product
  .make capture, mobile/tablet per LIVE eldorado.gg @390/768/1024)
- Current section: session 10 — product-single page COMPLETE (dynamic
  route with generateStaticParams, 9 new components, reuse of
  HeaderBar/CategoryNav/TrustRows/Footer/ChatBubble, responsive
  390→1920, verified and pushed)
- Reference files:
  - Desktop capture (session 10): `ui ux/product-single/www_eldorado_gg_efootball-accounts_oa_2f48f97f-c412-48b0-c3a4-08df0a5485be_1920w_390w_1536w_default.make`
    (user-pushed commit dd741ad) → decoded
    `snapshots/product-1920px-light-1.tsx` (+ `-2.tsx`, font-face-only diff)
  - Live references (session 10): full-page screenshots
    `snapshots/live-product-{390,768,1024,1536,1920}.png`, captured from
    `https://www.eldorado.gg/efootball-accounts/oa/2f48f97f-c412-48b0-c3a4-08df0a5485be`
    (still live 2026-11-04)
  - Game pass references (session 9): see session 9 log entry below
  - "How we protect your purchase" expanded features + Warranty ⓘ tooltip
    (Covered / Not covered) scraped live 2026-11-04 by expanding the
    panel / hovering ⓘ (the capture ships both collapsed/empty); stored in
    `src/components/eldorado/data/productData.js`
- Implementation status (session 10 — 9 new components + dynamic page):
  - `data/productData.js` — offer fields verbatim (title "[ ANDROID ] ACC
    3000 COINS, 2.5M GP", price 2.38, Game Series/Original email/Warranty/
    Delivery rows, EN+PT description), 4 carousel cards, 9 bottom grid
    cards + "+15 more", seller (Rintana93), protect features + warranty
    tooltip (live-scraped), payment badge URLs (verified HTTP 200)
  - `ProductBanner.js` — dark game strip, NO Accounts/Coins tabs (capture +
    live): lg icon + "eFootball 2027"; mobile back chevron + stacked names
    (the live mobile banner doubles as the breadcrumb)
  - `ProductBreadcrumb.js` — lg-only bar: blue chevron + bold 14px
    "Back to all offers" (capture wording; live says "Browse all offers")
  - `ProductTitleCard.js` — lg: white card, 24px title + hairline border-b,
    scrollable 255px rounded screenshot strip; mobile: inset image on
    white (p-[10px], rounded, live @390) + title section
  - `ProductOfferCard.js` — lg sidebar card: blue "Full email access
    included" gradient banner (link icon + ⓘ), 24px price, min-h-12 detail
    rows (Game Series first, Delivery time = teal bolt + bold Instant),
    dark Buy now, shared TrustRows; mobile: compact chip + 28px price,
    Game Series row hidden (live hides it — banner names the game)
  - `ProductProtectCard.js` — light-blue accordion: shield roundel + bold
    title + chevron; open = 4 live-scraped feature rows (bold + gray text)
  - `ProductSellerCard.js` — lg per capture: avatar 48px + name + teal
    badge + "99.6% positive feedback" link, rows (Online teal dot, 2,699
    orders delivered, Selling since Mar 31, 2026, gray icons),
    "Verified ID" light-blue chip; mobile per live: gray "Seller" heading
    outside, avatar + name + thumbs "99.6%" + "2,701 reviews" link
  - `ProductCarousel.js` — "More like this" (18px lg / 16px mobile) +
    "Page {n} of 4" 12px + bordered arrow buttons (disabled = #c6c6cc);
    w-52 cards (84px 3-line title, seller + teal badge | feedback, 18px
    price | teal bolt-only delivery); mobile swaps indicator for an
    "All offers" link and moves arrows under the row; scroll updates page
  - `ProductDescriptionCard.js` — "Offer description" 18px bold, chips
    (blue check + bold + ⓘ), 16px/24px pre-wrapped description
  - `ProductMoreGrid.js` — lg only (live @390 has no bottom grid): 24px
    header + "All offers" link, 3-col grid of h-40 cards (2-line title +
    58px img, seller | feedback, price | bolt + gray delivery label),
    "+15 more" gray cell
  - `app/efootball-accounts/oa/[id]/page.js` — async params (Next 16),
    generateStaticParams → the one capture product, notFound otherwise;
    lg: two-col grid-cols-[minmax(0,1fr)_444px] gap-6 with sticky sidebar
    (top-[108px] per capture); <lg: stacked live flow (image → title →
    offer → protect → carousel → seller → description); PPR static build
- Visual comparison status (side-by-side strips local|live):
  - 1920 + 1536: banner, breadcrumb, title card + 255px image, carousel
    (4 cards + paginator), description card, sidebar (included banner,
    price, rows, Buy now, trust rows, protect, seller), bottom grid,
    footer all match structure/colors/spacing
  - 1024: live switches to the two-col desktop layout — matched
  - 768 + 390: live keeps the stacked mobile flow (inset image, chip +
    big price, rows without Game Series, protect, carousel + arrows,
    seller, description, no bottom grid) — matched after fixes
  - No horizontal overflow: scrollWidth == viewport at
    390/768/1024/1536/1920
  - Interactions verified headless: protect accordion opens (live
    content), Warranty tooltip shows Covered/Not covered, carousel arrows
    scroll + page indicator updates; zero console errors at all widths
- Known deviations / documented limitations:
  - Prices use the capture's EUR values ("2.38" etc.), not the live
    geo-localized HK$ — same policy as sessions 7/9
  - Live sidebar shows a "Recent feedback" list + "All feedback" button
    and the bottom-grid cards carry a small game-name line — both
    live-only details absent from the capture; capture followed (design
    reference file)
  - Description text follows the live rendering: the capture decode lost
    the Portuguese diacritics (Região/Transferência/verificação)
  - Original email / Delivery time ⓘ buttons are decorative (no tooltip
    content in any reference; no copy invented) — only Warranty has the
    live-scraped Covered/Not covered tooltip
  - Carousel "Page 1 of 4" per the capture (only 4 cards ship in it, so
    one Next click reaches the last page); live has 4 pages of real data
  - Bottom "+15 more" is a static gray cell per the capture
  - Seller card icons (orders/selling-since) and the protect shield
    roundel are reasonable SVG defaults — the capture's icomoon glyphs
    are empty (project pattern: inline SVG replacements)
  - Mobile footer language chip shows EUR (existing Footer per its own
    session-7 capture), live geo-shows HK$ — pre-existing component
- Technical checks: `npm run build` SUCCESS (/, /efootball-accounts,
  /efootball-accounts/oa/2f48f97f-…, /xbox-game-pass, /xbox-gift-card,
  /_not-found); route returns 200; interactions verified headless
  (see above). Lesson recorded: rebuilding .next while `next start` is
  serving it corrupts static chunk serving (CSS 500, unstyled page) —
  always stop the server before rebuilding
- Deployment: VERIFIED — Vercel serves the product page (HTTP 200; HTML
  contains "ACC 3000 COINS", "Full email access included",
  "Back to all offers", "How we protect your purchase", "Verified ID"),
  corresponding to push 3d2f95b; /, /efootball-accounts, /xbox-game-pass
  and /xbox-gift-card re-verified 200 after the deploy
- Next exact action: on request — gift card amount→offers step, other
  gift card brands reusing these components, or the product page's
  quantity/feedback sections if the user pushes references for them

## Section log (append one block per completed section)

- 2026-11-04 (session 10) — Product-single page
  (`/efootball-accounts/oa/[id]`), implementing the user-pushed dd741ad
  capture. Recovery: repo clean and synced at f232be4; the capture had
  already been decoded (f0a8173). Analysis: capture text/class extraction
  + LIVE captures at 390/768/1024/1536/1920 + DOM probes (two-col
  [minmax(0,1fr)_444px] grid, mobile order image→title→offer→protect→
  carousel→seller→description, Game Series row hidden on mobile, no
  bottom grid on mobile, 1024 = desktop switch) + live-scraping the
  collapsed-in-capture content: "How we protect your purchase" expanded
  (4 feature rows) and the Warranty ⓘ tooltip (Covered/Not covered, 4+4)
  via hover/TreeWalker scripts (scripts/scrape_product_*.js). Asset URLs
  verified HTTP 200 before use. Fixes after side-by-side strips: mobile
  image inset on white (was full-bleed) + description text 16px/24px
  (capture base size, was 14px). Ops lesson: rebuilding .next while the
  server serves it corrupts CSS chunk serving (page went unstyled and
  the interaction checks false-failed) — clean rebuild + fresh
  `next start` resolved it. Previous chat link still NOT accessible
  (checked session 9; unchanged). Verification: overflow=0 at
  390/768/1024/1536/1920, zero console errors, interactions green
  (protect accordion, warranty tooltip, carousel page state),
  `next build` green with the PPR static route. Push: 5585abf (+ doc
  commit). Known deviations documented in the checkpoint above.

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

- Last successful push timestamp: 2026-11-04, session 10
- Hash of last pushed commit: `5585abf` (session-10 chain: product page
  implementation + this doc commit; on top of session-9 tip f232be4;
  push verified by empty `git log origin/main..HEAD` + tail of push)
- Uncommitted changes: none expected after the doc commit
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
