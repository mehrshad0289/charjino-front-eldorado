"use client";

import { useEffect, useRef, useState } from "react";
import { MESSAGES_CHAT } from "./data/messagesChatData";

/* Session 26/27 — the chat thread UI inside /dashboard/messages' empty
   aria-label="Chat" container (user request: the chat page must be
   built; the capture leaves the container empty, content provenance in
   messagesChatData.js). Two-pane client chat in the dashboard's design
   tokens: conversation list (active row blue-tinted, yellow unread
   badges) + thread (date separators, gray incoming / brand-blue
   outgoing bubbles, offer attachment card, Send row). Clicking a
   conversation switches the thread; sending appends locally.
   Session 27 (user: "messages mobile is terrible"): below lg the chat
   is a single-pane flow instead of both panes stacked — conversation
   list first (natural height, no cut-off rows), tapping a conversation
   opens the thread (70vh, newest messages auto-scrolled into view)
   with a back button to return to the list. The old mobile styling
   (220px internally-scrolled list above the thread inside the desktop
   900px box) clipped rows mid-height and pushed Send below the fold.
   max-md → max-lg so tablet (768–1023) uses the same flow as the
   stacked DashboardShell sidebar. */

function Avatar({ src, alt, size = 40 }) {
  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className="shrink-0 rounded-full object-cover"
      style={{ width: size, height: size }}
    />
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

export default function MessagesChat() {
  const { me, conversations } = MESSAGES_CHAT;
  const [activeId, setActiveId] = useState(conversations[0].id);
  const [draft, setDraft] = useState("");
  /* threadOpen only drives the <lg single-pane flow: on desktop both
     panes render side by side no matter what this state is. */
  const [threadOpen, setThreadOpen] = useState(false);
  const [threads, setThreads] = useState(() =>
    Object.fromEntries(conversations.map((c) => [c.id, c.thread]))
  );
  const scrollRef = useRef(null);
  const active = conversations.find((c) => c.id === activeId);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [activeId, threadOpen, threads]);

  const openConversation = (id) => {
    setActiveId(id);
    setThreadOpen(true);
  };

  const send = (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setThreads((t) => ({ ...t, [activeId]: [...t[activeId], { from: "me", text, time: now }] }));
    setDraft("");
  };

  return (
    <div className="flex h-full min-h-0 gap-4 max-lg:flex-col">
      {/* conversation list */}
      <aside
        aria-label="Conversations"
        className={`w-[300px] shrink-0 rounded-lg border border-cardborder bg-card max-lg:w-full lg:overflow-y-auto ${
          threadOpen ? "max-lg:hidden" : ""
        }`}
      >
        {conversations.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => openConversation(c.id)}
            aria-current={c.id === activeId}
            className={`flex w-full items-center gap-3 border-b border-cardborder px-4 py-3 text-left last:border-b-0 ${
              c.id === activeId ? "bg-[rgba(71,_131,_255,_0.08)]" : "hover:bg-[#fafafa]"
            }`}
          >
            <span className="relative">
              <Avatar src={c.avatar} alt={c.name} />
              {c.online && (
                <span className="absolute -right-0.5 -top-0.5 block size-2.5 rounded-full border-2 border-white bg-[rgb(52,_199,_89)]" />
              )}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center justify-between gap-2">
                <span className="truncate text-[14px] font-bold leading-[20px] text-ink">{c.name}</span>
                <span className="shrink-0 text-[11px] text-graytext">{c.time}</span>
              </span>
              <span className="mt-0.5 flex items-center justify-between gap-2">
                <span className="truncate text-[13px] leading-[18px] text-secondary">
                  {(() => {
                    const last = [...threads[c.id]].reverse().find((m) => m.text);
                    const who = last?.from === "me" ? "You: " : "";
                    return `${who}${last ? last.text : ""}`;
                  })()}
                </span>
                {c.unread > 0 && (
                  <span className="grid h-5 min-w-5 shrink-0 place-items-center rounded-full bg-brand px-1.5 text-[11px] font-bold text-ink">
                    {c.unread}
                  </span>
                )}
              </span>
            </span>
          </button>
        ))}
      </aside>

      {/* thread */}
      <section
        aria-label={`Chat with ${active.name}`}
        className={`flex min-h-0 min-w-0 grow flex-col rounded-lg border border-cardborder bg-card ${
          threadOpen ? "max-lg:h-[70vh] max-lg:max-h-[640px]" : "max-lg:hidden"
        }`}
      >
        <header className="flex items-center gap-3 border-b border-cardborder px-5 py-3">
          <button
            type="button"
            onClick={() => setThreadOpen(false)}
            aria-label="Back to conversations"
            className="-ml-2 grid size-9 shrink-0 place-items-center rounded-full text-ink hover:bg-[rgb(244,_244,_244)] lg:hidden"
          >
            {BACK_SVG}
          </button>
          <Avatar src={active.avatar} alt={active.name} />
          <div className="min-w-0">
            <div className="truncate text-[15px] font-bold leading-[21px]">{active.name}</div>
            <div className="flex items-center gap-1.5 text-[12px] text-graytext">
              <span
                className={`block size-2 rounded-full ${active.online ? "bg-[rgb(52,_199,_89)]" : "bg-[rgb(201,_201,_207)]"}`}
              />
              {active.online ? "Online" : "Offline"}
              <span aria-hidden="true">·</span>
              <span className="rounded-full bg-[rgb(244,_244,_244)] px-2 py-0.5 text-[11px] font-bold text-[rgb(20,_20,_26)]">
                {active.category}
              </span>
            </div>
          </div>
        </header>

        <div ref={scrollRef} className="min-h-0 grow overflow-y-auto px-5 py-4">
          <div className="flex flex-col gap-2.5">
            {threads[activeId].map((m, i) =>
              m.date ? (
                <div key={i} className="py-2 text-center text-[12px] font-bold uppercase tracking-wide text-graytext">
                  {m.date}
                </div>
              ) : m.attachment ? (
                <div key={i} className="max-w-[75%] self-start rounded-2xl border border-cardborder bg-[rgb(244,_244,_244)] px-4 py-3">
                  <a href={m.attachment.href} className="block text-[14px] font-bold leading-[20px] text-ink underline-offset-2 hover:underline">
                    {m.attachment.label}
                  </a>
                  <div className="mt-1 text-[12px] text-graytext">{m.attachment.meta}</div>
                  <div className="mt-1 text-right text-[11px] text-graytext">{m.time}</div>
                </div>
              ) : (
                <div key={i} className={`max-w-[75%] ${m.from === "me" ? "self-end" : "self-start"}`}>
                  <div
                    className={`rounded-2xl px-4 py-2.5 text-[14px] leading-[20px] ${
                      m.from === "me"
                        ? "rounded-br-md bg-[rgb(71,_131,_255)] text-white"
                        : "rounded-bl-md bg-[rgb(244,_244,_244)] text-[rgb(20,_20,_26)]"
                    }`}
                  >
                    {m.text}
                  </div>
                  <div className={`mt-1 text-[11px] text-graytext ${m.from === "me" ? "text-right" : ""}`}>
                    {m.time}
                    {m.from === "me" ? " · Seen" : ""}
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        <form onSubmit={send} className="flex items-center gap-2 border-t border-cardborder px-4 py-3">
          <button type="button" aria-label="Attach file" className="grid size-9 place-items-center rounded-full text-graytext hover:bg-[rgb(244,_244,_244)]">
            {PIN_SVG}
          </button>
          <button type="button" aria-label="Add emoji" className="grid size-9 place-items-center rounded-full text-graytext hover:bg-[rgb(244,_244,_244)]">
            {SMILE_SVG}
          </button>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={`Message ${active.name}…`}
            aria-label="Type a message"
            className="h-10 min-w-0 grow rounded-full bg-[rgb(244,_244,_244)] px-4 text-[14px] outline-none placeholder:text-graytext"
          />
          <button
            type="submit"
            aria-label="Send message"
            className="flex h-10 items-center gap-2 rounded-full bg-brand px-5 text-[14px] font-bold text-ink hover:opacity-90"
          >
            Send {SEND_SVG}
          </button>
        </form>
      </section>
      <span className="sr-only">{me}</span>
    </div>
  );
}
