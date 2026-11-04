/* Blog landing page (/blog) data — verbatim from the decoded capture
   (session 12): ui ux/blog/www_eldorado_gg_blog_1920w_390w_1536w_default.make
   → snapshots/blog-1920px-light-{1,2}.tsx.
   The capture is a NATIVE Figma file (fig-make container, zstd scene graph);
   scripts/decode_blog_capture.py extracts the App.tsx snapshots.
   Capture is 1920-only — responsive behavior (grid 1→2 cols @640, highlights
   2→4 cols @768, header mobile→desktop @1024) follows the live page
   (live-blog-*.png screenshots, probed 2026-11-04).
   All asset URLs verified HTTP 200 on 2026-11-04. The full featured excerpt
   is truncated in the capture ("…Baldur's"); the complete text was read from
   the live page. interstate = capture font for headings/buttons (800/900
   woff2 URLs from the capture's font-face appendix, loaded in globals.css);
   body text is Lato like every other page. */

const ASSET = "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F";

/* Blog header logo (capture img alt="Eldorado Blog", 202x40 — the full
   Eldorado.gg wordmark, wider than the marketplace Logo component). */
export const BLOG_LOGO = `${ASSET}0381a555f42c9b8a333568600bda3e0489077e42.svg?generation=1793788934848931&alt=media`;

/* Featured article — image card with bottom-left overlay
   (gradient to right top: rgba(0,0,0,.85) 0% / .45 40% / transparent 70%). */
export const BLOG_FEATURED = {
  href: "https://www.eldorado.gg/blog/insider-interviews/mark-darrah-bioware-shutdown-dragon-age-veilguard-interview/",
  image: `${ASSET}f8762c43bda8961a0f16595392b1cd4671fcdccc.webp?generation=1793788934889345&alt=media`,
  alt: "Exclusive With Mark Darrah: Former BioWare Producer Speaks Out on Dragon Age: Veilguard, EA, and the Studio's Shutdown",
  date: "26 Oct 2026",
  title: "Exclusive With Mark Darrah: Former BioWare Producer Speaks Out on Dragon Age: Veilguard, EA, and the Studio's Shutdown",
  excerpt:
    "Mark Darrah, former BioWare Executive Producer with over two decades of leadership experience across Dragon Age and Baldur's Gate, sat down for an exclusive interview reflecting on his role as…",
};

/* "The Latest" grid — 10 article cards (2 cols x 5 rows @1920), verbatim
   capture order. Dates + read times as rendered in the capture. */
export const BLOG_ARTICLES = [
  {
    category: "Steal an Egg",
    title: "All Steal an Egg Mutations and Multipliers",
    date: "3 Nov 2026",
    read: "~8 min read",
    href: "https://www.eldorado.gg/blog/steal-an-egg/steal-an-egg-mutations-guide/",
    image: `${ASSET}b755a223456f689d52385c4e0bad5791f1d4f55a.webp?generation=1793788934866663&alt=media`,
  },
  {
    category: "Steal an Egg",
    title: "Steal an Egg Halloween Part 2.5 (#Update 10.5): Headless Horseman & Paranoid Pete",
    date: "2 Nov 2026",
    read: "~3 min read",
    href: "https://www.eldorado.gg/blog/steal-an-egg/steal-an-egg-headless-horseman-and-paranoid-pete-update/",
    image: `${ASSET}3c35d42d924b44ca6d1f54690a0192184ca15574.webp?generation=1793788934850357&alt=media`,
  },
  {
    category: "Steal a Brainrot",
    title: "Steal a Brainrot Traits Guide (2026): Multipliers, Tier List & How to Get Them",
    date: "2 Nov 2026",
    read: "~8 min read",
    href: "https://www.eldorado.gg/blog/steal-a-brainrot-en/steal-a-brainrot-traits-guide/",
    image: `${ASSET}f78f69387ac6f71b3f287076287bdf093dea9edd.webp?generation=1793788934851219&alt=media`,
  },
  {
    category: "Steal a Brainrot",
    title: "All Brainrots in Steal a Brainrot: Full List, Rarities & Spawning Guide",
    date: "2 Nov 2026",
    read: "~9 min read",
    href: "https://www.eldorado.gg/blog/steal-a-brainrot-en/all-brainrots-in-steal-a-brainrot/",
    image: `${ASSET}6f656686b851c760e4a6ad2cfd5c3dcd551c71de.webp?generation=1793788934869617&alt=media`,
  },
  {
    category: "League of Legends",
    title: "League of Legends Worlds 2026: LoL Championship Guide",
    date: "1 Nov 2026",
    read: "~17 min read",
    href: "https://www.eldorado.gg/blog/league-of-legends/league-of-legends-worlds-2026-guide/",
    image: `${ASSET}418fe7345fe3055d3f01dbf4c78ac29f96955f5b.webp?generation=1793788934841601&alt=media`,
  },
  {
    category: "EA FC 27",
    title: "How to Make Coins Fast in EA FC 27 Ultimate Team",
    date: "30 Oct 2026",
    read: "~5 min read",
    href: "https://www.eldorado.gg/blog/ea-fc-27-en/ea-fc-27-make-coins-fast/",
    image: `${ASSET}ea62f3a33c91dd04a3cee119f3a744f8caf94180.webp?generation=1793788934858652&alt=media`,
  },
  {
    category: "League of Legends",
    title: "League of Legends Riot Points: LoL RP Prices by Region (2026)",
    date: "30 Oct 2026",
    read: "~10 min read",
    href: "https://www.eldorado.gg/blog/league-of-legends/league-of-legends-riot-points/",
    image: `${ASSET}365d9598c2e1a7f7575bbe8389315be787a63105.webp?generation=1793788934887783&alt=media`,
  },
  {
    category: "EA FC 27",
    title: "EA FC 27 Best Evolutions: Top Players, Upgrades & Requirements",
    date: "30 Oct 2026",
    read: "~7 min read",
    href: "https://www.eldorado.gg/blog/ea-fc-27-en/ea-fc-27-evolutions-guide/",
    image: `${ASSET}a3974e67466ee44902b03f2587b721808dcf6791.webp?generation=1793788934877989&alt=media`,
  },
  {
    category: "Murder Mystery 2",
    title: "MM2 Halloween Update 2026: All New Godlies, Chromas, Battle Pass & Rewards",
    date: "30 Oct 2026",
    read: "~7 min read",
    href: "https://www.eldorado.gg/blog/murder-mystery-2-en/mm2-halloween-event-2026/",
    image: `${ASSET}c902766896ac632913fa6a79bb950dfa1d1f55c7.webp?generation=1793788935012441&alt=media`,
  },
  {
    category: "Murder Mystery 2",
    title: "MM2 All Weapons List 2026: Rarities & How to Get Them",
    date: "30 Oct 2026",
    read: "~8 min read",
    href: "https://www.eldorado.gg/blog/murder-mystery-2-en/mm2-all-weapons-list/",
    image: `${ASSET}a7464d4dc2b335850255dd49a737393873d98156.webp?generation=1793788935034443&alt=media`,
  },
];

/* Pagination — page 1 of 26 per the capture nav:
   [1 active] [2] [3] […] [26] [Next »] (Next text verbatim, live-verified). */
export const BLOG_PAGINATION = {
  current: 1,
  pages: [2, 3],
  last: 26,
  nextHref: "https://www.eldorado.gg/blog/page/2/",
};

/* "Play Smart. Skip the Grind." highlights strip — 4 items, tile colors and
   33px inline icons verbatim (grid 2 cols → 4 cols @768 per live probes). */
export const BLOG_HIGHLIGHTS_TITLE = "Play Smart. Skip the Grind.";

export const BLOG_HIGHLIGHTS = [
  {
    title: "Community guides",
    text: "Tips on MMO economy, leveling, and current meta.",
    bg: "rgb(152, 126, 251)",
    icon: `${ASSET}4b8c0d8077bd385eba3c368890334bb21dd324f6.svg?generation=1793788935023674&alt=media`,
  },
  {
    title: "Redeem codes",
    text: "Active free promo codes to boost your progression.",
    bg: "rgb(193, 240, 124)",
    icon: `${ASSET}368d0318f333542b6dc96e93b8c24ec14d76c128.svg?generation=1793788935027317&alt=media`,
  },
  {
    title: "Tutorials & reviews",
    text: "How to play and trade safely in and outside the game, and is it any good?",
    bg: "rgb(0, 228, 201)",
    icon: `${ASSET}abe4f78fdf57fdc8f95d1a521845de14acbab8af.svg?generation=1793788935042027&alt=media`,
  },
  {
    title: "News & updates",
    text: "Timely coverage of patches, releases, events, and industry shifts.",
    bg: "rgb(244, 180, 0)",
    icon: `${ASSET}8befab1e956916b11a7b5d55d022f3b000a4b726.svg?generation=1793788935039780&alt=media`,
  },
];

/* Halloween CTA banner between the highlights strip and the footer — a single
   image in a 786px rounded frame (capture: alt "Eldorado Halloween"). */
export const BLOG_CTA = {
  href: "https://www.eldorado.gg/",
  image: `${ASSET}c40dbf9e25be4f91f8411a9b3fdf360711611574.webp?generation=1793788935057551&alt=media`,
  alt: "Eldorado Halloween",
};

/* Internal article pages (session 13): /blog/[category]/[slug] pages exist
   for the 11 articles linked by this landing page (content scraped live
   into data/blogArticlesData.js). Card links resolve to the internal
   route; any other href keeps the capture's external eldorado.gg URL. */
const BLOG_INTERNAL_SLUGS = new Set([
  "steal-an-egg-mutations-guide",
  "steal-an-egg-headless-horseman-and-paranoid-pete-update",
  "steal-a-brainrot-traits-guide",
  "all-brainrots-in-steal-a-brainrot",
  "league-of-legends-worlds-2026-guide",
  "ea-fc-27-make-coins-fast",
  "league-of-legends-riot-points",
  "ea-fc-27-evolutions-guide",
  "mm2-halloween-event-2026",
  "mm2-all-weapons-list",
  "mark-darrah-bioware-shutdown-dragon-age-veilguard-interview",
]);

export function blogInternalHref(href) {
  const m = /\/blog\/([^/]+)\/([^/]+)\/?$/.exec(href || "");
  if (m && BLOG_INTERNAL_SLUGS.has(m[2])) return `/blog/${m[1]}/${m[2]}/`;
  return href;
}
