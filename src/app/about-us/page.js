import HeaderBar from "../../components/eldorado/HeaderBar";
import CategoryNav from "../../components/eldorado/CategoryNav";
import PageHero from "../../components/eldorado/PageHero";
import TrustpilotStars, { TrustpilotLogo } from "../../components/eldorado/TrustpilotStars";
import ReviewCard from "../../components/eldorado/ReviewCard";
import FaqAccordion from "../../components/eldorado/FaqAccordion";
import TeamUpSection from "../../components/eldorado/TeamUpSection";
import Footer from "../../components/eldorado/Footer";
import ChatBubble from "../../components/eldorado/ChatBubble";
import { DASHBOARD_USER } from "../../components/eldorado/data/dashboardData";
import {
  ABOUT_BANNER,
  ABOUT_BREADCRUMB,
  ABOUT_WHATIS,
  ABOUT_PLAY,
  ABOUT_TEAM,
  ABOUT_STORY,
  ABOUT_TRUST,
  ABOUT_TEAMUP,
  ABOUT_FAQ,
} from "../../components/eldorado/data/aboutData";

/* About Us page (/about-us) — session 12, implementing the user-pushed
   about-us .make capture (decoded snapshots/about-1920px-light-1.tsx,
   1920-only). The capture shows the LOGGED-IN header (profile avatar, no
   Log in button) — the shared HeaderBar loggedIn variant. Sections follow
   the capture order: banner + breadcrumb + H1, "What is Eldorado.gg?"
   (mission/vision + stats), "Shape the way you play" cards, "We empower
   players to OWN", "Meet the team" (founders + photos), "Our story"
   timeline, Trustpilot reviews, "Lets team up" (bubble + mascot + CTA
   cards) and the FAQ (only "How to find the best deal" carries an answer
   in the capture — the other rows are static). The 174px body side padding
   is desktop-only from the 1920 capture; below lg it collapses to a
   comfortable fluid padding (documented approximation). */

export const metadata = {
  title: "About Us - Eldorado",
  description:
    "Eldorado.gg is the marketplace to safely buy and sell in-game items, currency, top-ups, accounts and boosting services — trusted by millions of gamers.",
};

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-page text-ink">
      <HeaderBar loggedIn user={DASHBOARD_USER} />
      <CategoryNav />
      <main>
        {/* Banner + breadcrumb + H1 live in a bounded hero (~444px on the
            live page: pt-8 + breadcrumb + min-h-80 title + pb-16); the
            content sections are a SIBLING below — the capture's flattened
            DOM hoisted them into the hero wrapper (live probe 2026-11-04:
            wrapper h=444, banner img 1905x444 absolute). */}
        <div className="relative flex flex-col pb-16 pt-8 max-lg:px-4 lg:px-[174px]">
          <div aria-hidden="true" className="absolute inset-0 z-0 overflow-hidden">
            <img
              alt={ABOUT_BANNER.alt}
              src={ABOUT_BANNER.src}
              className="absolute left-0 top-0 block size-full max-w-full object-cover object-top align-middle"
            />
            <div
              className="absolute bottom-0 left-0 right-0 top-1/2 z-[1]"
              style={{ backgroundImage: "linear-gradient(rgba(246,246,246,0) 0%, rgb(246,246,246) 100%)" }}
            />
          </div>
          <div className="relative z-[2] pb-2">
            <nav aria-label="Breadcrumb" className="flex flex-wrap">
              {ABOUT_BREADCRUMB.map((item, i) => (
                <span key={item.label} className="flex items-center">
                  {i > 0 && (
                    <span aria-hidden="true" className="p-1 text-graytext">
                      <BreadcrumbChevron />
                    </span>
                  )}
                  <a
                    href={item.href}
                    className={`block text-[14px] leading-[19.6px] text-graytext ${item.bold ? "font-bold" : ""}`}
                  >
                    {item.label}
                  </a>
                </span>
              ))}
            </nav>
          </div>
          <div className="relative z-[2] flex min-h-80 items-center justify-center">
            <h1 className="text-center text-[40px] font-bold leading-[44px] max-md:min-h-40 lg:text-[72px] lg:leading-[79.2px]">
              About Us
            </h1>
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-20 px-3.5 pb-[172px] pt-20 max-lg:gap-16 max-lg:pb-24 max-lg:pt-16 lg:gap-[170px]">
          <WhatIsSection />
          <PlaySection />
          <TeamSection />
          <StorySection />
          <TrustSection />
          <TeamUpSection data={ABOUT_TEAMUP} />
          <section className="mx-auto w-full max-w-[700px]" aria-label="FAQ">
            <div className="mb-6 text-center text-[36px] font-bold leading-[43.2px]">{ABOUT_FAQ.title}</div>
            <FaqAccordion items={ABOUT_FAQ.items} />
          </section>
        </div>
      </main>
      <Footer />
      <ChatBubble />
    </div>
  );
}

function WhatIsSection() {
  const { title, mission, vision, body, stats } = ABOUT_WHATIS;
  return (
    <section className="flex flex-col items-center" aria-label={title}>
      <h2 className="text-center text-[32px] font-bold leading-[36px] max-md:min-h-20 lg:text-[48px] lg:leading-[52.8px]">
        {title}
      </h2>
      <div className="mt-16 flex max-md:flex-col max-md:gap-10 lg:mt-16 lg:items-center lg:gap-12">
        <div className="flex w-full flex-col gap-4 text-center max-md:mx-auto lg:w-[352px]">
          <p className="text-center font-bold text-empower">{mission.label}</p>
          <h3 className="mb-[10px] text-center text-[24px] font-bold leading-[28px]">{mission.text}</h3>
        </div>
        <div className="w-px self-stretch bg-cardborder max-md:hidden" />
        <div className="flex w-full flex-col gap-4 text-center max-md:mx-auto lg:w-[323px]">
          <p className="text-center font-bold text-empower">{vision.label}</p>
          <h3 className="mb-[10px] text-center text-[24px] font-bold leading-[28px]">{vision.text}</h3>
        </div>
      </div>
      <p className="mt-16 max-w-[880px] text-center text-graytext">{body}</p>
      <div className="mt-[62px] grid w-full grid-cols-2 justify-items-center gap-5 max-lg:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`mx-auto w-full px-[15px] text-center ${i < stats.length - 1 ? "border-r-[0.8px] border-cardborder max-lg:[&:nth-child(2)]:border-r-0" : ""}`}
          >
            <div className="mb-1 text-center text-[24px] font-bold leading-[28.8px]">{s.value}</div>
            <div className="text-center text-bloggray">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PlaySection() {
  const { title, body, cards, empower } = ABOUT_PLAY;
  return (
    <section className="flex flex-col items-center" aria-label={title}>
      <h2 className="max-w-[536px] text-center text-[32px] font-bold leading-[36px] max-md:min-h-20 lg:text-[48px] lg:leading-[52.8px]">
        {title}
      </h2>
      <p className="mt-8 max-w-[860px] text-center text-graytext">{body}</p>
      <div className="mt-16 flex w-full gap-6 max-lg:flex-wrap">
        {cards.map((card) => (
          <div
            key={card.title}
            className="flex grow basis-0 flex-col items-center gap-4 rounded-2xl border-[0.8px] border-cardborder px-4 pb-6 pt-5 max-lg:min-w-[220px]"
            style={{ backgroundImage: "linear-gradient(in oklab, rgb(255,255,255) 14.42%, rgb(239,239,241) 100%)" }}
          >
            <h3 className="text-center text-[20px] font-bold leading-[30px]">{card.title}</h3>
            <span className="text-graytext" aria-hidden="true">
              <CardChevron />
            </span>
            <div className="flex w-full flex-col items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: card.iconBg }}>
                <WhiteDot />
              </span>
              <span className="block text-center font-bold text-graytext">{card.item}</span>
            </div>
          </div>
        ))}
      </div>
      <p className="max-w-[640px] text-center text-[24px] font-bold leading-[28px]">
        {empower.lead}
        <span className="text-empower">{empower.accent}</span>
        {empower.tail}
      </p>
      <div className="mt-12 flex w-full flex-wrap justify-center gap-6">
        {empower.cards.map((card) => (
          <div
            key={card.text}
            className="flex w-[210px] gap-2 rounded-2xl border-[0.8px] border-cardborder pb-5 pl-4 pr-4 pt-5"
            style={{ backgroundImage: "linear-gradient(in oklab, rgb(239,239,241) 0%, rgb(255,255,255) 85.58%)" }}
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-empower/20">
              <img src={card.icon} alt="" width="16" height="16" loading="lazy" className="size-4" />
            </span>
            <span className="block font-bold">
              <span className="text-empower">{card.accent}</span>
              {card.text}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function TeamSection() {
  const { title, body, founders, photos } = ABOUT_TEAM;
  return (
    <section className="flex flex-col items-center" aria-label={title}>
      <h2 className="text-center text-[32px] font-bold leading-[36px] max-md:min-h-20 lg:text-[48px] lg:leading-[52.8px]">
        {title}
      </h2>
      <p className="mb-16 mt-8 max-w-[860px] text-center text-graytext">{body}</p>
      <div className="flex w-full max-w-[880px] max-md:flex-col max-md:gap-10 lg:flex-row">
        {founders.map((f) => (
          <div key={f.name} className="flex grow basis-0 flex-col items-center gap-5 text-center max-lg:px-4 lg:px-8">
            <div className="relative size-[250px] overflow-hidden rounded-3xl">
              <img alt={f.photoAlt} src={f.photo} loading="lazy" className="block size-full object-cover align-middle" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-1">
                <h3 className="mb-[10px] text-center text-[20px] leading-[30px]">{f.name}</h3>
                <p className="text-center font-bold">{f.role}</p>
              </div>
              <p className="text-center text-[14px] leading-[19.6px] text-graytext">{f.tagline}</p>
            </div>
            <p className="text-center text-[14px] leading-[19.6px] text-graytext">{f.bio}</p>
          </div>
        ))}
      </div>
      <div className="mt-16 flex w-full gap-6 max-md:flex-col max-lg:items-center lg:flex-row">
        {photos.map((p) => (
          <div key={p.src} className="relative aspect-square w-full max-w-[420px] overflow-hidden rounded-3xl lg:w-[calc(33.3333%-16px)]">
            <img alt={p.alt} src={p.src} loading="lazy" className="block size-full object-cover align-middle" />
          </div>
        ))}
      </div>
    </section>
  );
}

function StorySection() {
  const { title, body, milestones } = ABOUT_STORY;
  return (
    <section className="flex flex-col items-center" aria-label={title}>
      <h2 className="max-w-[536px] text-center text-[32px] font-bold leading-[36px] max-md:min-h-20 lg:text-[48px] lg:leading-[52.8px]">
        {title}
      </h2>
      <p className="mt-8 max-w-[860px] text-center text-graytext">{body}</p>
      <ol className="ml-2 mt-16 flex w-full max-w-[674px] flex-col gap-12 border-l-2 border-cardborder">
        {milestones.map((m) => (
          <li key={m.year} className="relative flex flex-col items-start pl-8">
            <span aria-hidden="true" className="absolute left-0 top-0 size-4 rounded-full bg-brand" />
            <time className="mb-3 block rounded-full border-[0.8px] border-brand bg-white px-3 py-[2px] text-[14px] font-bold leading-[19.6px]">
              {m.year}
            </time>
            <h3 className="mb-2 font-bold">{m.title}</h3>
            <p className="text-[14px] leading-[19.6px] text-graytext">{m.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function TrustSection() {
  const { title, rating, reviews } = ABOUT_TRUST;
  return (
    <section className="flex flex-col items-center" aria-label={title}>
      <h2 className="mb-6 text-center text-[32px] font-bold leading-[36px] max-md:min-h-20 lg:text-[48px] lg:leading-[52.8px]">
        {title}
      </h2>
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center">
          <span className="mr-2 block font-bold">{rating}</span>
          <TrustpilotStars variant="header" size={18} full={5} half={0} gap={2} />
        </div>
        <div className="flex items-center">
          <TrustpilotLogo />
        </div>
      </div>
      <div className="mt-12 flex w-full gap-4 overflow-x-auto pb-2">
        {reviews.map((r, i) => (
          <ReviewCard key={`${r.name}-${i}`} review={r} />
        ))}
      </div>
    </section>
  );
}

function BreadcrumbChevron() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="m4.5 2.5 3.5 3.5-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CardChevron() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WhiteDot() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m7 13 3 3 7-8" stroke="rgb(20,19,26)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
