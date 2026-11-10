function VerifiedBadge() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-metaicon">
      <path
        d="M12 1.5 14.8 4l3.7-.4 1 3.6 3.2 1.9-1.5 3.4 1.5 3.4-3.2 1.9-1 3.6-3.7-.4L12 22.5 9.2 20l-3.7.4-1-3.6-3.2-1.9L2.8 11.5 1.3 8.1l3.2-1.9 1-3.6L9.2 4 12 1.5Z"
        fill="currentColor"
      />
      <path d="m8.5 11.8 2.3 2.3 4.7-4.7" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DeliveryIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M13 2 4.5 13.5H11L9.5 22 19 10h-6.5L13 2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

/* One offer card (shop_account.make reference): bold title, description + 58px
   art, seller row with verified badge + rating, price + delivery time row. */
export default function AccountCard({ offer }) {
  return (
    <a
      href={offer.href}
      className="block h-48 overflow-hidden rounded-lg bg-white text-[14px] leading-[21px] shadow-[rgba(9,9,11,0.05)_0px_2px_4px_0px,rgba(9,9,11,0.02)_0px_12px_8px_0px] transition-shadow hover:shadow-[rgba(9,9,11,0.10)_0px_4px_8px_0px,rgba(9,9,11,0.06)_0px_16px_16px_0px]"
    >
      <section className="flex h-full flex-col p-[14px]">
        <div className="mb-4 flex items-center gap-2.5 truncate">
          <div className="max-h-[19.6px] overflow-hidden leading-[19.6px]">
            <div className="flex flex-wrap content-start gap-1 font-bold">
              <span className="block">{offer.title}</span>
            </div>
          </div>
        </div>
        <div className="flex grow items-start justify-between">
          <div className="flex flex-col gap-2">
            <div className="line-clamp-2 overflow-hidden text-[14px] leading-[19.6px] text-graytext">
              {offer.desc}
            </div>
          </div>
          <div className="ms-3 h-[58px] w-[58px] min-w-[58px] shrink-0 overflow-hidden">
            {offer.img ? (
              <img
                alt={offer.title}
                src={offer.img}
                className="block h-[58px] w-[58px] rounded-sm object-cover align-middle"
                loading="lazy"
              />
            ) : (
              <span className="block h-[58px] w-[58px] rounded-sm bg-badgebg" />
            )}
          </div>
        </div>
        <div className="flex justify-between gap-1 text-[14px] leading-[14px]">
          <div className="flex items-center gap-0.5 overflow-hidden text-graytext">
            <strong className="block truncate font-bold">{offer.seller}</strong>
            <VerifiedBadge />
          </div>
          {offer.rating && <div>{offer.rating.replace(/\s{2,}/g, " ")}</div>}
        </div>
        <div className="mt-2.5 flex items-center justify-between">
          <div>
            <strong aria-label="amount-price" className="text-[18px] font-bold leading-[27px]">
              {offer.price}
            </strong>
          </div>
          <div aria-label="Delivery time" className="flex items-center gap-1 text-graytext">
            <DeliveryIcon />
            <div className="text-[14px] leading-[19.6px]">{offer.delivery}</div>
          </div>
        </div>
      </section>
    </a>
  );
}
