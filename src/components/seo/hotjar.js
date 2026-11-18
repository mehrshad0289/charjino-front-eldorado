"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { isHotjarAllowedPath } from "@/lib/hotjar";

const TAG_ID_PATTERN = /^[a-f0-9]{13}$/i;

function contentsquareTagId() {
  const raw = process.env.NEXT_PUBLIC_CONTENTSQUARE_TAG_ID?.trim();
  if (!raw || !TAG_ID_PATTERN.test(raw)) return null;
  return raw.toLowerCase();
}

export function HotjarAnalytics() {
  const pathname = usePathname() ?? "/";
  const tagId = contentsquareTagId();

  if (process.env.NODE_ENV !== "production" || !tagId) {
    return null;
  }

  if (!isHotjarAllowedPath(pathname)) {
    return null;
  }

  return <Script id="contentsquare-uxa" src={`https://t.contentsquare.net/uxa/${tagId}.js`} strategy="lazyOnload" />;
}
