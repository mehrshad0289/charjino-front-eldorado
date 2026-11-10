"use client";

import { useMemo, useState } from "react";
import AccountOffersGrid from "./AccountOffersGrid";
import { toFaDigits } from "../../lib/fa-digits";

const SORTS = [
  { id: "newest", label: "جدیدترین" },
  { id: "price_asc", label: "ارزان‌ترین" },
  { id: "price_desc", label: "گران‌ترین" },
];

function priceValue(offer) {
  const amount = Number(offer.priceAmount);
  return Number.isFinite(amount) ? amount : 0;
}

function onlyDigits(value) {
  return String(value || "").replace(/\D/g, "");
}

export default function AccountOffersBrowser({ offers, facets = [] }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [picked, setPicked] = useState({});
  const [numberBand, setNumberBand] = useState({});

  function toggleValue(key, value) {
    setPicked((current) => {
      const list = current[key] || [];
      const next = list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
      return { ...current, [key]: next };
    });
  }

  function setBand(key, edge, value) {
    setNumberBand((current) => ({ ...current, [key]: { ...current[key], [edge]: value } }));
  }

  const activeCount =
    (priceMin || priceMax ? 1 : 0) +
    Object.values(picked).filter((list) => list.length).length +
    Object.values(numberBand).filter((band) => band?.min || band?.max).length;

  function clearFilters() {
    setPriceMin("");
    setPriceMax("");
    setPicked({});
    setNumberBand({});
  }

  const rows = useMemo(() => {
    const needle = query.trim();
    const minPrice = priceMin ? Number(priceMin) : null;
    const maxPrice = priceMax ? Number(priceMax) : null;
    const filtered = offers.filter((offer) => {
      if (needle && !`${offer.title} ${offer.desc} ${offer.seller}`.includes(needle)) return false;
      const amount = priceValue(offer);
      if (minPrice != null && amount < minPrice) return false;
      if (maxPrice != null && amount > maxPrice) return false;
      for (const [key, values] of Object.entries(picked)) {
        if (!values.length) continue;
        if (!values.includes(String(offer.attributes?.[key] ?? ""))) return false;
      }
      for (const [key, band] of Object.entries(numberBand)) {
        const raw = Number(offer.attributes?.[key]);
        if (band?.min && (!Number.isFinite(raw) || raw < Number(band.min))) return false;
        if (band?.max && (!Number.isFinite(raw) || raw > Number(band.max))) return false;
      }
      return true;
    });
    if (sort === "price_asc") return [...filtered].sort((a, b) => priceValue(a) - priceValue(b));
    if (sort === "price_desc") return [...filtered].sort((a, b) => priceValue(b) - priceValue(a));
    return filtered;
  }, [offers, query, sort, priceMin, priceMax, picked, numberBand]);

  const sidebar = (
    <div className="lg:sticky lg:top-[108px]">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="hidden text-[20px] font-bold leading-[30px] lg:block">فیلترها</h2>
        {activeCount ? (
          <button type="button" onClick={clearFilters} className="text-[14px] font-bold text-linkblue underline">
            پاک کردن
          </button>
        ) : null}
      </div>
      <div className="border-t border-cardborder pt-4">
        <p className="mb-3 font-bold">قیمت (تومان)</p>
        <div className="mb-5 flex items-center gap-2">
          <input
            inputMode="numeric"
            value={priceMin}
            onChange={(event) => setPriceMin(onlyDigits(event.target.value))}
            placeholder="از"
            aria-label="حداقل قیمت"
            className="h-[42px] w-full rounded-lg bg-inputgray px-3"
          />
          <span className="text-graytext">تا</span>
          <input
            inputMode="numeric"
            value={priceMax}
            onChange={(event) => setPriceMax(onlyDigits(event.target.value))}
            placeholder="تا"
            aria-label="حداکثر قیمت"
            className="h-[42px] w-full rounded-lg bg-inputgray px-3"
          />
        </div>
        {facets.map((field) => (
          <fieldset key={field.key} className="mb-5">
            <legend className="mb-3 font-bold">{field.label_fa}</legend>
            {field.type === "number" ? (
              <div className="flex items-center gap-2">
                <input
                  inputMode="numeric"
                  value={numberBand[field.key]?.min || ""}
                  onChange={(event) => setBand(field.key, "min", onlyDigits(event.target.value))}
                  placeholder={field.min != null ? String(field.min) : "از"}
                  aria-label={`${field.label_fa} از`}
                  className="h-[42px] w-full rounded-lg bg-inputgray px-3"
                />
                <span className="text-graytext">تا</span>
                <input
                  inputMode="numeric"
                  value={numberBand[field.key]?.max || ""}
                  onChange={(event) => setBand(field.key, "max", onlyDigits(event.target.value))}
                  placeholder={field.max != null ? String(field.max) : "تا"}
                  aria-label={`${field.label_fa} تا`}
                  className="h-[42px] w-full rounded-lg bg-inputgray px-3"
                />
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {(field.options || []).map((option) => {
                  const checked = (picked[field.key] || []).includes(option.value);
                  return (
                    <label key={option.value} className="flex items-center justify-between gap-2 text-[14px] leading-[20px]">
                      <span className="flex min-w-0 items-center gap-2">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleValue(field.key, option.value)}
                        />
                        <span className="truncate">{option.value}</span>
                      </span>
                      <span className="text-graytext">{toFaDigits(option.count)}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </fieldset>
        ))}
      </div>
    </div>
  );

  return (
    <div className="mx-auto flex w-full max-w-[1208px] flex-col gap-6 px-4 pt-4 lg:flex-row lg:items-start lg:px-6">
      <aside className="w-full shrink-0 lg:w-[280px]">
        <details open className="rounded-lg bg-white p-4 lg:contents lg:bg-transparent lg:p-0">
          <summary className="cursor-pointer text-[16px] font-bold lg:hidden">فیلترها</summary>
          <div className="pt-4 lg:pt-0">{sidebar}</div>
        </details>
      </aside>
      <div className="min-w-0 flex-1">
        <div className="mb-4 max-w-[340px]">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="جستجوی اکانت"
            aria-label="جستجوی اکانت"
            className="block h-[42px] w-full rounded-lg border-2 border-inputgray bg-inputgray px-3 text-[14px] outline-none placeholder:text-filtertext focus:border-focusblue focus:bg-white"
          />
        </div>
        <div className="mb-4 flex min-h-10 items-center justify-between gap-3">
          <p className="text-[14px] text-filtertext">{toFaDigits(rows.length)} آگهی</p>
          <label className="flex items-center gap-2 text-[14px]">
            <span className="text-filtertext">مرتب‌سازی</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              aria-label="مرتب‌سازی آگهی‌ها"
              className="h-[42px] rounded-lg bg-transparent px-2"
            >
              {SORTS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <AccountOffersGrid offers={rows} embedded />
      </div>
    </div>
  );
}
