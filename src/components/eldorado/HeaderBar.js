"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/actions/auth.actions";
import { getMarketNotificationsUnread } from "@/actions/market.actions";
import { toFaDigits } from "@/lib/fa-digits";
import { clearSessionUser, useSessionUser } from "@/lib/session-client";
import Logo from "./Logo";
import SearchOverlay from "./SearchOverlay";
import MobileMenu from "./MobileMenu";
import UserAccountDropdown from "./UserAccountDropdown";
import HeaderSettingsMenu from "./HeaderSettingsMenu";
import DashboardIcon from "./DashboardIcons";
import { FA } from "./data/faCopy";

function SearchIcon({ className = "", stroke = "#ffffff", size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <circle cx="11" cy="11" r="7" stroke={stroke} strokeWidth="2" />
      <path d="m20 20-3.5-3.5" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* Logged-in right side: notifications + messages (reference heder glyphs)
   then the avatar dropdown. Optional yellow count on notifications and
   orange "!" on the avatar. */
function LoggedInActions({
  user,
  notiCount = null,
  avatarAlert = false,
  onLogout,
}) {
  return (
    <>
      <Link
        href="/dashboard/notifications"
        aria-label={FA.notifications}
        className="relative hidden h-[42px] w-[42px] items-center justify-center rounded-[0.625rem] text-navgray hover:text-white lg:flex"
      >
        <DashboardIcon name="notifications" size={24} />
        {notiCount != null && Number(notiCount) > 0 && (
          <span className="absolute -end-1 top-0 block min-h-4 rounded-[0.4375rem] bg-brand px-[5px] py-[2px] text-[12px] leading-[normal] text-ink">
            {toFaDigits(notiCount)}
          </span>
        )}
      </Link>
      <Link
        href="/dashboard/messages"
        aria-label={FA.messages}
        className="hidden h-[42px] w-[42px] items-center justify-center rounded-[0.625rem] text-navgray hover:text-white lg:flex"
      >
        <DashboardIcon name="messages" size={24} />
      </Link>
      <UserAccountDropdown user={user} avatarAlert={avatarAlert} onLogout={onLogout} />
    </>
  );
}

export default function HeaderBar({
  loggedIn = false,
  user = null,
  notiCount = null,
  avatarAlert = false,
}) {
  const pathname = usePathname();
  const router = useRouter();
  const captureSession = loggedIn === true;
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const session = useSessionUser();
  const liveUser = captureSession ? user : session.user;
  const sessionKnown = captureSession || session.known;
  const isLoggedIn = captureSession || Boolean(liveUser);
  const [liveUnread, setLiveUnread] = useState(null);
  const loginHref =
    pathname && pathname !== "/login" ? `/login?next=${encodeURIComponent(pathname)}` : "/login";

  useEffect(() => {
    document.body.style.overflow = menuOpen || searchOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, searchOpen]);

  useEffect(() => {
    if (!menuOpen && !searchOpen && !settingsOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
        setSettingsOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen, searchOpen, settingsOpen]);

  useEffect(() => {
    setSettingsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (captureSession || !isLoggedIn) {
      setLiveUnread(null);
      return undefined;
    }
    let cancelled = false;
    async function load() {
      const result = await getMarketNotificationsUnread();
      if (cancelled || !result.ok) return;
      setLiveUnread(result.unread > 0 ? result.unread : null);
    }
    load();
    const timer = window.setInterval(load, 60000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [captureSession, isLoggedIn, pathname]);

  async function handleLogout() {
    await logout();
    clearSessionUser();
    router.refresh();
  }

  return (
    <>
    <header className="fixed inset-x-0 top-0 z-50 bg-headerdark">
      <div className="flex items-center px-4 pt-2.5 lg:grid lg:h-[60px] lg:min-h-[60px] lg:grid-cols-[minmax(auto,362px)_minmax(0,1fr)_minmax(max-content,362px)] lg:px-0 lg:pt-0">
        <button
          type="button"
          aria-label={FA.menu}
          onClick={() => {
            setSettingsOpen(false);
            setMenuOpen(true);
          }}
          className="me-1 flex h-[42px] w-[42px] items-center justify-center text-white lg:hidden"
        >
          <DashboardIcon name="menu" size={24} />
        </button>

        <Link href="/" aria-label={FA.logo} className="shrink-0 lg:flex lg:items-center lg:ps-6 lg:pe-[15px]">
          <Logo color="#FFFFFF" className="hidden lg:block" />
          <Logo iconOnly size={42} className="lg:hidden" />
        </Link>

        <div className="hidden h-full w-full items-center justify-center lg:flex">
          <div className="flex w-full max-w-[1178px]">
            <button
              type="button"
              onClick={() => {
                setSettingsOpen(false);
                setSearchOpen(true);
              }}
              className="m-2 flex h-[42px] w-full items-center gap-2 rounded-lg border-2 border-searchstroke bg-searchbg px-3 text-start text-sm"
            >
              <SearchIcon />
              <span className="truncate text-placehold">{FA.search}</span>
            </button>
          </div>
        </div>

        <div className="ms-auto flex shrink-0 items-center gap-1 lg:ms-0 lg:h-[60px] lg:justify-end lg:gap-2.5 lg:pe-6">
          {isLoggedIn ? (
            <Link
              href="/sell"
              className="inline-flex h-[42px] min-w-[70px] items-center justify-center rounded-lg bg-brand px-4 text-sm font-bold text-ink hover:bg-brand-deep"
            >
              {FA.sell}
            </Link>
          ) : null}
          {!sessionKnown ? (
            <span className="inline-flex h-[42px] min-w-[70px]" aria-hidden="true" />
          ) : isLoggedIn ? (
            <LoggedInActions
              user={liveUser}
              notiCount={captureSession ? notiCount : liveUnread}
              avatarAlert={avatarAlert}
              onLogout={handleLogout}
            />
          ) : (
            <>
              <Link
                href={loginHref}
                className="inline-flex h-[42px] min-w-[70px] items-center justify-center rounded-lg bg-brand px-4 text-sm font-bold text-ink"
              >
                {FA.login}
              </Link>
              <HeaderSettingsMenu
                open={settingsOpen}
                onOpenChange={(next) => {
                  if (next) {
                    setMenuOpen(false);
                    setSearchOpen(false);
                  }
                  setSettingsOpen(next);
                }}
              />
            </>
          )}
        </div>
      </div>

      {/* mobile search row (inside the dark header; live keeps the mobile
          header — burger + search row, no category strip — up to ~1024) */}
      <div className="mt-2 px-4 pb-3 lg:hidden">
        <button
          type="button"
          onClick={() => {
            setSettingsOpen(false);
            setSearchOpen(true);
          }}
          className="flex h-[42px] w-full items-center gap-2.5 rounded-lg border-2 border-searchstroke bg-searchbg px-3 text-start text-sm"
        >
          <SearchIcon stroke="#a0a0aa" size={20} />
          <span className="truncate text-white/60">{FA.search}</span>
        </button>
      </div>

      {menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} />}
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </header>
    <div className="h-[var(--shop-header-bar)]" aria-hidden="true" />
    </>
  );
}
