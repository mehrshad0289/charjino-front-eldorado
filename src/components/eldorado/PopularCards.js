"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { FA } from "./data/faCopy";

const LOOP_MS = 42000;
const DRAG_THRESHOLD = 8;

function OfferCard({ c, i }) {
  return (
    <a
      href={c.href}
      draggable={false}
      className="relative flex h-[336px] w-[272px] flex-col justify-end gap-2.5 overflow-hidden rounded-lg p-6 text-sm leading-[21px] text-white md:h-80"
    >
      {c.img ? (
        <img
          src={c.img}
          alt={c.item}
          draggable={false}
          loading={i < 2 ? "eager" : "lazy"}
          className="pointer-events-none absolute start-0 top-0 size-full object-cover object-top"
        />
      ) : null}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "linear-gradient(rgba(30, 31, 40, 0) 50%, rgb(30, 31, 40) 92.5%)",
        }}
      />
      <div className="relative flex items-center gap-1">
        {c.gameIcon ? (
          <img
            src={c.gameIcon}
            alt={c.game}
            width="20"
            height="20"
            draggable={false}
            loading="lazy"
            className="h-5 w-5 shrink-0 rounded-sm object-cover"
          />
        ) : null}
        <span className="block truncate text-xs font-bold leading-[16.8px]">{c.game}</span>
      </div>
      <div className="relative flex flex-col gap-3">
        <span className="block truncate text-2xl font-bold leading-[28.8px]" dir="auto">
          {c.item}
        </span>
        {c.discount ? (
          <div className="flex flex-wrap items-end gap-x-2 gap-y-1">
            <span className="block text-xl font-bold leading-[30px] text-pricegreen">{c.price}</span>
            <span className="block rounded-sm bg-pricegreen/20 px-1 py-0.5 text-xs font-bold leading-[16.8px] text-pricegreen">
              {c.discount}
            </span>
            <s className="mb-0.5 block leading-[19.6px]">{c.oldPrice}</s>
          </div>
        ) : (
          <span className="block text-xl font-bold leading-[30px]">{c.price}</span>
        )}
      </div>
      <div className="relative mt-1 md:hidden">
        <span className="flex h-9 items-center justify-center rounded-lg bg-brand text-sm font-bold text-ink">
          {FA.buyNow}
        </span>
      </div>
    </a>
  );
}

function wrapOffset(value, width) {
  if (width <= 0) return 0;
  let next = value % width;
  if (next < 0) next += width;
  return next;
}

export default function PopularCards({ items, title }) {
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const offsetRef = useRef(0);
  const setWidthRef = useRef(0);
  const draggingRef = useRef(false);
  const trackingRef = useRef(false);
  const hoverPauseRef = useRef(false);
  const reduceMotionRef = useRef(false);
  const suppressClickRef = useRef(false);
  const pointerIdRef = useRef(null);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const startOffsetRef = useRef(0);
  const lastTimeRef = useRef(0);
  const cards = Array.isArray(items) ? items : [];
  const looping = cards.length > 1;
  const [grabbing, setGrabbing] = useState(false);

  const loop = useMemo(() => {
    if (cards.length === 0) return [];
    if (!looping) return cards;
    return [...cards, ...cards, ...cards];
  }, [cards, looping]);

  const applyTransform = () => {
    const track = trackRef.current;
    if (!track) return;
    track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
  };

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const copies = looping ? 3 : 1;
    const measure = () => {
      setWidthRef.current = copies > 1 ? track.scrollWidth / copies : 0;
      offsetRef.current = wrapOffset(offsetRef.current, setWidthRef.current || 1);
      applyTransform();
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    return () => ro.disconnect();
  }, [loop, looping]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      reduceMotionRef.current = mq.matches;
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!looping) return undefined;
    lastTimeRef.current = performance.now();
    let frame = 0;
    const tick = (now) => {
      const dt = Math.min(48, now - lastTimeRef.current);
      lastTimeRef.current = now;
      const width = setWidthRef.current;
      if (
        width > 0 &&
        !draggingRef.current &&
        !hoverPauseRef.current &&
        !reduceMotionRef.current
      ) {
        offsetRef.current = wrapOffset(offsetRef.current + (width / LOOP_MS) * dt, width);
        applyTransform();
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [looping]);

  const stopTracking = (event) => {
    trackingRef.current = false;
    draggingRef.current = false;
    pointerIdRef.current = null;
    setGrabbing(false);
    const node = viewportRef.current;
    if (node && event?.pointerId != null) {
      try {
        node.releasePointerCapture(event.pointerId);
      } catch {
        /* already released */
      }
    }
  };

  const onPointerDown = (event) => {
    if (!looping || event.button != null && event.button !== 0) return;
    trackingRef.current = true;
    draggingRef.current = false;
    suppressClickRef.current = false;
    pointerIdRef.current = event.pointerId;
    startXRef.current = event.clientX;
    startYRef.current = event.clientY;
    startOffsetRef.current = offsetRef.current;
    if (event.pointerType === "mouse" || event.pointerType === "pen") {
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {
        /* synthetic / already captured */
      }
    }
  };

  const onPointerMove = (event) => {
    if (!trackingRef.current || pointerIdRef.current !== event.pointerId) return;
    const dx = event.clientX - startXRef.current;
    const dy = event.clientY - startYRef.current;

    if (!draggingRef.current) {
      const passed = Math.abs(dx) >= DRAG_THRESHOLD || Math.abs(dy) >= DRAG_THRESHOLD;
      if (!passed) return;
      if (event.pointerType === "touch" && Math.abs(dy) > Math.abs(dx)) {
        stopTracking(event);
        return;
      }
      if (Math.abs(dx) < DRAG_THRESHOLD) return;
      draggingRef.current = true;
      suppressClickRef.current = true;
      setGrabbing(true);
      try {
        if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
          event.currentTarget.setPointerCapture(event.pointerId);
        }
      } catch {
        /* synthetic / already captured */
      }
    }

    event.preventDefault();
    offsetRef.current = wrapOffset(startOffsetRef.current + dx, setWidthRef.current);
    applyTransform();
  };

  const onPointerUp = (event) => {
    if (pointerIdRef.current !== event.pointerId && pointerIdRef.current != null) return;
    stopTracking(event);
  };

  const onClickCapture = (event) => {
    if (!suppressClickRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    suppressClickRef.current = false;
  };

  const onPointerEnter = (event) => {
    if (event.pointerType === "mouse") hoverPauseRef.current = true;
  };

  const onPointerLeave = (event) => {
    if (event.pointerType === "mouse" && !draggingRef.current) hoverPauseRef.current = false;
  };

  if (cards.length === 0) return null;

  return (
    <section className="relative z-10 mb-6 mb-12 pt-6">
      <div className="mx-auto max-w-[1208px] px-4 md:px-6">
        <span className="block text-lg font-bold leading-[27px]">{title || FA.popular}</span>
        <div
          ref={viewportRef}
          className={`popular-cards-viewport mt-4 overflow-hidden ${grabbing ? "is-grabbing" : ""}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onLostPointerCapture={onPointerUp}
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
          onClickCapture={onClickCapture}
          onDragStart={(event) => event.preventDefault()}
        >
          <div ref={trackRef} className="popular-cards-track flex w-max gap-6 whitespace-nowrap">
            {loop.map((c, i) => (
              <div key={`${c.key || c.item}-${i}`} className="shrink-0">
                <OfferCard c={c} i={i} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
