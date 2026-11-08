"use client";

import { useEffect, useMemo, useState } from "react";
import GamePassRegionChips from "./GamePassRegionChips";
import ShopAmountCards from "./ShopAmountCards";
import GiftCardOfferCard from "./GiftCardOfferCard";
import ShopNoResults from "./ShopNoResults";
import { FA } from "./data/faCopy";
import { GIFT_SHOP_CHROME } from "./data/giftShopCopy";
import { useCheckoutPreview } from "./useCheckoutPreview";

export default function SubscriptionBuyFlow({
  regions = [],
  amounts = [],
  offerTitle = FA.subscription,
  productIcon = "",
}) {
  const [region, setRegion] = useState(regions[0] || null);
  const [selectedKey, setSelectedKey] = useState(null);
  const checkout = useCheckoutPreview();

  const visibleAmounts = useMemo(() => {
    if (!region) return amounts;
    const filtered = amounts.filter((row) => !row.region || row.region === region);
    return filtered.length > 0 ? filtered : amounts;
  }, [amounts, region]);

  useEffect(() => {
    if (region && regions.includes(region)) return;
    setRegion(regions[0] || null);
  }, [region, regions]);

  useEffect(() => {
    if (visibleAmounts.length === 0) {
      setSelectedKey(null);
      return;
    }
    if (!visibleAmounts.some((row) => row.key === selectedKey)) {
      setSelectedKey(visibleAmounts[0].key);
    }
  }, [visibleAmounts, selectedKey]);

  const variants = visibleAmounts.map((row) => ({
    key: row.key,
    label: row.label || row.name,
    price: row.from,
    img: row.img || productIcon,
    imgAlt: row.label || row.name,
    ariaLabel: row.label || row.name,
  }));
  const selected = visibleAmounts.find((row) => row.key === selectedKey) || null;

  return (
    <div className="flex flex-col gap-6 lg:mb-8 lg:flex-row lg:items-start lg:gap-9">
      <div className="-mx-4 min-w-0 grow lg:mx-0">
        {regions.length > 0 ? (
          <GamePassRegionChips
            label={GIFT_SHOP_CHROME.gameRegion}
            hint={GIFT_SHOP_CHROME.yourRegion}
            regions={regions}
            defaultRegion={regions[0]}
            value={region}
            onChange={(next) => {
              setRegion(next);
              setSelectedKey(null);
            }}
            inlineMobile
            scrollMobile
          />
        ) : null}
        <ShopAmountCards
          variants={variants}
          selectedKey={selectedKey}
          onSelect={(variant) => setSelectedKey(variant.key)}
          amountLabel={`${GIFT_SHOP_CHROME.amount}:`}
          popularLabel={FA.popular}
          empty={
            <ShopNoResults title={FA.nothingFound} text={FA.nothingFoundHint} />
          }
        />
      </div>
      <aside className="shrink-0 px-4 lg:px-0 lg:basis-[400px]">
        <GiftCardOfferCard
          selected={selected}
          title={offerTitle}
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
