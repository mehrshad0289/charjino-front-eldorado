import HeaderBar from "../../../../components/eldorado/HeaderBar";
import CategoryNav from "../../../../components/eldorado/CategoryNav";
import DashboardShell from "../../../../components/eldorado/DashboardShell";
import DashboardPageHeader from "../../../../components/eldorado/DashboardPageHeader";
import InfoBanner from "../../../../components/eldorado/InfoBanner";
import DashboardFilters from "../../../../components/eldorado/DashboardFilters";
import EmptyState from "../../../../components/eldorado/EmptyState";
import Footer from "../../../../components/eldorado/Footer";
import ChatBubble from "../../../../components/eldorado/ChatBubble";
import {
  DASHBOARD_USER,
  DASHBOARD_OFFERS_PAGE,
} from "../../../../components/eldorado/data/dashboardData";

/* Dashboard offers page /dashboard/offers/Account (dashboard .make capture,
   1920-only, decoded 2026-11-04): logged-in header (search + icon buttons +
   avatar), category strip, dashboard shell with the 465px banner and the
   white sidebar (active: Accounts), page header "Offers" + "New Offer",
   blue offline-mode banner, filter row and the "Nothing found" empty state
   (the capture's account has no offers yet). Footer + chat bubble reuse the
   shared components. */

export const metadata = {
  title: "Dashboard Offers - Eldorado",
  description: "Manage your offers on Eldorado.",
};

export default function DashboardOffersAccountPage() {
  const { icon, title, action, infoBanner, filters, emptyState } = DASHBOARD_OFFERS_PAGE;
  return (
    <div className="min-h-screen bg-page text-ink">
      <HeaderBar loggedIn user={DASHBOARD_USER} />
      <CategoryNav />
      <main className="isolate">
        <DashboardShell active="Accounts">
          <DashboardPageHeader icon={icon} title={title} action={action} />
          <div className="mt-1 max-w-[1048px] px-6 pb-[50px]">
            <InfoBanner title={infoBanner.title} bodyParts={infoBanner.bodyParts} />
            <DashboardFilters {...filters} />
            <EmptyState {...emptyState} />
          </div>
        </DashboardShell>
      </main>
      <Footer />
      <ChatBubble />
    </div>
  );
}
