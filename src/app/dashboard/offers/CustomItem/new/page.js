import { connection } from "next/server";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/actions/auth.actions";
import { getItemOfferGames, getSellerMe } from "@/actions/market.actions";
import HeaderBar from "../../../../../components/eldorado/HeaderBar";
import CategoryNav from "../../../../../components/eldorado/CategoryNav";
import DashboardShell from "../../../../../components/eldorado/DashboardShell";
import DashboardPageHeader from "../../../../../components/eldorado/DashboardPageHeader";
import Footer from "../../../../../components/eldorado/Footer";
import ChatBubble from "../../../../../components/eldorado/ChatBubble";
import ItemListingWizard from "../../../../../components/eldorado/ItemListingWizard";
import { ITEM_LISTING_COPY } from "../../../../../components/eldorado/data/listingData";
import { sellBlockers } from "@/lib/listing";

export const instant = false;

export const metadata = {
  title: "آگهی آیتم جدید — شارژینو",
  description: "آگهی فروش آیتم را روی بازی بازارچه بساز.",
};

export default async function NewItemOfferPage() {
  await connection();
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/dashboard/offers/CustomItem/new");

  const [seller, games] = await Promise.all([getSellerMe(), getItemOfferGames()]);
  if (seller.unauthorized) redirect("/login?next=/dashboard/offers/CustomItem/new");

  return (
    <div className="min-h-screen bg-page text-ink">
      <HeaderBar user={user} />
      <CategoryNav />
      <main className="isolate">
        <DashboardShell active="Items" user={user}>
          <DashboardPageHeader
            icon="tag"
            title={ITEM_LISTING_COPY.newOffer}
            action={{ label: ITEM_LISTING_COPY.title, href: "/dashboard/offers/CustomItem", ariaLabel: ITEM_LISTING_COPY.title }}
          />
          <div className="mt-1 max-w-[1048px] px-6 pb-[50px]">
            <ItemListingWizard games={games.ok ? games.items : []} blockers={sellBlockers(seller)} />
          </div>
        </DashboardShell>
      </main>
      <Footer />
      <ChatBubble />
    </div>
  );
}
