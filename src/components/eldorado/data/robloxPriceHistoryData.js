// Data for the /sab-values/garama-and-madundung Roblox items price-history
// page (session 24; the user-pushed "Roblox items price history" capture →
// snapshots/robloxprice-1920px-light-{1,2}.tsx). Values verbatim EUR from
// the capture; the 90-day chart is the capture's own pre-rendered PNG.

const GCS = "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F";

export const ROBLOX_PRICE_IMAGES = {
  pageIcon: `${GCS}bf6be6f6ac0ec540e722b6a467dd8e80cbcfefeb.png?generation=1793818578160378&alt=media`,
  adoptMe: `${GCS}46a0905d1a4ddd9a8032adf340798dfbd3f18336.png?generation=1793818578186029&alt=media`,
  stealABrainrot: `${GCS}2a6dc99ad1de878e515ee1c18e1eecebcae345a9.png?generation=1793818578166005&alt=media`,
  murderMystery2: `${GCS}a84b12003e63b39ac899ef88cebbf7fc68312095.png?generation=1793818578162762&alt=media`,
  itemThumb: `${GCS}24f3fccc477eeef895bb6a93e210a25307cb229a.png?generation=1793818578163230&alt=media`,
  chart: `${GCS}aeb62534882f09e0348b4cbbdd5ba6269a537dbd.png?generation=1793818578167867&alt=media`,
  // generic 465px artwork backdrop (same asset as the top-up shop pages)
  artwork: `${GCS}3dc1f3acb06f6d5646426b81fc717fa1c1d29d77.png?generation=1793727745913594&alt=media`,
};

export const ROBLOX_PRICE_PAGE = {
  title: "Roblox items price history",
  subtitle: "See how a Roblox items price changes over time and find the lowest current price.",
  gameLabel: "Game",
  games: [
    { label: "Adopt Me", img: `${GCS}46a0905d1a4ddd9a8032adf340798dfbd3f18336.png?generation=1793818578186029&alt=media` },
    { label: "Steal a Brainrot", img: `${GCS}2a6dc99ad1de878e515ee1c18e1eecebcae345a9.png?generation=1793818578166005&alt=media`, active: true },
    { label: "Murder Mystery 2", img: `${GCS}a84b12003e63b39ac899ef88cebbf7fc68312095.png?generation=1793818578162762&alt=media` },
  ],
  dropdowns: [
    { label: "Brainrot", value: "Garama and Madundung" },
    { label: "Mutations", value: "" }, // nothing selected in the capture
  ],
  price: {
    game: "Steal a Brainrot",
    item: "Garama and Madundung",
    lowest: "0.60",
    change: "2.17%", // green up per the capture
    high: "0.55",
    low: "0.04",
    chartLabel: "90 days daily price",
  },
  seo: {
    title: "Garama and Madundung for Sale",
    paragraphs: [
      "On Eldorado.gg Brainrot Shop you can always find Garama and Madundung for sale. Garama and Madundung is available with various mutations depending on your budget and how much M/s you want to generate with the brainrot. Eldorado.gg allows you to conveniently check Garama and Madundung price, value and exist count that is available for sale in Steal a Brainrot. All sales of Garama and Madundung on Eldorado come with free warranty and 24/7 customer support, so you can rest easily, knowing that you will receive your brainrot fast and safely from a legit seller.",
    ],
  },
};
