import { connection } from "next/server";
import { notFound, redirect } from "next/navigation";
import CategoryNav from "./CategoryNav";
import GiftCardBanner from "./GiftCardBanner";
import GiftCardBuyFlow from "./GiftCardBuyFlow";
import GiftCardProcessSteps from "./GiftCardProcessSteps";
import GiftCardFaq from "./GiftCardFaq";
import GiftCardTrustCard from "./GiftCardTrustCard";
import GiftCardSeoText from "./GiftCardSeoText";
import Footer from "./Footer";
import ChatBubble from "./ChatBubble";
import { GIFT_CARD_IMAGES } from "./data/giftCardData";
import {
  GIFT_SHOP_CHROME,
  giftShopFaq,
  giftShopSeo,
  telegramShopFaq,
  telegramShopSeo,
} from "./data/giftShopCopy";
import RecordRecentView from "./RecordRecentView";
import JsonLd from "../seo/json-ld";
import { collectionPageJsonLd, faqFromShopItems, faqPageJsonLd, howToJsonLd } from "../../lib/json-ld";
import {
  activeHubTabKey,
  bannerTabsFromHub,
  giftBrandPageSeo,
  giftHubPlatform,
  isPlayStationPlusPlatform,
  isTelegramShopId,
  isXboxGamePassPlatform,
  loadGiftBrandPage,
  loadGiftCardShop,
  loadProductHub,
  normalizeGiftPlatform,
  telegramShopHref,
} from "../../lib/gift-card-shop";
import { PS_PLUS_BANNER } from "./data/shopSubscriptionData";

export default async function GiftCardShopPage({ platform, initialSkuId = null }) {
  await connection();
  const id = normalizeGiftPlatform(platform || "");
  if (!id) notFound();
  const telegramHref = telegramShopHref(id);
  if (telegramHref) redirect(telegramHref);
  if (isPlayStationPlusPlatform(id)) redirect("/playstation-plus");
  if (isXboxGamePassPlatform(id)) redirect("/xbox-game-pass");
  const [catalog, plus, brandPage, hub] = await Promise.all([
    loadGiftCardShop(id),
    id === "playstation" ? loadGiftCardShop("playstation-plus") : Promise.resolve(null),
    loadGiftBrandPage(id),
    loadProductHub(giftHubPlatform(id) || id),
  ]);
  if (!catalog.gameName && !plus?.gameName) notFound();
  const href = `/gift-card/${id}`;
  let name = catalog.bannerName || catalog.gameName || plus?.bannerName || plus?.gameName;
  if (id === "playstation" && (!catalog.gameName || /plus|پلاس/i.test(name))) {
    name = PS_PLUS_BANNER.gameName;
  }
  if (!name) notFound();
  const telegram = isTelegramShopId(id);
  const seo =
    giftBrandPageSeo(brandPage, `خرید ${name}`) ||
    (telegram ? telegramShopSeo(name, catalog.heroProduct?.description) : giftShopSeo(name));
  const faqItems = telegram ? telegramShopFaq() : giftShopFaq(name);
  const tabs = bannerTabsFromHub(hub);
  const activeTab = activeHubTabKey(tabs, href);

  return (
    <>
      <JsonLd data={collectionPageJsonLd({ name: `خرید ${name}`, path: href })} />
      <JsonLd data={faqPageJsonLd(faqFromShopItems(faqItems))} />
      <JsonLd data={howToJsonLd({ name: GIFT_SHOP_CHROME.processTitle, steps: GIFT_SHOP_CHROME.processSteps })} />
      <CategoryNav activeCategory="Gift cards" />
      <RecordRecentView
        product={{
          title: name,
          thumbnail: catalog.bannerIcon || plus?.bannerIcon,
          category: { slug: "gift-card" },
        }}
        href={href}
        price={Array.isArray(catalog.amounts) ? catalog.amounts.find((row) => row?.from)?.from || "" : ""}
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
            active={activeTab}
            iconAlt={name}
            gameName={name}
            gameIcon={catalog.bannerIcon || plus?.bannerIcon || GIFT_CARD_IMAGES.bannerLogo}
            tabs={tabs}
          />
          <div className="pt-6 lg:pt-8">
            <div className="mx-auto w-full max-w-[1208px] px-4 lg:px-6">
              <GiftCardBuyFlow
                regions={catalog.regions}
                amounts={catalog.amounts}
                productIcon={catalog.bannerIcon || plus?.bannerIcon || ""}
                buyerFieldsByHandle={catalog?.buyerFieldsByHandle || {}}
                initialSkuId={initialSkuId}
              />
            </div>
            <div className="mx-auto mt-10 flex w-full max-w-[1208px] flex-col gap-10 px-4 lg:mt-16 lg:gap-[128px] lg:px-6">
              <GiftCardProcessSteps
                title={GIFT_SHOP_CHROME.processTitle}
                steps={GIFT_SHOP_CHROME.processSteps}
              />
            </div>
            <div className="mx-auto mt-12 w-full max-w-3xl px-4 lg:mt-0 lg:px-3.5">
              <GiftCardFaq items={faqItems} title={GIFT_SHOP_CHROME.faqTitle} />
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
