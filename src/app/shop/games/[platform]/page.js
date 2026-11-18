import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import CategoryNav from "../../../../components/eldorado/CategoryNav";
import Footer from "../../../../components/eldorado/Footer";
import ChatBubble from "../../../../components/eldorado/ChatBubble";
import AccountOffersBrowser from "../../../../components/eldorado/AccountOffersBrowser";
import GiftCardBanner from "../../../../components/eldorado/GiftCardBanner";
import { GIFT_CARD_IMAGES } from "../../../../components/eldorado/data/giftCardData";
import { getConsoles, getConsoleSchema } from "../../../../actions/market.actions";
import {
  consoleOfferFacets,
  consolePlatform,
  consoleShopKey,
  defaultConsoleSchemaFields,
  labelConsoleOffer,
  schemaConsoleFacets,
} from "../../../../lib/console-games";
import { activeHubTabKey, bannerTabsFromHub, loadProductHub, withFallbackHubTab } from "../../../../lib/gift-card-shop";
import { serverFetch, ApiError } from "../../../../lib/server-fetcher";
import { apiPaths } from "../../../../lib/api-paths";
import { formatTomanPrice, productHref } from "../../../../lib/format-toman";
import { preferFaTitle } from "../../../../lib/catalog-region";
import { listingToOffer, loadPlatformListings } from "../../../../lib/store-engine";
import { buildMetadata } from "@/lib/seo";

export const instant = false;

export async function generateMetadata({ params }) {
  const { platform } = await params;
  const key = consoleShopKey(platform);
  const row = consolePlatform(key);
  return buildMetadata({
    title: row ? `${row.title} — بازی — شارژینو` : "بازی — شارژینو",
    description: row?.text || "خرید بازی کنسول از آگهی‌های شارژینو.",
    path: `/shop/games/${key || String(platform || "")}`,
  });
}

export default async function ConsolePlatformPage({ params, searchParams }) {
  const { platform } = await params;
  const query = await searchParams;
  const requested = String(platform || "").toLowerCase();
  const hubKey = consoleShopKey(requested);
  if (!hubKey) notFound();
  if (hubKey !== requested) redirect(`/shop/games/${hubKey}`);

  const row = consolePlatform(hubKey);
  if (!row) notFound();
  const [catalog, schema] = await Promise.all([getConsoles(), getConsoleSchema(hubKey)]);
  const apiRow = catalog.ok ? catalog.items.find((item) => item.platform === hubKey) : null;
  const sell = apiRow ? Boolean(apiRow.sell_enabled) : Boolean(row.sell);
  const titleFa = apiRow?.title_fa || row.title;
  const hub = await loadProductHub(hubKey);
  const tabs = withFallbackHubTab(
    bannerTabsFromHub(hub).filter((tab) =>
      ["games", "gift-cards", "subscription", "game-pass", "instant-use"].includes(tab.key),
    ),
    { key: "games", label: "بازی", href: `/shop/games/${hubKey}` },
  );
  const href = `/shop/games/${hubKey}`;
  const q = typeof query.q === "string" ? query.q.trim() : "";
  const listings = sell ? await loadPlatformListings({ platform: hubKey, offer: "ConsoleGame", q, perPage: 60 }) : { items: [] };
  const offers = listings.items
    .map((item) => listingToOffer(item, "games"))
    .filter(Boolean)
    .map(labelConsoleOffer);
  const schemaFields = schema.ok && schema.fields?.length ? schema.fields : defaultConsoleSchemaFields(hubKey);
  const facets = schemaFields.length ? schemaConsoleFacets(schemaFields, offers) : consoleOfferFacets(hubKey, offers);

  let keys = [];
  if (!sell && q) {
    try {
      const payload = await serverFetch(
        apiPaths.catalogProducts({
          category: "game-keys",
          platform: "pc",
          q,
          page: 1,
          perPage: 48,
        }),
      );
      keys = (Array.isArray(payload?.items) ? payload.items : [])
        .map((item) => ({
          handle: item.handle,
          name: preferFaTitle(item) || item.title,
          price: formatTomanPrice(item.minPrice),
          img: item.thumbnail || "",
        }))
        .filter((item) => item.handle && item.name);
    } catch (error) {
      if (!(error instanceof ApiError)) throw error;
    }
  }

  return (
    <div className="min-h-screen bg-page text-ink">
      <CategoryNav activeCategory="Games" />
      <main className="relative">
        <div className="absolute inset-x-0 top-0 z-0 hidden h-[465px] overflow-hidden md:block" aria-hidden="true">
          <img alt="" src={GIFT_CARD_IMAGES.heroBackdrop} className="block h-[465px] w-full object-cover" style={{ objectPosition: "50% 15%" }} />
          <div className="absolute inset-x-0 bottom-0 z-[2] h-[340px] bg-gradient-to-b from-transparent to-page" />
        </div>
        <div className="relative z-10">
          <GiftCardBanner
            active={activeHubTabKey(tabs, href, "games")}
            iconAlt={titleFa}
            gameName={titleFa}
            gameIcon={row.image || ""}
            tabs={tabs}
          />
          {sell ? (
            <AccountOffersBrowser
              offers={offers}
              facets={facets}
              searchPlaceholder="جستجوی بازی"
              countLabel="آگهی"
              foundSuffix=""
            />
          ) : (
            <div className="mx-auto w-full max-w-[1208px] px-4 py-8 md:px-6">
              <p className="max-w-[640px] text-[15px] leading-7 text-graytext">{row.text}</p>
              {row.services?.length ? (
                <ul className="mt-4 flex flex-col gap-2">
                  {row.services.map((service) => (
                    <li key={service.href + service.title}>
                      <Link href={service.href} className="text-[15px] font-bold text-linkblue">
                        {service.title}
                      </Link>
                      <span className="ms-2 text-[14px] text-graytext">{service.text}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
              <form className="mt-6 flex flex-wrap gap-2" action={href}>
                <input
                  name="q"
                  defaultValue={q}
                  placeholder="اسم بازی"
                  aria-label="اسم بازی"
                  className="h-[42px] w-full max-w-[360px] rounded-lg bg-white px-3 text-[14px]"
                />
                <button type="submit" className="h-[42px] rounded-lg bg-brand px-4 text-[14px] font-bold text-ink">
                  جستجو
                </button>
              </form>
              {q ? (
                <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {keys.map((item) => (
                    <li key={item.handle}>
                      <Link href={productHref(item.handle)} className="flex items-center gap-3 rounded-xl bg-white p-3">
                        {item.img ? (
                          <img src={item.img} alt="" className="h-14 w-14 shrink-0 rounded-lg object-cover" />
                        ) : (
                          <span className="h-14 w-14 shrink-0 rounded-lg bg-badgebg" />
                        )}
                        <span className="min-w-0">
                          <span className="block truncate font-bold" dir="auto">{item.name}</span>
                          {item.price ? <span className="mt-1 block text-[14px] text-graytext">{item.price}</span> : null}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <ChatBubble />
    </div>
  );
}
