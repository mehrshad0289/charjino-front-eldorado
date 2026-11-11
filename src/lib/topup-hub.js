import { shopTopupHref } from "./format-toman";

const PREFIXES = [
  ["mobile_legends_adventure", "mobile-legends-adventure"],
  ["honkai_star_rail", "honkai-star-rail"],
  ["zenless_zone_zero", "zenless-zone-zero"],
  ["wuthering_waves", "wuthering-waves"],
  ["genshin_impact", "genshin-impact"],
  ["marvel_rivals", "marvel-rivals"],
  ["arena_breakout", "arena-breakout"],
  ["blood_strike", "blood-strike"],
  ["delta_force", "delta-force"],
  ["pubg_mobile", "pubg-mobile"],
  ["garena_free_fire", "free-fire"],
  ["call_of_duty_mobile", "cod-mobile"],
  ["codm_activision", "cod-mobile"],
  ["codm_garena", "cod-mobile"],
  ["ea_sports_fc_mobile", "ea-fc-mobile"],
  ["ea_fc_mobile", "ea-fc-mobile"],
  ["eafc_mobile", "ea-fc-mobile"],
  ["ea_sports_fc_coins", "fc-coins"],
  ["ea_sports_fc_points", "fc-points"],
  ["fifa_coins", "fc-coins"],
  ["fc_coins", "fc-coins"],
  ["fc_coin", "fc-coins"],
  ["fifa_points", "fc-points"],
  ["fc_points", "fc-points"],
  ["ea_sports_fc", "fc-points"],
  ["eafc", "fc-points"],
  ["konami_efootball", "efootball"],
  ["e_football", "efootball"],
  ["efootball", "efootball"],
  ["arknights_endfield", "arknights-endfield"],
  ["arknight_endfield", "arknights-endfield"],
  ["mobile_legends", "mobile-legends"],
  ["free_fire", "free-fire"],
  ["bigo_live", "bigo-live"],
  ["8_ball_pool", "8-ball-pool"],
];

const STRIP_TOKENS = new Set([
  "auto",
  "manual",
  "fast",
  "reserve",
  "login",
  "via",
  "cis",
  "mena",
  "latam",
  "global",
  "america",
  "americas",
  "europe",
  "asia",
  "sea",
  "ru",
  "ph",
  "id",
  "us",
  "eu",
  "br",
  "th",
  "vn",
  "tw",
  "my",
  "sg",
  "kh",
  "in",
  "sa",
  "ca",
  "kz",
  "tr",
  "bd",
  "uk",
  "kr",
  "jp",
  "cn",
  "hk",
  "mo",
  "russia",
  "brazil",
  "turkey",
  "indonesia",
  "malaysia",
  "philippines",
  "singapore",
  "thailand",
  "vietnam",
]);

const ACRONYMS = {
  pubg: "PUBG",
  cod: "CoD",
  ea: "EA",
  afk: "AFK",
  vng: "VNG",
  fc: "FC",
  nba: "NBA",
};

const SMALL_WORDS = new Set(["of", "and", "the"]);
const PROVIDER_TAIL = /\s*[-–—]\s*(activision|garena|vng|ea|epic|tencent|netease)\b.*$/i;
const PROVIDER_HEAD = /^(garena|activision|vng)\s+/i;
const REGION_TAIL =
  /\s*\((?:global|us|usa|vn|in|sg|mena|cis|ru|eu|sea|latam|reserve|united states|worldwide|asia|thailand|china|naeu|tw\/hk\/mo|[a-z]{2}(?:\/[a-z]{2}){0,3})\)\s*$/i;
const REGION_WORD = /\s+(global|asia|america|europe)\s*$/i;
const FULFILL_TAIL = /\s*[–-]\s*(auto|manual|fast)\b.*$/i;
const SKU_MARK = /\b(auto|manual|instant|uc|cp|vp|robux|diamond|diamonds|crystal|gems?|points?)\b/i;

function asString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function asRecord(value) {
  return value && typeof value === "object" ? value : {};
}

function hasPersian(value) {
  return /[\u0600-\u06FF]/.test(asString(value));
}

function normalizeToken(value) {
  return asString(value)
    .toLowerCase()
    .replace(/^giftcard:/, "")
    .replace(/[\s./-]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function prefixedHub(token) {
  const hit = PREFIXES.find(([prefix]) => token === prefix || token.startsWith(`${prefix}_`));
  return hit ? hit[1] : "";
}

export function isTopupHubKey(value) {
  const id = asString(value).toLowerCase();
  return id.length >= 2 && id.length <= 80 && /^[a-z0-9][a-z0-9._-]*$/.test(id);
}

export function topupHubKey(...candidates) {
  for (const raw of candidates) {
    const token = normalizeToken(raw);
    if (!token) continue;
    const prefixed = prefixedHub(token);
    if (prefixed) return prefixed;
    const parts = token.split("_").filter(Boolean);
    while (parts.length && STRIP_TOKENS.has(parts[parts.length - 1])) parts.pop();
    const hub = parts.join("-");
    if (isTopupHubKey(hub) && !STRIP_TOKENS.has(hub.replace(/-/g, "_"))) return hub;
  }
  return "";
}

export function canonicalTopupHrefKey(value) {
  const raw = asString(value).toLowerCase();
  if (!raw || !isTopupHubKey(raw)) return topupHubKey(value);
  const prefixed = prefixedHub(normalizeToken(raw));
  if (prefixed) return prefixed;
  if (raw.includes("_") || /-(auto|manual|fast|reserve)$/.test(raw)) return topupHubKey(raw) || raw;
  return raw;
}

export function humanizeTopupHub(value) {
  const hub = canonicalTopupHrefKey(value) || asString(value);
  if (!hub) return "";
  const parts = hub.split(/[-_]+/).filter(Boolean);
  return parts
    .map((part, index) => {
      if (ACRONYMS[part]) return ACRONYMS[part];
      if (index > 0 && SMALL_WORDS.has(part)) return part;
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(" ");
}

export function cleanTopupGameTitle(value) {
  let title = asString(value);
  if (!title) return "";
  title = title.replace(FULFILL_TAIL, "");
  title = title.replace(/\s*\((?:auto|manual|fast)[^)]*\)/gi, "");
  title = title.replace(/\b(auto|manual)\b/gi, "");
  title = title.replace(PROVIDER_HEAD, "");
  title = title.replace(PROVIDER_TAIL, "");
  title = title.replace(REGION_TAIL, "");
  title = title.replace(REGION_WORD, "");
  title = title.replace(/\s*·\s*.*$/g, "");
  return title.replace(/\s+/g, " ").trim();
}

export function isSkuLikeTopupTitle(value) {
  const title = asString(value);
  if (!title) return true;
  if (title.includes("·")) return true;
  if (title.length > 48) return true;
  if (SKU_MARK.test(title) && /\d/.test(title)) return true;
  if (/\d{3,}/.test(title)) return true;
  return false;
}

function looksLikeHubSlug(title, hubKey) {
  const titled = asString(title);
  const key = asString(hubKey).toLowerCase();
  if (!titled) return true;
  if (/\s/.test(titled) || hasPersian(titled)) return false;
  const compact = titled.toLowerCase().replace(/[\s_]+/g, "-");
  return compact === key && (titled === titled.toLowerCase() || titled.includes("-"));
}

export function topupShopHref(hubKey) {
  const id = canonicalTopupHrefKey(hubKey);
  return id ? shopTopupHref(id) : "";
}

export function topupHubKeyFromProduct(product) {
  const rec = asRecord(product);
  return topupHubKey(
    rec.platform,
    rec.handle,
    rec.fazercardsCategoryId,
    rec.fazercards_category_id,
    rec.sourceId,
  );
}

export function pickTopupDisplayName({ hubKey, hubTitle, nameEn, faTitle }) {
  const key = canonicalTopupHrefKey(hubKey) || asString(hubKey);
  const cleanedEn = cleanTopupGameTitle(nameEn);
  const titled = asString(hubTitle);
  const human = humanizeTopupHub(key);
  if (cleanedEn && !isSkuLikeTopupTitle(cleanedEn) && !hasPersian(cleanedEn) && !looksLikeHubSlug(cleanedEn, key)) {
    return cleanedEn;
  }
  if (titled && !looksLikeHubSlug(titled, key) && !hasPersian(titled) && !isSkuLikeTopupTitle(titled)) {
    return titled;
  }
  if (human) return human;
  const cleanedFa = cleanTopupGameTitle(faTitle);
  if (cleanedFa && !isSkuLikeTopupTitle(cleanedFa)) return cleanedFa;
  return titled || key;
}
