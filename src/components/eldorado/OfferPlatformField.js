"use client";

import EldSelect from "./EldSelect";
import { ListingFieldNote } from "./ListingWizardChrome";
import { offerPlatformPayload, offerPlatformSelectOptions } from "../../lib/offer-platforms";

export default function OfferPlatformField({ payload, value, invalid, error, disabled, onChange }) {
  const data = offerPlatformPayload(payload);
  if (!data.options?.length) return null;
  return (
    <label className="text-[14px] font-bold" htmlFor="listing-offer-platform">
      {data.label_fa || "پلتفرم"}
      {data.required ? " *" : ""}
      <EldSelect
        id="listing-offer-platform"
        className="mt-1"
        ariaLabel={data.label_fa || "پلتفرم"}
        value={value || ""}
        invalid={Boolean(invalid)}
        disabled={disabled}
        placeholder="انتخاب کن"
        onChange={onChange}
        options={offerPlatformSelectOptions(data)}
      />
      <ListingFieldNote message={error} />
    </label>
  );
}

export function offerPlatformReady(payload, value) {
  if (!payload || !Array.isArray(payload.options) || payload.options.length === 0) return true;
  if (!payload.required) return true;
  return Boolean(String(value || "").trim());
}
