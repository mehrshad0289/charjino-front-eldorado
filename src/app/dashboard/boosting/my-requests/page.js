import HeaderBar from "../../../../components/eldorado/HeaderBar";
import CategoryNav from "../../../../components/eldorado/CategoryNav";
import DashboardShell from "../../../../components/eldorado/DashboardShell";
import DashboardPageHeader from "../../../../components/eldorado/DashboardPageHeader";
import EmptyState from "../../../../components/eldorado/EmptyState";
import Footer from "../../../../components/eldorado/Footer";
import ChatBubble from "../../../../components/eldorado/ChatBubble";
import { DASHBOARD_BOOSTING_REQUESTS_PAGE } from "../../../../components/eldorado/data/dashboardExtraData";
import { FA } from "../../../../components/eldorado/data/faCopy";

/* Dashboard page /dashboard/boosting/my-requests — session 26. The
   sidebar's Boosting group links here (DASHBOARD_NAV_GROUPS) but no
   page existed. No capture pushed: the offers-page pattern (page
   header with the yellow "New request" action + shared EmptyState).
   Sidebar active row: My requests. */

export const metadata = {
  title: "My Boosting Requests - Eldorado",
  description: "Track your Eldorado boosting requests and the offers boosters sent you.",
};

export default function DashboardBoostingRequestsPage() {
  const { icon, title, emptyState } = DASHBOARD_BOOSTING_REQUESTS_PAGE;
  return (
    <div className="min-h-screen bg-page text-ink">
      <HeaderBar />
      <CategoryNav />
      <main className="isolate">
        <DashboardShell active="My requests">
          <DashboardPageHeader
            icon={icon}
            title={title}
            action={{ label: FA.newRequest, href: "/become-seller", ariaLabel: FA.newRequest }}
          />
          <div className="relative mt-8 max-w-[1048px] px-6 pb-[50px]">
            <EmptyState {...emptyState} />
          </div>
        </DashboardShell>
      </main>
      <Footer />
      <ChatBubble />
    </div>
  );
}
