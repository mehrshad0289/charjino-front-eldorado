import { connection } from "next/server";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/actions/auth.actions";
import { listTickets } from "@/actions/tickets.actions";
import DashboardPageHeader from "../../../components/eldorado/DashboardPageHeader";
import ContactTicketsChat from "../../../components/eldorado/ContactTicketsChat";
import { DASHBOARD_TICKETS_PAGE } from "../../../components/eldorado/data/dashboardData";
import { ticketLoginHref, TICKET_INBOX } from "@/lib/tickets";

export const instant = false;

export const metadata = {
  title: "تیکت‌ها — شارژینو",
  description: "تیکت‌های پشتیبانی شارژینو.",
};

export default async function DashboardTicketsPage() {
  await connection();
  const user = await getSessionUser();
  if (!user) redirect(ticketLoginHref(TICKET_INBOX));
  const feed = await listTickets();
  const { icon, title, action } = DASHBOARD_TICKETS_PAGE;
  return (
    <>
      <DashboardPageHeader icon={icon} title={title} action={action} />
      <div className="relative mt-[14px] h-[70vh] min-h-[520px] w-full px-6 pb-16 lg:h-[calc(100dvh-var(--shop-header-h)-80px)]">
        <ContactTicketsChat tickets={feed.items || []} />
      </div>
    </>
  );
}
