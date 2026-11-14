import DashboardSidebar from "./DashboardSidebar";
import { DASHBOARD_BANNER, DASHBOARD_BANNER_MOBILE } from "./data/dashboardData";

const HOMEPAGE_GRADIENT =
  "linear-gradient(180deg, rgba(246, 246, 246, 0) 0%, rgb(246, 246, 246) 100%)";

/* Dashboard shell — live eld-dashboard-layout: 260px sidenav + content
   column from 961px. Layout follows html dir=rtl: first grid track is
   inline-start (right). Banner flipped so the character stays in the
   content column. */
export default function DashboardShell({ active, user = null, children }) {
  return (
    <div className="relative min-h-[calc(100dvh-var(--shop-header-h))] w-full overflow-x-clip min-[961px]:grid min-[961px]:grid-cols-[260px_minmax(0,1fr)]">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[465px] overflow-hidden">
          <div
            className="pointer-events-none absolute inset-x-0 -bottom-px z-[2] h-[340px]"
            style={{ backgroundImage: HOMEPAGE_GRADIENT }}
          />
          <picture>
            <source media="(max-width: 600px)" srcSet={DASHBOARD_BANNER_MOBILE} />
            <img
              alt="Dashboard banner background image"
              src={DASHBOARD_BANNER}
              fetchPriority="high"
              className="dashboard-assassin block h-[465px] w-full object-cover object-top align-middle min-[601px]:object-[center_15%]"
            />
          </picture>
        </div>
      </div>
      <aside className="relative z-[1] hidden bg-white min-[961px]:block">
        <DashboardSidebar active={active} user={user} />
      </aside>
      <div className="relative z-[1] min-w-0">{children}</div>
    </div>
  );
}
