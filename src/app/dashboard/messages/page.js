import HeaderBar from "../../../components/eldorado/HeaderBar";
import CategoryNav from "../../../components/eldorado/CategoryNav";
import DashboardShell from "../../../components/eldorado/DashboardShell";
import DashboardPageHeader from "../../../components/eldorado/DashboardPageHeader";
import MessagesFilterBar from "../../../components/eldorado/MessagesFilterBar";
import Footer from "../../../components/eldorado/Footer";
import ChatBubble from "../../../components/eldorado/ChatBubble";
import {
  DASHBOARD_USER,
  DASHBOARD_MESSAGES_PAGE,
} from "../../../components/eldorado/data/dashboardData";

/* Dashboard page /dashboard/messages — REBUILT session 23 from the newer
   user-pushed "not-empty" capture `ui ux/messages-notempty/…(1).make`
   (commit 8111ede, decoded snapshots/msgnotempty-1920px-light-{1,2}.tsx,
   1920-only). Anatomy: logged-in header + CategoryNav + dashboard shell
   (465px banner, 260px sidebar with Messages active) + yellow-icon h1
   "Messages" 30/36 + 900px max-w-1048 column (mt-14, px-6) opening with
   the filter bar (tabs All/Support/Pre-purchase + "Unread messages only"
   toggle, gap 16) and the chat area.
   The chat inbox is a client-rendered widget on live (live SSR HTML has
   no tabs/toggle/chat — probed 2026-11-05) and never serializes into the
   capture: the mount div (aria-label="Chat") stays EMPTY verbatim, same
   documented precedent as the boosting page's unrendered carousel. The
   superseded empty-state anatomy (old `ui ux/Messages/` capture, session
   17) is retired from the render; its strings remain in dashboardData. */

export const metadata = {
  title: "Dashboard Messages - Eldorado",
  description: "Your chats with sellers on Eldorado.",
};

export default function DashboardMessagesPage() {
  const { icon, title, tabs, unreadToggleLabel } = DASHBOARD_MESSAGES_PAGE;
  return (
    <div className="min-h-screen bg-page text-ink">
      <HeaderBar loggedIn user={DASHBOARD_USER} />
      <CategoryNav />
      <main className="isolate">
        <DashboardShell active="Messages">
          <DashboardPageHeader icon={icon} title={title} />
          <div className="relative mt-[14px] h-[900px] max-w-[1048px] px-6">
            <div className="flex h-full flex-col gap-4">
              <MessagesFilterBar tabs={tabs} unreadLabel={unreadToggleLabel} />
              <div className="flex grow basis-0 flex-col">
                <div className="h-full">
                  <div
                    aria-label="Chat"
                    className="size-full overflow-clip align-middle"
                  />
                </div>
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
