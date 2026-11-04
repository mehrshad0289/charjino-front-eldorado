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
