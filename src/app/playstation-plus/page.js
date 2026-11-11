import { connection } from "next/server";
import HeaderBar from "../../components/eldorado/HeaderBar";
import CategoryNav from "../../components/eldorado/CategoryNav";
import GiftCardBanner from "../../components/eldorado/GiftCardBanner";
import SubscriptionBuyFlow from "../../components/eldorado/SubscriptionBuyFlow";
import GiftCardReviews from "../../components/eldorado/GiftCardReviews";
import GiftCardProcessSteps from "../../components/eldorado/GiftCardProcessSteps";
import GiftCardFaq from "../../components/eldorado/GiftCardFaq";
import GiftCardTrustCard from "../../components/eldorado/GiftCardTrustCard";
import GiftCardSeoText from "../../components/eldorado/GiftCardSeoText";
import Footer from "../../components/eldorado/Footer";
import ChatBubble from "../../components/eldorado/ChatBubble";
import RecordRecentView from "../../components/eldorado/RecordRecentView";
import {
  GIFT_SHOP_CHROME,
  psPlusFaq,
  psPlusSeo,
} from "../../components/eldorado/data/giftShopCopy";
import { FA } from "../../components/eldorado/data/faCopy";
import {
  SHOP_SUBSCRIPTION_IMAGES,
  PS_PLUS_BANNER,
} from "../../components/eldorado/data/shopSubscriptionData";
import {
  activeHubTabKey,
  bannerTabsFromHub,
  giftBrandPageMeta,
  giftBrandPageSeo,
  loadGiftBrandPage,
  loadGiftCardShop,
  loadProductHub,
} from "../../lib/gift-card-shop";

export const instant = false;

export async function generateMetadata() {
  await connection();
  const shop = await loadGiftCardShop("playstation-plus");
  const brandPage = await loadGiftBrandPage("playstation-plus");
  const name = shop.bannerName || shop.gameName || "پلی‌استیشن پلاس";
  const fallback = {
    title: `خرید ${name} | شارژینو`,
    description: `خرید ${name} با تومان؛ ریجن و مدت اشتراک از کاتالوگ، تحویل کد بعد از پرداخت.`,
  };
  const meta = giftBrandPageMeta(brandPage, fallback);
  return {
    title: meta.title || fallback.title,
    description: meta.description || fallback.description,
  };
}

export default async function PlayStationPlusPage() {
  await connection();
  const catalog = await loadGiftCardShop("playstation-plus");
  const gifts = catalog.gameName ? null : await loadGiftCardShop("playstation");
  const brandPage = await loadGiftBrandPage("playstation-plus");
  const hub = await loadProductHub("playstation");
  const name = catalog.bannerName || catalog.gameName || "پلی‌استیشن پلاس";
  const icon = catalog.bannerIcon || gifts?.bannerIcon || PS_PLUS_BANNER.icon;
  const seo = giftBrandPageSeo(brandPage, `خرید ${name}`) || psPlusSeo();
  const tabs = bannerTabsFromHub(hub);
  const activeTab = activeHubTabKey(tabs, "/playstation-plus", "subscription");

  return (
    <>
      <HeaderBar />
      <CategoryNav activeCategory="Gift cards" />
      <RecordRecentView
        product={{
          title: name,
          thumbnail: icon,
          category: { slug: "gift-card" },
        }}
        href="/playstation-plus"
      />
      <main className="relative">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 z-0 h-[465px] w-full overflow-hidden">
          <div
            className="-bottom-px absolute inset-x-0 z-[2] h-[340px]"
            style={{ backgroundImage: "linear-gradient(rgba(246, 246, 246, 0) 0%, rgb(246, 246, 246) 100%)" }}
          />
          <img
            alt=""
            src={SHOP_SUBSCRIPTION_IMAGES.artwork}
            className="block h-[465px] w-full object-cover align-middle"
            style={{ objectPosition: "50% 15%" }}
          />
        </div>
        <div className="relative z-10 ">
          <GiftCardBanner
            active={activeTab}
            iconAlt={name}
            gameName={PS_PLUS_BANNER.gameName}
            gameIcon={icon}
            tabs={tabs}
          />
          <div className="mt-6 lg:mt-8">
            <div className="mx-auto w-full max-w-[1208px] px-4 lg:px-6">
              <SubscriptionBuyFlow
                regions={catalog.regions}
                amounts={catalog.amounts}
                offerTitle={FA.subscription}
                productIcon={icon}
              />
            </div>
            <div className="mx-auto mt-12 flex w-full max-w-[1208px] flex-col gap-10 px-4 lg:mt-12 lg:gap-[128px] lg:px-6">
              <GiftCardReviews title={GIFT_SHOP_CHROME.reviewsTitle} />
              <GiftCardProcessSteps
                title={GIFT_SHOP_CHROME.processTitle}
                steps={GIFT_SHOP_CHROME.processSteps}
              />
            </div>
            <div className="mx-auto mt-12 w-full max-w-3xl px-4 lg:mt-[128px] lg:px-3.5">
              <GiftCardFaq items={psPlusFaq()} title={GIFT_SHOP_CHROME.faqTitle} />
              <GiftCardTrustCard
                title={GIFT_SHOP_CHROME.trustTitle}
                subtitle={GIFT_SHOP_CHROME.trustSubtitle}
                rows={GIFT_SHOP_CHROME.trustRows}
              />
            </div>
            <GiftCardSeoText title={seo.title} blocks={seo.blocks} />
          </div>
        </div>
      </main>
      <Footer />
      <ChatBubble />
    </>
  );
}
