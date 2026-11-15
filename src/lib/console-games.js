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

const SHIPPING_LABELS = { post: "پست", meetup: "تحویل حضوری", account: "اکانت" };
const DLC_LABELS = { none: "ندارد", unused: "استفاده نشده", used: "استفاده شده" };

export function normalizeConsoleAttributeValue(key, value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  if (key === "format") return consoleFormatLabel(raw);
  if (key === "console_model") return consoleModelLabel(raw);
  if (key === "condition") return consoleConditionLabel(raw);
  if (key === "shipping") return SHIPPING_LABELS[raw] || raw;
  if (key === "dlc") return DLC_LABELS[raw] || raw;
  return raw;
}

export function labelConsoleOffer(offer) {
  const attributes = { ...(offer?.attributes || {}) };
  for (const key of Object.keys(attributes)) {
    attributes[key] = normalizeConsoleAttributeValue(key, attributes[key]) || attributes[key];
  }
  return { ...offer, attributes };
}

export function defaultConsoleSchemaFields(platform) {
  const formatOptions =
    platform === "nintendo" ? ["کارتریج"] : platform === "pc" ? ["اکانت"] : ["دیسک", "اکانت", "راک"];
  const modelOptions =
    platform === "playstation"
      ? ["PS4", "PS5"]
      : platform === "xbox"
        ? ["Xbox One", "Xbox Series", "Xbox Series S", "Xbox Series X"]
        : platform === "nintendo"
          ? ["Switch", "Switch 2"]
          : platform === "pc"
            ? ["PC"]
            : [];
  if (!modelOptions.length) return [];
  const libraryWhen = ["اکانت", "راک"].filter((value) => formatOptions.includes(value));
  const library = libraryWhen.length
    ? [
        {
          key: "games_count",
          label_fa: "تعداد بازی‌های روی اکانت",
          type: "number",
          required: true,
          filterable: true,
          card: true,
          detail: true,
          visible_when: { key: "format", values: libraryWhen },
        },
        {
          key: "games_list",
          label_fa: "بازی‌های روی اکانت",
          type: "text",
          multiline: true,
          required: true,
          detail: true,
          visible_when: { key: "format", values: libraryWhen },
        },
      ]
    : [];
  return [
    { key: "format", label_fa: "نوع", type: "select", options: formatOptions, required: true, filterable: true, card: true, detail: true },
    ...library,
    { key: "console_model", label_fa: "کنسول", type: "select", options: modelOptions, required: true, filterable: true, card: true, detail: true },
    { key: "condition", label_fa: "وضعیت", type: "select", options: ["آکبند", "کارکرده"], required: true, filterable: true, detail: true },
    { key: "region", label_fa: "ریجن", type: "text", detail: true },
    { key: "edition", label_fa: "نسخه", type: "text", detail: true },
    { key: "dlc", label_fa: "دانلودی / DLC", type: "select", options: ["ندارد", "استفاده نشده", "استفاده شده"], detail: true },
    { key: "shipping", label_fa: "روش تحویل", type: "select", options: ["پست", "تحویل حضوری", "اکانت"], required: true, detail: true },
  ];
}

export function schemaConsoleFacets(fields, offers) {
  const rows = Array.isArray(offers) ? offers : [];
  const count = (key, value) => rows.filter((offer) => offer.attributes?.[key] === value).length;
  return (Array.isArray(fields) ? fields : [])
    .filter((field) => field?.filterable)
    .map((field) => {
      if (field.type === "number") {
        return { key: field.key, label_fa: field.label_fa, type: "number" };
      }
      if (!Array.isArray(field.options) || !field.options.length) return null;
      return {
        key: field.key,
        label_fa: field.label_fa,
        type: field.type || "select",
        options: field.options.map((value) => ({ value, count: count(field.key, value) })),
      };
    })
    .filter(Boolean);
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
