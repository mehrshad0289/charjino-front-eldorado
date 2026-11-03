# Eldorado Home — Implementation Checkpoint

Persistent progress document. Update after every meaningful checkpoint.
Recovery protocol: read this file first, then verify everything against the
actual files and Git history — never trust previous AI claims.

---

## Current Checkpoint

- Current page: Home
- Current section: ALL home sections implemented per the decoded
  `ui ux/www_eldorado_gg_1920w_390w_1536w_default.make` reference (desktop
  1920 code extracted to `ui ux/extracted/eldorado-home-reference-1920.tsx`,
  982 lines) + responsive pass for 1536/390 — visually verified, build green,
  deployed to Vercel
- Reference file: `ui ux/www_eldorado_gg_1920w_390w_1536w_default.make`
  (zip → canvas.fig → decoded; the authoritative design target per user
  2026-11-03: "این فایل خیلی خیلی مهمه"). Live eldorado.gg used as secondary
  reference for header/footer assets and mobile patterns.
- Design decision of record: the .make capture is the USER'S live view of
  eldorado.gg (contains personalized "Recently viewed"), which differs from
  the variant served to this sandbox (old home with 4 white list cards + hero
  text overlay). The .make structure is therefore the target:
  image-only hero banner → Popular product cards → Roblox banner →
  Recently viewed → How buying works → Roblox currencies → Popular games →
  Safe and easy trading → guarantee cards → footer → chat bubble.
  The 4 white CategoryCards and the hero h1/CTA are no longer composed on the
  page (component files kept in repo; restorable via git history 9eb1918^).
- Implementation status (commit adc87ca):
  - `src/app/page.js`: full .make composition inside
    `<main class="relative"><Hero/><div class="relative z-10">…</div></main>`
  - `src/components/eldorado/`: HeaderBar (client), CategoryNav, Logo,
    MobileMenu, SearchOverlay, Hero (image-only banner + fade + characters
    layer), PopularCards, RobloxBanner, RecentlyViewed, HowBuyingWorks,
    RobloxCurrencies, PopularGames, TradingSection, GuaranteeCards, Footer,
    ChatBubble (fixed intercom-style bubble)
  - Assets: live eldorado CDN (assetsdelivery) for banner/characters/icons/
    payments/badge; GCS prd-storytodesign URLs (from the .make capture, all
    verified HTTP 200 AND visually correct) for Popular card art, Roblox
    banner, how-buying illustrations, currency/game icons, chat icon.
    EXCEPTION: GCS banner asset 6f060924… serves WRONG content (a photo, not
    the banner) — do not use it; the CDN banner + brainrot-hero.webp overlay
    is used instead (verified rendering).
- Visual comparison status:
  - 1920 (full-page screenshot `docs/ui-ux/screenshots/session4/charjino-1920-full.png`
    vs `live-1920-full.png`): all 9 sections present and ordered like the
    .make reference; header pixel-probed from live: bar #0E0E11, search field
    #28272E, border #323140, catnav #1E1F28 — token `--color-headerdark`
    corrected from the earlier wrong #28272E. Popular cards (272×320,
    gradient rgba(30,31,40,0)→rgb(30,31,40) 92.5%, discount badge -76%* on
    PokeCoins) overlap the banner; hero characters visible right of the cards
    (left-86%, bottom-110, h-280).
  - 1536: verified (`charjino-1536-full.png`), 4-col steps, 5/7 currencies
    grid, 3-col games, no horizontal overflow.
  - 390: verified (`charjino-390-full.png`), scrollWidth == 390 (no overflow).
    Mobile: header 114px block, Popular = horizontal scroll row over the
    mobile banner, stacked steps/currencies/games, mobile trading image
    lazy-loads correctly (verified naturalWidth 984 after scroll).
- Viewports verified: 1920, 1536, 390
- Technical checks: `npm run build` — SUCCESS (static prerender, / only, no
  errors); dev server renders all sections, no console errors
- Deployment: Vercel serving the new build (HTTP 200; SSR HTML contains
  Popular / Recently viewed / How buying / Roblox currencies / Popular games)
- Known remaining differences (documented limitations):
  - .make is desktop-only (single 1920 frame) — mobile layouts for the NEW
    sections are inferred from eldorado patterns (scroll rows, stacked
    grids); documented as assumption
  - GCS hotlinks are Figma-capture mirrors; if eldorado moves the assets,
    swap to first-party URLs (risk noted; contents verified today)
  - "Popular" heading is ink-dark over the banner top band, exactly as the
    .make structure implies
  - search overlay/mega-menus unchanged from previous verified session
- Next exact action: per user — dark-theme tokens, inner pages, or pixel
  refinements on request; otherwise home is complete per the .make reference

## Section log (append one block per completed section)

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

- Last successful push timestamp: 2026-11-03, session 4
- Hash of last pushed commit: `adc87ca` (verified on origin/main via
  ls-remote immediately after push)
- Uncommitted changes: none
- Unpushed commits: none (`git log origin/main..main` empty)
- Push auth: user-supplied PAT used TRANSIENTLY in the push URL per push
  (`git push https://<token>@github.com/…`), never stored in .git/config or
  any file. If a future session has no token, ask the user for a fine-grained
  PAT (Contents: read/write) — plain pushes fail with
  "could not read Username for 'https://github.com'".
- Recovery instructions:
  1. `git clone https://github.com/mehrshad0289/charjino-front-eldorado.git`
  2. Read this file; verify state per the protocol checklist (git status,
     local vs origin, build)
  3. Continue from "Next exact action"
