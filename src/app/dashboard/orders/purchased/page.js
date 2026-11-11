import { connection } from "next/server";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/actions/auth.actions";
import { getBuyerOrders } from "@/actions/market.actions";
import OrderDashboardFrame from "../../../../components/eldorado/OrderDashboardFrame";
import DashboardOrderFilters from "../../../../components/eldorado/DashboardOrderFilters";
import EmptyState from "../../../../components/eldorado/EmptyState";
import OrderCard from "../../../../components/eldorado/OrderCard";
import { DASHBOARD_ORDERS_PURCHASED_PAGE } from "../../../../components/eldorado/data/dashboardData";
import { ORDER_COPY } from "../../../../components/eldorado/data/orderData";
import { EMPTY_ORDER_STATUS_COUNTS, parseOrderListQuery } from "@/lib/order-list-query";

export const instant = false;

export const metadata = {
  title: "سفارش‌های خرید — شارژینو",
};

export default async function DashboardOrdersPurchasedPage({ searchParams }) {
  await connection();
  const query = searchParams ? await searchParams : {};
  const filters = parseOrderListQuery(query);
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/dashboard/orders/purchased");
  const orders = await getBuyerOrders(filters);
  if (orders.unauthorized) redirect("/login?next=/dashboard/orders/purchased");
  const items = orders.ok ? orders.items : [];
  const { emptyState } = DASHBOARD_ORDERS_PURCHASED_PAGE;

  return (
    <OrderDashboardFrame user={user} active="Purchased orders" title={ORDER_COPY.purchasedTitle}>
      <DashboardOrderFilters
        status={filters.status}
        period={filters.period}
        query={filters.q}
        counts={orders.ok ? orders.statusCounts : EMPTY_ORDER_STATUS_COUNTS}
      />
      {!orders.ok ? (
        <p className="text-[14px] text-[rgb(232,27,22)]">{orders.message || "سفارش‌ها خوانده نشد."}</p>
      ) : items.length === 0 ? (
        <EmptyState
          image={emptyState.image}
          imageAlt={ORDER_COPY.emptyBuyTitle}
          title={ORDER_COPY.emptyBuyTitle}
          text={ORDER_COPY.emptyBuyText}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((order) => (
            <OrderCard
              key={order.order_no}
              order={order}
              href={`/dashboard/orders/purchased/${encodeURIComponent(order.order_no)}`}
            />
          ))}
        </div>
      )}
    </OrderDashboardFrame>
  );
}
