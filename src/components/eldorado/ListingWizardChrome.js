"use client";

import { LISTING_SECTIONS } from "@/lib/listing";
import { LISTING_COPY } from "./data/listingData";
import LoadingSpinner from "./LoadingSpinner";

export const listingCardShadow = "0 2px 4px 0 rgba(9,9,11,0.05), 0 12px 8px 0 rgba(9,9,11,0.02)";

const inputClass =
  "block h-[42px] w-full rounded-lg border-2 border-[rgb(239,239,241)] bg-[rgb(239,239,241)] px-3 text-[14px] text-ink outline-none";
const invalidClass = "border-[rgb(232,27,22)] bg-[rgb(255,244,244)]";

export function listingControlClass(invalid) {
  return `${inputClass} mt-1 ${invalid ? invalidClass : ""}`;
}

export function ListingFieldNote({ message }) {
  if (!message) return null;
  return (
    <p className="mt-1 text-[13px] font-normal text-[rgb(232,27,22)]" role="alert">
      {message}
    </p>
  );
}

export function ListingSection({ id, title, hint, children }) {
  return (
    <section id={id} className="scroll-mt-36 rounded-xl bg-white p-5" style={{ boxShadow: listingCardShadow }}>
      <h2 className="text-[18px] font-bold">{title}</h2>
      {hint ? <p className="mt-1 text-[14px] text-graytext">{hint}</p> : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function gentleScrollTo(id) {
  const node = document.getElementById(id);
  if (!node) return;
  const offset = window.innerWidth < 1024 ? 128 : 112;
  const top = Math.max(0, window.scrollY + node.getBoundingClientRect().top - offset);
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    window.scrollTo(0, top);
    return;
  }
  const start = window.scrollY;
  const change = top - start;
  const duration = window.innerWidth < 1024 ? 900 : 560;
  const started = performance.now();
  function frame(now) {
    const progress = Math.min(1, (now - started) / duration);
    const eased = 1 - (1 - progress) ** 3;
    window.scrollTo(0, start + change * eased);
    if (progress < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

export function jumpToListingSection(id, setActiveSection) {
  setActiveSection(id);
  gentleScrollTo(id);
}

export function focusListingField(id) {
  const node = document.getElementById(id);
  if (!node) return;
  gentleScrollTo(id);
  window.setTimeout(() => {
    if (typeof node.focus === "function") node.focus({ preventScroll: true });
  }, window.innerWidth < 1024 ? 920 : 580);
}

export function ListingStepNav({ checks, activeSection, onJump, issueList }) {
  return (
    <div className="sticky top-[var(--shop-header-h)] z-20 flex flex-col gap-2">
      <nav className="flex gap-2 overflow-x-auto rounded-xl bg-white p-2" style={{ boxShadow: listingCardShadow }} aria-label="بخش‌های آگهی">
        {LISTING_SECTIONS.map((section, index) => {
          const current = activeSection === section.id;
          const done = checks.find((item) => item.id === section.id)?.ok;
          return (
            <button
              key={section.id}
              type="button"
              aria-current={current ? "true" : undefined}
              onClick={() => onJump(section.id)}
              className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg px-3 text-[13px] font-bold ${
                current ? "bg-ink text-white" : "bg-[rgb(244,244,244)] text-ink"
              }`}
            >
              <span className={`flex size-6 items-center justify-center rounded-full ${done ? "bg-[rgb(33,150,83)] text-white" : "bg-white text-ink"}`}>
                {done ? "✓" : index + 1}
              </span>
              {section.label}
            </button>
          );
        })}
      </nav>
      {issueList.length ? (
        <div role="alert" className="rounded-xl bg-[rgb(255,244,244)] p-3 text-[14px] shadow-[0_8px_20px_rgba(9,9,11,0.08)]">
          <p className="font-bold">برای ادامه این موارد را کامل کن</p>
          <ul className="mt-1 list-disc ps-5">
            {issueList.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

export function ListingPreviewAside({
  cover,
  title,
  subtitle,
  extra,
  priceLabel,
  checks,
  sectionIssueText,
  onJump,
  actions,
}) {
  return (
    <aside className="mt-4 lg:sticky lg:top-[var(--shop-header-h)] lg:mt-0">
      <div className="rounded-xl bg-white p-4" style={{ boxShadow: listingCardShadow }}>
        <p className="text-[13px] font-bold text-graytext">پیش‌نمایش آگهی</p>
        {cover ? (
          <img src={cover} alt="" className="mt-3 h-36 w-full rounded-lg object-cover" />
        ) : (
          <div className="mt-3 flex h-36 items-center justify-center rounded-lg bg-[rgb(244,244,244)] text-[13px] text-graytext">بدون عکس</div>
        )}
        <p className="mt-3 text-[16px] font-bold">{title}</p>
        {subtitle ? <p className="text-[13px] text-graytext">{subtitle}</p> : null}
        {extra ? <p className="mt-1 text-[14px] text-graytext">{extra}</p> : null}
        <p className="mt-1 text-[18px] font-bold">{priceLabel}</p>
        <ul className="mt-4 flex flex-col gap-2">
          {checks.map((item) => {
            const reason = sectionIssueText(item.id);
            return (
              <li key={item.id}>
                <button type="button" onClick={() => onJump(item.id)} className="flex w-full flex-col items-stretch text-start text-[14px]">
                  <span className="flex items-center justify-between">
                    <span>{item.label}</span>
                    <span className={item.ok ? "font-bold text-[rgb(33,150,83)]" : reason ? "font-bold text-[rgb(232,27,22)]" : "text-graytext"}>
                      {item.ok ? "کامل" : reason ? "اصلاح کن" : "ناقص"}
                    </span>
                  </span>
                  {reason ? <span className="mt-1 text-[12px] font-normal text-[rgb(232,27,22)]">{reason}</span> : null}
                </button>
              </li>
            );
          })}
        </ul>
        <p className="mt-4 text-[13px] text-graytext">{LISTING_COPY.liveNote}</p>
        <div className="mt-4 hidden flex-col gap-2 lg:flex">{actions}</div>
      </div>
    </aside>
  );
}

export function ListingMobileBar({ loading, onDraft, onPlace, placeLabel }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 flex gap-2 border-t border-[rgb(231,231,231)] bg-white p-3 lg:hidden">
      <button type="button" disabled={loading} onClick={onDraft} className="inline-flex min-h-[42px] flex-1 items-center justify-center rounded-lg border-2 border-ink text-[14px] font-bold disabled:opacity-60">
        پیش‌نویس
      </button>
      <button type="button" disabled={loading} onClick={onPlace} className="inline-flex min-h-[42px] flex-[2] items-center justify-center rounded-lg bg-brand text-[14px] font-bold text-ink disabled:opacity-60">
        {loading ? <LoadingSpinner variant="inline" className="text-ink" /> : placeLabel}
      </button>
    </div>
  );
}

export function ListingPhotoTile({ slot, row, invalid, onPick, onRemove }) {
  return (
    <div
      id={`listing-photo-${slot.slot}`}
      className={`rounded-lg p-3 ${invalid ? "bg-[rgb(255,244,244)] ring-2 ring-[rgb(232,27,22)]" : "bg-[rgb(244,244,244)]"}`}
    >
      <p className="text-[13px] font-bold">
        {slot.label}
        {slot.required ? " *" : ""}
      </p>
      {slot.hint ? <p className="text-[12px] text-graytext">{slot.hint}</p> : null}
      {row?.previewUrl ? (
        <img src={row.previewUrl} alt={slot.label} className="mt-2 h-28 w-full rounded-lg object-cover" />
      ) : (
        <div className="mt-2 flex h-28 items-center justify-center rounded-lg border border-dashed border-[rgb(198,198,204)] text-[12px] text-graytext">
          jpg / png / webp
        </div>
      )}
      <div className="mt-2 flex gap-2">
        <label className="inline-flex min-h-9 cursor-pointer items-center rounded-lg bg-ink px-3 text-[12px] font-bold text-white">
          انتخاب
          <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => onPick(event.target.files?.[0])} />
        </label>
        {row?.previewUrl ? (
          <button type="button" onClick={onRemove} className="min-h-9 rounded-lg px-2 text-[12px] font-bold text-[rgb(232,27,22)]">
            حذف
          </button>
        ) : null}
      </div>
    </div>
  );
}
