import { notFound, redirect } from "next/navigation";
import GiftCardShopPage from "../../../../components/eldorado/GiftCardShopPage";
import DynamicShopPage from "../../../../components/eldorado/DynamicShopPage";
import HeaderBar from "../../../../components/eldorado/HeaderBar";
import CategoryNav from "../../../../components/eldorado/CategoryNav";
import GiftCardBanner from "../../../../components/eldorado/GiftCardBanner";
import SubscriptionBuyFlow from "../../../../components/eldorado/SubscriptionBuyFlow";
import Footer from "../../../../components/eldorado/Footer";
import ChatBubble from "../../../../components/eldorado/ChatBubble";
import { FA } from "../../../../components/eldorado/data/faCopy";
import {
  bannerTabsFromHub,
  giftHubPlatform,
  isPlayStationPlusPlatform,
  isXboxGamePassPlatform,
  loadGiftCardShop,
  loadProductHub,
  normalizeGiftPlatform,
} from "../../../../lib/gift-card-shop";
import {
  isStoreCategoryKey,
  listingToOffer,
  loadMarketListings,
  loadStoreCategory,
  resolveMarketGame,
} from "../../../../lib/store-engine";

export const instant = false;

export default async function ShopHubPage({ params }) {
  const { category, hub } = await params;
  const key = String(category || "").toLowerCase();
  const hubKey = normalizeGiftPlatform(hub) || decodeURIComponent(String(hub || ""));
  if (!isStoreCategoryKey(key) || !hubKey) notFound();
  if (isPlayStationPlusPlatform(hubKey)) redirect("/playstation-plus");
  if (isXboxGamePassPlatform(hubKey)) redirect("/xbox-game-pass");

  const store = await loadStoreCategory(key);
  if (!store) notFound();

  const catalogHub = await loadProductHub(giftHubPlatform(hubKey) || hubKey);
  const tab = Array.isArray(catalogHub?.tabs)
    ? catalogHub.tabs.find((row) => row.sourceId === hubKey) || catalogHub.tabs[0]
    : null;
  if (tab?.renderer === "code-card") {
    return <GiftCardShopPage platform={hubKey} />;
  }
  if (tab?.renderer === "subscription" || tab?.renderer === "unit-price") {
    const sourceId = tab.sourceId || hubKey;
    const catalog = await loadGiftCardShop(sourceId, { giftDelivery: tab.deliveryMode || "standard" });
    const tabs = bannerTabsFromHub(catalogHub);
    return (
      <>
        <HeaderBar />
        <CategoryNav activeCategory={store.navKey || store.label} />
        <main className="relative py-8">
          <GiftCardBanner
            active={tab.tabKey}
            gameName={catalog.bannerName || catalog.gameName || catalogHub.title}
            gameIcon={catalog.bannerIcon}
            tabs={tabs}
          />
          <div className="mx-auto mt-8 max-w-[1208px] px-4 lg:px-6">
            <SubscriptionBuyFlow
              regions={catalog.regions}
              amounts={catalog.amounts}
              offerTitle={tab.label || FA.subscription}
              productIcon={catalog.bannerIcon}
            />
          </div>
        </main>
        <Footer />
        <ChatBubble />
      </>
    );
  }

  const game = await resolveMarketGame(key, hubKey);
  const gameName = game?.game_name || hubKey;
  const listings = await loadMarketListings(gameName);
  const offers = listings.items.map((row) => listingToOffer(row, key)).filter(Boolean);
  return (
    <DynamicShopPage
      activeCategory={store.navKey || store.label}
      title={game?.game_name_fa || game?.game_name || store.label}
      offers={offers}
    />
  );
}
