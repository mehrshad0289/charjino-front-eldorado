import HeaderBar from "../../../components/eldorado/HeaderBar";
import CategoryNav from "../../../components/eldorado/CategoryNav";
import Footer from "../../../components/eldorado/Footer";
import ChatBubble from "../../../components/eldorado/ChatBubble";
import { DASHBOARD_USER } from "../../../components/eldorado/data/dashboardData";
import { VERIFY_BANNER, VERIFY_STATUS } from "../../../components/eldorado/data/verifyData";

/* Seller verification page /verify/status (session 20, per the
   user-pushed capture `ui ux/verify/
   www_eldorado_gg_verify_status_…make`, 1920-only): logged-in header —
   the capture's variant carries a yellow "26" count badge on the middle
   header icon and an orange "!" alert on the avatar (HeaderBar now takes
   optional notiCount/avatarAlert props; off on every other page) —
   category strip, then a centered max-w-648 column over the 465px
   banner + 340px fade (same pattern as the dashboard shell, capture's
   own banner image):
   - status card (white rounded-xl p-6, soft card shadow): red
     "Action required" badge (rgb(232,27,22), role=status) + soft-red
     info disc on the right; "Almost there..." 24 bold + gray 18/27
     subtitle (capture text verbatim — "thats", html.to.design strips
     apostrophes); dark "Continue verification" button (rgb(34,33,39),
     14 bold, min-h-42, rounded-lg) with a trailing arrow (icomoon glyph
     decodes empty → inline SVG, documented assumption).
   - three white info cards (rounded-lg px-6 py-4, gap-12 between):
     "What happens next" (3-item ul, pl-5, gray), "Why verification
     matters" (gray paragraph), "Need help?" (Seller FAQ external +
     Contact support → internal /contact-us; linkblue 14/19.6).
   Footer + ChatBubble. Below 1920 the column just narrows (no other
   reference — live page is client-rendered behind a login; documented). */

export const metadata = {
  title: "Seller Verification - Eldorado",
  description:
    "Verify your seller account to list offers, access full payouts and chat safely with buyers on Eldorado.",
};

function InfoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="rgb(20,19,26)" strokeWidth="1.8" />
      <path d="M12 11v5" stroke="rgb(20,19,26)" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="8" r="1.2" fill="rgb(20,19,26)" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 12h15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="m13 6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function VerifyStatusPage() {
  const { badge, badgeBg, title, subtitle, cta, next, why, help, cardShadow, infoPillBg } =
    VERIFY_STATUS;
  return (
    <div className="min-h-screen bg-page text-ink">
      <HeaderBar loggedIn user={DASHBOARD_USER} notiCount={26} avatarAlert />
      <CategoryNav />
      <main className="isolate relative min-h-[1200px]">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[465px] overflow-hidden">
          <img
            alt="Background image"
            src={VERIFY_BANNER}
            className="block h-[465px] w-full object-cover align-middle"
            style={{ objectPosition: "50% 15%" }}
          />
          <div
            className="absolute inset-x-0 -bottom-px h-[340px]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(246, 246, 246, 0) 0%, rgb(246, 246, 246) 100%)",
            }}
          />
        </div>

        <div className="relative z-[1] flex flex-col items-center gap-8 px-4 pb-10 pt-10">
          <div className="flex w-full max-w-[648px] flex-col gap-6">
            {/* status card */}
            <div
              className="flex w-full flex-col items-end gap-6 rounded-xl bg-white p-6"
              style={{ boxShadow: cardShadow }}
            >
              <div className="flex flex-grow items-center justify-between self-stretch">
                <div
                  role="status"
                  aria-label={badge}
                  className="flex max-w-fit items-center justify-center rounded-lg px-3 pb-[6px] pt-[5px] text-[14px] leading-[normal] text-white"
                  style={{ backgroundColor: badgeBg }}
                >
                  <span className="block">{badge}</span>
                </div>
                <div
                  className="flex items-center rounded-full p-1"
                  style={{ backgroundColor: infoPillBg }}
                >
                  <InfoIcon />
                </div>
              </div>
              <div className="flex flex-col items-start self-stretch">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col items-start gap-2">
                    <p className="text-[24px] font-bold leading-[28.8px]">{title}</p>
                    <p className="text-[18px] leading-[27px] text-graytext">{subtitle}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-start gap-2 self-stretch">
                <div>
                  <button
                    type="button"
                    aria-label={cta}
                    className="inline-block min-h-[42px] w-full min-w-[70px] overflow-hidden rounded-lg bg-[rgb(34,_33,_39)] px-4 pb-[10px] pt-[10px] text-center text-[14px] font-bold leading-[21px] text-white"
                  >
                    <span className="flex items-center justify-center gap-[6px] text-center">
                      <span className="block text-center">{cta}</span>
                      <ArrowRightIcon />
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* info cards */}
            <div className="flex w-full flex-col gap-3">
              <div
                className="flex flex-col items-start justify-center gap-2 rounded-lg bg-white px-6 pb-4 pt-4"
                style={{ boxShadow: cardShadow }}
              >
                <p className="text-[18px] font-bold leading-[27px]">{next.title}</p>
                <ul className="list-disc pl-5 text-graytext">
                  {next.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div
                className="flex flex-col items-start justify-center gap-2 rounded-lg bg-white px-6 pb-4 pt-4"
                style={{ boxShadow: cardShadow }}
              >
                <p className="text-[18px] font-bold leading-[27px]">{why.title}</p>
                <p className="text-graytext">{why.body}</p>
              </div>
              <div
                className="flex flex-col items-start justify-center gap-2 rounded-lg bg-white px-6 pb-4 pt-4"
                style={{ boxShadow: cardShadow }}
              >
                <p className="text-[18px] font-bold leading-[27px]">{help.title}</p>
                <div className="flex items-start gap-4">
                  {help.links.map((link) => (
                    <a
                      key={link.title}
                      href={link.href}
                      {...(link.external ? { target: "_blank", rel: "noreferrer" } : {})}
                      className="block text-[14px] leading-[19.6px] text-linkblue"
                    >
                      {link.title}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ChatBubble />
    </div>
  );
}
