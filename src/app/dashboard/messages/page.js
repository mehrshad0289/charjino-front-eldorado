import HeaderBar from "../../../components/eldorado/HeaderBar";
import CategoryNav from "../../../components/eldorado/CategoryNav";
import DashboardShell from "../../../components/eldorado/DashboardShell";
import DashboardPageHeader from "../../../components/eldorado/DashboardPageHeader";
import DashboardMessagesPanel from "../../../components/eldorado/DashboardMessagesPanel";
import Footer from "../../../components/eldorado/Footer";
import ChatBubble from "../../../components/eldorado/ChatBubble";
import { DASHBOARD_MESSAGES_PAGE } from "../../../components/eldorado/data/dashboardData";

/* Dashboard page /dashboard/messages. Session 17 built the EMPTY state
   from `ui ux/Messages/…`; session 22 rebuilt it per the user-pushed
   "messages-notempty" capture (`ui ux/messages-notempty/…(1).make`,
   decoded with decode_session22_messages.py): same 900px / mt-14 /
   max-w-1048 wrapper, but the content is now a filter chip row
   (All active dark + Boosting/Orders/Support/Pre-purchase) + an
   "Unread messages only" toggle + an aria-label="Chat" container that
   is EMPTY in the capture (the real chat is a client-rendered app —
   no conversation content exists in any reference, nothing invented).
   The capture's header carries the yellow '26' badge on the Messages
   icon and '9+' on Favorites (HeaderBar notiCount + favCount). The red
   bottom-right fixed alert in the capture contains only the stray text
   "noindex ." (a capture artifact, not page copy) — not implemented.
   Sidebar active row: Messages. Session 27: the 900px wrapper height
   (capture, chat container) applies from lg up only — below lg the
   column flows at natural height so the single-pane MessagesChat is
   not forced into the desktop-sized box. */

export const metadata = {
  title: "Dashboard Messages - Eldorado",
  description: "Your chats with sellers on Eldorado.",
};

export default function DashboardMessagesPage() {
  const { icon, title, chips, unreadToggleLabel } = DASHBOARD_MESSAGES_PAGE;
  return (
    <div className="min-h-screen bg-page text-ink">
      <HeaderBar />
      <CategoryNav />
      <main className="isolate">
        <DashboardShell active="Messages">
          <DashboardPageHeader icon={icon} title={title} />
          <div className="relative mt-[14px] max-w-[1048px] px-6 lg:h-[900px]">
            <DashboardMessagesPanel chips={chips} unreadToggleLabel={unreadToggleLabel} />
          </div>
        </DashboardShell>
      </main>
      <Footer />
      <ChatBubble />
    </div>
  );
}
