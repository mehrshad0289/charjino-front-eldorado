import HeaderBar from "../../components/eldorado/HeaderBar";
import Footer from "../../components/eldorado/Footer";
import InfluencerFaq from "../../components/eldorado/InfluencerFaq";
import {
  INF_BANNER,
  INF_TRUST_CHIPS,
  INF_WHY,
  INF_WHO_INTRO,
  INF_WHO,
  INF_STEPS,
  INF_CTA,
  INF_FORM_GAMEPAD,
  INF_FIELDS,
  INF_AGENCIES,
  INF_FAQ,
} from "../../components/eldorado/data/influencerData";

/* Influencer Program page (/influencer-program) — session 15, per the
   user-pushed capture `ui ux/nfluencer-program/
   www_eldorado_gg_influencer-program_1920w_390w_1536w_default.make`
   (decoded to extracted/snapshots/influencer-1920px-light-{1,2}.tsx,
   1920-only; the "first commit" commit on origin is this capture, not a
   history rewrite). Layout per capture: hero with the geometric banner
   PNG object-cover object-top + white gradient fade over its bottom
   half, breadcrumb, centered H1 72px + subtext + yellow CTA; then a
   max-w-[1116px] column (gap 80) with: 3 trust pills, "Why Eldorado.gg?"
   (4 gradient cards, 80px icons), "Who can join?" (2fr intro | 3fr rows,
   40px icon boxes), "How it works?" (4 steps, 62px pastel number badges:
   lime/yellow/purple/blue), "Start earning today" CTA card (mascots
   flanking, aspect 182/59), white apply-form card (hairline section
   headers with icon, #efeff1 inputs h-42, dark "Apply now" button),
   agencies gradient card (mascot bottom-right, 332px reserved), FAQ
   (max-w-700, white rounded-lg accordion rows). Mobile layout per live
   @390 (live-influencer-390.png): chips/why/steps/form collapse to 1
   column, steps become badge-left rows, CTA keeps only the Currency
   mascot centered below the text, hero H1 40px.
   Known deviations: icomoon glyphs (chips shield/globe/star, who-rows
   youtube/tiktok, form header person, chevrons) substituted with inline
   SVG paths — no icomoon font in the project; FAQ answers scraped from
   live (closed in the capture); CTA buttons scroll to the form. */

export const metadata = {
  title: "Influencer Program | Eldorado.gg",
  description:
    "Share the best deals in gaming with your community and get paid generously. Join the Eldorado.gg influencer program.",
};

function ChipIcon({ name }) {
  const paths = {
    shield: <path d="M12 2 4 5.5v5.1c0 4.9 3.4 9.5 8 10.9 4.6-1.4 8-6 8-10.9V5.5L12 2Zm-1.2 13.6-3-3 1.4-1.4 1.6 1.6 4-4 1.4 1.4-5.4 5.4Z" fill="currentColor" />,
    globe: (
      <>
        <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm7.9 9h-3.4a15.6 15.6 0 0 0-1.2-5.5A8 8 0 0 1 19.9 11ZM12 4c.9 1.2 2 3.6 2.4 7H9.6C10 7.6 11.1 5.2 12 4ZM4.1 13h3.4c.2 2 .7 3.9 1.2 5.5A8 8 0 0 1 4.1 13Zm3.4-2H4.1a8 8 0 0 1 4.6-5.5A15.6 15.6 0 0 0 7.5 11ZM12 20c-.9-1.2-2-3.6-2.4-7h4.8c-.4 3.4-1.5 5.8-2.4 7Zm3.3-1.5c.5-1.6 1-3.5 1.2-5.5h3.4a8 8 0 0 1-4.6 5.5Z" fill="currentColor" />
      </>
    ),
    star: <path d="m12 2 2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.2l-6.1 3.4 1.4-6.8L2.2 9.1l6.9-.8L12 2Z" fill="currentColor" />,
  };
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" className="text-brand">
      {paths[name]}
    </svg>
  );
}

function WhoIcon({ row }) {
  if (row.img) {
    return <img src={row.img} alt={row.title} className="h-5 w-5 object-contain" />;
  }
  const paths = {
    youtube: <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15.2V8.8L15.5 12 10 15.2Z" fill="currentColor" />,
    tiktok: <path d="M16.6 3c.4 2.2 1.8 3.9 4.4 4.1v3c-1.7 0-3.2-.5-4.4-1.4v6.4a6 6 0 1 1-6-6c.3 0 .7 0 1 .1v3.1a3 3 0 1 0 2 2.8V3h3Z" fill="currentColor" />,
  };
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" className="text-brand-deep">
      {paths[row.icon]}
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" className="text-brand-deep">
      <path d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm0 2c-4 0-8 2-8 5.2V21h16v-1.8c0-3.2-4-5.2-8-5.2Z" fill="currentColor" />
    </svg>
  );
}

export default function InfluencerProgramPage() {
  const nameEmail = INF_FIELDS.filter((f) => f.id === "name" || f.id === "email");
  const channel = INF_FIELDS.find((f) => f.id === "channel");
  const nichePlatform = INF_FIELDS.filter((f) => f.id === "niche" || f.id === "platform");
  const locSubs = INF_FIELDS.filter((f) => f.id === "location" || f.id === "subscribers");

  const renderField = (f) => (
    <div key={f.id} className="relative">
      <label htmlFor={`inf-${f.id}`} className="mb-[6px] block w-full leading-[19.2px]">
        {f.label}
      </label>
      <input
        id={`inf-${f.id}`}
        type="text"
        aria-label={f.label}
        placeholder={f.placeholder}
        className="block h-[42px] w-full rounded-lg border-2 border-black/0 bg-inputgray pl-3 pr-2 pt-[5px] pb-[7px] leading-[19.2px]"
      />
    </div>
  );

  return (
    <>
      <HeaderBar />
      <main className="bg-page text-ink">
        {/* Hero */}
        <section className="relative overflow-hidden px-4 pt-8 pb-[60px] lg:px-[174px] lg:pb-[120px]">
          <img
            src={INF_BANNER}
            alt="Influencer Program Page Banner Image"
            className="pointer-events-none absolute left-0 top-0 block h-full w-full object-cover object-top"
          />
          <div
            className="absolute bottom-0 left-0 right-0 top-[50%]"
            style={{ backgroundImage: "linear-gradient(rgba(246, 246, 246, 0) 0%, rgb(246, 246, 246) 100%)" }}
          />
          <div className="relative">
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center">
              <a href="/" className="block text-[14px] leading-[19.6px] text-graytext hover:underline">
                Home
              </a>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" className="mx-1 text-graytext">
                <path d="m4.5 2.5 3.5 3.5-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="block text-[14px] font-bold leading-[19.6px]">Influencer Program</span>
            </nav>
            <div className="mt-[68px] flex flex-col items-center justify-center">
              <h1 className="mb-4 block text-center text-[40px] font-bold leading-[1.1] lg:mb-[16px] lg:text-[72px] lg:leading-[79.2px]">
                Influencer program
              </h1>
              <p className="mb-8 block text-center leading-6 lg:mb-[32px] lg:text-[20px] lg:leading-[30px]">
                Share the best deals in gaming with your community and get paid generously.
              </p>
              <a
                href="#apply"
                aria-label="Become a partner"
                className="inline-block min-h-14 w-full max-w-[360px] rounded-lg bg-brand px-4 pt-3 pb-3 text-center font-bold leading-6 lg:w-auto lg:min-w-[70px]"
              >
                Become a partner
              </a>
            </div>
          </div>
        </section>

        <div className="mx-auto flex w-full max-w-[1116px] flex-col gap-10 px-3 pb-20 lg:gap-[80px]">
          {/* Trust pills */}
          <div className="flex flex-col items-stretch justify-center gap-3 lg:flex-row lg:gap-[24px]">
            {INF_TRUST_CHIPS.map((c) => (
              <div key={c.title} className="flex grow flex-col items-center rounded-full bg-inputgray px-6 pt-2 pb-2 lg:basis-0">
                <span className="flex items-center gap-2 text-[20px] font-bold leading-[30px]">
                  <ChipIcon name={c.icon} />
                  {c.title}
                </span>
                <span className="block text-center text-graytext">{c.sub}</span>
              </div>
            ))}
          </div>

          {/* Why Eldorado.gg? */}
          <section className="flex flex-col items-center gap-12">
            <h2 className="block text-center text-[32px] font-bold leading-tight lg:text-[48px] lg:leading-[52.8px]">Why Eldorado.gg?</h2>
            <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {INF_WHY.map((card) => (
                <div
                  key={card.title}
                  className="flex grow flex-col items-start rounded-2xl border-[0.8px] border-cardborder px-6 pt-[34px] pb-[34px]"
                  style={{ backgroundImage: "linear-gradient(rgb(255, 255, 255) 14.42%, rgb(239, 239, 241) 100%)" }}
                >
                  <img src={card.icon} alt={card.alt} className="mb-4 h-20 w-20 object-contain" />
                  <h3 className="mb-3 block text-[24px] font-bold leading-[28.8px]">{card.title}</h3>
                  <p className="block text-[14px] leading-[19.6px] text-graytext">{card.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Who can join? */}
          <section className="flex flex-col gap-8 lg:flex-row lg:gap-[56px]">
            <div className="flex basis-[0%] flex-col gap-6 lg:grow-[2]">
              <h2 className="block text-center text-[32px] font-bold leading-tight lg:text-left lg:text-[48px] lg:leading-[52.8px]">
                Who can join?
              </h2>
              <p className="block text-center leading-[30px] lg:text-left lg:text-[20px]">{INF_WHO_INTRO}</p>
            </div>
            <div className="flex basis-[0%] flex-col gap-3 lg:grow-[3]">
              {INF_WHO.map((row) => (
                <div key={row.title} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-inputgray">
                    <WhoIcon row={row} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="block text-[20px] font-bold leading-[30px]">{row.title}</span>
                    <span className="block text-[20px] leading-[30px] text-graytext">{row.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* How it works? */}
          <section className="flex flex-col items-center gap-12">
            <h2 className="block text-center text-[32px] font-bold leading-tight lg:text-[48px] lg:leading-[52.8px]">How it works?</h2>
            <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-[48px]">
              {INF_STEPS.map((s) => (
                <div key={s.n} className="flex flex-col items-start gap-4 lg:items-center lg:gap-[24px] lg:pt-8 lg:pb-8">
                  <span
                    className="flex h-[62px] w-[62px] shrink-0 items-center justify-center rounded-lg text-[36px] font-bold leading-[43.2px] text-black"
                    style={{ backgroundColor: s.color }}
                  >
                    {s.n}
                  </span>
                  <div className="flex flex-col gap-3 lg:items-center">
                    <span className="block text-[24px] font-bold leading-[28.8px]">{s.title}</span>
                    <span className="block text-center text-graytext lg:text-center">{s.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Start earning today */}
          <section className="relative flex w-full items-center justify-center gap-2 rounded-3xl border-[0.8px] border-cardborder py-5"
            style={{ backgroundImage: "linear-gradient(in oklab, rgb(255, 255, 255) 0%, rgb(246, 246, 246) 100%)" }}
          >
            <div className="hidden h-full shrink-0 overflow-hidden lg:block" style={{ aspectRatio: "270 / 324" }}>
              <img src={INF_CTA.mascotLeft.src} alt={INF_CTA.mascotLeft.alt} className="block h-full w-full object-cover object-right" />
            </div>
            <div className="flex grow flex-col items-center basis-[0%] px-4 py-8 lg:py-0">
              <h2 className="mb-4 block text-center text-[32px] font-bold leading-tight lg:mb-[16px] lg:text-[48px] lg:leading-[52.8px]">
                {INF_CTA.title}
              </h2>
              <p className="mb-6 block text-center leading-[30px] lg:mb-[32px] lg:text-[20px]">{INF_CTA.sub}</p>
              <img src={INF_CTA.mascotRight.src} alt={INF_CTA.mascotRight.alt} className="mb-6 block w-[160px] lg:hidden" />
              <a
                href="#apply"
                aria-label="Become a partner"
                className="inline-block min-h-14 w-full rounded-lg bg-brand px-4 pt-3 pb-3 text-center font-bold leading-6 lg:w-auto lg:min-w-[70px]"
              >
                Become a partner
              </a>
            </div>
            <div className="hidden h-full shrink-0 overflow-hidden lg:block" style={{ aspectRatio: "287 / 317" }}>
              <img src={INF_CTA.mascotRight.src} alt={INF_CTA.mascotRight.alt} className="block h-full w-full object-cover object-left" />
            </div>
          </section>

          {/* Apply form */}
          <section id="apply" className="rounded-2xl bg-card px-5 py-8 lg:px-8">
            <div className="mb-6 flex items-center justify-center gap-2 border-b-[0.8px] border-cardborder pb-2 lg:justify-start">
              <PersonIcon />
              <h2 className="block text-[24px] font-bold leading-[28.8px]">Tell us about you</h2>
            </div>
            <div className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-[24px]">
              {nameEmail.map(renderField)}
            </div>
            <div className="mb-6 flex items-center justify-center gap-2 border-b-[0.8px] border-cardborder pb-2 lg:justify-start">
              <img src={INF_FORM_GAMEPAD} alt="" className="h-6 w-6 object-cover" />
              <h2 className="block text-[24px] font-bold leading-[28.8px]">Tell us about your channel</h2>
            </div>
            <div className="mb-5 flex flex-col gap-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-[24px]">
                <div className="lg:col-span-2">{renderField(channel)}</div>
                {nichePlatform.map(renderField)}
                {locSubs.map(renderField)}
              </div>
            </div>
            <p className="mb-12 block text-[14px] leading-[19.6px] text-graytext">All fields required.</p>
            <button
              type="submit"
              aria-label="Apply now"
              className="inline-block min-h-14 w-full rounded-lg bg-darkbtn px-4 pt-3 pb-3 text-center font-bold leading-6 text-white lg:w-auto lg:min-w-[70px]"
            >
              Apply now
            </button>
          </section>

          {/* Agencies */}
          <section
            className="relative flex w-full flex-col items-start rounded-2xl border-[0.8px] border-cardborder px-8 pt-[60px] pb-11"
            style={{ backgroundImage: "linear-gradient(in oklab, rgb(255, 255, 255) 0%, rgb(239, 239, 241) 100%)" }}
          >
            <h2 className="mb-4 block text-[32px] font-bold leading-tight lg:pr-[120px] lg:text-[48px] lg:leading-[52.8px]">
              {INF_AGENCIES.title}
            </h2>
            <p className="mb-6 block text-[20px] leading-[30px] text-graytext lg:pr-[200px]">{INF_AGENCIES.desc}</p>
            <a
              href={`mailto:${INF_AGENCIES.email}`}
              aria-label={INF_AGENCIES.email}
              className="inline-flex min-h-[42px] items-center gap-2 rounded-lg bg-badgebg px-4 pt-[10px] pb-[10px] text-[14px] font-bold leading-[16.8px] text-ink"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M3 5h18v14H3V5Zm2 2.4V17h14V7.4l-7 5-7-5ZM5.8 7l6.2 4.4L18.2 7H5.8Z" fill="currentColor" />
              </svg>
              {INF_AGENCIES.email}
            </a>
            <img
              src={INF_AGENCIES.mascot.src}
              alt={INF_AGENCIES.mascot.alt}
              className="absolute bottom-[-64px] right-8 hidden h-[283px] w-[283px] object-contain lg:block"
            />
          </section>

          {/* FAQ */}
          <section className="mx-auto w-full max-w-[700px]">
            <h2 className="mb-6 block text-center text-[36px] font-bold leading-[43.2px]">FAQ</h2>
            <InfluencerFaq items={INF_FAQ} />
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
