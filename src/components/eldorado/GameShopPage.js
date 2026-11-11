import HeaderBar from "./HeaderBar";
import CategoryNav from "./CategoryNav";
import GiftCardBanner from "./GiftCardBanner";
import GamePassRegionChips from "./GamePassRegionChips";
import ShopAmountCards from "./ShopAmountCards";
import ShopFeaturedOffer from "./ShopFeaturedOffer";
import GamePassSellerCard from "./GamePassSellerCard";
import GamePassOffers from "./GamePassOffers";
import GiftCardReviews from "./GiftCardReviews";
import GiftCardProcessSteps from "./GiftCardProcessSteps";
import GiftCardFaq from "./GiftCardFaq";
import GiftCardTrustCard from "./GiftCardTrustCard";
import GiftCardSeoText from "./GiftCardSeoText";
import Footer from "./Footer";
import ChatBubble from "./ChatBubble";
import { GAME_DISCLAIMER } from "./data/gamePagesData";
import { SHOP_SUBSCRIPTION_IMAGES, SHOP_GENERIC_FAQ } from "./data/shopSubscriptionData";

/* Generic game shop page — session 26. The capture-built cod-points shop
   anatomy, parameterized: these routes existed only as live-site links
   inside SearchOverlay/related content (no captures), and the user asked
   for every linked page to exist. Same component tree, per-game config
   from gamePagesData.js (documented there: seller pool is
   capture-verbatim, amounts follow official store tiers where public). */

export default function GameShopPage({ game }) {
  const { banner, regionLabel, regions, defaultRegion, variants, defaultVariant, featured, others, seo } = game;
  return (
    <>
      <HeaderBar />
      <CategoryNav activeCategory={game.category} />
      <main className="relative">
        <div aria-hidden="true" className="absolute left-0 top-0 z-0 h-[465px] w-full overflow-hidden">
          <div
            className="-bottom-px absolute left-0 z-[2] h-[340px] w-full"
            style={{ backgroundImage: "linear-gradient(rgba(246, 246, 246, 0) 0%, rgb(246, 246, 246) 100%)" }}
          />
          <img
            alt="banner background image"
            src={SHOP_SUBSCRIPTION_IMAGES.artwork}
            className="block h-[465px] w-full object-cover align-middle"
            style={{ objectPosition: "50% 15%" }}
          />
        </div>
        <div className="relative z-10 ">
          <GiftCardBanner
            active={banner.active}
            iconAlt={banner.iconAlt}
            gameName={banner.gameName}
            tabs={banner.tabs}
          />
          <div className="mt-6 lg:mt-8">
            <div className="mx-auto w-full max-w-[1208px] px-4 lg:px-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:gap-6">
                <div className="-mx-4 min-w-0 grow lg:mx-0">
                  {regions ? (
                    <GamePassRegionChips
                      label={regionLabel}
                      hint=""
                      regions={regions}
                      defaultRegion={defaultRegion}
                      scrollMobile
                    />
                  ) : null}
                  <ShopAmountCards variants={variants} defaultSelected={defaultVariant} />
                  <div className={`rounded-b-lg bg-white px-4 pb-5 lg:px-6 ${regions ? "" : "rounded-t-lg"}`}>
                    <p aria-label="Prices disclaimer" className="text-[14px] leading-[19.6px] text-graytext">
                      {GAME_DISCLAIMER}
                    </p>
                  </div>
                </div>
                <aside className="hidden w-full shrink-0 basis-[400px] flex-col gap-6 lg:flex">
                  <ShopFeaturedOffer
                    deliveryTime={featured.deliveryTime}
                    stock={featured.stock}
                    total={featured.total}
                  />
                  <GamePassSellerCard seller={featured.seller} />
                </aside>
              </div>
              <div className="mt-6 flex flex-col gap-6 lg:hidden">
                <ShopFeaturedOffer
                  deliveryTime={featured.deliveryTime}
                  stock={featured.stock}
                  total={featured.total}
                />
                <div>
                  <div className="mb-3 text-[16px] font-bold leading-[24px]">Seller</div>
                  <GamePassSellerCard seller={featured.seller} />
                </div>
                <GamePassOffers sellers={others.rows} count={others.count} pages={others.pages} />
              </div>
              <div className="mt-10 hidden lg:block">
                <GamePassOffers sellers={others.rows} count={others.count} pages={others.pages} />
              </div>
            </div>
            <div className="mx-auto mt-12 flex w-full max-w-[1208px] flex-col gap-10 px-4 lg:mt-12 lg:gap-[128px] lg:px-6">
              <GiftCardReviews />
              <GiftCardProcessSteps />
            </div>
            <div className="mx-auto mt-12 w-full max-w-3xl px-4 lg:mt-[128px] lg:px-3.5">
              <GiftCardFaq items={SHOP_GENERIC_FAQ} />
              <GiftCardTrustCard />
            </div>
            <GiftCardSeoText title={seo.title} orders={seo.orders} blocks={seo.blocks} />
          </div>
        </div>
      </main>
      <Footer />
      <ChatBubble />
    </>
  );
}
