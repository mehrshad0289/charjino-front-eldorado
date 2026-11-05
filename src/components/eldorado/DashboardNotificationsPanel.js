"use client";

import { useState } from "react";

/* Session 26 — /dashboard/notifications panel: the messages-notempty
   capture's chip-row pattern (active dark rgb(34,33,39), rest
   rgb(244,244,244), bold 14/21 rounded-lg) filtering a notification
   list (icon disc + text + time + blue unread dot). Content:
   dashboardExtraData.js (template-generated, no capture). */

export default function DashboardNotificationsPanel({ tabs, items }) {
  const [active, setActive] = useState(tabs[0]);
  const visible = active === "All" ? items : items.filter((i) => i.tab === active);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            aria-pressed={active === tab}
            onClick={() => setActive(tab)}
            className={`inline-block min-h-[42px] min-w-[70px] overflow-hidden rounded-lg px-4 py-[10px] text-center text-[14px] font-bold leading-[21px] ${
              active === tab
                ? "bg-[rgb(34,_33,_39)] text-white"
                : "bg-[rgb(244,_244,_244)] text-[rgb(20,_20,_26)]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <ul className="overflow-hidden rounded-lg border border-cardborder bg-card">
        {visible.map((n) => (
          <li key={n.id} className="flex items-center gap-3 border-b border-cardborder px-4 py-3.5 last:border-b-0">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[rgb(244,_244,_244)] text-[rgb(106,_102,_123)]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                {n.icon === "orders" && <path d="M4 7h13.2l-1 8.5H6.2L4.6 4.5H3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />}
                {n.icon === "messages" && <path d="M3.5 7.5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2v-9Zm2 .5 8 6 8-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />}
                {n.icon === "settings" && <path d="M12 8.6a3.4 3.4 0 1 0 0 6.8 3.4 3.4 0 0 0 0-6.8ZM12 3v2.2M12 18.8V21M4.8 7.2l1.6 1.6M17.6 15.2l1.6 1.6M3 12h2.2M18.8 12H21M4.8 16.8l1.6-1.6M17.6 8.8l1.6-1.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />}
                {n.icon === "feedback" && <path d="m12 4 2.3 4.9 5.2.6-3.9 3.6 1.1 5.2L12 15.6l-4.7 2.7 1.1-5.2L4.5 9.5l5.2-.6L12 4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />}
              </svg>
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[14px] leading-[21px] text-[rgb(20,_20,_26)]">{n.text}</span>
              <span className="mt-0.5 block text-[12px] text-graytext">{n.time}</span>
            </span>
            {n.unread && <span className="block size-2.5 shrink-0 rounded-full bg-[rgb(71,_131,_255)]" aria-label="Unread" />}
          </li>
        ))}
        {visible.length === 0 && (
          <li className="px-4 py-10 text-center text-[14px] text-graytext">No notifications in this category.</li>
        )}
      </ul>
    </div>
  );
}
