import HeaderBar from "../../components/eldorado/HeaderBar";
import CategoryNav from "../../components/eldorado/CategoryNav";
import Footer from "../../components/eldorado/Footer";
import ChatBubble from "../../components/eldorado/ChatBubble";
import SellerFaq from "../../components/eldorado/SellerFaq";
import { DASHBOARD_USER } from "../../components/eldorado/data/dashboardData";
import {
  BS_HERO_BG,
  BS_HERO_IMG,
  BS_H1,
  BS_SUB,
  BS_CTA_HREF,
  BS_CTA_LABEL,
  BS_PILLS,
  BS_WHY,
  BS_TOOLS,
  BS_FAQS,
  BS_FULL_FAQ_HREF,
  BS_CTA_TITLE,
  BS_CTA_SUB,
} from "../../components/eldorado/data/becomeSellerData";

/* Become a Seller page (/become-seller) — session 19, per the user-pushed
   capture `ui ux/become-seller/
   www_eldorado_gg_become-seller_1920w_390w_1536w_default.make`
   (origin 4b8246c, decoded to extracted/snapshots/
   becomeseller-1920px-light-{1,2}.tsx — 2nd = font-face appendix).
   LOGGED-IN header (the capture carries the profile avatar — same call
   as the session-18 dmca/dsa pages). Layout per capture @1920: a 975px
   bg-repeat-x PNG band behind everything; max-w-[1216px] column pt-32
   with hero (left: h1 font-black 72/79.2 max-w-705 + 24px gray sub +
   dark "Start verification" button — right: 421×418 illustration;
   @390 live: illustration FIRST, h1 36px, everything centered); 3 white
   trust pills (rounded-full; pill 3 = 4.4 + green rgb(33,150,83) star
   + "(100k+ reviews on Trustpilot)"); "Why Eldorado?" 4-col cards
   (134×152 icons, gray top-fade gradient, underlined "Learn how"
   support links); "Tools to power your next sale" 2×2 TRANSPARENT
   cards (live probe: bg rgba(0,0,0,0) radius 16px; colored 40px icon
   chips blue/lime/teal/orange — icomoon glyphs → inline SVGs,
   documented assumption); "Seller FAQs" max-w-3xl 7 white accordion
   rows (answers scraped from live) + "Full seller FAQ" gray
   2px-border button; white CTA band ("Start selling with Eldorado").
   Responsive below 1920 follows live eldorado.gg/become-seller probes
   @390 (screenshot live-becomeseller-390.png): pills full-width
   stacked (gap 16), why grid 1-col, tools grid STAYS 2-col (163.5px
   cards), section titles 24px, CTA band pad 40px/12px gap 32. */

export const metadata = {
  title: "Become a Seller | Eldorado.gg",
  description:
    "Start making money on Eldorado. Reach millions of verified gamers who buy gaming goods daily from sellers like you.",
};

/* icomoon substitutes (documented assumption — no icomoon font). */
function ToolIcon({ name }) {
  const paths = {
    api: (
      <>
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </>
    ),
    upload: (
      <>
        <path d="M12 16V4m0 0 5 5m-5-5L7 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M4 17v1a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
      </>
    ),
    delivery: (
      <>
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </>
    ),
    growth: (
      <>
        <path d="m12 3 2.7 5.8 6.3.7-4.7 4.3 1.3 6.2L12 16.9 6.4 20l1.3-6.2L3 9.5l6.3-.7L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </>
    ),
  };
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" aria-hidden="true" className="text-ink">
      {paths[name]}
    </svg>
  );
}

function TrustpilotStar() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" className="text-[rgb(33,_150,_83)]">
      <path d="m12 2 2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.2l-6.1 3.4 1.4-6.8L2.2 9.1l6.9-.8L12 2Z" fill="currentColor" />
    </svg>
  );
}

function ArrowRight({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 12h16m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DarkCta() {
  return (
    <a
      href={BS_CTA_HREF}
      aria-label={BS_CTA_LABEL}
      className="inline-flex min-h-14 min-w-[70px] items-center justify-center overflow-hidden rounded-lg bg-ink px-4 pt-3 pb-3 text-center font-bold leading-[19.2px] text-white"
    >
      <span className="flex w-full items-center justify-center gap-[6px] text-center">
        <span className="block text-center">{BS_CTA_LABEL}</span>
        <ArrowRight />
      </span>
    </a>
  );
}

export default function BecomeSellerPage() {
  return (
    <div className="min-h-screen bg-page text-ink">
      <HeaderBar loggedIn user={DASHBOARD_USER} />
      <CategoryNav />
      <main className="isolate relative">
        {/* bg band (capture: bg-repeat-x absolute h-975 z-0) */}
        <div
          aria-hidden="true"
          className="absolute left-0 top-0 z-0 h-[975px] w-full bg-repeat-x"
          style={{ backgroundImage: `url("${BS_HERO_BG}")` }}
        />
        <div className="relative z-[1] flex flex-col gap-10 lg:gap-[144px]">
          <div className="mx-auto flex w-full max-w-[1216px] shrink-0 flex-col items-center gap-10 px-3 pt-8 pb-0 lg:gap-[144px] lg:px-0 lg:pt-32">
            {/* Hero + trust pills */}
            <div className="flex w-full flex-col items-center justify-center gap-10 lg:gap-[96px]">
              <div className="flex flex-col items-center gap-6 lg:w-full lg:flex-row lg:items-start lg:gap-[96px]">
                <div className="flex max-w-[705px] flex-col items-start gap-[40px] max-lg:items-center">
                  <div className="flex flex-col items-start gap-4 max-lg:items-center">
                    <h1 className="max-w-[705px] text-center text-[36px] font-black leading-[43.2px] lg:text-left lg:text-[72px] lg:leading-[79.2px]">
                      {BS_H1}
                    </h1>
                    <p className="text-center text-[18px] leading-[27px] text-graytext lg:text-left lg:text-[24px] lg:leading-[28.8px]">
                      {BS_SUB}
                    </p>
                  </div>
                  <DarkCta />
                </div>
                <div className="order-first h-[186px] shrink-0 overflow-hidden lg:order-none lg:h-[418px]">
                  <img
                    alt="Earn money by selling video game items on the Eldorado.gg marketplace"
                    src={BS_HERO_IMG}
                    className="block h-[186px] w-[300px] object-contain align-middle lg:h-[418px] lg:w-[421px]"
                  />
                </div>
              </div>
              <div className="flex flex-wrap items-start justify-center gap-4 lg:gap-[40px]">
                {BS_PILLS.map((p) => (
                  <div
                    key={p.title}
                    className="flex w-full flex-col items-center rounded-full bg-card px-8 pt-4 pb-4 lg:w-auto"
                  >
                    <p className="text-center text-[20px] font-bold leading-[30px]">{p.title}</p>
                    {p.star ? (
                      <div className="flex flex-wrap items-center justify-center text-center text-graytext">
                        <div className="flex items-center text-center">
                          <span className="block text-center">{p.rating}</span>
                          <TrustpilotStar />
                        </div>
                        <span className="block text-center">{p.sub}</span>
                      </div>
                    ) : (
                      <p className="text-center text-graytext">{p.sub}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Why Eldorado? */}
            <section className="flex w-full flex-col items-center gap-10 lg:gap-[48px]">
              <h2 className="text-center text-[24px] font-bold leading-[28.8px] lg:text-[48px] lg:leading-[52.8px]">
                Why Eldorado?
              </h2>
              <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-4">
                {BS_WHY.map((card) => (
                  <div
                    key={card.title}
                    className="flex content-end flex-col items-center gap-6 rounded-2xl border-[0.8px] border-cardborder bg-card px-3 pt-8 pb-8 lg:gap-[24px]"
                    style={{ backgroundImage: "linear-gradient(rgb(246, 246, 246) 0%, rgba(246, 246, 246, 0) 100%)" }}
                  >
                    <div className="relative h-[152px] w-[134px] shrink-0 overflow-hidden">
                      <img alt={card.alt} src={card.img} className="absolute inset-0 block size-full object-contain" />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-center text-[20px] font-bold leading-[30px]">{card.title}</p>
                      <p className="text-center text-graytext">{card.desc}</p>
                      <a
                        href={card.link}
                        className="block text-center text-graytext underline"
                        style={{ textDecoration: "underline" }}
                      >
                        Learn how <span aria-hidden="true">→</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Tools to power your next sale */}
            <section className="flex w-full flex-col items-center gap-10 lg:gap-[48px]">
              <h2 className="text-center text-[24px] font-bold leading-[28.8px] lg:text-[48px] lg:leading-[52.8px]">
                Tools to power your next sale
              </h2>
              <div className="grid w-full grid-cols-2 gap-x-6 gap-y-1">
                {BS_TOOLS.map((tool) => (
                  <div
                    key={tool.title}
                    className="flex content-start flex-wrap items-start gap-1 max-w-sm rounded-2xl p-4 lg:p-8"
                  >
                    <div className="flex grow basis-[0%] flex-col items-center gap-6 lg:gap-[24px]">
                      <div
                        className="flex items-center gap-[10px] rounded-lg p-2.5 lg:p-[10px]"
                        style={{ backgroundColor: tool.chip }}
                      >
                        <div className="h-10 w-10 overflow-hidden">
                          <ToolIcon name={tool.icon} />
                        </div>
                      </div>
                      <div className="flex flex-col gap-6 lg:gap-[24px]">
                        <p className="text-center text-[18px] font-bold leading-[21.6px] lg:text-[24px] lg:leading-[28.8px]">
                          {tool.title}
                        </p>
                        <p className="text-center text-[14px] leading-[19.6px] text-graytext lg:text-[18px] lg:leading-[27px]">
                          {tool.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <DarkCta />
            </section>

            {/* Seller FAQs */}
            <section className="flex w-full flex-col items-center gap-6 lg:gap-[24px]">
              <h2 className="text-center text-[24px] font-bold leading-[28.8px] lg:text-[48px] lg:leading-[52.8px]">
                Seller FAQs
              </h2>
              <div className="flex w-full max-w-3xl flex-col items-start gap-2">
                <SellerFaq items={BS_FAQS} />
              </div>
              <a
                href={BS_FULL_FAQ_HREF}
                aria-label="Full seller FAQ"
                className="inline-flex min-h-12 min-w-[70px] items-center justify-center overflow-hidden rounded-lg border-2 border-cardborder bg-badgebg px-4 pt-3 pb-3 text-center font-bold leading-[19.2px] text-[rgb(20,_20,_26)]"
              >
                <span className="flex w-full items-center justify-center gap-[6px] text-center">
                  <span className="block text-center">Full seller FAQ</span>
                  <ArrowRight />
                </span>
              </a>
            </section>
          </div>

          {/* White CTA band */}
          <div className="flex flex-col self-stretch">
            <div className="flex flex-col items-center gap-8 bg-card px-3 pt-10 pb-10 lg:gap-[44px] lg:pt-20 lg:pb-20">
              <div className="flex flex-col items-center gap-4">
                <div className="text-center text-[24px] font-bold leading-[28.8px] lg:text-[36px] lg:leading-[43.2px]">
                  {BS_CTA_TITLE}
                </div>
                <p className="text-center text-[16px] leading-6 text-graytext lg:text-[18px] lg:leading-[27px]">
                  {BS_CTA_SUB}
                </p>
              </div>
              <DarkCta />
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ChatBubble />
    </div>
  );
}
