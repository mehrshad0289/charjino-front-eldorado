"use client";

import { useMemo, useState } from "react";
import { formatTomanPrice } from "../../lib/format-toman";
import { toFaDigits } from "../../lib/fa-digits";
import { CURRENCY_LISTING_COPY } from "./data/listingData";

const SORTS = [
  { id: "recommended", label: "پیشنهادی" },
  { id: "cheapest", label: "ارزان‌ترین" },
  { id: "lowestMin", label: "کمترین حداقل خرید" },
];

function compareRecommended(a, b) {
  return (
    a.priceAmount - b.priceAmount ||
    (a.deliveryMinutes || 9999) - (b.deliveryMinutes || 9999) ||
    (b.stock || 0) - (a.stock || 0)
  );
}

function clampQty(value, min, max) {
  const next = Number(String(value || "").replace(/\D/g, ""));
  if (!Number.isFinite(next) || next < min) return min;
  if (next > max) return max;
  return next;
}

export default function CurrencyOffersBrowser({ offers = [], unitLabel = "", regions = [], rwtNotice = "" }) {
  const regionOptions = Array.isArray(regions) ? regions.filter(Boolean) : [];
  const [region, setRegion] = useState(regionOptions[0] || "");
  const [sort, setSort] = useState("recommended");
  const [selectedId, setSelectedId] = useState("");
  const [quantity, setQuantity] = useState(0);

  const visible = useMemo(() => {
    const rows = region ? offers.filter((row) => String(row.attributes?.region || "") === region) : offers;
    const copy = [...rows];
    if (sort === "cheapest") copy.sort((a, b) => a.priceAmount - b.priceAmount);
    else if (sort === "lowestMin") copy.sort((a, b) => (a.minQuantity || 1) - (b.minQuantity || 1) || a.priceAmount - b.priceAmount);
    else copy.sort(compareRecommended);
    return copy;
  }, [offers, region, sort]);

  const selected = visible.find((row) => row.listingId === selectedId) || visible[0] || null;
  const minQty = Math.max(1, Number(selected?.minQuantity) || 1);
  const maxQty = selected?.stock != null ? Math.max(minQty, Number(selected.stock)) : minQty;
  const qty = quantity >= minQty && quantity <= maxQty ? quantity : minQty;
  const goods = selected ? selected.priceAmount * qty : 0;
  const unit = selected?.priceUnitLabel || unitLabel;
  const notice = rwtNotice || CURRENCY_LISTING_COPY.rwtFallback;

  function pick(row) {
    setSelectedId(row.listingId);
    const min = Math.max(1, Number(row.minQuantity) || 1);
    const max = row.stock != null ? Math.max(min, Number(row.stock)) : min;
    setQuantity(clampQty(min, min, max));
  }

  return (
    <div className="mx-auto grid w-full max-w-[1208px] gap-6 px-4 py-8 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:px-6">
      <section className="rounded-xl bg-white p-5 shadow-[0_2px_4px_rgba(9,9,11,0.05)]">
        <h2 className="text-[18px] font-bold">خرید ارز</h2>
        {regionOptions.length > 0 ? (
          <label className="mt-4 block text-[14px] font-bold">
            ریجن یا سرور
            <select
              value={region}
              onChange={(event) => {
                setRegion(event.target.value);
                setSelectedId("");
                setQuantity(0);
              }}
              className="mt-1 block h-[42px] w-full rounded-lg bg-inputgray px-3 font-normal"
            >
              {regionOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        {selected ? (
          <>
            <p className="mt-4 text-[14px] text-graytext">
              نرخ هر {unit || "واحد"}
            </p>
            <p className="text-[22px] font-bold">
              {selected.price}
              {unit ? <span className="text-[14px] font-bold text-graytext"> / {unit}</span> : null}
            </p>
            <p className="mt-2 text-[14px]">فروشنده: {selected.seller}</p>
            {selected.rating ? <p className="text-[13px] text-graytext">{selected.rating}</p> : null}
            <p className="mt-2 text-[14px] text-graytext">
              حداقل {toFaDigits(minQty)}
              {unit ? ` ${unit}` : ""} · موجودی {toFaDigits(maxQty)}
              {unit ? ` ${unit}` : ""}
            </p>
            {selected.delivery ? <p className="mt-1 text-[14px]">تحویل: {selected.delivery}</p> : null}
            {selected.deliveryMinutes ? (
              <p className="mt-1 text-[14px]">زمان تضمینی: {toFaDigits(selected.deliveryMinutes)} دقیقه</p>
            ) : null}
            {maxQty > minQty ? (
              <label className="mt-4 block text-[14px] font-bold">
                تعداد
                <input
                  type="number"
                  min={minQty}
                  max={maxQty}
                  value={qty}
                  onChange={(event) => setQuantity(clampQty(event.target.value, minQty, maxQty))}
                  className="mt-1 block h-[42px] w-full rounded-lg bg-inputgray px-3 font-normal"
                />
              </label>
            ) : (
              <p className="mt-4 text-[14px] font-bold">
                تعداد: {toFaDigits(minQty)}
                {unit ? ` ${unit}` : ""}
              </p>
            )}
            <p className="mt-4 text-[14px] text-graytext">جمع کالا، بدون کارمزد</p>
            <p className="text-[18px] font-bold">{formatTomanPrice(goods)}</p>
            <a
              href={`/checkout?listing=${encodeURIComponent(selected.listingId)}&quantity=${qty}`}
              className="mt-4 block rounded-lg bg-darkbtn py-3 text-center text-[16px] font-bold text-white"
            >
              پرداخت امن
            </a>
          </>
        ) : (
          <p className="mt-4 text-[14px] text-graytext">برای این بازی هنوز آگهی ارز فعالی نیست.</p>
        )}
        <p className="mt-4 text-[13px] leading-[20px] text-graytext">{notice}</p>
      </section>

      <section className="rounded-xl bg-white p-5 shadow-[0_2px_4px_rgba(9,9,11,0.05)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-[18px] font-bold">سایر فروشنده‌ها ({toFaDigits(visible.length)})</h2>
          <div className="flex flex-wrap gap-2">
            {SORTS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSort(item.id)}
                className={`rounded-lg px-3 py-2 text-[13px] font-bold ${sort === item.id ? "bg-ink text-white" : "bg-[rgb(239,239,241)]"}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        {visible.length === 0 ? (
          <p className="mt-4 text-[14px] text-graytext">با این ریجن آگهی‌ای نیست.</p>
        ) : (
          <ul className="mt-4 flex flex-col gap-2">
            {visible.map((row) => {
              const active = selected?.listingId === row.listingId;
              return (
                <li key={row.listingId}>
                  <button
                    type="button"
                    onClick={() => pick(row)}
                    className={`grid w-full gap-2 rounded-lg px-3 py-3 text-start sm:grid-cols-[minmax(0,1.2fr)_auto_auto] ${active ? "bg-[rgb(255,201,80)]" : "bg-[rgb(239,239,241)]"}`}
                  >
                    <span>
                      <span className="block text-[14px] font-bold">{row.seller}</span>
                      <span className="block text-[12px] text-graytext">{row.rating || "هنوز نظری نیست"}</span>
                    </span>
                    <span className="text-[14px] font-bold">
                      {row.price}
                      {row.priceUnitLabel ? ` / ${row.priceUnitLabel}` : ""}
                    </span>
                    <span className="text-[13px] text-graytext">
                      حداقل {toFaDigits(row.minQuantity || 1)}
                      {row.deliveryMinutes ? ` · ${toFaDigits(row.deliveryMinutes)} دقیقه` : ""}
                      {row.delivery ? ` · ${row.delivery}` : ""}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
