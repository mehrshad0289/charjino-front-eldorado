import Script from "next/script";
import { Suspense } from "react";
import { GaPrivacy } from "./ga-privacy";
import { GA_PRIVACY_BOOT } from "@/lib/ga-privacy-boot";

const GA_ID_PATTERN = /^G-[A-Z0-9]+$/;
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export function measurementId() {
  const id = typeof GA_ID === "string" ? GA_ID.trim() : "";
  return GA_ID_PATTERN.test(id) ? id : null;
}

export function GoogleAnalytics() {
  const gaId = measurementId();
  if (!gaId) return null;

  return (
    <>
      <Script id="charjino-ga-privacy" strategy="afterInteractive">
        {GA_PRIVACY_BOOT}
      </Script>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script id="charjino-ga" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}',{anonymize_ip:true});`}
      </Script>
      <Suspense fallback={null}>
        <GaPrivacy />
      </Suspense>
    </>
  );
}
