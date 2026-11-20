import { connection } from "next/server";
import { notFound, redirect } from "next/navigation";
import { getSessionUser } from "@/actions/auth.actions";
import { getCurrencyOfferGames, getSellerListing, getSellerMe } from "@/actions/market.actions";
import DashboardPageHeader from "../../../../../components/eldorado/DashboardPageHeader";
import CurrencyListingWizard from "../../../../../components/eldorado/CurrencyListingWizard";
import { CURRENCY_LISTING_COPY, LISTING_COPY } from "../../../../../components/eldorado/data/listingData";
import { listingSellGate, listingStatusMeta, SELL_VERIFY_PATH } from "@/lib/listing";
import { formatTomanInWords } from "@/lib/price";

export const instant = false;

export const metadata = {
  title: "ویرایش آگهی ارز — شارژینو",
};

export default async function EditCurrencyOfferPage({ params }) {
  await connection();
  const user = await getSessionUser();
  const { id } = await params;
  if (!user) redirect(`/login?next=/dashboard/offers/Currency/${id}`);

  const [seller, games, listing] = await Promise.all([getSellerMe(), getCurrencyOfferGames(), getSellerListing(id)]);
  if (seller.unauthorized || listing.unauthorized) {
    redirect(`/login?next=/dashboard/offers/Currency/${id}`);
  }
  if (!listing.ok || !listing.data || listing.data.offer_type !== "Currency") notFound();

  const row = listing.data;
  const editable = row.status === "draft";
  const status = listingStatusMeta(row.status);
  const unit = row.price_unit_label ? ` / ${row.price_unit_label}` : "";
  const gate = listingSellGate(seller);

  return (
    <>
      <DashboardPageHeader
        icon="tag"
        title={editable ? LISTING_COPY.editOffer : row.title}
        action={{ label: CURRENCY_LISTING_COPY.title, href: "/dashboard/offers/Currency", ariaLabel: CURRENCY_LISTING_COPY.title }}
      />
      <div className="mt-1 w-full px-6 pb-[50px]">
            {editable ? (
              <CurrencyListingWizard
                games={games.ok ? games.items : []}
                listing={row}
                blockers={gate.blockers}
                gateHref={gate.href || SELL_VERIFY_PATH}
                gateLabel={gate.label}
              />
            ) : (
              <div className="rounded-xl bg-white p-6">
                <span className="inline-flex rounded-lg px-3 py-1 text-[13px] font-bold text-white" style={{ backgroundColor: status.bg }}>
                  {status.label}
                </span>
                <p className="mt-4 text-[24px] font-bold">{row.title}</p>
                <p className="mt-2 text-graytext">
                  {row.game_name} · {formatTomanInWords(row.price_amount)}{unit}
                  {row.stock ? ` · موجودی ${row.stock}` : ""}
                  {row.delivery_minutes ? ` · ${row.delivery_minutes} دقیقه` : ""}
                </p>
                {row.rejection_reason ? <p className="mt-3 text-[rgb(232,27,22)]">{row.rejection_reason}</p> : <p className="mt-3 text-[rgb(255,141,0)]">{LISTING_COPY.reviewNote}</p>}
              </div>
            )}
          </div>
    </>
  );
}
