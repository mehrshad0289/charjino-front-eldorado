"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "./Logo";
import { FA } from "./data/faCopy";

const GAMES_COLOR = "rgb(255, 182, 0)";
const CODES_COLOR = "rgb(152, 126, 251)";
const HAIRLINE = { borderBottomColor: "rgb(42, 42, 48)" };

const SHOP_BTN =
  "blog-display inline-flex h-10 min-h-10 min-w-[84px] items-center justify-center whitespace-nowrap rounded-lg bg-[rgb(255,182,0)] p-0 ps-[14px] pe-[14px] text-[18px] font-extrabold leading-[21.6px] text-[rgb(20,19,26)]";
const CAT_BTN =
  "blog-display inline-flex items-center border-[0.8px] border-black/0 bg-black/0 p-2 ps-[9px] pe-[9px] text-center text-[20px] font-extrabold leading-[20px]";

function Caret({ color = "currentColor", className = "ms-[3px] inline-block h-6 w-[20.5px] align-middle" }) {
  return (
    <svg aria-hidden="true" className={className} fill={color} viewBox="0 0 24 24">
      <path d="M12 19.2 3.4 6h17.2L12 19.2Z" />
    </svg>
  );
}

function BurgerIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="26" viewBox="0 0 24 24" width="26">
      <path d="M3 6.5h18M3 12h18M3 17.5h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 5l14 14M19 5 5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function BackChevron() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M14.5 5.5 8 12l6.5 6.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ForwardChevron() {
  return (
    <svg className="h-5 w-5 rtl:rotate-180" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M9.5 5.5 16 12l-6.5 6.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function NavLink({ href, children, className, onNavigate }) {
  return (
    <a
      href={href}
      onClick={(event) => {
        event.preventDefault();
        onNavigate(href);
      }}
      className={className}
      dir="auto"
    >
      {children}
    </a>
  );
}

function DesktopNavPanel({ items, allHref, allLabel, onNavigate, accent }) {
  return (
    <div
      className="absolute start-0 top-full z-[40] mt-2 hidden max-h-[70vh] w-[min(92vw,540px)] overflow-y-auto rounded-xl border bg-headerdark px-6 py-5 shadow-2xl lg:block"
      style={{ borderColor: accent }}
    >
      <ul className="columns-2 gap-x-10">
        <li className="break-inside-avoid">
          <NavLink
            href={allHref}
            onNavigate={onNavigate}
            className="block py-[10px] text-[16px] font-semibold leading-[22px] text-[rgb(138,134,157)]"
          >
            {allLabel || FA.allGames}
          </NavLink>
        </li>
        {items.map((item) => (
          <li key={item.slug} className="break-inside-avoid">
            <NavLink
              href={item.href}
              onNavigate={onNavigate}
              className="block py-[10px] text-[16px] font-semibold leading-[22px] text-white"
            >
              {item.title}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MobileNavList({ items, allHref, allLabel, onNavigate }) {
  return (
    <div className="px-6 pb-10 pt-4">
      <NavLink
        href={allHref}
        onNavigate={onNavigate}
        className="block py-[18px] text-[18px] font-semibold leading-[24px] text-[rgb(138,134,157)]"
      >
        {allLabel || FA.allGames}
      </NavLink>
      <ul>
        {items.map((item) => (
          <li key={item.slug}>
            <NavLink
              href={item.href}
              onNavigate={onNavigate}
              className="block py-[18px] text-[18px] font-semibold leading-[24px] text-white"
            >
              {item.title}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

function GroupButton({ label, color, open, onClick, compact }) {
  return (
    <button
      aria-expanded={open}
      aria-haspopup="true"
      className={`${CAT_BTN} ${compact ? "min-h-[55px]" : "ms-[8px]"}`}
      onClick={onClick}
      style={{ color }}
      type="button"
    >
      <span className="text-center" dir="auto">
        {label}
      </span>
      <Caret
        color={color}
        className={
          compact
            ? "ms-[7px] inline-block h-6 w-[14.7px] align-middle"
            : "ms-[3px] inline-block h-6 w-[20.5px] align-middle"
        }
      />
    </button>
  );
}

export default function BlogHeader({
  games = [],
  codes = [],
  allGames = [],
  gamesLabel,
  codesLabel,
  gamesAllHref = "/blog",
  codesAllHref = "/blog",
}) {
  const gameRows = Array.isArray(games) && games.length ? games : Array.isArray(allGames) ? allGames : [];
  const codeRows = Array.isArray(codes) ? codes : [];
  const gamesName = gamesLabel || FA.blogGames;
  const codesName = codesLabel || FA.blogCodes;
  const [open, setOpen] = useState(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [fromMenu, setFromMenu] = useState(false);
  const rootRef = useRef(null);
  const router = useRouter();

  function openPanel(panel, menu = false) {
    setOpen((current) => (current === panel && !menu ? null : panel));
    setFromMenu(menu);
    setPickerOpen(false);
  }

  function closePanel() {
    setOpen(null);
    setPickerOpen(false);
    setFromMenu(false);
  }

  function goTo(href) {
    closePanel();
    if (href) router.push(href);
  }

  function onBack() {
    if (fromMenu && (open === "games" || open === "codes")) {
      setOpen("menu");
      setPickerOpen(false);
      return;
    }
    closePanel();
  }

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") closePanel();
    };
    const onDown = (event) => {
      if (typeof window !== "undefined" && window.innerWidth < 1024) return;
      if (rootRef.current && !rootRef.current.contains(event.target)) closePanel();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    const lock = () => {
      if (window.innerWidth < 1024) document.body.style.overflow = "hidden";
    };
    lock();
    window.addEventListener("resize", lock);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("resize", lock);
    };
  }, [open]);

  const overlayIsList = open === "games" || open === "codes";
  const overlayLabel = open === "codes" ? codesName : gamesName;
  const overlayItems = open === "codes" ? codeRows : gameRows;
  const overlayAllHref = open === "codes" ? codesAllHref : gamesAllHref;
  const showMobileOverlay = open === "menu" || overlayIsList;

  return (
    <header ref={rootRef} className="fixed inset-x-0 top-0 z-[500] w-full">
      <div className="relative z-[22] border-b-[0.8px] bg-headerdark" style={HAIRLINE}>
        <div className="relative z-[10] mx-auto w-full max-w-full ps-6 pe-6 max-sm:ps-4 max-sm:pe-4">
          <div className="hidden items-center justify-between lg:flex">
            <div className="flex items-center">
              <div className="me-[8px]">
                <a aria-label="شارژینو" className="flex min-h-[70px] items-center" href="/blog">
                  <Logo color="#ffffff" />
                </a>
              </div>
              <div className="relative mt-[10px] flex items-center">
                <GroupButton
                  label={gamesName}
                  color={GAMES_COLOR}
                  open={open === "games"}
                  onClick={() => openPanel("games")}
                />
                {open === "games" ? (
                  <DesktopNavPanel
                    items={gameRows}
                    allHref={gamesAllHref}
                    allLabel={FA.allGames}
                    onNavigate={goTo}
                    accent={GAMES_COLOR}
                  />
                ) : null}
              </div>
              <div className="relative mt-[10px] flex items-center">
                <GroupButton
                  label={codesName}
                  color={CODES_COLOR}
                  open={open === "codes"}
                  onClick={() => openPanel("codes")}
                />
                {open === "codes" ? (
                  <DesktopNavPanel
                    items={codeRows}
                    allHref={codesAllHref}
                    allLabel={FA.allCodes}
                    onNavigate={goTo}
                    accent={CODES_COLOR}
                  />
                ) : null}
              </div>
            </div>
            <div>
              <a className={SHOP_BTN} href="/">
                فروشگاه
              </a>
            </div>
          </div>

          <div className="flex items-center justify-between lg:hidden">
            <div className="flex items-center">
              <a aria-label="شارژینو" className="-ms-2 flex items-center" href="/blog">
                <Logo color="#ffffff" iconOnly size={40} />
              </a>
              <button
                aria-label="باز کردن منو"
                className="flex h-[70px] w-10 items-center justify-center text-white"
                onClick={() => openPanel("menu", true)}
                type="button"
              >
                <BurgerIcon />
              </button>
            </div>
            <div className="flex items-center gap-[8px]">
              <a className={SHOP_BTN} href="/">
                فروشگاه
              </a>
            </div>
          </div>
        </div>
      </div>

      <div
        className="flex flex-wrap items-center justify-center gap-[60px] border-b-[0.8px] bg-headerdark py-[10px] ps-[9px] lg:hidden"
        style={HAIRLINE}
      >
        <GroupButton
          compact
          label={gamesName}
          color={GAMES_COLOR}
          open={open === "games"}
          onClick={() => openPanel("games")}
        />
        <GroupButton
          compact
          label={codesName}
          color={CODES_COLOR}
          open={open === "codes"}
          onClick={() => openPanel("codes")}
        />
      </div>

      {showMobileOverlay ? (
        <div className="fixed inset-0 z-[600] overflow-y-auto bg-headerdark lg:hidden" role="dialog" aria-modal="true">
          <div className="sticky top-0 z-10 bg-headerdark">
            <div className="relative flex h-14 items-center justify-between px-2">
              <button
                aria-label="بازگشت"
                className="flex h-10 w-10 items-center justify-center text-white"
                onClick={onBack}
                type="button"
              >
                <span className="rtl:rotate-180">
                  <BackChevron />
                </span>
              </button>
              {overlayIsList ? (
                <div className="absolute inset-x-12 flex justify-center">
                  <button
                    aria-expanded={pickerOpen}
                    aria-haspopup="listbox"
                    className="blog-display inline-flex items-center text-[20px] font-extrabold leading-[20px] text-white"
                    onClick={() => setPickerOpen((value) => !value)}
                    type="button"
                  >
                    <span dir="auto">{overlayLabel}</span>
                    <Caret color="currentColor" />
                  </button>
                </div>
              ) : null}
              <button
                aria-label="بستن منو"
                className="flex h-10 w-10 items-center justify-center text-white"
                onClick={closePanel}
                type="button"
              >
                <CloseIcon />
              </button>
            </div>
            {overlayIsList && pickerOpen ? (
              <div className="flex flex-col items-center gap-3 border-b border-[rgb(42,42,48)] pb-4">
                <button
                  className="blog-display text-[18px] font-extrabold"
                  onClick={() => openPanel("games", fromMenu)}
                  style={{ color: GAMES_COLOR }}
                  type="button"
                >
                  {gamesName}
                </button>
                <button
                  className="blog-display text-[18px] font-extrabold"
                  onClick={() => openPanel("codes", fromMenu)}
                  style={{ color: CODES_COLOR }}
                  type="button"
                >
                  {codesName}
                </button>
              </div>
            ) : null}
          </div>

          {open === "menu" ? (
            <nav className="flex flex-col gap-3 px-4 pt-4">
              <button
                className="flex min-h-[56px] items-center justify-between rounded-2xl bg-[rgb(38,38,42)] px-4 text-white"
                onClick={() => openPanel("games", true)}
                type="button"
              >
                <span className="blog-display text-[20px] font-extrabold">{gamesName}</span>
                <ForwardChevron />
              </button>
              <button
                className="flex min-h-[56px] items-center justify-between rounded-2xl bg-[rgb(38,38,42)] px-4 text-white"
                onClick={() => openPanel("codes", true)}
                type="button"
              >
                <span className="blog-display text-[20px] font-extrabold">{codesName}</span>
                <ForwardChevron />
              </button>
            </nav>
          ) : (
            <MobileNavList
              items={overlayItems}
              allHref={overlayAllHref}
              allLabel={open === "codes" ? FA.allCodes : FA.allGames}
              onNavigate={goTo}
            />
          )}
        </div>
      ) : null}
    </header>
  );
}
