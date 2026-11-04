import HeaderBar from "../../../../components/eldorado/HeaderBar";
import CategoryNav from "../../../../components/eldorado/CategoryNav";
import DashboardShell from "../../../../components/eldorado/DashboardShell";
import DashboardPageHeader from "../../../../components/eldorado/DashboardPageHeader";
import DashboardOrderFilters from "../../../../components/eldorado/DashboardOrderFilters";
import EmptyState from "../../../../components/eldorado/EmptyState";
import Footer from "../../../../components/eldorado/Footer";
import ChatBubble from "../../../../components/eldorado/ChatBubble";
import {
  DASHBOARD_USER,
  DASHBOARD_ORDERS_SOLD_PAGE,
} from "../../../../components/eldorado/data/dashboardData";

/* Dashboard orders page /dashboard/orders/sold (own .make capture,
   1920-only, decoded 2026-11-04): same frame as the purchased page with
   sidebar active row "Sold orders"; filter row extends the two comboboxes
   ("All statuses", "Recent") with a 200px "Search Orders" input and a
   right-aligned gray "Download invoice" button; "Nothing found" empty
   state with the text "You have no sold orders". Footer + chat bubble
   reuse the shared components. */

export const metadata = {
  title: "Dashboard Sold Orders - Eldorado",
  description: "Review the orders you sold on Eldorado.",
};

export default function DashboardOrdersSoldPage() {
  const { icon, title, filters, emptyState } = DASHBOARD_ORDERS_SOLD_PAGE;
  return (
    <div className="min-h-screen bg-page text-ink">
      <HeaderBar loggedIn user={DASHBOARD_USER} />
      <CategoryNav />
      <main className="isolate">
        <DashboardShell active="Sold orders">
          <DashboardPageHeader icon={icon} title={title} />
          <div className="mt-[32px] max-w-[1048px] px-6 pb-[50px]">
            <DashboardOrderFilters
              status={filters.status}
              period={filters.period}
              searchPlaceholder={filters.searchPlaceholder}
              invoiceLabel={filters.invoiceLabel}
            />
            <EmptyState {...emptyState} />
          </div>
        </DashboardShell>
      </main>
      <Footer />
      <ChatBubble />
    </div>
  );
}
