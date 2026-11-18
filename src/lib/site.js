export const APP_NAME = "شارژینو";
export const APP_NAME_EN = "Charjino";
export const SITE_URL = "https://charjino.ir";
export const SITE_OG_LOCALE = "fa_IR";
export const SITE_LOGO = "/image/brand/logo-fa-light.png";
export const SITE_LOGO_DARK = "/image/brand/logo-fa-dark.png";
export const THEME_COLOR = "#0e0e11";
export const GOOGLE_SITE_VERIFICATION = "uX3nnsobE4TzG4igrx4I-3ykDvqe26qdyKdyyJ53LbE";
export const DEFAULT_DESCRIPTION = "خرید گیفت کارت، شارژ بازی و اکانت با پرداخت ریالی.";
export const OG_IMAGE = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  alt: "شارژینو",
};
export const TWITTER_IMAGE = "/twitter-image.png";

export function absoluteUrl(path = "/") {
  if (!path) return SITE_URL;
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
