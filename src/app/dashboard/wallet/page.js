import HeaderBar from "../../../components/eldorado/HeaderBar";
import CategoryNav from "../../../components/eldorado/CategoryNav";
import DashboardShell from "../../../components/eldorado/DashboardShell";
import DashboardPageHeader from "../../../components/eldorado/DashboardPageHeader";
import DashboardWalletTable from "../../../components/eldorado/DashboardWalletTable";
import Footer from "../../../components/eldorado/Footer";
import ChatBubble from "../../../components/eldorado/ChatBubble";
import { DASHBOARD_WALLET_PAGE } from "../../../components/eldorado/data/dashboardData";

/* Dashboard page /dashboard/wallet (own .make capture `ui ux/Wallet/…`,
   decoded 2026-11-05, 1920-only): header "Wallet" (no action button),
   white balance card ("Balance 0.00", max-w 500px), 200px "All"
   combobox and the empty white transactions table (header only + a
   disabled First/‹/›/Last pagination strip). Sidebar active row: Wallet. */

export const metadata = {
  title: "Dashboard Wallet - Eldorado",
  description: "Your Eldorado wallet balance and transactions.",
};

export default function DashboardWalletPage() {
  const { icon, title, ...table } = DASHBOARD_WALLET_PAGE;
  return (
    <div className="min-h-screen bg-page text-ink">
      <HeaderBar />
      <CategoryNav />
      <main className="isolate">
        <DashboardShell active="Wallet">
          <DashboardPageHeader icon={icon} title={title} />
          <div className="relative mt-8 max-w-[1048px] px-6 pb-[50px]">
            <DashboardWalletTable {...table} />
          </div>
        </DashboardShell>
      </main>
      <Footer />
      <ChatBubble />
    </div>
  );
}
