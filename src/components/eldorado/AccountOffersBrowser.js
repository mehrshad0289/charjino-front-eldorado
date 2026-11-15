"use client";

import { useMemo, useState } from "react";
import AccountOffersGrid from "./AccountOffersGrid";
import { toFaDigits } from "../../lib/fa-digits";
import EldSelect from "./EldSelect";
import PriceField from "./PriceField";
import ShopBottomSheet from "./ShopBottomSheet";
import { FA } from "./data/faCopy";

const SORTS = [
  { id: "newest", label: FA.sortRecommended },
  { id: "price_asc", label: FA.sortPriceAsc },
  { id: "price_desc", label: FA.sortPriceDesc },
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

function Chevron() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SortIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 4v13M7 17l-3-3M7 17l3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 20V7M17 7l-3 3M17 7l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 5h16l-6.2 8.1V19l-3.6 1.8v-7.7L4 5z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12.5 9.2 17 19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [draft, setDraft] = useState(null);

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
    setPriceMin(value);
  }

  function changePriceMax(value) {
    setPricePreset("");
    setPriceMax(value);
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

  function snapshotFilters() {
    return {
      priceMin,
      priceMax,
      pricePreset,
      picked: { ...picked },
      numberBand: Object.fromEntries(Object.entries(numberBand).map(([key, value]) => [key, { ...value }])),
      facetQuery: { ...facetQuery },
    };
  }

  function emptyFilters() {
    return { priceMin: "", priceMax: "", pricePreset: "", picked: {}, numberBand: {}, facetQuery: {} };
  }

  function applySnapshot(next) {
    setPriceMin(next.priceMin);
    setPriceMax(next.priceMax);
    setPricePreset(next.pricePreset);
    setPicked(next.picked);
    setNumberBand(next.numberBand);
    setFacetQuery(next.facetQuery);
  }

  function clearFilters() {
    applySnapshot(emptyFilters());
  }

  function openFilters() {
    setDraft(snapshotFilters());
    setFilterOpen(true);
  }

  function closeFilters() {
    setFilterOpen(false);
    setDraft(null);
  }

  function applyDraft() {
    if (draft) applySnapshot(draft);
    closeFilters();
  }

  function clearDraft() {
    setDraft(emptyFilters());
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
  const sortLabel = SORTS.find((item) => item.id === sort)?.label || FA.sortRecommended;

  function FilterFields({ idPrefix = "desk", source = null, onChange = null }) {
    const usingDraft = Boolean(source && onChange);
    const priceMinValue = usingDraft ? source.priceMin : priceMin;
    const priceMaxValue = usingDraft ? source.priceMax : priceMax;
    const pricePresetValue = usingDraft ? source.pricePreset : pricePreset;
    const pickedValue = usingDraft ? source.picked : picked;
    const numberBandValue = usingDraft ? source.numberBand : numberBand;
    const facetQueryValue = usingDraft ? source.facetQuery : facetQuery;
    const patch = (partial) => onChange((current) => ({ ...current, ...partial }));
    const onPriceMin = (value) =>
      usingDraft ? patch({ priceMin: value, pricePreset: "" }) : changePriceMin(value);
    const onPriceMax = (value) =>
      usingDraft ? patch({ priceMax: value, pricePreset: "" }) : changePriceMax(value);
    const onPreset = (preset) => {
      if (!usingDraft) {
        applyPreset(preset);
        return;
      }
      if (source.pricePreset === preset.id) {
        patch({ pricePreset: "", priceMin: "", priceMax: "" });
        return;
      }
      patch({
        pricePreset: preset.id,
        priceMin: preset.min != null ? String(preset.min) : "",
        priceMax: preset.max != null ? String(preset.max) : "",
      });
    };
    const onToggle = (key, value) => {
      if (!usingDraft) {
        toggleValue(key, value);
        return;
      }
      const list = source.picked[key] || [];
      const next = list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
      patch({ picked: { ...source.picked, [key]: next } });
    };
    const onBand = (key, edge, value) => {
      if (!usingDraft) {
        setBand(key, edge, value);
        return;
      }
      patch({
        numberBand: { ...source.numberBand, [key]: { ...source.numberBand[key], [edge]: onlyDigits(value) } },
      });
    };
    const onFacetSearch = (key, value) => {
      if (!usingDraft) {
        setFacetQuery((current) => ({ ...current, [key]: value }));
        return;
      }
      patch({ facetQuery: { ...source.facetQuery, [key]: value } });
    };
    return (
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
            <PriceField
              label=""
              placeholder="از"
              ariaLabel="حداقل قیمت"
              value={priceMinValue}
              onChange={onPriceMin}
            />
            <span className="text-graytext">تا</span>
            <PriceField
              label=""
              placeholder="تا"
              ariaLabel="حداکثر قیمت"
              value={priceMaxValue}
              onChange={onPriceMax}
            />
          </div>
          {pricePresets.length > 0 ? (
            <div className="flex flex-col gap-3">
              {pricePresets.map((preset) => (
                <label key={preset.id} className="flex h-6 items-center gap-2 text-[14px] leading-[20px]">
                  <input
                    type="radio"
                    name={`${idPrefix}-item-price-preset`}
                    checked={pricePresetValue === preset.id}
                    onChange={() => onPreset(preset)}
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
        const search = (facetQueryValue[field.key] || "").trim();
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
                    value={numberBandValue[field.key]?.min || ""}
                    onChange={(event) => onBand(field.key, "min", event.target.value)}
                    placeholder={field.min != null ? String(field.min) : "از"}
                    aria-label={`${field.label_fa} از`}
                    className="h-[42px] w-full rounded-lg bg-inputgray px-3"
                  />
                  <span className="text-graytext">تا</span>
                  <input
                    inputMode="numeric"
                    value={numberBandValue[field.key]?.max || ""}
                    onChange={(event) => onBand(field.key, "max", event.target.value)}
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
                        value={facetQueryValue[field.key] || ""}
                        onChange={(event) => onFacetSearch(field.key, event.target.value)}
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
                      const checked = (pickedValue[field.key] || []).includes(option.value);
                      return (
                        <label key={option.value} className="flex items-center justify-between gap-2 text-[14px] leading-[20px]">
                          <span className="flex min-w-0 items-center gap-2">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => onToggle(field.key, option.value)}
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
    );
  }

  const sidebar = (
    <div className="lg:sticky lg:top-[var(--shop-header-h)] lg:max-h-[calc(100vh-var(--shop-header-h))] lg:overflow-y-auto lg:pe-4">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-[20px] font-bold leading-[30px]">{FA.filters}</h2>
        {chips.length ? (
          <button type="button" onClick={clearFilters} className="text-[14px] font-bold text-linkblue">
            {FA.clearFilters}
          </button>
        ) : null}
      </div>
      <FilterFields idPrefix="desk" />
    </div>
  );

  const chipRow =
    chips.length > 0 ? (
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
    ) : null;

  const searchField = (
    <div className="relative min-w-0 w-full">
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
  );

  return (
    <div className="mx-auto flex w-full max-w-[1208px] flex-col gap-6 px-4 pb-16 pt-4 lg:flex-row lg:items-start lg:gap-8 lg:px-6 lg:pt-7">
      <aside className="hidden w-full shrink-0 lg:block lg:w-64">{sidebar}</aside>
      <div className="min-w-0 flex-1">
        <div className="mb-4 lg:hidden">
          <div className="mb-4 flex items-center gap-2">
            <div className="min-w-0 flex-1">{searchField}</div>
            <button
              type="button"
              onClick={openFilters}
              aria-label={FA.filters}
              aria-haspopup="dialog"
              aria-expanded={filterOpen}
              className={`relative flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-lg bg-white text-ink outline outline-1 ${
                chips.length ? "outline-ink" : "outline-cardborder"
              }`}
            >
              <FilterIcon />
              {chips.length ? (
                <span className="absolute -top-1 -start-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-0.5 text-[10px] font-bold text-ink">
                  {toFaDigits(chips.length)}
                </span>
              ) : null}
            </button>
          </div>
          {chipRow}
          <div className="flex min-h-10 items-center justify-between gap-3">
            <p className="text-[14px] leading-[14px] text-filtertext">{countText}</p>
            <button
              type="button"
              onClick={() => setSortOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={sortOpen}
              className="flex min-h-[42px] min-w-0 items-center gap-2 rounded-lg px-1 text-[14px] text-ink"
            >
              <SortIcon />
              <span className="truncate">{sortLabel}</span>
              <span className="text-filtertext">
                <Chevron />
              </span>
            </button>
          </div>
        </div>

        <div className="mb-5 hidden flex-col gap-4 lg:flex sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full max-w-[340px]">{searchField}</div>
          <EldSelect
            className="w-full min-w-0 sm:w-[12.5rem]"
            ariaLabel={FA.sortBy}
            value={sort}
            onChange={setSort}
            options={SORTS.map((item) => ({ value: item.id, label: item.label }))}
          />
        </div>
        <div className="hidden lg:block">
          {chipRow}
          <p className="mb-5 text-[14px] leading-[14px] text-filtertext">{countText}</p>
        </div>
        <AccountOffersGrid offers={rows} embedded />
      </div>

      <ShopBottomSheet
        open={filterOpen}
        title={FA.filters}
        onClose={closeFilters}
        footer={
          <div className="flex gap-2">
            <button
              type="button"
              onClick={clearDraft}
              className="inline-flex min-h-[42px] flex-1 items-center justify-center rounded-lg border-2 border-ink text-[14px] font-bold"
            >
              {FA.clearFilters}
            </button>
            <button
              type="button"
              onClick={applyDraft}
              className="inline-flex min-h-[42px] flex-[2] items-center justify-center rounded-lg bg-brand text-[14px] font-bold text-ink"
            >
              {FA.applyFilters}
            </button>
          </div>
        }
      >
        {draft ? <FilterFields idPrefix="sheet" source={draft} onChange={setDraft} /> : null}
      </ShopBottomSheet>

      <ShopBottomSheet open={sortOpen} title={FA.sortBy} onClose={() => setSortOpen(false)}>
        <ul className="pb-2">
          {SORTS.map((item) => {
            const active = item.id === sort;
            return (
              <li key={item.id} className="mb-2">
                <button
                  type="button"
                  onClick={() => {
                    setSort(item.id);
                    setSortOpen(false);
                  }}
                  className={`flex h-14 w-full items-center justify-between rounded-lg px-5 text-start text-base text-ink ${
                    active ? "bg-badgebg" : ""
                  }`}
                >
                  <span>{item.label}</span>
                  {active ? (
                    <span className="text-ink" aria-hidden="true">
                      <CheckIcon />
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      </ShopBottomSheet>
    </div>
  );
}
