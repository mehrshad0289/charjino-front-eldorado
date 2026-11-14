import CategoryNav from "../../components/eldorado/CategoryNav";
import DashboardShell from "../../components/eldorado/DashboardShell";
import ChatBubble from "../../components/eldorado/ChatBubble";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-page text-ink">
      <CategoryNav />
      <main className="isolate">
        <DashboardShell>{children}</DashboardShell>
      </main>
      <ChatBubble />
    </div>
  );
}
