import DashboardPageHeader from "../../../components/eldorado/DashboardPageHeader";
import DashboardNotificationsPanel from "../../../components/eldorado/DashboardNotificationsPanel";
import { DASHBOARD_NOTIFICATIONS_PAGE } from "../../../components/eldorado/data/dashboardExtraData";

/* Dashboard page /dashboard/notifications — session 26. The sidebar
   linked here (DASHBOARD_NAV_LINKS) but no page existed. No capture
   pushed for this route: chip-filtered notification list in the
   dashboard's own design language (data: dashboardExtraData.js,
   template-generated). Sidebar active row: Notifications. */

export const metadata = {
  title: "Dashboard Notifications - Eldorado",
  description: "Your Eldorado notifications: orders, messages, disputes and payment updates.",
};

export default function DashboardNotificationsPage() {
  const { icon, title, tabs, items } = DASHBOARD_NOTIFICATIONS_PAGE;
  return (
    <>
      <DashboardPageHeader icon={icon} title={title} />
      <div className="relative mt-[14px] w-full px-6 pb-[50px]">
        <DashboardNotificationsPanel tabs={tabs} items={items} />
      </div>
    </>
  );
}
