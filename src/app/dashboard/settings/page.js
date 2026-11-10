import HeaderBar from "../../../components/eldorado/HeaderBar";
import CategoryNav from "../../../components/eldorado/CategoryNav";
import DashboardShell from "../../../components/eldorado/DashboardShell";
import DashboardPageHeader from "../../../components/eldorado/DashboardPageHeader";
import DashboardSettings from "../../../components/eldorado/DashboardSettings";
import Footer from "../../../components/eldorado/Footer";
import ChatBubble from "../../../components/eldorado/ChatBubble";
import { DASHBOARD_SETTINGS_PAGE } from "../../../components/eldorado/data/dashboardData";

/* Dashboard settings page /dashboard/settings (own .make capture,
   1920-only, decoded 2026-11-04): logged-in frame, sidebar active row
   "Account settings" (bg rgb(255,201,80)), h1 "Account settings" and the
   five white cards — Profile (disabled Email/Username with blue Edit,
   Change password), Profile picture, Security (Set Up 2FA + Log out from
   all sessions), Email notifications (All OFF / Boosting OFF / rest ON
   per the capture) and Your description (empty Type here... textarea).
   No action button on the header row (no New Offer equivalent). */

export const metadata = {
  title: "Dashboard Settings - Eldorado",
  description: "Manage your Eldorado account settings.",
};

export default function DashboardSettingsPage() {
  const { icon, title } = DASHBOARD_SETTINGS_PAGE;
  return (
    <div className="min-h-screen bg-page text-ink">
      <HeaderBar />
      <CategoryNav />
      <main className="isolate">
        <DashboardShell active="Account settings">
          <DashboardPageHeader icon={icon} title={title} />
          <DashboardSettings />
        </DashboardShell>
      </main>
      <Footer />
      <ChatBubble />
    </div>
  );
}
