"use client";

import EldSelect from "./EldSelect";
import { PROFILE_SHOP_GAME_FILTER } from "./data/profileData";

export default function ProfileShopGameFilter({ game = "", games = [], onGameChange, disabled = false }) {
  if (!Array.isArray(games) || games.length === 0) return null;

  return (
    <div className="mb-[10px] flex flex-wrap items-center gap-[10px]">
      <EldSelect
        className="w-[220px]"
        ariaLabel={PROFILE_SHOP_GAME_FILTER}
        value={game}
        disabled={disabled}
        onChange={(value) => onGameChange?.(value)}
        options={[
          { value: "", label: PROFILE_SHOP_GAME_FILTER },
          ...games.map((name) => ({ value: name, label: name })),
        ]}
      />
    </div>
  );
}
