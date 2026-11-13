import { notFound, redirect } from "next/navigation";
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
import { CURRENCY_LISTING_COPY } from "../../../../../components/eldorado/data/listingData";
import { toFaDigits } from "../../../../../lib/fa-digits";
import { formatTomanPrice } from "../../../../../lib/format-toman";
import { bannerTabsFromHub, loadHubByMarketGame } from "../../../../../lib/gift-card-shop";
import {
  currencyHubKeyForMarket,
  isStoreCategoryKey,
  listingToOffer,
  loadMarketListing,
  loadMarketListings,
  loadStoreCategory,
  mediaUrl,
} from "../../../../../lib/store-engine";

export const instant = false;

function offerKind(offer) {
  if (offer === "CustomItem") return "آیتم";
  if (offer === "Currency") return "ارز";
  return "اکانت";
}

function categoryForOffer(offer) {
  if (offer === "CustomItem") return "items";
  if (offer === "Currency") return "currency";
  return "accounts";
}

export async function generateMetadata({ params }) {
  const { listingId } = await params;
  const listing = await loadMarketListing(listingId);
  const kind = offerKind(listing?.offer_type);
  const title = listing?.title || `آگهی ${kind}`;
  const game = listing?.game_name || "";
  const description = String(listing?.description || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);
  return {
    title: game ? `${title} | ${kind} ${game} | شارژینو` : `${title} | شارژینو`,
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
  const gallery = (Array.isArray(listing.images) ? listing.images : [])
    .map((image) => ({ url: mediaUrl(image?.url), alt: image?.alt || title }))
    .filter((image) => image.url);
  if (gallery.length) return gallery;
  const cover = mediaUrl(listing.cover_image?.url);
  return cover ? [{ url: cover, alt: title }] : [];
}

function listingPrice(listing) {
  const base = formatTomanPrice(listing.price_amount);
  if (!base) return "";
  if (listing.offer_type === "Currency" && listing.price_unit_label) {
    return `${base} / ${listing.price_unit_label}`;
  }
  return base;
}

function listingDetails(listing, { hideGame } = {}) {
  const game = listing.game_name || "";
  const rows = [{ label: "بازی", value: game, mobileHidden: hideGame }];
  if (listing.offer_type === "Currency") {
    if (listing.price_unit_label) rows.push({ label: "واحد", value: listing.price_unit_label });
    if (listing.attributes?.region) rows.push({ label: "ریجن یا سرور", value: String(listing.attributes.region) });
    if (listing.delivery_label) rows.push({ label: "تحویل", value: listing.delivery_label });
    if (listing.delivery_minutes != null) {
      rows.push({
        label: "زمان تحویل",
        value: `${toFaDigits(listing.delivery_minutes)} دقیقه`,
        instant: Number(listing.delivery_minutes) <= 60,
      });
    }
    if (listing.stock != null) rows.push({ label: "موجودی", value: toFaDigits(listing.stock) });
    if (listing.min_quantity != null) rows.push({ label: "حداقل خرید", value: toFaDigits(listing.min_quantity) });
    return rows;
  }
  rows.push(...rowsOf(listing).map((row) => ({ label: row.label_fa || row.key, value: row.value })));
  rows.push({ label: "ضمانت", value: "۵ روز رایگان" });
  rows.push({ label: "زمان تحویل", value: "فوری", instant: true });
  return rows;
}

function listingTrust(offer) {
  if (offer === "Currency") {
    return {
      guarantee: "فروشنده بعد از تحویل پول می‌گیرد",
      guaranteeNote: "وقتی ارز را گرفتی و تأیید کردی، پول آزاد می‌شود",
      support: "پشتیبانی",
      supportNote: "اگر تحویل یا آگهی مشکل داشت پیام بده",
    };
  }
  return {
    guarantee: "فروشنده بعد از تحویل پول می‌گیرد",
    guaranteeNote: "وقتی اکانت را گرفتی و تأیید کردی، پول آزاد می‌شود",
    support: "پشتیبانی",
    supportNote: "اگر تحویل یا آگهی مشکل داشت پیام بده",
  };
}

function listingBanner(listing) {
  if (listing.offer_type === "Currency") return "نرخ ارز بازی";
  const emailRow = rowsOf(listing).find((row) => /ایمیل|email/i.test(`${row.label_fa || ""} ${row.value || ""}`));
  return emailRow ? "دسترسی ایمیل در مشخصات آگهی" : "آگهی تأییدشده";
}

export default async function ShopListingPage({ params }) {
  const { category, listingId } = await params;
  const key = String(category || "").toLowerCase();
  if (!isStoreCategoryKey(key)) notFound();
  const store = await loadStoreCategory(key);
  const listing = await loadMarketListing(listingId);
  if (!store || !listing) notFound();
  const offer = listing.offer_type || "Account";
  const canonical = categoryForOffer(offer);
  if (canonical !== key) redirect(`/shop/${canonical}/l/${encodeURIComponent(String(listingId))}`);

  const title = listing.title || listing.game_name || store.label;
  const game = listing.game_name || store.label;
  const images = imagesOf(listing, title);
  const video = offer === "Currency" ? "" : mediaUrl(listing.videos?.[0]?.url);
  const price = listingPrice(listing);
  const attributeRows = rowsOf(listing);
  const seller = listing.seller || {};
  const ratingCount = Number(seller.rating_count || 0);
  const ratingAvg = Number(seller.rating_avg);
  const feedback = ratingCount && Number.isFinite(ratingAvg) ? toFaDigits(ratingAvg.toFixed(1)) : "—";
  const reviews = ratingCount ? `${toFaDigits(ratingCount)} نظر` : "هنوز نظری نیست";
  const hub = await loadHubByMarketGame(game);
  const hubTabs = bannerTabsFromHub(hub);
  const tabKey = canonical;
  const hubKey = canonical === "currency" ? await currencyHubKeyForMarket(game) : "";
  const backHref =
    hubTabs.find((tab) => tab.key === tabKey)?.href ||
    (hubKey ? `/shop/currency/${encodeURIComponent(hubKey)}` : `/shop/${key}/${encodeURIComponent(game)}`);
  const relatedOffer = offer === "CustomItem" ? "CustomItem" : offer === "Currency" ? "Currency" : undefined;
  const related = (await loadMarketListings(game, relatedOffer)).items
    .filter((row) => String(row.id) !== String(listing.id))
    .map((row) => listingToOffer(row, canonical))
    .filter(Boolean);
  const carousel = related.map((item) => ({
    href: item.href,
    title: item.title,
    seller: item.seller,
    feedback: item.rating,
    count: "",
    price: item.price,
  }));
  const more = related.map((item) => ({
    href: item.href,
    title: item.title,
    seller: item.seller,
    feedback: item.rating,
    count: "",
    price: item.price,
    delivery: item.delivery,
    img: item.img,
  }));
  const offerCard = {
    price,
    banner: listingBanner(listing),
    buyHref: `/checkout?listing=${encodeURIComponent(String(listing.id))}`,
    buyLabel: "خرید",
    details: listingDetails(listing, { hideGame: true }),
    showWarranty: offer !== "Currency",
    trust: listingTrust(offer),
  };
  const desktopOfferCard = { ...offerCard, details: listingDetails(listing) };
  const descriptionChips =
    offer === "Currency"
      ? [listing.price_unit_label, listing.delivery_label, listing.attributes?.region].filter(Boolean)
      : attributeRows.slice(0, 4).map((row) => row.label_fa || row.value);
  const description = [
    listing.description || "فروشنده توضیح دیگری ننوشته است.",
    offer === "Currency" ? listing.rwt_notice || CURRENCY_LISTING_COPY.rwtFallback : "",
  ]
    .filter(Boolean)
    .join("\n\n");

  return (
    <>
      <HeaderBar />
      <main className="min-h-[1200px]">
        {hubTabs.length > 0 ? (
          <GiftCardBanner active={tabKey} iconAlt={game} gameName={game} gameIcon={images[0]?.url || ""} tabs={hubTabs} />
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
            <ProductOfferCard offer={offerCard} />
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
                  chips: descriptionChips,
                  description,
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
                  chips: descriptionChips,
                  description,
                }}
              />
            </div>
            <aside className="flex flex-col gap-6 lg:sticky lg:top-[var(--shop-header-h)]">
              <ProductOfferCard offer={desktopOfferCard} />
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
