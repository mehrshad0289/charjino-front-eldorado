import { connection } from "next/server";
import { notFound, redirect } from "next/navigation";
import { getSessionUser } from "@/actions/auth.actions";
import { getTicket, listTickets } from "@/actions/tickets.actions";
import DashboardPageHeader from "../../../../components/eldorado/DashboardPageHeader";
import ContactTicketsChat from "../../../../components/eldorado/ContactTicketsChat";
import { DASHBOARD_TICKETS_PAGE } from "../../../../components/eldorado/data/dashboardData";
import { ticketHref, ticketLoginHref } from "@/lib/tickets";

export const instant = false;

export async function generateMetadata({ params }) {
  const { ticket } = await params;
  return {
    title: `تیکت ${ticket} — شارژینو`,
    description: "گفتگوی تیکت پشتیبانی شارژینو.",
  };
}

export default async function DashboardTicketThreadPage({ params }) {
  await connection();
  const { ticket: id } = await params;
  const user = await getSessionUser();
  if (!user) redirect(ticketLoginHref(ticketHref(id)));
  const [result, feed] = await Promise.all([getTicket(id), listTickets()]);
  if (result.notFound || !result.ticket) notFound();
  if (!result.ok) notFound();
  const { icon, title, action } = DASHBOARD_TICKETS_PAGE;
  return (
    <>
      <DashboardPageHeader icon={icon} title={title} action={action} />
      <div className="relative mt-[14px] h-[70vh] min-h-[520px] w-full px-6 pb-16 lg:h-[calc(100dvh-var(--shop-header-h)-80px)]">
        <ContactTicketsChat tickets={feed.items || []} ticket={result.ticket} />
      </div>
    </>
  );
}
