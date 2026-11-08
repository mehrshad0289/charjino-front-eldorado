import { notFound } from "next/navigation";
import DynamicShopPage from "../../../components/eldorado/DynamicShopPage";
import {
  hubCardsFromCategory,
  isStoreCategoryKey,
  loadCatalogGroupCards,
  loadMarketGameCards,
  loadStoreCategory,
} from "../../../lib/store-engine";

export const instant = false;

export default async function ShopCategoryPage({ params }) {
  const { category } = await params;
  const key = String(category || "").toLowerCase();
  if (!isStoreCategoryKey(key)) notFound();
  const row = await loadStoreCategory(key);
  if (!row) notFound();
  const hubCards = hubCardsFromCategory(row);
  const catalogCards =
    hubCards.length > 0
      ? []
      : row.catalogGroupSlug
        ? await loadCatalogGroupCards(row.catalogGroupSlug, { gift: key === "gift-cards" })
        : [];
  const marketCards = row.marketOffer ? await loadMarketGameCards(row.marketOffer, key) : [];
  const items = [...hubCards, ...catalogCards, ...marketCards];
  return (
    <DynamicShopPage
      activeCategory={row.navKey || row.label}
      title={row.label}
      items={items}
    />
  );
}
