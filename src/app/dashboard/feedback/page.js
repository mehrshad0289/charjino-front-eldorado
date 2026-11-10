import HeaderBar from "../../../components/eldorado/HeaderBar";
import CategoryNav from "../../../components/eldorado/CategoryNav";
import DashboardShell from "../../../components/eldorado/DashboardShell";
import DashboardPageHeader from "../../../components/eldorado/DashboardPageHeader";
import DashboardFeedbackStats from "../../../components/eldorado/DashboardFeedbackStats";
import EmptyState from "../../../components/eldorado/EmptyState";
import Footer from "../../../components/eldorado/Footer";
import ChatBubble from "../../../components/eldorado/ChatBubble";
import { DASHBOARD_FEEDBACK_PAGE } from "../../../components/eldorado/data/dashboardData";

/* Dashboard page /dashboard/feedback (own .make capture `ui ux/Feedback/
   www_pageDirection_Next_…make`, decoded 2026-11-05, 1920-only): header
   "Feedback" (no action button), white 4-column stats card (Completed
   orders / Positive / Negative / Feedback score 0%), three filter buttons
   (All active dark), and the shared 100px "Nothing found" empty state with
   an EMPTY subtitle line (verbatim — the capture's gray text node is
   empty). Sidebar active row: Feedback. */

export const metadata = {
  title: "Dashboard Feedback - Eldorado",
  description: "Seller feedback on Eldorado.",
};

export default function DashboardFeedbackPage() {
  const { icon, title, stats, filters, emptyState } = DASHBOARD_FEEDBACK_PAGE;
  return (
    <div className="min-h-screen bg-page text-ink">
      <HeaderBar />
      <CategoryNav />
      <main className="isolate">
        <DashboardShell active="Feedback">
          <DashboardPageHeader icon={icon} title={title} />
          <div className="relative mt-8 max-w-[1048px] px-6 pb-[50px]">
            <DashboardFeedbackStats stats={stats} filters={filters} />
            <EmptyState {...emptyState} />
          </div>
        </DashboardShell>
      </main>
      <Footer />
      <ChatBubble />
    </div>
  );
}
