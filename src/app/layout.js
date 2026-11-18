import { Suspense } from "react";
import { Lato } from "next/font/google";
import ShopChrome from "../components/eldorado/ShopChrome";
import "./globals.css";
import JsonLd from "../components/seo/json-ld";
import { GoogleAnalytics } from "../components/seo/google-analytics";
import { HotjarAnalytics } from "../components/seo/hotjar";
import { organizationJsonLd, websiteJsonLd } from "../lib/json-ld";
import { rootMetadata, rootViewport } from "../lib/seo";

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
});

export const viewport = rootViewport;
export const metadata = rootMetadata();

export default function RootLayout({ children }) {
  return (
    /* next/font variable on <html> (not body): Tailwind v4 resolves the
       @theme --font-sans value at :root, so --font-lato must exist there —
       on body it resolved empty and every page silently fell back to the
       system font stack (found via the /blog session-12 font trace). */
    <html lang="fa" dir="rtl" className={`${lato.variable} light-theme`} suppressHydrationWarning>
      <head>
        <link rel="preload" href="/fonts/YekanBakh-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/YekanBakh-Medium.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/YekanBakh-Bold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-page font-sans text-ink antialiased" suppressHydrationWarning>
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
        <Suspense fallback={null}>
          <ShopChrome />
        </Suspense>
        {children}
        <GoogleAnalytics />
        <HotjarAnalytics />
      </body>
    </html>
  );
}
