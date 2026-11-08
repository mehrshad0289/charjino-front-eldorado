"use client";

import { useState } from "react";
import { GAME_PASS_REGIONS, GAME_PASS_DEFAULT_REGION } from "./data/gamePassData";
import { catalogRegionLabel } from "../../lib/catalog-region";

/* Step 1 of the buying flow (gamepass .make capture + live probes): white
   card with "Game region: {region}" inline label and single-select chips.
   Unselected chip: white bg + 0.8px hairline; selected: 2px brand-yellow
   border on a 16% yellow tint, bold (live probed class list).
   Session 24 generalization (prime/psplus/cod captures reuse the same
   widget): `label` ("Game region" / "Game platform"), `hint` ("Your
   region:" — empty on the cod platform card), `regions`/`defaultRegion`,
   `inlineMobile` (live psplus @390 shows "Game region: Ukraine" inline)
   and `scrollMobile` (live psplus @390 chips are a single scrolling row;
   gamepass keeps the wrap). Defaults preserve the gamepass behavior. */

export default function GamePassRegionChips({
  label = "Game region",
  hint = "Your region:",
  regions = GAME_PASS_REGIONS,
  defaultRegion = GAME_PASS_DEFAULT_REGION,
  inlineMobile = false,
  scrollMobile = false,
}) {
  const [region, setRegion] = useState(defaultRegion);

  return (
    <div
      aria-label="Game trade environment chips"
      className="rounded-t-lg bg-white px-4 pb-4 pt-4 lg:rounded-tr-lg lg:px-6"
    >
      {/* header: inline "Label: value" on mobile when inlineMobile (live
          psplus @390); split label / hint+value per the 1920 captures */}
      {inlineMobile ? (
        <>
          <div className="mb-2 flex items-baseline gap-1 text-[16px] leading-[24px] lg:hidden">
            <span className="block font-bold">{label}:</span>
            <span className="block">{region}</span>
          </div>
          <div className="mb-2 hidden items-baseline justify-between gap-2 text-[16px] leading-[24px] lg:flex">
            <span className="block font-bold">{label}</span>
            {hint ? (
              <span className="flex gap-1 text-[14px] leading-[19.6px]">
                <span className="block text-graytext">{hint}</span>
                <span className="block">{region}</span>
              </span>
            ) : null}
          </div>
        </>
      ) : (
        <div className="mb-2 flex items-baseline justify-between gap-2 text-[16px] leading-[24px]">
          <span className="block font-bold">{label}</span>
          {hint ? (
            <span className="flex gap-1 text-[14px] leading-[19.6px]">
              <span className="block text-graytext">{hint}</span>
              <span className="block">{region}</span>
            </span>
          ) : null}
        </div>
      )}
      <div
        className={`flex items-center gap-4 ${
          scrollMobile ? "-mx-4 flex-nowrap gap-3 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-wrap lg:gap-4 lg:overflow-visible lg:px-0" : "flex-wrap"
        }`}
      >
        {regions.map((r) => {
          const selected = r === region;
          return (
            <button
              key={r}
              type="button"
              aria-pressed={selected}
              onClick={() => setRegion(r)}
              className={`inline-block min-h-10 min-w-12 shrink-0 rounded-lg border px-2 py-1 text-center leading-[24px] transition-colors ${
                selected
                  ? "border-2 border-brand bg-brand/[0.16] px-[7px] font-bold"
                  : "border-cardborder bg-white hover:bg-badgebg"
              }`}
            >
              <span className="block px-1">{catalogRegionLabel(r) || r}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}