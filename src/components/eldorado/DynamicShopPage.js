import HeaderBar from "./HeaderBar";
import CategoryNav from "./CategoryNav";
import PopularGames from "./PopularGames";
import AccountOffersGrid from "./AccountOffersGrid";
import ShopNoResults from "./ShopNoResults";
import Footer from "./Footer";
import ChatBubble from "./ChatBubble";
import { FA } from "./data/faCopy";

export default function DynamicShopPage({
  activeCategory,
  title,
  items = null,
  offers = null,
}) {
  const hasItems = Array.isArray(items) && items.length > 0;
  const hasOffers = Array.isArray(offers) && offers.length > 0;
  const empty = !hasItems && !hasOffers;

  return (
    <>
      <HeaderBar />
      <CategoryNav activeCategory={activeCategory} />
      <main className="relative py-8">
        <div className="mx-auto max-w-[1208px] px-4 md:px-6">
          <h1 className="mb-6 text-2xl font-bold">{title}</h1>
        </div>
        {hasOffers ? <AccountOffersGrid offers={offers} /> : null}
        {hasItems ? <PopularGames items={items} title={null} /> : null}
        {empty ? (
          <div className="mx-auto max-w-[1208px] px-4 md:px-6">
            <ShopNoResults title={FA.nothingFound} text={FA.shopEmpty} />
          </div>
        ) : null}
      </main>
      <Footer />
      <ChatBubble />
    </>
  );
}
