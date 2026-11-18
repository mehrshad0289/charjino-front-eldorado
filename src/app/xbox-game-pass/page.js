import { connection } from "next/server";
import CategoryNav from "../../components/eldorado/CategoryNav";
import GiftCardBanner from "../../components/eldorado/GiftCardBanner";
import SubscriptionBuyFlow from "../../components/eldorado/SubscriptionBuyFlow";
import GiftCardProcessSteps from "../../components/eldorado/GiftCardProcessSteps";
import GiftCardFaq from "../../components/eldorado/GiftCardFaq";
import GiftCardTrustCard from "../../components/eldorado/GiftCardTrustCard";
import GiftCardSeoText from "../../components/eldorado/GiftCardSeoText";
import Footer from "../../components/eldorado/Footer";
import ChatBubble from "../../components/eldorado/ChatBubble";
import RecordRecentView from "../../components/eldorado/RecordRecentView";
import { GAME_PASS_FAQ, GAME_PASS_SEO } from "../../components/eldorado/data/gamePassData";
import { GIFT_SHOP_CHROME } from "../../components/eldorado/data/giftShopCopy";
import { FA } from "../../components/eldorado/data/faCopy";
import {
  activeHubTabKey,
  bannerTabsFromHub,
  giftBrandPageMeta,
  giftBrandPageSeo,
  loadGiftBrandPage,
  loadGiftCardShop,
  loadProductHub,
} from "../../lib/gift-card-shop";
import { skuIdFromQuery } from "../../lib/sku-query";
import { buildMetadata } from "@/lib/seo";
import JsonLd from "../../components/seo/json-ld";
import { collectionPageJsonLd, howToJsonLd } from "../../lib/json-ld";

export const instant = false;

export async function generateMetadata() {
  await connection();
  const shop = await loadGiftCardShop("xbox-game-pass");
  const brandPage = await loadGiftBrandPage("xbox-game-pass");
  const name = shop.bannerName || shop.gameName || "Xbox Game Pass";
  const fallback = {
    title: `خرید ${name} | شارژینو`,
    description: `خرید ${name} با تومان؛ ریجن و مدت اشتراک از کاتالوگ.`,
  };
  const meta = giftBrandPageMeta(brandPage, fallback);
  return buildMetadata({
    title: meta.title || fallback.title,
    description: meta.description || fallback.description,
    path: "/xbox-game-pass",
  });
}

export default async function XboxGamePassPage({ searchParams }) {
  await connection();
  const query = searchParams ? await searchParams : {};
  const catalog = await loadGiftCardShop("xbox-game-pass");
  const hub = await loadProductHub("xbox");
  const brandPage = await loadGiftBrandPage("xbox-game-pass");
  const name = catalog.bannerName || catalog.gameName || "Xbox Game Pass";
  const seo = giftBrandPageSeo(brandPage, `خرید ${name}`) || GAME_PASS_SEO;
  const tabs = bannerTabsFromHub(hub);
  const activeTab = activeHubTabKey(tabs, "/xbox-game-pass", "game-pass");

  return (
    <>
      <JsonLd data={collectionPageJsonLd({ name: `خرید ${name}`, path: "/xbox-game-pass" })} />
      <JsonLd data={howToJsonLd({ name: GIFT_SHOP_CHROME.processTitle, steps: GIFT_SHOP_CHROME.processSteps })} />
      <CategoryNav activeCategory="Gift cards" />
      <RecordRecentView
        product={{
          title: name,
          thumbnail: catalog.bannerIcon,
          category: { slug: "gift-card" },
        }}
        href="/xbox-game-pass"
      />
      <main className="relative">
        <div className="relative z-10 ">
          <GiftCardBanner
            active={activeTab}
            iconAlt={name}
            gameName={name}
            gameIcon={catalog.bannerIcon}
            tabs={tabs}
          />
          <div className="mt-6 lg:mt-8">
            <div className="mx-auto w-full max-w-[1208px] px-4 lg:px-6">
              <SubscriptionBuyFlow
                regions={catalog.regions}
                amounts={catalog.amounts}
                offerTitle={FA.gamePass}
                productIcon={catalog.bannerIcon}
                initialSkuId={skuIdFromQuery(query.sku)}
              />
            </div>
            <div className="mx-auto mt-12 flex w-full max-w-[1208px] flex-col gap-10 px-4 lg:mt-12 lg:gap-[128px] lg:px-6">
              <GiftCardProcessSteps
                title={GIFT_SHOP_CHROME.processTitle}
                steps={GIFT_SHOP_CHROME.processSteps}
              />
            </div>
            <div className="mx-auto mt-12 w-full max-w-3xl px-4 lg:mt-[128px] lg:px-3.5">
              <GiftCardFaq items={GAME_PASS_FAQ} title={GIFT_SHOP_CHROME.faqTitle} />
              <GiftCardTrustCard
                title={GIFT_SHOP_CHROME.trustTitle}
                subtitle={GIFT_SHOP_CHROME.trustSubtitle}
                rows={GIFT_SHOP_CHROME.trustRows}
              />
            </div>
            <GiftCardSeoText title={seo.title} blocks={seo.blocks} orders={seo.orders} />
          </div>
        </div>
      </main>
      <Footer />
      <ChatBubble />
    </>
  );
}
