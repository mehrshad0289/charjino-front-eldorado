import { connection } from "next/server";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/actions/auth.actions";
import { getSellerListings, getSellerMe } from "@/actions/market.actions";
import HeaderBar from "../../../../components/eldorado/HeaderBar";
import CategoryNav from "../../../../components/eldorado/CategoryNav";
import DashboardShell from "../../../../components/eldorado/DashboardShell";
import DashboardPageHeader from "../../../../components/eldorado/DashboardPageHeader";
import InfoBanner from "../../../../components/eldorado/InfoBanner";
import EmptyState from "../../../../components/eldorado/EmptyState";
import Footer from "../../../../components/eldorado/Footer";
import ChatBubble from "../../../../components/eldorado/ChatBubble";
import ItemOffersShelf from "../../../../components/eldorado/ItemOffersShelf";
import { DASHBOARD_OFFERS_PAGE } from "../../../../components/eldorado/data/dashboardData";
import { CURRENCY_LISTING_COPY, LISTING_COPY } from "../../../../components/eldorado/data/listingData";
import { sellBlockers } from "@/lib/listing";

export const instant = false;

export const metadata = {
  title: "آگهی‌های ارز — شارژینو",
  description: "نرخ ارز بازی را روی بازی بازارچه بساز و برای بررسی بفرست.",
};

export default async function DashboardOffersCurrencyPage() {
  await connection();
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/dashboard/offers/Currency");

  const [seller, listings] = await Promise.all([getSellerMe(), getSellerListings("Currency")]);
  if (seller.unauthorized || listings.unauthorized) {
    redirect("/login?next=/dashboard/offers/Currency");
  }

  const blockers = sellBlockers(seller);
  const items = listings.ok ? listings.items : [];
  const action = {
    label: CURRENCY_LISTING_COPY.newOffer,
    href: "/dashboard/offers/Currency/new",
    ariaLabel: CURRENCY_LISTING_COPY.newOffer,
  };

  return (
    <div className="min-h-screen bg-page text-ink">
      <HeaderBar user={user} />
      <CategoryNav />
      <main className="isolate">
        <DashboardShell active="Currency" user={user}>
          <DashboardPageHeader icon={DASHBOARD_OFFERS_PAGE.icon} title={CURRENCY_LISTING_COPY.title} action={action} />
          <div className="mt-1 max-w-[1048px] px-6 pb-[50px]">
            <InfoBanner title="بررسی ادمین" bodyParts={[LISTING_COPY.liveNote]} />
            {blockers.length ? (
              <div className="mb-5 rounded-xl bg-white p-5">
                <p className="font-bold">{LISTING_COPY.blockedTitle}</p>
                <ul className="mt-2 list-disc ps-5 text-graytext">
                  {blockers.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <a href="/verify/status" className="mt-4 inline-flex min-h-[42px] items-center rounded-lg bg-ink px-4 text-[14px] font-bold text-white">
                  ادامه احراز / شبا
                </a>
              </div>
            ) : null}
            {!listings.ok ? (
              <p className="text-[14px] text-[rgb(232,27,22)]">{listings.message || "قفسه آگهی خوانده نشد."}</p>
            ) : items.length === 0 ? (
              <EmptyState
                image={DASHBOARD_OFFERS_PAGE.emptyState.image}
                imageAlt={CURRENCY_LISTING_COPY.emptyTitle}
                title={CURRENCY_LISTING_COPY.emptyTitle}
                text={CURRENCY_LISTING_COPY.emptyText}
              />
            ) : (
              <ItemOffersShelf items={items} editBase="/dashboard/offers/Currency" />
            )}
          </div>
        </DashboardShell>
      </main>
      <Footer />
      <ChatBubble />
    </div>
  );
}
