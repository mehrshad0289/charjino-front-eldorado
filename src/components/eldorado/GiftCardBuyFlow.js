"use client";

import { useMemo, useState } from "react";
import GiftCardRegionStep from "./GiftCardRegionStep";
import GiftCardAmountGrid from "./GiftCardAmountGrid";
import GiftCardOfferCard from "./GiftCardOfferCard";
import { useCheckoutPreview } from "./useCheckoutPreview";

export default function GiftCardBuyFlow({ regions = [], amounts = [], productIcon = "" }) {
  const [region, setRegion] = useState(null);
  const [selectedKey, setSelectedKey] = useState(null);
  const checkout = useCheckoutPreview();

  const catalogAmounts = useMemo(
    () => amounts.map((row) => ({ ...row, img: row.img || productIcon })),
    [amounts, productIcon],
  );

  const visibleAmounts = useMemo(() => {
    if (!region) return catalogAmounts;
    const filtered = catalogAmounts.filter((row) => !row.region || row.region === region);
    return filtered.length > 0 ? filtered : catalogAmounts;
  }, [catalogAmounts, region]);

  const selected = visibleAmounts.find((row) => row.key === selectedKey) || null;

  return (
    <div className="flex flex-col gap-6 lg:mb-8 lg:flex-row lg:gap-9">
      <div className="min-w-0 grow">
        <GiftCardRegionStep
          regions={regions}
          value={region}
          onChange={(next) => {
            setRegion(next);
            setSelectedKey(null);
          }}
        />
        <GiftCardAmountGrid
          amounts={visibleAmounts}
          selectedKey={selectedKey}
          onSelect={(amount) => setSelectedKey(amount.key)}
        />
      </div>
      <aside className="shrink-0 lg:basis-[400px]">
        <GiftCardOfferCard
          selected={selected}
          productIcon={productIcon}
          ack={checkout.ack}
          onAckChange={checkout.setAck}
          message={checkout.message}
          onBuy={() => checkout.preview(selected)}
        />
      </aside>
    </div>
  );
}
