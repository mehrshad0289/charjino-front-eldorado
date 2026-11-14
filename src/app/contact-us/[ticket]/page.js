import { connection } from "next/server";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/actions/auth.actions";
import { ticketHref, ticketLoginHref } from "@/lib/tickets";

export const instant = false;

export default async function ContactTicketRoute({ params }) {
  await connection();
  const { ticket: id } = await params;
  const user = await getSessionUser();
  const next = ticketHref(id);
  if (!user) redirect(ticketLoginHref(next));
  redirect(next);
}
