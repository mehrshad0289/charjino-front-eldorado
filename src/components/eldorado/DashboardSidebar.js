"use client";

import { useEffect, useState } from "react";
import { getSessionUser } from "@/actions/auth.actions";
import {
  accountAvatarUrl,
  accountDisplayName,
  accountInitials,
  accountRegisteredLabel,
  isDashboardNavActive,
} from "@/lib/account-display";
import { FA } from "./data/faCopy";
import {
  DASHBOARD_NAV_GROUPS,
  DASHBOARD_NAV_LINKS,
  DASHBOARD_VIEW_PROFILE,
} from "./data/dashboardData";

/* Small icon set standing in for the capture's empty icomoon glyphs
   (project pattern). Keys come from dashboardData.js. */
const stroke = { stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };

const ICONS = {
  orders: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h13.2l-1 8.5H6.2L4.6 4.5H3" {...stroke} />
      <circle cx="7.2" cy="19" r="1.4" fill="currentColor" />
      <circle cx="15.2" cy="19" r="1.4" fill="currentColor" />
    </svg>
  ),
  offers: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h5l9 9-6.5 6.5-9-9v-5Z" {...stroke} />
      <circle cx="8.3" cy="8.3" r="1.2" fill="currentColor" />
    </svg>
  ),
  boosting: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12.5 15.5c4.5-3 6.8-6.5 7-11-4.5.2-8 2.5-11 7l-3.5.8L4 14l3.5.5L8 18l1.7 1 1.5-3.5h1.3Z" {...stroke} />
      <circle cx="14" cy="9.5" r="1.3" fill="currentColor" />
    </svg>
  ),
  loyalty: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m12 4 2.3 4.9 5.2.6-3.9 3.6 1.1 5.2L12 15.6l-4.7 2.7 1.1-5.2L4.5 9.5l5.2-.6L12 4Z" {...stroke} />
    </svg>
  ),
  wallet: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3.5" y="6.5" width="17" height="12" rx="2" {...stroke} />
      <path d="M3.5 9.5h17" {...stroke} />
      <circle cx="16.5" cy="14" r="1.2" fill="currentColor" />
    </svg>
  ),
  seller: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 9h14l-1 10H6L5 9Z" {...stroke} />
      <path d="M9 11V7a3 3 0 0 1 6 0v4" {...stroke} />
    </svg>
  ),
  messages: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3.5" y="5.5" width="17" height="12" rx="2" {...stroke} />
      <path d="m4.5 7 7.5 6 7.5-6" {...stroke} />
    </svg>
  ),
  notifications: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 4a6 6 0 0 1 6 6v3.5l1.5 2.5h-15L6 13.5V10a6 6 0 0 1 6-6Z" {...stroke} />
      <path d="M10 19a2 2 0 0 0 4 0" {...stroke} />
    </svg>
  ),
  feedback: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4.5 6.5A2 2 0 0 1 6.5 4.5h11a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H10l-4 3.5v-3.5h-1.5a2 2 0 0 1-2-2v-7Z" {...stroke} />
    </svg>
  ),
  settings: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 3v2.2M12 18.8V21M21 12h-2.2M5.2 12H3M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6M18.4 18.4l-1.6-1.6M7.2 7.2 5.6 5.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),
  profile: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8.5" r="3.5" {...stroke} />
      <path d="M5 19.5c1.2-3.2 3.8-4.8 7-4.8s5.8 1.6 7 4.8" {...stroke} />
    </svg>
  ),
  tag: (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h5l9 9-6.5 6.5-9-9v-5Z" {...stroke} />
      <circle cx="8.3" cy="8.3" r="1.2" fill="currentColor" />
    </svg>
  ),
};

const CHEVRON = (
  <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="m2.5 4.5 3.5 3 3.5-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function SidebarIcon({ name, className = "" }) {
  return <div className={`shrink-0 ${className}`}>{ICONS[name] ?? ICONS.profile}</div>;
}

/* Data-driven dashboard navigation (user block, collapsible groups,
   single links, View Profile). Reused by every dashboard page; the active
   row highlights yellow exactly like the capture. Below lg the same block
   spans full width above the content (no mobile reference exists for the
   logged-in dashboard — capture is 1920-only). */
export default function DashboardSidebar({ active = null, user = null }) {
  const [collapsed, setCollapsed] = useState({});
  const [sessionUser, setSessionUser] = useState(user);
  const liveUser = sessionUser || user;
  const displayName = accountDisplayName(liveUser);
  const avatar = accountAvatarUrl(liveUser);
  const phoneName = displayName.includes("***");
  const [registered, setRegistered] = useState("");

  useEffect(() => {
    if (user?.id) {
      setSessionUser(user);
      return undefined;
    }
    let cancelled = false;
    getSessionUser().then((row) => {
      if (!cancelled) setSessionUser(row);
    });
    return () => {
      cancelled = true;
    };
  }, [user]);

  useEffect(() => {
    setRegistered(accountRegisteredLabel(liveUser));
  }, [liveUser]);

  const toggle = (id) =>
    setCollapsed((c) => ({ ...c, [id]: !c[id] }));

  return (
    <div className="h-full w-full bg-white lg:w-[260px]">
      <nav id="dashboard-sidebar" className="sticky start-0 top-[100px]">
        <div className="flex h-[62px] justify-start px-[10px] pb-3 pt-[10px]">
          <div className="me-[10px]">
            <div className="size-10 overflow-hidden rounded-full bg-badgebg text-center text-[13px] font-bold leading-10">
              {avatar ? (
                <img alt={FA.profileAvatar} src={avatar} className="block size-full object-cover align-middle" />
              ) : (
                <span aria-hidden="true">{accountInitials(liveUser)}</span>
              )}
            </div>
          </div>
          <div className="flex min-w-0 flex-col justify-center">
            <h5 className="flex items-center gap-1 text-[14px] font-bold leading-[19.6px]">
              <a
                href={DASHBOARD_VIEW_PROFILE.href}
                className="block truncate"
                dir={phoneName ? "ltr" : "auto"}
              >
                {displayName}
              </a>
            </h5>
            {registered ? <p className="text-[14px] leading-[21px] text-graytext">{registered}</p> : null}
          </div>
        </div>

        <div className="border-t-[0.8px] border-cardborder px-[10px] pb-3 pt-3">
          <div className="mb-2 mt-2 flex flex-col gap-2">
            {DASHBOARD_NAV_GROUPS.map((group) => {
              const isCollapsed = !!collapsed[group.id];
              return (
                <div key={group.id} className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => toggle(group.id)}
                    aria-expanded={!isCollapsed}
                    className="flex items-center text-start"
                  >
                    <SidebarIcon name={group.icon} className="ms-[4px] me-[12px]" />
                    <span className="block">{group.label}</span>
                    <span className={`ms-auto text-ink/70 transition-transform ${isCollapsed ? "-rotate-90" : ""}`}>
                      {CHEVRON}
                    </span>
                  </button>
                  {!isCollapsed && (
                    <div className="flex flex-col ps-7">
                      {group.children.map((item) => {
                        const isActive = isDashboardNavActive(active, item);
                        return (
                          <a
                            key={item.id}
                            href={item.href}
                            aria-current={isActive ? "page" : undefined}
                            className={`block py-2 px-[10px] ${isActive ? "bg-brand" : "hover:text-brand"}`}
                          >
                            <span>{item.label}</span>
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {DASHBOARD_NAV_LINKS.map((link) => {
              const isActive = isDashboardNavActive(active, link);
              return (
                <a
                  key={link.id}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center p-1 ${isActive ? "bg-brand" : "hover:text-brand"}`}
                >
                  <SidebarIcon name={link.icon} className="me-[12px]" />
                  <span className="block">{link.label}</span>
                </a>
              );
            })}
          </div>
        </div>

        <a
          href={DASHBOARD_VIEW_PROFILE.href}
          className="block border-t-[0.8px] border-cardborder leading-[19px]"
        >
          <div className="my-[12px] mx-[10px] flex items-center p-1">
            <SidebarIcon name={DASHBOARD_VIEW_PROFILE.icon} />
            <span className="ms-[7px] block">{DASHBOARD_VIEW_PROFILE.label}</span>
          </div>
        </a>
      </nav>
    </div>
  );
}
