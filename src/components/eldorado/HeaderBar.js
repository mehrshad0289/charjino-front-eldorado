"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getSessionUser, logout } from "@/actions/auth.actions";
import Logo from "./Logo";
import SearchOverlay from "./SearchOverlay";
import MobileMenu from "./MobileMenu";
import { FA } from "./data/faCopy";
import { accountAvatarUrl, accountInitials } from "@/lib/account-display";

function SearchIcon({ className = "", stroke = "#ffffff", size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <circle cx="11" cy="11" r="7" stroke={stroke} strokeWidth="2" />
      <path d="m20 20-3.5-3.5" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function BurgerIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 6.5h18M3 12h18M3 17.5h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 2.8 13 5a7.2 7.2 0 0 1 2.1.9l2.3-.9 1.6 1.6-.9 2.3c.42.65.72 1.36.9 2.1l2.2 1v2.2l-2.2 1a7.2 7.2 0 0 1-.9 2.1l.9 2.3-1.6 1.6-2.3-.9a7.2 7.2 0 0 1-2.1.9l-1 2.2h-2.2l-1-2.2a7.2 7.2 0 0 1-2.1-.9l-2.3.9-1.6-1.6.9-2.3a7.2 7.2 0 0 1-.9-2.1l-2.2-1v-2.2l2.2-1c.18-.74.48-1.45.9-2.1L4 6.6 5.6 5l2.3.9A7.2 7.2 0 0 1 10 5l1-2.2h1Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* Logged-in right side (dashboard capture): three 42px rounded icon
   buttons + 44px avatar. The capture's icomoon glyphs decode empty, so
   the buttons draw neutral SVGs (bell / chat / favorites — unnamed in any
   reference, documented assumption) and the avatar opens no menu.
   Session 20 (/verify/status capture): the same header can carry a yellow
   count badge on the MIDDLE icon (bg rgb(255,201,80), ink text 12px,
   top-right, overhangs the button edge) and an orange "!" alert badge on
   the avatar (bg rgb(255,141,0), 12px, top-right of the 44px circle) —
   both optional props, off by default so every verified page is untouched.
   Session 22 (messages-notempty capture): the FOURTH icon (Favorites)
   can carry the same yellow badge with a "9+" value — optional favCount
   prop, default off. */
function LoggedInActions({
  user,
  notiCount = null,
  favCount = null,
  avatarAlert = false,
  accountMenu = false,
  onLogout,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const avatar = accountAvatarUrl(user);

  return (
    <>
      <button
        type="button"
        aria-label={FA.notifications}
        className="hidden h-[42px] w-[42px] items-center justify-center rounded-[0.625rem] text-navgray hover:text-white lg:flex"
      >
        <BellIcon />
      </button>
      <button
        type="button"
        aria-label={FA.messages}
        className="relative hidden h-[42px] w-[42px] items-center justify-center rounded-[0.625rem] text-navgray hover:text-white lg:flex"
      >
        <ChatIcon />
        {notiCount != null && (
          <span className="absolute -right-1 top-0 block min-h-4 rounded-[0.4375rem] bg-[rgb(255,_201,_80)] px-[5px] py-[2px] text-[12px] leading-[normal] text-ink">
            {notiCount}
          </span>
        )}
      </button>
      <button
        type="button"
        aria-label={FA.favorites}
        className="relative hidden h-[42px] w-[42px] items-center justify-center rounded-[0.625rem] text-navgray hover:text-white lg:flex"
      >
        <HeartIcon />
        {favCount != null && (
          <span className="absolute -right-1 top-0 block min-h-4 rounded-[0.4375rem] bg-[rgb(255,_201,_80)] px-[5px] py-[2px] text-[12px] leading-[normal] text-ink">
            {favCount}
          </span>
        )}
      </button>
      <div className="relative ms-1 flex items-center">
        <button
          type="button"
          aria-label={FA.accountMenu}
          aria-expanded={accountMenu ? menuOpen : undefined}
          className="relative flex items-center"
          onClick={() => {
            if (accountMenu) setMenuOpen((open) => !open);
          }}
        >
          <span className="size-11 overflow-hidden rounded-full border-2 border-black/0 bg-searchbg text-center text-sm font-bold leading-[44px] text-white">
            {avatar ? (
              <img alt="" src={avatar} className="block size-11 object-cover align-middle" />
            ) : (
              accountInitials(user)
            )}
          </span>
          {avatarAlert && (
            <span className="absolute right-0 top-0 flex h-4 min-h-4 items-center justify-center rounded-[0.4375rem] bg-[rgb(255,_141,_0)] px-[5px] pt-[2px] text-[12px] leading-[18px] text-ink">
              !
            </span>
          )}
        </button>
        {accountMenu && menuOpen ? (
          <div className="absolute end-0 top-[calc(100%+8px)] z-50 min-w-[160px] rounded-lg border border-searchstroke bg-headerdark p-2 text-sm text-white">
            <Link
              href="/dashboard/orders/purchased"
              className="block rounded-md px-3 py-2 hover:bg-white/10"
              onClick={() => setMenuOpen(false)}
            >
              {FA.purchasedOrders}
            </Link>
            <Link
              href="/dashboard/orders/sold"
              className="block rounded-md px-3 py-2 hover:bg-white/10"
              onClick={() => setMenuOpen(false)}
            >
              {FA.soldOrders}
            </Link>
            <Link
              href="/dashboard/offers/Account/new#listing-game"
              className="block rounded-md px-3 py-2 hover:bg-white/10"
              onClick={() => setMenuOpen(false)}
            >
              {FA.sellAccount}
            </Link>
            <Link
              href="/dashboard/settings"
              className="block rounded-md px-3 py-2 hover:bg-white/10"
              onClick={() => setMenuOpen(false)}
            >
              {FA.dashboard}
            </Link>
            <button
              type="button"
              className="block w-full rounded-md px-3 py-2 text-start hover:bg-white/10"
              onClick={() => {
                setMenuOpen(false);
                onLogout?.();
              }}
            >
              {FA.logout}
            </button>
          </div>
        ) : null}
      </div>
    </>
  );
}

function BellIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 4a6 6 0 0 1 6 6v3.5l1.5 2.5h-15L6 13.5V10a6 6 0 0 1 6-6Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M10 19a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3.5" y="5.5" width="17" height="12" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="m4.5 7 7.5 6 7.5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 19.5S4 15 4 9.8C4 7.4 5.9 5.5 8.2 5.5c1.5 0 2.9.8 3.8 2 .9-1.2 2.3-2 3.8-2 2.3 0 4.2 1.9 4.2 4.3 0 5.2-8 9.7-8 9.7Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function HeaderBar({
  loggedIn = false,
  user = null,
  notiCount = null,
  favCount = null,
  avatarAlert = false,
}) {
  const pathname = usePathname();
  const router = useRouter();
  const captureSession = loggedIn === true;
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [sessionUser, setSessionUser] = useState(user);
  const [sessionKnown, setSessionKnown] = useState(captureSession);
  const liveUser = captureSession ? user : sessionUser;
  const isLoggedIn = captureSession || Boolean(liveUser);
  const loginHref =
    pathname && pathname !== "/login" ? `/login?next=${encodeURIComponent(pathname)}` : "/login";

  useEffect(() => {
    if (captureSession) return undefined;
    let cancelled = false;
    getSessionUser().then((row) => {
      if (!cancelled) {
        setSessionUser(row);
        setSessionKnown(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [captureSession]);

  useEffect(() => {
    document.body.style.overflow = menuOpen || searchOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, searchOpen]);

  useEffect(() => {
    if (!menuOpen && !searchOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen, searchOpen]);

  async function handleLogout() {
    await logout();
    setSessionUser(null);
    router.refresh();
  }

  return (
    <>
    <header className="fixed inset-x-0 top-0 z-50 bg-headerdark">
      <div className="flex items-center px-4 pt-2.5 lg:h-[60px] lg:px-6 lg:pt-0">
        <button
          type="button"
          aria-label={FA.menu}
          onClick={() => setMenuOpen(true)}
          className="me-1 flex h-[42px] w-[42px] items-center justify-center text-white lg:hidden"
        >
          <BurgerIcon />
        </button>

        <Link href="/" aria-label={FA.logo} className="shrink-0">
          <Logo color="#FFFFFF" className="hidden lg:block" />
          <Logo iconOnly size={42} className="lg:hidden" />
        </Link>

        <div className="hidden flex-1 justify-center px-2 lg:flex">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex h-[42px] w-full max-w-[1178px] items-center gap-2 rounded-lg border-2 border-searchstroke bg-searchbg px-3 text-start text-sm"
          >
            <SearchIcon />
            <span className="truncate text-placehold">{FA.search}</span>
          </button>
        </div>

        <div className="ms-auto flex shrink-0 items-center gap-1">
          <Link
            href="/dashboard/offers/Account"
            className="inline-flex h-[42px] items-center px-3 text-sm font-bold text-white hover:text-brand"
          >
            {FA.sell}
          </Link>
          {!sessionKnown ? (
            <span className="inline-flex h-[42px] min-w-[70px]" aria-hidden="true" />
          ) : isLoggedIn ? (
            <LoggedInActions
              user={liveUser}
              notiCount={notiCount}
              favCount={favCount}
              avatarAlert={avatarAlert}
              accountMenu={!captureSession}
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
              <button
                type="button"
                aria-label={FA.settings}
                className="flex h-[42px] w-[42px] items-center justify-center text-white lg:hidden"
              >
                <GearIcon />
              </button>
            </>
          )}
        </div>
      </div>

      {/* mobile search row (inside the dark header; live keeps the mobile
          header — burger + search row, no category strip — up to ~1024) */}
      <div className="mt-2 px-4 pb-3 lg:hidden">
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
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
