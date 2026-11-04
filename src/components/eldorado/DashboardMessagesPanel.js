"use client";

import { useState } from "react";
import MessagesChat from "./MessagesChat";

/* Session 22 — /dashboard/messages content per the user-pushed
   "messages-notempty" capture (ui ux/messages-notempty/, decoded with
   decode_session22_messages.py). Replaces the session-17 empty state:
   filter chip row (All active dark rgb(34,33,39); others bg
   rgb(244,244,244); all font-bold 14/21 min-h-42 min-w-70 px-4 py-[10px]
   rounded-lg, row gap 8) + "Unread messages only" toggle (track 48x20
   rounded-2xl rgb(231,231,231), knob 24 white shadow, checked = knob
   rgb(71,131,255) on rgba(71,131,255,0.2) per the settings-capture
   toggle pattern; no ON state exists in this capture — documented
   assumption) + an aria-label="Chat" container that is EMPTY in every
   reference (the real chat is a client-rendered app; nothing invented).
   The capture is 1920-only; below lg the chip row wraps (documented
   approximation). */
export default function DashboardMessagesPanel({ chips, unreadToggleLabel }) {
  const [active, setActive] = useState(chips[0]);
  const [unreadOnly, setUnreadOnly] = useState(false);

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {chips.map((chip) => (
          <div key={chip} className="min-w-fit">
            <button
              type="button"
              aria-label={chip}
              aria-pressed={active === chip}
              onClick={() => setActive(chip)}
              className={`inline-block min-h-[42px] min-w-[70px] overflow-hidden rounded-lg px-4 py-[10px] text-center text-[14px] font-bold leading-[21px] ${
                active === chip
                  ? "bg-[rgb(34,_33,_39)] text-white"
                  : "bg-[rgb(244,_244,_244)] text-[rgb(20,_20,_26)]"
              }`}
            >
              {chip}
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
          {/* Session 26: the capture leaves this container empty (the real
              chat is a client-rendered app) — the user asked for the chat
              page to be built, so it now renders MessagesChat (content
              provenance: messagesChatData.js). */}
          <div aria-label="Chat" className="size-full min-h-0 overflow-hidden">
            <MessagesChat />
          </div>
        </div>
      </div>
    </div>
  );
}
