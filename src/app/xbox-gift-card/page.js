import HeaderBar from "../../components/eldorado/HeaderBar";
import CategoryNav from "../../components/eldorado/CategoryNav";
import GiftCardBanner from "../../components/eldorado/GiftCardBanner";
import GiftCardRegionStep from "../../components/eldorado/GiftCardRegionStep";
import GiftCardAmountGrid from "../../components/eldorado/GiftCardAmountGrid";
import GiftCardOfferCard from "../../components/eldorado/GiftCardOfferCard";
import GiftCardReviews from "../../components/eldorado/GiftCardReviews";
import GiftCardProcessSteps from "../../components/eldorado/GiftCardProcessSteps";
import GiftCardFaq from "../../components/eldorado/GiftCardFaq";
import GiftCardTrustCard from "../../components/eldorado/GiftCardTrustCard";
import GiftCardSeoText from "../../components/eldorado/GiftCardSeoText";
import Footer from "../../components/eldorado/Footer";
import ChatBubble from "../../components/eldorado/ChatBubble";
import { GIFT_CARD_IMAGES } from "../../components/eldorado/data/giftCardData";

/* Xbox gift card shop page (shop-giftcard .make capture + live
   eldorado.gg/xbox-gift-card/v/103 @390): Xbox banner strip, step 1 region
   select, step 2 amount grid with offer sidebar, reviews, process steps,
   FAQ, trust card and SEO copy. The 465px artwork backdrop is desktop-only
   per the live mobile reference. */

export const metadata = {
  title: "Buy Xbox Gift Card Digital Codes - Eldorado",
  description:
    "Buy Xbox gift cards cheap and gain instant access to the expansive world of Microsoft/Xbox games, subscriptions, DLCs, passes and other content. Instant delivery from verified sellers.",
};

export default function XboxGiftCardPage() {
  return (
    <>
      <HeaderBar />
      <CategoryNav activeCategory="Gift cards" />
      <main className="relative">
        {/* artwork backdrop fading into the page background (desktop only,
            live mobile reference @390 has no backdrop) */}
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
          <GiftCardBanner />
          <div className="pt-6 md:pt-8">
            {/* steps + offer sidebar */}
            <div className="mx-auto w-full max-w-[1208px] px-4 md:px-6">
              <div className="flex flex-col gap-6 md:mb-8 md:flex-row md:gap-9">
                <div className="min-w-0 grow">
                  <GiftCardRegionStep />
                  <GiftCardAmountGrid />
                </div>
                <aside className="shrink-0 md:basis-[400px]">
                  <GiftCardOfferCard />
                </aside>
              </div>
            </div>
            {/* social proof + process */}
            <div className="mx-auto mt-10 flex w-full max-w-[1208px] flex-col gap-10 px-4 md:mt-16 md:gap-[128px] md:px-6">
              <GiftCardReviews />
              <GiftCardProcessSteps />
            </div>
            {/* FAQ + trust card (capture keeps both in a max-w-3xl column) */}
            <div className="mx-auto mt-12 w-full max-w-3xl px-4 md:mt-0 md:px-3.5">
              <GiftCardFaq />
              <GiftCardTrustCard />
            </div>
            <GiftCardSeoText />
          </div>
        </div>
      </main>
      <Footer />
      <ChatBubble />
    </>
  );
}
