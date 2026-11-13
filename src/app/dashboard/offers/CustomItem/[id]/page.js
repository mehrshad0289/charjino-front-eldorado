import { connection } from "next/server";
import { notFound, redirect } from "next/navigation";
import { getSessionUser } from "@/actions/auth.actions";
import { getItemOfferGames, getSellerListing, getSellerMe } from "@/actions/market.actions";
import HeaderBar from "../../../../../components/eldorado/HeaderBar";
import CategoryNav from "../../../../../components/eldorado/CategoryNav";
import DashboardShell from "../../../../../components/eldorado/DashboardShell";
import DashboardPageHeader from "../../../../../components/eldorado/DashboardPageHeader";
import Footer from "../../../../../components/eldorado/Footer";
import ChatBubble from "../../../../../components/eldorado/ChatBubble";
import ItemListingWizard from "../../../../../components/eldorado/ItemListingWizard";
import { ITEM_LISTING_COPY, LISTING_COPY } from "../../../../../components/eldorado/data/listingData";
import { formatToman, listingStatusMeta, sellBlockers } from "@/lib/listing";

export const instant = false;

export const metadata = {
  title: "ویرایش آگهی آیتم — شارژینو",
};

export default async function EditItemOfferPage({ params }) {
  await connection();
  const user = await getSessionUser();
  const { id } = await params;
  if (!user) redirect(`/login?next=/dashboard/offers/CustomItem/${id}`);

  const [seller, games, listing] = await Promise.all([getSellerMe(), getItemOfferGames(), getSellerListing(id)]);
  if (seller.unauthorized || listing.unauthorized) {
    redirect(`/login?next=/dashboard/offers/CustomItem/${id}`);
  }
  if (!listing.ok || !listing.data || listing.data.offer_type !== "CustomItem") notFound();

  const row = listing.data;
  const editable = row.status === "draft";
  const status = listingStatusMeta(row.status);

  return (
    <div className="min-h-screen bg-page text-ink">
      <HeaderBar user={user} />
      <CategoryNav />
      <main className="isolate">
        <DashboardShell active="Items" user={user}>
          <DashboardPageHeader
            icon="tag"
            title={editable ? LISTING_COPY.editOffer : row.title}
            action={{ label: ITEM_LISTING_COPY.title, href: "/dashboard/offers/CustomItem", ariaLabel: ITEM_LISTING_COPY.title }}
          />
          <div className="mt-1 max-w-[1048px] px-6 pb-[50px]">
            {editable ? (
              <ItemListingWizard games={games.ok ? games.items : []} listing={row} blockers={sellBlockers(seller)} />
            ) : (
              <div className="rounded-xl bg-white p-6">
                <span className="inline-flex rounded-lg px-3 py-1 text-[13px] font-bold text-white" style={{ backgroundColor: status.bg }}>
                  {status.label}
                </span>
                <p className="mt-4 text-[24px] font-bold">{row.title}</p>
                <p className="mt-2 text-graytext">
                  {row.game_name} · {formatToman(row.price_amount)} تومان
                  {row.stock ? ` · موجودی ${row.stock}` : ""}
                </p>
                {row.rejection_reason ? <p className="mt-3 text-[rgb(232,27,22)]">{row.rejection_reason}</p> : <p className="mt-3 text-[rgb(255,141,0)]">{LISTING_COPY.reviewNote}</p>}
              </div>
            )}
          </div>
        </DashboardShell>
      </main>
      <Footer />
      <ChatBubble />
    </div>
  );
}
