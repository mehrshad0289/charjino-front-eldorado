"use client";

import { usePathname } from "next/navigation";
import HeaderBar from "./HeaderBar";

function hideShopHeader(pathname) {
  if (!pathname) return false;
  if (pathname === "/login" || pathname.startsWith("/login/")) return true;
  if (pathname === "/checkout" || pathname.startsWith("/checkout/")) return true;
  if (pathname === "/blog" || pathname.startsWith("/blog/")) return true;
  return false;
}

/* Sibling of the page slot (not a wrapper) so Cache Components Activity
   does not hide/remount the header or re-run its session effect on
   dashboard switches. */
export default function ShopChrome() {
  const pathname = usePathname();
  if (hideShopHeader(pathname)) return null;
  return <HeaderBar />;
}
