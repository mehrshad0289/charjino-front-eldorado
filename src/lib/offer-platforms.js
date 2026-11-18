export const OFFER_PLATFORM_KEY = "offer_platform";

export const OFFER_PLATFORM_GROUPS = [
  { label: "موبایل", options: ["موبایل", "Android", "iOS"] },
  { label: "کامپیوتر", options: ["کامپیوتر", "PC"] },
  {
    label: "کنسول",
    options: ["کنسول", "PlayStation 4", "PlayStation 5", "PS4 و PS5", "Xbox", "Nintendo Switch"],
  },
];

export function defaultOfferPlatforms() {
  return {
    key: OFFER_PLATFORM_KEY,
    label_fa: "پلتفرم",
    required: false,
    options: OFFER_PLATFORM_GROUPS.flatMap((group) => group.options),
    groups: OFFER_PLATFORM_GROUPS,
  };
}

export function offerPlatformPayload(raw) {
  if (raw && Array.isArray(raw.options)) return raw;
  return defaultOfferPlatforms();
}

export function offerPlatformSelectOptions(payload) {
  const groups = payload?.groups?.length ? payload.groups : OFFER_PLATFORM_GROUPS;
  const options = [{ value: "", label: "انتخاب کن" }];
  for (const group of groups) {
    for (const option of group.options || []) {
      options.push({ value: option, label: option, group: group.label });
    }
  }
  return options;
}
