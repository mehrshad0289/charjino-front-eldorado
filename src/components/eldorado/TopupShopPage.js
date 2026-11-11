import HeaderBar from "./HeaderBar";
import CategoryNav from "./CategoryNav";
import GiftCardBanner from "./GiftCardBanner";
import TopupBuyFlow from "./TopupBuyFlow";
import GiftCardReviews from "./GiftCardReviews";
import GiftCardProcessSteps from "./GiftCardProcessSteps";
import GiftCardFaq from "./GiftCardFaq";
import GiftCardTrustCard from "./GiftCardTrustCard";
import GiftCardSeoText from "./GiftCardSeoText";
import Footer from "./Footer";
import ChatBubble from "./ChatBubble";
import RecordRecentView from "./RecordRecentView";
import { GIFT_SHOP_CHROME, TOPUP_SHOP_CHROME, topupShopFaq, topupShopSeo } from "./data/giftShopCopy";
import { SHOP_SUBSCRIPTION_IMAGES } from "./data/shopSubscriptionData";

function hubFaq(shop, name) {
  const rows = Array.isArray(shop?.faq) ? shop.faq : [];
  const custom = rows
    .map((item) => ({
      q: String(item?.q || "").trim(),
      paragraphs: String(item?.a || "")
        .split(/\n+/)
        .map((line) => line.trim())
        .filter(Boolean),
    }))
    .filter((item) => item.q && item.paragraphs.length);
  return custom.length ? custom : topupShopFaq(name);
}

function hubSeo(shop, name) {
  const text = String(shop?.description || "").trim();
  if (!text) return topupShopSeo(name);
  const blocks = text
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((paragraph) => ({ p: paragraph }));
  return { title: `خرید شارژ ${name}`, blocks: blocks.length ? blocks : [{ p: text }] };
}

export default function TopupShopPage({ catalog, tabs = [], activeTab = "top-up", href }) {
  const name = catalog?.bannerName || catalog?.gameName || "";
  const icon = catalog?.bannerIcon || "";
  const seo = hubSeo(catalog?.shop, name);
  const faqItems = hubFaq(catalog?.shop, name);

  return (
    <>
      <HeaderBar />
      <CategoryNav activeCategory="Top ups" />
      <RecordRecentView
        product={{
          title: name,
          thumbnail: icon,
          category: { slug: "game-topup" },
        }}
        href={href}
      />
      <main className="relative">
        <div aria-hidden="true" className="absolute left-0 top-0 z-0 h-[465px] w-full overflow-hidden">
          <div
            className="-bottom-px absolute left-0 z-[2] h-[340px] w-full"
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
          <GiftCardBanner active={activeTab} iconAlt={name} gameName={name} gameIcon={icon} tabs={tabs} />
          <div className="mt-6 lg:mt-8">
            <div className="mx-auto w-full max-w-[1208px] px-4 lg:px-6">
              <TopupBuyFlow
                regions={catalog?.regions || []}
                amounts={catalog?.amounts || []}
                productIcon={icon}
                buyerFieldsByHandle={catalog?.buyerFieldsByHandle || {}}
                shop={catalog?.shop || null}
              />
            </div>
            <div className="mx-auto mt-12 flex w-full max-w-[1208px] flex-col gap-10 px-4 lg:mt-12 lg:gap-[128px] lg:px-6">
              <GiftCardReviews title={GIFT_SHOP_CHROME.reviewsTitle} />
              <GiftCardProcessSteps title={TOPUP_SHOP_CHROME.processTitle} steps={TOPUP_SHOP_CHROME.processSteps} />
            </div>
            <div className="mx-auto mt-12 w-full max-w-3xl px-4 lg:mt-[128px] lg:px-3.5">
              <GiftCardFaq items={faqItems} title={TOPUP_SHOP_CHROME.faqTitle} />
              <GiftCardTrustCard
                title={TOPUP_SHOP_CHROME.trustTitle}
                subtitle={TOPUP_SHOP_CHROME.trustSubtitle}
                rows={TOPUP_SHOP_CHROME.trustRows}
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
