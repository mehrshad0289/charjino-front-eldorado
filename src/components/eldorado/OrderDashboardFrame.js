import HeaderBar from "./HeaderBar";
import CategoryNav from "./CategoryNav";
import DashboardShell from "./DashboardShell";
import DashboardPageHeader from "./DashboardPageHeader";
import Footer from "./Footer";
import ChatBubble from "./ChatBubble";

export default function OrderDashboardFrame({ user, active, title, children }) {
  return (
    <div className="min-h-screen bg-page text-ink">
      <HeaderBar user={user} />
      <CategoryNav />
      <main className="isolate">
        <DashboardShell active={active} user={user}>
          <DashboardPageHeader icon="orders" title={title} />
          <div className="mt-[32px] max-w-[1048px] px-6 pb-[50px]">{children}</div>
        </DashboardShell>
      </main>
      <Footer />
      <ChatBubble />
    </div>
  );
}
