import { connection } from "next/server";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/actions/auth.actions";
import { getMarketGames, getSellerMe } from "@/actions/market.actions";
import DashboardPageHeader from "../../../../../components/eldorado/DashboardPageHeader";
import ListingWizard from "../../../../../components/eldorado/ListingWizard";
import { LISTING_COPY } from "../../../../../components/eldorado/data/listingData";
import { listingSellGate, SELL_INTRO_PATH, SELL_VERIFY_PATH } from "@/lib/listing";

export const instant = false;

export const metadata = {
  title: "ثبت آگهی اکانت — شارژینو",
  description: "آگهی فروش اکانت را بساز و برای بررسی بفرست.",
};

export default async function NewAccountOfferPage() {
  await connection();
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/dashboard/offers/Account/new");

  const [seller, games] = await Promise.all([getSellerMe(), getMarketGames()]);
  if (seller.unauthorized) redirect("/login?next=/dashboard/offers/Account/new");

  const gate = listingSellGate(seller);
  if (gate.href === SELL_INTRO_PATH) redirect(gate.href);

  return (
    <>
      <DashboardPageHeader
        icon="tag"
        title={LISTING_COPY.newOffer}
        action={{ label: LISTING_COPY.title, href: "/dashboard/offers/Account", ariaLabel: LISTING_COPY.title }}
      />
      <div className="mt-1 w-full px-6 pb-[50px]">
        <ListingWizard
          games={games.ok ? games.items : []}
          blockers={gate.blockers}
          gateHref={gate.href || SELL_VERIFY_PATH}
          gateLabel={gate.label}
        />
      </div>
    </>
  );
}
