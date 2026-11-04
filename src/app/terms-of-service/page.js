import HeaderBar from "../../components/eldorado/HeaderBar";
import CategoryNav from "../../components/eldorado/CategoryNav";
import LegalDoc from "../../components/eldorado/LegalDoc";
import Footer from "../../components/eldorado/Footer";
import ChatBubble from "../../components/eldorado/ChatBubble";
import { TERMS_HTML } from "../../components/eldorado/data/legalData";

/* Terms of service page /terms-of-service (user-pushed capture
   `ui ux/terms-of-service/…terms-of-service…make`, decoded 2026-11-05,
   session 17c). Logged-OUT header. Content = verbatim extracted HTML:
   the Current ToS (effective until Nov 30th 2026, sections 2-15) plus
   the New General / Buyer / Seller ToS blocks (effective from Dec 1st
   2026), rendered through LegalDoc in the capture's 682px column. The
   footer's Terms of Service link was pre-wired to this route. */

export const metadata = {
  title: "Terms of Service - Eldorado",
  description: "Eldorado marketplace terms of service.",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-page text-ink">
      <HeaderBar />
      <CategoryNav />
      <main className="isolate">
        <LegalDoc html={TERMS_HTML} />
      </main>
      <Footer />
      <ChatBubble />
    </div>
  );
}
