"use client";

import { useState } from "react";

const CHEVRON =
  "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F0aab95de45a88bd84c271b846c328812dfcf8477.svg?generation=1793791941373779&alt=media";

export default function BlogArticleFaq({ items }) {
  const [openIndex, setOpenIndex] = useState(0);
  if (!items || !items.length) return null;

  return (
    <div className="mb-[40px] pb-16 pt-6">
      <div className="mb-[24px] text-center text-[36px] font-bold leading-[43.2px]">
        <h2 className="blog-display text-center">پرسش‌های پرتکرار</h2>
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
                className="relative block w-full pb-4 ps-6 pe-16 pt-4 text-start text-[18px] font-bold leading-[21.6px] text-white"
              >
                <span dir="auto">{item.q}</span>
                <img
                  src={CHEVRON}
                  alt=""
                  width="24"
                  height="24"
                  aria-hidden="true"
                  className={`absolute bottom-[2.8px] end-6 top-[26.8px] h-6 w-6 transition-transform duration-200 ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </button>
              {open && (
                <div
                  role="region"
                  className="blog-answer pb-4 ps-6 pe-6 pt-2"
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
