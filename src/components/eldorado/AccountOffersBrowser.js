"use client";

import { useMemo, useState } from "react";
import AccountOffersGrid from "./AccountOffersGrid";
import { toFaDigits } from "../../lib/fa-digits";

const SORTS = [
  { id: "newest", label: "پیشنهادی" },
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

function offerText(offer) {
  const attrs = Object.values(offer.attributes || {}).join(" ");
  return `${offer.title || ""} ${offer.desc || ""} ${offer.seller || ""} ${offer.itemTypeName || ""} ${attrs}`.toLowerCase();
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-filtertext">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path d="m16 16 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function SortIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function Chevron() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function AccountOffersBrowser({
  offers = [],
  facets = [],
  searchPlaceholder = "جستجوی اکانت",
  countLabel = "آگهی",
  foundSuffix = "",
  pricePresets = [],
}) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [pricePreset, setPricePreset] = useState("");
  const [picked, setPicked] = useState({});
  const [numberBand, setNumberBand] = useState({});
  const [facetQuery, setFacetQuery] = useState({});

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

  function applyPreset(preset) {
    if (pricePreset === preset.id) {
      setPricePreset("");
      setPriceMin("");
      setPriceMax("");
      return;
    }
    setPricePreset(preset.id);
    setPriceMin(preset.min != null ? String(preset.min) : "");
    setPriceMax(preset.max != null ? String(preset.max) : "");
  }

  function changePriceMin(value) {
    setPricePreset("");
    setPriceMin(onlyDigits(value));
  }

  function changePriceMax(value) {
    setPricePreset("");
    setPriceMax(onlyDigits(value));
  }

  const chips = useMemo(() => {
    const rows = [];
    if (priceMin || priceMax) {
      const from = priceMin ? toFaDigits(priceMin) : "۰";
      const to = priceMax ? toFaDigits(priceMax) : "∞";
      rows.push({
        id: "price",
        label: `قیمت ${from} تا ${to}`,
        clear: () => {
          setPriceMin("");
          setPriceMax("");
          setPricePreset("");
        },
      });
    }
    for (const field of facets) {
      for (const value of picked[field.key] || []) {
        rows.push({
          id: `${field.key}:${value}`,
          label: `${field.label_fa}: ${value}`,
          clear: () => toggleValue(field.key, value),
        });
      }
      const band = numberBand[field.key];
      if (band?.min || band?.max) {
        rows.push({
          id: `${field.key}-band`,
          label: `${field.label_fa} ${band.min || "۰"}–${band.max || "∞"}`,
          clear: () => setNumberBand((current) => ({ ...current, [field.key]: {} })),
        });
      }
    }
    return rows;
  }, [facets, picked, numberBand, priceMin, priceMax]);

  function clearFilters() {
    setPriceMin("");
    setPriceMax("");
    setPricePreset("");
    setPicked({});
    setNumberBand({});
    setFacetQuery({});
  }

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const minPrice = priceMin ? Number(priceMin) : null;
    const maxPrice = priceMax ? Number(priceMax) : null;
    const filtered = offers.filter((offer) => {
      if (needle && !offerText(offer).includes(needle)) return false;
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

  const countText = [toFaDigits(rows.length), countLabel, foundSuffix].filter(Boolean).join(" ");

  const sidebar = (
    <div className="lg:sticky lg:top-[var(--shop-header-h)] lg:max-h-[calc(100vh-var(--shop-header-h))] lg:overflow-y-auto lg:pe-4">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="hidden text-[20px] font-bold leading-[30px] lg:block">فیلترها</h2>
        {chips.length ? (
          <button type="button" onClick={clearFilters} className="text-[14px] font-bold text-linkblue">
            پاک کردن
          </button>
        ) : null}
      </div>
      <div className="border-t border-cardborder">
        <details open className="group border-b border-cardborder py-5">
          <summary className="flex cursor-pointer list-none items-center justify-between font-bold marker:content-none [&::-webkit-details-marker]:hidden">
            <span>قیمت (تومان)</span>
            <span className="transition group-open:rotate-180">
              <Chevron />
            </span>
          </summary>
          <div className="mt-3">
            <div className="mb-4 flex items-center gap-2">
              <input
                inputMode="numeric"
                value={priceMin}
                onChange={(event) => changePriceMin(event.target.value)}
                placeholder="از"
                aria-label="حداقل قیمت"
                className="h-[42px] w-full rounded-lg bg-inputgray px-3"
              />
              <span className="text-graytext">تا</span>
              <input
                inputMode="numeric"
                value={priceMax}
                onChange={(event) => changePriceMax(event.target.value)}
                placeholder="تا"
                aria-label="حداکثر قیمت"
                className="h-[42px] w-full rounded-lg bg-inputgray px-3"
              />
            </div>
            {pricePresets.length > 0 ? (
              <div className="flex flex-col gap-3">
                {pricePresets.map((preset) => (
                  <label key={preset.id} className="flex h-6 items-center gap-2 text-[14px] leading-[20px]">
                    <input
                      type="radio"
                      name="item-price-preset"
                      checked={pricePreset === preset.id}
                      onChange={() => applyPreset(preset)}
                    />
                    <span>{preset.label}</span>
                  </label>
                ))}
              </div>
            ) : null}
          </div>
        </details>
        {facets.map((field) => {
          const options = field.options || [];
          const search = (facetQuery[field.key] || "").trim();
          const visible = search
            ? options.filter((option) => String(option.value).toLowerCase().includes(search.toLowerCase()))
            : options;
          return (
            <details key={field.key} open className="group border-b border-cardborder py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between font-bold marker:content-none [&::-webkit-details-marker]:hidden">
                <span>{field.label_fa}</span>
                <span className="transition group-open:rotate-180">
                  <Chevron />
                </span>
              </summary>
              <div className="mt-3">
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
                  <>
                    {options.length > 6 ? (
                      <div className="relative mb-3">
                        <input
                          type="search"
                          value={facetQuery[field.key] || ""}
                          onChange={(event) => setFacetQuery((current) => ({ ...current, [field.key]: event.target.value }))}
                          placeholder={`جستجوی ${field.label_fa}`}
                          aria-label={`جستجوی ${field.label_fa}`}
                          className="h-[42px] w-full rounded-lg border-2 border-inputgray bg-inputgray pe-10 ps-3 text-[14px] outline-none placeholder:text-filtertext focus:border-focusblue focus:bg-white"
                        />
                        <span className="pointer-events-none absolute inset-y-0 end-3 flex items-center">
                          <SearchIcon />
                        </span>
                      </div>
                    ) : null}
                    <div className="flex flex-col gap-3">
                      {visible.map((option) => {
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
                            <span className="text-filtertext">{toFaDigits(option.count)}</span>
                          </label>
                        );
                      })}
                      {visible.length === 0 ? <p className="text-[13px] text-filtertext">موردی نیست</p> : null}
                    </div>
                  </>
                )}
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="mx-auto flex w-full max-w-[1208px] flex-col gap-6 px-4 pb-16 pt-4 lg:flex-row lg:items-start lg:gap-8 lg:px-6 lg:pt-7">
      <aside className="w-full shrink-0 lg:w-64">
        <details open className="rounded-lg bg-white p-4 lg:contents lg:bg-transparent lg:p-0">
          <summary className="cursor-pointer text-[16px] font-bold lg:hidden">فیلترها</summary>
          <div className="pt-4 lg:pt-0">{sidebar}</div>
        </details>
      </aside>
      <div className="min-w-0 flex-1">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-[340px]">
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              className="block h-[42px] w-full rounded-lg border-2 border-inputgray bg-inputgray pe-10 ps-3 text-[14px] outline-none placeholder:text-filtertext focus:border-focusblue focus:bg-white"
            />
            <span className="pointer-events-none absolute inset-y-0 end-3 flex items-center">
              <SearchIcon />
            </span>
          </div>
          <label className="flex min-h-[42px] items-center gap-2 rounded-lg bg-[rgb(244,244,244)] px-3.5 text-[14px]">
            <SortIcon />
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              aria-label="مرتب‌سازی آگهی‌ها"
              className="h-[42px] min-w-[8rem] bg-transparent px-1"
            >
              {SORTS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        {chips.length > 0 ? (
          <div className="mb-5 flex flex-wrap gap-2">
            {chips.map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={chip.clear}
                aria-label={`حذف فیلتر ${chip.label}`}
                className="inline-flex max-w-fit items-center gap-2 rounded-full bg-white px-3 py-1 text-[14px] leading-[20px] outline outline-[0.8px] outline-cardborder"
              >
                <span>{chip.label}</span>
                <span aria-hidden="true" className="text-filtertext">
                  ×
                </span>
              </button>
            ))}
          </div>
        ) : null}
        <p className="mb-5 text-[14px] leading-[14px] text-filtertext">{countText}</p>
        <AccountOffersGrid offers={rows} embedded />
      </div>
    </div>
  );
}
