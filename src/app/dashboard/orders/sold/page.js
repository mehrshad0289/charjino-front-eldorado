import { connection } from "next/server";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/actions/auth.actions";
import { getSellerOrders } from "@/actions/market.actions";
import OrderDashboardFrame from "../../../../components/eldorado/OrderDashboardFrame";
import DashboardOrderFilters from "../../../../components/eldorado/DashboardOrderFilters";
import EmptyState from "../../../../components/eldorado/EmptyState";
import OrderCard from "../../../../components/eldorado/OrderCard";
import { DASHBOARD_ORDERS_SOLD_PAGE } from "../../../../components/eldorado/data/dashboardData";
import { ORDER_COPY } from "../../../../components/eldorado/data/orderData";
import { EMPTY_ORDER_STATUS_COUNTS, parseOrderListQuery, soldInvoiceHref } from "@/lib/order-list-query";

export const instant = false;

export const metadata = {
  title: "سفارش‌های فروش — شارژینو",
};

export default async function DashboardOrdersSoldPage({ searchParams }) {
  await connection();
  const query = searchParams ? await searchParams : {};
  const filters = parseOrderListQuery(query);
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/dashboard/orders/sold");
  const orders = await getSellerOrders(filters);
  if (orders.unauthorized) redirect("/login?next=/dashboard/orders/sold");
  const items = orders.ok ? orders.items : [];
  const { emptyState } = DASHBOARD_ORDERS_SOLD_PAGE;

  return (
    <OrderDashboardFrame user={user} active="Sold orders" title={ORDER_COPY.soldTitle}>
      <DashboardOrderFilters
        status={filters.status}
        period={filters.period}
        query={filters.q}
        counts={orders.ok ? orders.statusCounts : EMPTY_ORDER_STATUS_COUNTS}
        searchPlaceholder={ORDER_COPY.searchOrders}
        invoiceLabel={ORDER_COPY.downloadInvoice}
        invoiceHref={soldInvoiceHref(filters)}
      />
      {!orders.ok ? (
        <p className="text-[14px] text-[rgb(232,27,22)]">{orders.message || "سفارش‌ها خوانده نشد."}</p>
      ) : items.length === 0 ? (
        <EmptyState
          image={emptyState.image}
          imageAlt={ORDER_COPY.emptySoldTitle}
          title={ORDER_COPY.emptySoldTitle}
          text={ORDER_COPY.emptySoldText}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((order) => (
            <OrderCard
              key={order.order_no}
              order={order}
              amountKey="seller_payout_amount"
              href={`/dashboard/orders/sold/${encodeURIComponent(order.order_no)}`}
            />
          ))}
        </div>
      )}
    </OrderDashboardFrame>
  );
}
