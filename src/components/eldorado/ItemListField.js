"use client";

import { useId, useRef, useState } from "react";
import { toFaDigits } from "@/lib/fa-digits";
import { joinItemList, splitItemList } from "@/lib/listing";
import { ListingFieldNote, listingInputClass } from "./ListingWizardChrome";

const MAX_ITEMS = 40;
const MAX_LENGTH = 80;

function emptyCopy(noun) {
  if (noun === "بازی") return "هنوز هیچ بازی‌ای اضافه نشده.";
  return `هنوز هیچ ${noun}ی اضافه نشده.`;
}

export default function ItemListField({
  id,
  label,
  required = false,
  value = "",
  onChange,
  invalid = false,
  error = "",
  itemNoun = "مورد",
  placeholder,
  addLabel,
  hint,
  maxItems = MAX_ITEMS,
  maxLength = MAX_LENGTH,
}) {
  const reactId = useId();
  const inputRef = useRef(null);
  const inputId = id || `item-list-${reactId}`;
  const listId = `${inputId}-list`;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;
  const statusId = `${inputId}-status`;
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState("");
  const items = splitItemList(value);
  const full = items.length >= maxItems;
  const addText = addLabel || `افزودن ${itemNoun}`;
  const fieldHint = hint || `اسم ${itemNoun} را بنویس و «${addText}» را بزن.`;
  const describedBy = [hintId, invalid && error ? errorId : "", statusId].filter(Boolean).join(" ");

  function add() {
    const next = draft.trim().slice(0, maxLength);
    if (!next || full) return;
    if (items.includes(next)) {
      setStatus(`«${next}» از قبل در فهرست است.`);
      setDraft("");
      inputRef.current?.focus();
      return;
    }
    onChange?.(joinItemList([...items, next]));
    setDraft("");
    setStatus(`«${next}» اضافه شد.`);
    inputRef.current?.focus();
  }

  function remove(item) {
    onChange?.(joinItemList(items.filter((row) => row !== item)));
    setStatus(`«${item}» حذف شد.`);
    inputRef.current?.focus();
  }

  return (
    <fieldset className="min-w-0">
      <legend className="text-[14px] font-bold">
        {label}
        {required ? " *" : ""}
      </legend>
      <p id={hintId} className="mt-1 text-[13px] font-normal text-graytext">
        {fieldHint}
      </p>
      <div className="mt-1 flex gap-2">
        <input
          ref={inputRef}
          id={inputId}
          value={draft}
          maxLength={maxLength}
          autoComplete="off"
          placeholder={placeholder || `اسم ${itemNoun}`}
          aria-invalid={invalid ? "true" : undefined}
          aria-describedby={describedBy}
          aria-controls={listId}
          disabled={full}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key !== "Enter") return;
            event.preventDefault();
            add();
          }}
          className={`${listingInputClass(invalid)} min-w-0 flex-1`}
        />
        <button
          type="button"
          onClick={add}
          disabled={full || !draft.trim()}
          className="inline-flex min-h-[42px] shrink-0 items-center justify-center rounded-lg bg-brand px-4 text-[14px] font-bold text-ink disabled:opacity-60"
        >
          {addText}
        </button>
      </div>
      <p id={statusId} className="sr-only" aria-live="polite">
        {status}
      </p>
      {items.length ? (
        <ul id={listId} className="mt-3 flex flex-col gap-2" aria-label={`فهرست ${itemNoun}`}>
          {items.map((item) => (
            <li
              key={item}
              className="flex min-h-[42px] items-center justify-between gap-3 rounded-lg bg-[rgb(239,239,241)] px-3 text-[14px]"
            >
              <span className="min-w-0 truncate" dir="auto">
                {item}
              </span>
              <button
                type="button"
                onClick={() => remove(item)}
                aria-label={`حذف ${item}`}
                className="shrink-0 text-[13px] font-bold text-[rgb(232,27,22)]"
              >
                حذف
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p id={listId} className="mt-2 text-[13px] font-normal text-graytext">
          {emptyCopy(itemNoun)}
        </p>
      )}
      {full ? (
        <p className="mt-2 text-[13px] text-graytext">{`حداکثر ${toFaDigits(maxItems)} ${itemNoun} می‌توانی اضافه کنی.`}</p>
      ) : null}
      <div id={errorId}>
        <ListingFieldNote message={error} />
      </div>
    </fieldset>
  );
}
