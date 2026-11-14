export const CONSOLE_PLATFORMS = [
  {
    key: "playstation",
    title: "پلی‌استیشن",
    image: "/consoles/playstation.jpg",
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
    image: "/consoles/xbox.webp",
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
    image: "/consoles/nintendo.png",
    text: "کارتریج Switch و Switch 2 را کاربر می‌فروشد. گیفت eShop را شارژینو می‌فروشد.",
    sell: true,
    services: [
      { title: "گیفت eShop", text: "کد شارژ، شارژینو", href: "/gift-card/nintendo", supplier: "شارژینو" },
    ],
  },
  {
    key: "pc",
    title: "PC",
    image: "/consoles/pc.jpg",
    text: "گیفت والت استیم و کلید بازی را شارژینو می‌فروشد. کلیدها با جستجوی اسم بازی پیدا می‌شوند.",
    sell: false,
    services: [
      { title: "گیفت والت استیم", text: "اعتبار کیف استیم", href: "/gift-card/steam", supplier: "شارژینو" },
      { title: "کلید بازی", text: "جستجوی اسم بازی", href: "/shop/games/pc", supplier: "شارژینو" },
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

const PC_KEY_ALIASES = new Set(["steam", "ea", "epic", "rockstar", "ubisoft", "battlenet", "gog"]);

export function consolePlatform(key) {
  return CONSOLE_PLATFORMS.find((row) => row.key === key) || null;
}

export function consoleShopKey(key) {
  const id = String(key || "").toLowerCase();
  if (consolePlatform(id)) return id;
  if (PC_KEY_ALIASES.has(id)) return "pc";
  return "";
}

export function consoleFormatLabel(value) {
  const labels = { disc: "دیسک", cartridge: "کارتریج", account: "اکانت", rack: "راک" };
  return labels[value] || value || "";
}

const CONDITION_LABELS = { new: "آکبند", used: "کارکرده" };

export function consoleConditionLabel(value) {
  return CONDITION_LABELS[value] || value || "";
}

export function labelConsoleOffer(offer) {
  const attributes = { ...(offer?.attributes || {}) };
  if (attributes.format) attributes.format = consoleFormatLabel(attributes.format);
  if (attributes.console_model) attributes.console_model = consoleModelLabel(attributes.console_model);
  if (attributes.condition) attributes.condition = consoleConditionLabel(attributes.condition);
  return { ...offer, attributes };
}

export function consoleOfferFacets(platform, offers) {
  const rows = Array.isArray(offers) ? offers : [];
  const count = (key, label) => rows.filter((offer) => offer.attributes?.[key] === label).length;
  const formats = CONSOLE_FORMATS[platform] || [];
  const models = [];
  const seen = new Set();
  for (const format of formats) {
    for (const model of CONSOLE_MODELS[`${platform}:${format.value}`] || []) {
      if (seen.has(model.value)) continue;
      seen.add(model.value);
      models.push(model);
    }
  }
  const fields = [];
  if (formats.length > 0) {
    fields.push({
      key: "format",
      label_fa: "نوع",
      options: formats.map((row) => ({ value: row.label, count: count("format", row.label) })),
    });
  }
  if (models.length > 0) {
    fields.push({
      key: "console_model",
      label_fa: "کنسول",
      options: models.map((row) => {
        const value = consoleModelLabel(row.value);
        return { value, count: count("console_model", value) };
      }),
    });
  }
  if (formats.length > 0) {
    fields.push({
      key: "condition",
      label_fa: "وضعیت",
      options: ["آکبند", "کارکرده"].map((value) => ({ value, count: count("condition", value) })),
    });
  }
  return fields;
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
