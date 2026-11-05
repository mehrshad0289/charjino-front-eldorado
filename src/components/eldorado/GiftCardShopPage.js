import { connection } from "next/server";
import { notFound } from "next/navigation";
import HeaderBar from "./HeaderBar";
import CategoryNav from "./CategoryNav";
import GiftCardBanner from "./GiftCardBanner";
import GiftCardBuyFlow from "./GiftCardBuyFlow";
import GiftCardReviews from "./GiftCardReviews";
import GiftCardProcessSteps from "./GiftCardProcessSteps";
import GiftCardFaq from "./GiftCardFaq";
import GiftCardTrustCard from "./GiftCardTrustCard";
import GiftCardSeoText from "./GiftCardSeoText";
import Footer from "./Footer";
import ChatBubble from "./ChatBubble";
import { GIFT_CARD_IMAGES } from "./data/giftCardData";
import { GIFT_SHOP_CHROME, GIFT_SHOP_FAQ } from "./data/giftShopCopy";
import RecordRecentView from "./RecordRecentView";
import { giftShopHref, giftShopSeo, loadGiftCardShop, normalizeGiftPlatform } from "../../lib/gift-card-shop";

export default async function GiftCardShopPage({ platform }) {
  await connection();
  const id = normalizeGiftPlatform(platform || "");
  if (!id) notFound();
  const catalog = await loadGiftCardShop(id);
  if (!catalog.gameName || (catalog.amounts.length === 0 && catalog.regions.length === 0)) {
    notFound();
  }
  const href = giftShopHref(id);
  const seo = giftShopSeo(catalog.gameName);

  return (
    <>
      <HeaderBar />
      <CategoryNav activeCategory="Gift cards" />
      <RecordRecentView
        product={{ title: catalog.gameName, thumbnail: catalog.bannerIcon, category: { slug: "gift-card" } }}
        href={href}
      />
      <main className="relative">
        <div
          className="absolute inset-x-0 top-0 z-0 hidden h-[465px] overflow-hidden md:block"
          aria-hidden="true"
        >
          <img
            alt=""
            src={GIFT_CARD_IMAGES.heroBackdrop}
            className="block h-[465px] w-full object-cover"
            style={{ objectPosition: "50% 15%" }}
          />
          <div className="absolute inset-x-0 bottom-0 z-[2] h-[340px] bg-gradient-to-b from-transparent to-page" />
        </div>
        <div className="relative z-10">
          <GiftCardBanner
            active="Gift cards"
            iconAlt={catalog.gameName}
            gameName={catalog.gameName}
            gameIcon={catalog.bannerIcon || GIFT_CARD_IMAGES.bannerLogo}
            tabs={[{ key: "Gift cards", href }]}
          />
          <div className="pt-6 lg:pt-8">
            <div className="mx-auto w-full max-w-[1208px] px-4 lg:px-6">
              <GiftCardBuyFlow regions={catalog.regions} amounts={catalog.amounts} />
            </div>
            <div className="mx-auto mt-10 flex w-full max-w-[1208px] flex-col gap-10 px-4 lg:mt-16 lg:gap-[128px] lg:px-6">
              <GiftCardReviews />
              <GiftCardProcessSteps />
            </div>
            <div className="mx-auto mt-12 w-full max-w-3xl px-4 lg:mt-0 lg:px-3.5">
              <GiftCardFaq items={GIFT_SHOP_FAQ} title={GIFT_SHOP_CHROME.faqTitle} />
              <GiftCardTrustCard
                title={GIFT_SHOP_CHROME.trustTitle}
                subtitle={GIFT_SHOP_CHROME.trustSubtitle}
                rows={GIFT_SHOP_CHROME.trustRows}
              />
            </div>
            <GiftCardSeoText title={seo.title} orders={null} blocks={seo.blocks} />
          </div>
        </div>
      </main>
      <Footer />
      <ChatBubble />
    </>
  );
}
