import { notFound } from "next/navigation";
import HeaderBar from "../../../../../components/eldorado/HeaderBar";
import GiftCardBanner from "../../../../../components/eldorado/GiftCardBanner";
import ProductBanner from "../../../../../components/eldorado/ProductBanner";
import ProductBreadcrumb from "../../../../../components/eldorado/ProductBreadcrumb";
import ProductTitleCard from "../../../../../components/eldorado/ProductTitleCard";
import ProductOfferCard from "../../../../../components/eldorado/ProductOfferCard";
import ProductProtectCard from "../../../../../components/eldorado/ProductProtectCard";
import ProductSellerCard from "../../../../../components/eldorado/ProductSellerCard";
import ProductCarousel from "../../../../../components/eldorado/ProductCarousel";
import ProductDescriptionCard from "../../../../../components/eldorado/ProductDescriptionCard";
import ProductMoreGrid from "../../../../../components/eldorado/ProductMoreGrid";
import Footer from "../../../../../components/eldorado/Footer";
import ChatBubble from "../../../../../components/eldorado/ChatBubble";
import { toFaDigits } from "../../../../../lib/fa-digits";
import { formatTomanPrice } from "../../../../../lib/format-toman";
import { bannerTabsFromHub, loadHubByMarketGame } from "../../../../../lib/gift-card-shop";
import { isStoreCategoryKey, listingToOffer, loadMarketListing, loadMarketListings, loadStoreCategory, mediaUrl } from "../../../../../lib/store-engine";

export const instant = false;

export async function generateMetadata({ params }) {
  const { listingId } = await params;
  const listing = await loadMarketListing(listingId);
  const title = listing?.title || "آگهی اکانت";
  const game = listing?.game_name || "";
  const description = String(listing?.description || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);
  return {
    title: game ? `${title} | اکانت ${game} | شارژینو` : `${title} | شارژینو`,
    description: description || `خرید ${title}${game ? ` برای ${game}` : ""}. مشخصات، عکس و قیمت در همین صفحه است.`,
  };
}

const PROTECT = [
  { title: "فروشنده تأیید شده", text: "قبل از ثبت آگهی، هویت فروشنده بررسی شده است." },
  { title: "پول تا تأیید تحویل نگه داشته می‌شود", text: "فروشنده وقتی پول را می‌گیرد که تحویل را تأیید کرده باشی." },
  { title: "اگر آگهی با توضیح فرق داشت", text: "می‌توانی اختلاف ثبت کنی تا سفارش بررسی شود." },
  { title: "پشتیبانی", text: "اگر تحویل یا مشخصات مشکل داشت، از پشتیبانی شارژینو پیام بده." },
];

function rowsOf(listing) {
  return Array.isArray(listing.attribute_rows) ? listing.attribute_rows : [];
}

function imagesOf(listing, title) {
  return (Array.isArray(listing.images) ? listing.images : [])
    .map((image) => ({ url: mediaUrl(image?.url), alt: image?.alt || title }))
    .filter((image) => image.url);
}

export default async function ShopListingPage({ params }) {
  const { category, listingId } = await params;
  const key = String(category || "").toLowerCase();
  if (!isStoreCategoryKey(key)) notFound();
  const store = await loadStoreCategory(key);
  const listing = await loadMarketListing(listingId);
  if (!store || !listing) notFound();

  const title = listing.title || listing.game_name || store.label;
  const game = listing.game_name || store.label;
  const backHref = `/shop/${key}/${encodeURIComponent(game)}`;
  const images = imagesOf(listing, title);
  const video = mediaUrl(listing.videos?.[0]?.url);
  const price = formatTomanPrice(listing.price_amount);
  const attributeRows = rowsOf(listing);
  const emailRow = attributeRows.find((row) => /ایمیل|email/i.test(`${row.label_fa || ""} ${row.value || ""}`));
  const seller = listing.seller || {};
  const ratingCount = Number(seller.rating_count || 0);
  const ratingAvg = Number(seller.rating_avg);
  const feedback = ratingCount && Number.isFinite(ratingAvg) ? toFaDigits(ratingAvg.toFixed(1)) : "—";
  const reviews = ratingCount ? `${toFaDigits(ratingCount)} نظر` : "هنوز نظری نیست";
  const hub = key === "accounts" ? await loadHubByMarketGame(game) : null;
  const hubTabs = bannerTabsFromHub(hub);
  const related = (await loadMarketListings(game)).items
    .filter((row) => String(row.id) !== String(listing.id))
    .map((row) => listingToOffer(row, key))
    .filter(Boolean);
  const carousel = related.map((offer) => ({
    href: offer.href,
    title: offer.title,
    seller: offer.seller,
    feedback: offer.rating,
    count: "",
    price: offer.price,
  }));
  const more = related.map((offer) => ({
    href: offer.href,
    title: offer.title,
    seller: offer.seller,
    feedback: offer.rating,
    count: "",
    price: offer.price,
    delivery: offer.delivery,
    img: offer.img,
  }));

  return (
    <>
      <HeaderBar />
      <main className="min-h-[1200px]">
        {hubTabs.length > 0 ? (
          <GiftCardBanner active="accounts" iconAlt={game} gameName={game} gameIcon={images[0]?.url || ""} tabs={hubTabs} />
        ) : (
          <ProductBanner
            game={{
              name: game,
              backHref,
              backLabel: "بازگشت به آگهی‌ها",
              icon: images[0]?.url || "",
            }}
          />
        )}
        <ProductBreadcrumb backHref={backHref} backLabel="بازگشت به آگهی‌ها" />
        <div className="mx-auto w-full max-w-[1208px] px-0 lg:px-6">
          <div className="flex flex-col lg:hidden">
            <ProductTitleCard product={{ title, images, video }} />
            <ProductOfferCard
              offer={{
                price,
                banner: emailRow ? "دسترسی ایمیل در مشخصات آگهی" : "آگهی تأییدشده",
                buyHref: `/checkout?listing=${encodeURIComponent(String(listing.id))}`,
                buyLabel: "خرید",
                details: [
                  { label: "بازی", value: game, mobileHidden: true },
                  ...attributeRows.map((row) => ({ label: row.label_fa || row.key, value: row.value })),
                  { label: "زمان تحویل", value: "پس از پرداخت", instant: true },
                ],
                trust: {
                  guarantee: "تضمین بازگشت پول",
                  guaranteeNote: "تا تأیید تحویل، پول نزد شارژینو می‌ماند",
                  support: "پشتیبانی",
                  supportNote: "اگر تحویل مشکل داشت پیام بده",
                },
              }}
            />
            <div className="px-4 pb-4 pt-4">
              <ProductProtectCard title="خرید چطور محافظت می‌شود" items={PROTECT} />
            </div>
            <div className="bg-page px-4 pb-4 pt-2">
              <ProductCarousel cards={carousel} allHref={backHref} heading="آگهی‌های مشابه" />
            </div>
            <div className="px-4 pb-4">
              <div className="mb-2 text-[16px] font-bold leading-[24px]">فروشنده</div>
              <ProductSellerCard
                seller={{
                  name: seller.name || "فروشنده",
                  feedback,
                  reviews,
                  feedbackNote: reviews,
                  verifiedChip: "هویت تأیید شده",
                }}
              />
            </div>
            <div className="px-4 pb-8">
              <ProductDescriptionCard
                copy={{
                  title: "توضیحات آگهی",
                  chips: attributeRows.slice(0, 4).map((row) => row.label_fa || row.value),
                  description: listing.description || "فروشنده توضیح دیگری ننوشته است.",
                }}
              />
            </div>
          </div>

          <div className="mt-4 hidden gap-6 lg:grid lg:grid-cols-[minmax(0,1fr)_444px] lg:items-start">
            <div className="flex min-w-0 flex-col gap-6">
              <ProductTitleCard product={{ title, images, video }} />
              <ProductCarousel cards={carousel} allHref={backHref} heading="آگهی‌های مشابه" />
              <ProductDescriptionCard
                copy={{
                  title: "توضیحات آگهی",
                  chips: attributeRows.slice(0, 4).map((row) => row.label_fa || row.value),
                  description: listing.description || "فروشنده توضیح دیگری ننوشته است.",
                }}
              />
            </div>
            <aside className="flex flex-col gap-6 lg:sticky lg:top-[108px]">
              <ProductOfferCard
                offer={{
                  price,
                  banner: emailRow ? "دسترسی ایمیل در مشخصات آگهی" : "آگهی تأییدشده",
                  buyHref: `/checkout?listing=${encodeURIComponent(String(listing.id))}`,
                  buyLabel: "خرید",
                  details: [
                    { label: "بازی", value: game },
                    ...attributeRows.map((row) => ({ label: row.label_fa || row.key, value: row.value })),
                    { label: "زمان تحویل", value: "پس از پرداخت", instant: true },
                  ],
                  trust: {
                    guarantee: "تضمین بازگشت پول",
                    guaranteeNote: "تا تأیید تحویل، پول نزد شارژینو می‌ماند",
                    support: "پشتیبانی",
                    supportNote: "اگر تحویل مشکل داشت پیام بده",
                  },
                }}
              />
              <ProductProtectCard title="خرید چطور محافظت می‌شود" items={PROTECT} />
              <ProductSellerCard
                seller={{
                  name: seller.name || "فروشنده",
                  feedback,
                  reviews,
                  feedbackNote: reviews,
                  verifiedChip: "هویت تأیید شده",
                }}
              />
            </aside>
          </div>

          <div className="pb-10 lg:mt-10 lg:pb-14">
            <ProductMoreGrid cards={more} allHref={backHref} heading="آگهی‌های مشابه" extra="" />
          </div>
        </div>
      </main>
      <Footer />
      <ChatBubble />
    </>
  );
}
