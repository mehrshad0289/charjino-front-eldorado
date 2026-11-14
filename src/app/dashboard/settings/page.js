import { connection } from "next/server";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/actions/auth.actions";
import { getSellerMe } from "@/actions/market.actions";
import DashboardPageHeader from "../../../components/eldorado/DashboardPageHeader";
import DashboardSettings from "../../../components/eldorado/DashboardSettings";
import { DASHBOARD_SETTINGS_PAGE } from "../../../components/eldorado/data/dashboardData";

export const instant = false;

export const metadata = {
  title: "تنظیمات حساب — شارژینو",
  description: "شماره همراه، نام نمایشی، تصویر و اعلان‌های حساب شارژینو.",
};

export default async function DashboardSettingsPage() {
  await connection();
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/dashboard/settings");

  const seller = await getSellerMe();
  if (seller.unauthorized) redirect("/login?next=/dashboard/settings");

  const { icon, title } = DASHBOARD_SETTINGS_PAGE;

  return (
    <>
      <DashboardPageHeader icon={icon} title={title} />
      <DashboardSettings user={user} seller={seller.ok ? seller.data : null} />
    </>
  );
}
