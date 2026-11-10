import HeaderBar from "../../../../components/eldorado/HeaderBar";
import CategoryNav from "../../../../components/eldorado/CategoryNav";
import DashboardShell from "../../../../components/eldorado/DashboardShell";
import DashboardPageHeader from "../../../../components/eldorado/DashboardPageHeader";
import DashboardFilters from "../../../../components/eldorado/DashboardFilters";
import InfoBanner from "../../../../components/eldorado/InfoBanner";
import EmptyState from "../../../../components/eldorado/EmptyState";
import Footer from "../../../../components/eldorado/Footer";
import ChatBubble from "../../../../components/eldorado/ChatBubble";
import { DASHBOARD_OFFERS_PAGE } from "../../../../components/eldorado/data/dashboardData";

/* Dashboard offers page /dashboard/offers/CustomItem (session 15, from the
   user-pushed capture `ui ux/CustomItem/
   www_eldorado_gg_dashboard_offers_CustomItem_1920w_390w_1536w_default.make`,
   decoded to extracted/snapshots/dashboard-customitem-1920px-{1,2}.tsx —
   native fig-make container, decoded by
   scripts/decode_customitem_capture.py). Same offers frame as the Account
   page (the sidebar's "Items" child already pointed at this URL since the
   dashboard session). Differences vs the Account capture, per text+class
   diff of the two snapshots: sidebar active child = Items (bg brand),
   the "Delivery method" combobox (180px) replaces the "Search offers"
   input in the filter row, and the Orders/Boosting groups are collapsed
   (transient UI state — kept expandable, default expanded like Account).
   Known deviation: the capture's sidebar lacks the "Become a Seller" link
   (present in the Account capture) — kept for sidebar consistency.
   Same "Nothing found" empty state (text-identical in both captures). */

export const metadata = {
  title: "Dashboard Offers (Custom items) - Eldorado",
  description: "Manage your custom item offers on Eldorado.",
};

export default function DashboardOffersCustomItemPage() {
  const { icon, title, action, infoBanner, filters, emptyState } = DASHBOARD_OFFERS_PAGE;
  return (
    <div className="min-h-screen bg-page text-ink">
      <HeaderBar />
      <CategoryNav />
      <main className="isolate">
        <DashboardShell active="Items">
          <DashboardPageHeader icon={icon} title={title} action={action} />
          <div className="mt-1 max-w-[1048px] px-6 pb-[50px]">
            <InfoBanner title={infoBanner.title} bodyParts={infoBanner.bodyParts} />
            <DashboardFilters
              gamePlaceholder={filters.gamePlaceholder}
              deliveryLabel="Delivery method"
              sortLabel={filters.sortLabel}
            />
            <EmptyState {...emptyState} />
          </div>
        </DashboardShell>
      </main>
      <Footer />
      <ChatBubble />
    </div>
  );
}
