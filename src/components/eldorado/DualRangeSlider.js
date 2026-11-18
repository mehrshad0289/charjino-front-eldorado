"use client";

import { useCallback, useId, useRef, useState } from "react";
import { formatFacetNumber, rangeStep } from "../../lib/numeric-facet";

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function snapToStep(value, min, max, step) {
  if (value <= min) return min;
  if (value >= max) return max;
  if (!step || step <= 0) return clamp(value, min, max);
  const snapped = min + Math.round((value - min) / step) * step;
  if (snapped >= max) return max;
  if (snapped <= min) return min;
  return snapped;
}

export default function DualRangeSlider({
  label,
  min,
  max,
  step,
  valueMin,
  valueMax,
  onChange,
  formatValue = formatFacetNumber,
  disabled = false,
}) {
  const id = useId();
  const trackRef = useRef(null);
  const draggingRef = useRef(null);
  const rangeRef = useRef({ min: 0, max: 0 });
  const [dragging, setDragging] = useState(null);
  const lowBound = Number(min);
  const highBound = Number(max);
  const usable = Number.isFinite(lowBound) && Number.isFinite(highBound) && highBound > lowBound;
  const grain = step || (usable ? rangeStep(lowBound, highBound) : 1);
  const lo = usable ? snapToStep(Number(valueMin ?? lowBound), lowBound, highBound, grain) : lowBound;
  const hi = usable ? snapToStep(Number(valueMax ?? highBound), lowBound, highBound, grain) : highBound;
  const from = Math.min(lo, hi);
  const to = Math.max(lo, hi);
  const span = usable ? highBound - lowBound : 1;
  const minPct = usable ? ((from - lowBound) / span) * 100 : 0;
  const maxPct = usable ? ((to - lowBound) / span) * 100 : 100;
  if (!draggingRef.current) rangeRef.current = { min: from, max: to };

  const valueFromPointer = useCallback(
    (clientX) => {
      const track = trackRef.current;
      if (!track || !usable) return lowBound;
      const rect = track.getBoundingClientRect();
      if (rect.width <= 0) return lowBound;
      const rtl = getComputedStyle(track).direction === "rtl";
      const ratio = rtl ? (rect.right - clientX) / rect.width : (clientX - rect.left) / rect.width;
      const raw = lowBound + clamp(ratio, 0, 1) * span;
      return snapToStep(raw, lowBound, highBound, grain);
    },
    [grain, highBound, lowBound, span, usable],
  );

  function emit(nextMin, nextMax) {
    const a = clamp(Math.min(nextMin, nextMax), lowBound, highBound);
    const b = clamp(Math.max(nextMin, nextMax), lowBound, highBound);
    rangeRef.current = { min: a, max: b };
    onChange?.({ min: a, max: b });
  }

  function thumbForValue(value) {
    const current = rangeRef.current;
    return Math.abs(value - current.min) <= Math.abs(value - current.max) ? "min" : "max";
  }

  function moveThumb(which, next) {
    const current = rangeRef.current;
    if (which === "min") emit(Math.min(next, current.max), current.max);
    else emit(current.min, Math.max(next, current.min));
  }

  function onPointerDown(event) {
    if (disabled || !usable) return;
    event.preventDefault();
    const handle = event.target?.closest?.("[data-thumb]");
    const next = valueFromPointer(event.clientX);
    const which = handle?.getAttribute("data-thumb") || thumbForValue(next);
    draggingRef.current = which;
    setDragging(which);
    if (!handle) moveThumb(which, next);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }

  function onPointerMove(event) {
    if (!draggingRef.current) return;
    moveThumb(draggingRef.current, valueFromPointer(event.clientX));
  }

  function onPointerUp() {
    draggingRef.current = null;
    setDragging(null);
  }

  function onKeyDown(which, event) {
    if (disabled || !usable) return;
    const jump = grain * (event.shiftKey ? 10 : 1);
    const rtl = getComputedStyle(trackRef.current || document.documentElement).direction === "rtl";
    let next = which === "min" ? from : to;
    if (event.key === "ArrowRight") next += rtl ? -jump : jump;
    else if (event.key === "ArrowLeft") next += rtl ? jump : -jump;
    else if (event.key === "ArrowUp") next += jump;
    else if (event.key === "ArrowDown") next -= jump;
    else if (event.key === "Home") next = lowBound;
    else if (event.key === "End") next = highBound;
    else if (event.key === "PageUp") next += jump * 10;
    else if (event.key === "PageDown") next -= jump * 10;
    else return;
    event.preventDefault();
    moveThumb(which, snapToStep(next, lowBound, highBound, grain));
  }

  const thumbClass =
    "absolute top-1/2 z-[1] size-6 min-h-6 min-w-6 -translate-y-1/2 cursor-grab appearance-none rounded-full border-0 bg-white p-0 outline outline-2 outline-brand shadow-[0_1px_4px_rgba(20,19,26,0.18)] focus-visible:outline-focusblue disabled:cursor-default";

  return (
    <div className="select-none">
      <p className="mb-3 text-[14px] leading-5">
        <span className="font-bold text-brand-deep">
          {formatValue(from)} – {formatValue(to)}
        </span>
      </p>
      <div
        className={`relative h-8 px-3 ${disabled || !usable ? "opacity-60" : dragging ? "cursor-grabbing" : "cursor-pointer"}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onLostPointerCapture={onPointerUp}
        style={{ touchAction: "none" }}
      >
        <div ref={trackRef} className="absolute inset-x-3 top-1/2 h-2 -translate-y-1/2 rounded-full bg-inputgray">
          <div
            className="absolute inset-y-0 rounded-full bg-brand"
            style={{ insetInlineStart: `${minPct}%`, width: `${Math.max(0, maxPct - minPct)}%` }}
          />
        </div>
        <button
          type="button"
          id={`${id}-min`}
          role="slider"
          aria-label={`${label} از`}
          aria-valuemin={lowBound}
          aria-valuemax={highBound}
          aria-valuenow={from}
          aria-valuetext={formatValue(from)}
          disabled={disabled || !usable}
          tabIndex={disabled || !usable ? -1 : 0}
          data-thumb="min"
          className={thumbClass}
          style={{ insetInlineStart: `calc(${minPct}% - 12px)`, zIndex: dragging === "min" ? 2 : 1 }}
          onKeyDown={(event) => onKeyDown("min", event)}
        />
        <button
          type="button"
          id={`${id}-max`}
          role="slider"
          aria-label={`${label} تا`}
          aria-valuemin={lowBound}
          aria-valuemax={highBound}
          aria-valuenow={to}
          aria-valuetext={formatValue(to)}
          disabled={disabled || !usable}
          tabIndex={disabled || !usable ? -1 : 0}
          data-thumb="max"
          className={thumbClass}
          style={{ insetInlineStart: `calc(${maxPct}% - 12px)`, zIndex: dragging === "max" ? 2 : 1 }}
          onKeyDown={(event) => onKeyDown("max", event)}
        />
      </div>
    </div>
  );
}
