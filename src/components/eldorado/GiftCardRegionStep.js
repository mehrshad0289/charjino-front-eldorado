"use client";

import { useState } from "react";
import { GIFT_CARD_REGIONS } from "./data/giftCardData";
import { GIFT_SHOP_CHROME } from "./data/giftShopCopy";
import { catalogRegionLabel } from "../../lib/catalog-region";
import EldSelect from "./EldSelect";

/* Step 1 of the buying flow (giftcard .make capture): white card with a
   yellow→pink gradient border, yellow number badge pinned to the top-left
   corner, "Select region *" label and the global eld-dropdown. */

export default function GiftCardRegionStep({
  regions = GIFT_CARD_REGIONS,
  value = null,
  onChange,
  selectLabel = GIFT_SHOP_CHROME.selectRegion,
  placeholder = GIFT_SHOP_CHROME.regionPlaceholder,
}) {
  const [region, setRegion] = useState(value);
  const selected = onChange ? value : region;

  const choose = (next) => {
    if (onChange) onChange(next);
    else setRegion(next);
  };

  return (
    <div className="relative z-[1] mb-8 rounded-2xl p-px" style={{ backgroundImage: "linear-gradient(to right, rgb(255, 201, 80), rgb(210, 123, 185))" }}>
      <div
        className="absolute start-0 top-0 z-[10] flex h-10 w-10 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full bg-brand ltr:-translate-x-2 rtl:translate-x-2 lg:ltr:translate-x-0 lg:rtl:translate-x-0"
        aria-hidden="true"
      >
        <span className="block text-[28px] font-bold leading-[42px]">1</span>
      </div>
      <div className="rounded-2xl bg-white p-4">
        <label className="mb-3 mt-3 inline-block text-[16px] font-bold leading-[27px] lg:text-[18px]">
          {selectLabel}
          <span className="text-[rgb(212,_25,_20)]">*</span>
        </label>
        <EldSelect
          className="w-full"
          ariaLabel={selectLabel}
          placeholder={placeholder}
          value={selected ?? ""}
          onChange={choose}
          options={regions.map((item) => ({ value: item, label: catalogRegionLabel(item) }))}
        />
      </div>
    </div>
  );
}
