import DashboardSidebar from "./DashboardSidebar";
import { DASHBOARD_BANNER } from "./data/dashboardData";

/* Dashboard shell (reusable layout for every logged-in dashboard page):
   465px banner image behind the content with a transparent→page-color
   gradient, white 260px sidebar (sticky under the 100px header from lg)
   and the content column. Below lg there is no reference (capture is
   1920-only and the live dashboard needs a login) — the sidebar spans the
   full width above the content, documented as an approximation. */
export default function DashboardShell({ active, children }) {
  return (
    <div className="relative min-h-[1200px]">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[465px] overflow-hidden">
        <img
          alt="Dashboard banner background image"
          src={DASHBOARD_BANNER}
          className="block h-[465px] w-full object-cover align-middle"
          style={{ objectPosition: "50% 15%" }}
        />
        <div
          className="absolute inset-x-0 -bottom-px h-[340px]"
          style={{ backgroundImage: "linear-gradient(rgba(246, 246, 246, 0) 0%, rgb(246, 246, 246) 100%)" }}
        />
      </div>
      <div className="relative z-[1] flex flex-col lg:flex-row">
        <div className="shrink-0">
          <DashboardSidebar active={active} />
        </div>
        <div className="relative size-full min-w-0">{children}</div>
      </div>
    </div>
  );
}
