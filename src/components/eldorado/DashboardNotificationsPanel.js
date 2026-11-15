"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { markAllMarketNotificationsRead, markMarketNotificationRead } from "@/actions/market.actions";
import { toFaDigits } from "@/lib/fa-digits";
import {
  isNotificationUnread,
  NOTIFICATION_TABS,
  notificationIcon,
  notificationTab,
  notificationTime,
} from "@/lib/notifications";
import { FA } from "./data/faCopy";
import DashboardIcon from "./DashboardIcons";

function NotificationGlyph({ kind }) {
  return (
    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[rgb(244,_244,_244)] text-[rgb(106,_102,_123)]">
      <DashboardIcon name={notificationIcon(kind)} size={20} />
    </span>
  );
}

export default function DashboardNotificationsPanel({ items = [], meta = null }) {
  const router = useRouter();
  const [active, setActive] = useState("all");
  const [rows, setRows] = useState(() => (Array.isArray(items) ? items : []));
  const [busy, setBusy] = useState(false);

  const visible = useMemo(
    () => (active === "all" ? rows : rows.filter((item) => notificationTab(item.kind) === active)),
    [active, rows],
  );
  const unreadCount = rows.filter(isNotificationUnread).length;

  async function onMarkOne(id) {
    setRows((current) =>
      current.map((row) => (row.id === id && !row.read_at ? { ...row, read_at: new Date().toISOString() } : row)),
    );
    const result = await markMarketNotificationRead(id);
    if (result.unauthorized) router.push("/login?next=/dashboard/notifications");
  }

  async function onMarkAll() {
    if (busy || unreadCount < 1) return;
    setBusy(true);
    const result = await markAllMarketNotificationsRead();
    setBusy(false);
    if (result.unauthorized) {
      router.push("/login?next=/dashboard/notifications");
      return;
    }
    if (result.ok) {
      const now = new Date().toISOString();
      setRows((current) => current.map((row) => (row.read_at ? row : { ...row, read_at: now })));
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {NOTIFICATION_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            aria-pressed={active === tab.id}
            onClick={() => setActive(tab.id)}
            className={`inline-block min-h-[42px] min-w-[70px] overflow-hidden rounded-lg px-4 py-[10px] text-center text-[14px] font-bold leading-[21px] ${
              active === tab.id
                ? "bg-[rgb(34,_33,_39)] text-white"
                : "bg-[rgb(244,_244,_244)] text-[rgb(20,_20,_26)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
        {unreadCount > 0 ? (
          <button
            type="button"
            onClick={onMarkAll}
            disabled={busy}
            className="ms-auto inline-flex min-h-[42px] items-center justify-center rounded-lg bg-ink px-4 text-[14px] font-bold text-white disabled:opacity-60"
          >
            {FA.markAllRead}
          </button>
        ) : null}
      </div>
      <ul className="overflow-hidden rounded-lg border border-cardborder bg-card">
        {visible.map((item) => {
          const unread = isNotificationUnread(item);
          const time = notificationTime(item.created_at);
          const body = (
            <>
              <NotificationGlyph kind={item.kind} />
              <span className="min-w-0 flex-1">
                <span className="block text-[14px] leading-[21px] text-[rgb(20,_20,_26)]">{item.text}</span>
                {time ? <span className="mt-0.5 block text-[12px] text-graytext">{time}</span> : null}
              </span>
              {unread ? <span className="block size-2.5 shrink-0 rounded-full bg-[rgb(71,_131,_255)]" aria-label={FA.unread} /> : null}
            </>
          );
          const rowClass = "flex items-center gap-3 border-b border-cardborder px-4 py-3.5 last:border-b-0 hover:bg-badgebg";
          return (
            <li key={item.id}>
              {item.href ? (
                <Link href={item.href} className={rowClass} onClick={() => unread && onMarkOne(item.id)}>
                  {body}
                </Link>
              ) : (
                <button type="button" className={`w-full text-start ${rowClass}`} onClick={() => unread && onMarkOne(item.id)}>
                  {body}
                </button>
              )}
            </li>
          );
        })}
        {visible.length === 0 && (
          <li className="px-4 py-10 text-center text-[14px] text-graytext">
            {rows.length === 0 ? FA.noNotifications : FA.noNotificationsInTab}
          </li>
        )}
      </ul>
      {meta?.action_required > 0 ? (
        <p className="text-[13px] text-graytext">نیاز به اقدام: {toFaDigits(meta.action_required)}</p>
      ) : null}
    </div>
  );
}
