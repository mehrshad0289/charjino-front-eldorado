import HeaderBar from "../components/eldorado/HeaderBar";
import CategoryNav from "../components/eldorado/CategoryNav";
import Hero from "../components/eldorado/Hero";
import CategoryCards from "../components/eldorado/CategoryCards";
import TradingSection from "../components/eldorado/TradingSection";
import GuaranteeCards from "../components/eldorado/GuaranteeCards";
import Footer from "../components/eldorado/Footer";

export default function Home() {
  return (
    <>
      <HeaderBar />
      <CategoryNav />
      <main>
        <Hero />
        <CategoryCards />
        <TradingSection />
        <GuaranteeCards />
      </main>
      <Footer />
    </>
  );
}
