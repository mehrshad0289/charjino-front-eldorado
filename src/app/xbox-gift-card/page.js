import { redirect } from "next/navigation";
import { giftShopHref } from "../../lib/gift-card-shop";

export const instant = false;

export default function XboxGiftCardSamplePage() {
  redirect(giftShopHref("xbox"));
}
