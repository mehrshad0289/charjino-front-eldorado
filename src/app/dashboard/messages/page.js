import HeaderBar from "../../../components/eldorado/HeaderBar";
import CategoryNav from "../../../components/eldorado/CategoryNav";
import DashboardShell from "../../../components/eldorado/DashboardShell";
import DashboardPageHeader from "../../../components/eldorado/DashboardPageHeader";
import Footer from "../../../components/eldorado/Footer";
import ChatBubble from "../../../components/eldorado/ChatBubble";
import {
  DASHBOARD_USER,
  DASHBOARD_MESSAGES_PAGE,
} from "../../../components/eldorado/data/dashboardData";

/* Dashboard page /dashboard/messages (own .make capture `ui ux/Messages/…`,
   decoded 2026-11-05, 1920-only): header "Messages" (no action button) and
   a tall (900px) empty chat column — the shared 100px empty-state image,
   bold 24px "Uh oh looks like you dont have any chats yet." and the gray
   purchase hint. The empty block is inline (not the EmptyState component):
   the capture centers it without the component's top padding. Sidebar
   active row: Messages. */

export const metadata = {
  title: "Dashboard Messages - Eldorado",
  description: "Your chats with sellers on Eldorado.",
};

export default function DashboardMessagesPage() {
  const { icon, title, emptyState } = DASHBOARD_MESSAGES_PAGE;
  return (
    <div className="min-h-screen bg-page text-ink">
      <HeaderBar loggedIn user={DASHBOARD_USER} />
      <CategoryNav />
      <main className="isolate">
        <DashboardShell active="Messages">
          <DashboardPageHeader icon={icon} title={title} />
          <div className="relative mt-[14px] h-[900px] max-w-[1048px] px-6">
            <div className="flex justify-center px-[30px]">
              <div className="flex max-w-[600px] flex-col items-center gap-3">
                <div className="h-[100px] shrink-0 overflow-hidden">
                  <img alt={emptyState.imageAlt} src={emptyState.image} className="block size-[100px] object-cover align-middle" />
                </div>
                <div className="text-center text-[24px] font-bold leading-[36px]">{emptyState.title}</div>
                <div className="pt-1 text-center text-[rgb(106,_102,_123)]">{emptyState.text}</div>
              </div>
            </div>
          </div>
        </DashboardShell>
      </main>
      <Footer />
      <ChatBubble />
    </div>
  );
}
