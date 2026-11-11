import { connection } from "next/server";
import { notFound, redirect } from "next/navigation";
import { getSessionUser } from "@/actions/auth.actions";
import { getSellerOrder } from "@/actions/market.actions";
import OrderDashboardFrame from "../../../../../components/eldorado/OrderDashboardFrame";
import SellerOrderPanel from "../../../../../components/eldorado/SellerOrderPanel";
import { ORDER_COPY } from "../../../../../components/eldorado/data/orderData";
import { toFaDigits } from "@/lib/fa-digits";

export const instant = false;

export async function generateMetadata({ params }) {
  const { orderNo } = await params;
  return { title: `فروش ${orderNo} — شارژینو` };
}

export default async function SoldOrderPage({ params }) {
  await connection();
  const { orderNo } = await params;
  const user = await getSessionUser();
  const next = `/dashboard/orders/sold/${encodeURIComponent(orderNo)}`;
  if (!user) redirect(`/login?next=${encodeURIComponent(next)}`);
  const result = await getSellerOrder(orderNo);
  if (result.unauthorized) redirect(`/login?next=${encodeURIComponent(next)}`);
  if (!result.ok || !result.data) notFound();

  return (
    <OrderDashboardFrame user={user} active="Sold orders" title={`${ORDER_COPY.soldTitle} ${toFaDigits(orderNo)}`}>
      <a href="/dashboard/orders/sold" className="mb-4 inline-flex text-[14px] font-bold text-linkblue">
        {ORDER_COPY.backSold}
      </a>
      <SellerOrderPanel order={result.data} />
    </OrderDashboardFrame>
  );
}
