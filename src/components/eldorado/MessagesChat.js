"use client";

import { useEffect, useRef, useState } from "react";
import { listingMediaUrl } from "@/lib/listing";
import { formatOrderDate, orderStatusMeta } from "@/lib/order";
import { toFaDigits } from "@/lib/fa-digits";
import { ChatListSkeleton, ChatThreadSkeleton } from "./Skeleton";

function ClientTime({ iso }) {
  const [label, setLabel] = useState("");
  useEffect(() => {
    setLabel(formatOrderDate(iso));
  }, [iso]);
  return <span suppressHydrationWarning>{label}</span>;
}

function Avatar({ src, name, size = 40 }) {
  const url = listingMediaUrl(src);
  if (url) {
    return (
      <img
        src={url}
        alt=""
        width={size}
        height={size}
        className="shrink-0 rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }
  const initial = (name || "ک").trim().slice(0, 1);
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full bg-badgebg text-[13px] font-bold text-ink"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {initial}
    </span>
  );
}

const PIN_SVG = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="m21 12-8.5 8.5a5.5 5.5 0 0 1-7.8-7.8L13 4.4a3.7 3.7 0 0 1 5.2 5.2l-8.3 8.3a1.8 1.8 0 0 1-2.6-2.6l7.7-7.7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const SMILE_SVG = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
    <path d="M8.5 14a4.5 4.5 0 0 0 7 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="9" cy="10" r="1.1" fill="currentColor" />
    <circle cx="15" cy="10" r="1.1" fill="currentColor" />
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

function lastPreview(conversation, youPrefix) {
  if (!conversation?.last_body) return conversation?.title || "";
  if (conversation.last_sender_role && conversation.last_sender_role === conversation.role) {
    return `${youPrefix}${conversation.last_body}`;
  }
  return conversation.last_body;
}

export default function MessagesChat({
  copy,
  loading,
  error,
  conversations,
  active,
  messages,
  threadLoading,
  threadOpen,
  draft,
  sending,
  sendError,
  onDraftChange,
  onOpen,
  onBack,
  onSend,
}) {
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [active?.order_no, threadOpen, messages.length]);

  const empty = !loading && conversations.length === 0;

  return (
    <div className="flex h-full min-h-0 gap-4 max-lg:flex-col">
      <aside
        aria-label="گفتگوها"
        className={`w-[300px] shrink-0 rounded-lg border border-cardborder bg-card max-lg:w-full lg:overflow-y-auto ${
          threadOpen ? "max-lg:hidden" : ""
        }`}
      >
        {loading ? (
          <ChatListSkeleton />
        ) : error ? (
          <p className="px-4 py-6 text-[14px] text-[rgb(232,27,22)]">{error}</p>
        ) : empty ? (
          <div className="px-4 py-8">
            <p className="text-[15px] font-bold">{copy.emptyTitle}</p>
            <p className="mt-2 text-[13px] leading-[20px] text-graytext">{copy.emptyText}</p>
          </div>
        ) : (
          conversations.map((conversation) => (
            <button
              key={conversation.order_no}
              type="button"
              onClick={() => onOpen(conversation.order_no)}
              aria-current={conversation.order_no === active?.order_no ? "true" : undefined}
              className={`flex w-full items-center gap-3 border-b border-cardborder px-4 py-3 text-start last:border-b-0 ${
                conversation.order_no === active?.order_no ? "bg-[rgba(71,_131,_255,_0.08)]" : "hover:bg-[#fafafa]"
              }`}
            >
              <Avatar src={conversation.counterpart_avatar} name={conversation.counterpart_name} />
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="truncate text-[14px] font-bold leading-[20px] text-ink">
                    {conversation.counterpart_name}
                  </span>
                  <span className="shrink-0 text-[11px] text-graytext">
                    <ClientTime iso={conversation.last_at} />
                  </span>
                </span>
                <span className="mt-0.5 flex items-center justify-between gap-2">
                  <span className="truncate text-[13px] leading-[18px] text-secondary">
                    {lastPreview(conversation, copy.youPrefix)}
                  </span>
                  {conversation.unread > 0 && (
                    <span className="grid h-5 min-w-5 shrink-0 place-items-center rounded-full bg-brand px-1.5 text-[11px] font-bold text-ink">
                      {toFaDigits(conversation.unread)}
                    </span>
                  )}
                </span>
                <span className="mt-0.5 block truncate text-[11px] text-graytext">
                  {conversation.category}
                  {conversation.title ? ` · ${conversation.title}` : ""}
                </span>
              </span>
            </button>
          ))
        )}
      </aside>

      <section
        aria-label={active ? `گفتگو با ${active.counterpart_name}` : "گفتگو"}
        className={`flex min-h-0 min-w-0 grow flex-col rounded-lg border border-cardborder bg-card ${
          threadOpen ? "max-lg:h-[70vh] max-lg:max-h-[640px]" : "max-lg:hidden"
        }`}
      >
        {!active ? (
          <div className="grid grow place-items-center px-6 text-center">
            <p className="text-[14px] text-graytext">{copy.emptyText}</p>
          </div>
        ) : (
          <>
            <header className="flex items-center gap-3 border-b border-cardborder px-5 py-3">
              <button
                type="button"
                onClick={onBack}
                aria-label={copy.back}
                className="-ms-2 grid size-9 shrink-0 place-items-center rounded-full text-ink hover:bg-[rgb(244,_244,_244)] lg:hidden"
              >
                {BACK_SVG}
              </button>
              <Avatar src={active.counterpart_avatar} name={active.counterpart_name} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[15px] font-bold leading-[21px]">{active.counterpart_name}</div>
                <div className="flex flex-wrap items-center gap-1.5 text-[12px] text-graytext">
                  <span className="rounded-full bg-[rgb(244,_244,_244)] px-2 py-0.5 text-[11px] font-bold text-[rgb(20,_20,_26)]">
                    {active.category}
                  </span>
                  <span className="truncate">{active.title}</span>
                  <span aria-hidden="true">·</span>
                  <span>{orderStatusMeta(active.status).label}</span>
                </div>
              </div>
              {active.href ? (
                <a href={active.href} className="shrink-0 text-[12px] font-bold text-[rgb(71,131,255)] hover:underline">
                  {copy.openOrder}
                </a>
              ) : null}
            </header>

            <div ref={scrollRef} className="min-h-0 grow overflow-y-auto px-5 py-4">
              {threadLoading && messages.length === 0 ? (
                <ChatThreadSkeleton />
              ) : messages.length === 0 ? (
                <p className="text-[14px] text-graytext">هنوز پیامی نیست.</p>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {messages.map((item) => {
                    if (item.sender_role === "arbiter") {
                      return (
                        <div key={item.id} className="mx-auto max-w-[85%] text-center">
                          <div className="rounded-2xl bg-[rgba(255,201,80,0.25)] px-4 py-2.5 text-[14px] leading-[20px] text-ink">
                            <p className="mb-1 text-[11px] font-bold">{copy.arbiterName}</p>
                            <p className="whitespace-pre-wrap">{item.body}</p>
                          </div>
                          <div className="mt-1 text-[11px] text-graytext">
                            <ClientTime iso={item.at} />
                          </div>
                        </div>
                      );
                    }
                    const mine = item.sender_role === active.role;
                    return (
                      <div key={item.id} className={`max-w-[75%] ${mine ? "self-end" : "self-start"}`}>
                        <div
                          className={`rounded-2xl px-4 py-2.5 text-[14px] leading-[20px] ${
                            mine
                              ? "rounded-br-md bg-[rgb(71,_131,_255)] text-white"
                              : "rounded-bl-md bg-[rgb(244,_244,_244)] text-[rgb(20,_20,_26)]"
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{item.body}</p>
                        </div>
                        <div className={`mt-1 text-[11px] text-graytext ${mine ? "text-end" : ""}`}>
                          <ClientTime iso={item.at} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <form onSubmit={onSend} className="flex items-center gap-2 border-t border-cardborder px-4 py-3">
              <span className="grid size-9 place-items-center rounded-full text-graytext" aria-hidden="true">
                {PIN_SVG}
              </span>
              <span className="grid size-9 place-items-center rounded-full text-graytext" aria-hidden="true">
                {SMILE_SVG}
              </span>
              <input
                value={draft}
                onChange={(event) => onDraftChange(event.target.value)}
                placeholder={copy.placeholder}
                aria-label={copy.placeholder}
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
            </form>
            {sendError ? <p className="px-4 pb-3 text-[13px] text-[rgb(232,27,22)]">{sendError}</p> : null}
          </>
        )}
      </section>
    </div>
  );
}
