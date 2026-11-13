"use client";

import { useMemo, useState } from "react";
import SellerListingsTable from "./SellerListingsTable";
import { ITEM_LISTING_COPY } from "./data/listingData";

const DELIVERY = {
  in_game_trade: "ترید داخل بازی",
  in_game_gift: "هدیه داخل بازی",
  mailbox: "صندوق بازی",
  face_to_face: "تحویل رو در رو",
  trade_url: "لینک ترید",
  auction_house: "حراجی داخل بازی",
  drop: "دراپ داخل بازی",
  platform_purchase: "فعال‌سازی روی اکانت",
};

export default function ItemOffersShelf({ items = [], editBase = "/dashboard/offers/CustomItem" }) {
  const [query, setQuery] = useState("");
  const [delivery, setDelivery] = useState("all");
  const methods = useMemo(
    () => [...new Set(items.map((row) => row.delivery_method).filter(Boolean))],
    [items],
  );
  const visible = items.filter((row) => {
    const needle = query.trim().toLowerCase();
    const haystack = `${row.title || ""} ${row.game_name || ""}`.toLowerCase();
    if (needle && !haystack.includes(needle)) return false;
    if (delivery !== "all" && row.delivery_method !== delivery) return false;
    return true;
  });

  return (
    <div>
      <div className="mb-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_220px]">
        <label className="text-[14px] font-bold">
          بازی یا عنوان
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="جستجو"
            className="mt-1 block h-[42px] w-full rounded-lg border-2 border-[rgb(239,239,241)] bg-[rgb(239,239,241)] px-3 text-[14px] font-normal outline-none"
          />
        </label>
        <label className="text-[14px] font-bold">
          {ITEM_LISTING_COPY.delivery}
          <select
            value={delivery}
            onChange={(event) => setDelivery(event.target.value)}
            className="mt-1 block h-[42px] w-full rounded-lg border-2 border-[rgb(239,239,241)] bg-[rgb(239,239,241)] px-3 text-[14px] font-normal outline-none"
          >
            <option value="all">همه</option>
            {methods.map((method) => (
              <option key={method} value={method}>
                {DELIVERY[method] || method}
              </option>
            ))}
          </select>
        </label>
      </div>
      {visible.length === 0 ? (
        <p className="text-[14px] text-graytext">با این جستجو آگهی‌ای نیست.</p>
      ) : (
        <SellerListingsTable items={visible} editBase={editBase} />
      )}
    </div>
  );
}
