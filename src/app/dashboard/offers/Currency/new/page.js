import { connection } from "next/server";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/actions/auth.actions";
import { getCurrencyOfferGames, getSellerMe } from "@/actions/market.actions";
import DashboardPageHeader from "../../../../../components/eldorado/DashboardPageHeader";
import CurrencyListingWizard from "../../../../../components/eldorado/CurrencyListingWizard";
import { CURRENCY_LISTING_COPY } from "../../../../../components/eldorado/data/listingData";
import { sellBlockers } from "@/lib/listing";

export const instant = false;

export const metadata = {
  title: "ثبت آگهی ارز — شارژینو",
  description: "نرخ فروش ارز بازی را روی بازی بازارچه بساز.",
};

export default async function NewCurrencyOfferPage() {
  await connection();
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/dashboard/offers/Currency/new");

  const [seller, games] = await Promise.all([getSellerMe(), getCurrencyOfferGames()]);
  if (seller.unauthorized) redirect("/login?next=/dashboard/offers/Currency/new");

  return (
    <>
      <DashboardPageHeader
        icon="tag"
        title={CURRENCY_LISTING_COPY.newOffer}
        action={{ label: CURRENCY_LISTING_COPY.title, href: "/dashboard/offers/Currency", ariaLabel: CURRENCY_LISTING_COPY.title }}
      />
      <div className="mt-1 w-full px-6 pb-[50px]">
        <CurrencyListingWizard games={games.ok ? games.items : []} blockers={sellBlockers(seller)} />
      </div>
    </>
  );
}
