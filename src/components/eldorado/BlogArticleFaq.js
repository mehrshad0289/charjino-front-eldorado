"use client";

import { useState } from "react";

/* FAQ accordion for blog article pages (article capture: faq-box —
   `li mb-[12px] bg-[rgb(30,31,40)] rounded-lg`, question `block font-bold
   relative text-[18px] leading-[21.6px] pt-4 pr-16 pb-4 pl-6` with the
   capture's 24px chevron svg on the right (flipped when open, per the
   capture's matrix(-1,0,0,-1) open state), answer `pt-2 pr-6 pb-4 pl-6`
   18px/24.75 rgb(191,187,212)). First item open by default (live:
   accordion-item is-active on load). */

const CHEVRON =
  "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F0aab95de45a88bd84c271b846c328812dfcf8477.svg?generation=1793791941373779&alt=media";

export default function BlogArticleFaq({ items }) {
  const [openIndex, setOpenIndex] = useState(0);
  if (!items || !items.length) return null;

  return (
    <div className="mb-[40px] pb-16 pt-6">
      <div className="mb-[24px] text-center text-[36px] font-bold leading-[43.2px]">
        <h2 className="text-center">FAQ</h2>
      </div>
      <ul>
        {items.map((item, i) => {
          const open = openIndex === i;
          return (
            <li
              key={item.q}
              className={`mb-[12px] list-none rounded-lg bg-[rgb(30,31,40)] ${open ? "is-active" : ""}`}
            >
              <button
                type="button"
                aria-expanded={open}
                onClick={() => setOpenIndex(open ? -1 : i)}
                className="relative block w-full pb-4 pl-6 pr-16 pt-4 text-left text-[18px] font-bold leading-[21.6px] text-white"
              >
                {item.q}
                <img
                  src={CHEVRON}
                  alt=""
                  width="24"
                  height="24"
                  aria-hidden="true"
                  className={`absolute bottom-[2.8px] right-6 top-[26.8px] h-6 w-6 transition-transform duration-200 ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </button>
              {open && (
                <div
                  role="region"
                  className="blog-answer pb-4 pl-6 pr-6 pt-2"
                  dangerouslySetInnerHTML={{ __html: item.aHtml }}
                />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
