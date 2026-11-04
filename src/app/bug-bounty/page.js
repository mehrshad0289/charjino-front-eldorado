import HeaderBar from "../../components/eldorado/HeaderBar";
import CategoryNav from "../../components/eldorado/CategoryNav";
import FaqAccordion from "../../components/eldorado/FaqAccordion";
import Footer from "../../components/eldorado/Footer";
import ChatBubble from "../../components/eldorado/ChatBubble";
import { DASHBOARD_USER } from "../../components/eldorado/data/dashboardData";
import { BUG_BOUNTY_PAGE } from "../../components/eldorado/data/staticPagesData";

/* Bug Bounty page (/bug-bounty) — session 12, implementing the user-pushed
   bug-bounty .make capture (decoded snapshots/bugbounty-1920px-light-1.tsx,
   1920-only). Logged-in header (profile avatar) + the cream hero band with
   the centered ninja image, then a max-w-3xl column: intro sections, the
   numbered 5-step program (mailto link + bold bounty amounts) and the
   Known Issues accordion — collapsed rows only, the capture has no bodies
   for them (nothing invented). */

export const metadata = {
  title: "Bug Bounty - Eldorado",
  description:
    "Report bugs and vulnerabilities on Eldorado and earn cash rewards — from $10 for minor issues to over $5,000 for critical flaws.",
};

export default function BugBountyPage() {
  const { hero, title, sections, steps, knownIssues } = BUG_BOUNTY_PAGE;
  return (
    <div className="min-h-screen bg-page text-ink">
      <HeaderBar loggedIn user={DASHBOARD_USER} />
      <CategoryNav />
      <main>
        <div className="flex h-[238px] w-full items-center justify-center bg-bountycream p-4 max-lg:h-40">
          <div className="h-[182px] shrink-0 overflow-hidden max-lg:h-32">
            <img
              alt={hero.alt}
              src={hero.src}
              width="197"
              height="182"
              className="block h-[182px] w-[197px] object-cover align-middle max-lg:h-32 max-lg:w-auto"
            />
          </div>
        </div>
        <div className="mx-auto mb-20 mt-[30px] w-full max-w-3xl px-4">
          <h1 className="mb-[50px] w-full text-center text-[32px] font-bold leading-[1.1] max-md:min-h-16 lg:text-[48px] lg:leading-[normal]">
            {title}
          </h1>
          {sections.map((s) => (
            <div key={s.heading} className="w-full">
              <h2 className="mb-[30px] text-[24px] font-bold leading-[normal]">{s.heading}</h2>
              {s.paragraphs.map((p) => (
                <p key={p.slice(0, 24)} className="mb-[30px] text-[18px] leading-[21px]">
                  {p}
                </p>
              ))}
            </div>
          ))}
          <div className="w-full">
            <h2 className="mb-[30px] text-[24px] font-bold leading-[normal]">{steps.heading}</h2>
            <ul className="text-graytext">
              {steps.items.map((item) => (
                <li key={item.parts[0].slice(0, 12)} className="mb-[10px] list-none text-[18px] leading-[27px]">
                  {item.parts}
                  {item.link && (
                    <a href={item.link.href} className="text-linkblue underline">
                      {item.link.label}
                    </a>
                  )}
                  {item.strong && (
                    <>
                      <strong className="font-bold">{item.strong}</strong>
                      {item.middle}
                      <strong className="font-bold">{item.strong2}</strong>
                    </>
                  )}
                  {item.partsAfter}
                </li>
              ))}
            </ul>
          </div>
          <div className="mx-auto mt-20 w-full max-w-3xl">
            <div className="mb-6 text-center text-[36px] font-bold leading-[43.2px]">{knownIssues.title}</div>
            <FaqAccordion items={knownIssues.items.map((q) => ({ q }))} static />
          </div>
        </div>
      </main>
      <Footer />
      <ChatBubble />
    </div>
  );
}
