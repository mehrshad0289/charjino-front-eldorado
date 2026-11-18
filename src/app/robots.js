import { headers } from "next/headers";
import { isIndexableSeoHost, seoHostFromRequest } from "@/lib/seo-host";
import { SITE_URL } from "@/lib/site";

export default async function robots() {
  const headerStore = await headers();
  const host = seoHostFromRequest({ headers: headerStore });
  if (!isIndexableSeoHost(host)) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: ["/_next/image", "/_next/static", "/"],
      disallow: [
        "/login",
        "/dashboard",
        "/checkout",
        "/orders",
        "/payments",
        "/verify",
        "/sell",
        "/pagelist",
        "/sitemaps",
        "/api/",
        "/*?*q=",
        "/*?*page=",
        "/*?*sort=",
        "/*?*min=",
        "/*?*max=",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: "charjino.ir",
  };
}
