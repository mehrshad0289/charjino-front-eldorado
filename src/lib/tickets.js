import { listingMediaUrl } from "@/lib/listing";
import { formatOrderDate } from "@/lib/order";
import { CONTACT_PAGE } from "@/components/eldorado/data/staticPagesData";

export const TICKET_INBOX = "/dashboard/tickets";
export const TICKET_NEW = "/dashboard/tickets/new";
export const TICKET_STATUS = CONTACT_PAGE.statuses;

export function ticketHref(id) {
  const key = String(id || "").trim();
  return key ? `${TICKET_INBOX}/${encodeURIComponent(key)}` : TICKET_INBOX;
}

export function ticketLoginHref(next = TICKET_NEW) {
  return `/login?next=${encodeURIComponent(next)}`;
}

export function ticketStatusLabel(status) {
  return TICKET_STATUS[status] || status || "";
}

export function ticketCategoryLabel(category) {
  const row = CONTACT_PAGE.categories.find((item) => item.id === category);
  return row?.label || category || "";
}

export function ticketAttachmentUrl(url) {
  return listingMediaUrl(url);
}

export function ticketWhen(iso) {
  return formatOrderDate(iso);
}
