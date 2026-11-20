import { connection } from "next/server";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/actions/auth.actions";
import { getItemOfferGames, getSellerMe } from "@/actions/market.actions";
import DashboardPageHeader from "../../../../../components/eldorado/DashboardPageHeader";
import ItemListingWizard from "../../../../../components/eldorado/ItemListingWizard";
import { ITEM_LISTING_COPY } from "../../../../../components/eldorado/data/listingData";
import { listingSellGate, SELL_INTRO_PATH, SELL_VERIFY_PATH } from "@/lib/listing";

export const instant = false;

export const metadata = {
  title: "ثبت آگهی آیتم — شارژینو",
  description: "آگهی فروش آیتم را روی بازی بازارچه بساز.",
};

export default async function NewItemOfferPage() {
  await connection();
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/dashboard/offers/CustomItem/new");

  const [seller, games] = await Promise.all([getSellerMe(), getItemOfferGames()]);
  if (seller.unauthorized) redirect("/login?next=/dashboard/offers/CustomItem/new");

  const gate = listingSellGate(seller);
  if (gate.href === SELL_INTRO_PATH) redirect(gate.href);

  return (
    <>
      <DashboardPageHeader
        icon="tag"
        title={ITEM_LISTING_COPY.newOffer}
        action={{ label: ITEM_LISTING_COPY.title, href: "/dashboard/offers/CustomItem", ariaLabel: ITEM_LISTING_COPY.title }}
      />
      <div className="mt-1 w-full px-6 pb-[50px]">
        <ItemListingWizard
          games={games.ok ? games.items : []}
          blockers={gate.blockers}
          gateHref={gate.href || SELL_VERIFY_PATH}
          gateLabel={gate.label}
        />
      </div>
    </>
  );
}
