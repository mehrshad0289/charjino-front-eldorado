"use client";

import { useState } from "react";

/* Session 23 — /dashboard/messages filter bar, verbatim from the
   user-pushed "not-empty" capture (ui ux/messages-notempty/
   www_eldorado_gg_dashboard_messages…(1).make, commit 8111ede, decoded
   to snapshots/msgnotempty-1920px-light-1.tsx, 1920-only):
   - Tab row `flex gap-2`: "All" active (bg rgb(34,33,39) white),
     "Support" / "Pre-purchase" inactive (bg rgb(244,244,244), text
     rgb(20,20,26)); buttons font-bold 14/21, min-h 42, min-w 70,
     px-4 py-10px, rounded-lg.
   - "Unread messages only" row (text rgb(106,102,123)) with the
     captured iOS-style switch (w-16 h-10 wrapper, w-12 h-5 track
     rgb(231,231,231) rounded-2xl, knob w-6 h-6 white rounded-full,
     top -2px, shadow rgba(9,9,11,.05)/(.02)); capture state OFF.
     ON styling follows the settings page's captured switch convention
     (blue knob rgba(71,131,255)) — documented reuse, not invention.
   Renders as a fragment so its two rows participate in the page
   column's `flex-col gap-4` (the capture's 16px rhythm).
   The chat inbox below the bar is a client-rendered widget on live and
   never serializes into the capture — the page keeps that mount area
   empty verbatim (boosting-page empty-carousel precedent). */

function TabButton({ label, active, onClick }) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={`inline-block min-h-[42px] min-w-[70px] overflow-hidden rounded-lg px-4 py-[10px] text-center text-[14px] font-bold leading-[21px] ${
        active
          ? "bg-[rgb(34,_33,_39)] text-white"
          : "bg-[rgb(244,_244,_244)] text-[rgb(20,_20,_26)]"
      }`}
    >
      <span className="flex items-center justify-center gap-[6px] text-center">
        <span className="block text-center">{label}</span>
      </span>
    </button>
  );
}

export default function MessagesFilterBar({ tabs, unreadLabel }) {
  const [active, setActive] = useState(tabs[0]);
  const [unreadOnly, setUnreadOnly] = useState(false);
  return (
    <>
      <div className="flex gap-2">
        {tabs.map((t) => (
          <TabButton key={t} label={t} active={t === active} onClick={() => setActive(t)} />
        ))}
      </div>
      <div className="flex items-center justify-start text-[rgb(106,_102,_123)]">
        <span className="block">{unreadLabel}</span>
        <div>
          <div className="flex h-10 w-16 items-center justify-center">
            <button
              type="button"
              role="switch"
              aria-checked={unreadOnly}
              aria-label={unreadLabel}
              onClick={() => setUnreadOnly((v) => !v)}
              className={`relative inline-flex h-5 w-12 shrink-0 items-center rounded-2xl transition-colors ${
                unreadOnly ? "bg-[rgba(71,_131,_255,0.2)]" : "bg-[rgb(231,_231,_231)]"
              }`}
            >
              <span
                className={`absolute left-0 top-[-2px] h-6 w-6 rounded-full shadow-[rgba(9,9,11,0.05)_0px_2px_4px_0px,_rgba(9,9,11,0.02)_0px_12px_8px_0px] transition-transform ${
                  unreadOnly ? "translate-x-6 bg-[rgb(71,_131,_255)]" : "translate-x-0 bg-white"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
