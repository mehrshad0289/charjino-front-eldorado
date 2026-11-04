/* Shared reassurance-row icons + row layout, extracted from
   GiftCardOfferCard so both the gift card sidebar and the game pass
   featured-offer card render identical rows (blue icon + bold label +
   gray note, capture pattern). */

export function ShieldIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3 5 5.8v5.4c0 4.3 2.9 7.4 7 8.8 4.1-1.4 7-4.5 7-8.8V5.8L12 3Z"
        stroke="#4783ff"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="m9 11.8 2.1 2.1 4-4.2" stroke="#4783ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BoltIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M13.5 3 6 13.5h4.5L10 21l7.5-10.5H13L13.5 3Z" fill="#4783ff" />
    </svg>
  );
}

export function SupportIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12a7 7 0 0 1 14 0"
        stroke="#4783ff"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <rect x="3.5" y="12" width="3.4" height="6" rx="1.7" fill="#4783ff" />
      <rect x="17.1" y="12" width="3.4" height="6" rx="1.7" fill="#4783ff" />
      <path d="M19 18a4 4 0 0 1-4 2.6" stroke="#4783ff" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function TrustRow({ icon, label, note, children }) {
  return (
    <div className="flex gap-2 text-[14px] leading-[21px]">
      <div className="shrink-0 text-[#4783ff]">{icon}</div>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <div className="font-bold">{label}</div>
        {children}
        {note && <div className="text-graytext">{note}</div>}
      </div>
    </div>
  );
}
