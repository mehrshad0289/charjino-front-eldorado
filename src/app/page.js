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

export default function Home() {
  return (
    <>
      <HeaderBar />
      <CategoryNav />
      <main className="relative">
        <Hero />
        <div className="relative z-10">
          <PopularCards />
          <RobloxBanner />
          <RecentlyViewed />
          <HowBuyingWorks />
          <RobloxCurrencies />
          <PopularGames />
          <TradingSection />
          <GuaranteeCards />
        </div>
      </main>
      <Footer />
      <ChatBubble />
    </>
  );
}
