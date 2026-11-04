/* Feedback stats grid + filter row from the feedback capture (session 17):
   a white 4-column card (icon 18px colored, uppercase label 14px #626362,
   bold value 24px; columns 2-4 divided by hairline left borders) and a
   row of three bold filter buttons (active = dark #222127/white, inactive
   = #F4F4F4 with a chevron). Stat icons: the capture's icomoon glyphs are
   empty — inline SVG replacements in the project pattern; colors are
   verbatim from the capture (blue/teal/red/yellow). */

const stroke = { stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };

const STAT_ICONS = {
  completed: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m5 12.5 4.5 4.5L19 7.5" {...stroke} />
    </svg>
  ),
  positive: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 11v9M7 11l3.5-7.5A2 2 0 0 1 13 5.2L12 10h6a2 2 0 0 1 2 2.4l-1.2 6A2 2 0 0 1 16.8 20H7" {...stroke} />
    </svg>
  ),
  negative: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ transform: "rotate(180deg)" }}>
      <path d="M7 11v9M7 11l3.5-7.5A2 2 0 0 1 13 5.2L12 10h6a2 2 0 0 1 2 2.4l-1.2 6A2 2 0 0 1 16.8 20H7" {...stroke} />
    </svg>
  ),
  score: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m12 4.6 1.9 3.8 4.2.6-3 3 .7 4.2-3.8-2-3.8 2 .7-4.2-3-3 4.2-.6L12 4.6Z" fill="currentColor" />
    </svg>
  ),
};

const STAT_COLORS = {
  completed: "text-[rgb(71,_131,_255)]",
  positive: "text-[rgb(0,_228,_201)]",
  negative: "text-[rgb(232,_27,_22)]",
  score: "text-[rgb(255,_201,_80)]",
};

function ChevronDown() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m6 9.5 6 5 6-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function DashboardFeedbackStats({ stats, filters }) {
  return (
    <>
      <div className="mb-6 grid grid-cols-4 bg-white py-5 pl-7 pr-7">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`flex flex-col gap-2.5 ${i > 0 ? "border-l-[0.8px] border-[rgb(231,_231,_231)] pl-7 pr-7" : "pr-7"}`}
          >
            <div className={STAT_COLORS[s.icon] ?? ""}>{STAT_ICONS[s.icon] ?? STAT_ICONS.completed}</div>
            <div className="flex flex-col gap-1">
              <p className="text-[14px] font-bold uppercase leading-[21px] text-[rgb(98,_99,_98)]">{s.label}</p>
              <span className="block text-[24px] font-bold leading-[28.8px]">{s.value}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mb-[15px] flex flex-wrap gap-2.5">
        {filters.map((label, i) =>
          i === 0 ? (
            <button
              key={label}
              type="button"
              aria-label={label}
              className="inline-block min-h-[42px] min-w-[70px] overflow-hidden rounded-lg bg-[rgb(34,_33,_39)] px-4 py-[10px] text-center text-[14px] font-bold leading-[21px] text-white"
            >
              <span className="flex items-center justify-center gap-1.5 text-center">
                <span className="block text-center">{label}</span>
              </span>
            </button>
          ) : (
            <button
              key={label}
              type="button"
              aria-label={label}
              className="inline-block min-h-[42px] min-w-[70px] overflow-hidden rounded-lg bg-[rgb(244,_244,_244)] px-4 py-[10px] text-center text-[14px] font-bold leading-[21px] text-[rgb(20,_20,_26)]"
            >
              <span className="flex items-center justify-center gap-1.5 text-center">
                <span className="block text-center">{label}</span>
                <ChevronDown />
              </span>
            </button>
          )
        )}
      </div>
    </>
  );
}
