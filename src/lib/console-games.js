export const CONSOLE_PLATFORMS = [
  {
    key: "playstation",
    title: "پلی‌استیشن",
    text: "دیسک PS4 و PS5، اکانت و راک را کاربر می‌فروشد. گیفت و پلاس را شارژینو می‌فروشد.",
    sell: true,
    services: [
      { title: "گیفت PSN", text: "کد شارژ، شارژینو", href: "/gift-card/playstation", supplier: "شارژینو" },
      { title: "پلی‌استیشن پلاس", text: "اشتراک رسمی", href: "/playstation-plus", supplier: "شارژینو" },
    ],
  },
  {
    key: "xbox",
    title: "ایکس‌باکس",
    text: "دیسک One و Series X، اکانت و راک. Series S دیسک اجرا نمی‌کند. گیفت و گیم‌پس با شارژینو.",
    sell: true,
    services: [
      { title: "گیفت ایکس‌باکس", text: "کد شارژ، شارژینو", href: "/gift-card/xbox", supplier: "شارژینو" },
      { title: "گیم‌پس", text: "اشتراک رسمی", href: "/xbox-game-pass", supplier: "شارژینو" },
    ],
  },
  {
    key: "nintendo",
    title: "نینتندو",
    text: "کارتریج Switch و Switch 2 را کاربر می‌فروشد. گیفت eShop را شارژینو می‌فروشد.",
    sell: true,
    services: [
      { title: "گیفت eShop", text: "کد شارژ، شارژینو", href: "/gift-card/nintendo", supplier: "شارژینو" },
    ],
  },
  {
    key: "pc",
    title: "PC",
    text: "گیفت والت استیم و کلید بازی را شارژینو می‌فروشد. کلیدها با جستجوی اسم بازی پیدا می‌شوند.",
    sell: false,
    services: [
      { title: "گیفت والت استیم", text: "اعتبار کیف استیم", href: "/shop/currency", supplier: "شارژینو" },
      { title: "کلید بازی", text: "جستجوی اسم بازی در هدر", href: "/shop/currency", supplier: "شارژینو" },
    ],
  },
];

export const CONSOLE_FORMATS = {
  playstation: [
    { value: "disc", label: "دیسک" },
    { value: "account", label: "اکانت" },
    { value: "rack", label: "راک" },
  ],
  xbox: [
    { value: "disc", label: "دیسک" },
    { value: "account", label: "اکانت" },
    { value: "rack", label: "راک" },
  ],
  nintendo: [{ value: "cartridge", label: "کارتریج" }],
};

export const CONSOLE_MODELS = {
  "playstation:disc": [
    { value: "ps4", label: "PS4" },
    { value: "ps5", label: "PS5 دیسک‌خور" },
  ],
  "playstation:account": [
    { value: "ps4", label: "PS4" },
    { value: "ps5", label: "PS5" },
  ],
  "playstation:rack": [
    { value: "ps4", label: "PS4" },
    { value: "ps5", label: "PS5" },
  ],
  "xbox:disc": [
    { value: "xbox-one", label: "Xbox One دیسک‌خور" },
    { value: "xbox-series-x", label: "Series X" },
  ],
  "xbox:account": [
    { value: "xbox-one", label: "Xbox One" },
    { value: "xbox-series", label: "Series" },
    { value: "xbox-series-s", label: "Series S" },
    { value: "xbox-series-x", label: "Series X" },
  ],
  "xbox:rack": [
    { value: "xbox-one", label: "Xbox One" },
    { value: "xbox-series", label: "Series" },
    { value: "xbox-series-s", label: "Series S" },
    { value: "xbox-series-x", label: "Series X" },
  ],
  "nintendo:cartridge": [
    { value: "switch", label: "Switch" },
    { value: "switch-2", label: "Switch 2" },
  ],
};

export function consolePlatform(key) {
  return CONSOLE_PLATFORMS.find((row) => row.key === key) || null;
}

export function consoleFormatLabel(value) {
  const labels = { disc: "دیسک", cartridge: "کارتریج", account: "اکانت", rack: "راک" };
  return labels[value] || value || "";
}

export function consoleModelLabel(value) {
  const labels = {
    ps4: "PS4",
    ps5: "PS5",
    "xbox-one": "Xbox One",
    "xbox-series": "Xbox Series",
    "xbox-series-s": "Xbox Series S",
    "xbox-series-x": "Xbox Series X",
    switch: "Switch",
    "switch-2": "Switch 2",
  };
  return labels[value] || value || "";
}
