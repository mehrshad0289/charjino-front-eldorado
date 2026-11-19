import { notFound } from "next/navigation";
import DynamicShopPage from "../../../components/eldorado/DynamicShopPage";
import {
  dedupeShopGameCards,
  hubCardsFromCategory,
  isStoreCategoryKey,
  loadCatalogGroupCards,
  loadMarketGameCards,
  loadStoreCategory,
} from "../../../lib/store-engine";
import { buildMetadata, SHOP_KIND_FA } from "@/lib/seo";

export const instant = false;

export async function generateMetadata({ params }) {
  const { category } = await params;
  const key = String(category || "").toLowerCase();
  if (!isStoreCategoryKey(key)) return {};
  const row = await loadStoreCategory(key);
  const label = row?.label || SHOP_KIND_FA[key] || "فروشگاه";
  return buildMetadata({
    title: `${label} | شارژینو`,
    description: `خرید ${label} از شارژینو. آگهی‌ها و محصولات واقعی همین صفحه است.`,
    path: `/shop/${key}`,
  });
}

export default async function ShopCategoryPage({ params }) {
  const { category } = await params;
  const key = String(category || "").toLowerCase();
  if (!isStoreCategoryKey(key)) notFound();
  const row = await loadStoreCategory(key);
  if (!row) {
    if (key === "gift-cards") {
      const telegram = await loadCatalogGroupCards("telegram", { gift: true });
      const gift = await loadCatalogGroupCards("gift-card", { gift: true });
      const seen = new Set();
      const items = [];
      for (const card of [...telegram, ...gift]) {
        if (!card?.href || seen.has(card.href)) continue;
        seen.add(card.href);
        items.push(card);
      }
      return (
        <DynamicShopPage activeCategory="Gift cards" title="گیفت کارت" items={items} searchable categoryKey="gift-cards" />
      );
    }
    if (key === "top-ups") {
      const items = await loadCatalogGroupCards("game-topup");
      return <DynamicShopPage activeCategory="Top ups" title="شارژ بازی" items={items} searchable categoryKey="top-ups" />;
    }
    notFound();
  }
  const hubCards = hubCardsFromCategory(row);
  const catalogCards =
    hubCards.length > 0
      ? []
      : row.catalogGroupSlug
        ? await loadCatalogGroupCards(row.catalogGroupSlug, { gift: key === "gift-cards" })
        : [];
  const boundMarketIds = new Set();
  for (const hub of Array.isArray(row.hubs) ? row.hubs : []) {
    for (const tab of Array.isArray(hub?.tabs) ? hub.tabs : []) {
      if (String(tab?.sourceType || "") === "market_game" && tab?.sourceId != null) {
        boundMarketIds.add(String(tab.sourceId));
      }
    }
  }
  const marketCards = (row.marketOffer ? await loadMarketGameCards(row.marketOffer, key) : []).filter(
    (card) => !boundMarketIds.has(String(card.key)),
  );
  const items = dedupeShopGameCards([...hubCards, ...catalogCards, ...marketCards]);
  return (
    <DynamicShopPage
      activeCategory={row.navKey || row.label}
      title={row.label}
      items={items}
      searchable
      categoryKey={key}
    />
  );
}
