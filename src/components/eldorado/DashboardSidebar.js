"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSessionUser, writeSessionUser } from "@/lib/session-client";
import {
  accountAvatarSrc,
  accountDisplayName,
  accountRegisteredLabel,
  isDashboardNavActive,
  publicProfileHref,
} from "@/lib/account-display";
import { FA } from "./data/faCopy";
import DashboardIcon from "./DashboardIcons";
import {
  DASHBOARD_NAV_GROUPS,
  DASHBOARD_NAV_LINKS,
  DASHBOARD_VIEW_PROFILE,
} from "./data/dashboardData";

const CHEVRON = (
  <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="m2.5 4.5 3.5 3 3.5-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function SidebarIcon({ name, className = "" }) {
  return (
    <div className={`grid size-6 shrink-0 place-items-center ${className}`.trim()}>
      <DashboardIcon name={name} size={24} />
    </div>
  );
}

function sidebarRowClass(isActive, extra = "") {
  return `flex items-center overflow-hidden rounded-lg text-ink ${extra} ${
    isActive ? "bg-brand" : "hover:bg-badgebg"
  }`;
}

/* Data-driven dashboard navigation (user block, collapsible groups,
   single links, View Profile). Reused by every dashboard page; the active
   row highlights yellow exactly like the capture. Below lg the same block
   spans full width above the content (no mobile reference exists for the
   logged-in dashboard — capture is 1920-only). */
function navItems() {
  return [...DASHBOARD_NAV_GROUPS.flatMap((group) => group.children), ...DASHBOARD_NAV_LINKS];
}

function navActiveId(pathname, fallback) {
  const hit = navItems()
    .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0];
  return hit?.id || fallback || null;
}

function initialCollapsed(active) {
  const next = {};
  for (const group of DASHBOARD_NAV_GROUPS) {
    next[group.id] = !group.children.some((item) => isDashboardNavActive(active, item));
  }
  return next;
}

export default function DashboardSidebar({ active = null, user = null }) {
  const pathname = usePathname();
  const current = navActiveId(pathname, active);
  const [collapsed, setCollapsed] = useState(() => initialCollapsed(current));
  const session = useSessionUser();
  const liveUser = user?.id ? user : session.user || user;
  const displayName = accountDisplayName(liveUser);
  const avatar = accountAvatarSrc(liveUser);
  const phoneName = displayName.includes("***");
  const profileHref = publicProfileHref(liveUser);
  const [registered, setRegistered] = useState("");

  useEffect(() => {
    if (user?.id) writeSessionUser(user);
  }, [user]);

  useEffect(() => {
    setRegistered(accountRegisteredLabel(liveUser));
  }, [liveUser]);

  useEffect(() => {
    setCollapsed((state) => {
      const next = { ...state };
      for (const group of DASHBOARD_NAV_GROUPS) {
        if (group.children.some((item) => isDashboardNavActive(current, item))) {
          next[group.id] = false;
        }
      }
      return next;
    });
  }, [current]);

  const toggle = (id) =>
    setCollapsed((c) => ({ ...c, [id]: !c[id] }));

  return (
    <nav
      id="dashboard-sidebar"
      className="sticky top-[var(--shop-header-h)] z-[2] max-h-[calc(100dvh-var(--shop-header-h))] w-[260px] overflow-x-clip overflow-y-auto bg-white"
    >
      <div className="flex h-[62px] justify-start px-[10px] pb-3 pt-[10px]">
        <div className="me-[10px]">
          <div className="size-10 overflow-hidden rounded-full bg-badgebg">
            <img alt={FA.profileAvatar} src={avatar} className="block size-full object-cover align-middle" />
          </div>
        </div>
        <div className="flex min-w-0 flex-col justify-center">
          <h5 className="flex items-center gap-1 text-[14px] font-bold leading-[19.6px]">
            <a
              href={profileHref}
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
                    className="flex items-center rounded-lg px-1 py-1 text-start hover:bg-badgebg"
                  >
                    <SidebarIcon name={group.icon} className="ms-[4px] me-[12px]" />
                    <span className="block min-w-0 truncate">{group.label}</span>
                    <span className={`ms-auto shrink-0 text-ink/70 transition-transform ${isCollapsed ? "rotate-90" : ""}`}>
                      {CHEVRON}
                    </span>
                  </button>
                  {!isCollapsed && (
                    <div className="flex flex-col ps-7">
                      {group.children.map((item) => {
                        const isActive = isDashboardNavActive(current, item);
                        return (
                          <Link
                            key={item.id}
                            href={item.href}
                            prefetch={false}
                            scroll={false}
                            aria-current={isActive ? "page" : undefined}
                            className={sidebarRowClass(isActive, "px-[10px] py-2")}
                          >
                            <span className="min-w-0 truncate">{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {DASHBOARD_NAV_LINKS.map((link) => {
              const isActive = isDashboardNavActive(current, link);
              return (
                <Link
                  key={link.id}
                  href={link.href}
                  prefetch={false}
                  scroll={false}
                  aria-current={isActive ? "page" : undefined}
                  className={sidebarRowClass(isActive, "p-1")}
                >
                  <SidebarIcon name={link.icon} className="me-[12px]" />
                  <span className="block min-w-0 truncate">{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <Link
          href={profileHref}
          className="block border-t-[0.8px] border-cardborder leading-[19px] hover:bg-badgebg"
        >
          <div className="my-[12px] mx-[10px] flex items-center p-1">
            <SidebarIcon name={DASHBOARD_VIEW_PROFILE.icon} />
            <span className="ms-[7px] block">{DASHBOARD_VIEW_PROFILE.label}</span>
          </div>
        </Link>
    </nav>
  );
}
