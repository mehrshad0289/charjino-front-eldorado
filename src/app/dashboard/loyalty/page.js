import HeaderBar from "../../../components/eldorado/HeaderBar";
import CategoryNav from "../../../components/eldorado/CategoryNav";
import DashboardShell from "../../../components/eldorado/DashboardShell";
import DashboardPageHeader from "../../../components/eldorado/DashboardPageHeader";
import DashboardLoyalty from "../../../components/eldorado/DashboardLoyalty";
import Footer from "../../../components/eldorado/Footer";
import ChatBubble from "../../../components/eldorado/ChatBubble";
import { DASHBOARD_USER } from "../../../components/eldorado/data/dashboardData";

/* Dashboard page /dashboard/loyalty (own .make capture, 1920-only,
   decoded 2026-11-04, session 16): logged-in frame + dashboard shell with
   sidebar active row "Loyalty"; page header "Eldorado Loyalty" (star icon,
   no action button); amber streak banner + white points card, 2-col
   achievements grid (3 cards) and the Dedication background-image card —
   see DashboardLoyalty.js for the section-by-section notes. Footer + chat
   bubble reuse the shared components. */

export const metadata = {
  title: "Dashboard Loyalty - Eldorado",
  description: "Collect loyalty points and unlock rewards on Eldorado.",
};

export default function DashboardLoyaltyPage() {
  return (
    <div className="min-h-screen bg-page text-ink">
      <HeaderBar loggedIn user={DASHBOARD_USER} />
      <CategoryNav />
      <main className="isolate">
        <DashboardShell active="Loyalty">
          <DashboardPageHeader icon="loyalty" title="Eldorado Loyalty" />
          <DashboardLoyalty />
        </DashboardShell>
      </main>
      <Footer />
      <ChatBubble />
    </div>
  );
}
