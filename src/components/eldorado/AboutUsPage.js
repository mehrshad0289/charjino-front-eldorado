import Link from "next/link";
import CategoryNav from "./CategoryNav";
import Footer from "./Footer";
import ChatBubble from "./ChatBubble";
import FaqAccordion from "./FaqAccordion";
import ReviewCard from "./ReviewCard";
import TeamUpSection from "./TeamUpSection";
import TrustpilotStars, { TrustpilotLogo } from "./TrustpilotStars";
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
} from "./data/aboutData";

/* About Us — Eldorado about capture @1440/390 (and the 1920 snapshot).
   Header comes from ShopChrome. Banner is local; sections follow capture
   order. Side padding at lg tracks the 1440 frame (content 1120). */

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-page text-ink">
      <CategoryNav />
      <main>
        <div className="relative flex flex-col px-4 pt-8 pb-16 lg:px-[174px]">
          <div aria-hidden="true" className="absolute inset-0 z-0 overflow-hidden">
            <picture>
              {ABOUT_BANNER.mobileSrc ? <source media="(max-width: 599px)" srcSet={ABOUT_BANNER.mobileSrc} /> : null}
              <img
                alt={ABOUT_BANNER.alt}
                src={ABOUT_BANNER.src}
                fetchPriority="high"
                className="pointer-events-none absolute inset-0 block size-full max-w-full object-cover object-top align-middle"
              />
            </picture>
            <div
              className="absolute inset-x-0 top-1/2 bottom-0 z-[1]"
              style={{ backgroundImage: "linear-gradient(rgba(246,246,246,0) 0%, rgb(246,246,246) 100%)" }}
            />
          </div>
          <div className="relative z-[2] pb-2">
            <nav aria-label="مسیر صفحه" className="flex flex-wrap">
              {ABOUT_BREADCRUMB.map((item, i) => (
                <span key={item.label} className="flex items-center">
                  {i > 0 && (
                    <span aria-hidden="true" className="p-1 text-graytext rtl:rotate-180">
                      <BreadcrumbChevron />
                    </span>
                  )}
                  <Link
                    href={item.href}
                    className={`block text-[14px] leading-[19.6px] text-graytext ${item.bold ? "font-bold" : ""}`}
                  >
                    {item.label}
                  </Link>
                </span>
              ))}
            </nav>
          </div>
          <div className="relative z-[2] flex min-h-40 items-center justify-center lg:min-h-80">
            <h1 className="text-center text-[40px] font-bold leading-[44px] lg:text-[72px] lg:leading-[79.2px]">درباره ما</h1>
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-16 px-3.5 pt-16 pb-24 lg:gap-[170px] lg:pt-20 lg:pb-[172px]">
          <WhatIsSection />
          <PlaySection />
          <TeamSection />
          <StorySection />
          <TrustSection />
          <TeamUpSection data={ABOUT_TEAMUP} />
          <section className="mx-auto w-full max-w-[700px]" aria-label={ABOUT_FAQ.title}>
            <div className="mb-6 text-center text-[28px] font-bold leading-[34px] lg:text-[36px] lg:leading-[43.2px]">{ABOUT_FAQ.title}</div>
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
    <section className="flex flex-col items-center" aria-labelledby="about-whatis">
      <h2 id="about-whatis" className="text-center text-[32px] font-bold leading-[36px] lg:text-[48px] lg:leading-[52.8px]">
        {title}
      </h2>
      <div className="mt-16 flex items-center gap-10 lg:gap-12 max-md:flex-col">
        <div className="flex w-full flex-col gap-4 text-center lg:w-[352px]">
          <p className="text-center font-bold text-empower">{mission.label}</p>
          <h3 className="mb-[10px] text-center text-[24px] font-bold leading-[28px]">{mission.text}</h3>
        </div>
        <div className="w-px self-stretch bg-cardborder max-md:hidden" />
        <div className="h-px w-24 bg-cardborder md:hidden" />
        <div className="flex w-full flex-col gap-4 text-center lg:w-[323px]">
          <p className="text-center font-bold text-empower">{vision.label}</p>
          <h3 className="mb-[10px] text-center text-[24px] font-bold leading-[28px]">{vision.text}</h3>
        </div>
      </div>
      <p className="mt-16 max-w-[880px] text-center text-graytext">{body}</p>
      <div className="mt-[62px] grid w-full grid-cols-2 justify-items-center gap-5 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`mx-auto w-full px-[15px] text-center ${i < stats.length - 1 ? "border-e-[0.8px] border-cardborder max-lg:[&:nth-child(2)]:border-e-0" : ""}`}
          >
            <div className="mb-1 text-center text-[24px] font-bold leading-[28.8px]">{stat.value}</div>
            <div className="text-center text-bloggray">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PlaySection() {
  const { title, body, cards, empower } = ABOUT_PLAY;
  return (
    <section className="flex flex-col items-center" aria-labelledby="about-play">
      <h2 id="about-play" className="max-w-[536px] text-center text-[32px] font-bold leading-[36px] lg:text-[48px] lg:leading-[52.8px]">
        {title}
      </h2>
      <p className="mt-8 max-w-[860px] text-center text-graytext">{body}</p>
      <div className="mt-16 flex w-full gap-6 max-lg:flex-wrap">
        {cards.map((card) => (
          <div
            key={card.title}
            className="flex grow basis-0 flex-col items-center gap-4 rounded-2xl border-[0.8px] border-cardborder px-4 pt-5 pb-6 max-lg:min-w-[220px]"
            style={{ backgroundImage: "linear-gradient(in oklab, rgb(255,255,255) 14.42%, rgb(239,239,241) 100%)" }}
          >
            <h3 className="text-center text-[20px] font-bold leading-[30px]">{card.title}</h3>
            <span className="text-graytext" aria-hidden="true">
              <CardChevron />
            </span>
            <div className="flex w-full flex-col items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: card.iconBg }}>
                <img src={card.icon} alt="" width="24" height="24" className="size-6" />
              </span>
              <span className="block text-center font-bold text-graytext">{card.item}</span>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-16 max-w-[640px] text-center text-[20px] font-bold leading-[26px] lg:text-[24px] lg:leading-[28px]">
        {empower.lead}
        <span className="text-empower">{empower.accent}</span>
        {empower.tail}
      </p>
      <div className="mt-12 flex w-full flex-wrap justify-center gap-6">
        {empower.cards.map((card) => (
          <div
            key={card.text}
            className="flex w-[210px] gap-2 rounded-2xl border-[0.8px] border-cardborder px-4 py-5"
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
    <section className="flex flex-col items-center" aria-labelledby="about-team">
      <h2 id="about-team" className="text-center text-[32px] font-bold leading-[36px] lg:text-[48px] lg:leading-[52.8px]">
        {title}
      </h2>
      <p className="mt-8 mb-16 max-w-[860px] text-center text-graytext">{body}</p>
      <div className="flex w-full max-w-[880px] max-md:flex-col max-md:gap-10 lg:flex-row">
        {founders.map((person) => (
          <div key={person.name} className="flex grow basis-0 flex-col items-center gap-5 px-4 text-center lg:px-8">
            <div className="relative size-[250px] overflow-hidden rounded-3xl">
              <img alt={person.photoAlt} src={person.photo} loading="lazy" className="block size-full object-cover align-middle" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-1">
                <h3 className="mb-[10px] text-center text-[20px] leading-[30px]" dir="auto">
                  {person.name}
                </h3>
                <p className="text-center font-bold">{person.role}</p>
              </div>
              <p className="text-center text-[14px] leading-[19.6px] text-graytext">{person.tagline}</p>
            </div>
            <p className="text-center text-[14px] leading-[19.6px] text-graytext">{person.bio}</p>
          </div>
        ))}
      </div>
      <div className="mt-16 flex w-full gap-6 max-md:flex-col max-lg:items-center lg:flex-row">
        {photos.map((photo) => (
          <div key={photo.src} className="relative aspect-square w-full max-w-[420px] overflow-hidden rounded-3xl lg:w-[calc(33.3333%-16px)]">
            <img alt={photo.alt} src={photo.src} loading="lazy" className="block size-full object-cover align-middle" />
          </div>
        ))}
      </div>
    </section>
  );
}

function StorySection() {
  const { title, body, milestones } = ABOUT_STORY;
  return (
    <section className="flex flex-col items-center" aria-labelledby="about-story">
      <h2 id="about-story" className="max-w-[536px] text-center text-[32px] font-bold leading-[36px] lg:text-[48px] lg:leading-[52.8px]">
        {title}
      </h2>
      <p className="mt-8 max-w-[860px] text-center text-graytext">{body}</p>
      <ol className="mt-16 ms-2 flex w-full max-w-[674px] flex-col gap-12 border-s-2 border-cardborder">
        {milestones.map((item) => (
          <li key={item.year} className="relative flex flex-col items-start ps-8">
            <span aria-hidden="true" className="absolute start-0 top-0 size-4 rounded-full bg-brand" />
            <time className="mb-3 block rounded-full border-[0.8px] border-brand bg-white px-3 py-[2px] text-[14px] font-bold leading-[19.6px]">
              {item.year}
            </time>
            <h3 className="mb-2 font-bold">{item.title}</h3>
            <p className="text-[14px] leading-[19.6px] text-graytext">{item.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function TrustSection() {
  const { title, rating, reviews } = ABOUT_TRUST;
  return (
    <section className="flex flex-col items-center" aria-labelledby="about-trust">
      <h2 id="about-trust" className="mb-6 text-center text-[32px] font-bold leading-[36px] lg:text-[48px] lg:leading-[52.8px]">
        {title}
      </h2>
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center">
          <span className="block font-bold me-2">{rating}</span>
          <TrustpilotStars variant="header" size={18} full={5} half={0} gap={2} />
        </div>
        <div className="flex items-center">
          <TrustpilotLogo />
        </div>
      </div>
      <div className="mt-12 flex w-full gap-4 overflow-x-auto pb-2">
        {reviews.map((review, i) => (
          <ReviewCard key={`${review.name}-${i}`} review={review} />
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
