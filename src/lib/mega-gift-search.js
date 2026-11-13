import { giftShopHrefFromProduct, isGiftCardProduct, isTopupProduct, shopTopupHrefFromProduct } from "./gift-card-shop";
import { pickTopupDisplayName, topupHubKeyFromProduct } from "./topup-hub";

export const MEGA_OTHER_VERTICALS = ["Currency", "Accounts", "Top ups", "Items", "Boosting"];

function asRecord(value) {
  return value && typeof value === "object" ? value : {};
}

function asString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function foldMegaText(value) {
  return asString(value)
    .toLowerCase()
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/ة/g, "ه")
    .replace(/[أإآ]/g, "ا");
}

function compactText(value) {
  return foldMegaText(value).replace(/[\s\u200c\-_·]+/g, "");
}

export function matchesMegaQuery(game, query) {
  const q = foldMegaText(query);
  if (!q) return true;
  const rec = asRecord(game);
  const hay = foldMegaText(
    [
      rec.name,
      rec.nameEn,
      rec.title,
      rec.title_en,
      rec.titleEn,
      rec.hubKey,
      rec.tag,
      rec.gameTitle,
      rec.gameTitleFa,
    ]
      .map(asString)
      .filter(Boolean)
      .join(" "),
  );
  if (!hay) return false;
  if (hay.includes(q)) return true;
  const compactHay = compactText(hay);
  const compactQ = compactText(q);
  return Boolean(compactQ && compactHay.includes(compactQ));
}

export function filterMegaGames(games, query) {
  return (Array.isArray(games) ? games : []).filter((game) => matchesMegaQuery(game, query));
}

export function uniqueMegaGames(rows) {
  const seen = new Set();
  const out = [];
  for (const row of Array.isArray(rows) ? rows : []) {
    const rec = asRecord(row);
    const name = asString(rec.name);
    if (!name) continue;
    const key = `${asString(rec.href)}|${name}|${asString(rec.category)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      name,
      nameEn: asString(rec.nameEn),
      img: asString(rec.img) || asString(rec.icon) || asString(rec.thumbnail),
      href: asString(rec.href),
      category: asString(rec.category),
    });
  }
  return out;
}

export function collectOtherMegaHits(query, peek, labels) {
  const rows = [];
  for (const key of MEGA_OTHER_VERTICALS) {
    const data = typeof peek === "function" ? peek(key) : null;
    const category = asString(labels?.[key]) || key;
    for (const game of filterMegaGames(data?.all, query)) {
      rows.push({
        name: game.name,
        nameEn: game.nameEn,
        img: game.img || game.icon || "",
        href: game.href || "",
        category,
      });
    }
  }
  return uniqueMegaGames(rows);
}

function categoryLabel(item, labels) {
  const rec = asRecord(item);
  const slug = asString(rec.product_type || rec.group).toLowerCase();
  const text = `${asString(rec.categoryName)} ${asString(rec.group)}`;
  if (slug === "gift-card" || slug === "gift_card") return labels.giftCards;
  if (slug === "game-topup" || slug === "call-of-duty-mobile" || slug === "free-fire") return labels.topUps;
  if (slug === "steam-wallet" || slug === "game-keys") return labels.currency;
  if (/گیفت|gift\s*-?\s*card/i.test(text)) return labels.giftCards;
  if (/شارژ|top\s*-?\s*up/i.test(text)) return labels.topUps;
  if (/ارز|currency|wallet|کلید/i.test(text)) return labels.currency;
  if (/آیتم|item/i.test(text)) return labels.items;
  if (/بوست|boost/i.test(text)) return labels.boosting;
  if (/اکانت|account/i.test(text)) return labels.accounts;
  return asString(rec.categoryName) || asString(rec.group) || labels.accounts;
}

function searchItemToGame(item, category) {
  const rec = asRecord(item);
  const giftHref = isGiftCardProduct(rec) ? giftShopHrefFromProduct(rec) : "";
  const topupHref = !giftHref && isTopupProduct(rec) ? shopTopupHrefFromProduct(rec) : "";
  const hub = topupHref ? topupHubKeyFromProduct(rec) : "";
  const name = hub
    ? pickTopupDisplayName({
        hubKey: hub,
        hubTitle: "",
        nameEn: asString(rec.titleEn) || asString(rec.title_en) || asString(rec.name_en),
        faTitle: asString(rec.title) || asString(rec.name),
      })
    : asString(rec.title) || asString(rec.name);
  return {
    name,
    nameEn: [rec.title_en, rec.titleEn, rec.name_en, rec.title, rec.name, hub].map(asString).filter(Boolean).join(" "),
    img: asString(rec.thumbnail) || asString(rec.image),
    href: giftHref || topupHref || asString(rec.href),
    category,
  };
}

export function partitionSearchItems(items, labels) {
  const gift = [];
  const other = [];
  for (const item of Array.isArray(items) ? items : []) {
    const rec = asRecord(item);
    if (asString(rec.result_type) && rec.result_type !== "product") continue;
    if (isGiftCardProduct(rec)) gift.push(searchItemToGame(rec, labels.giftCards));
    else other.push(searchItemToGame(rec, categoryLabel(rec, labels)));
  }
  return { gift: uniqueMegaGames(gift), other: uniqueMegaGames(other) };
}
