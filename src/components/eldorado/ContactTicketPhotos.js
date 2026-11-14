"use client";

import { listingMediaUrl } from "@/lib/listing";

export default function ContactTicketPhotos({ attachments = [], tone = "light" }) {
  const rows = Array.isArray(attachments) ? attachments.filter((item) => item?.url) : [];
  if (rows.length === 0) return null;
  const frame = tone === "dark" ? "border-white/25 bg-white/10" : "border-cardborder bg-badgebg";
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {rows.map((item, index) => {
        const src = listingMediaUrl(item.url);
        return (
          <a
            key={`${src}-${index}`}
            href={src}
            target="_blank"
            rel="noreferrer"
            className={`block overflow-hidden rounded-lg border ${frame}`}
          >
            <img alt={item.name || "پیوست"} src={src} className="h-24 w-24 object-cover" />
          </a>
        );
      })}
    </div>
  );
}
