import HeaderBar from "../../components/eldorado/HeaderBar";
import CategoryNav from "../../components/eldorado/CategoryNav";
import GiftCardBanner from "../../components/eldorado/GiftCardBanner";
import ShopAmountCards from "../../components/eldorado/ShopAmountCards";
import ShopFeaturedOffer from "../../components/eldorado/ShopFeaturedOffer";
import GamePassSellerCard from "../../components/eldorado/GamePassSellerCard";
import GamePassOffers from "../../components/eldorado/GamePassOffers";
import GiftCardReviews from "../../components/eldorado/GiftCardReviews";
import GiftCardProcessSteps from "../../components/eldorado/GiftCardProcessSteps";
import GiftCardFaq from "../../components/eldorado/GiftCardFaq";
import GiftCardTrustCard from "../../components/eldorado/GiftCardTrustCard";
import GiftCardSeoText from "../../components/eldorado/GiftCardSeoText";
import Footer from "../../components/eldorado/Footer";
import ChatBubble from "../../components/eldorado/ChatBubble";
import {
  SHOP_SUBSCRIPTION_IMAGES,
  SHOP_DISCLAIMER,
  SHOP_GENERIC_FAQ,
  PRIME_BANNER,
  PRIME_VARIANTS,
  PRIME_DEFAULT_VARIANT,
  PRIME_FEATURED_OFFER,
  PRIME_OTHER_SELLERS,
  PRIME_OTHER_SELLERS_COUNT,
  PRIME_OTHER_SELLERS_PAGES,
  PRIME_SEO,
} from "../../components/eldorado/data/shopSubscriptionData";

/* Amazon Prime Video top-up shop page (session 24; the user-pushed
   shop-Subscription capture — primevideo-1920px-light-{1,2}.tsx — + live
   probes @390/1920 2026-11-05): dark banner strip (Amazon icon + name,
   Subscription tab active), the 465px banner artwork + 340px fade behind
   the steps section (BOTH capture and live render it on this page family,
   unlike the gamepass page where live dropped it), Amount card (2 variants,
   4-col grid @1920, 142px scroller below lg per live @390), sidebar featured
   offer (Popular chip, Game region Global row, no stepper below lg) +
   seller card, Other sellers (13) with arrows+dropdown pagination (no
   numbered buttons in the capture), then the shared reviews / process /
   FAQ / trust / SEO bands. */

function Disclaimer({ className }) {
  return (
    <p aria-label="Prices disclaimer" className={`text-[14px] leading-[19.6px] text-graytext ${className ?? ""}`}>
      {SHOP_DISCLAIMER}
    </p>
  );
}

export const metadata = {
  title: "Buy Amazon Prime Subscription Cheap | Amazon Subscription from $1.27 for Prime Video - 1 Month",
  description:
    "Top up your Amazon Prime Video balance at Eldorado.gg and start streaming your favorite movies and series in seconds. No long-term subscriptions, just fast and flexible access from verified sellers.",
};

export default function AmazonPrimePage() {
  return (
    <>
      <HeaderBar />
      <CategoryNav activeCategory="Top ups" />
      <main className="relative">
        {/* banner artwork + fade (capture AND live @390 render it) */}
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
            active={PRIME_BANNER.active}
            iconAlt={PRIME_BANNER.iconAlt}
            gameName={PRIME_BANNER.gameName}
            gameIcon={PRIME_BANNER.icon}
            tabs={PRIME_BANNER.tabs}
          />
          <div className="mt-6 lg:mt-8">
            <div className="mx-auto w-full max-w-[1208px] px-4 lg:px-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:gap-6">
                {/* left column: Amount card (standalone rounded card per the
                    capture; full-bleed on mobile per live @390) */}
                <div className="-mx-4 min-w-0 grow lg:mx-0">
                  <ShopAmountCards variants={PRIME_VARIANTS} defaultSelected={PRIME_DEFAULT_VARIANT} />
                  {/* mobile: disclaimer on the page background (live @390
                      pattern; the desktop capture has none in the columns) */}
                  <div className="px-4 py-4 lg:hidden">
                    <Disclaimer />
                  </div>
                </div>
                {/* desktop sidebar: featured offer + seller card */}
                <aside className="hidden w-full shrink-0 basis-[400px] flex-col gap-6 lg:flex">
                  <ShopFeaturedOffer
                    regionRow={PRIME_FEATURED_OFFER.regionRow}
                    deliveryTime={PRIME_FEATURED_OFFER.deliveryTime}
                    stock={PRIME_FEATURED_OFFER.stock}
                    total={PRIME_FEATURED_OFFER.total}
                  />
                  <GamePassSellerCard seller={PRIME_FEATURED_OFFER.seller} />
                </aside>
              </div>
              {/* mobile: featured offer + seller card below the amount card
                  (live @390 DOM order: amount -> featured rows -> seller) */}
              <div className="mt-4 flex flex-col gap-6 lg:hidden">
                <ShopFeaturedOffer
                  regionRow={PRIME_FEATURED_OFFER.regionRow}
                  deliveryTime={PRIME_FEATURED_OFFER.deliveryTime}
                  stock={PRIME_FEATURED_OFFER.stock}
                  total={PRIME_FEATURED_OFFER.total}
                />
                <div>
                  <div className="mb-3 text-[16px] font-bold leading-[24px]">Seller</div>
                  <GamePassSellerCard seller={PRIME_FEATURED_OFFER.seller} />
                </div>
                <GamePassOffers
                  sellers={PRIME_OTHER_SELLERS}
                  count={PRIME_OTHER_SELLERS_COUNT}
                  pages={PRIME_OTHER_SELLERS_PAGES}
                />
              </div>
              {/* desktop: other sellers full width below the two columns */}
              <div className="mt-10 hidden lg:block">
                <GamePassOffers
                  sellers={PRIME_OTHER_SELLERS}
                  count={PRIME_OTHER_SELLERS_COUNT}
                  pages={PRIME_OTHER_SELLERS_PAGES}
                />
              </div>
            </div>
            {/* social proof + process (gamepass geometry: 48px above reviews,
                128px gap) */}
            <div className="mx-auto mt-12 flex w-full max-w-[1208px] flex-col gap-10 px-4 lg:mt-12 lg:gap-[128px] lg:px-6">
              <GiftCardReviews />
              <GiftCardProcessSteps />
            </div>
            {/* FAQ + trust card (max-w-3xl column, gamepass pattern) */}
            <div className="mx-auto mt-12 w-full max-w-3xl px-4 lg:mt-[128px] lg:px-3.5">
              <GiftCardFaq items={SHOP_GENERIC_FAQ} />
              <GiftCardTrustCard />
            </div>
            <GiftCardSeoText title={PRIME_SEO.title} orders={PRIME_SEO.orders} blocks={PRIME_SEO.blocks} />
          </div>
        </div>
      </main>
      <Footer />
      <ChatBubble />
    </>
  );
}
