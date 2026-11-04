import { LOYALTY_PAGE } from "./data/loyaltyData";

/* /dashboard/loyalty content (own .make capture, 1920-only, decoded
   2026-11-04, session 16): content grid `mt-[16px] gap-[56px]` inside the
   1048px column (the capture's wrapper carries pr-0 — cards reach the
   column's right edge, unlike the offers pages' px-6). Three grid rows:
   1) amber "Monthly order streak" banner (bg rgb(252,231,182), min-h 230)
      with 4 dimmed milestone images (opacity 0.35 — the capture account
      has no orders), caption, Bronze rank row + teal (rgb(0,228,201))
      progress bar at 0%, and an absolute underlined "How it works?" link
      pinned to the banner's top; below it the white "Available points"
      card (coin, 0, hint, hairline divider, 10,000-points tier row and a
      gray Redeem button whose label sits at opacity 0.2 in the capture);
   2) "Achievements completed" (0 / 17) + 2-col grid of 3 white cards
      (114x100 reward image left, title + gray description right, bottom
      row = bold "0 / n" + "To unlock", small coin image + "+n points",
      14px teal progress bar);
   3) "Dedication" heading + a background-image card (pt/pb 42) with the
      gray-on-white text and the dark "Browse Eldorado" button.
   Grid-area inline styles replicate the capture's explicit placement. */

const CARD_SHADOW = "rgba(9,9,11,0.05) 0px 2px 4px 0px, rgba(9,9,11,0.02) 0px 12px 8px 0px";

function ProgressBar({ pct, heightClass }) {
  return (
    <div className={`relative w-full bg-[rgb(231,_231,_231)] rounded-[1.25rem] ${heightClass}`}>
      <div className={`bg-repeat-x overflow-hidden rounded-[1.25rem] ${heightClass}`}></div>
      <div
        className={`bg-repeat-x absolute top-0 bg-[rgb(0,_228,_201)] rounded-[1.25rem] ${heightClass}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function AchievementCard({ card }) {
  /* Card grid replicates the capture template ("reward description" /
     "reward achievement-progress", 1fr|2fr, gap 36) from sm up; below sm
     there is no capture reference (1920-only) so the card stacks
     image / text / progress in one column — documented approximation,
     same convention as the sidebar's mobile behaviour. */
  return (
    <div
      className="grid h-full grid-cols-1 gap-[16px] rounded-lg bg-white pt-4 pr-6 pb-4 pl-6 sm:grid-cols-[1fr_2fr] sm:gap-[36px]"
      style={{ boxShadow: CARD_SHADOW }}
    >
      <div className="items-center flex justify-center sm:row-span-2 sm:row-start-1 sm:col-start-1">
        <div className="h-[100px] shrink-0 overflow-hidden">
          <img
            alt="Reward image"
            src={card.image}
            className="block size-full object-cover align-middle"
          />
        </div>
      </div>
      <div className="sm:row-start-1 sm:col-start-2">
        <div>{card.title}</div>
        <div className="text-[rgb(106,_102,_123)]">{card.description}</div>
      </div>
      <div className="flex flex-col justify-end gap-[8px] sm:row-start-2 sm:col-start-2">
        <div className="flex items-end justify-between">
          <div className="flex items-center gap-[4px]">
            <span className="block whitespace-nowrap font-bold">{card.progress}</span>
            <span className="block text-[rgb(106,_102,_123)]">To unlock</span>
          </div>
          <div className="flex flex-col items-end gap-[2px]">
            <div>
              <div className="h-9 w-8 overflow-hidden align-middle fill-[rgb(231,_231,_231)]">
                <img src={card.coin} className="block size-full" alt="" />
              </div>
            </div>
            <span className="block text-[rgb(106,_102,_123)]">{card.reward}</span>
          </div>
        </div>
        <div>
          <ProgressBar pct={0} heightClass="h-[14px]" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardLoyalty() {
  const { streak, points, achievements, dedication } = LOYALTY_PAGE;
  return (
    <div className="grid relative mt-[16px] gap-[56px] max-w-[1048px] pt-0 pr-0 pb-[50px] pl-6">
      {/* Row 1 — streak banner + available points card */}
      <div style={{ gridArea: "1 / 1 / 2 / 2" }}>
        <div className="relative">
          <div className="flex flex-col items-center min-h-[230px] rounded-lg bg-[rgb(252,_231,_182)] pt-0 pr-4 pb-4 pl-4">
            <div className="mt-[16px] text-[20px] font-bold leading-[30px]">{streak.title}</div>
            <div className="mt-[12px] flex gap-[10px]">
              {streak.items.map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-[4px]">
                  <div className="h-12 shrink-0 overflow-hidden opacity-[0.35]">
                    <img
                      alt="Reward image"
                      src={item.image}
                      className="block aspect-[auto_42_/_48] h-12 w-[42px] object-cover align-middle"
                    />
                  </div>
                  {item.label && (
                    <p className="text-[14px] leading-[21px] text-[rgb(67,_66,_82)]">{item.label}</p>
                  )}
                </div>
              ))}
            </div>
            <span className="mb-[12px] mt-[12px] block text-center">{streak.caption}</span>
            <div className="w-full max-w-[572px]">
              <div className="mb-[10px] flex">
                <div className="text-[14px] leading-[19.6px]">{streak.rankRow.rank}</div>
                <p className="whitespace-pre text-[14px] leading-[19.6px]">{streak.rankRow.rankSuffix}</p>
                <p className="text-[14px] leading-[19.6px]">{streak.rankRow.remaining}</p>
              </div>
              <div className="mt-[6px]">
                <ProgressBar pct={streak.progressPct} heightClass="h-2" />
              </div>
            </div>
          </div>
          <div
            className="absolute top-0 pt-4 pr-6 pb-4 pl-6 text-[14px] leading-[21px] underline"
            style={{ textDecoration: "underline" }}
          >
            {streak.howItWorks}
          </div>
        </div>
        <div className="inline">
          <div className="rounded-lg bg-white">
            <div className="relative z-[2] rounded-lg bg-white pt-4 pr-6 pb-4 pl-6">
              <p className="text-[14px] leading-[21px]">{points.heading}</p>
              <div className="mt-[8px] flex items-center gap-[8px]">
                <div className="h-[33px] shrink-0 overflow-hidden">
                  <img
                    alt={points.coinAlt}
                    src={points.coin}
                    className="block aspect-[auto_34_/_33] h-[33px] w-[34px] object-cover align-middle"
                  />
                </div>
                <p className="text-[32px] font-bold leading-[38.4px]">{points.amount}</p>
              </div>
              <p className="mt-[2px] text-[14px] leading-[21px] text-[rgb(106,_102,_123)]">{points.hint}</p>
            </div>
            <hr className="h-px overflow-hidden border-t-[0.8px]" style={{ borderTopColor: "rgb(231, 231, 231)" }} />
            <div className="flex items-center justify-between pt-4 pr-6 pb-6 pl-6">
              <div className="flex items-center gap-[42px]">
                <p className="text-[14px] font-bold leading-[21px]">{points.tierCost}</p>
                <p className="text-[14px] leading-[21px] text-[rgb(106,_102,_123)]">{points.tierValue}</p>
              </div>
              <div>
                <button
                  type="button"
                  aria-label={points.redeemLabel}
                  className="inline-block min-h-[42px] w-full min-w-[70px] overflow-hidden rounded-lg bg-[rgb(244,_244,_244)] px-4 pb-[10px] pt-[10px] text-center text-[14px] font-bold leading-[21px] text-[rgb(20,_20,_26)]"
                >
                  <span className="flex items-center justify-center gap-[6px] text-center opacity-[0.2]">
                    <span className="block text-center">{points.redeemLabel}</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2 — achievements */}
      <div style={{ gridArea: "2 / 1 / 3 / 2" }}>
        <div className="inline">
          <div className="mb-[18px] flex flex-col gap-[4px]">
            <p className="text-[18px] leading-[21px]">{achievements.heading}</p>
            <div className="text-[rgb(106,_102,_123)]">{achievements.counter}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          {achievements.cards.map((card) => (
            <div key={card.title} style={{ gridArea: card.gridArea }}>
              <AchievementCard card={card} />
            </div>
          ))}
        </div>
      </div>

      {/* Row 3 — dedication */}
      <div style={{ gridArea: "3 / 1 / 4 / 2" }}>
        <div className="inline">
          <div className="mb-[18px] flex flex-col gap-[4px]">
            <p className="text-[18px] leading-[21px]">{dedication.heading}</p>
            <div className="text-[rgb(106,_102,_123)]">{dedication.description}</div>
          </div>
        </div>
        <div
          className="flex flex-col items-center gap-[16px] rounded-lg bg-white pt-[42px] pr-[10px] pb-[42px] pl-[10px]"
          style={{
            boxShadow: CARD_SHADOW,
            backgroundImage: `url("${dedication.backgroundImage}")`,
          }}
        >
          <p className="text-[14px] leading-[21px]">{dedication.text}</p>
          <div>
            <button
              type="button"
              aria-label={dedication.buttonLabel}
              className="inline-block min-h-[42px] w-full min-w-[70px] overflow-hidden rounded-lg bg-[rgb(34,_33,_39)] px-4 pb-[10px] pt-[10px] text-center text-[14px] font-bold leading-[21px] text-white"
            >
              <span className="flex items-center justify-center gap-[6px] text-center">
                <span className="block text-center">{dedication.buttonLabel}</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
