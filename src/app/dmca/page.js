import HeaderBar from "../../components/eldorado/HeaderBar";
import CategoryNav from "../../components/eldorado/CategoryNav";
import DmcaDoc from "../../components/eldorado/DmcaDoc";
import Footer from "../../components/eldorado/Footer";
import ChatBubble from "../../components/eldorado/ChatBubble";
import { DASHBOARD_USER } from "../../components/eldorado/data/dashboardData";

/* DMCA page /dmca (user-pushed capture `ui ux/DMCA/…dmca…make`, decoded
   2026-11-04, session 18). LOGGED-IN header (the capture carries the
   avatar/username — unlike the 17c privacy/terms captures). Banner +
   max-w-3xl column with the overlapping 48px title; see DmcaDoc.js. */

export const metadata = {
  title: "DMCA - Eldorado",
  description: "How to submit a DMCA copyright claim to Eldorado.",
};

export default function DmcaPage() {
  return (
    <div className="min-h-screen bg-page text-ink">
      <HeaderBar loggedIn user={DASHBOARD_USER} />
      <CategoryNav />
      <main className="isolate">
        <DmcaDoc />
      </main>
      <Footer />
      <ChatBubble />
    </div>
  );
}
