# Eldorado Home — Implementation Checkpoint

Persistent progress document. Update after every meaningful checkpoint.
Recovery protocol: read this file first, then verify everything against the
actual files and Git history — never trust previous AI claims.

---

## Current Checkpoint

- Current page: Home + desktop mega menu + `/efootball-accounts` +
  `/xbox-game-pass` + `/xbox-gift-card` + product-single
  `/efootball-accounts/oa/[id]` + dashboard `/dashboard/offers/Account`
  + `/login` + `/blog` + `/blog/[category]/[slug]` (user's sessions
  12-12c) + `/about-us` + `/contact-us` + `/bug-bounty` (session 12b) +
  search dropdown rebuilt per capture (session 13)
- Current section: session 14 — review sweep (22 routes x 3 widths,
  all green) + new utility page `/pagelist` indexing every implemented
  route (23 rows in 6 groups); session 13 — SearchOverlay rebuilt from
  the search-1920px-light capture; ALL pushed captures have a page or
  component; verified and pushed
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
  - Search dropdown reference: `snapshots/search-1920px-light-{1,2}.tsx`
    (decoded early from the root www .make; the capture is the HOME page
    with the search dropdown OPEN — the page content below the header is
    the home variant already implemented; the dropdown layer z-[5] at
    the end of the snapshot is the reference for SearchOverlay)
  - LIVE DIVERGENCE (2026-11-04): current live eldorado.gg renders a
    WHITE search dropdown (input bg rgb(255,255,255), dark text —
    probed via Playwright) while the capture shows the DARK panel
    rgb(30,31,40); per project rules the capture stays the reference
    and the divergence is documented here
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
- Deployment: VERIFIED — push a1dae56 (rebased over the user's
  concurrent blog + capture commits without force); Vercel serves
  /about-us (200; "What is Eldorado.gg?", "Meet the team", "Lets team
  up", Vladas Jurkeviius, the expanded FAQ question), /contact-us
  (200; "How can we help?", "Start live chat", "Search help articles")
  and /bug-bounty (200; "Why is the bug bounty a big deal?", "Known
  Issues", bugs@eldorado.gg); /, /blog, /login,
  /dashboard/offers/Account, /efootball-accounts, /xbox-game-pass and
  /xbox-gift-card re-verified 200 after the deploy
- Next exact action: on request — blog article page (no capture pushed
  yet), more dashboard sections (orders/wallet) reusing DashboardShell,
  or any new captures the user pushes

- Implementation status (session 13 — SearchOverlay rebuild):
  - `SearchOverlay.js` rewritten from the search-1920px-light capture —
    the session-3 version was a white approximation (white panel,
    border-focusblue input, 32px assetsdelivery icons, no capture
    geometry). New: backdrop `backdrop-blur-xs bg-black/50`; centered
    panel `flex-col w-[1160px] bg-catnav rgb(30,31,40) max-h-[530px]
    rounded-2xl`; input row pt-6 px-6 pb-4; input h-[42px] bg
    rgb(42,42,55) (new token `--color-dropinput` #2a2a37) white text +
    white 24px search glyph right-2; body `overflow-auto max-h-[440px]
    pl-6 mt-2 mb-4`; uppercase 12px rgb(168,170,179) label pb-4; 10
    rows `flex-col gap-2` — a[aria-label] > h-[42px] row gap-2 text-16
    white > 28px rounded-sm icon + text-ellipsis name
  - Items verbatim from the capture: 10 names in capture order, 28px
    googleapis h2d-ext-asset icon URLs each with its OWN generation
    param (the shared-generation batch 401s — per-URL verification all
    200), capture hrefs stored per item for when those pages land;
    rendered hrefs still route to /efootball-accounts per the standing
    session-3 user wiring request
  - Mobile (<lg): full-screen white sheet unchanged (live-verified
    @390 in session 3), now fed by the same capture icon URLs
  - `globals.css`: + `--color-dropinput` token
  - Remaining-work audit: after this, EVERY decoded capture has an
    implementation (home/menu/search → /+HeaderBar+SearchOverlay,
    shop_account → /efootball-accounts, product-single, giftcard,
    gamepass, login, dashboard, about/contact/bugbounty, blog +
    blog-article) — the only unbuilt areas have NO captures (cart
    page, dashboard orders/wallet/messages, game-specific pages)
- Visual comparison status (screenshots `docs/ui-ux/screenshots/session13/`):
  - search-overlay-1920/768/390.png: dark panel + 10 rows match the
    capture layer; live-search-1920.png = live probe screenshot kept
    as the white-dropdown divergence reference
  - Computed styles == capture: input rgb(42,42,55)/white, rows h-42
    gap-8, icons 28px, label 12px rgb(168,170,179), body max-h-440,
    backdrop blur 4px black/50, panel 1160/rounded-2xl
- Technical checks: build green (33 routes); overlay opens via the
  header trigger at 1920/768/390, Escape closes (HeaderBar handler),
  body scroll lock intact; 20/20 overlay images load; overflow=0 at
  5 widths x 3 routes; zero console errors
- Known deviations / documented limitations:
  - Live shows a white dropdown today (see reference note) — capture
    wins per project rules
  - Suggestion hrefs route to /efootball-accounts (user's session-3
    wiring request), NOT the capture hrefs — the real hrefs are kept
    in the ITEMS data for future game pages
  - The capture's home content (Brainrot hero, Recently viewed,
    popular link sections) was already implemented in sessions 1-6
    from the same reference; not re-verified pixel-wise this session
- Deployment: VERIFIED — push 77a3b77; Vercel serves the new build
  (dropinput token present in the live CSS chunk) and all 9 routes
  return 200 (/, /blog, /login, /about-us, /contact-us, /bug-bounty,
  /efootball-accounts, /xbox-game-pass, /xbox-gift-card,
  /dashboard/offers/Account)
- Next exact action: on request — nothing capture-driven remains;
  candidates are the captures the user has not pushed yet (cart,
  dashboard orders/wallet, game pages) or a pixel pass on any page
  against live

- Implementation status (session 14 — review + /pagelist):
  - Review sweep: synced origin first (981a850 — the user's parallel
    blog-article fixes), rebuilt, probed 22 routes (11 static incl
    product single + 11 blog articles) x 3 widths = 66 probes: all
    HTTP 200, overflow 0, zero console/page errors. Spot-checks:
    search overlay opens with 10 rows, mega menu opens. Scripts:
    scripts/review_sweep.js (route list auto-built from
    blogArticlesData.js)
  - New route `/pagelist` (user request): index of every implemented
    page — Main 1 / Shop 4 / Blog 12 (landing + articles generated
    from BLOG_ARTICLE_PAGES, never drifts from data) / Company 3 /
    Account 2 / Utility 1 = 23 rows. Site frame (HeaderBar + Footer),
    token styling, white hairline cards, yellow count badges. Rows:
    title + category + mono route under it (long slugs truncate the
    ROUTE, never the title — first layout had the opposite)
  - Lesson: a stale next-server holding the port serves a stale
    .next — after rebuilding, kill by PID (ps, not lsof — lsof lists
    no LISTEN sockets in this sandbox) before `next start`
- Visual comparison status (screenshots docs/ui-ux/screenshots/session14/):
  pagelist-1920.png / pagelist-390.png — 6 groups render, titles full
  width (480px @1920), category label + route below title, hover row
  bg; all 23 links fetch-verified 200
- Technical checks: build green (34 routes incl /pagelist); overflow
  0 at 1920/390; zero page errors
- Known deviations / documented limitations:
  - /pagelist has NO capture (user-requested utility page) — styling
    follows the design system, not a reference
  - blog rows show the LIVE article titles; hrefs are internal routes
- Deployment: push after this commit — Vercel verified below in
  Backup Status
- Next exact action: on request — capture-driven work remains closed;
  /pagelist should gain a row per new route as they land

## Section log (append one block per completed section)

- 2026-11-04 (session 12c) — `/blog` live-verified pixel pass, merging a
  PARALLEL session's blog work (origin 219c24b fixed the root font bug
  — next/font variable moved to `<html>`, every page had silently
  rendered the system stack — and shipped its own /blog pass + a
  Footer showLang prop) with this session's pixel-measured corrections.
  Recovery first: cloned, synced at 3d2ab32, verified clean; verified
  the earlier chat-link recovery (CHAT-RECOVERY-NOTE.md) still holds.
  Verification method: side-by-side strips (scripts/compare_blog_strips.py)
  + DOM probes (scripts/probe_blog_*.js) + PIXEL scans of the committed
  live-blog-390.png (hairlines at y=70/148, Games/Codes text rows at
  y=102-114, header totals 149px). Fixes, one verified build per batch:
  (1) header mobile rebuilt — logo icon FIRST then burger (live order),
  EN shows caret and NO globe <1024, centered 20px Games/Codes in 55px
  buttons with their own hairline, container px-4 <640; header stays
  fixed at all widths (origin model) and the section clears it via
  pt-[147px] <640 / pt-20 @640-1023 / pt-[90px] lg+ (featured top ≈201/
  ≈135/≈145 = live at all three bands). (2) featured: 2-line clamp on
  the <p> (clamping the wrapper div does nothing under Chrome's
  -webkit-box aliasing), capture overlay padding px-10 py-8 @1920,
  mobile 365px card + p-4 + 24/31.2 bold-700 title + 16px date +
  18/25.2 excerpt. (3) cards: 110px image, 14px category <640, flex-1
  text column (384px like live; without it the column shrank to
  max-content and the longest title wrapped one word early).
  (4) highlights: px-4 container <768 (live hlGrid 358px vs cardsUl
  342px), h3 24/36 tracking .96 + mb-32, titles 18/23.4.
  (5) pagination min-w-[42px] (live pill 42×42). (6) BlogFooter — the
  blog capture footer is NOT the marketplace footer: title-case 16px
  links (Help Center…Become a Seller), 1240px container, no language
  selector, px-4 <768, last-3 payment icons hidden <768 (live shows
  Visa/MC/Amex/Discover + "15 more" in one row); Google badge 140×44.
  (7) FONT METRIC PARITY: Google Lato (next/font) renders ~3% wider
  than Eldorado's Lato (canvas probe: same 40-char string 379px vs
  live 368px) — registered "Lato Eldorado" @font-face 400/700/900 from
  the blog capture's font-face appendix URLs (all 200) first in
  --font-sans; next/font Lato stays as fallback. After the swap the
  longest card title wraps in 2 lines exactly like live and page
  height @1920 = 2825 vs live 2824. Rebase note: push rejected twice
  (user pushes concurrently) — fetch + rebase, conflicts resolved by
  keeping the origin root-cause font fix + fixed-header model and this
  session's pixel-measured internals (no force). Verification:
  overflow=0 at 390/768/1024/1536/1920, 0 console errors, 0 broken
  images, burger drawer open/close OK, build green with all routes
  static, section offsets @390 within ±2px of live (grid +26px over 10
  cards, footer −55px), total page height within 9px of a same-day
  live load (live itself fluctuates ±110 between loads). Screenshots +
  comparison strips committed under docs/ui-ux/screenshots/session12/.

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

- 2026-11-04 (session 13) — SearchOverlay rebuilt per the
  search-1920px-light capture; remaining-work audit closed. Recovery:
  fresh sync at de55aac (user had shipped /blog article route + pixel
  pass in parallel sessions eb749d5..de55aac); token rotated on origin.
  Audit: every decoded snapshot now maps to a route/component — the
  only gap was the search dropdown, where the old session-3 overlay
  was a white approximation. Probed live eldorado.gg for a mobile
  reference: live now renders a WHITE dropdown (divergence documented;
  capture wins). 401 lesson: each capture asset URL carries its own
  `generation` param — batch-verifying with one shared param fails
  spuriously. Verified overlay geometry/styles vs capture (see
  checkpoint), screenshots committed. Pushed 77a3b77.

- 2026-11-04 (session 14) — full review sweep + /pagelist utility
  index (user request). Recovery: synced origin 981a850 first (user's
  parallel blog fixes); token live on origin. Review: 22 routes x 3
  widths all green (200 / overflow 0 / no errors) — the codebase is
  healthy after 13 sessions. New /pagelist route links all 23 rows.
  Push verified by empty origin/main..HEAD.

## Backup Status

- Last successful push timestamp: 2026-11-04, session 14
- Hash of last pushed commit: `77a3b77` (SearchOverlay per capture) +
  this doc commit; push verified by empty `git log origin/main..HEAD`
  after every push; Vercel verified (dropinput token in live CSS, all
  9 routes 200)
- Uncommitted changes: none expected after this doc commit
- Unpushed commits: none
- Push auth: the session-12c PAT lives in the origin URL in this
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
