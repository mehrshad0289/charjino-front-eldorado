import { ACCOUNT_OFFERS } from "./data/referenceData";
import AccountCard from "./AccountCard";

/* Offers grid (shop_account.make reference): 3 columns, 24px gaps, 24 cards */
export default function AccountOffersGrid() {
  return (
    <div className="mx-auto w-full max-w-[1208px] px-6">
      <div className="grid min-h-[840px] grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {ACCOUNT_OFFERS.map((offer) => (
          <AccountCard key={offer.href} offer={offer} />
        ))}
      </div>
    </div>
  );
}
