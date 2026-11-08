const LABELS = {
  global: "جهانی",
  worldwide: "جهانی",
  ww: "جهانی",
  cis: "سی‌آی‌اس",
  ru: "روسیه",
  russia: "روسیه",
  us: "آمریکا",
  usa: "آمریکا",
  na: "آمریکای شمالی",
  "north america": "آمریکای شمالی",
  "united states": "آمریکا",
  ir: "ایران",
  iran: "ایران",
  kz: "قزاقستان",
  uk: "انگلیس",
  gb: "انگلیس",
  "united kingdom": "انگلیس",
  eu: "اروپا",
  europe: "اروپا",
  tr: "ترکیه",
  turkey: "ترکیه",
  try: "ترکیه",
  de: "آلمان",
  germany: "آلمان",
  fr: "فرانسه",
  it: "ایتالیا",
  es: "اسپانیا",
  ae: "امارات",
  uae: "امارات",
  sa: "عربستان",
  ksa: "عربستان",
  kw: "کویت",
  qa: "قطر",
  bh: "بحرین",
  om: "عمان",
  in: "هند",
  india: "هند",
  br: "برزیل",
  ar: "آرژانتین",
  cl: "شیلی",
  mx: "مکزیک",
  ca: "کانادا",
  canada: "کانادا",
  au: "استرالیا",
  nz: "نیوزیلند",
  jp: "ژاپن",
  kr: "کره",
  tw: "تایوان",
  hk: "هنگ‌کنگ",
  sg: "سنگاپور",
  my: "مالزی",
  th: "تایلند",
  vn: "ویتنام",
  ph: "فیلیپین",
  id: "اندونزی",
  pl: "لهستان",
  nl: "هلند",
  se: "سوئد",
  no: "نروژ",
  dk: "دانمارک",
  fi: "فنلاند",
  at: "اتریش",
  ch: "سوئیس",
  be: "بلژیک",
  ie: "ایرلند",
  pt: "پرتغال",
  gr: "یونان",
  cz: "چک",
  ro: "رومانی",
  hu: "مجارستان",
  ua: "اوکراین",
  latam: "آمریکای لاتین",
  mena: "خاورمیانه",
  sea: "آسیای جنوب‌شرقی",
};

export function catalogRegionLabel(value) {
  const raw = typeof value === "string" ? value.trim() : "";
  if (!raw) return "";
  if (/[\u0600-\u06FF]/.test(raw)) return raw;
  return LABELS[raw.toLowerCase()] ?? raw;
}

export function preferFaTitle(record) {
  const rec = record && typeof record === "object" ? record : {};
  const fa = typeof rec.title === "string" ? rec.title.trim() : "";
  const en = typeof rec.titleEn === "string" ? rec.titleEn.trim() : typeof rec.nameEn === "string" ? rec.nameEn.trim() : "";
  if (/[\u0600-\u06FF]/.test(fa)) return fa;
  if (/[\u0600-\u06FF]/.test(en)) return en;
  return fa || en;
}
