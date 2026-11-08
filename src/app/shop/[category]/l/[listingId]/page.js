import { notFound } from "next/navigation";
import DynamicShopPage from "../../../../../components/eldorado/DynamicShopPage";
import { formatTomanPrice } from "../../../../../lib/format-toman";
import { isStoreCategoryKey, loadMarketListing, loadStoreCategory } from "../../../../../lib/store-engine";

export const instant = false;

export default async function ShopListingPage({ params }) {
  const { category, listingId } = await params;
  const key = String(category || "").toLowerCase();
  if (!isStoreCategoryKey(key)) notFound();
  const store = await loadStoreCategory(key);
  const listing = await loadMarketListing(listingId);
  if (!store || !listing) notFound();
  const price = Number(listing.price_amount ?? listing.price);
  const items = [
    {
      key: String(listing.id),
      name: listing.title || listing.game_name || store.label,
      tag: Number.isFinite(price) && price > 0 ? formatTomanPrice(price) : store.label,
      img: listing.cover || "",
      href: `/shop/${key}/l/${encodeURIComponent(String(listing.id))}`,
    },
  ];
  return (
    <DynamicShopPage
      activeCategory={store.navKey || store.label}
      title={listing.title || store.label}
      items={items}
    />
  );
}
