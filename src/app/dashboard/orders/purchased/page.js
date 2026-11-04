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
  DASHBOARD_ORDERS_PURCHASED_PAGE,
} from "../../../../components/eldorado/data/dashboardData";

/* Dashboard orders page /dashboard/orders/purchased (own .make capture,
   1920-only, decoded 2026-11-04): logged-in frame + dashboard shell with
   sidebar active row "Purchased orders"; page header (receipt icon + H1,
   NO action button); content gap mt-[32px] (offers pages use mt-[4px]);
   filter row = "All statuses" + "Recent" comboboxes (min-w-[200px]);
   "Nothing found" empty state with the order-specific text "You have no
   purchased orders". Footer + chat bubble reuse the shared components. */

export const metadata = {
  title: "Dashboard Purchased Orders - Eldorado",
  description: "Review the orders you purchased on Eldorado.",
};

export default function DashboardOrdersPurchasedPage() {
  const { icon, title, filters, emptyState } = DASHBOARD_ORDERS_PURCHASED_PAGE;
  return (
    <div className="min-h-screen bg-page text-ink">
      <HeaderBar loggedIn user={DASHBOARD_USER} />
      <CategoryNav />
      <main className="isolate">
        <DashboardShell active="Purchased orders">
          <DashboardPageHeader icon={icon} title={title} />
          <div className="mt-[32px] max-w-[1048px] px-6 pb-[50px]">
            <DashboardOrderFilters status={filters.status} period={filters.period} />
            <EmptyState {...emptyState} />
          </div>
        </DashboardShell>
      </main>
      <Footer />
      <ChatBubble />
    </div>
  );
}
