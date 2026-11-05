import { connection } from "next/server";
import GiftCardShopPage from "../../../components/eldorado/GiftCardShopPage";
import { loadGiftCardShop, normalizeGiftPlatform } from "../../../lib/gift-card-shop";

export const instant = false;

export async function generateMetadata({ params }) {
  await connection();
  const { platform } = await params;
  const id = normalizeGiftPlatform(platform);
  const shop = id ? await loadGiftCardShop(id) : null;
  const name = shop?.gameName || id || "گیفت کارت";
  return {
    title: `خرید گیفت کارت ${name} | شارژینو`,
    description: `خرید گیفت کارت ${name} با تومان؛ ریجن و مبلغ از کاتالوگ، تحویل کد بعد از پرداخت.`,
  };
}

export default async function GiftCardPlatformPage({ params }) {
  const { platform } = await params;
  return <GiftCardShopPage platform={platform} />;
}
