import DashboardPageHeader from "../../../../components/eldorado/DashboardPageHeader";
import InfoBanner from "../../../../components/eldorado/InfoBanner";
import DashboardFilters from "../../../../components/eldorado/DashboardFilters";
import EmptyState from "../../../../components/eldorado/EmptyState";
import { DASHBOARD_OFFERS_TOPUP_PAGE } from "../../../../components/eldorado/data/dashboardData";

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
    <>
      <DashboardPageHeader icon={icon} title={title} action={action} />
      <div className="mt-1 w-full px-6 pb-[50px]">
        <InfoBanner title={infoBanner.title} bodyParts={infoBanner.bodyParts} />
        <DashboardFilters {...filters} />
        <EmptyState {...emptyState} />
      </div>
    </>
  );
}
