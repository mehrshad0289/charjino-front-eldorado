import DashboardPageHeader from "../../../components/eldorado/DashboardPageHeader";
import DashboardLoyalty from "../../../components/eldorado/DashboardLoyalty";
import { FA } from "../../../components/eldorado/data/faCopy";

/* Dashboard page /dashboard/loyalty (own .make capture, 1920-only,
   decoded 2026-11-04, session 16): logged-in frame + dashboard shell with
   sidebar active row "Loyalty"; page header "Eldorado Loyalty" (star icon,
   no action button); amber streak banner + white points card, 2-col
   achievements grid (3 cards) and the Dedication background-image card —
   see DashboardLoyalty.js for the section-by-section notes. Footer + chat
   bubble reuse the shared components. */

export const metadata = {
  title: "Dashboard Loyalty - Eldorado",
  description: "Collect loyalty points and unlock rewards on Eldorado.",
};

export default function DashboardLoyaltyPage() {
  return (
    <>
      <DashboardPageHeader icon="loyalty" title={FA.loyalty} />
      <DashboardLoyalty />
    </>
  );
}
