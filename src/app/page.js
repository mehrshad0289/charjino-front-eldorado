import CategoryNav from "../components/eldorado/CategoryNav";
import Hero from "../components/eldorado/Hero";
import PopularCards from "../components/eldorado/PopularCards";
import RobloxBanner from "../components/eldorado/RobloxBanner";
import HowBuyingWorks from "../components/eldorado/HowBuyingWorks";
import RobloxCurrencies from "../components/eldorado/RobloxCurrencies";
import PopularGames from "../components/eldorado/PopularGames";
import ChatBubble from "../components/eldorado/ChatBubble";
import TradingSection from "../components/eldorado/TradingSection";
import GuaranteeCards from "../components/eldorado/GuaranteeCards";
import Footer from "../components/eldorado/Footer";
import { getCatalogHome, mapCurrencyCards, mapPopularCards, mapPopularGames } from "../lib/catalog-home";

export const instant = false;

export default async function Home() {
  const home = await getCatalogHome();
  const catalog = home.ok ? home.data : {};
  const popularCards = mapPopularCards(catalog);
  const popularGames = mapPopularGames(catalog);
  const currency = mapCurrencyCards(catalog);
  const popularTitle = typeof catalog.popularTitle === "string" ? catalog.popularTitle.trim() : "";

  return (
    <>
      <CategoryNav />
      <main className="relative">
        <Hero />
        <div className="relative z-10">
          <PopularCards items={popularCards} title={popularTitle} />
          <RobloxBanner />
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
