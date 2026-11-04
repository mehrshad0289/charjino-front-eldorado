# Eldorado Home — Implementation Checkpoint

Persistent progress document. Update after every meaningful checkpoint.
Recovery protocol: read this file first, then verify everything against the
actual files and Git history — never trust previous AI claims.

---

## Current Checkpoint

- Current page: Home + desktop mega menu + `/efootball-accounts` +
  `/xbox-game-pass` + `/xbox-gift-card` + product-single
  `/efootball-accounts/oa/[id]` + dashboard `/dashboard/offers/Account`
  + `/login` + `/blog` (session 12, user's own commits) + `/about-us` +
  `/contact-us` + `/bug-bounty` (NEW session 12b — static content pages
  per the user-pushed captures; verified and pushed)
- Current section: session 12b — about-us / contact-us / bug-bounty
  COMPLETE (decoded snapshots + live hero probe + visual self-review;
  all three captures are 1920-only with no rendered thumbnail)
- Reference files:
  - Blog capture (session 12, user-pushed):
    `ui ux/blog/www_eldorado_gg_blog_1920w_390w_1536w_default.make`
    → decoded `snapshots/blog-1920px-light-{1,2}.tsx` (2nd = font-face
    appendix). 1920-only, NATIVE Figma format (see decode note below)
  - Live references captured @390/768/1024/1536/1920:
    `snapshots/live-blog-*.png` (the capture is 1920-only; live site is
    the responsive source of truth per project convention)
  - Session-12b captures (user commits 1d4ab0c + 590903b, all
    1920-only): `ui ux/About-us/…about-us…make` →
    `snapshots/about-1920px-light-{1,2}.tsx` and
    `ui ux/bug-bounty/…make` → `snapshots/bugbounty-1920px-light-{1,2}.tsx`
    (html.to.design zlib path); `ui ux/contact-us/…make` →
    `snapshots/contact-1920px-light-{1,2}.tsx` (NATIVE fig-make file —
    decoded by scripts/decode_contact_capture.py reusing the blog
    decoder's scene-graph walker). Second snapshot of each = font-face
    appendix. No rendered thumbnails exist (68-byte placeholders)
  - CAPTURE QUIRK (about): html.to.design flattened the live custom
    elements and HOISTED all content sections into the hero wrapper;
    live eldorado.gg keeps the hero BOUNDED (~444px: pt-8 + breadcrumb
    + min-h-80 H1 + pb-16, banner img 1905x444 absolute inside it) with
    the sections as a SIBLING container — implemented the live way
    (the literal capture nesting paints the banner over the whole page)
  - Product/gamepass/giftcard/dashboard/login references: see session
    7-11 log entries below
- Implementation status (session 12 — data + 6 new components + page):
  - DECODE: the blog .make is NOT html.to.design like the earlier
    captures — it is a native Figma file ('fig-make' container: chunk 0 =
    raw-deflate schema, chunk 1 = zstd frame holding the scene graph with
    the full App.tsx snapshots). `scripts/decode_blog_capture.py` walks
    the chunks (pip zstandard) — reusable for any future native-Figma
    .make capture
  - `data/blogData.js` — featured article (Mark Darrah/BioWare, full
    excerpt live-verified — the capture truncates it at the clamp), 10
    "The Latest" cards (category/title/date/~N min read/href/image,
    capture order), pagination 1..26, 4 highlights (Play Smart strip,
    tile colors + 33px icons), Halloween CTA banner, blog logo (202x40
    wordmark SVG from the capture); all 32 capture asset URLs verified
    HTTP 200
  - `BlogHeader.js` — standalone blog bar (no search/sign-in/catnav, unlike
    HeaderBar): logo → /blog/, Games (yellow #FFB600) + Codes (purple
    #987EFB) buttons with chevrons (icomoon glyphs decode empty → inline
    SVG caret stand-ins), EN globe (data-URI verbatim from the capture) +
    yellow SHOP → eldorado.gg; mobile = burger row (h-70) + centered
    Games/Codes row (live @390) + full-screen drawer (Games/Codes links —
    live shows a hamburger popup; minimal approximation documented)
  - `BlogFeaturedArticle.js` — 358px image card (365 mobile), white
    hairline frame, gradient overlay "to right top" (85%/45%/0%), bottom-
    left overlay: yellow date, title, 2-line-clamped gray excerpt
  - `BlogArticleCard.js` — 140px yellow-2px-border thumbnail (106 mobile),
    purple uppercase category, white 20px title, gray date | clock ~N min
    read (clock = inline SVG stand-in for the empty icomoon glyph)
  - `BlogPagination.js` — 42px pills: [1] yellow active, 2 3 … 26, Next »
    (72px) — capture order + live "Next »" text
  - `BlogHighlights.js` — "Play Smart. Skip the Grind." centered interstate
    h3 + 4 items (60px rounded-xl colored tile, 33px icon, 24px title,
    gray 18px copy); grid 2 cols → 4 cols @768 (live probed)
  - `BlogCtaBanner.js` — Halloween banner image in the 786px white-hairline
    rounded frame (capture: alt "Eldorado Halloween")
  - `app/blog/page.js` — HeaderBar-less dark page bg rgb(14,13,18):
    fixed blog header + featured + The Latest grid (1→2 cols @640) +
    pagination + highlights + CTA + shared Footer (NO ChatBubble —
    verified absent on live /blog)
  - `globals.css` — interstate 800/900 @font-face (woff2 URLs verbatim
    from the capture's font-face appendix, same storage bucket as all
    capture assets) + blog tokens (blogpage/blogborder/blogyellow/
    blogpurple/bloggray/hlgreen/hlteal/hlamber)
  - `Footer.js` — new optional `showLang` prop (default true): the blog
    footer has NO language selector (capture + live verified)
- Global fix found via /blog (affects ALL pages): layout.js moved the
  next/font `--font-lato` variable class from <body> to <html> — Tailwind
  v4 resolves the @theme `--font-sans` value at :root, so the body-scoped
  variable resolved EMPTY and every page silently rendered the system
  font stack instead of Lato (found because the featured title wrapped 5
  lines vs live 5-with-different-metrics and h4 computed
  -apple-system...). Real Lato 400/700/900 now loads everywhere
  (document.fonts verified). This is a rendering improvement toward the
  references, not a regression
- Visual comparison status (screenshots `docs/ui-ux/screenshots/session12/`):
  - Side-by-side strips local|live at 1920 + 390 (cmp-*.png from the
    mid-session checkpoint, blog-fixed-*.png after fixes): header,
    featured card (title wrap, clamp, gradient), 10 cards, pagination,
    highlights, CTA and footer all match
  - Breakpoint behavior verified against live DOM probes: article grid
    1→2 cols @640, highlights 2→4 cols @768, header mobile→desktop @1024,
    inner container padding @640, card image 140px ≥640 / fluid below
  - overflow=0 at 390/768/1024/1536/1920 (scrollWidth == viewport)
- Technical checks: `npm run build` SUCCESS (/, /blog, /login,
  /dashboard/offers/Account, /efootball-accounts, product route,
  /xbox-game-pass, /xbox-gift-card, /_not-found — /blog static); zero
  console errors; burger drawer opens/closes with Games/Codes links;
  zero horizontal overflow at all 5 widths
- Known deviations / documented limitations:
  - The blog .make capture is 1920-only (native Figma) — all responsive
    behavior below 1920 follows live eldorado.gg/blog probes/screenshots
  - Games/Codes buttons are static (aria-haspopup, no menu content exists
    in any reference — nothing invented, per session-11 combobox pattern)
  - The mobile drawer content is a minimal approximation (live shows a
    hamburger popup; only Games/Codes links are observable)
  - interstate is loaded from the eldorado storage bucket (capture's own
    font URLs); if the bucket ever drops the files, headings fall back
    to Lato (documented in globals.css)
  - Footer "+ 15 more" matches the capture; live also shows a second
    "+ 18 more" (providers row) that the capture does not contain
  - Blog featured/article links point to the real eldorado.gg blog URLs
    per the capture hrefs (no blog-article pages exist in this clone)
- Deployment: verified after the final push (see section log) — /blog
  HTTP 200 on Vercel with "The Latest", "Play Smart", "Mark Darrah"
- Next exact action: on request — blog article page (no capture pushed
  yet), or the remaining static pages (About us / Contact us / Bug
  bounty captures already pushed in session 11), or more dashboard
  sections reusing DashboardShell/sidebar

- Implementation status (session 12b — 2 data files + 5 components + 3 pages):
  - `data/aboutData.js` + `data/staticPagesData.js` — verbatim capture
    copy for /about-us, /contact-us, /bug-bounty (the capture's dropped
    apostrophes kept: "Lets team up", "Theyre", "Its a safe place");
    every new asset URL verified HTTP 200
    (scripts/verify_session12_assets.py): shared banner, ninja, El
    Drago, bubble tail arrow, 2 founder portraits, 3 team photos, 4
    purple "Own" icons
  - `PageHero.js` — shared hero: full-width banner image (object-top) +
    bottom-half fade gradient to page bg + optional breadcrumb +
    centered H1; /about-us (breadcrumb + 72px H1) and /contact-us
    (banner at 50% opacity + 48px H1 + the two help cards INSIDE the
    hero, per the capture)
  - `TrustpilotStars.js` (+ TrustpilotLogo) — star squares with white
    star cutout: header row rgb(33,150,83), review stars rgb(0,182,122)
    with halves via 50/50 linear-gradient (capture pattern);
    `ReviewCard.js` — initials avatar (rgb(199,242,217) fill /
    rgb(18,101,53) text), name + relative date, stars, title, body — 4
    cards (the 4th repeats Triczyz per the capture) in the
    overflow-x-auto row (min-w-248, h-296, soft shadow)
  - `FaqAccordion.js` — about FAQ: ONLY "How to find the best deal on
    Eldorado.gg?" carries an answer in the capture (expanded by
    default, chevron rotate-180, clickable toggle); the other 12 rows
    are static — no answers exist in any reference, nothing invented.
    Bug-bounty Known Issues = static mode (6 collapsed rows, no bodies
    in the capture)
  - `TeamUpSection.js` — speech bubble (bold 14px; tail-arrow SVG sits
    62px OUTSIDE the bubble per the capture, lg-only — below lg it
    overflowed the viewport by exactly 22px) + El Drago mascot absolute
    over the CTA grid's top-right cell (capture gridArea 1/2, painted
    above the static card — quirky but verbatim) + 4 gradient CTA
    cards with capture hrefs (careers.eldorado.gg / become-seller /
    affiliates.eldorado.gg / influencer-program)
  - `/about-us` — hero + "What is Eldorado.gg?" (mission/vision split
    with hairline divider + 4 stats, border-r separators), "Shape the
    way you play" (5 gradient cards in ONE row — grow basis-0, colored
    icon tiles, one item each per capture), "We empower players to OWN"
    (purple rgb(92,94,239) accent + 4 w-210 mini cards), "Meet the
    team" (2 founders + verbatim bios + 3 square photos), "Our story"
    timeline (border-l-2, yellow dots, year pills 2025→2011),
    Trustpilot block, TeamUp, FAQ
  - `/contact-us` — hero + H1 + two help cards: live chat (blue
    rgb(177,203,255) icon tile, dark "Start chat" button — NO href in
    the capture, Intercom on live — rendered as a button; hr + "You can
    also contact us by email." link) and help articles (amber tile ==
    guarantee token, light button → https://support.eldorado.gg/ per
    the capture href)
  - `/bug-bounty` — cream rgb(255,253,246) hero band + centered ninja
    (197x182), H2 48, two intro sections (18px copy), 5 numbered steps
    with mailto:bugs@eldorado.gg + bold $10/$5,000, Known Issues
  - `globals.css` — new tokens: empower #5c5eef, tpgreen #219653,
    tpstar #00b67a, avatarbg #c7f2d9, avatartext #126535, bountycream
    #fffdf6, contactblue #b1cbff (stats-label gray reuses bloggray;
    contact amber tile reuses guarantee)
- Visual comparison status (screenshots `docs/ui-ux/screenshots/session12/`):
  - No rendered capture exists for any of the three pages (thumbnails
    are 68-byte placeholders) — verification is DOM-structural vs the
    decoded snapshots + visual self-review at 1920 and 390:
    /about-us hero pattern + fade, 5-card row, founders/photos,
    timeline, review cards, Drago-over-CTA, FAQ expanded row all match
    the captures; /contact-us two-card layout matches; /bug-bounty
    cream band + ninja + steps + 6 rows match
  - overflow=0 at 390/768/1024/1536/1920 on ALL THREE routes (after the
    bubble-arrow lg-only fix); zero console errors everywhere
  - Image-loading probe false-positives documented: lazy images below
    the fold (footer payment icons — assetsdelivery.eldorado.gg,
    confirmed HTTP 200 — and founder portraits) report as unloaded when
    the probe never scrolls; NOT broken
- Technical checks: `npm run build` SUCCESS (/, /blog, /login,
  /dashboard/offers/Account, /efootball-accounts, product route,
  /xbox-game-pass, /xbox-gift-card, /about-us, /contact-us,
  /bug-bounty, /_not-found — all three new routes static); FAQ toggle
  verified (aria-expanded true→false→true); mailto + Start chat +
  support link verified in DOM
- Known deviations / documented limitations:
  - All three captures are 1920-only → below-lg behavior is a
    documented approximation (fluid padding px-4, mission/vision and
    founders stack, stats 2-col, play cards wrap, contact cards stack)
  - Header uses the LOGGED-IN variant (profile avatar, no Log in
    button) exactly like the dashboard/login captures — the capture's
    account is signed in; MobileMenu still shows the logged-out menu
    content (no logged-in mobile menu reference exists)
  - FAQ answers (other than the captured one) and Known Issues bodies
    do not exist in any reference — rows are static rather than
    inventing content
  - The contact "Start chat" button has no destination in the capture
    (Intercom on live) — rendered as a no-op button; "contact us by
    email" is a styled button too (no mailto in the capture)
  - Footer "+ 15 more"/payment icons come from the shared Footer
    (matches the capture footer)
- Deployment: push a1dae56 (rebased over the user's concurrent blog +
  capture commits without force) — Vercel verified after this doc
  update (see section log entry)
- Next exact action: on request — blog article page (no capture pushed
  yet), more dashboard sections (orders/wallet) reusing DashboardShell,
  or any new captures the user pushes

## Section log (append one block per completed section)

- 2026-11-04 (session 12) — Blog landing page `/blog`, implementing the
  user-pushed blog .make capture. Recovery first: fresh sandbox, cloned
  the repo, verified local == remote (9f8eba4) with a clean tree; the
  progress doc pointed at the pushed-but-unimplemented blog capture.
  Decode discovery: the blog .make is a NATIVE Figma file (fig-make
  container) — chunk 0 = raw-deflate protobuf schema, chunk 1 = zstd
  scene graph containing the full html.to.design App.tsx snapshots;
  wrote scripts/decode_blog_capture.py (pip zstandard) and committed the
  decoded snapshots + live-blog-{390,768,1024,1536,1920}.png references
  (7593a8a). Checked the previously-unreachable chat link (section 13 of
  the instructions) — it NOW loads and describes only session-1-era work
  (tokens/header/hero/footer) that is already implemented and pushed;
  nothing to recover. Implementation in two checkpoint pushes (3d2ab32)
  then live-comparison fixes (219c24b): mobile header row metrics,
  featured card mobile typography (title 24/31.2 @700, date 16px,
  excerpt 18/25.2), 2-line excerpt clamp ON THE P (live puts the clamp
  on the p; wrapper divs don't clamp under Chrome 157's -webkit-box
  aliasing — computed display shows flow-root but the clamp applies),
  mobile section padding 147px so the featured card clears the 2-row
  fixed header exactly like live (52px gap), Footer showLang prop.
  GLOBAL FIX: the Lato next/font variable was scoped to <body> while
  Tailwind v4 resolves @theme --font-sans at :root — every page has been
  silently rendering the system font stack; moving the variable to
  <html> makes real Lato load on all pages. A concurrent session pushed
  verification artifacts (d5b98b7: session12 screenshots + probe/verify
  scripts) mid-session — first push rejected, fixed with fetch + rebase
  (no force), pushed clean as 219c24b. Note: GitHub accepted pushes only
  on the 2nd attempt twice today ("remote rejected (failure)", transient
  server error) — both retried and verified via ls-remote/log origin.
  Ops notes for future sessions: (1) the local `scripts/` helpers from
  sessions ≤11 were never committed — this session committed its decoder
  + compare scripts; (2) pkill pattern for the preview server is
  `next-server`, not "next start"; (3) this headless Chrome caches
  aggressively across `agent-browser open` calls — use a unique query
  param per measurement or restart the browser before trusting computed
  styles. Verification: build green, overflow=0 @5 widths, zero console
  errors, drawer interaction green, 32/32 capture assets HTTP 200,
  side-by-side strips match at 1920/390.

- 2026-11-04 (session 11) — Logged-in dashboard `/dashboard/offers/Account`
  + `/login`, implementing the user-pushed dashboard/login captures
  (58f7236). Order of operations per the user's message: push leftovers
  (nothing pending, local == eec1966) with the fresh PAT, then pull
  (dashboard + login captures). Recovery: reused the repo's own decoder
  (`ui ux/extracted/fig_reassemble.py`, recovered from the extracted dir)
  via scripts/decode_new_captures.py — 2 snapshots per capture, second is
  a font-face appendix. Analysis: dashboard = logged-in header (search +
  3 icon buttons + avatar), category strip, 465px banner + white 260px
  sidebar (active "Accounts" yellow), page header "Offers" + "New Offer",
  blue offline-mode banner, filter row, "Nothing found" empty state
  (brand-new account); login = standalone dark card on a cave backdrop.
  Mid-session the user pushed MORE captures (About-us + contact-us 1d4ab0c,
  bug-bounty 590903b) — first push rejected, fixed with fetch + rebase
  (no force), pushed clean as 0584d04. Fixes during verification: login
  card overflow 44px @390 (min-width:auto + the fixed 354px divider
  blocked flex shrinking → min-w-0 + fluid divider) and the verify
  script's chevron check (Tailwind v4 uses the CSS `rotate` property,
  not transform). Verification: build green (2 new static routes),
  overflow=0 at 5 widths on both routes, sidebar collapse/active-row
  interactions pass, zero console errors, visual self-review at
  1920/390/login (screenshots committed). Token note: the PAT supplied
  this session was embedded in the origin URL in the sandbox only.

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

- 2026-11-04 (session 12b) — Static content pages `/about-us`,
  `/contact-us`, `/bug-bounty` from the user-pushed captures, per the
  user's instruction "do everything remaining except the blog" (the
  blog was the user's own session-12 work: 7593a8a → 3d2ab32 →
  d5b98b7 → 219c24b → f861117, left untouched). Recovery: local tree
  had file-mode-only changes (644→755, zero content) — silenced with
  core.fileMode false; pulled 3d2ab32. Decode: about + bugbounty via
  the html.to.design zlib decoder; contact is a NATIVE fig-make file
  (zstd) — adapted the user's blog decoder (scripts/
  decode_contact_capture.py). All 13 new asset URLs verified 200.
  Mid-session discovery: the about capture's flattened DOM hoists all
  sections into the hero wrapper; a live probe (banner img 1905x444
  absolute, wrapper h=444) settled the bounded-hero structure — the
  literal capture nesting rendered the banner over the entire page.
  Fixes during verification: bubble arrow overflowed 22px below lg
  (lg-only now), El Drago + tail arrow switched from lazy to eager
  (lazy mid-page decorations missed the paint window in full-page
  screenshots), 5 play cards forced to one row (grow basis-0), and a
  stale `next start` process serving a pre-rebuild bundle produced
  phantom overflow — always restart the server after rebuilding.
  Verification: overflow=0 at 5 widths × 3 routes, zero console
  errors, FAQ toggle + known-issues rows + mailto + Start chat
  verified, visual self-review at 1920/390 (screenshots committed).
  Pushed a1dae56 (fetch+rebase over the user's concurrent commits).

## Backup Status

- Last successful push timestamp: 2026-11-04, session 12b
- Hash of last pushed commit: `a1dae56` (session-12b chain: a26544c
  decoded snapshots → a1dae56 static pages implementation + doc;
  rebased over the user's concurrent blog commits; push verified by
  empty `git log origin/main..HEAD`)
- Uncommitted changes: none expected after this doc commit
- Unpushed commits: none
- Push auth: the session-11 PAT lives in the origin URL in this
  sandbox only (transient; never committed). Future sessions without a
  token need a fine-grained PAT (Contents: read/write) or pushes fail
  with "could not read Username for 'https://github.com'". The user
  pushes concurrently — expect push rejections: fetch + rebase (never
  force) and retry.
- Sandbox gotchas learned this session:
  - `(cmd &)`-style servers DIE between tool calls; start long-lived
    servers with the tool's run_in_background
  - ALWAYS restart `next start` after `npm run build` — a running
    server mixes old HTML with new chunk references and produces
    phantom layout breakage
  - Lazy images below the fold report "broken" in DOM probes that
    never scroll — not real breakage
- Recovery instructions:
  1. `git clone https://github.com/mehrshad0289/charjino-front-eldorado.git`
  2. Read this file; verify state per the protocol checklist (git status,
     local vs origin, build)
  3. Continue from "Next exact action"
