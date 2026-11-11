import { connection } from "next/server";
import { notFound, redirect } from "next/navigation";
import { getSessionUser } from "@/actions/auth.actions";
import { getBuyerOrder } from "@/actions/market.actions";
import OrderDashboardFrame from "../../../../../components/eldorado/OrderDashboardFrame";
import BuyerOrderPanel from "../../../../../components/eldorado/BuyerOrderPanel";
import { ORDER_COPY } from "../../../../../components/eldorado/data/orderData";
import { toFaDigits } from "@/lib/fa-digits";

export const instant = false;

export async function generateMetadata({ params }) {
  const { orderNo } = await params;
  return { title: `سفارش ${orderNo} — شارژینو` };
}

export default async function PurchasedOrderPage({ params, searchParams }) {
  await connection();
  const { orderNo } = await params;
  const query = searchParams ? await searchParams : {};
  const user = await getSessionUser();
  const next = `/dashboard/orders/purchased/${encodeURIComponent(orderNo)}`;
  if (!user) redirect(`/login?next=${encodeURIComponent(next)}`);
  const result = await getBuyerOrder(orderNo);
  if (result.unauthorized) redirect(`/login?next=${encodeURIComponent(next)}`);
  if (!result.ok || !result.data) notFound();

  return (
    <OrderDashboardFrame user={user} active="Purchased orders" title={`${ORDER_COPY.purchasedTitle} ${toFaDigits(orderNo)}`}>
      <a href="/dashboard/orders/purchased" className="mb-4 inline-flex text-[14px] font-bold text-linkblue">
        {ORDER_COPY.backPurchased}
      </a>
      <BuyerOrderPanel order={result.data} payment={String(query.payment || "")} />
    </OrderDashboardFrame>
  );
}
