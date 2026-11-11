import DashboardSidebar from "./DashboardSidebar";
import { DASHBOARD_BANNER, DASHBOARD_BANNER_MOBILE } from "./data/dashboardData";

const HOMEPAGE_GRADIENT =
  "linear-gradient(180deg, rgba(246, 246, 246, 0) 0%, rgb(246, 246, 246) 100%)";

/* Dashboard shell — live eld-dashboard-layout + wallet .make capture:
   assassin banner 465px, --homepage-gradient overlay 340px, 260px white
   sidenav from 961px. Layout follows html dir=rtl: sidebar on inline-start
   (right), banner flipped so the character stays visible beside content. */
export default function DashboardShell({ active, user = null, children }) {
  return (
    <div className="relative flex min-h-[max(100dvh,1200px)] w-full">
      <div className="pointer-events-none absolute z-0 size-full">
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
      <div className="relative z-[1] hidden shrink-0 min-[961px]:block">
        <DashboardSidebar active={active} user={user} />
      </div>
      <div className="relative size-full min-w-0">{children}</div>
    </div>
  );
}
