import HeaderBar from "../../components/eldorado/HeaderBar";
import CategoryNav from "../../components/eldorado/CategoryNav";
import LegalDoc from "../../components/eldorado/LegalDoc";
import Footer from "../../components/eldorado/Footer";
import ChatBubble from "../../components/eldorado/ChatBubble";
import { DASHBOARD_USER } from "../../components/eldorado/data/dashboardData";
import { DSA_HTML } from "../../components/eldorado/data/legalData";

/* DSA page /dsa (user-pushed capture `ui ux/dsa/…dsa…make`, decoded
   2026-11-04, session 18). LOGGED-IN header (the capture carries the
   avatar/username — unlike the 17c privacy/terms captures). Content =
   verbatim extracted HTML (DSA Article 11/12 point-of-contact +
   Article 13/14 complaint sections) rendered through LegalDoc in the
   capture's 682px column — same template as privacy-policy/terms. */

export const metadata = {
  title: "DSA - Eldorado",
  description: "Digital Services Act point of contact and complaint rules.",
};

export default function DsaPage() {
  return (
    <div className="min-h-screen bg-page text-ink">
      <HeaderBar loggedIn user={DASHBOARD_USER} />
      <CategoryNav />
      <main className="isolate">
        <LegalDoc html={DSA_HTML} />
      </main>
      <Footer />
      <ChatBubble />
    </div>
  );
}
