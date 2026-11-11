import { notFound } from "next/navigation";
import HeaderBar from "../../../../components/eldorado/HeaderBar";
import CategoryNav from "../../../../components/eldorado/CategoryNav";
import ProductBanner from "../../../../components/eldorado/ProductBanner";
import ProductBreadcrumb from "../../../../components/eldorado/ProductBreadcrumb";
import ProductTitleCard from "../../../../components/eldorado/ProductTitleCard";
import ProductOfferCard from "../../../../components/eldorado/ProductOfferCard";
import ProductProtectCard from "../../../../components/eldorado/ProductProtectCard";
import ProductSellerCard from "../../../../components/eldorado/ProductSellerCard";
import ProductCarousel from "../../../../components/eldorado/ProductCarousel";
import ProductDescriptionCard from "../../../../components/eldorado/ProductDescriptionCard";
import ProductMoreGrid from "../../../../components/eldorado/ProductMoreGrid";
import Footer from "../../../../components/eldorado/Footer";
import ChatBubble from "../../../../components/eldorado/ChatBubble";
import { PRODUCT, PRODUCT_ID } from "../../../../components/eldorado/data/productData";

/* Product-single page (product .make capture +
   live eldorado.gg/efootball-accounts/oa/2f48f97f-c412-48b0-c3a4-
   08df0a5485be @390/768/1024/1536/1920):
   game strip (no tabs), desktop breadcrumb bar, then a two-column
   [minmax(0,1fr)_444px] grid — left: title card + 255px screenshot strip,
   "More like this" carousel, offer description; right: offer card (blue
   included-banner, price, detail rows, dark Buy now, trust rows), "How we
   protect your purchase" accordion, seller card — and the bottom
   "More like this" 3-col grid with the "+15 more" cell.
   Mobile/tablet (<lg) follows the live stacked flow: full-bleed image,
   title, included chip + big price + rows (no Game Series), Buy now,
   trust rows, protect card, carousel with All offers link + arrows,
   seller card, description; the bottom grid is hidden (live @390).
   Reuses HeaderBar/CategoryNav/Footer/ChatBubble/TrustRows. */

export function generateStaticParams() {
  return [{ id: PRODUCT_ID }];
}

export const metadata = {
  title: "[ ANDROID ] ACC 3000 COINS, 2.5M GP - Eldorado",
  description:
    "Buy eFootball accounts with full email access on Eldorado. Instant delivery from verified sellers, money-back guarantee protected by TradeShield and 24/7 live support.",
};

export default async function ProductSinglePage({ params }) {
  const { id } = await params;
  if (id !== PRODUCT_ID) {
    notFound();
  }
  return (
    <>
      <HeaderBar />
      <main className="min-h-[1200px]">
        <ProductBanner />
        <ProductBreadcrumb />
        <div className="mx-auto w-full max-w-[1208px] px-0 lg:px-6">
          {/* mobile/tablet: stacked live flow (image → title → offer → protect
              → carousel → seller → description) */}
          <div className="flex flex-col lg:hidden">
            <ProductTitleCard />
            <ProductOfferCard />
            <div className="px-4 pb-4 pt-4">
              <ProductProtectCard />
            </div>
            <div className="bg-page px-4 pb-4 pt-2">
              <ProductCarousel />
            </div>
            <div className="px-4 pb-4">
              <div className="mb-2 text-[16px] font-bold leading-[24px]">Seller</div>
              <ProductSellerCard />
            </div>
            <div className="px-4 pb-8">
              <ProductDescriptionCard />
            </div>
          </div>

          {/* desktop: two-col grid per the capture (sidebar 444px, sticky) */}
          <div className="mt-4 hidden gap-6 lg:grid lg:grid-cols-[minmax(0,1fr)_444px] lg:items-start">
            <div className="flex min-w-0 flex-col gap-6">
              <ProductTitleCard />
              <ProductCarousel />
              <ProductDescriptionCard />
            </div>
            <aside className="flex flex-col gap-6 lg:sticky lg:top-[var(--shop-header-h)]">
              <ProductOfferCard />
              <ProductProtectCard />
              <ProductSellerCard />
            </aside>
          </div>

          {/* bottom grid: desktop only (live mobile has no bottom grid) */}
          <div className="pb-10 lg:mt-10 lg:pb-14">
            <ProductMoreGrid />
          </div>
        </div>
      </main>
      <Footer />
      <ChatBubble />
    </>
  );
}
