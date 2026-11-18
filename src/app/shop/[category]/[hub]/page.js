import { notFound, redirect } from "next/navigation";
import AccountOffersBrowser from "../../../../components/eldorado/AccountOffersBrowser";
import BoostingRequest from "../../../../components/eldorado/BoostingRequest";
import AccountShopSeo from "../../../../components/eldorado/AccountShopSeo";
import GiftCardShopPage from "../../../../components/eldorado/GiftCardShopPage";
import DynamicShopPage from "../../../../components/eldorado/DynamicShopPage";
import CategoryNav from "../../../../components/eldorado/CategoryNav";
import GiftCardBanner from "../../../../components/eldorado/GiftCardBanner";
import SubscriptionBuyFlow from "../../../../components/eldorado/SubscriptionBuyFlow";
import TopupShopPage from "../../../../components/eldorado/TopupShopPage";
import Footer from "../../../../components/eldorado/Footer";
import ChatBubble from "../../../../components/eldorado/ChatBubble";
import { FA } from "../../../../components/eldorado/data/faCopy";
import { CURRENCY_LISTING_COPY } from "../../../../components/eldorado/data/listingData";
import { GIFT_CARD_IMAGES } from "../../../../components/eldorado/data/giftCardData";
import { toFaDigits } from "../../../../lib/fa-digits";
import {
  activeHubTabKey,
  bannerTabsFromHub,
  withFallbackHubTab,
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
import { hrefWithSku, skuIdFromQuery } from "../../../../lib/sku-query";
import { serverFetch, ApiError } from "../../../../lib/server-fetcher";
import { apiPaths } from "../../../../lib/api-paths";
import {
  currencyHubKeyForMarket,
  isStoreCategoryKey,
  loadCurrencyOfferGames,
  ITEM_PRICE_PRESETS,
  catalogNumberFacets,
  itemFacetsFromOffers,
  listingToOffer,
  loadItemOfferGames,
  loadMarketFacets,
  loadMarketListings,
  loadStoreCategory,
  mergeFacetFields,
  resolveMarketGame,
} from "../../../../lib/store-engine";
import { buildMetadata, SHOP_KIND_FA } from "@/lib/seo";

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
  if (!isStoreCategoryKey(key)) return {};
  const raw = decodeURIComponent(String(hub || ""));
  const kind = SHOP_KIND_FA[key] || "";
  let name = raw;
  if (["accounts", "items", "currency", "boosting"].includes(key)) {
    const game = await resolveMarketGame(key, raw);
    name = game?.game_name_fa || game?.game_name || raw;
  }
  return buildMetadata({
    title: kind ? `خرید ${kind} ${name} | شارژینو` : `${name} | شارژینو`,
    description: kind
      ? `آگهی‌های ${kind} ${name} در شارژینو. مشخصات و قیمت همان صفحه است.`
      : `صفحه ${name} در شارژینو.`,
    path: `/shop/${key}/${encodeURIComponent(raw)}`,
  });
}

export default async function ShopHubPage({ params, searchParams }) {
  const { category, hub } = await params;
  const query = searchParams ? await searchParams : {};
  const initialSkuId = skuIdFromQuery(query.sku);
  const key = String(category || "").toLowerCase();
  const rawHub = normalizeGiftPlatform(hub) || decodeURIComponent(String(hub || ""));
  const hubKey = key === "top-ups" ? canonicalTopupHrefKey(rawHub) || rawHub : rawHub;
  if (!isStoreCategoryKey(key) || !hubKey) notFound();
  if (key === "top-ups" && hubKey !== rawHub) redirect(hrefWithSku(topupShopHref(hubKey), query.sku));
  if (isPlayStationPlusPlatform(hubKey)) redirect(hrefWithSku("/playstation-plus", query.sku));
  if (isXboxGamePassPlatform(hubKey)) redirect(hrefWithSku("/xbox-game-pass", query.sku));

  const store = await loadStoreCategory(key);
  if (!store) notFound();

  const catalogHub = await loadProductHub(giftHubPlatform(hubKey) || hubKey);
  if (key === "top-ups" && String(catalogHub?.storeCategoryKey || "").toLowerCase() === "currency") {
    redirect(`/shop/currency/${encodeURIComponent(hubKey)}`);
  }
  const tab = tabForStoreCategory(catalogHub, key);
  if (tab?.renderer === "code-card") {
    return <GiftCardShopPage platform={tab.sourceId || hubKey} initialSkuId={initialSkuId} />;
  }
  if (tab?.renderer === "subscription") {
    const sourceId = tab.sourceId || hubKey;
    const catalog = await loadGiftCardShop(sourceId, { giftDelivery: tab.deliveryMode || "standard" });
    const tabs = bannerTabsFromHub(catalogHub);
    const href = tab.href || `/shop/${key}/${hubKey}`;
    return (
      <>
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
              initialSkuId={initialSkuId}
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
          initialSkuId={initialSkuId}
        />
      );
    }
    return (
      <>
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
              initialSkuId={initialSkuId}
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
        initialSkuId={initialSkuId}
      />
    );
  }
  if (key === "gift-cards") {
    notFound();
  }

  if (key === "currency") {
    const game = await resolveMarketGame(key, hubKey);
    const setups = await loadCurrencyOfferGames();
    const setup = setups.find(
      (row) => game && (String(row.id) === String(game.id) || row.game_name === game.game_name),
    );
    if (setup) {
      const title = setup.game_name_fa || setup.game_name || store.label;
      const listings = await loadMarketListings(setup.game_name, "Currency", 60);
      const offers = listings.items.map((row) => listingToOffer(row, "currency")).filter(Boolean);
      const hubRecord = await loadHubByMarketGame(game?.id || setup.game_name, setup.game_name);
      const href = `/shop/currency/${encodeURIComponent(hubKey)}`;
      const tabs = withFallbackHubTab(bannerTabsFromHub(hubRecord), {
        key: "currency",
        label: "ارز بازی",
        href,
      });
      const facets = itemFacetsFromOffers(offers);
      return (
        <>
          <CategoryNav activeCategory={store.navKey || "Currency"} />
          <main className="relative">
            <div className="absolute inset-x-0 top-0 z-0 hidden h-[465px] overflow-hidden md:block" aria-hidden="true">
              <img alt="" src={GIFT_CARD_IMAGES.heroBackdrop} className="block h-[465px] w-full object-cover" style={{ objectPosition: "50% 15%" }} />
              <div className="absolute inset-x-0 bottom-0 z-[2] h-[340px] bg-gradient-to-b from-transparent to-page" />
            </div>
            <div className="relative z-10">
              <GiftCardBanner
                active={activeHubTabKey(tabs, href, "currency")}
                iconAlt={title}
                gameName={title}
                gameIcon=""
                tabs={tabs}
              />
              <AccountOffersBrowser
                offers={offers}
                facets={facets}
                searchPlaceholder="جستجوی ارز"
                countLabel="آگهی ارز"
                foundSuffix="پیدا شد"
                pricePresets={ITEM_PRICE_PRESETS}
              />
              <p className="mx-auto max-w-[1208px] px-4 pb-10 text-[13px] leading-[20px] text-graytext md:px-6">
                {setup.rwt_notice || CURRENCY_LISTING_COPY.rwtFallback}
              </p>
            </div>
          </main>
          <Footer />
          <ChatBubble />
        </>
      );
    }
    const target = await currencyHubKeyForMarket(hubKey);
    if (target && target !== hubKey) redirect(`/shop/currency/${encodeURIComponent(target)}`);
  }

  if (key === "boosting") {
    const game = await resolveMarketGame(key, hubKey);
    const title = game?.game_name_fa || game?.game_name || store.label;
    const hub = await loadHubByMarketGame(game?.id || game?.game_name || hubKey, game?.game_name);
    const href = `/shop/boosting/${encodeURIComponent(hubKey)}`;
    const tabs = withFallbackHubTab(bannerTabsFromHub(hub), {
      key: "boosting",
      label: "بوستینگ",
      href,
    });
    return (
      <>
        <CategoryNav activeCategory={store.navKey || "Boosting"} />
        <main>
          <GiftCardBanner
            active={activeHubTabKey(tabs, href, "boosting")}
            iconAlt={title}
            gameName={title}
            gameIcon=""
            tabs={tabs}
          />
          <BoostingRequest gameId={game?.id} gameName={title} form={await loadBoostForm(game?.id)} />
        </main>
        <Footer />
        <ChatBubble />
      </>
    );
  }

  const game = await resolveMarketGame(key, hubKey);
  const gameName = game?.game_name || hubKey;
  const listings = await loadMarketListings(gameName, key === "items" ? "CustomItem" : undefined, key === "items" ? 60 : 24);
  const offers = listings.items.map((row) => listingToOffer(row, key)).filter(Boolean);
  let facets = [];
  if (key === "accounts") {
    facets = await loadMarketFacets(gameName);
  } else if (key === "items") {
    const catalogs = await loadItemOfferGames();
    const setup = catalogs.find(
      (row) => game && (String(row.id) === String(game.id) || row.game_name === game.game_name),
    );
    facets = mergeFacetFields(itemFacetsFromOffers(offers), catalogNumberFacets(setup));
  }
  if (key === "accounts" || key === "items") {
    const title = game?.game_name_fa || game?.game_name || store.label;
    const hub = await loadHubByMarketGame(game?.id || gameName, game?.game_name || gameName);
    const href = `/shop/${key}/${encodeURIComponent(hubKey)}`;
    const tabKey = key === "items" ? "items" : "accounts";
    const tabs = withFallbackHubTab(bannerTabsFromHub(hub), {
      key: tabKey,
      label: key === "items" ? "آیتم" : "اکانت",
      href,
    });
    return (
      <>
        <CategoryNav activeCategory={store.navKey || (key === "items" ? "Items" : "Accounts")} />
        <main className="relative">
          <div className="absolute inset-x-0 top-0 z-0 hidden h-[465px] overflow-hidden md:block" aria-hidden="true">
            <img alt="" src={GIFT_CARD_IMAGES.heroBackdrop} className="block h-[465px] w-full object-cover" style={{ objectPosition: "50% 15%" }} />
            <div className="absolute inset-x-0 bottom-0 z-[2] h-[340px] bg-gradient-to-b from-transparent to-page" />
          </div>
          <div className="relative z-10">
            <GiftCardBanner
              active={activeHubTabKey(tabs, href, tabKey)}
              iconAlt={title}
              gameName={title}
              gameIcon=""
              tabs={tabs}
            />
            <AccountOffersBrowser
              offers={offers}
              facets={facets}
              searchPlaceholder={key === "items" ? "جستجوی آیتم" : "جستجوی اکانت"}
              countLabel={key === "items" ? "آیتم" : "آگهی"}
              foundSuffix={key === "items" ? "پیدا شد" : ""}
              pricePresets={key === "items" ? ITEM_PRICE_PRESETS : []}
            />
            {key === "accounts" ? (
              <div className="mx-auto w-full max-w-[1208px] px-4 md:px-6">
                <AccountShopSeo gameName={title} countLabel={toFaDigits(offers.length)} />
              </div>
            ) : null}
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
