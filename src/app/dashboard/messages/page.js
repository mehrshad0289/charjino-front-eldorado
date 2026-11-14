import { connection } from "next/server";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/actions/auth.actions";
import DashboardPageHeader from "../../../components/eldorado/DashboardPageHeader";
import DashboardMessagesPanel from "../../../components/eldorado/DashboardMessagesPanel";
import { DASHBOARD_MESSAGES_PAGE } from "../../../components/eldorado/data/dashboardData";

export const instant = false;

export const metadata = {
  title: "پیام‌ها — شارژینو",
  description: "گفتگوی سفارش‌های خرید و فروش در شارژینو.",
};

export default async function DashboardMessagesPage() {
  await connection();
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/dashboard/messages");
  const { icon, title, chips, unreadToggleLabel } = DASHBOARD_MESSAGES_PAGE;
  return (
    <>
      <DashboardPageHeader icon={icon} title={title} />
      <div className="relative mt-[14px] h-[70vh] min-h-[520px] w-full px-6 pb-16 lg:h-[calc(100dvh-var(--shop-header-h)-80px)]">
        <DashboardMessagesPanel chips={chips} unreadToggleLabel={unreadToggleLabel} copy={DASHBOARD_MESSAGES_PAGE} />
      </div>
    </>
  );
}
