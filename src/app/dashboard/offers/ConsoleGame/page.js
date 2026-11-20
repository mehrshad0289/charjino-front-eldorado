import { connection } from "next/server";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/actions/auth.actions";
import { getSellerListings, getSellerMe } from "@/actions/market.actions";
import DashboardPageHeader from "../../../../components/eldorado/DashboardPageHeader";
import InfoBanner from "../../../../components/eldorado/InfoBanner";
import EmptyState from "../../../../components/eldorado/EmptyState";
import SellerListingsTable from "../../../../components/eldorado/SellerListingsTable";
import { DASHBOARD_OFFERS_PAGE } from "../../../../components/eldorado/data/dashboardData";
import { GAME_LISTING_COPY } from "../../../../components/eldorado/data/listingData";
import { listingSellGate } from "@/lib/listing";

export const instant = false;

export const metadata = {
  title: "آگهی بازی — شارژینو",
  description: "دیسک، کارتریج، اکانت و راک کنسول.",
};

export default async function DashboardConsoleGamesPage() {
  await connection();
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/dashboard/offers/ConsoleGame");
  const [seller, listings] = await Promise.all([getSellerMe(), getSellerListings("ConsoleGame")]);
  if (seller.unauthorized || listings.unauthorized) redirect("/login?next=/dashboard/offers/ConsoleGame");
  const gate = listingSellGate(seller);
  const blockers = gate.blockers;
  const items = listings.ok ? listings.items : [];

  return (
    <>
      <DashboardPageHeader
        icon="offers"
        title="بازی"
        action={{ label: GAME_LISTING_COPY.newOffer, href: "/dashboard/offers/ConsoleGame/new", ariaLabel: GAME_LISTING_COPY.newOffer }}
      />
      <div className="mt-1 w-full px-6 pb-[50px]">
        <InfoBanner
          title="بررسی ادمین"
          bodyParts={["آگهی بعد از تأیید ادمین در صفحهٔ همان پلتفرم دیده می‌شود. بازی تازه هم باید در فهرست بازی‌ها تأیید شود."]}
        />
        {blockers.length ? (
          <div className="mb-5 rounded-xl bg-white p-5">
            {blockers.map((line) => (
              <p key={line} className="text-[14px] text-[rgb(232,27,22)]">{line}</p>
            ))}
            <a href={gate.href} className="mt-4 inline-flex min-h-[42px] items-center rounded-lg bg-ink px-4 text-[14px] font-bold text-white">
              {gate.label}
            </a>
          </div>
        ) : null}
        {!listings.ok ? (
          <p className="text-[14px] text-[rgb(232,27,22)]">{listings.message || "آگهی‌ها خوانده نشد."}</p>
        ) : items.length === 0 ? (
          <EmptyState
            image={DASHBOARD_OFFERS_PAGE.emptyState.image}
            imageAlt="بدون آگهی"
            title="هنوز آگهی بازی نداری"
            text="دیسک، کارتریج، اکانت یا راک را برای بررسی بفرست."
          />
        ) : (
          <SellerListingsTable items={items} editBase="/dashboard/offers/ConsoleGame" />
        )}
      </div>
    </>
  );
}
