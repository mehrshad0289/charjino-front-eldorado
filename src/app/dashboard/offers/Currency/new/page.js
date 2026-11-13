import { connection } from "next/server";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/actions/auth.actions";
import { getCurrencyOfferGames, getSellerMe } from "@/actions/market.actions";
import HeaderBar from "../../../../../components/eldorado/HeaderBar";
import CategoryNav from "../../../../../components/eldorado/CategoryNav";
import DashboardShell from "../../../../../components/eldorado/DashboardShell";
import DashboardPageHeader from "../../../../../components/eldorado/DashboardPageHeader";
import Footer from "../../../../../components/eldorado/Footer";
import ChatBubble from "../../../../../components/eldorado/ChatBubble";
import CurrencyListingWizard from "../../../../../components/eldorado/CurrencyListingWizard";
import { CURRENCY_LISTING_COPY } from "../../../../../components/eldorado/data/listingData";
import { sellBlockers } from "@/lib/listing";

export const instant = false;

export const metadata = {
  title: "آگهی ارز جدید — شارژینو",
  description: "نرخ فروش ارز بازی را روی بازی بازارچه بساز.",
};

export default async function NewCurrencyOfferPage() {
  await connection();
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/dashboard/offers/Currency/new");

  const [seller, games] = await Promise.all([getSellerMe(), getCurrencyOfferGames()]);
  if (seller.unauthorized) redirect("/login?next=/dashboard/offers/Currency/new");

  return (
    <div className="min-h-screen bg-page text-ink">
      <HeaderBar user={user} />
      <CategoryNav />
      <main className="isolate">
        <DashboardShell active="Currency" user={user}>
          <DashboardPageHeader
            icon="tag"
            title={CURRENCY_LISTING_COPY.newOffer}
            action={{ label: CURRENCY_LISTING_COPY.title, href: "/dashboard/offers/Currency", ariaLabel: CURRENCY_LISTING_COPY.title }}
          />
          <div className="mt-1 max-w-[1048px] px-6 pb-[50px]">
            <CurrencyListingWizard games={games.ok ? games.items : []} blockers={sellBlockers(seller)} />
          </div>
        </DashboardShell>
      </main>
      <Footer />
      <ChatBubble />
    </div>
  );
}
