import { connection } from "next/server";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/actions/auth.actions";
import { getMarketGames, getSellerMe } from "@/actions/market.actions";
import HeaderBar from "../../../../../components/eldorado/HeaderBar";
import CategoryNav from "../../../../../components/eldorado/CategoryNav";
import DashboardShell from "../../../../../components/eldorado/DashboardShell";
import DashboardPageHeader from "../../../../../components/eldorado/DashboardPageHeader";
import Footer from "../../../../../components/eldorado/Footer";
import ChatBubble from "../../../../../components/eldorado/ChatBubble";
import ListingWizard from "../../../../../components/eldorado/ListingWizard";
import { LISTING_COPY } from "../../../../../components/eldorado/data/listingData";
import { sellBlockers } from "@/lib/listing";

export const instant = false;

export const metadata = {
  title: "آگهی جدید — شارژینو",
  description: "آگهی فروش اکانت را بساز و برای بررسی بفرست.",
};

export default async function NewAccountOfferPage() {
  await connection();
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/dashboard/offers/Account/new");

  const [seller, games] = await Promise.all([getSellerMe(), getMarketGames()]);
  if (seller.unauthorized) redirect("/login?next=/dashboard/offers/Account/new");

  return (
    <div className="min-h-screen bg-page text-ink">
      <HeaderBar user={user} />
      <CategoryNav />
      <main className="isolate">
        <DashboardShell active="Accounts" user={user}>
          <DashboardPageHeader
            icon="tag"
            title={LISTING_COPY.newOffer}
            action={{ label: LISTING_COPY.title, href: "/dashboard/offers/Account", ariaLabel: LISTING_COPY.title }}
          />
          <div className="mt-1 max-w-[1048px] px-6 pb-[50px]">
            <ListingWizard games={games.ok ? games.items : []} blockers={sellBlockers(seller)} />
          </div>
        </DashboardShell>
      </main>
      <Footer />
      <ChatBubble />
    </div>
  );
}
