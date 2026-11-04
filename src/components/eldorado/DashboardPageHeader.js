import { DASHBOARD_OFFERS_PAGE } from "./data/dashboardData";

const stroke = { stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };

/* Yellow page icon (tag/coin family) — capture's icomoon glyph is empty;
   inline SVG replacement per project pattern. */
const ICONS = {
  tag: (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h5l9 9-6.5 6.5-9-9v-5Z" {...stroke} />
      <circle cx="8.3" cy="8.3" r="1.2" fill="currentColor" />
    </svg>
  ),
  /* Session 16: orders pages header icon — the captures' icomoon glyph is
     empty (project-wide pattern); inline receipt SVG replacement
     (documented assumption, same convention as the tag icon). */
  orders: (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 3.5h10v17l-2.5-1.7-2.5 1.7-2.5-1.7L7 20.5v-17Z"
        {...stroke}
      />
      <path d="M9.5 8h5M9.5 11.5h5" {...stroke} />
    </svg>
  ),
  /* Session 16: /dashboard/loyalty header icon — same empty-glyph
     convention; star SVG mirroring the sidebar's loyalty icon. */
  loyalty: (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m12 4 2.3 4.9 5.2.6-3.9 3.6 1.1 5.2L12 15.6l-4.7 2.7 1.1-5.2L4.5 9.5l5.2-.6L12 4Z" {...stroke} />
    </svg>
  ),
  /* Session 17: feedback/wallet/messages header icons — same empty-glyph
     convention, inline SVG replacements (documented assumptions). */
  feedback: (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m12 3.6 2.5 5.1 5.6.8-4 4 .9 5.6-5-2.7-5 2.7.9-5.6-4-4 5.6-.8L12 3.6Z" {...stroke} />
    </svg>
  ),
  wallet: (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3.5" y="6" width="17" height="13" rx="2" {...stroke} />
      <path d="M3.5 10h17" {...stroke} />
      <circle cx="16.5" cy="14.8" r="1.2" fill="currentColor" />
    </svg>
  ),
  messages: (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H9l-5 4v-13.5Z" {...stroke} />
      <path d="M8.5 9h7M8.5 12h4.5" {...stroke} />
    </svg>
  ),
  /* Session 18: /dashboard/settings header icon — same empty-glyph
     convention, inline gear SVG mirroring the sidebar's settings icon. */
  settings: (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 2.8v2.6M12 18.6v2.6M21.2 12h-2.6M5.4 12H2.8M18.6 5.4l-1.9 1.9M7.3 16.7l-1.9 1.9M18.6 18.6l-1.9-1.9M7.3 7.3 5.4 5.4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),
};

/* Dashboard page title row: yellow icon + H1 (semibold 30/36) + dark
   action button on the right (e.g. "New Offer"). Reused by every
   dashboard section with its own icon/title/action. */
export default function DashboardPageHeader({ icon = "tag", title, action = null }) {
  return (
    <div className="flex min-h-[106px] items-end px-6 pt-4 pb-0 lg:pl-6 lg:pr-0">
      <div className="flex min-h-[60px] w-full max-w-5xl flex-wrap items-center justify-between pb-4">
        <div className="flex items-center justify-start">
          <div className="p-1 text-brand">{ICONS[icon] ?? ICONS.tag}</div>
          <h1 className="text-[30px] font-semibold leading-[36px]">{title}</h1>
        </div>
        {action && (
          <div className="grid gap-4">
            <a
              href={action.href}
              aria-label={action.ariaLabel ?? action.label}
              className="inline-flex min-h-[42px] min-w-[70px] items-center justify-center overflow-hidden rounded-lg bg-ink px-4 py-[10px] text-center text-[14px] font-bold leading-[16.8px] text-white"
            >
              <span className="flex w-full items-center justify-center gap-1.5 text-center">
                <span className="block text-center">{action.label}</span>
              </span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export { DASHBOARD_OFFERS_PAGE };
