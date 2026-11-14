import { connection } from "next/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionUser } from "@/actions/auth.actions";
import { getSellerListing } from "@/actions/market.actions";
import DashboardPageHeader from "../../../../../components/eldorado/DashboardPageHeader";
import { consoleFormatLabel, consoleModelLabel } from "../../../../../lib/console-games";
import { formatToman, listingStatusMeta } from "../../../../../lib/listing";

export const instant = false;

export default async function ConsoleGameDraftPage({ params }) {
  await connection();
  const { id } = await params;
  const user = await getSessionUser();
  if (!user) redirect(`/login?next=/dashboard/offers/ConsoleGame/${id}`);
  const listing = await getSellerListing(id);
  if (listing.unauthorized) redirect(`/login?next=/dashboard/offers/ConsoleGame/${id}`);
  const row = listing.ok ? listing.data : null;
  if (!row || row.offer_type !== "ConsoleGame") redirect("/dashboard/offers/ConsoleGame");
  const status = listingStatusMeta(row.status);
  const attrs = row.attributes || {};

  return (
    <>
      <DashboardPageHeader
        icon="offers"
        title={row.title || "آگهی بازی"}
        action={{ label: "آگهی‌ها", href: "/dashboard/offers/ConsoleGame", ariaLabel: "آگهی‌ها" }}
      />
      <div className="mt-1 w-full max-w-[720px] px-6 pb-[50px]">
        <div className="rounded-xl bg-white p-6">
          <p className="text-[14px] font-bold" style={{ color: status.bg }}>{status.label}</p>
          <p className="mt-3 text-[15px]">{row.game_name}</p>
          <p className="mt-1 text-[14px] text-graytext">
            {consoleFormatLabel(attrs.format)} · {consoleModelLabel(attrs.console_model)}
          </p>
          <p className="mt-3 text-[18px] font-bold">{formatToman(row.price_amount)} تومان</p>
          {row.description ? <p className="mt-3 text-[14px] leading-6">{row.description}</p> : null}
          {row.status === "active" ? (
            <Link href={`/shop/games/l/${row.id}`} className="mt-5 inline-flex text-[14px] font-bold text-[rgb(71,131,255)]">
              دیدن در فروشگاه
            </Link>
          ) : (
            <p className="mt-5 text-[14px] text-graytext">تا تأیید ادمین در فروشگاه دیده نمی‌شود.</p>
          )}
        </div>
      </div>
    </>
  );
}
