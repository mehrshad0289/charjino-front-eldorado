import { ACCOUNT_OFFERS } from "./data/referenceData";
import AccountCard from "./AccountCard";
import ShopNoResults from "./ShopNoResults";
import { FA } from "./data/faCopy";

export default function AccountOffersGrid({ offers }) {
  const rows = Array.isArray(offers) ? offers : ACCOUNT_OFFERS;
  if (rows.length === 0) {
    return (
      <div className="mx-auto w-full max-w-[1208px] px-6">
        <ShopNoResults title={FA.nothingFound} text={FA.shopEmpty} />
      </div>
    );
  }
  return (
    <div className="mx-auto w-full max-w-[1208px] px-6">
      <div className="grid min-h-[840px] grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((offer) => (
          <AccountCard key={offer.href || offer.title} offer={offer} />
        ))}
      </div>
    </div>
  );
}
