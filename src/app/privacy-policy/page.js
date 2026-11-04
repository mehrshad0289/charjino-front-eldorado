import HeaderBar from "../../components/eldorado/HeaderBar";
import CategoryNav from "../../components/eldorado/CategoryNav";
import LegalDoc from "../../components/eldorado/LegalDoc";
import Footer from "../../components/eldorado/Footer";
import ChatBubble from "../../components/eldorado/ChatBubble";
import { PRIVACY_POLICY_HTML } from "../../components/eldorado/data/legalData";

/* Privacy policy page /privacy-policy (user-pushed capture
   `ui ux/Privacy Policy/…privacy-policy…make`, decoded 2026-11-05,
   session 17c). Logged-OUT header (the capture has no avatar/username —
   unlike the about/contact pages' captures). Content = verbatim extracted
   HTML ("ELDORADO MARKET" kicker, PRIVACY POLICY h5, 7 numbered sections
   with lists and a cookie table worth of p/ul blocks) rendered through
   LegalDoc in the capture's 682px column. The footer's Privacy Policy
   link was pre-wired to this route and 404'd until now. */

export const metadata = {
  title: "Privacy Policy - Eldorado",
  description: "How Eldorado processes your personal data.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-page text-ink">
      <HeaderBar />
      <CategoryNav />
      <main className="isolate">
        <LegalDoc html={PRIVACY_POLICY_HTML} />
      </main>
      <Footer />
      <ChatBubble />
    </div>
  );
}
