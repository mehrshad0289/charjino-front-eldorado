"use client";

import { useMemo, useState } from "react";
import GiftCardRegionStep from "./GiftCardRegionStep";
import GiftCardAmountGrid from "./GiftCardAmountGrid";
import GiftCardOfferCard from "./GiftCardOfferCard";

export default function GiftCardBuyFlow({ regions = [], amounts = [] }) {
  const [region, setRegion] = useState(null);
  const [selectedKey, setSelectedKey] = useState(null);

  const visibleAmounts = useMemo(() => {
    if (!region) return amounts;
    return amounts.filter((row) => row.region === region);
  }, [amounts, region]);

  const selected = visibleAmounts.find((row) => row.key === selectedKey) || null;

  return (
    <div className="flex flex-col gap-6 lg:mb-8 lg:flex-row lg:gap-9">
      <div className="min-w-0 grow">
        {regions.length > 0 ? (
          <GiftCardRegionStep
            regions={regions}
            value={region}
            onChange={(next) => {
              setRegion(next);
              setSelectedKey(null);
            }}
          />
        ) : null}
        <GiftCardAmountGrid
          amounts={visibleAmounts}
          selectedKey={selectedKey}
          onSelect={(amount) => setSelectedKey(amount.key)}
        />
      </div>
      <aside className="shrink-0 lg:basis-[400px]">
        <GiftCardOfferCard href={selected?.href} />
      </aside>
    </div>
  );
}
