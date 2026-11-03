import HeaderBar from "../components/eldorado/HeaderBar";
import CategoryNav from "../components/eldorado/CategoryNav";
import Hero from "../components/eldorado/Hero";
import PopularCards from "../components/eldorado/PopularCards";
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
          <TradingSection />
          <GuaranteeCards />
        </div>
      </main>
      <Footer />
    </>
  );
}
