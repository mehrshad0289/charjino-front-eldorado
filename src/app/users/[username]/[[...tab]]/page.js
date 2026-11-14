import { connection } from "next/server";
import { notFound, redirect } from "next/navigation";
import { getSessionUser } from "@/actions/auth.actions";
import UserProfilePage from "../../../../components/eldorado/UserProfilePage";
import { listingToShopCard, loadPublicProfile, loadSellerPublicListings, loadSellerPublicReviews } from "@/lib/store-engine";

export const instant = false;

const TABS = new Set(["shop", "reviews", "about"]);

function decodeSlug(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export async function generateMetadata({ params }) {
  const { username } = await params;
  const profile = await loadPublicProfile(decodeSlug(username));
  if (!profile) return { title: "فروشنده پیدا نشد — شارژینو" };
  return {
    title: `${profile.name} — شارژینو`,
    description: `فروشگاه، نظرات و درباره ${profile.name} در شارژینو.`,
  };
}

export default async function UserProfileRoute({ params, searchParams }) {
  await connection();
  const { username, tab } = await params;
  const query = searchParams ? await searchParams : {};
  const tabName = tab?.[0] || "shop";
  if (tab?.[0] && !TABS.has(tab[0])) notFound();

  const slug = decodeSlug(username);
  const profile = await loadPublicProfile(slug);
  if (!profile) notFound();

  const canonical = profile.slug || profile.id;
  const rest = tab?.[0] ? `/${tab[0]}` : "";
  if (canonical && canonical !== slug) {
    const search = new URLSearchParams();
    if (query.offer) search.set("offer", String(query.offer));
    if (query.game) search.set("game", String(query.game));
    if (query.sentiment) search.set("sentiment", String(query.sentiment));
    const qs = search.toString();
    redirect(`/users/${encodeURIComponent(canonical)}${rest}${qs ? `?${qs}` : ""}`);
  }

  const offer = String(query.offer || "");
  const game = String(query.game || "");
  const sentiment = String(query.sentiment || "");
  const listings =
    tabName === "shop"
      ? (await loadSellerPublicListings(profile.id, { offer, game, perPage: 60 })).items
          .map(listingToShopCard)
          .filter(Boolean)
      : [];
  const reviewFeed =
    tabName === "reviews"
      ? await loadSellerPublicReviews(profile.id, { sentiment, perPage: 20 })
      : { items: [] };
  const user = await getSessionUser();

  return (
    <UserProfilePage
      username={canonical}
      tab={tabName}
      profile={profile}
      listings={listings}
      reviews={reviewFeed.items}
      offer={offer}
      game={game}
      sentiment={sentiment}
      user={user}
    />
  );
}
