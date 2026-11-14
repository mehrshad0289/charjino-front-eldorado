import { DASHBOARD_OFFERS_PAGE } from "./data/dashboardData";
import DashboardIcon from "./DashboardIcons";

/* Dashboard page title row: yellow icon + H1 (semibold 30/36) + dark
   action button on the right (e.g. "New Offer"). Reused by every
   dashboard section with its own icon/title/action. */
export default function DashboardPageHeader({ icon = "tag", title, action = null }) {
  return (
    <div className="flex min-h-[106px] items-end px-6 pt-4">
      <div className="flex min-h-[60px] w-full flex-wrap items-center justify-between pb-4">
        <div className="flex items-center justify-start">
          <div className="p-1 text-brand">
            <DashboardIcon name={icon} size={30} />
          </div>
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
