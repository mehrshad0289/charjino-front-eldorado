import HeaderBar from "../../components/eldorado/HeaderBar";
import CategoryNav from "../../components/eldorado/CategoryNav";
import GiftCardBanner from "../../components/eldorado/GiftCardBanner";
import GamePassRegionChips from "../../components/eldorado/GamePassRegionChips";
import GamePassAmountGrid from "../../components/eldorado/GamePassAmountGrid";
import GamePassFeaturedOffer from "../../components/eldorado/GamePassFeaturedOffer";
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
  GAME_PASS_DISCLAIMER,
  GAME_PASS_FAQ,
  GAME_PASS_SEO,
} from "../../components/eldorado/data/gamePassData";

/* Xbox Game Pass shop page (shop-giftcart-gamepass-xbox .make capture +
   live eldorado.gg/xbox-game-pass/t/103?attribute_value_id=
   xbox-ultimate-1-month @390/1536/1920): Xbox banner strip (Game Pass tab
   active), Game region chips, Amount variant grid, Popular featured offer +
   seller card, Other sellers rows with pagination, reviews, process steps,
   FAQ, trust card and SEO copy.
   Reuses the gift card page's shared components (banner, reviews, process,
   FAQ, trust, SEO, header/footer). The live page has NO artwork backdrop
   and NO quantity picker (probed 2026-11-04) — both capture-only elements
   were dropped; live is the design authority. */

function Disclaimer({ className }) {
  return (
    <p aria-label="Prices disclaimer" className={`text-[14px] leading-[19.6px] text-graytext ${className ?? ""}`}>
      {GAME_PASS_DISCLAIMER}
    </p>
  );
}

export const metadata = {
  title: "Buy Xbox Game Passes Cheap - Eldorado",
  description:
    "Buy Xbox Game Pass cheap on Eldorado and play an ever-changing list of titles, each fully available to download and play solo or with friends. Instant delivery from verified sellers, with Xbox Essential, Premium and Ultimate subscriptions for 1 to 12 months.",
};

export default function XboxGamePassPage() {
  return (
    <>
      <HeaderBar />
      <CategoryNav activeCategory="Gift cards" />
      <main className="relative">
        <div className="relative z-10 pt-6 lg:pt-8">
          <GiftCardBanner active="Game Pass" iconAlt="xbox game pass" />
          <div className="mt-6 lg:mt-8">
            {/* steps + offers: stacked white flow on mobile, two columns from lg
                (sidebar measured 400px on the live page, switch at 1024) */}
            <div className="mx-auto w-full max-w-[1208px] px-4 lg:px-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:gap-6">
                {/* mobile: the white steps column is full-bleed (live @390:
                    cards span the viewport, inner padding 16px); lg restores
                    the 1208 container inset */}
                <div className="flex min-w-0 grow flex-col -mx-4 lg:mx-0">
                  <GamePassRegionChips />
                  <GamePassAmountGrid />
                  {/* desktop: disclaimer closes the white steps card (capture) */}
                  <div className="hidden rounded-b-lg bg-white px-6 pb-5 lg:block">
                    <Disclaimer />
                  </div>
                  {/* mobile: the white flow ends with the featured card; the
                      disclaimer renders on the page background (live @390) */}
                  <div className="lg:hidden">
                    <GamePassFeaturedOffer />
                  </div>
                </div>
                {/* desktop sidebar: featured offer + seller card */}
                <aside className="hidden w-full shrink-0 basis-[400px] flex-col gap-6 lg:flex">
                  <GamePassFeaturedOffer />
                  <GamePassSellerCard />
                </aside>
              </div>
              {/* mobile: page-background disclaimer + seller card + other
                  sellers below the white flow (live @390 shows the Seller
                  heading on the page background) */}
              <div className="mt-6 flex flex-col gap-6 lg:hidden">
                <Disclaimer />
                <div>
                  <div className="mb-3 text-[16px] font-bold leading-[24px]">Seller</div>
                  <GamePassSellerCard />
                </div>
                <GamePassOffers />
              </div>
              {/* desktop: other sellers full width below the two columns */}
              <div className="mt-10 hidden lg:block">
                <GamePassOffers />
              </div>
            </div>
            {/* social proof + process (capture: 48px above reviews, 128px gap) */}
            <div className="mx-auto mt-12 flex w-full max-w-[1208px] flex-col gap-10 px-4 lg:mt-12 lg:gap-[128px] lg:px-6">
              <GiftCardReviews />
              <GiftCardProcessSteps />
            </div>
            {/* FAQ + trust card (capture keeps both in a max-w-3xl column) */}
            <div className="mx-auto mt-12 w-full max-w-3xl px-4 lg:mt-[128px] lg:px-3.5">
              <GiftCardFaq items={GAME_PASS_FAQ} />
              <GiftCardTrustCard />
            </div>
            <GiftCardSeoText title={GAME_PASS_SEO.title} orders={GAME_PASS_SEO.orders} blocks={GAME_PASS_SEO.blocks} />
          </div>
        </div>
      </main>
      <Footer />
      <ChatBubble />
    </>
  );
}
