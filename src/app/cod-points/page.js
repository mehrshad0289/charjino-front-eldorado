import HeaderBar from "../../components/eldorado/HeaderBar";
import CategoryNav from "../../components/eldorado/CategoryNav";
import GiftCardBanner from "../../components/eldorado/GiftCardBanner";
import GamePassRegionChips from "../../components/eldorado/GamePassRegionChips";
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
  COD_BANNER,
  COD_PLATFORMS,
  COD_DEFAULT_PLATFORM,
  COD_VARIANTS,
  COD_DEFAULT_VARIANT,
  COD_FEATURED_OFFER,
  COD_OTHER_SELLERS,
  COD_OTHER_SELLERS_COUNT,
  COD_OTHER_SELLERS_PAGES,
  COD_SEO,
} from "../../components/eldorado/data/shopSubscriptionData";

/* Call of Duty Points top-up shop page (session 24; the user-pushed
   shop-CoD-Points capture — codpoints-1920px-light-{1,2}.tsx — + live
   probes @390 2026-11-05): dark banner strip (Call of Duty icon + name,
   CoD Points tab active over Accounts/Items/Boosting), the 465px banner
   artwork + fade, then the two-column flow: LEFT white steps card =
   "Game platform" chips (Xbox active, no "Your region" hint) + Amount card
   (10 variants, 2400 selected w/ Popular tab chip, 4-col grid @1920),
   disclaimer; RIGHT sidebar = featured offer (no region row, stepper
   desktop-only) + seller card (PowerXhub); Other sellers (8) full width
   with numbered pagination + Go-to-page dropdown; then the shared reviews /
   process / FAQ / trust / SEO bands. */

function Disclaimer({ className }) {
  return (
    <p aria-label="Prices disclaimer" className={`text-[14px] leading-[19.6px] text-graytext ${className ?? ""}`}>
      {SHOP_DISCLAIMER}
    </p>
  );
}

export const metadata = {
  title: "Buy CoD Points Cheap | Call of Duty Points from $5.41 for 2400 CP - Xbox",
  description:
    "Buy CoD Points cheap on Eldorado — Call of Duty Points for Warzone, Black Ops 7 and MW3 from verified sellers. Operator packs, bundles and Battle Pass tiers with fast delivery and buyer protection.",
};

export default function CodPointsPage() {
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
        <div className="relative z-10 pt-6 lg:pt-8">
          <GiftCardBanner
            active={COD_BANNER.active}
            iconAlt={COD_BANNER.iconAlt}
            gameName={COD_BANNER.gameName}
            gameIcon={COD_BANNER.icon}
            tabs={COD_BANNER.tabs}
          />
          <div className="mt-6 lg:mt-8">
            <div className="mx-auto w-full max-w-[1208px] px-4 lg:px-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:gap-6">
                {/* left column: platform chips + amount card as ONE attached
                    white flow (capture: rounded-t top card + rounded-b amount
                    card); full-bleed on mobile per live @390 */}
                <div className="-mx-4 min-w-0 grow lg:mx-0">
                  <GamePassRegionChips
                    label="Game platform"
                    hint=""
                    regions={COD_PLATFORMS}
                    defaultRegion={COD_DEFAULT_PLATFORM}
                    scrollMobile
                  />
                  <ShopAmountCards variants={COD_VARIANTS} defaultSelected={COD_DEFAULT_VARIANT} />
                  <div className="rounded-b-lg bg-white px-4 pb-5 lg:px-6">
                    <Disclaimer />
                  </div>
                </div>
                {/* desktop sidebar: featured offer + seller card */}
                <aside className="hidden w-full shrink-0 basis-[400px] flex-col gap-6 lg:flex">
                  <ShopFeaturedOffer
                    deliveryTime={COD_FEATURED_OFFER.deliveryTime}
                    stock={COD_FEATURED_OFFER.stock}
                    total={COD_FEATURED_OFFER.total}
                  />
                  <GamePassSellerCard seller={COD_FEATURED_OFFER.seller} />
                </aside>
              </div>
              {/* mobile: featured offer + seller card below the white flow
                  (live @390 DOM order: steps -> featured rows -> seller) */}
              <div className="mt-6 flex flex-col gap-6 lg:hidden">
                <ShopFeaturedOffer
                  deliveryTime={COD_FEATURED_OFFER.deliveryTime}
                  stock={COD_FEATURED_OFFER.stock}
                  total={COD_FEATURED_OFFER.total}
                />
                <div>
                  <div className="mb-3 text-[16px] font-bold leading-[24px]">Seller</div>
                  <GamePassSellerCard seller={COD_FEATURED_OFFER.seller} />
                </div>
                <GamePassOffers
                  sellers={COD_OTHER_SELLERS}
                  count={COD_OTHER_SELLERS_COUNT}
                  pages={COD_OTHER_SELLERS_PAGES}
                />
              </div>
              {/* desktop: other sellers full width below the two columns */}
              <div className="mt-10 hidden lg:block">
                <GamePassOffers
                  sellers={COD_OTHER_SELLERS}
                  count={COD_OTHER_SELLERS_COUNT}
                  pages={COD_OTHER_SELLERS_PAGES}
                />
              </div>
            </div>
            {/* social proof + process (gamepass geometry) */}
            <div className="mx-auto mt-12 flex w-full max-w-[1208px] flex-col gap-10 px-4 lg:mt-12 lg:gap-[128px] lg:px-6">
              <GiftCardReviews />
              <GiftCardProcessSteps />
            </div>
            {/* FAQ + trust card (max-w-3xl column, gamepass pattern) */}
            <div className="mx-auto mt-12 w-full max-w-3xl px-4 lg:mt-[128px] lg:px-3.5">
              <GiftCardFaq items={SHOP_GENERIC_FAQ} />
              <GiftCardTrustCard />
            </div>
            <GiftCardSeoText title={COD_SEO.title} orders={COD_SEO.orders} blocks={COD_SEO.blocks} />
          </div>
        </div>
      </main>
      <Footer />
      <ChatBubble />
    </>
  );
}
