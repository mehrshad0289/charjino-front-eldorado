import { connection } from "next/server";
import GiftCardShopPage from "../../../components/eldorado/GiftCardShopPage";
import { redirect } from "next/navigation";
import {
  giftBrandPageMeta,
  isTelegramShopId,
  loadGiftBrandPage,
  loadGiftCardShop,
  normalizeGiftPlatform,
  telegramShopHref,
} from "../../../lib/gift-card-shop";
import { hrefWithSku, skuIdFromQuery } from "../../../lib/sku-query";

export const instant = false;

export async function generateMetadata({ params, searchParams }) {
  await connection();
  const { platform } = await params;
  const query = searchParams ? await searchParams : {};
  const id = normalizeGiftPlatform(platform);
  const telegramHref = telegramShopHref(id);
  if (telegramHref) redirect(hrefWithSku(telegramHref, query.sku));
  const shop = id ? await loadGiftCardShop(id) : null;
  const brandPage = id ? await loadGiftBrandPage(id) : null;
  const name = shop?.bannerName || shop?.gameName || id || "گیفت کارت";
  const telegram = isTelegramShopId(id);
  const fallback = telegram
    ? {
        title: `خرید ${name} | شارژینو`,
        description: shop?.subtitle || `خرید ${name} با تومان از شارژینو.`,
      }
    : {
        title: `خرید گیفت کارت ${name} | شارژینو`,
        description: `خرید گیفت کارت ${name} با تومان؛ ریجن و مبلغ از کاتالوگ، تحویل کد بعد از پرداخت.`,
      };
  const meta = giftBrandPageMeta(brandPage, fallback);
  return {
    title: meta.title || fallback.title,
    description: meta.description || fallback.description,
  };
}

export default async function GiftCardPlatformPage({ params, searchParams }) {
  const { platform } = await params;
  const query = searchParams ? await searchParams : {};
  return <GiftCardShopPage platform={platform} initialSkuId={skuIdFromQuery(query.sku)} />;
}
