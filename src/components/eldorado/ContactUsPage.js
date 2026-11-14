import HeaderBar from "./HeaderBar";
import CategoryNav from "./CategoryNav";
import PageHero from "./PageHero";
import Footer from "./Footer";
import ChatBubble from "./ChatBubble";
import { CONTACT_BANNER, CONTACT_PAGE } from "./data/staticPagesData";
import { TICKET_INBOX, TICKET_NEW, ticketLoginHref } from "@/lib/tickets";

export default function ContactUsPage({ user = null }) {
  const cards = CONTACT_PAGE.cards.map((card) => {
    if (card.action.href === TICKET_NEW || card.action.href === TICKET_INBOX) {
      return {
        ...card,
        action: {
          ...card.action,
          href: user ? card.action.href : ticketLoginHref(card.action.href),
        },
      };
    }
    return card;
  });

  return (
    <div className="min-h-screen bg-page text-ink">
      <HeaderBar user={user} />
      <CategoryNav />
      <main>
        <PageHero
          image={CONTACT_BANNER}
          imageOpacity={0.5}
          title={CONTACT_PAGE.title}
          titleClassName="text-[32px] leading-[36px] max-md:min-h-16 lg:text-[48px] lg:leading-[52.8px]"
          minHeightClass="min-h-16"
        >
          <p className="px-4 pb-2 text-center text-[20px] leading-[30px] text-graytext">{CONTACT_PAGE.body}</p>
          <section className="mx-auto mt-12 w-full max-w-[900px] px-4 pb-16">
            <div className="flex w-full flex-wrap items-start gap-5">
              {cards.map((card) => (
                <div key={card.title} className="flex grow basis-[260px] flex-col gap-5">
                  <div className="flex grow flex-col items-start gap-5 rounded-xl border-[0.8px] border-cardborder bg-card p-6 shadow-[0_2px_4px_rgba(9,9,11,0.05),0_12px_8px_rgba(9,9,11,0.02)]">
                    <span className={`self-start rounded-sm p-2 ${card.iconBg}`}>
                      {card.icon === "chat" ? <ChatGlyph /> : card.icon === "list" ? <ListGlyph /> : <ArticlesGlyph />}
                    </span>
                    <div className="flex flex-col gap-1">
                      <h2 className="text-[20px] font-bold leading-[30px]">{card.title}</h2>
                      <p className="text-graytext">{card.text}</p>
                    </div>
                    <a
                      href={card.action.href}
                      aria-label={card.action.ariaLabel}
                      className={`inline-flex min-h-12 w-full min-w-[70px] items-center justify-center rounded-lg px-4 py-3 text-center font-bold leading-[19.2px] ${
                        card.action.dark ? "bg-darkbtn text-white" : "bg-badgebg text-[rgb(20,20,26)]"
                      }`}
                    >
                      {card.action.label}
                    </a>
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

function ListGlyph() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8 7h12M8 12h12M8 17h12" stroke="rgb(20,19,26)" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="4.5" cy="7" r="1.2" fill="rgb(20,19,26)" />
      <circle cx="4.5" cy="12" r="1.2" fill="rgb(20,19,26)" />
      <circle cx="4.5" cy="17" r="1.2" fill="rgb(20,19,26)" />
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
