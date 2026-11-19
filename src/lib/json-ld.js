import { APP_NAME, APP_NAME_EN, SITE_LOGO, SITE_URL, absoluteUrl } from "./site";
import { SOCIAL } from "./social";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: APP_NAME,
    alternateName: APP_NAME_EN,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl(SITE_LOGO),
    },
    sameAs: [SOCIAL.instagram.href, SOCIAL.telegram.href],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      url: absoluteUrl("/contact-us"),
      availableLanguage: ["Persian", "fa"],
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: APP_NAME,
    inLanguage: "fa-IR",
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

export function breadcrumbJsonLd(items) {
  const list = (Array.isArray(items) ? items : []).filter((item) => item?.name && item?.path);
  if (!list.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: list.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function collectionPageJsonLd({ name, description, path }) {
  if (!name || !path) return null;
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description: description || undefined,
    url: absoluteUrl(path),
    isPartOf: { "@id": `${SITE_URL}/#website` },
    inLanguage: "fa-IR",
  };
}

export function howToJsonLd({ name, steps }) {
  const list = (Array.isArray(steps) ? steps : []).filter((step) => step?.title);
  if (!name || !list.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    inLanguage: "fa-IR",
    step: list.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.title,
      text: step.text || step.title,
    })),
  };
}

export function blogPostJsonLd({
  title,
  description,
  path,
  image,
  datePublished,
  dateModified,
  authorName,
} = {}) {
  if (!title || !path) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: description || undefined,
    url: absoluteUrl(path),
    image: image ? absoluteUrl(image) : undefined,
    datePublished: datePublished || undefined,
    dateModified: dateModified || datePublished || undefined,
    inLanguage: "fa-IR",
    author: {
      "@type": "Organization",
      name: authorName || APP_NAME,
      url: absoluteUrl("/about-us"),
    },
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntityOfPage: absoluteUrl(path),
  };
}

export function faqPageJsonLd(items) {
  const list = (Array.isArray(items) ? items : []).filter((item) => item?.q && item?.a);
  if (!list.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: list.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: Array.isArray(item.a) ? item.a.join(" ") : item.a,
      },
    })),
  };
}

export function faqFromShopItems(items) {
  return (Array.isArray(items) ? items : [])
    .map((item) => {
      const parts = [];
      if (item?.intro) parts.push(item.intro);
      if (Array.isArray(item?.steps)) parts.push(item.steps.join(" "));
      if (Array.isArray(item?.paragraphs)) parts.push(item.paragraphs.join(" "));
      if (item?.a) parts.push(item.a);
      if (item?.after) parts.push(item.after);
      return { q: item?.q || "", a: parts.join(" ").trim() };
    })
    .filter((item) => item.q && item.a && /[\u0600-\u06FF]/.test(item.q));
}

export function listingProductJsonLd({ listing, path, images, kind }) {
  const title = String(listing?.title || "").trim();
  if (!title || !path) return null;
  const description = String(listing?.description || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 300);
  const imageList = (Array.isArray(images) ? images : [])
    .map((image) => (typeof image === "string" ? image : image?.url))
    .filter(Boolean)
    .map((url) => absoluteUrl(url));
  const amount = Number(listing?.price_amount);
  const offer = {
    "@type": "Offer",
    url: absoluteUrl(path),
    priceCurrency: "IRR",
    availability: "https://schema.org/InStock",
    seller: { "@type": "Organization", name: APP_NAME },
  };
  if (Number.isFinite(amount) && amount > 0) {
    offer.price = String(amount);
  }
  if (listing?.offer_type === "ConsoleGame") {
    offer.itemCondition = "https://schema.org/UsedCondition";
  }
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: title,
    description: description || `خرید ${kind || "آگهی"} ${title} از شارژینو.`,
    image: imageList.length ? imageList : undefined,
    brand: {
      "@type": "Brand",
      name: listing?.game_name || APP_NAME_EN,
    },
    offers: offer,
  };
}
