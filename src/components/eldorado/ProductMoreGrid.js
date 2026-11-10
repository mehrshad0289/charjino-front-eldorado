import { PRODUCT_MORE_CARDS, PRODUCT_MORE_EXTRA } from "./data/productData";

/* Bottom "More like this" grid (product .make capture, desktop only — the
   live mobile flow shows the top carousel with an "All offers" link instead
   and no bottom grid, probed 2026-11-04). 24px bold header + blue underlined
   "All offers" link; 3-column grid of h-40 white cards: title (2 lines) with
   58px thumbnail, seller + teal badge | feedback %, price 18px bold | teal
   bolt + gray delivery label; the grid ends with the gray "+15 more" cell. */

function VerifiedBadge() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
      <path
        d="M12 1.8 14.7 4l3.4-.4 1 3.3 2.9 1.9-1.3 3.2 1.3 3.2-2.9 1.9-1 3.3-3.4-.4L12 22.2 9.3 20l-3.4.4-1-3.3L2 15.2l1.3-3.2L2 8.8l2.9-1.9 1-3.3L9.3 4 12 1.8Z"
        fill="#00e4c9"
      />
      <path d="m8.4 12.2 2.4 2.4 4.8-5" stroke="#14131a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Bolt() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M13.5 3 6 13.5h4.5L10 21l7.5-10.5H13L13.5 3Z" fill="rgb(0, 228, 201)" />
    </svg>
  );
}

export default function ProductMoreGrid({ cards, allHref = "/efootball-accounts", heading = "More like this", extra = PRODUCT_MORE_EXTRA }) {
  const rows = cards || PRODUCT_MORE_CARDS;
  if (cards && rows.length === 0) return null;
  return (
    <section aria-label="More offers" className="hidden lg:block">
      <div className="flex items-center justify-between">
        <h2 className="text-[24px] font-bold leading-[normal]">{heading}</h2>
        <a href={allHref} className="text-[14px] leading-[21px] text-linkblue underline">
          {heading === "More like this" ? "All offers" : "همه آگهی‌ها"}
        </a>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4">
        {rows.map((c, i) => (
          <article
            key={`${c.title}-${i}`}
            className="flex h-40 flex-col rounded-lg bg-white px-[14px] pb-[14px] pt-4 shadow-[rgba(9,9,11,0.05)_0px_2px_4px_0px,rgba(9,9,11,0.02)_0px_12px_8px_0px]"
          >
            <div className="flex grow items-start justify-between">
              <div className="flex min-w-0 flex-col items-start gap-[8px]">
                {c.href ? (
                  <a href={c.href} className="flow-root overflow-hidden text-[14px] leading-[19.6px]">{c.title}</a>
                ) : (
                  <div className="flow-root overflow-hidden text-[14px] leading-[19.6px]">{c.title}</div>
                )}
              </div>
              <div className="ms-3 h-[58px] w-[58px] min-w-[58px] shrink-0 overflow-hidden">
                {c.img ? (
                  <img alt="" src={c.img} className="block h-[58px] w-[58px] rounded-sm object-cover align-middle" />
                ) : (
                  <span className="block h-[58px] w-[58px] rounded-sm bg-badgebg" />
                )}
              </div>
            </div>
            <div className="flex justify-between gap-[4px] text-[14px] leading-[14px]">
              <span className="flex min-w-0 items-center gap-[2px] text-graytext">
                <strong className="block truncate font-bold">{c.seller}</strong>
                <VerifiedBadge />
              </span>
              <span className="shrink-0">
                {c.feedback}&nbsp;{c.count}
              </span>
            </div>
            <div className="mt-[10px] flex items-center justify-between">
              <strong className="text-[18px] font-bold leading-[27px]">{c.price}</strong>
              <span aria-label="Delivery time" className="flex items-center gap-[2px]">
                <Bolt />
                <span className="leading-[19.6px] text-graytext">{c.delivery}</span>
              </span>
            </div>
          </article>
        ))}
        {extra ? <div className="flex items-center text-[14px] leading-[normal] text-footlink">{extra}</div> : null}
      </div>
    </section>
  );
}
