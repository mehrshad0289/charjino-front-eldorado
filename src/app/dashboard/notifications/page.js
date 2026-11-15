import { connection } from "next/server";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/actions/auth.actions";
import { getMarketNotifications } from "@/actions/market.actions";
import DashboardPageHeader from "../../../components/eldorado/DashboardPageHeader";
import DashboardNotificationsPanel from "../../../components/eldorado/DashboardNotificationsPanel";
import { DASHBOARD_NOTIFICATIONS_PAGE } from "../../../components/eldorado/data/dashboardExtraData";

export const instant = false;

export const metadata = {
  title: "اعلان‌ها — شارژینو",
  description: "اعلان‌های واقعی حساب شارژینو: پرداخت، احراز، تیکت و نظرات.",
};

export default async function DashboardNotificationsPage() {
  await connection();
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/dashboard/notifications");

  const feed = await getMarketNotifications();
  if (feed.unauthorized) redirect("/login?next=/dashboard/notifications");

  const { icon, title } = DASHBOARD_NOTIFICATIONS_PAGE;
  return (
    <>
      <DashboardPageHeader icon={icon} title={title} />
      <div className="relative mt-[14px] w-full px-6 pb-[50px]">
        {!feed.ok && feed.marketOff ? (
          <p className="text-[14px] text-[rgb(232,27,22)]">{feed.message || "اعلان‌ها در دسترس نیست."}</p>
        ) : (
          <DashboardNotificationsPanel items={feed.items} meta={feed.meta} />
        )}
      </div>
    </>
  );
}
