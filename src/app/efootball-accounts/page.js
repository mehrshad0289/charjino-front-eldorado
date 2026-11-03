import HeaderBar from "../../components/eldorado/HeaderBar";
import CategoryNav from "../../components/eldorado/CategoryNav";
import GameBanner from "../../components/eldorado/GameBanner";
import AccountsToolbar from "../../components/eldorado/AccountsToolbar";
import AccountOffersGrid from "../../components/eldorado/AccountOffersGrid";
import AccountsPagination from "../../components/eldorado/AccountsPagination";
import ShopSeoText from "../../components/eldorado/ShopSeoText";
import Footer from "../../components/eldorado/Footer";
import ChatBubble from "../../components/eldorado/ChatBubble";

/* The capture's own GCS mirror for this artwork serves WRONG content (dark
   fantasy orb, same failure documented for the home banner) — using the
   first-party asset the live page renders in this exact slot instead. */
const BANNER_IMG =
  "https://assetsdelivery.eldorado.gg/v7/_assets_/miscellaneous/v8/4-percent-city-banner-desktop.png";

export const metadata = {
  title: "eFootball Accounts For Sale - Eldorado",
  description:
    "Buy eFootball accounts with high collective strength, delivered instantly with full access. Compare offers from verified sellers.",
};

export default function EFootballAccountsPage() {
  return (
    <>
      <HeaderBar />
      <CategoryNav activeCategory="Accounts" />
      <main className="relative">
        {/* game artwork backdrop, fading into the page background */}
        <div className="absolute inset-x-0 top-0 z-0 h-[465px] overflow-hidden" aria-hidden="true">
          <img
            alt=""
            src={BANNER_IMG}
            className="block h-[465px] w-full object-cover"
            style={{ objectPosition: "50% 15%" }}
          />
          <div className="absolute inset-x-0 bottom-0 z-[2] h-[340px] bg-gradient-to-b from-transparent to-page" />
        </div>
        <div className="relative z-10">
          <GameBanner />
          <AccountsToolbar resultCount={4953} />
          <AccountOffersGrid />
          <div className="mx-auto w-full max-w-[1208px] px-6">
            <AccountsPagination />
            <ShopSeoText />
          </div>
        </div>
      </main>
      <Footer />
      <ChatBubble />
    </>
  );
}
