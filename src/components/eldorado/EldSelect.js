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

/* Global single-select — same control as dashboard purchased-orders
   "All statuses": gray 42px trigger, menu matches trigger width (no page
   overflow), selected row is a yellow inset box, hover is gray. */
export default function EldSelect({
  options = [],
  value,
  onChange,
  name,
  id,
  ariaLabel = "انتخاب",
  className = "",
  disabled = false,
  placeholder = "",
  invalid = false,
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const listId = useId();
  const selected = options.find((item) => String(item.value) === String(value)) ?? null;

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
    <div ref={rootRef} className={`eld-dropdown relative min-w-0 ${open ? "open" : ""} ${className}`.trim()}>
      {name ? <input type="hidden" name={name} value={value ?? ""} /> : null}
      <div
        id={id}
        role="combobox"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        aria-invalid={invalid ? "true" : undefined}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listId}
        aria-label={ariaLabel}
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
        className={`flex min-h-[42px] w-full min-w-0 cursor-pointer items-center justify-between overflow-hidden rounded-lg bg-inputgray px-[14px] py-2 leading-[19.6px] outline-none ${
          open ? "shadow-[inset_0_0_0_1px_rgb(20,19,26)]" : invalid ? "shadow-[inset_0_0_0_2px_rgb(232,27,22)]" : "shadow-[inset_0_0_0_1px_transparent]"
        } ${disabled ? "pointer-events-none opacity-70" : ""}`}
      >
        <span className="min-w-0 flex-1 truncate text-[14px] text-filtertext">
          {selected?.label ?? placeholder}
        </span>
        <span className={`ms-2 shrink-0 text-placehold transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          <ChevronDown />
        </span>
      </div>
      {open ? (
        <div
          role="listbox"
          id={listId}
          aria-multiselectable="false"
          className="absolute inset-x-0 z-30 mt-1 max-h-[200px] overflow-x-hidden overflow-y-auto rounded-lg bg-white py-1 shadow-[0_8px_24px_rgba(9,9,11,0.12),0_0_0_1px_rgba(9,9,11,0.06)]"
        >
          {options.map((item) => {
            const isSelected = String(item.value) === String(selected?.value ?? "");
            return (
              <div
                key={String(item.value)}
                role="option"
                id={`${listId}-option-${String(item.value)}`}
                tabIndex={-1}
                aria-selected={isSelected}
                onClick={() => pick(item.value)}
                className={`mx-[6px] my-[2px] flex cursor-pointer items-center justify-between gap-3 overflow-hidden rounded-md px-2 py-2 text-[14px] leading-[20px] ${
                  isSelected ? "bg-brand text-ink" : "text-ink hover:bg-badgebg"
                }`}
              >
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                {isSelected ? (
                  <span className="shrink-0 text-ink" aria-hidden="true">
                    <CheckIcon />
                  </span>
                ) : (
                  <span className="inline-block size-[18px] shrink-0" aria-hidden="true" />
                )}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
