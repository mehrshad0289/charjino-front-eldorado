import HeaderBar from "../../../../components/eldorado/HeaderBar";
import CategoryNav from "../../../../components/eldorado/CategoryNav";
import PopularGames from "../../../../components/eldorado/PopularGames";
import Footer from "../../../../components/eldorado/Footer";
import ChatBubble from "../../../../components/eldorado/ChatBubble";
import { serverFetch, ApiError } from "../../../../lib/server-fetcher";
import { apiPaths } from "../../../../lib/api-paths";
import { productHref } from "../../../../lib/format-toman";
import { giftShopHrefFromProduct, isGiftCardProduct } from "../../../../lib/gift-card-shop";

export const instant = false;

export default async function CatalogCategoryPage({ params }) {
  const { slug } = await params;
  let payload = { category: { title: slug }, products: [] };
  try {
    payload = await serverFetch(apiPaths.catalogCategory(slug));
  } catch (error) {
    if (!(error instanceof ApiError && error.statusCode === 404)) {
      throw error;
    }
  }
  const category = payload?.category || { title: slug };
  const products = Array.isArray(payload?.products) ? payload.products : [];
  const seen = new Set();
  const items = [];
  for (const row of products) {
    if (!row?.handle || !row?.title) continue;
    const gift = slug === "gift-card" || isGiftCardProduct(row);
    const href = gift ? giftShopHrefFromProduct(row) : productHref(row.handle);
    if (!href) continue;
    const key = gift ? href : row.handle;
    if (seen.has(key)) continue;
    seen.add(key);
    items.push({
      key,
      name: row.title,
      tag: category.title || row.categoryName || "",
      img: row.thumbnail || "",
      href,
    });
  }

  return (
    <>
      <HeaderBar />
      <CategoryNav />
      <main className="relative py-8">
        <div className="mx-auto max-w-[1208px] px-4 md:px-6">
          <h1 className="mb-6 text-2xl font-bold">{category.title || slug}</h1>
        </div>
        <PopularGames items={items} title={null} />
      </main>
      <Footer />
      <ChatBubble />
    </>
  );
}
