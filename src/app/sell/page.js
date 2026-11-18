import { connection } from "next/server";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/actions/auth.actions";
import { getSellerMe } from "@/actions/market.actions";
import { sellBlockers } from "@/lib/listing";
import { noIndexMetadata } from "@/lib/seo";

export const instant = false;

export const metadata = noIndexMetadata({
  title: "فروش — شارژینو",
});

export default async function SellEntryPage() {
  await connection();
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/sell");
  const seller = await getSellerMe();
  if (seller.unauthorized) redirect("/login?next=/sell");
  if (sellBlockers(seller).length) redirect("/verify/status");
  redirect("/dashboard/offers/Account");
}
