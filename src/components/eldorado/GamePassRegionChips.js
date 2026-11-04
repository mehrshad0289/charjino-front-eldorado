"use client";

import { useState } from "react";
import { GAME_PASS_REGIONS, GAME_PASS_DEFAULT_REGION } from "./data/gamePassData";

/* Step 1 of the buying flow (gamepass .make capture + live probes): white
   card with "Game region: {region}" inline label and single-select chips.
   Unselected chip: white bg + 0.8px hairline; selected: 2px brand-yellow
   border on a 16% yellow tint, bold (live probed class list). */

export default function GamePassRegionChips() {
  const [region, setRegion] = useState(GAME_PASS_DEFAULT_REGION);

  return (
    <div
      aria-label="Game trade environment chips"
      className="rounded-t-lg bg-white px-4 pb-4 pt-4 lg:rounded-tr-lg lg:px-6"
    >
      <div className="mb-2 text-[16px] leading-[24px]">
        <span className="font-bold">Game region: </span>
        <span>{region}</span>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        {GAME_PASS_REGIONS.map((r) => {
          const selected = r === region;
          return (
            <button
              key={r}
              type="button"
              aria-pressed={selected}
              onClick={() => setRegion(r)}
              className={`inline-block min-h-10 min-w-12 rounded-lg border px-2 py-1 text-center leading-[24px] transition-colors ${
                selected
                  ? "border-2 border-brand bg-brand/[0.16] px-[7px] font-bold"
                  : "border-cardborder bg-white hover:bg-badgebg"
              }`}
            >
              <span className="block px-1">{r}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
