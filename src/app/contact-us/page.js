import HeaderBar from "../../components/eldorado/HeaderBar";
import CategoryNav from "../../components/eldorado/CategoryNav";
import PageHero from "../../components/eldorado/PageHero";
import Footer from "../../components/eldorado/Footer";
import ChatBubble from "../../components/eldorado/ChatBubble";
import { DASHBOARD_USER } from "../../components/eldorado/data/dashboardData";
import { CONTACT_BANNER, CONTACT_PAGE } from "../../components/eldorado/data/staticPagesData";

/* Contact Us page (/contact-us) — session 12, implementing the user-pushed
   contact-us .make capture (native fig-make file, decoded via
   scripts/decode_contact_capture.py → snapshots/contact-1920px-light-1.tsx,
   1920-only). Logged-in header (profile avatar) + the shared banner asset
   at 50% opacity, H1 + subtitle, then the two help cards (live chat with
   the dark "Start chat" button — the capture has no href for it, the live
   widget opens Intercom — and help-center search linking to
   support.eldorado.gg per the capture). The capture's card icons decode
   empty (icomoon) — inline SVG stand-ins with matching semantics. */

export const metadata = {
  title: "Contact Us - Eldorado",
  description: "Contact Eldorado — 24/7 human support for your order, dispute, and account issues.",
};

export default function ContactUsPage() {
  return (
    <div className="min-h-screen bg-page text-ink">
      <HeaderBar loggedIn user={DASHBOARD_USER} />
      <CategoryNav />
      <main>
        <PageHero
          image={CONTACT_BANNER}
          imageOpacity={0.5}
          title={CONTACT_PAGE.title}
          titleClassName="text-[32px] leading-[36px] max-md:min-h-16 lg:text-[48px] lg:leading-[52.8px]"
          minHeightClass="min-h-16"
        >
          <p className="pb-2 pl-4 pr-4 text-center text-[20px] leading-[30px] text-graytext">
            {CONTACT_PAGE.body}
          </p>
          <section className="mx-auto mt-12 w-full max-w-[900px] px-4 pb-12">
            <div className="flex w-full flex-wrap items-start gap-5">
              {CONTACT_PAGE.cards.map((card) => (
                <div key={card.title} className="flex grow basis-[300px] flex-col gap-5">
                  <div className="flex grow flex-col items-start gap-5 rounded-xl border-[0.8px] border-cardborder bg-card p-6 shadow-[0_2px_4px_rgba(9,9,11,0.05),0_12px_8px_rgba(9,9,11,0.02)]">
                    <span className={`self-start rounded-sm p-2 ${card.iconBg}`}>
                      {card.icon === "chat" ? <ChatGlyph /> : <ArticlesGlyph />}
                    </span>
                    <div className="flex flex-col gap-1">
                      <h2 className="text-[20px] font-bold leading-[30px]">{card.title}</h2>
                      <p className="text-graytext">{card.text}</p>
                    </div>
                    {card.action.href ? (
                      <a
                        href={card.action.href}
                        aria-label={card.action.ariaLabel}
                        className="inline-flex min-h-12 w-full min-w-[70px] items-center justify-center rounded-lg bg-badgebg px-4 py-3 text-center font-bold leading-[19.2px] text-[rgb(20,20,26)]"
                      >
                        <span className="block text-center">{card.action.label}</span>
                      </a>
                    ) : (
                      <button
                        type="button"
                        aria-label={card.action.ariaLabel}
                        className="inline-block min-h-12 w-full min-w-[70px] rounded-lg bg-darkbtn px-4 py-3 text-center font-bold text-white"
                      >
                        <span className="flex items-center justify-center gap-1.5 text-center">
                          <span className="block text-center">{card.action.label}</span>
                        </span>
                      </button>
                    )}
                    {card.footer && (
                      <>
                        <hr className="h-1 self-stretch border-t-[0.8px] border-cardborder" />
                        <p className="text-graytext">
                          {card.footer.before}
                          <button type="button" className="bg-black/0 text-center text-linkblue underline">
                            {card.footer.link.label}
                          </button>
                          {card.footer.after}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </PageHero>
      </main>
      <Footer />
      <ChatBubble />
    </div>
  );
}

function ChatGlyph() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 6.8C4 5.25 5.25 4 6.8 4h10.4C18.75 4 20 5.25 20 6.8v7.4c0 1.55-1.25 2.8-2.8 2.8H9l-3.6 3V17H6.8C5.25 17 4 15.75 4 14.2V6.8Z"
        stroke="rgb(20,19,26)"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArticlesGlyph() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6.5" stroke="rgb(20,19,26)" strokeWidth="1.7" />
      <path d="m20 20-4.8-4.8" stroke="rgb(20,19,26)" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}
