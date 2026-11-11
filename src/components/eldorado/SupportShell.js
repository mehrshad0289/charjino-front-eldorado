import HeaderBar from "./HeaderBar";
import CategoryNav from "./CategoryNav";
import Footer from "./Footer";
import ChatBubble from "./ChatBubble";
import { SUPPORT_HOME } from "./data/supportData";

export default function SupportShell({ title, children }) {
  return (
    <div className="min-h-screen bg-page text-ink">
      <HeaderBar />
      <CategoryNav />
      <main className="mx-auto w-full max-w-[800px] px-4 py-10 md:px-6">
        <p className="text-[13px] font-bold">
          <a href={SUPPORT_HOME} className="text-linkblue">
            مرکز راهنمای شارژینو
          </a>
        </p>
        <h1 className="mt-3 text-[28px] font-bold leading-[34px]">{title}</h1>
        <div className="mt-6 text-[15px] leading-[28px]">{children}</div>
      </main>
      <Footer />
      <ChatBubble />
    </div>
  );
}
