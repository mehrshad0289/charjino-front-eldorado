/* /dashboard/loyalty page data — verbatim from the user-pushed capture
   ui ux/loyalty/www_eldorado_gg_dashboard_loyalty_1920w_390w_1536w_default.make
   (decoded to extracted/snapshots/dash-loyalty-1920px-light-{1,2}.tsx,
   1920-only, session 16). All asset URLs verified HTTP 200 on 2026-11-04.
   The capture's icomoon glyphs decode empty (project-wide pattern) — the
   header icon maps to an inline SVG in DashboardPageHeader. */

const ASSET = "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F";

export const LOYALTY_PAGE = {
  title: "Eldorado Loyalty",
  streak: {
    title: "Monthly order streak",
    /* 4 milestones; every capture image is dimmed (opacity 0.35) because
       the capture's account has no orders this month; the first milestone
       shows no label in the capture */
    items: [
      {
        image: `${ASSET}67b77162fe8e37b2b2c6a1ca251ad10605079c69.svg?generation=1793800884900375&alt=media`,
        label: null,
      },
      {
        image: `${ASSET}8d9896f599fb042cafdc1a63361bd05734b9fd45.svg?generation=1793800884948024&alt=media`,
        label: "+500",
      },
      {
        image: `${ASSET}21a2935541e031b78f1ef1ae44048c91c5dec458.svg?generation=1793800884904222&alt=media`,
        label: "+500",
      },
      {
        image: `${ASSET}a6ba5bb4c2e2d0717934e20bb5f20ad5eaf392f7.svg?generation=1793800884923386&alt=media`,
        label: "+700",
      },
    ],
    caption: "Place 2 orders this month to earn +500 points.",
    rankRow: { rank: "Bronze", rankSuffix: " rank ", remaining: "2400 points left till Silver" },
    progressPct: 0,
    howItWorks: "How it works?",
  },
  points: {
    heading: "Available points",
    coin: `${ASSET}c3ac538a8837c344633a077c463dbe0d899e18be.svg?generation=1793800884935445&alt=media`,
    coinAlt: "Loyalty coin",
    amount: "0",
    hint: "Collect a minimum of 10,000 points and unlock a $1 reward.",
    tierCost: "10,000 points",
    tierValue: "1$ (0.91) Store Credit",
    redeemLabel: "Redeem",
  },
  achievements: {
    heading: "Achievements completed",
    counter: "0 / 17 completed",
    /* 2-col grid; the capture places the 3 cards in cells 1/1, 1/2, 2/1 */
    cards: [
      {
        title: "Critic",
        description: "Write reviews for sellers",
        image: `${ASSET}004b81d185e5c73525813f0e31b03b45756da4e2.svg?generation=1793800884911247&alt=media`,
        coin: `${ASSET}885aef54c9858584da8e123d07d35e3a3925ff8d.svg?generation=1793800884957639&alt=media`,
        reward: "+300 points",
        progress: "0 / 1",
        gridArea: "1 / 1 / 2 / 2",
      },
      {
        title: "Master Trader",
        description: "Place 2 Eldorado orders",
        image: `${ASSET}574a246a2f15453d24142e51cc9b771cd9a2185b.svg?generation=1793800884952266&alt=media`,
        coin: `${ASSET}07e72ec0a1d917ac0e7728cad0ee0f2a127788ed.svg?generation=1793800884931496&alt=media`,
        reward: "+400 points",
        progress: "0 / 2",
        gridArea: "1 / 2 / 2 / 3",
      },
      {
        title: "Explorer",
        description: "Place your first order in each category",
        image: `${ASSET}7ef0adeabe4b0265a9a039316ed37eaf4cc2bbc2.svg?generation=1793800885098336&alt=media`,
        coin: `${ASSET}c1144ea7f278dd4c09981220624df465c87a312a.svg?generation=1793800885174206&alt=media`,
        reward: "+400 points",
        progress: "0 / 1",
        gridArea: "2 / 1 / 3 / 2",
      },
    ],
  },
  dedication: {
    heading: "Dedication",
    description: "Purchase at least 2 products per game to earn points",
    backgroundImage: `${ASSET}7a4c44a39e846cbff60becc03d6511c0b35b53af.png?generation=1793800885119217&alt=media`,
    text: "Make your first purchase to track your progress.",
    buttonLabel: "Browse Eldorado",
  },
};
