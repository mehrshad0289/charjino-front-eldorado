import { notFound, redirect } from "next/navigation";
import CategoryNav from "../../../components/eldorado/CategoryNav";
import ProductTitleCard from "../../../components/eldorado/ProductTitleCard";
import RecordRecentView from "../../../components/eldorado/RecordRecentView";
import Footer from "../../../components/eldorado/Footer";
import ChatBubble from "../../../components/eldorado/ChatBubble";
import { serverFetch, ApiError } from "../../../lib/server-fetcher";
import { apiPaths } from "../../../lib/api-paths";
import { formatTomanPrice, productHref } from "../../../lib/format-toman";
import { storefrontProductHref } from "../../../lib/gift-card-shop";
import { hrefWithSku } from "../../../lib/sku-query";
import { FA } from "../../../components/eldorado/data/faCopy";

export const instant = false;

function selectedSku(product, raw) {
  const id = Number(Array.isArray(raw) ? raw[0] : raw);
  const skus = Array.isArray(product?.skus) ? product.skus : [];
  if (!Number.isFinite(id) || id < 1) return null;
  return skus.find((sku) => Number(sku?.id) === id) || null;
}

export default async function CatalogProductPage({ params, searchParams }) {
  const { handle } = await params;
  const query = searchParams ? await searchParams : {};
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
  const shopHref = storefrontProductHref(product);
  if (shopHref && shopHref !== productHref(handle)) {
    redirect(hrefWithSku(shopHref, query.sku));
  }
  const sku = selectedSku(product, query.sku);
  const price = sku?.price > 0 ? sku.price : product.minPrice;
  const canBuy = Boolean(product.isOrderable && sku?.id);

  return (
    <>
      <CategoryNav />
      <RecordRecentView product={product} href={productHref(handle)} />
      <main className="relative mx-auto max-w-[1208px] px-4 py-8 md:px-6">
        <ProductTitleCard product={{ title: product.title, image: product.thumbnail }} />
        {sku?.name ? <p className="mt-4 text-base text-secondary">{sku.name}</p> : null}
        {price ? <p className="mt-6 text-2xl font-bold text-ink">{formatTomanPrice(price)}</p> : null}
        {product.temporarilyUnavailable ? (
          <p className="mt-4 text-base text-secondary">این کالا فعلاً موجود نیست.</p>
        ) : null}
        {canBuy ? (
          <a href={`/checkout?sku=${encodeURIComponent(sku.id)}`} className="mt-6 inline-flex h-11 items-center rounded-lg bg-brand px-5 text-sm font-bold text-ink">
            {FA.buyNow}
          </a>
        ) : null}
      </main>
      <Footer />
      <ChatBubble />
    </>
  );
}
