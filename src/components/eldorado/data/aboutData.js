/* About Us page (/about-us) data — verbatim from the user-pushed capture
   (session 12): ui ux/About-us/www_eldorado_gg_about-us_1920w_390w_1536w_default.make
   → decoded snapshots/about-1920px-light-1.tsx (1920-only).
   All asset URLs verified HTTP 200 on 2026-11-04 (scripts/verify_session12_assets.py).
   The capture's icomoon glyphs decode empty (project-wide pattern) — chevron /
   arrow / star icons map to inline SVGs in the components. The capture's copy
   keeps its dropped apostrophes ("Lets team up", "Its a safe place") verbatim. */

const ASSET = "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F";

export const ABOUT_BANNER = {
  src: `${ASSET}8cf9d3d1040f082339213601b200fe6d2689e101.png?generation=1793787093293454&alt=media`,
  alt: "About Us Page Banner Image",
};

export const ABOUT_BREADCRUMB = [
  { label: "Home", href: "https://www.eldorado.gg/", bold: false },
  { label: "About Us", href: "https://www.eldorado.gg/about-us", bold: true },
];

export const ABOUT_WHATIS = {
  title: "What is Eldorado.gg?",
  mission: { label: "Our mission", text: "Make in-game trading mainstream" },
  vision: { label: "Our vision", text: "A world where gaming belongs to gamers" },
  body: "Eldorado.gg is an online marketplace for gamers to buy and sell virtual in-game items (Roblox brainrots, ARC Raiders blueprints), currency (PoE Orbs, OSRS Gold), top-ups (Valorant Points, Fortnite V-Bucks), accounts, and boosting services. As a middleman, we connect gamers with verified sellers offering goods across 400+ popular titles and provide payment protection for both sides of every trade. Its a safe place to trade without getting scammed, ghosted, or ripped off.",
  stats: [
    { value: "#1", label: "Marketplace in the world" },
    { value: "12 M+", label: "Monthly visitors" },
    { value: "400+", label: "Games supported" },
    { value: "15", label: "Years of experience" },
  ],
};

export const ABOUT_PLAY = {
  title: "Shape the way you play with Eldorado.gg",
  body: "Decide how you experience games, instead of letting time and grind decide for you.",
  cards: [
    { title: "Skip the grind", iconBg: "rgb(255,153,64)", item: "Load endgame account" },
    { title: "Break RNG", iconBg: "rgb(218,138,234)", item: "Use some gold" },
    { title: "Save time", iconBg: "rgb(254,169,0)", item: "Top up extra points" },
    { title: "Level up", iconBg: "rgb(167,204,88)", item: "Get boosted" },
    { title: "Be a hero", iconBg: "rgb(160,149,253)", item: "Equip rare items" },
  ],
  empower: {
    lead: "We empower players to ",
    accent: "OWN",
    tail: " their gaming experience both in and outside the game through gameplay freedom and secure trading.",
    cards: [
      { icon: `${ASSET}af793303dbe30ca2f7e5435223092b24b961c552.svg?generation=1793787230232676&alt=media`, accent: "Own", text: " your identity" },
      { icon: `${ASSET}67967b17cc87f08f702e5d4c56b9a4264c454cb0.svg?generation=1793787230256048&alt=media`, accent: "Own", text: " your assets" },
      { icon: `${ASSET}d92cb47ab37042798401df804d5daebe143584db.svg?generation=1793787230241907&alt=media`, accent: "Own", text: " your playstyle" },
      { icon: `${ASSET}8fb59c58e88db39781d4f83203c15c9935ffc0a5.svg?generation=1793787230265885&alt=media`, accent: "Own", text: " your security" },
    ],
  },
};

export const ABOUT_TEAM = {
  title: "Meet the team",
  body: "We never thought it possible, but our love for video games brought us to a place where we can help shape the future of gaming. Our team of 200+ enthusiasts has a rock-solid understanding of MMO economies and extensive industry experience. We maintain a lively work environment filled with memes and video game references, far removed from bland corporate politics and mundane meetings.",
  founders: [
    {
      name: "Vladas Jurkeviius",
      role: "Co-founder & CEO",
      tagline: "Gaming, rally, and cycling enthusiast",
      bio: "A mechanical engineering graduate of the University of Cambridge, Vladas began selling OSRS Gold while at university in 2011. Outside of business, Vladas won the 2024 Lithuanian Rally Championship and made his Dakar Rally debut the same year. In 2026, he shifted his sporting focus to cycling, becoming Lithuanias national gravel cycling champion.",
      photo: `${ASSET}d8dec0a371f7c14914024487f2dae8b2d8c0fd8a.png?generation=1793787230255937&alt=media`,
      photoAlt: "Portrait of Vladas Jurkeviius, Eldorado.gg co-founder and CEO.",
    },
    {
      name: "Lukas Deksnys",
      role: "Co-founder & COO",
      tagline: "Gaming, chess, and tennis enthusiast",
      bio: "A University of Glasgow graduate with a background in mathematics and statistics, Lukas joined forces with his high school friend Vladas in 2017 to build ventures in gaming, e- commerce, and cryptocurrency trading. In April 2026, he became CEO of Humbility, leading the algorithmic cryptocurrency trading firm while Vladas focuses entirely on Eldorado.gg.",
      photo: `${ASSET}b97eb6d24976c918cce40beb1906432d9516e5be.png?generation=1793787230310788&alt=media`,
      photoAlt: "Portrait of Lukas Deksnys, Eldorado.gg co-founder and COO.",
    },
  ],
  photos: [
    { src: `${ASSET}e5052afc49ad39bc9af237b9da58407c10666bc3.jpg?generation=1793787230267758&alt=media`, alt: "Eldorado team members posing for a group picture dressed up in costumes." },
    { src: `${ASSET}87ae24af0069f92a5a8a4c95a826c363a33e340e.jpg?generation=1793787230268285&alt=media`, alt: "Eldorado team members playing volleyball on a sunny day." },
    { src: `${ASSET}6765224134c82f4c18f12bbc07042161e051b91d.jpg?generation=1793787230286750&alt=media`, alt: "Eldorado team members posing for a group picture with red kayaks and paddles on a sunny day outdoors." },
  ],
};

export const ABOUT_STORY = {
  title: "Our story: how did we get here?",
  body: "Just after finishing high school, our co-founder, Vladas, realized that one of his favorite games, Old School RuneScape (OSRS), and its in-game currency, Gold, could be traded for real money.",
  milestones: [
    { year: "2025", title: "Global leader", text: "Eldorado.gg became the largest in-game items marketplace with 10+ million monthly platform visits. Nine-digit value traded annually became the norm." },
    { year: "2019", title: "Platform launch", text: "A real struggle at first, with no payment providers and reluctant sellers. Over time, trust grew, traction followed, and Eldorado.gg became a major player." },
    { year: "2018", title: "Eldorado.gg is founded", text: "An idea of a marketplace was born. A platform that manages and secures trades between buyers and sellers without making any actual trades itself." },
    { year: "2014", title: "First e-shop", text: "Vladas launched his first e-shop. Gold bought from OSRS farmers was sold to gamers who wanted to skip the grind." },
    { year: "2013", title: "Growing confidence", text: "Vladas hired his first assistant to help handle trading, primarily via Skype." },
    { year: "2011", title: "Humble beginnings", text: "While in university, to make some extra cash, Vladas began selling his own OSRS Gold. At first, to his friends or through Facebook groups." },
  ],
};

export const ABOUT_TRUST = {
  title: "Trusted by millions of gamers",
  rating: "Excellent",
  reviews: [
    {
      initials: "JW",
      name: "James Wagner",
      date: "2 days ago",
      stars: { full: 4, half: 1 },
      title: "Successful",
      text: "The seller was not only calm, nice, patient but also trust worthy. The worked with me to giving access.",
    },
    {
      initials: "T",
      name: "Triczyz",
      date: "5 days ago",
      stars: { full: 5, half: 0 },
      title: "HUGE rainbow hatched NM dilo!",
      text: "purchased a rainbow hatched NM dilo, and it was the CHEAPEST and largest on the market across multiple platforms! Super fast delivery and affordable prices! ",
    },
    {
      initials: "CG",
      name: "Cyrus Graesslin",
      date: "2 weeks ago",
      stars: { full: 4, half: 0 },
      title: "The Best Platform, Bar None!",
      text: "I hesitated at first, concerned about being scammed, but i've had nothing but positive experiences.",
    },
    {
      initials: "T",
      name: "Triczyz",
      date: "5 days ago",
      stars: { full: 5, half: 0 },
      title: "HUGE rainbow hatched NM dilo!",
      text: "purchased a rainbow hatched NM dilo, and it was the CHEAPEST!!",
    },
  ],
};

export const ABOUT_TEAMUP = {
  title: "Lets team up",
  body: "El Drago guards the marketplace and gazes upon you, visitor, as your curiosity about Eldorado.gg brings you here.",
  bubble: "Are you a gamer, seller, partner, or maybe a new colleague? We shall see. ",
  bubbleArrow: `${ASSET}556c956b34429913e2316880061ea207ab569cdf.svg?generation=1793787230420963&alt=media`,
  mascot: `${ASSET}e1909cc07a4273df71de6aca6dc53715e562712f.svg?generation=1793787230441212&alt=media`,
  mascotAlt: "El Drago proud pose",
  cards: [
    {
      title: "Join the team",
      text: "We are looking for bold ideas and strategic thinking. Excellent English skills, open communication, data-driven reasoning, and strong math skills are also helpful. We promise a fun and laid-back work environment. No corporate politics, no boring meetings. Lots of memes and video games.",
      action: { label: "Open positions", href: "https://careers.eldorado.gg/", ariaLabel: "Open positions" },
    },
    {
      title: "Become a seller",
      text: "Reach millions of gamers who buy gaming goods daily from sellers like you. Register, complete verification, and begin listing offers in minutes. You can automate listings, pricing, and delivery workflows via the API and upload in bulk. Earn money, knowing that payment risks are handled professionally and fairly.",
      action: { label: "Start verification", href: "https://www.eldorado.gg/become-seller", ariaLabel: "Start verification" },
    },
    {
      title: "Become an affiliate",
      text: "If you are a blogger, website owner, community leader, Reddit mod, Discord server owner, guild manager, or newsletter editor and want to promote Eldorado.gg to your audience, we would love to hear from you. Lets discuss!",
      action: { label: "Reach out", href: "https://affiliates.eldorado.gg/", ariaLabel: "Reach out" },
    },
    {
      title: "Join the influencer program",
      text: "If you are a content creator or own a gaming channel (YouTube, Twitch, TikTok), we would love to forge a partnership. Dont hesitate to reach out if you have any doubts about the nature of your content. Lets chat it through!",
      action: { label: "Let's talk", href: "https://www.eldorado.gg/influencer-program", ariaLabel: "Let's talk" },
    },
  ],
};

/* FAQ: verbatim questions. Only "How to find the best deal on Eldorado.gg?"
   carries accordion content in the capture (rendered expanded, chevron
   rotated 180°); the other rows are collapsed with no body — the capture
   contains no answers for them, so none are invented. */
export const ABOUT_FAQ = {
  title: "FAQ",
  items: [
    { q: "Who founded Eldorado.gg?" },
    { q: "When was Eldorado.gg founded?" },
    { q: "Where was Eldorado.gg founded?" },
    { q: "Is Eldorado.gg legit?" },
    { q: "Is Eldorado.gg safe to use?" },
    { q: "How does TradeShield work?" },
    { q: "What is the official Reddit page of Eldorado.gg?" },
    { q: "Are there Eldorado.gg discount codes?" },
    { q: "Does Eldorado.gg have a bug bounty?" },
    { q: "How to buy on Eldorado.gg?" },
    {
      q: "How to find the best deal on Eldorado.gg?",
      a: "PriceFor currencies and top-ups, offers are ranked to ensure the top offer provides the best price. Of course, you are free to select any seller to order from by scrolling down.For accounts and items, you can sort offers by price.For boosting, you'll receive personalized offers after you choose your preferences.Ratings and ordersOn Eldorado.gg, each seller has their own review rating indicated by a feedback score and order count under their name.Order count indicates the quantity of successful orders that a particular seller has completed.Feedback score indicates the percentage of orders for which a customer was satisfied with the service. In both instances, the higher the better in general, though you should also factor in other aspects of the offer, such as its unique selling points, availability, delivery time, delivery method, and, of course, the price.NOTE: As a company policy, we do not remove negative feedback and do not offer sellers any options to curate feedback. You can rest assured that all feedback on our platform is genuine, and a high feedback score is earned through going above and beyond to provide excellent service.",
      open: true,
    },
    { q: "Where can I find reviews of the Eldorado.gg marketplace?" },
    { q: "Does Eldorado.gg have a mobile app?" },
  ],
};
