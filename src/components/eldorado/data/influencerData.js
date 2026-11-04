/* Influencer Program page data (/influencer-program) — session 15, from
   the user-pushed capture `ui ux/nfluencer-program/
   www_eldorado_gg_influencer-program_1920w_390w_1536w_default.make`
   (decoded to extracted/snapshots/influencer-1920px-light-{1,2}.tsx).
   Asset URLs are verbatim from the capture — each has its own
   `generation` param (session-13 lesson: never share/regenerate params;
   each URL verified HTTP 200 individually). FAQ answers are not in the
   capture (accordion closed @1920) — scraped from live
   eldorado.gg/influencer-program on 2026-11-04. */

export const INF_BANNER =
  "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F8cf9d3d1040f082339213601b200fe6d2689e101.png?generation=1793787093293454&alt=media";

export const INF_TRUST_CHIPS = [
  { icon: "shield", title: "Safe sales", sub: "Protected by TradeShield" },
  { icon: "globe", title: "Global reach", sub: "Millions of verified buyers worldwide" },
  { icon: "star", title: "Trusted since 2019", sub: "4.4★ (290K+ reviews)" },
];

export const INF_WHY = [
  {
    title: "Secure trading",
    desc: "Verified sellers and TradeShield protection ensure every transaction is 100% safe.",
    icon: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F40ec31f93b02ac5b824d5d8daa9c532d0efb2139.svg?generation=1793796171892336&alt=media",
    alt: "Shield with a lightning bolt",
  },
  {
    title: "Dedicated support",
    desc: "Direct access to partnership managers and 24/7 assistance for your audience.",
    icon: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2Fcb2b1fbcefd49ccf5428ab34a5ea28f9bb3396c9.svg?generation=1793796171942038&alt=media",
    alt: "Support agent",
  },
  {
    title: "Audience trust",
    desc: "Promote with confidence thanks to our rock-solid money-back guarantee.",
    icon: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F4588990164680abfd7f1b9c4031af33039fa08fd.svg?generation=1793796171916897&alt=media",
    alt: "Award badge with a star",
  },
  {
    title: "Speedy payouts",
    desc: "No long wait times. Enjoy transparent, flexible payments via your preferred method within 5 business days.",
    icon: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2Fcf9febb8f7742205142f8c9a087d5c3322b27cb2.svg?generation=1793796171921923&alt=media",
    alt: "Wallet with banknotes",
  },
];

/* Who-can-join rows: rows 1-2 use icomoon glyphs in the capture (no
   svg asset) — substituted with inline SVG paths (YouTube / TikTok
   glyphs seen on live @390); row 3 uses the capture's svg. */
export const INF_WHO_INTRO =
  "Applications are manually reviewed to ensure a high standard of quality and brand alignment. We value engagement and community trust over raw follower counts.";

export const INF_WHO = [
  { icon: "youtube", title: "Video creators", desc: "Gaming creators of in-depth long-form tutorials, gameplay, or updates." },
  { icon: "tiktok", title: "Short-form influencers", desc: "Gamers who dominate TikTok and YouTube Shorts." },
  {
    icon: "twitch",
    img: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F260c18edc40aa583840601ea83fea8d61df97c59.svg?generation=1793796171906290&alt=media",
    title: "Streamers",
    desc: "Engaging gaming personalities on Twitch, Kick, or YouTube Live.",
  },
];

export const INF_STEPS = [
  { n: "1", color: "#d1f08f", title: "Apply", desc: "Fill out the simple form below with your channel details." },
  { n: "2", color: "#ffc950", title: "Wait for review", desc: "Our team reviews applications within 3-5 business days." },
  { n: "3", color: "#da8aea", title: "Get approved", desc: "Receive your custom partner link and assets." },
  { n: "4", color: "#77a3fc", title: "Start earning", desc: "Lead your audience to Eldorado and start earning, fast." },
];

export const INF_CTA = {
  title: "Start earning today",
  sub: "Register today and start building a long-term partnership with Eldorado.",
  mascotLeft: {
    src: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2Fcfb9cd509896b84377261c5174543d85fcb3202b.svg?generation=1793796171912781&alt=media",
    alt: "El Drago gaming",
  },
  mascotRight: {
    src: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F13172f3cebf5913be7a8c5ad878a6ce645b6c4f6.svg?generation=1793796171934423&alt=media",
    alt: "Currency",
  },
};

export const INF_FORM_GAMEPAD =
  "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2Fec42d47138528885e7325ae42f1616a68fa8c5ef.svg?generation=1793796171923806&alt=media";

export const INF_FIELDS = [
  { id: "name", label: "Full name", placeholder: "e.g. Steve Smith", half: true },
  { id: "email", label: "Email address", placeholder: "name@example.com", half: true },
  { id: "channel", label: "Primary channel link", placeholder: "e.g. <https://www.youtube.com/@yourchannel>", half: false },
  { id: "niche", label: "Main gaming niche", placeholder: "e.g. Fortnite", half: true },
  { id: "platform", label: "Main platform", placeholder: "e.g. YouTube, TikTok, or Twitch", half: true },
  { id: "location", label: "Main audience location", placeholder: "e.g. Germany", half: true },
  { id: "subscribers", label: "Your subscriber count", placeholder: "e.g. 123,456", half: true },
];

export const INF_AGENCIES = {
  title: "For agencies or talent managers",
  desc: "Represent a roster of gaming talent? We offer mutually beneficial partnership structures\u00a0for agencies. Lets discuss custom campaigns.",
  email: "partners@eldorado.gg",
  mascot: {
    src: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2Fe1909cc07a4273df71de6aca6dc53715e562712f.svg?generation=1793787230441212&alt=media",
    alt: "El Drago proud pose",
  },
};

export const INF_FAQ = [
  {
    q: "What is the Eldorado influencer program?",
    a: "It is an opportunity for gaming creators to partner with a leading gaming marketplace and get rewarded for their work.",
  },
  {
    q: "How can I get sponsored by Eldorado?",
    a: "The first step is joining our influencer program. Sign up using the form above and tell us about your channel. Our team will review your application and reach out to content creators whose work aligns with our brand values.",
  },
  {
    q: "Do creators get paid when sponsored by Eldorado?",
    a: "Yes. Our partners receive compensation for their promotional work. The payment structure is flexible and can be based on average views, content type, performance, or other custom agreed-upon terms.",
  },
  {
    q: "What kind of content should I make?",
    a: "We give you the creative freedom to stay authentic to your brand. We are primarily looking for creators who focus on gameplay-related content, game updates or tutorials.",
  },
  {
    q: "How and when do I get paid?",
    a: "Creators are paid according to their specific agreed-upon terms. To make things easy, we support a variety of flexible payment methods, including PayPal, Wire Transfers, and BTC.",
  },
  {
    q: "Does Eldorado.gg provide graphics or visuals?",
    a: "Yes! All partners gain access to high-res logos, stream overlays, and banners to help with the creation of professional ad segments.",
  },
  {
    q: "Is this the same as the Affiliate Program?",
    a: "Our Affiliate Program is commission-based, but the Influencer Program provides a deeper partnership with hands-on support, custom assets, and sponsorship structures tailored to your channel\u2019s growth.",
  },
];
