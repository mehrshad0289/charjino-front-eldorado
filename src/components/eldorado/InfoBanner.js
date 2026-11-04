/* Blue status banner (role=status) from the dashboard capture:
   bg rgba(71,131,255,.2), border rgba(71,131,255,.4) 0.8px, info icon,
   bold title + 14px body. bodyParts supports italic segments
   ({ italic: "Offline mode" }). Reusable across dashboard sections. */

function InfoIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 11v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="7.8" r="1.1" fill="currentColor" />
    </svg>
  );
}

export default function InfoBanner({ title, bodyParts }) {
  return (
    <div
      role="status"
      className="mb-5 flex gap-3 rounded-lg border-[0.8px] border-[rgba(71,_131,_255,_0.4)]/40 bg-[rgba(71,_131,_255,_0.2)]/20 px-4 py-3"
    >
      <div className="text-[rgb(71,_131,_255)]">
        <InfoIcon />
      </div>
      <div className="flex flex-col gap-2">
        <span className="block font-bold">{title}</span>
        <div className="text-[14px] leading-[19.6px]">
          {bodyParts.map((part, i) =>
            typeof part === "string" ? (
              part
            ) : (
              <em key={i} className="italic">
                {part.italic}
              </em>
            )
          )}
        </div>
      </div>
    </div>
  );
}
