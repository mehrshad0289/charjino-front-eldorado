import HeaderBar from "../../components/eldorado/HeaderBar";
import CategoryNav from "../../components/eldorado/CategoryNav";
import GiftCardBanner from "../../components/eldorado/GiftCardBanner";
import GamePassRegionChips from "../../components/eldorado/GamePassRegionChips";
import ShopNoResults from "../../components/eldorado/ShopNoResults";
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
  PS_PLUS_BANNER,
  PS_PLUS_REGIONS,
  PS_PLUS_DEFAULT_REGION,
  PS_PLUS_EMPTY,
  PS_PLUS_SEO,
} from "../../components/eldorado/data/shopSubscriptionData";

/* PlayStation Plus subscription shop page in the captured NO-OFFERS state
   (session 24; the user-pushed shop-Nothing-found capture —
   psplus-1920px-light-{1,2}.tsx — + live probes @390 2026-11-05): dark
   banner strip (PlayStation icon + name, Subscription tab active over the
   3 tabs), the 465px banner artwork + fade, then a SINGLE white flow card:
   the Game region chip step (rounded top; Germany active, NA…Ukraine chips;
   live @390 = inline "Game region: Germany" label + one scrolling chip row)
   and the Amount card (rounded bottom, "No amount selected", empty variant
   grid + the "Nothing found" block). Disclaimer on the page background.
   Divergence documented: the LIVE page currently serves offers (featured
   offer + seller + other sellers) — the capture is the reference per
   project rules, so no offer columns render here. */

function Disclaimer({ className }) {
  return (
    <p aria-label="Prices disclaimer" className={`text-[14px] leading-[19.6px] text-graytext ${className ?? ""}`}>
      {SHOP_DISCLAIMER}
    </p>
  );
}

export const metadata = {
  title: "Buy Playstation Plus | PlayStation Subscription from $8.99 for Playstation Plus - Essential - 1 Month",
  description:
    "Buy PlayStation Plus cheap on Eldorado — PSN Membership tiers (Essential, Extra, Premium) from verified sellers with secure delivery, buyer protection and fast delivery times.",
};

export default function PlayStationPlusPage() {
  return (
    <>
      <HeaderBar />
      <CategoryNav activeCategory="Gift cards" />
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
            active={PS_PLUS_BANNER.active}
            iconAlt={PS_PLUS_BANNER.iconAlt}
            gameName={PS_PLUS_BANNER.gameName}
            gameIcon={PS_PLUS_BANNER.icon}
            tabs={PS_PLUS_BANNER.tabs}
          />
          <div className="mt-6 lg:mt-8">
            {/* single-column white flow (capture has NO sidebar content):
                region step (rounded top) + amount card with the empty grid +
                Nothing found (rounded bottom), full-bleed on mobile */}
            <div className="mx-auto w-full max-w-[1208px] px-4 lg:px-6">
              <div className="-mx-4 lg:mx-0">
                <GamePassRegionChips
                  label="Game region"
                  hint="Your region:"
                  regions={PS_PLUS_REGIONS}
                  defaultRegion={PS_PLUS_DEFAULT_REGION}
                  inlineMobile
                  scrollMobile
                />
                <div className="rounded-b-lg bg-white px-4 pb-6 pt-0 lg:px-6">
                  <div className="mb-2 flex flex-wrap items-start gap-1 pt-4 text-[16px] leading-[24px]">
                    <span className="block font-bold">Amount:</span>
                    <span className="block text-graytext">{PS_PLUS_EMPTY.amountLabel}</span>
                  </div>
                  {/* the capture's variant grid is EMPTY (no offers match) */}
                  <div className="grid gap-4 lg:grid-cols-3 xl:grid-cols-4" />
                  <ShopNoResults title={PS_PLUS_EMPTY.title} text={PS_PLUS_EMPTY.text} />
                </div>
              </div>
              <div className="py-4">
                <Disclaimer />
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
            <GiftCardSeoText title={PS_PLUS_SEO.title} orders={PS_PLUS_SEO.orders} blocks={PS_PLUS_SEO.blocks} />
          </div>
        </div>
      </main>
      <Footer />
      <ChatBubble />
    </>
  );
}
