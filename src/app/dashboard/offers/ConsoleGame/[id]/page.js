import { connection } from "next/server";
import { notFound, redirect } from "next/navigation";
import { getSessionUser } from "@/actions/auth.actions";
import { getSellerListing, getSellerMe } from "@/actions/market.actions";
import DashboardPageHeader from "../../../../../components/eldorado/DashboardPageHeader";
import ConsoleGameForm from "../../../../../components/eldorado/ConsoleGameForm";
import { GAME_LISTING_COPY, LISTING_COPY } from "../../../../../components/eldorado/data/listingData";
import { formatToman, listingStatusMeta, sellBlockers } from "@/lib/listing";

export const instant = false;

export const metadata = {
  title: "ویرایش آگهی بازی — شارژینو",
};

export default async function ConsoleGameDraftPage({ params }) {
  await connection();
  const { id } = await params;
  const user = await getSessionUser();
  if (!user) redirect(`/login?next=/dashboard/offers/ConsoleGame/${id}`);

  const [seller, listing] = await Promise.all([getSellerMe(), getSellerListing(id)]);
  if (seller.unauthorized || listing.unauthorized) {
    redirect(`/login?next=/dashboard/offers/ConsoleGame/${id}`);
  }
  if (!listing.ok || !listing.data || listing.data.offer_type !== "ConsoleGame") notFound();

  const row = listing.data;
  const editable = row.status === "draft";
  const status = listingStatusMeta(row.status);

  return (
    <>
      <DashboardPageHeader
        icon="offers"
        title={editable ? LISTING_COPY.editOffer : row.title}
        action={{ label: GAME_LISTING_COPY.title, href: "/dashboard/offers/ConsoleGame", ariaLabel: GAME_LISTING_COPY.title }}
      />
      <div className="mt-1 w-full px-6 pb-[50px]">
        {editable ? (
          <ConsoleGameForm listing={row} blockers={sellBlockers(seller)} />
        ) : (
          <div className="rounded-xl bg-white p-6">
            <span className="inline-flex rounded-lg px-3 py-1 text-[13px] font-bold text-white" style={{ backgroundColor: status.bg }}>
              {status.label}
            </span>
            <p className="mt-4 text-[24px] font-bold">{row.title}</p>
            <p className="mt-2 text-graytext">
              {row.game_name} · {formatToman(row.price_amount)} تومان
            </p>
            {row.rejection_reason ? (
              <p className="mt-3 text-[rgb(232,27,22)]">{row.rejection_reason}</p>
            ) : (
              <p className="mt-3 text-[rgb(255,141,0)]">{LISTING_COPY.reviewNote}</p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
