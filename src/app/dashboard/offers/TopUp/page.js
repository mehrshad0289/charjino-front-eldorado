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
  DASHBOARD_OFFERS_TOPUP_PAGE,
} from "../../../../components/eldorado/data/dashboardData";

/* Dashboard offers page /dashboard/offers/TopUp (own .make capture,
   1920-only, decoded 2026-11-04): same logged-in frame and page content as
   the Account offers page — header "Offers" + "New Offer", blue
   offline-mode banner, "Nothing found" empty state — except the filter row
   carries only the "Select Game" combobox (no search input, no sort
   button in the capture). Sidebar active row: "Top Ups". */

export const metadata = {
  title: "Dashboard Offers Top Ups - Eldorado",
  description: "Manage your top up offers on Eldorado.",
};

export default function DashboardOffersTopUpPage() {
  const { icon, title, action, infoBanner, filters, emptyState } =
    DASHBOARD_OFFERS_TOPUP_PAGE;
  return (
    <div className="min-h-screen bg-page text-ink">
      <HeaderBar loggedIn user={DASHBOARD_USER} />
      <CategoryNav />
      <main className="isolate">
        <DashboardShell active="Top Ups">
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
