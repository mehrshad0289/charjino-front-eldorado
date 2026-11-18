import CategoryNav from "../components/eldorado/CategoryNav";
import Hero from "../components/eldorado/Hero";
import PopularCards from "../components/eldorado/PopularCards";
import RecentlyViewed from "../components/eldorado/RecentlyViewed";
import HowBuyingWorks from "../components/eldorado/HowBuyingWorks";
import RobloxCurrencies from "../components/eldorado/RobloxCurrencies";
import PopularGames from "../components/eldorado/PopularGames";
import ChatBubble from "../components/eldorado/ChatBubble";
import TradingSection from "../components/eldorado/TradingSection";
import GuaranteeCards from "../components/eldorado/GuaranteeCards";
import Footer from "../components/eldorado/Footer";
import { getCatalogHome, mapCurrencyCards, mapPopularCards, mapPopularGames } from "../lib/catalog-home";
import { loadRecentlyViewed } from "../lib/recently-viewed";
import JsonLd from "../components/seo/json-ld";
import { howToJsonLd } from "../lib/json-ld";
import { HOW_BUYING_STEPS } from "../components/eldorado/HowBuyingWorks";

export const instant = false;

export default async function Home() {
  const [home, recentlyViewed] = await Promise.all([getCatalogHome(), loadRecentlyViewed()]);
  const catalog = home.ok ? home.data : {};
  const popularCards = mapPopularCards(catalog);
  const popularGames = mapPopularGames(catalog);
  const currency = mapCurrencyCards(catalog);
  const popularTitle = typeof catalog.popularTitle === "string" ? catalog.popularTitle.trim() : "";

  return (
    <>
      <JsonLd data={howToJsonLd({ name: "خرید مطمئن از شارژینو", steps: HOW_BUYING_STEPS })} />
      <CategoryNav />
      <main className="relative">
        <Hero />
        <div className="relative z-10">
          <PopularCards items={popularCards} title={popularTitle} />
          <RecentlyViewed items={recentlyViewed} />
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
