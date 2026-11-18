"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getTicket, replyTicket } from "@/actions/tickets.actions";
import { CONTACT_PAGE } from "./data/staticPagesData";
import EmptyState from "./EmptyState";
import { FA } from "./data/faCopy";
import ContactTicketPhotos from "./ContactTicketPhotos";
import { TICKET_INBOX, TICKET_NEW, ticketCategoryLabel, ticketHref, ticketLoginHref, ticketStatusLabel, ticketWhen } from "@/lib/tickets";

const copy = CONTACT_PAGE.ticket;

function ClientTime({ iso }) {
  const [label, setLabel] = useState("");
  useEffect(() => {
    setLabel(ticketWhen(iso));
  }, [iso]);
  return <span suppressHydrationWarning>{label}</span>;
}

function SupportAvatar({ size = 40 }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full bg-brand text-ink"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none">
        <path
          d="M4 6.8C4 5.25 5.25 4 6.8 4h10.4C18.75 4 20 5.25 20 6.8v7.4c0 1.55-1.25 2.8-2.8 2.8H9l-3.6 3V17H6.8C5.25 17 4 15.75 4 14.2V6.8Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

const PIN_SVG = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="m21 12-8.5 8.5a5.5 5.5 0 0 1-7.8-7.8L13 4.4a3.7 3.7 0 0 1 5.2 5.2l-8.3 8.3a1.8 1.8 0 0 1-2.6-2.6l7.7-7.7"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const SEND_SVG = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 12 20 4l-4 16-4.5-6.5L4 12Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
  </svg>
);
const BACK_SVG = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M19 12H5m0 0 6-6m-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function lastPreview(row) {
  const body = String(row.lastBody || row.subject || "").trim();
  if (!body) return copy.emptyPreview;
  if (row.lastSender === "user") return `${copy.youPrefix}${body}`;
  return body;
}

export default function ContactTicketsChat({ tickets = [], ticket = null }) {
  const router = useRouter();
  const scrollRef = useRef(null);
  const fileRef = useRef(null);
  const [thread, setThread] = useState(ticket);
  const [rows, setRows] = useState(Array.isArray(tickets) ? tickets : []);
  const [draft, setDraft] = useState("");
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const threadOpen = Boolean(thread?.id);
  const closed = thread?.status === "closed";
  const loginHref = ticketLoginHref(thread?.id ? ticketHref(thread.id) : TICKET_INBOX);

  useEffect(() => {
    setThread(ticket);
  }, [ticket]);

  useEffect(() => {
    setRows(Array.isArray(tickets) ? tickets : []);
  }, [tickets]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [thread?.id, thread?.messages?.length]);

  useEffect(() => {
    if (!thread?.id) return undefined;
    const timer = window.setInterval(async () => {
      const result = await getTicket(thread.id);
      if (result.ok && result.ticket) setThread(result.ticket);
    }, 8000);
    return () => window.clearInterval(timer);
  }, [thread?.id]);

  function onPickFiles(event) {
    const next = [...(event.currentTarget.files || [])].slice(0, 5);
    setFiles(next);
    setPreviews(next.map((file) => URL.createObjectURL(file)));
  }

  async function onSend(event) {
    event.preventDefault();
    if (!thread?.id || closed) return;
    const text = draft.trim();
    if (!text && files.length === 0) return;
    setSending(true);
    setSendError("");
    const body = new FormData();
    body.set("body", text);
    for (const file of files) body.append("images", file);
    const result = await replyTicket(thread.id, body);
    setSending(false);
    if (result.unauthorized) {
      router.push(loginHref);
      return;
    }
    if (!result.ok) {
      setSendError(result.message || "پیام ثبت نشد.");
      return;
    }
    setDraft("");
    setFiles([]);
    setPreviews([]);
    if (fileRef.current) fileRef.current.value = "";
    if (result.ticket) {
      setThread(result.ticket);
      setRows((items) =>
        items.map((row) =>
          row.id === result.ticket.id
            ? {
                ...row,
                status: result.ticket.status,
                lastBody: result.ticket.lastBody || text,
                lastSender: result.ticket.lastSender || "user",
                lastAt: result.ticket.lastAt || result.ticket.updatedAt,
                updatedAt: result.ticket.updatedAt,
              }
            : row,
        ),
      );
    }
  }

  return (
    <div className="flex h-full min-h-0 gap-4 max-lg:flex-col">
      <aside
        id="tickets"
        aria-label={copy.mine}
        className={`w-[300px] shrink-0 overflow-y-auto rounded-lg border border-cardborder bg-card max-lg:w-full ${
          threadOpen ? "max-lg:hidden" : ""
        }`}
      >
        {rows.length === 0 ? (
          <div className="px-4 py-8">
            <EmptyState title={FA.nothingFound} text={copy.empty} />
            <div className="flex justify-center">
              <a href={TICKET_NEW} className="mt-2 inline-flex min-h-10 items-center rounded-lg bg-darkbtn px-4 text-[13px] font-bold text-white">
                {copy.heading}
              </a>
            </div>
          </div>
        ) : (
          rows.map((row) => (
            <a
              key={row.id}
              href={ticketHref(row.id)}
              aria-current={row.id === thread?.id ? "true" : undefined}
              className={`flex w-full items-center gap-3 border-b border-cardborder px-4 py-3 text-start last:border-b-0 ${
                row.id === thread?.id ? "bg-[rgba(71,_131,_255,_0.08)]" : "hover:bg-[#fafafa]"
              }`}
            >
              <SupportAvatar />
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="truncate text-[14px] font-bold leading-[20px] text-ink">{row.subject}</span>
                  <span className="shrink-0 text-[11px] text-graytext">
                    <ClientTime iso={row.lastAt || row.updatedAt || row.createdAt} />
                  </span>
                </span>
                <span className="mt-0.5 block truncate text-[13px] leading-[18px] text-secondary">{lastPreview(row)}</span>
                <span className="mt-0.5 flex items-center justify-between gap-2">
                  <span className="truncate text-[11px] text-graytext">
                    {row.number} · {ticketCategoryLabel(row.category)}
                  </span>
                  <span className="rounded-full bg-[rgb(244,_244,_244)] px-2 py-0.5 text-[11px] font-bold text-ink">
                    {ticketStatusLabel(row.status)}
                  </span>
                </span>
              </span>
            </a>
          ))
        )}
      </aside>

      <section
        aria-label={thread ? `${copy.staff} — ${thread.subject}` : copy.mine}
        className={`flex min-h-0 min-w-0 grow flex-col rounded-lg border border-cardborder bg-card ${
          threadOpen ? "max-lg:h-[70vh] max-lg:max-h-[640px]" : "max-lg:hidden"
        }`}
      >
        {!thread ? (
          <div className="grid grow place-items-center px-6 text-center">
            <div>
              <p className="text-[14px] text-graytext">{copy.pick}</p>
              <a href={TICKET_NEW} className="mt-4 inline-flex min-h-10 items-center rounded-lg bg-darkbtn px-4 text-[13px] font-bold text-white">
                {copy.heading}
              </a>
            </div>
          </div>
        ) : (
          <>
            <header className="flex items-center gap-3 border-b border-cardborder px-5 py-3">
              <a
                href={TICKET_INBOX}
                aria-label={copy.back}
                className="-ms-2 grid size-9 shrink-0 place-items-center rounded-full text-ink hover:bg-[rgb(244,_244,_244)]"
              >
                {BACK_SVG}
              </a>
              <SupportAvatar />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[15px] font-bold leading-[21px]">{copy.staff}</div>
                <div className="flex flex-wrap items-center gap-1.5 text-[12px] text-graytext">
                  <span className="truncate font-bold text-ink">{thread.subject}</span>
                  <span aria-hidden="true">·</span>
                  <span>{thread.number}</span>
                  <span className="rounded-full bg-[rgb(244,_244,_244)] px-2 py-0.5 text-[11px] font-bold text-[rgb(20,_20,_26)]">
                    {ticketCategoryLabel(thread.category)}
                  </span>
                  <span className="rounded-full bg-[rgb(244,_244,_244)] px-2 py-0.5 text-[11px] font-bold text-[rgb(20,_20,_26)]">
                    {ticketStatusLabel(thread.status)}
                  </span>
                  {thread.orderNumber ? <span>{thread.orderNumber}</span> : null}
                </div>
              </div>
              <a href={TICKET_INBOX} className="hidden shrink-0 text-[12px] font-bold text-[rgb(71,131,255)] hover:underline sm:inline">
                {copy.back}
              </a>
            </header>

            <div ref={scrollRef} className="min-h-0 grow overflow-y-auto px-5 py-4">
              {(thread.messages || []).length === 0 ? (
                <p className="text-[14px] text-graytext">{copy.emptyThread}</p>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {(thread.messages || []).map((item) => {
                    const mine = item.sender === "user";
                    return (
                      <div key={item.id} className={`max-w-[75%] ${mine ? "self-end" : "self-start"}`}>
                        <div
                          className={`rounded-2xl px-4 py-2.5 text-[14px] leading-[20px] ${
                            mine
                              ? "rounded-br-md bg-[rgb(71,_131,_255)] text-white"
                              : "rounded-bl-md bg-[rgb(244,_244,_244)] text-[rgb(20,_20,_26)]"
                          }`}
                        >
                          {item.body ? <p className="whitespace-pre-wrap">{item.body}</p> : null}
                          <ContactTicketPhotos attachments={item.attachments} tone={mine ? "dark" : "light"} />
                        </div>
                        <div className={`mt-1 text-[11px] text-graytext ${mine ? "text-end" : ""}`}>
                          <ClientTime iso={item.createdAt} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {closed ? (
              <p className="border-t border-cardborder px-5 py-4 text-[14px] text-graytext">{copy.closed}</p>
            ) : (
              <form onSubmit={onSend} className="border-t border-cardborder px-4 py-3">
                <div className="flex items-center gap-2">
                  <input
                    ref={fileRef}
                    name="images"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    className="sr-only"
                    onChange={onPickFiles}
                  />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    aria-label={copy.photos}
                    className="grid size-9 place-items-center rounded-full text-graytext hover:bg-[rgb(244,_244,_244)]"
                  >
                    {PIN_SVG}
                  </button>
                  <input
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder={copy.replyPlaceholder}
                    aria-label={copy.replyPlaceholder}
                    maxLength={4000}
                    className="h-10 min-w-0 grow rounded-full bg-[rgb(244,_244,_244)] px-4 text-[14px] outline-none placeholder:text-graytext"
                  />
                  <button
                    type="submit"
                    disabled={sending}
                    aria-label={copy.send}
                    className="flex h-10 items-center gap-2 rounded-full bg-brand px-5 text-[14px] font-bold text-ink hover:opacity-90 disabled:opacity-60"
                  >
                    {copy.send} {SEND_SVG}
                  </button>
                </div>
                {previews.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {previews.map((src) => (
                      <img key={src} alt="" src={src} className="h-16 w-16 rounded-lg object-cover" />
                    ))}
                  </div>
                ) : null}
                {sendError ? <p className="mt-2 text-[13px] text-[rgb(232,27,22)]">{sendError}</p> : null}
              </form>
            )}
          </>
        )}
      </section>
    </div>
  );
}
