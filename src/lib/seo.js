import {
  APP_NAME,
  DEFAULT_DESCRIPTION,
  GOOGLE_SITE_VERIFICATION,
  OG_IMAGE,
  SITE_OG_LOCALE,
  SITE_URL,
  THEME_COLOR,
  TWITTER_IMAGE,
  absoluteUrl,
} from "./site";

export const SHOP_KIND_FA = {
  accounts: "اکانت",
  items: "آیتم",
  currency: "ارز",
  games: "بازی",
  boosting: "بوست",
  "gift-cards": "گیفت کارت",
  "top-ups": "شارژ بازی",
};

export const rootViewport = {
  themeColor: THEME_COLOR,
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

const ICON_PNG = [
  { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
  { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
  { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
  { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
];

function noIndexRobots() {
  return {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  };
}

function indexRobots() {
  return {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  };
}

export function buildMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  image,
  noIndex = false,
} = {}) {
  const canonical = absoluteUrl(path);
  const pageTitle = title || APP_NAME;
  const ogImage = image
    ? [{ url: absoluteUrl(image), alt: pageTitle }]
    : [{ url: OG_IMAGE.url, width: OG_IMAGE.width, height: OG_IMAGE.height, alt: OG_IMAGE.alt }];

  return {
    metadataBase: new URL(SITE_URL),
    title: pageTitle,
    description,
    applicationName: APP_NAME,
    alternates: { canonical },
    robots: noIndex ? noIndexRobots() : indexRobots(),
    openGraph: {
      type: "website",
      locale: SITE_OG_LOCALE,
      url: canonical,
      siteName: APP_NAME,
      title: pageTitle,
      description,
      images: ogImage,
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: image ? [absoluteUrl(image)] : [TWITTER_IMAGE],
    },
  };
}

export function rootMetadata() {
  return {
    ...buildMetadata({
      title: `${APP_NAME} | خرید گیفت کارت، شارژ بازی و اکانت`,
      description: DEFAULT_DESCRIPTION,
      path: "/",
    }),
    metadataBase: new URL(SITE_URL),
    icons: {
      icon: ICON_PNG,
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
      shortcut: "/favicon.ico",
    },
    manifest: "/site.webmanifest",
    verification: { google: GOOGLE_SITE_VERIFICATION },
    formatDetection: { telephone: false, email: false, address: false },
    appleWebApp: {
      capable: true,
      title: APP_NAME,
      statusBarStyle: "black-translucent",
    },
  };
}

export function noIndexMetadata({ title, description } = {}) {
  return buildMetadata({
    title: title || APP_NAME,
    description: description || DEFAULT_DESCRIPTION,
    noIndex: true,
  });
}
