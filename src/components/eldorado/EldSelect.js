"use client";

import { useEffect, useId, useRef, useState } from "react";

function ChevronDown() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m6 9.5 6 5 6-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12.5 9.2 17 19 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* Global single-select — live eld-dropdown (size s): gray 42px trigger,
   chevron rotates when open, menu below (max-height 200px, min-width
   max-content / 10.5rem), selected row shows an 18px check. */
export default function EldSelect({
  options = [],
  value,
  onChange,
  ariaLabel = "Single-select dropdown",
  className = "",
  disabled = false,
  placeholder = "",
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const listId = useId();
  const selected = options.find((item) => item.value === value) ?? null;

  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const pick = (next) => {
    onChange?.(next);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className={`eld-dropdown relative ${open ? "open" : ""} ${className}`}>
      <div
        role="combobox"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listId}
        aria-label={ariaLabel}
        aria-required="false"
        onClick={() => {
          if (!disabled) setOpen((current) => !current);
        }}
        onKeyDown={(event) => {
          if (disabled) return;
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setOpen((current) => !current);
          }
        }}
        className={`flex min-h-[42px] w-full cursor-pointer items-center justify-between overflow-hidden rounded-lg bg-inputgray px-[14px] py-2 leading-[19.6px] outline-none ${
          open ? "shadow-[inset_0_0_0_1px_rgb(20,19,26)]" : "shadow-[inset_0_0_0_1px_transparent]"
        } ${disabled ? "pointer-events-none opacity-70" : ""}`}
      >
        <span className="min-w-0 max-w-full flex-1 truncate overflow-hidden whitespace-nowrap text-[14px] text-filtertext">
          {selected?.label ?? placeholder}
        </span>
        <span
          className={`ms-2 shrink-0 text-placehold transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <ChevronDown />
        </span>
      </div>
      {open ? (
        <div
          role="listbox"
          id={listId}
          aria-multiselectable="false"
          className="absolute start-0 z-30 mt-1 overflow-auto rounded-lg bg-white py-1 shadow-[0_8px_24px_rgba(9,9,11,0.12),0_0_0_1px_rgba(9,9,11,0.06)]"
          style={{ maxHeight: 200, minWidth: "max-content" }}
        >
          <div className="min-w-[10.5rem]">
            {options.map((item) => {
              const isSelected = item.value === selected?.value;
              return (
                <div
                  key={String(item.value)}
                  role="option"
                  id={`${listId}-option-${String(item.value)}`}
                  tabIndex={-1}
                  aria-selected={isSelected}
                  aria-disabled="false"
                  onClick={() => pick(item.value)}
                  className="flex cursor-pointer items-center justify-between gap-3 px-[14px] py-2 text-base hover:bg-badgebg"
                >
                  <span>{item.label}</span>
                  {isSelected ? (
                    <span className="shrink-0 text-placehold" aria-hidden="true">
                      <CheckIcon />
                    </span>
                  ) : (
                    <span className="inline-block size-[18px] shrink-0" aria-hidden="true" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
