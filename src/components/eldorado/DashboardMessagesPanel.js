"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getMarketChats, getOrderMessages, sendOrderMessage } from "@/actions/market.actions";
import MessagesChat from "./MessagesChat";

export default function DashboardMessagesPanel({ chips, unreadToggleLabel, copy }) {
  const [activeChip, setActiveChip] = useState(chips[0]?.id || "all");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeOrderNo, setActiveOrderNo] = useState(null);
  const [threadOpen, setThreadOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [threadLoading, setThreadLoading] = useState(false);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const activeOrderNoRef = useRef(null);

  const loadInbox = useCallback(async (keepOrderNo) => {
    setError("");
    const side = activeChip === "buy" || activeChip === "sell" ? activeChip : null;
    const result = await getMarketChats({ side, unreadOnly });
    if (!result.ok) {
      setConversations([]);
      setError(result.message || "گفتگوها خوانده نشد.");
      return [];
    }
    const items = result.items;
    setConversations(items);
    if (items.length === 0) {
      setActiveOrderNo(null);
      setThreadOpen(false);
      return items;
    }
    const stillThere = keepOrderNo && items.some((item) => item.order_no === keepOrderNo);
    if (stillThere) return items;
    setActiveOrderNo(items[0].order_no);
    return items;
  }, [activeChip, unreadOnly]);

  useEffect(() => {
    activeOrderNoRef.current = activeOrderNo;
  }, [activeOrderNo]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    loadInbox(activeOrderNoRef.current).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [loadInbox]);

  const loadThread = useCallback(async (orderNo) => {
    if (!orderNo) {
      setMessages([]);
      return;
    }
    setThreadLoading(true);
    const result = await getOrderMessages(orderNo);
    setThreadLoading(false);
    if (result.ok) {
      setMessages(result.items);
      setConversations((rows) => rows.map((row) => (row.order_no === orderNo ? { ...row, unread: 0 } : row)));
    }
  }, []);

  useEffect(() => {
    loadThread(activeOrderNo);
  }, [activeOrderNo, loadThread]);

  useEffect(() => {
    if (!activeOrderNo) return undefined;
    const timer = window.setInterval(() => {
      loadThread(activeOrderNo);
    }, 8000);
    return () => window.clearInterval(timer);
  }, [activeOrderNo, loadThread]);

  const openConversation = (orderNo) => {
    setActiveOrderNo(orderNo);
    setThreadOpen(true);
    setDraft("");
    setSendError("");
  };

  const send = async (event) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || !activeOrderNo) return;
    setSending(true);
    setSendError("");
    const result = await sendOrderMessage(activeOrderNo, text);
    setSending(false);
    if (!result.ok) {
      setSendError(result.message || "ارسال نشد.");
      return;
    }
    setDraft("");
    setMessages((items) => [...items, result.data]);
    await loadInbox(activeOrderNo);
  };

  const active = conversations.find((item) => item.order_no === activeOrderNo) || null;

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-nowrap gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:flex-wrap lg:pb-0">
        {chips.map((chip) => (
          <div key={chip.id} className="min-w-fit shrink-0">
            <button
              type="button"
              aria-label={chip.label}
              aria-pressed={activeChip === chip.id}
              onClick={() => setActiveChip(chip.id)}
              className={`inline-block min-h-[42px] min-w-[70px] shrink-0 overflow-hidden rounded-lg px-4 py-[10px] text-center text-[14px] font-bold leading-[21px] ${
                activeChip === chip.id
                  ? "bg-[rgb(34,_33,_39)] text-white"
                  : "bg-[rgb(244,_244,_244)] text-[rgb(20,_20,_26)]"
              }`}
            >
              {chip.label}
            </button>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-start text-[rgb(106,_102,_123)]">
        <span className="block text-[14px] leading-[21px]">{unreadToggleLabel}</span>
        <div className="flex h-10 w-16 items-center justify-center">
          <span className="relative block h-5 w-12">
            <input
              type="checkbox"
              role="switch"
              aria-label={unreadToggleLabel}
              checked={unreadOnly}
              onChange={(e) => setUnreadOnly(e.target.checked)}
              className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
            />
            <span
              className={`pointer-events-none block h-full w-full rounded-2xl transition-colors ${
                unreadOnly ? "bg-[rgba(71,_131,_255,_0.2)]" : "bg-[rgb(231,_231,_231)]"
              }`}
            />
            <span
              className={`pointer-events-none absolute top-[-2px] block h-6 w-6 rounded-[50%] shadow-[rgba(9,_9,_11,_0.05)_0px_2px_4px_0px,_rgba(9,_9,_11,_0.02)_0px_12px_8px_0px] transition-[left,background-color] ${
                unreadOnly ? "left-6 bg-[rgb(71,_131,_255)]" : "left-0 bg-white"
              }`}
            />
          </span>
        </div>
      </div>
      <div className="flex grow basis-[0%] flex-col">
        <div className="h-full min-h-0">
          <div aria-label="Chat" className="size-full min-h-0 overflow-hidden">
            <MessagesChat
              copy={copy}
              loading={loading}
              error={error}
              conversations={conversations}
              active={active}
              messages={messages}
              threadLoading={threadLoading}
              threadOpen={threadOpen}
              draft={draft}
              sending={sending}
              sendError={sendError}
              onDraftChange={setDraft}
              onOpen={openConversation}
              onBack={() => setThreadOpen(false)}
              onSend={send}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
