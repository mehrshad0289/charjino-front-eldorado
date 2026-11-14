import { connection } from "next/server";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/actions/auth.actions";
import DashboardPageHeader from "../../../../components/eldorado/DashboardPageHeader";
import ContactTicketForm from "../../../../components/eldorado/ContactTicketForm";
import { DASHBOARD_TICKETS_PAGE } from "../../../../components/eldorado/data/dashboardData";
import { FA } from "../../../../components/eldorado/data/faCopy";
import { ticketLoginHref, TICKET_NEW } from "@/lib/tickets";

export const instant = false;

export const metadata = {
  title: "تیکت جدید — شارژینو",
  description: "ارسال تیکت پشتیبانی شارژینو.",
};

export default async function DashboardNewTicketPage() {
  await connection();
  const user = await getSessionUser();
  if (!user) redirect(ticketLoginHref(TICKET_NEW));
  const { icon, listAction } = DASHBOARD_TICKETS_PAGE;
  return (
    <>
      <DashboardPageHeader icon={icon} title={FA.newTicket} action={listAction} />
      <div className="relative mt-[14px] max-w-[720px] px-6 pb-16">
        <ContactTicketForm />
      </div>
    </>
  );
}
