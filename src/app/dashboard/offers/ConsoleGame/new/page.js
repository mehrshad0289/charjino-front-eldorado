import { connection } from "next/server";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/actions/auth.actions";
import { getSellerMe } from "@/actions/market.actions";
import DashboardPageHeader from "../../../../../components/eldorado/DashboardPageHeader";
import ConsoleGameForm from "../../../../../components/eldorado/ConsoleGameForm";
import { GAME_LISTING_COPY } from "../../../../../components/eldorado/data/listingData";
import { sellBlockers } from "@/lib/listing";

export const instant = false;

export const metadata = {
  title: "ثبت آگهی بازی — شارژینو",
};

export default async function NewConsoleGamePage({ searchParams }) {
  await connection();
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/dashboard/offers/ConsoleGame/new");
  const seller = await getSellerMe();
  if (seller.unauthorized) redirect("/login?next=/dashboard/offers/ConsoleGame/new");
  const query = await searchParams;
  const platform = typeof query.platform === "string" ? query.platform : "playstation";

  return (
    <>
      <DashboardPageHeader
        icon="offers"
        title={GAME_LISTING_COPY.newOffer}
        action={{ label: GAME_LISTING_COPY.title, href: "/dashboard/offers/ConsoleGame", ariaLabel: GAME_LISTING_COPY.title }}
      />
      <div className="mt-1 w-full px-6 pb-[50px]">
        <ConsoleGameForm platform={platform} blockers={sellBlockers(seller)} />
      </div>
    </>
  );
}
