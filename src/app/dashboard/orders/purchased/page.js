import { connection } from "next/server";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/actions/auth.actions";
import { listMyCatalogOrdersForDashboard } from "@/actions/checkout.actions";
import { getBuyerOrders } from "@/actions/market.actions";
import OrderDashboardFrame from "../../../../components/eldorado/OrderDashboardFrame";
import DashboardOrderFilters from "../../../../components/eldorado/DashboardOrderFilters";
import EmptyState from "../../../../components/eldorado/EmptyState";
import OrderCard from "../../../../components/eldorado/OrderCard";
import { DASHBOARD_ORDERS_PURCHASED_PAGE } from "../../../../components/eldorado/data/dashboardData";
import { ORDER_COPY } from "../../../../components/eldorado/data/orderData";
import { EMPTY_ORDER_STATUS_COUNTS, parseOrderListQuery } from "@/lib/order-list-query";
import { catalogPurchasedSlice, mergePurchasedItems, mergeStatusCounts } from "@/lib/purchased-orders";

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
  const [market, catalog] = await Promise.all([getBuyerOrders(filters), listMyCatalogOrdersForDashboard()]);
  if (market.unauthorized || catalog.unauthorized) redirect("/login?next=/dashboard/orders/purchased");
  const catalogSlice = catalog.ok ? catalogPurchasedSlice(catalog.items, filters) : { items: [], counts: EMPTY_ORDER_STATUS_COUNTS };
  const marketItems = market.ok ? market.items : [];
  const items = mergePurchasedItems(marketItems, catalogSlice.items);
  const counts = mergeStatusCounts(market.ok ? market.statusCounts : EMPTY_ORDER_STATUS_COUNTS, catalogSlice.counts);
  const marketBroken = !market.ok && !market.marketOff;
  const catalogBroken = !catalog.ok;
  const { emptyState } = DASHBOARD_ORDERS_PURCHASED_PAGE;

  return (
    <OrderDashboardFrame title={ORDER_COPY.purchasedTitle}>
      <DashboardOrderFilters
        status={filters.status}
        period={filters.period}
        query={filters.q}
        counts={counts}
      />
      {marketBroken && catalogBroken ? (
        <p className="text-[14px] text-[rgb(232,27,22)]">{market.message || catalog.message || "سفارش‌ها خوانده نشد."}</p>
      ) : items.length === 0 ? (
        <EmptyState
          image={emptyState.image}
          imageAlt={ORDER_COPY.emptyBuyTitle}
          title={ORDER_COPY.emptyBuyTitle}
          text={ORDER_COPY.emptyBuyText}
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 min-[961px]:grid-cols-2">
          {items.map((order) => (
            <OrderCard
              key={`${order.source || "market"}-${order.order_no}`}
              order={order}
              href={`/dashboard/orders/purchased/${encodeURIComponent(order.order_no)}`}
            />
          ))}
        </div>
      )}
    </OrderDashboardFrame>
  );
}
