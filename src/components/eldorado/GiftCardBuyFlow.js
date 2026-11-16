"use client";

import { useMemo, useState } from "react";
import GiftCardRegionStep from "./GiftCardRegionStep";
import GiftCardAmountGrid from "./GiftCardAmountGrid";
import GiftCardOfferCard from "./GiftCardOfferCard";
import { useCheckoutPreview } from "./useCheckoutPreview";
import { useCheckoutCoupon } from "./useCheckoutCoupon";
import { amountForSku } from "../../lib/sku-query";

export default function GiftCardBuyFlow({
  regions = [],
  amounts = [],
  productIcon = "",
  buyerFieldsByHandle = {},
  initialSkuId = null,
}) {
  const preset = amountForSku(amounts, initialSkuId);
  const [region, setRegion] = useState(preset?.region || null);
  const [selectedKey, setSelectedKey] = useState(preset?.key || null);
  const [buyerValues, setBuyerValues] = useState({});
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
  const coupon = useCheckoutCoupon(selected?.skuId);
  const buyerFields = selected?.handle ? buyerFieldsByHandle[selected.handle] || [] : [];

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
          onSelect={(amount) => {
            setSelectedKey(amount.key);
            setBuyerValues({});
          }}
        />
      </div>
      <aside className="shrink-0 lg:basis-[400px]">
        <GiftCardOfferCard
          selected={selected}
          productIcon={productIcon}
          ack={checkout.ack}
          onAckChange={checkout.setAck}
          message={checkout.message}
          buyerFields={buyerFields}
          buyerValues={buyerValues}
          onBuyerFieldChange={(name, value) => setBuyerValues((prev) => ({ ...prev, [name]: value }))}
          coupon={coupon}
          busy={checkout.busy}
          onBuy={() =>
            checkout.preview(selected, buyerValues, {
              couponCode: coupon.quote?.code || "",
              from: typeof window !== "undefined" ? window.location.pathname : "",
            })
          }
        />
      </aside>
    </div>
  );
}
