import HeaderBar from "../components/eldorado/HeaderBar";
import CategoryNav from "../components/eldorado/CategoryNav";
import Hero from "../components/eldorado/Hero";
import PopularCards from "../components/eldorado/PopularCards";
import RobloxBanner from "../components/eldorado/RobloxBanner";
import RecentlyViewed from "../components/eldorado/RecentlyViewed";
import HowBuyingWorks from "../components/eldorado/HowBuyingWorks";
import RobloxCurrencies from "../components/eldorado/RobloxCurrencies";
import PopularGames from "../components/eldorado/PopularGames";
import ChatBubble from "../components/eldorado/ChatBubble";
import TradingSection from "../components/eldorado/TradingSection";
import GuaranteeCards from "../components/eldorado/GuaranteeCards";
import Footer from "../components/eldorado/Footer";
import {
  getCatalogCategories,
  getCatalogCategoryPage,
  getCatalogHome,
  mapCurrencyCards,
  mapPopularCards,
  mapPopularGames,
} from "../lib/catalog-home";

export const instant = false;

export default async function Home() {
  const [home, categories, topup] = await Promise.all([
    getCatalogHome(),
    getCatalogCategories(),
    getCatalogCategoryPage("game-topup"),
  ]);
  const catalog = home.ok ? home.data : {};
  const popularCards = mapPopularCards(catalog);
  const popularGames = mapPopularGames(catalog, categories.data);
  const currency = mapCurrencyCards(topup.data);

  return (
    <>
      <HeaderBar />
      <CategoryNav />
      <main className="relative">
        <Hero />
        <div className="relative z-10">
          <PopularCards items={popularCards} />
          <RobloxBanner />
          {/* live eldorado.gg @390 keeps recently-viewed / currencies off the
              home stack; trading + guarantee cards use their mobile layout. */}
          <div className="hidden md:block">
            <RecentlyViewed />
          </div>
          <HowBuyingWorks />
          <div className="hidden md:block">
            <RobloxCurrencies big={currency.big} items={currency.small} />
          </div>
          <PopularGames items={popularGames} />
          <TradingSection />
          <GuaranteeCards />
        </div>
      </main>
      <Footer />
      <ChatBubble />
    </>
  );
}
