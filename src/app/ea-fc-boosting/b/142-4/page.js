import HeaderBar from "../../../../components/eldorado/HeaderBar";
import CategoryNav from "../../../../components/eldorado/CategoryNav";
import Footer from "../../../../components/eldorado/Footer";
import ChatBubble from "../../../../components/eldorado/ChatBubble";
import ShopItemSubNav from "../../../../components/eldorado/ShopItemSubNav";
import SellerFaq from "../../../../components/eldorado/SellerFaq";
import { DASHBOARD_USER } from "../../../../components/eldorado/data/dashboardData";
import BoostingConfigSection from "../../../../components/eldorado/BoostingConfigSection";
import {
  BOOST_GAME,
  BOOST_TABS,
  BOOST_BANNER,
  BOOST_DEALS_TITLE,
  BOOST_RANKUP,
  BOOST_BOOSTERS,
  BOOST_LIGHTNING,
  BOOST_FAQS,
  BOOST_SEO,
} from "../../../../components/eldorado/data/eaFcBoostingData";

/* EA FC 27 Boosting page (/ea-fc-boosting/b/142-4) — session 19, per the
   user-pushed capture `ui ux/Boosting-rivals/
   www_eldorado_gg_ea-fc-boosting_b_142-4_1920w_390w_1536w_default.make`
   (origin bddd33e — the boosting product page behind the /checkout
   capture). LOGGED-IN header + CategoryNav (capture carries the
   avatar). Layout per capture @1920: dark game sub-nav (reused
   ShopItemSubNav, parameterized — 1208px column, Boosting tab active
   with the yellow glow; other tabs keep their verbatim live hrefs);
   absolute 465px banner (object-position 50% 15%) with a 340px bottom
   fade; 1208px section (pt-9 pb-24): "Get deals … under 2 minutes"
   20px bold + 98% yellow badge ("Positive feedback from last 353,800
   orders"), 8 filter chips (Division Rivals active dark, scrollable),
   grid 2fr/1fr gap-32 — LEFT: 2-col config cards (200px header img +
   white fade + radial yellow glow, 90px icon, "Current division /
   Division 1" & "Desired division / Elite", static comboboxes min-h-60
   bg-efeff1 inset-ring — no dropdown content in any reference, nothing
   invented) + full-width textarea card ("e.g. I need it done in a
   week..."); RIGHT: "CUSTOMIZE ORDER" gradient-border panel (p-px,
   lime bg + blue gradient edge) with Solo/Duo segmented toggle (Solo
   active, static per capture) + Stream/Solo queue/Offline mode
   switches (all OFF per capture) + blue "You already have an active
   request" alert (bg rgba(71,131,255,.2)) with dark "Check request"
   button; "Save up to 60% on boosting." banner (badge svg behind the
   60%, Money Dragon 78px bottom-right); "Why trust Eldorado?" card
   (max-w-3xl, bg img, 2-col grid of 6 checkbox rows with hairlines).
   Then: "Trusted by thousands of players worldwide" 30px + white
   h-230 card with an EMPTY 150px carousel area (verbatim — the reviews
   carousel did not render in the capture, documented); "Effortless
   rank-up process" band (bg-efeff1, clip-path polygon 53px slants,
   4 steps with hairline dividers, icons 108/117/120/126px, dark "Get
   offers now" CTA); "Boosters with Eldorados stamp of approval" band
   (mt--70 overlap, pt-180 pb-142, bg img, lime "Selected boosters"
   badge, 36px title, 24/42 gray body); lightning CTA band (min-h-500,
   bg img, 36px "Rank-up with confidence…" with dark spans, CTA);
   FAQ max-w-3xl (8 rows — answers scraped from live, reused
   SellerFaq); SEO block (h1 24px + 4.9 gradient rating badge +
   verbatim paragraphs/ol with the live FC 27 Coins link).
   Session 22: chips/cards/textarea/customize/save-money/why-trust
   moved into the client BoostingConfigSection — the user pushed a
   SECOND capture of this URL with the Champions Finals chip active
   (ui ux/Boosting-Champions-Finals/, origin 9f6e420) and the two
   captured states now switch on chip click (data: BOOST_VARIANTS;
   other chips are no-ops — no captured reference).
   Responsive below 1920 follows live eldorado.gg/ea-fc-boosting/b/142-4
   probes @390: everything stacks 1-col in DOM order (cards → customize
   → save-money → trust → rank-up steps vertical), sub-nav tabs scroll
   (hidden md:flex), banner/deals title full width. Static state per
   capture: comboboxes closed, Solo active, switches off. */

export const metadata = {
  title: "Buy EA Sports FC 27 Boosting Services | Eldorado.gg",
  description:
    "Get deals from expert EA FC 27 boosters in under 2 minutes. Division Rivals boosting with TradeShield protection and a money-back guarantee.",
};

/* Yellow seal badge behind the 98% / 4.9 ratings — icomoon glyph empty
   in the capture → inline SVG (documented assumption). */
function SealBadge({ size, children, textClass }) {
  return (
    <span className="relative inline-block" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className="block">
        <path
          d="M12 0.4 14.4 2.6 17.6 2.1 18.6 5.2 21.6 6.6 21 9.8 23 12.4 21 15 21.6 18.2 18.6 19.6 17.6 22.7 14.4 22.2 12 24.4 9.6 22.2 6.4 22.7 5.4 19.6 2.4 18.2 3 15 1 12.4 3 9.8 2.4 6.6 5.4 5.2 6.4 2.1 9.6 2.6 12 0.4Z"
          fill="rgb(255, 201, 80)"
        />
      </svg>
      {children && (
        <span className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-bold ${textClass || ""}`} style={{ zIndex: 2 }}>
          {children}
        </span>
      )}
    </span>
  );
}

export default function EaFcBoostingPage() {
  return (
    <div className="min-h-screen bg-page text-ink">
      <HeaderBar loggedIn user={DASHBOARD_USER} />
      <CategoryNav />
      <main className="isolate relative">
        <ShopItemSubNav game={BOOST_GAME} tabs={BOOST_TABS} contentWidth="md:w-[1208px]" />

        {/* Banner (absolute 465px + bottom fade) */}
        <div aria-hidden="true" className="absolute left-0 top-0 z-0 h-[465px] w-full overflow-hidden">
          <img
            alt="Boosting banner background image"
            src={BOOST_BANNER}
            className="block h-[465px] w-full object-cover align-middle"
            style={{ objectPosition: "50% 15%" }}
          />
          <div
            className="absolute bottom-[-1px] left-0 z-[2] h-[340px] w-full"
            style={{ backgroundImage: "linear-gradient(rgba(246, 246, 246, 0) 0%, rgb(246, 246, 246) 100%)" }}
          />
        </div>

        {/* Config + customize section */}
        <section className="relative mx-auto w-full px-6 pt-9 pb-24 md:w-[1208px]">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div className="text-[20px] font-bold leading-[30px]">
              {BOOST_DEALS_TITLE[0]}
              <span className="text-ink">{BOOST_DEALS_TITLE[1]}</span>
            </div>
            <div className="flex items-center gap-[6px]">
              <SealBadge size={42} textClass="bg-brand text-[10px] leading-[15px] text-ink">
                98%
              </SealBadge>
              <span className="block text-left text-[14px] leading-[21px]">
                Positive feedback from last <strong className="font-bold">353,800</strong> orders
              </span>
            </div>
          </div>

          <BoostingConfigSection />

        </section>

        {/* Trusted band (carousel empty per capture) */}
        <div className="relative mx-auto mt-[109px] w-full max-w-[1208px] px-6">
          <div className="relative mt-12">
            <div className="flex flex-col">
              <div className="flex w-full justify-center text-center">
                <span className="block text-center text-[30px] font-bold leading-[36px]">
                  Trusted by thousands of players worldwide
                </span>
              </div>
              <div className="relative mt-8 h-[230px]">
                <div className="h-full rounded-lg bg-card px-6 pt-12 pb-8 shadow-[rgba(9,9,11,0.05)_0px_2px_4px_0px,_rgba(9,9,11,0.02)_0px_12px_8px_0px]">
                  <div className="relative">
                    <div aria-label="Player reviews carousel" className="relative h-[150px] w-full overflow-clip" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rank-up process band (slanted edges) */}
        <div className="relative mx-auto mt-[109px] w-full max-w-full text-center">
          <div
            className="relative mt-12 bg-inputgray px-[14px] pt-[97px] pb-[113px]"
            style={{ clipPath: "polygon(0% 53px, 100% 0%, 100% calc(100% - 53px), 0% 100%)" }}
          >
            <div className="text-center text-[36px] font-bold leading-[normal]">
              Effortless <span className="text-ink">rank-up</span> process
            </div>
            <div className="mx-auto mt-10 mb-[27px] flex max-lg:flex-col max-lg:items-center lg:items-baseline lg:justify-center">
              {BOOST_RANKUP.steps.map((step, i) => (
                <div key={step.title} className={`text-center ${i > 0 ? "lg:border-l-[0.8px] lg:border-cardborder" : ""}`}>
                  <div className="mx-auto grid max-w-[294px] gap-[14px] p-6 text-center">
                    <div className="flex justify-center self-center" style={{ minHeight: 126, alignItems: "safe flex-end" }}>
                      <img
                        alt="Rank up step"
                        src={step.img}
                        className="block object-cover text-center align-middle"
                        style={{ width: step.w, height: step.h }}
                      />
                    </div>
                    <div className="text-[24px] font-bold leading-[normal]">{step.title}</div>
                    <div className="text-[18px] leading-[28px] text-graytext">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="inline text-center">
              <button
                type="button"
                aria-label={BOOST_RANKUP.cta}
                className="inline-block max-w-fit min-h-[42px] min-w-[70px] w-full overflow-hidden rounded-lg bg-ink px-4 pt-[10px] pb-[10px] text-center text-[14px] font-bold leading-[21px] text-white"
              >
                <span className="flex items-center justify-center gap-[6px] text-center">
                  <span className="block text-center">{BOOST_RANKUP.cta}</span>
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Boosters band */}
        <div className="mt-[-70px]">
          <div className="relative flex justify-center pt-[180px] pb-[142px]">
            <picture>
              <img
                alt="Booster background image"
                src={BOOST_BOOSTERS.bg}
                className="pointer-events-none absolute left-0 top-0 block size-full max-w-full object-cover object-top align-middle"
              />
            </picture>
            <div className="relative flex max-w-[721px] flex-col px-[14px]">
              <div>
                <div
                  role="status"
                  aria-label="Selected boosters"
                  className="mx-auto flex max-w-fit items-center justify-center rounded-lg bg-[rgba(209,_240,_143,_0.2)] px-3 pt-[5px] pb-[6px] text-[14px] leading-[normal] text-[rgb(54,_117,_6)]"
                >
                  <span className="block">{BOOST_BOOSTERS.badge}</span>
                </div>
              </div>
              <div className="mb-[41px] mt-[18px] text-[36px] font-bold leading-[normal] max-lg:text-[28px]">
                {BOOST_BOOSTERS.title}
              </div>
              <div className="text-[16px] leading-[28px] text-graytext lg:text-[24px] lg:leading-[42px]">
                {BOOST_BOOSTERS.body}
              </div>
            </div>
          </div>
        </div>

        {/* Lightning CTA band */}
        <div className="relative flex min-h-[500px] justify-center text-center">
          <picture className="text-center">
            <img
              alt="Lightning background image"
              src={BOOST_LIGHTNING.bg}
              className="pointer-events-none absolute left-0 top-0 block size-full max-w-full object-cover object-top text-center align-middle"
            />
          </picture>
          <div className="relative mx-7 my-[84px] max-w-[955px] text-[28px] font-bold leading-[normal] lg:text-[36px]">
            <div className="text-center">Rank-up with confidence:</div>
            <div className="text-center">
              <span className="text-ink">trusted boosters, 24/7 support</span> and a{" "}
              <span className="text-ink">money-back guarantee</span>.
            </div>
            <div className="inline text-center">
              <button
                type="button"
                aria-label={BOOST_RANKUP.cta}
                className="mt-[47px] inline-block max-w-fit min-h-[42px] min-w-[70px] w-full overflow-hidden rounded-lg bg-ink px-4 pt-[10px] pb-[10px] text-center text-[14px] font-bold leading-[21px] text-white"
              >
                <span className="flex items-center justify-center gap-[6px] text-center">
                  <span className="block text-center">{BOOST_RANKUP.cta}</span>
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <section>
          <div className="mx-auto max-w-3xl p-6">
            <div className="mb-6 text-center text-[36px] font-bold leading-[43.2px]">FAQ</div>
            <div className="flex flex-col gap-2">
              <SellerFaq items={BOOST_FAQS} />
            </div>
          </div>
        </section>

        {/* SEO block */}
        <div className="relative mx-auto mt-20 w-full px-6 pt-9 pb-24 md:w-[1208px]">
          <div className="pb-5">
            <h1 className="mb-[10px] text-[24px] font-bold leading-[33.6px]">{BOOST_SEO.h1}</h1>
          </div>
          <div className="flex">
            <div className="mb-5 flex h-[43px] min-w-[246px] rounded-lg pr-[10px]" style={{ backgroundImage: "linear-gradient(to right, rgb(223, 28, 255) -55.11%, rgb(255, 201, 80) 97.14%)" }}>
              <div className="relative z-[0] grid max-w-[60px] grid-cols-1">
                <span className="relative left-[22px] top-[11px] z-[2] block font-bold" style={{ gridArea: "1 / 1 / 2 / 2" }}>
                  {BOOST_SEO.rating}
                </span>
                <div aria-hidden="true" className="relative bottom-3 text-brand" style={{ gridArea: "1 / 1 / 2 / 2" }}>
                  <SealBadge size={66} />
                </div>
              </div>
              <p className="ml-[5px] flex items-center justify-center leading-[21px]">
                From last<b className="block pl-1 pr-1 font-bold">{BOOST_SEO.orders}</b>orders
              </p>
            </div>
          </div>
          <div>
            <p className="mb-4">{BOOST_SEO.p1}</p>
            <h2 className="font-bold leading-[19px]">{BOOST_SEO.h2a}</h2>
            <p className="mb-4">
              {BOOST_SEO.p2a}
              <a href={BOOST_SEO.p2aLink.href} className="text-linkblue">{BOOST_SEO.p2aLink.label}</a>
              {BOOST_SEO.p2aEnd}
            </p>
            <h2 className="font-bold leading-[19px]">{BOOST_SEO.h2b}</h2>
            <p className="mb-4">{BOOST_SEO.p2b}</p>
            <ol className="mb-5 ml-[30px] list-decimal">
              {BOOST_SEO.steps.map((s) => (
                <li key={s}>
                  <p>{s}</p>
                </li>
              ))}
            </ol>
            <p className="mb-4">{BOOST_SEO.p3}</p>
          </div>
        </div>
      </main>
      <Footer />
      <ChatBubble />
    </div>
  );
}
