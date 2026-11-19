"use client";

import Link from "next/link";
import { useState } from "react";

/* Accordion rows from the about FAQ / bug-bounty Known Issues captures:
   bg-white rounded-lg rows with a bold question and a gray chevron (rotated
   180° when expanded). Rows WITHOUT an answer are static (the captures
   contain no accordion bodies for them — nothing invented); rows with an
   answer toggle open/closed. `defaultOpen` marks the item the capture shows
   expanded. */
export default function FaqAccordion({ items, static: staticMode = false }) {
  const [openIndex, setOpenIndex] = useState(
    () => items.findIndex((it) => it.open),
  );

  return (
    <div className="flex flex-col gap-2">
      {items.map((item, i) => {
        const paragraphs = Array.isArray(item.a) ? item.a : item.a ? [item.a] : [];
        const interactive = !staticMode && paragraphs.length > 0;
        const isOpen = interactive && openIndex === i;
        return (
          <div key={item.q} className="flex w-full flex-col rounded-lg bg-card px-[14px] py-3">
            {interactive ? (
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpenIndex(isOpen ? -1 : i)}
                className="flex items-center justify-between gap-1.5 text-start font-bold"
              >
                <span>{item.q}</span>
                <span className={`text-graytext transition-transform ${isOpen ? "rotate-180" : ""}`}>
                  <Chevron />
                </span>
              </button>
            ) : (
              <div className="flex items-center justify-between gap-1.5 font-bold">
                <span>{item.q}</span>
                <span className="text-graytext">
                  <Chevron />
                </span>
              </div>
            )}
            {isOpen && (
              <div className="flex flex-col gap-3 pt-6">
                {paragraphs.map((text) => (
                  <p key={text.slice(0, 48)} className="text-start leading-[22px] text-graytext">
                    {text}
                  </p>
                ))}
                {item.href ? (
                  <Link href={item.href} className="font-bold text-linkblue">
                    {item.linkLabel || "ادامه"}
                  </Link>
                ) : null}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Chevron() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
