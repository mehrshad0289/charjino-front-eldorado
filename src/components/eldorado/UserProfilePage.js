"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import HeaderBar from "./HeaderBar";
import CategoryNav from "./CategoryNav";
import Footer from "./Footer";
import ChatBubble from "./ChatBubble";
import {
  PROFILE_BANNER,
  PROFILE_SHOP_CHIPS,
  PROFILE_SHOP_EMPTY,
  PROFILE_REVIEW_FILTERS,
  PROFILE_REVIEWS_EMPTY,
  PROFILE_ABOUT,
  PROFILE_TABS,
} from "./data/profileData";
import { FA } from "./data/faCopy";
import { accountInitials } from "@/lib/account-display";
import { listingMediaUrl } from "@/lib/listing";
import { toFaDigits } from "@/lib/fa-digits";
import { formatOrderDate } from "@/lib/order";
import { getPublicSellerListings, getPublicSellerReviews } from "@/actions/market.actions";
import ProfileShopGameFilter from "./ProfileShopGameFilter";
import { CardGridSkeleton, ChatListSkeleton } from "./Skeleton";

const CARD_SHADOW = "shadow-[rgba(9,9,11,0.05)_0px_2px_4px_0px,_rgba(9,9,11,0.02)_0px_12px_8px_0px]";
const PROFILE_TABS_SET = new Set(["shop", "reviews", "about"]);

const stroke = { stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };

const CHIP_ICONS = {
  coin: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8" {...stroke} />
      <path d="M12 8.5v7M9.8 10.2h3.4a1.6 1.6 0 0 1 0 3.2H9.8" {...stroke} />
    </svg>
  ),
  account: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8.5" r="3.5" {...stroke} />
      <path d="M5 19.5c1.2-3.2 3.8-4.8 7-4.8s5.8 1.6 7 4.8" {...stroke} />
    </svg>
  ),
  item: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 8l8-4 8 4v8l-8 4-8-4V8Z" {...stroke} />
      <path d="M4 8l8 4 8-4M12 12v8" {...stroke} />
    </svg>
  ),
  thumbup: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 10.5v9H4.5a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1H7Zm0 0 4-6.5a2 2 0 0 1 2 2v3.5h5.2a1.5 1.5 0 0 1 1.5 1.7l-1 6.5a1.5 1.5 0 0 1-1.5 1.3H7" {...stroke} />
    </svg>
  ),
  thumbdown: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M17 13.5v-9h2.5a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H17Zm0 0-4 6.5a2 2 0 0 1-2-2v-3.5H5.8a1.5 1.5 0 0 1-1.5-1.7l1-6.5A1.5 1.5 0 0 1 6.8 5H17" {...stroke} />
    </svg>
  ),
};

function Chip({ icon, label, count = null, active = false }) {
  return (
    <div className={`flex min-w-[105px] flex-col items-center gap-2 text-[12px] leading-[16.8px] ${active ? "" : "text-[rgb(106,102,123)]"}`}>
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-full ${
          active ? "bg-[rgb(255,201,80)] text-ink" : "bg-white text-[rgb(106,102,123)]"
        }`}
      >
        <div className="h-8 w-8 overflow-hidden">{CHIP_ICONS[icon] ?? CHIP_ICONS.item}</div>
      </div>
      <div className="flex gap-1 text-center text-[14px] font-normal leading-[19.6px]">
        <span className="block text-center">{label}</span>
        {count !== null && <span className="block text-center">({toFaDigits(count)})</span>}
      </div>
    </div>
  );
}

function EmptyState({ title, text }) {
  return (
    <div className="flex justify-center px-[30px] pt-10">
      <div className="flex max-w-[600px] flex-col items-center gap-3">
        <div className="text-center text-[24px] font-bold leading-[36px]">{title}</div>
        {text ? <div className="pt-1 text-center text-[rgb(106,102,123)]">{text}</div> : null}
      </div>
    </div>
  );
}

function profileHref(slug, tab, { offer = "", game = "", sentiment = "" } = {}) {
  const path = `/users/${encodeURIComponent(slug)}/${tab}`;
  const search = new URLSearchParams();
  if (tab === "shop") {
    if (offer) search.set("offer", offer);
    if (game) search.set("game", game);
  } else if (tab === "reviews" && sentiment) {
    search.set("sentiment", sentiment);
  }
  const qs = search.toString();
  return qs ? `${path}?${qs}` : path;
}

function parseProfileLocation(pathname, search) {
  const parts = String(pathname || "").split("/").filter(Boolean);
  const tab = PROFILE_TABS_SET.has(parts[2]) ? parts[2] : "shop";
  const params = new URLSearchParams(search || "");
  return {
    tab,
    offer: params.get("offer") || "",
    game: params.get("game") || "",
    sentiment: params.get("sentiment") || "",
  };
}

function isModifiedClick(event) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
}

function AppLink({ href, className, onNavigate, children, ...props }) {
  return (
    <a
      href={href}
      className={className}
      onClick={(event) => {
        if (isModifiedClick(event)) return;
        event.preventDefault();
        onNavigate();
      }}
      {...props}
    >
      {children}
    </a>
  );
}

function ShopTab({ slug, listings, counts, games, offer, game, loading, onOfferChange, onGameChange }) {
  const total = (counts.Account || 0) + (counts.CustomItem || 0) + (counts.Currency || 0);
  const chips = PROFILE_SHOP_CHIPS.map((chip) => ({
    ...chip,
    count: chip.offer ? counts[chip.offer] || 0 : total,
    active: (offer || "") === (chip.offer || ""),
  }));

  return (
    <>
      <h1 className="mb-6 mt-8 border-b-[0.8px] border-cardborder pb-2 text-[24px] font-bold leading-[28.8px]">فروشگاه</h1>
      <div className="mb-5 flex flex-wrap gap-y-6 border-b-[0.8px] border-cardborder pb-6">
        {chips.map((chip) => (
          <AppLink
            key={chip.id || "all"}
            href={profileHref(slug, "shop", { offer: chip.offer, game })}
            onNavigate={() => onOfferChange(chip.offer || "")}
          >
            <Chip icon={chip.icon} label={chip.label} count={chip.count} active={chip.active} />
          </AppLink>
        ))}
      </div>
      <div className="relative">
        <ProfileShopGameFilter game={game} games={games} onGameChange={onGameChange} disabled={loading} />
        {loading ? (
          <CardGridSkeleton />
        ) : listings.length === 0 ? (
          <EmptyState title={PROFILE_SHOP_EMPTY.title} text={PROFILE_SHOP_EMPTY.text} />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((card) => (
              <Link
                key={card.id}
                href={card.href}
                className={`flex min-h-40 flex-col rounded-lg bg-white px-[14px] pb-[14px] pt-4 ${CARD_SHADOW}`}
              >
                <div className="flex grow items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="line-clamp-2 text-[14px] font-bold leading-[19.6px]">{card.title}</div>
                    <div className="mt-1 truncate text-[13px] text-graytext">{card.gameName}</div>
                  </div>
                  {card.img ? (
                    <img alt="" src={card.img} className="h-[58px] w-[58px] shrink-0 rounded-sm object-cover" />
                  ) : (
                    <span className="block h-[58px] w-[58px] shrink-0 rounded-sm bg-badgebg" />
                  )}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <strong className="text-[16px] font-bold">{card.price}</strong>
                  <span className="text-[13px] text-graytext">{card.delivery}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function ReviewsTab({ slug, reviews, sentiment, ratingAvg, ratingCount, loading, onSentimentChange }) {
  return (
    <>
      <h1 className="mb-6 mt-8 border-b-[0.8px] border-cardborder pb-2 text-[24px] font-bold leading-[28.8px]">نظرات</h1>
      {ratingCount ? (
        <p className="mb-4 text-[14px] text-graytext">
          میانگین {toFaDigits(Number(ratingAvg).toFixed(1))} از {toFaDigits(ratingCount)} نظر واقعی خرید
        </p>
      ) : null}
      <div className="mb-5 flex flex-wrap gap-[10px] border-b-[0.8px] border-cardborder pb-6">
        {PROFILE_REVIEW_FILTERS.map((filter) => {
          const active = (sentiment || "") === (filter.id || "");
          return (
            <AppLink
              key={filter.id || "all"}
              href={profileHref(slug, "reviews", { sentiment: filter.id })}
              onNavigate={() => onSentimentChange(filter.id || "")}
              className={`flex min-h-[38px] items-center gap-2 rounded-lg px-5 text-[14px] font-bold ${
                active ? "bg-[rgb(34,33,39)] text-white" : "border border-cardborder bg-white text-ink"
              }`}
            >
              {filter.label}
              {filter.icon ? <span className="text-current">{CHIP_ICONS[filter.icon]}</span> : null}
            </AppLink>
          );
        })}
      </div>
      {loading ? (
        <ChatListSkeleton rows={4} />
      ) : reviews.length === 0 ? (
        <EmptyState title={PROFILE_REVIEWS_EMPTY.title} text={PROFILE_REVIEWS_EMPTY.text} />
      ) : (
        <div className="flex flex-col gap-3">
          {reviews.map((review, index) => (
            <article key={`${review.at}-${index}`} className={`rounded-lg bg-white px-5 py-4 ${CARD_SHADOW}`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <strong className="text-[14px]">{review.buyer}</strong>
                <span className="text-[13px] text-graytext">
                  {toFaDigits(review.rating)} / ۵ · {formatOrderDate(review.at)}
                </span>
              </div>
              {review.listing_title ? <p className="mt-1 text-[13px] text-graytext">{review.listing_title}</p> : null}
              {review.tag_label ? (
                <p className="mt-2 text-[13px] font-bold text-[rgb(71,131,255)]">{review.tag_label}</p>
              ) : null}
              {review.body ? <p className="mt-2 whitespace-pre-wrap text-[14px] leading-[22px]">{review.body}</p> : null}
            </article>
          ))}
        </div>
      )}
    </>
  );
}

function AboutTab({ profile }) {
  const registered = profile.member_since
    ? new Intl.DateTimeFormat("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
      }).format(new Date(`${profile.member_since}T00:00:00Z`))
    : "";
  return (
    <>
      <h1 className="mb-6 mt-8 border-b-[0.8px] border-cardborder pb-2 text-[24px] font-bold leading-[28.8px]">{PROFILE_ABOUT.title}</h1>
      <div className={`min-h-[153px] max-w-[528px] rounded-sm bg-white ${CARD_SHADOW}`}>
        <div className="px-6 pb-6 pt-4">
          <div className="mb-[10px] text-[14px] font-bold uppercase leading-[19.6px] tracking-[0.42px]">
            {PROFILE_ABOUT.descriptionLabel}
          </div>
          <div className="whitespace-pre-wrap text-[14px] leading-[22px] text-[rgb(106,102,123)]">
            {profile.bio || PROFILE_ABOUT.description}
          </div>
        </div>
        <div className="border-t-[0.8px] border-[rgb(244,244,244)] p-6 text-[14px] leading-[17px] text-[rgb(106,102,123)]">
          {registered ? (
            <>
              <span>{FA.registered}:</span>&nbsp;{registered}
            </>
          ) : null}
          {profile.completed_orders ? (
            <p className="mt-2">
              {toFaDigits(profile.completed_orders)} سفارش تکمیل‌شده
            </p>
          ) : null}
        </div>
      </div>
    </>
  );
}

export default function UserProfilePage({
  username,
  tab,
  profile,
  listings = [],
  reviews = [],
  offer = "",
  game = "",
  sentiment = "",
  user = null,
}) {
  const sellerId = profile.id;
  const [activeTab, setActiveTab] = useState(tab || "shop");
  const [activeOffer, setActiveOffer] = useState(offer || "");
  const [activeGame, setActiveGame] = useState(game || "");
  const [activeSentiment, setActiveSentiment] = useState(sentiment || "");
  const [shopItems, setShopItems] = useState(listings);
  const [reviewItems, setReviewItems] = useState(reviews);
  const [loading, setLoading] = useState(false);
  const shopCache = useRef((tab || "shop") === "shop" ? { [`${offer || ""}|${game || ""}`]: listings } : {});
  const reviewCache = useRef((tab || "shop") === "reviews" ? { [sentiment || ""]: reviews } : {});
  const requestId = useRef(0);
  const avatar = listingMediaUrl(profile.avatar_url);
  const counts = profile.offer_counts || {};

  const syncUrl = useCallback(
    (nextTab, nextOffer, nextGame, nextSentiment) => {
      const url = profileHref(username, nextTab, {
        offer: nextOffer,
        game: nextGame,
        sentiment: nextSentiment,
      });
      const current = `${window.location.pathname}${window.location.search}`;
      if (current !== url) {
        window.history.pushState({ tab: nextTab, offer: nextOffer, game: nextGame, sentiment: nextSentiment }, "", url);
      }
    },
    [username],
  );

  const loadShop = useCallback(
    async (nextOffer, nextGame) => {
      const key = `${nextOffer}|${nextGame}`;
      if (Object.prototype.hasOwnProperty.call(shopCache.current, key)) {
        setShopItems(shopCache.current[key]);
        setLoading(false);
        return;
      }
      const id = ++requestId.current;
      setLoading(true);
      const result = await getPublicSellerListings(sellerId, { offer: nextOffer, game: nextGame });
      if (id !== requestId.current) return;
      const items = result.ok ? result.items : [];
      shopCache.current[key] = items;
      setShopItems(items);
      setLoading(false);
    },
    [sellerId],
  );

  const loadReviews = useCallback(
    async (nextSentiment) => {
      const key = nextSentiment || "";
      if (Object.prototype.hasOwnProperty.call(reviewCache.current, key)) {
        setReviewItems(reviewCache.current[key]);
        setLoading(false);
        return;
      }
      const id = ++requestId.current;
      setLoading(true);
      const result = await getPublicSellerReviews(sellerId, { sentiment: nextSentiment });
      if (id !== requestId.current) return;
      const items = result.ok ? result.items : [];
      reviewCache.current[key] = items;
      setReviewItems(items);
      setLoading(false);
    },
    [sellerId],
  );

  const applyView = useCallback(
    (next, push) => {
      const nextTab = next.tab || "shop";
      const nextOffer = next.offer || "";
      const nextGame = next.game || "";
      const nextSentiment = next.sentiment || "";
      setActiveTab(nextTab);
      setActiveOffer(nextOffer);
      setActiveGame(nextGame);
      setActiveSentiment(nextSentiment);
      if (push) syncUrl(nextTab, nextOffer, nextGame, nextSentiment);
      if (nextTab === "shop") loadShop(nextOffer, nextGame);
      else if (nextTab === "reviews") loadReviews(nextSentiment);
      else {
        requestId.current += 1;
        setLoading(false);
      }
    },
    [loadReviews, loadShop, syncUrl],
  );

  useEffect(() => {
    const onPop = () => {
      applyView(parseProfileLocation(window.location.pathname, window.location.search), false);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [applyView]);

  return (
    <div className="min-h-screen bg-page text-ink">
      <HeaderBar user={user} />
      <CategoryNav />
      <main className="relative z-[1] isolate grow">
        <div className="relative isolate h-[120px]">
          <img
            alt=""
            src={PROFILE_BANNER}
            className="pointer-events-none absolute left-0 top-0 block size-full max-w-full object-cover object-top align-middle"
          />
          <div
            className="absolute z-[1] size-full"
            style={{ backgroundImage: "linear-gradient(rgba(246, 246, 246, 0) 0%, rgb(246, 246, 246) 100%)" }}
          />
        </div>
        <section className="pb-[50px]">
          <div className="relative mx-auto mt-[-80px] w-[1080px] max-w-full px-6">
            <div className={`relative mb-[32px] w-full rounded-sm bg-white ${CARD_SHADOW}`}>
              <div className="px-6 pb-4 pt-[6px]">
                <div className="flex items-center gap-[10px] pe-12 lg:pe-0">
                  <div className="relative flex h-[100px] w-[100px] items-center justify-center">
                    <div className="absolute left-1/2 top-1/2 z-[2] h-[84px] w-[84px] -translate-x-1/2 -translate-y-1/2">
                      <div className="relative overflow-hidden rounded-[50%] bg-badgebg">
                        {avatar ? (
                          <img alt={FA.profileAvatar} src={avatar} className="block h-[84px] w-[84px] object-cover align-middle" />
                        ) : (
                          <span className="grid h-[84px] w-[84px] place-items-center text-[28px] font-bold">
                            {accountInitials({ name: profile.name })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center gap-[7px]">
                    <div className="flex items-center text-[24px] font-bold leading-[28.8px]">{profile.name}</div>
                    {profile.rating_count ? (
                      <div className="text-[14px] text-graytext">
                        {toFaDigits(Number(profile.rating_avg).toFixed(1))} · {toFaDigits(profile.rating_count)} نظر
                      </div>
                    ) : (
                      <div className="text-[14px] text-graytext">تازه‌وارد</div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex border-t-[0.8px] border-cardborder">
                {PROFILE_TABS.map((item) => {
                  const isActive = activeTab === item.tab;
                  return (
                    <AppLink
                      key={item.tab}
                      href={profileHref(username, item.tab, {
                        offer: activeOffer,
                        game: activeGame,
                        sentiment: activeSentiment,
                      })}
                      onNavigate={() =>
                        applyView(
                          {
                            tab: item.tab,
                            offer: activeOffer,
                            game: activeGame,
                            sentiment: activeSentiment,
                          },
                          true,
                        )
                      }
                      aria-current={isActive ? "page" : undefined}
                      className={`block border-b-2 px-[19px] pb-3 pt-4 leading-[19px] ${
                        isActive ? "border-b-[rgb(71,131,255)] text-ink" : "border-b-white text-[rgb(106,102,123)]"
                      }`}
                    >
                      {item.label}
                    </AppLink>
                  );
                })}
              </div>
            </div>
            {activeTab === "shop" && (
              <ShopTab
                slug={username}
                listings={shopItems}
                counts={counts}
                games={Array.isArray(profile.games) ? profile.games : []}
                offer={activeOffer}
                game={activeGame}
                loading={loading}
                onOfferChange={(nextOffer) =>
                  applyView({ tab: "shop", offer: nextOffer, game: activeGame, sentiment: activeSentiment }, true)
                }
                onGameChange={(nextGame) =>
                  applyView({ tab: "shop", offer: activeOffer, game: nextGame, sentiment: activeSentiment }, true)
                }
              />
            )}
            {activeTab === "reviews" && (
              <ReviewsTab
                slug={username}
                reviews={reviewItems}
                sentiment={activeSentiment}
                ratingAvg={profile.rating_avg}
                ratingCount={profile.rating_count}
                loading={loading}
                onSentimentChange={(nextSentiment) =>
                  applyView({ tab: "reviews", offer: activeOffer, game: activeGame, sentiment: nextSentiment }, true)
                }
              />
            )}
            {activeTab === "about" && <AboutTab profile={profile} />}
          </div>
        </section>
      </main>
      <Footer />
      <ChatBubble />
    </div>
  );
}
