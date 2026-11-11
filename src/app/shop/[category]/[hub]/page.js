import { notFound, redirect } from "next/navigation";
import AccountOffersBrowser from "../../../../components/eldorado/AccountOffersBrowser";
import BoostingRequest from "../../../../components/eldorado/BoostingRequest";
import AccountShopSeo from "../../../../components/eldorado/AccountShopSeo";
import GameBanner from "../../../../components/eldorado/GameBanner";
import GiftCardShopPage from "../../../../components/eldorado/GiftCardShopPage";
import DynamicShopPage from "../../../../components/eldorado/DynamicShopPage";
import HeaderBar from "../../../../components/eldorado/HeaderBar";
import CategoryNav from "../../../../components/eldorado/CategoryNav";
import GiftCardBanner from "../../../../components/eldorado/GiftCardBanner";
import SubscriptionBuyFlow from "../../../../components/eldorado/SubscriptionBuyFlow";
import TopupShopPage from "../../../../components/eldorado/TopupShopPage";
import Footer from "../../../../components/eldorado/Footer";
import ChatBubble from "../../../../components/eldorado/ChatBubble";
import { FA } from "../../../../components/eldorado/data/faCopy";
import { GIFT_CARD_IMAGES } from "../../../../components/eldorado/data/giftCardData";
import { toFaDigits } from "../../../../lib/fa-digits";
import {
  activeHubTabKey,
  bannerTabsFromHub,
  loadHubByMarketGame,
  giftHubPlatform,
  isFcFamilyHub,
  topupBannerName,
  topupTabsFromShop,
  isPlayStationPlusPlatform,
  isXboxGamePassPlatform,
  loadGiftCardShop,
  loadProductHub,
  loadTopupShop,
  normalizeGiftPlatform,
  tabForStoreCategory,
} from "../../../../lib/gift-card-shop";
import { canonicalTopupHrefKey, topupShopHref } from "../../../../lib/topup-hub";
import { serverFetch, ApiError } from "../../../../lib/server-fetcher";
import { apiPaths } from "../../../../lib/api-paths";
import {
  currencyHubKeyForMarket,
  isStoreCategoryKey,
  listingToOffer,
  loadMarketFacets,
  loadMarketListings,
  loadStoreCategory,
  resolveMarketGame,
} from "../../../../lib/store-engine";

export const instant = false;

async function loadBoostForm(gameId) {
  if (!gameId) return null;
  try {
    return await serverFetch(apiPaths.marketBoostForm(gameId));
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) return null;
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { category, hub } = await params;
  const key = String(category || "").toLowerCase();
  if (key !== "accounts") return {};
  const game = await resolveMarketGame(key, decodeURIComponent(String(hub || "")));
  const name = game?.game_name_fa || game?.game_name || "بازی";
  return {
    title: `خرید اکانت ${name} | شارژینو`,
    description: `مقایسه آگهی‌های اکانت ${name}. هر پیشنهاد عکس، مشخصات و قیمت دارد و پول تا تأیید تحویل نزد شارژینو می‌ماند.`,
  };
}

export default async function ShopHubPage({ params }) {
  const { category, hub } = await params;
  const key = String(category || "").toLowerCase();
  const rawHub = normalizeGiftPlatform(hub) || decodeURIComponent(String(hub || ""));
  const hubKey = key === "top-ups" ? canonicalTopupHrefKey(rawHub) || rawHub : rawHub;
  if (!isStoreCategoryKey(key) || !hubKey) notFound();
  if (key === "top-ups" && hubKey !== rawHub) redirect(topupShopHref(hubKey));
  if (isPlayStationPlusPlatform(hubKey)) redirect("/playstation-plus");
  if (isXboxGamePassPlatform(hubKey)) redirect("/xbox-game-pass");

  const store = await loadStoreCategory(key);
  if (!store) notFound();

  const catalogHub = await loadProductHub(giftHubPlatform(hubKey) || hubKey);
  if (key === "top-ups" && String(catalogHub?.storeCategoryKey || "").toLowerCase() === "currency") {
    redirect(`/shop/currency/${encodeURIComponent(hubKey)}`);
  }
  const tab = tabForStoreCategory(catalogHub, key);
  if (tab?.renderer === "code-card") {
    return <GiftCardShopPage platform={tab.sourceId || hubKey} />;
  }
  if (tab?.renderer === "subscription") {
    const sourceId = tab.sourceId || hubKey;
    const catalog = await loadGiftCardShop(sourceId, { giftDelivery: tab.deliveryMode || "standard" });
    const tabs = bannerTabsFromHub(catalogHub);
    const href = tab.href || `/shop/${key}/${hubKey}`;
    return (
      <>
        <HeaderBar />
        <CategoryNav activeCategory={store.navKey || store.label} />
        <main className="relative py-8">
          <GiftCardBanner
            active={activeHubTabKey(tabs, href, tab.tabKey)}
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
  if (tab?.renderer === "unit-price") {
    const sourceId = tab.sourceId || hubKey;
    const isTopup =
      key === "top-ups" ||
      tab.tabKey === "top-up" ||
      tab.fulfillmentType === "topup" ||
      tab.catalogGroupSlug === "game-topup";
    const catalog = isTopup
      ? await loadTopupShop(sourceId)
      : await loadGiftCardShop(sourceId, { giftDelivery: tab.deliveryMode || "standard" });
    if (!catalog.gameName) notFound();
    const href = tab.href || `/shop/${key}/${hubKey}`;
    const tabs = isTopup ? topupTabsFromShop(catalog.shop, bannerTabsFromHub(catalogHub), hubKey) : bannerTabsFromHub(catalogHub);
    if (isTopup) {
      catalog.bannerName = topupBannerName(catalog.shop, hubKey, catalog.bannerName);
      return (
        <TopupShopPage
          catalog={catalog}
          tabs={tabs}
          activeTab={activeHubTabKey(tabs, href, isFcFamilyHub(hubKey) || tabs.some((item) => item.key === hubKey) ? hubKey : tab.tabKey || "top-up")}
          href={href}
        />
      );
    }
    return (
      <>
        <HeaderBar />
        <CategoryNav activeCategory={store.navKey || store.label} />
        <main className="relative py-8">
          <GiftCardBanner
            active={activeHubTabKey(tabs, href, tab.tabKey || "top-up")}
            gameName={catalog.bannerName || catalog.gameName || catalogHub?.title}
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
  if (key === "top-ups") {
    const catalog = await loadTopupShop(hubKey);
    if (!catalog.gameName) notFound();
    const href = `/shop/top-ups/${hubKey}`;
    const tabs = topupTabsFromShop(catalog.shop, bannerTabsFromHub(catalogHub), hubKey);
    catalog.bannerName = topupBannerName(catalog.shop, hubKey, catalog.bannerName);
    return (
      <TopupShopPage
        catalog={catalog}
        tabs={tabs}
        activeTab={activeHubTabKey(tabs, href, isFcFamilyHub(hubKey) || tabs.some((item) => item.key === hubKey) ? hubKey : "top-up")}
        href={href}
      />
    );
  }
  if (key === "gift-cards") {
    notFound();
  }

  if (key === "currency") {
    const target = await currencyHubKeyForMarket(hubKey);
    if (target && target !== hubKey) redirect(`/shop/currency/${encodeURIComponent(target)}`);
  }

  if (key === "boosting") {
    const game = await resolveMarketGame(key, hubKey);
    const title = game?.game_name_fa || game?.game_name || store.label;
    const hub = await loadHubByMarketGame(game?.id || game?.game_name || hubKey);
    const tabs = bannerTabsFromHub(hub);
    return (
      <>
        <HeaderBar />
        <CategoryNav activeCategory={store.navKey || "Boosting"} />
        <main>
          {tabs.length > 0 ? (
            <GiftCardBanner active="boosting" iconAlt={title} gameName={title} tabs={tabs} />
          ) : (
            <GameBanner name={title} href={`/shop/boosting/${encodeURIComponent(hubKey)}`} tabLabel="بوستینگ" />
          )}
          <BoostingRequest gameId={game?.id} gameName={title} form={await loadBoostForm(game?.id)} />
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
  const facets = key === "accounts" ? await loadMarketFacets(gameName) : [];
  if (key === "accounts") {
    const title = game?.game_name_fa || game?.game_name || store.label;
    const hub = await loadHubByMarketGame(game?.id || gameName);
    const tabs = bannerTabsFromHub(hub);
    return (
      <>
        <HeaderBar />
        <CategoryNav activeCategory={store.navKey || "Accounts"} />
        <main className="relative">
          <div className="absolute inset-x-0 top-0 z-0 hidden h-[465px] overflow-hidden md:block" aria-hidden="true">
            <img alt="" src={GIFT_CARD_IMAGES.heroBackdrop} className="block h-[465px] w-full object-cover" style={{ objectPosition: "50% 15%" }} />
            <div className="absolute inset-x-0 bottom-0 z-[2] h-[340px] bg-gradient-to-b from-transparent to-page" />
          </div>
          <div className="relative z-10">
            {tabs.length > 0 ? (
              <GiftCardBanner active="accounts" iconAlt={title} gameName={title} tabs={tabs} />
            ) : (
              <GameBanner name={title} href={`/shop/${key}/${encodeURIComponent(hubKey)}`} tabLabel="اکانت" />
            )}
            <AccountOffersBrowser offers={offers} facets={facets} />
            <div className="mx-auto w-full max-w-[1208px] px-4 md:px-6">
              <AccountShopSeo gameName={title} countLabel={toFaDigits(offers.length)} />
            </div>
          </div>
        </main>
        <Footer />
        <ChatBubble />
      </>
    );
  }
  return (
    <DynamicShopPage
      activeCategory={store.navKey || store.label}
      title={game?.game_name_fa || game?.game_name || store.label}
      offers={offers}
    />
  );
}
