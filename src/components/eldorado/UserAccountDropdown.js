"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getSellerWallet } from "@/actions/market.actions";
import {
  accountAvatarSrc,
  accountDisplayName,
  isDashboardNavActive,
  publicProfileHref,
} from "@/lib/account-display";
import { formatToman } from "@/lib/listing";
import { FA } from "./data/faCopy";
import {
  DASHBOARD_NAV_GROUPS,
  DASHBOARD_NAV_LINKS,
} from "./data/dashboardData";
import DashboardIcon from "./DashboardIcons";

const BECOME_SELLER = {
  icon: "viewProfile",
  id: "Become a Seller",
  label: FA.becomeSeller,
  href: "/become-seller",
};

const CHEVRON = (
  <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="m2.5 4.5 3.5 3 3.5-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function allNavItems() {
  return [...DASHBOARD_NAV_GROUPS.flatMap((group) => group.children), ...DASHBOARD_NAV_LINKS, BECOME_SELLER];
}

function navActiveId(pathname) {
  const hit = allNavItems()
    .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0];
  return hit?.id || null;
}

function initialCollapsed(active) {
  const next = {};
  for (const group of DASHBOARD_NAV_GROUPS) {
    next[group.id] = !group.children.some((item) => isDashboardNavActive(active, item));
  }
  return next;
}

function rowClass(isActive, extra = "") {
  return `mx-[6px] flex items-center overflow-hidden rounded-lg text-ink ${extra} ${
    isActive ? "bg-brand" : "hover:bg-badgebg"
  }`;
}

export default function UserAccountDropdown({ user, avatarAlert = false, onLogout }) {
  const pathname = usePathname();
  const rootRef = useRef(null);
  const [open, setOpen] = useState(false);
  const current = navActiveId(pathname);
  const [collapsed, setCollapsed] = useState(() => initialCollapsed(current));
  const [balance, setBalance] = useState(null);
  const avatar = accountAvatarSrc(user);
  const displayName = accountDisplayName(user);
  const phoneName = displayName.includes("***");
  const profileHref = publicProfileHref(user);

  const afterWallet = useMemo(() => {
    const extra = [];
    let inserted = false;
    for (const link of DASHBOARD_NAV_LINKS) {
      extra.push(link);
      if (link.id === "Wallet") {
        extra.push(BECOME_SELLER);
        inserted = true;
      }
    }
    if (!inserted) extra.push(BECOME_SELLER);
    return extra;
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return undefined;
    let cancelled = false;
    getSellerWallet().then((wallet) => {
      if (cancelled) return;
      const amount = wallet?.ok ? wallet.data?.balances?.withdrawable : 0;
      setBalance(Number.isFinite(Number(amount)) ? Number(amount) : 0);
    });
    return () => {
      cancelled = true;
    };
  }, [open]);

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

  const toggle = (id) => setCollapsed((state) => ({ ...state, [id]: !state[id] }));

  return (
    <div ref={rootRef} className="relative ms-1 flex items-center">
      <button
        type="button"
        aria-label={FA.accountMenu}
        aria-expanded={open}
        aria-haspopup="menu"
        className="relative flex items-center"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="size-11 overflow-hidden rounded-full border-2 border-black/0 bg-searchbg">
          <img alt="" src={avatar} className="block size-11 object-cover align-middle" />
        </span>
        {avatarAlert ? (
          <span className="absolute right-0 top-0 flex h-4 min-h-4 items-center justify-center rounded-[0.4375rem] bg-[rgb(255,_141,_0)] px-[5px] pt-[2px] text-[12px] leading-[18px] text-ink">
            !
          </span>
        ) : null}
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute end-0 top-[calc(100%+8px)] z-[70] flex max-h-[min(720px,calc(100dvh-var(--shop-header-bar)-16px))] w-[min(300px,calc(100vw-16px))] flex-col overflow-hidden rounded-lg border border-cardborder bg-white text-ink shadow-[0_8px_24px_rgba(9,9,11,0.12)]"
        >
          <div className="flex shrink-0 items-start gap-3 border-b border-cardborder px-3 py-3">
            <div className="size-10 shrink-0 overflow-hidden rounded-full bg-badgebg">
              <img alt={FA.profileAvatar} src={avatar} className="block size-full object-cover align-middle" />
            </div>
            <div className="min-w-0">
              <Link
                href={profileHref}
                className="block truncate text-[14px] font-bold leading-[19.6px]"
                dir={phoneName ? "ltr" : "auto"}
                onClick={() => setOpen(false)}
              >
                {displayName}
              </Link>
              <p className="mt-0.5 text-[14px] font-bold leading-[21px]">
                {balance == null ? "…" : `${formatToman(balance)} ${FA.toman}`}
              </p>
              <Link
                href="/dashboard/loyalty"
                className="mt-0.5 flex items-center gap-1 text-[13px] text-graytext hover:text-ink"
                onClick={() => setOpen(false)}
              >
                <DashboardIcon name="loyalty" size={18} />
                <span>{FA.bronzeRank}</span>
              </Link>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-x-clip overflow-y-auto py-2">
            <div className="flex flex-col gap-2">
              {DASHBOARD_NAV_GROUPS.map((group) => {
                const isCollapsed = !!collapsed[group.id];
                return (
                  <div key={group.id} className="flex flex-col">
                    <button
                      type="button"
                      onClick={() => toggle(group.id)}
                      aria-expanded={!isCollapsed}
                      className="mx-[6px] flex items-center rounded-lg px-1 py-1 text-start hover:bg-badgebg"
                    >
                      <span className="grid size-6 shrink-0 place-items-center ms-[4px] me-[12px]">
                        <DashboardIcon name={group.icon} size={24} />
                      </span>
                      <span className="block min-w-0 truncate">{group.label}</span>
                      <span className={`ms-auto shrink-0 text-ink/70 transition-transform ${isCollapsed ? "rotate-90" : ""}`}>
                        {CHEVRON}
                      </span>
                    </button>
                    {!isCollapsed ? (
                      <div className="flex flex-col ps-7">
                        {group.children.map((item) => {
                          const isActive = isDashboardNavActive(current, item);
                          return (
                            <Link
                              key={item.id}
                              href={item.href}
                              prefetch={false}
                              scroll={false}
                              role="menuitem"
                              aria-current={isActive ? "page" : undefined}
                              className={rowClass(isActive, "px-[10px] py-2")}
                              onClick={() => setOpen(false)}
                            >
                              <span className="min-w-0 truncate">{item.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>

            <hr className="mx-3 my-2 border-cardborder" />

            <div className="flex flex-col gap-2">
              {afterWallet.map((link) => {
                const isActive = isDashboardNavActive(current, link);
                return (
                  <Link
                    key={link.id}
                    href={link.href}
                    prefetch={false}
                    scroll={false}
                    role="menuitem"
                    aria-current={isActive ? "page" : undefined}
                    className={rowClass(isActive, "p-1")}
                    onClick={() => setOpen(false)}
                  >
                    <span className="grid size-6 shrink-0 place-items-center me-[12px]">
                      <DashboardIcon name={link.icon} size={24} />
                    </span>
                    <span className="block min-w-0 truncate">{link.label}</span>
                  </Link>
                );
              })}
            </div>

            <hr className="mx-3 my-2 border-cardborder" />

            <div className="flex items-center gap-3 px-[10px] py-1 text-[14px] text-ink">
              <DashboardIcon name="language" size={24} />
              <span>
                {FA.language} <span className="text-graytext">|</span> {FA.toman}
              </span>
            </div>
            <div className="flex items-center gap-3 px-[10px] py-1 text-[14px] text-ink">
              <DashboardIcon name="darkMode" size={24} />
              <span className="min-w-0 flex-1">{FA.darkTheme}</span>
              <span
                aria-hidden="true"
                className="relative inline-flex h-5 w-12 shrink-0 items-center rounded-2xl bg-[rgb(231,231,231)]"
              >
                <span className="absolute top-[-2px] h-6 w-6 rounded-full bg-white shadow-[rgba(9,9,11,0.05)_0px_2px_4px_0px,_rgba(9,9,11,0.02)_0px_12px_8px_0px]" />
              </span>
            </div>
          </div>

          <button
            type="button"
            role="menuitem"
            className="mx-[6px] mb-2 mt-1 flex items-center rounded-lg p-1 text-start hover:bg-badgebg"
            onClick={() => {
              setOpen(false);
              onLogout?.();
            }}
          >
            <span className="grid size-6 shrink-0 place-items-center me-[12px]">
              <DashboardIcon name="logout" size={24} />
            </span>
            <span>{FA.logout}</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
