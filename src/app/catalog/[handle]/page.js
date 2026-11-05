import { notFound, redirect } from "next/navigation";
import HeaderBar from "../../../components/eldorado/HeaderBar";
import CategoryNav from "../../../components/eldorado/CategoryNav";
import ProductTitleCard from "../../../components/eldorado/ProductTitleCard";
import RecordRecentView from "../../../components/eldorado/RecordRecentView";
import Footer from "../../../components/eldorado/Footer";
import ChatBubble from "../../../components/eldorado/ChatBubble";
import { serverFetch, ApiError } from "../../../lib/server-fetcher";
import { apiPaths } from "../../../lib/api-paths";
import { formatTomanPrice, productHref } from "../../../lib/format-toman";
import { giftShopHrefFromProduct, isGiftCardProduct } from "../../../lib/gift-card-shop";

export const instant = false;

export default async function CatalogProductPage({ params }) {
  const { handle } = await params;
  let product;
  try {
    product = await serverFetch(apiPaths.catalogProduct(handle));
  } catch (error) {
    if (error instanceof ApiError && (error.statusCode === 404 || error.statusCode === 301 || error.statusCode === 308)) {
      notFound();
    }
    throw error;
  }
  if (!product?.title) notFound();
  if (isGiftCardProduct(product)) {
    const shopHref = giftShopHrefFromProduct(product);
    if (shopHref) redirect(shopHref);
  }

  return (
    <>
      <HeaderBar />
      <CategoryNav />
      <RecordRecentView product={product} href={productHref(handle)} />
      <main className="relative mx-auto max-w-[1208px] px-4 py-8 md:px-6">
        <ProductTitleCard product={{ title: product.title, image: product.thumbnail }} />
        {product.minPrice ? (
          <p className="mt-6 text-2xl font-bold text-ink">{formatTomanPrice(product.minPrice)}</p>
        ) : null}
      </main>
      <Footer />
      <ChatBubble />
    </>
  );
}
