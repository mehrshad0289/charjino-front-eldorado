"use client";

import { useState } from "react";
import { GIFT_CARD_FAQ } from "./data/giftCardData";

/* "Frequently Asked Questions" (giftcard .make capture): white rounded
   accordion rows with a chevron; answers are collapsed in the capture, so
   the answer copy was scraped live from eldorado.gg/xbox-gift-card/v/103.
   Title is left-aligned on mobile (live @390), centered on desktop. */

function Chevron({ open }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={`shrink-0 text-graytext transition-transform ${open ? "rotate-180" : ""}`}
    >
      <path d="m6 9.5 6 5 6-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Answer({ item }) {
  return (
    <div className="pt-6 text-[14px] leading-[21px] text-graytext">
      {item.intro && <p>{item.intro}</p>}
      {item.steps && (
        <ol className="my-2 list-decimal pl-6">
          {item.steps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
      )}
      {item.paragraphs?.map((p, i) => (
        <p key={i} className={i > 0 ? "mt-2" : ""}>
          {p}
        </p>
      ))}
      {item.after && <p className="mt-2">{item.after}</p>}
    </div>
  );
}

export default function GiftCardFaq() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="mb-10 md:mb-16">
      <div className="mb-6 text-left text-[24px] font-bold leading-[36px] md:mb-8 md:text-center md:text-[30px]">
        Frequently Asked Questions
      </div>
      <div className="flex flex-col gap-2">
        {GIFT_CARD_FAQ.map((item, i) => {
          const open = openIndex === i;
          return (
            <div key={item.q} className="flex w-full flex-col rounded-lg bg-white px-[14px] py-3">
              <button
                type="button"
                aria-expanded={open}
                onClick={() => setOpenIndex(open ? null : i)}
                className="flex items-center justify-between gap-1.5 text-left font-bold"
              >
                <span>{item.q}</span>
                <Chevron open={open} />
              </button>
              {open && <Answer item={item} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
