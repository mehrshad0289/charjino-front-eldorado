import HeaderBar from "../../../../components/eldorado/HeaderBar";
import CategoryNav from "../../../../components/eldorado/CategoryNav";
import DashboardShell from "../../../../components/eldorado/DashboardShell";
import DashboardPageHeader from "../../../../components/eldorado/DashboardPageHeader";
import InfoBanner from "../../../../components/eldorado/InfoBanner";
import DashboardFilters from "../../../../components/eldorado/DashboardFilters";
import EmptyState from "../../../../components/eldorado/EmptyState";
import Footer from "../../../../components/eldorado/Footer";
import ChatBubble from "../../../../components/eldorado/ChatBubble";
import { DASHBOARD_OFFERS_GIFTCARD_PAGE } from "../../../../components/eldorado/data/dashboardData";

/* Dashboard offers page /dashboard/offers/GiftCard (own .make capture,
   1920-only, decoded 2026-11-04): same logged-in frame and page content as
   the Currency/TopUp offers pages — header "Offers" + "New Offer", blue
   offline-mode banner, "Nothing found" empty state — except the filter row
   carries only the "Select Game" combobox (no search input, no sort
   button in the capture). Sidebar active row: Gift Cards. */

export const metadata = {
  title: "Dashboard Offers Gift Cards - Eldorado",
  description: "Manage your gift card offers on Eldorado.",
};

export default function DashboardOffersGiftCardPage() {
  const { icon, title, action, infoBanner, filters, emptyState } =
    DASHBOARD_OFFERS_GIFTCARD_PAGE;
  return (
    <div className="min-h-screen bg-page text-ink">
      <HeaderBar />
      <CategoryNav />
      <main className="isolate">
        <DashboardShell active="Gift Cards">
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
