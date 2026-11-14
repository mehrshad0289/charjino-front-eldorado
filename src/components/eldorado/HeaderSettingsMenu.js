"use client";

import { useEffect, useRef } from "react";
import DashboardIcon from "./DashboardIcons";
import { FA } from "./data/faCopy";

/* Mobile settings sheet from www_eldorado_gg_390w_default.make:
   260px white panel under the 60px header row — language | toman,
   then Dark theme + switch. */
export default function HeaderSettingsMenu({ open, onOpenChange }) {
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (event) => {
      if (!rootRef.current?.contains(event.target)) onOpenChange(false);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open, onOpenChange]);

  return (
    <div ref={rootRef} className="relative ms-2 lg:hidden">
      <button
        type="button"
        aria-label={FA.settings}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => onOpenChange(!open)}
        className={`flex h-[42px] w-[42px] items-center justify-center rounded-[0.625rem] text-white ${
          open ? "bg-catactive" : ""
        }`}
      >
        <DashboardIcon name="settings" size={24} />
      </button>
      {open ? (
        <div
          role="menu"
          className="fixed end-0 top-[60px] z-[1] w-[260px] bg-white p-[10px] text-ink shadow-[rgba(47,47,55,0.15)_0px_2px_4px_0px,rgba(47,47,55,0.1)_0px_24px_60px_0px,rgba(47,47,55,0.05)_0px_12px_24px_0px]"
        >
          <div className="mb-2 flex items-center justify-between p-1">
            <div className="flex items-center">
              <DashboardIcon name="language" size={24} />
              <span className="ms-[10px] leading-5">
                <span className="inline-flex gap-1">
                  <span>{FA.language}</span>
                  <span>|</span>
                  <span>{FA.toman}</span>
                </span>
              </span>
            </div>
            <span className="rtl:rotate-180">
              <DashboardIcon name="chevronRight" size={32} />
            </span>
          </div>
          <div className="flex items-center justify-between pe-[5px]">
            <div className="flex items-center">
              <span className="ms-1">
                <DashboardIcon name="darkMode" size={24} />
              </span>
              <span className="ms-[10px] leading-5">{FA.darkTheme}</span>
            </div>
            <div className="flex h-10 w-16 items-center justify-center">
              <label className="relative block h-5 w-12">
                <input
                  type="checkbox"
                  aria-label={FA.darkTheme}
                  className="inline-block h-0 w-0 opacity-0"
                />
                <span className="absolute inset-0 rounded-2xl bg-cardborder">
                  <span
                    aria-hidden="true"
                    className="absolute start-0 top-[-2px] h-6 w-6 rounded-full bg-white shadow-[rgba(9,9,11,0.05)_0px_2px_4px_0px,rgba(9,9,11,0.02)_0px_12px_8px_0px]"
                  />
                </span>
              </label>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
