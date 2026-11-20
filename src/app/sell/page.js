import { connection } from "next/server";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/actions/auth.actions";
import { getSellerMe } from "@/actions/market.actions";
import { listingSellGate } from "@/lib/listing";
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
  const gate = listingSellGate(seller);
  if (gate.href) redirect(gate.href);
  redirect("/dashboard/offers/Account");
}
