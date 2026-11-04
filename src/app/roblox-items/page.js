import HeaderBar from "../../components/eldorado/HeaderBar";
import CategoryNav from "../../components/eldorado/CategoryNav";
import ShopItemSubNav from "../../components/eldorado/ShopItemSubNav";
import ShopItemPageContent from "../../components/eldorado/ShopItemPageContent";
import Footer from "../../components/eldorado/Footer";
import ChatBubble from "../../components/eldorado/ChatBubble";

/* Roblox items category page /roblox-items (user-pushed capture
   `ui ux/shop-item/…roblox-items…make`, decoded 2026-11-04, session 18):
   logged-out header + category strip, the capture's dark game sub-nav
   (Roblox icon + Robux / Accounts / Top ups / Items active / Boosting /
   Gift cards), 465px banner backdrop fading into the page, sticky Filters
   sidebar (Price + Game accordions) and the offers column (10 filter
   chips, "31057 items found" + Recommended sort, 24 verbatim cards,
   pagination 1…1000, trust row, verbatim SEO block). Offer hrefs point to
   the real eldorado.gg offer pages per the capture (no offer route in
   this clone). Capture is 1920-only — below lg the sidebar stacks
   (documented). */

export const metadata = {
  title: "Roblox Items For Sale - Eldorado",
  description:
    "Buy Roblox items from verified sellers: limiteds, game items and more with fast delivery and TradeShield protection.",
};

export default function RobloxItemsPage() {
  return (
    <div className="min-h-screen bg-page text-ink">
      <HeaderBar />
      <CategoryNav activeCategory="Items" />
      <main className="relative">
        <ShopItemSubNav />
        <ShopItemPageContent />
      </main>
      <Footer />
      <ChatBubble />
    </div>
  );
}
