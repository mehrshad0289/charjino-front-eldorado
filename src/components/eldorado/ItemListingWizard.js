"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createListing, placeListing, updateListing, uploadListingImage } from "@/actions/market.actions";
import { LISTING_PHOTO_SLOTS, LISTING_SECTIONS, LISTING_TITLE_MIN, formatToman, listingMediaUrl, listingPriceError, parseToman } from "@/lib/listing";
import { ITEM_LISTING_COPY, LISTING_COPY } from "./data/listingData";

const inputClass =
  "block h-[42px] w-full rounded-lg border-2 border-[rgb(239,239,241)] bg-[rgb(239,239,241)] px-3 text-[14px] text-ink outline-none";
const invalidClass = "border-[rgb(232,27,22)] bg-[rgb(255,244,244)]";
const cardShadow = "0 2px 4px 0 rgba(9,9,11,0.05), 0 12px 8px 0 rgba(9,9,11,0.02)";

function controlClass(invalid) {
  return `${inputClass} mt-1 ${invalid ? invalidClass : ""}`;
}

function initialPhotos(listing) {
  const next = {};
  for (const slot of LISTING_PHOTO_SLOTS) {
    const server = (listing?.images || []).find((image) => image.slot === slot.slot) || null;
    next[slot.slot] = { file: null, previewUrl: listingMediaUrl(server?.url || ""), server };
  }
  return next;
}

export default function ItemListingWizard({ games = [], listing = null, blockers = [] }) {
  const router = useRouter();
  const blocked = blockers.length > 0;
  const initialGame = games.find((row) => row.game_name === listing?.game_name) || null;
  const [query, setQuery] = useState("");
  const [game, setGame] = useState(initialGame);
  const [typeId, setTypeId] = useState(listing?.item_type_id || initialGame?.types?.[0]?.id || null);
  const [title, setTitle] = useState(listing?.title || "");
  const [description, setDescription] = useState(listing?.description || "");
  const [attributes, setAttributes] = useState(listing?.attributes || {});
  const [stock, setStock] = useState(listing?.stock ? String(listing.stock) : "1");
  const [minQuantity, setMinQuantity] = useState(listing?.min_quantity ? String(listing.min_quantity) : "1");
  const [price, setPrice] = useState(listing?.price_amount ? String(listing.price_amount) : "");
  const [photos, setPhotos] = useState(() => initialPhotos(listing));
  const [listingId, setListingId] = useState(listing?.id || "");
  const [loading, setLoading] = useState(false);
  const [issues, setIssues] = useState({});

  const type = game?.types?.find((row) => row.id === typeId) || game?.types?.[0] || null;
  const filters = type?.filters || [];
  const filteredGames = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const rows = needle
      ? games.filter((row) => `${row.game_name_fa || ""} ${row.game_name || ""} ${row.publisher || ""}`.toLowerCase().includes(needle))
      : games;
    return rows.slice(0, 8);
  }, [games, query]);

  function pickGame(row) {
    setGame(row);
    setTypeId(row.types?.[0]?.id || null);
    setAttributes({});
    setIssues({});
  }

  function collectIssues(publish) {
    const next = {};
    if (!game || !type) next.game = "بازی و نوع آیتم را انتخاب کن.";
    if (title.trim().length < LISTING_TITLE_MIN) next.title = "عنوان را کامل‌تر بنویس.";
    for (const filter of filters) {
      if (filter.required && !String(attributes[filter.key] || "").trim()) next[filter.key] = `${filter.name} را انتخاب کن.`;
    }
    const stockValue = Number(parseToman(stock) || 0);
    const minValue = Number(parseToman(minQuantity) || 0);
    if (stockValue < 1 || minValue < 1 || minValue > stockValue) next.stock = "موجودی و حداقل خرید باید عدد درست باشند.";
    if (listingPriceError(price)) next.price = listingPriceError(price);
    if (publish && !(photos.profile?.file || photos.profile?.server)) next.photo = "عکس کالا را انتخاب کن.";
    return next;
  }

  function buildForm() {
    const payload = new FormData();
    payload.set("offer_type", "CustomItem");
    payload.set("title", title.trim());
    payload.set("description", description.trim());
    payload.set("game_name", game?.game_name || "");
    payload.set("publisher", game?.publisher || "");
    payload.set("item_type_id", String(type?.id || ""));
    payload.set("stock", String(parseToman(stock) || ""));
    payload.set("min_quantity", String(parseToman(minQuantity) || ""));
    payload.set("price_amount", String(parseToman(price)));
    payload.set("attributes", JSON.stringify(attributes));
    return payload;
  }

  async function onSave(publish) {
    const nextIssues = collectIssues(publish);
    if (Object.keys(nextIssues).length) {
      setIssues(nextIssues);
      return;
    }
    setLoading(true);
    const saved = listingId ? await updateListing(listingId, buildForm()) : await createListing(buildForm());
    if (!saved.ok) {
      setLoading(false);
      if (saved.unauthorized) {
        router.push("/login?next=/dashboard/offers/CustomItem/new");
        return;
      }
      setIssues({ form: saved.message || "ثبت آگهی انجام نشد." });
      return;
    }
    const id = saved.data?.id || listingId;
    setListingId(id);
    if (publish) {
      for (const slot of LISTING_PHOTO_SLOTS) {
        const row = photos[slot.slot];
        if (!row?.file) continue;
        const body = new FormData();
        body.set("listing_id", String(id));
        body.set("slot", slot.slot);
        body.set("file", row.file);
        const uploaded = await uploadListingImage(body);
        if (!uploaded.ok) {
          setLoading(false);
          setIssues({ form: uploaded.message || "آپلود عکس انجام نشد." });
          return;
        }
      }
      const placed = await placeListing(id);
      setLoading(false);
      if (!placed.ok) {
        setIssues({ form: placed.message || "ارسال برای بررسی انجام نشد." });
        return;
      }
    } else {
      setLoading(false);
    }
    router.push("/dashboard/offers/CustomItem");
    router.refresh();
  }

  if (blocked) {
    return (
      <div className="rounded-xl bg-white p-6" style={{ boxShadow: cardShadow }}>
        <p className="text-[24px] font-bold">{LISTING_COPY.blockedTitle}</p>
        <ul className="mt-3 list-disc ps-5 text-graytext">
          {blockers.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <Link href="/verify/status" className="mt-5 inline-flex min-h-[42px] items-center rounded-lg bg-ink px-4 text-[14px] font-bold text-white">
          ادامه احراز / شبا
        </Link>
      </div>
    );
  }

  if (games.length === 0) {
    return <p className="rounded-xl bg-white p-6 text-[14px] text-graytext">{ITEM_LISTING_COPY.noGames}</p>;
  }

  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start lg:gap-6">
      <div className="flex flex-col gap-4 pb-28 lg:pb-6">
        <nav className="flex gap-2 overflow-x-auto rounded-xl bg-white p-2" style={{ boxShadow: cardShadow }} aria-label="بخش‌های آگهی">
          {LISTING_SECTIONS.map((section, index) => (
            <a key={section.id} href={`#${section.id}`} className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg bg-[rgb(244,244,244)] px-3 text-[13px] font-bold">
              <span className="flex size-6 items-center justify-center rounded-full bg-white">{index + 1}</span>
              {section.label}
            </a>
          ))}
        </nav>

        <section id="listing-game" className="rounded-xl bg-white p-5" style={{ boxShadow: cardShadow }}>
          <h2 className="text-[18px] font-bold">{LISTING_COPY.pickGame}</h2>
          <p className="mt-1 text-[14px] text-graytext">{ITEM_LISTING_COPY.gameHint}</p>
          <label className="mt-4 block text-[14px] font-bold" htmlFor="item-game-search">
            {LISTING_COPY.searchGame}
            <input id="item-game-search" value={query} onChange={(event) => setQuery(event.target.value)} className={controlClass(Boolean(issues.game))} />
          </label>
          <p className="mt-3 text-[13px] font-bold text-graytext">{query.trim() ? "نتیجه" : ITEM_LISTING_COPY.recommended}</p>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {filteredGames.map((row) => {
              const selected = game?.id === row.id;
              return (
                <button
                  key={row.id}
                  type="button"
                  onClick={() => pickGame(row)}
                  className={`rounded-lg border-2 px-3 py-3 text-start ${selected ? "border-ink bg-[rgb(255,201,80)]" : "border-transparent bg-[rgb(239,239,241)]"}`}
                >
                  <span className="block text-[14px] font-bold">{row.game_name_fa || row.game_name}</span>
                  <span className="block text-[12px] text-graytext">{row.publisher || row.game_name}</span>
                </button>
              );
            })}
          </div>
          {issues.game ? <p className="mt-2 text-[13px] text-[rgb(232,27,22)]">{issues.game}</p> : null}
        </section>

        <section id="listing-details" className="rounded-xl bg-white p-5" style={{ boxShadow: cardShadow }}>
          <h2 className="text-[18px] font-bold">{LISTING_COPY.detailsStep}</h2>
          <div className="mt-4 flex flex-col gap-4">
            <label className="text-[14px] font-bold" htmlFor="item-type">
              {ITEM_LISTING_COPY.type}
              <select
                id="item-type"
                value={type?.id || ""}
                onChange={(event) => {
                  setTypeId(Number(event.target.value));
                  setAttributes({});
                }}
                className={controlClass(false)}
                disabled={!game}
              >
                {(game?.types || []).map((row) => (
                  <option key={row.id} value={row.id}>
                    {row.name}
                  </option>
                ))}
              </select>
            </label>
            <p className="text-[14px]">
              <span className="font-bold">{ITEM_LISTING_COPY.delivery}: </span>
              {type?.delivery_label || "بعد از انتخاب نوع"}
            </p>
            <label className="text-[14px] font-bold" htmlFor="item-title">
              {LISTING_COPY.accountTitle}
              <input id="item-title" value={title} maxLength={120} onChange={(event) => setTitle(event.target.value)} className={controlClass(Boolean(issues.title))} />
            </label>
            {issues.title ? <p className="text-[13px] text-[rgb(232,27,22)]">{issues.title}</p> : null}
            {filters.map((filter) => (
              <label key={filter.key} className="text-[14px] font-bold" htmlFor={`item-${filter.key}`}>
                {filter.name}
                {filter.required ? " *" : ""}
                {filter.options?.length ? (
                  <select
                    id={`item-${filter.key}`}
                    value={attributes[filter.key] || ""}
                    onChange={(event) => setAttributes((current) => ({ ...current, [filter.key]: event.target.value }))}
                    className={controlClass(Boolean(issues[filter.key]))}
                  >
                    <option value="">انتخاب کن</option>
                    {filter.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={`item-${filter.key}`}
                    value={attributes[filter.key] || ""}
                    onChange={(event) => setAttributes((current) => ({ ...current, [filter.key]: event.target.value }))}
                    className={controlClass(Boolean(issues[filter.key]))}
                  />
                )}
              </label>
            ))}
            <label className="text-[14px] font-bold" htmlFor="item-description">
              {LISTING_COPY.description}
              <textarea
                id="item-description"
                value={description}
                rows={4}
                onChange={(event) => setDescription(event.target.value)}
                className="mt-1 w-full rounded-lg border-2 border-[rgb(239,239,241)] bg-[rgb(239,239,241)] p-3 text-[14px] outline-none"
              />
            </label>
          </div>
        </section>

        <section id="listing-media" className="rounded-xl bg-white p-5" style={{ boxShadow: cardShadow }}>
          <h2 className="text-[18px] font-bold">مدیا</h2>
          <p className="mt-1 text-[14px] text-graytext">مثل آگهی اکانت، عکس کالا لازم است.</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {LISTING_PHOTO_SLOTS.map((slot) => {
              const row = photos[slot.slot];
              return (
                <div key={slot.slot} className="rounded-lg bg-[rgb(244,244,244)] p-3">
                  <p className="text-[13px] font-bold">{slot.label}</p>
                  {row?.previewUrl ? <img src={row.previewUrl} alt="" className="mt-2 h-28 w-full rounded-lg object-cover" /> : null}
                  <label className="mt-2 inline-flex min-h-9 cursor-pointer items-center rounded-lg bg-ink px-3 text-[12px] font-bold text-white">
                    انتخاب
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="sr-only"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (!file) return;
                        const previewUrl = URL.createObjectURL(file);
                        setPhotos((current) => ({ ...current, [slot.slot]: { file, previewUrl, server: null } }));
                      }}
                    />
                  </label>
                </div>
              );
            })}
          </div>
          {issues.photo ? <p className="mt-2 text-[13px] text-[rgb(232,27,22)]">{issues.photo}</p> : null}
        </section>

        <section id="listing-price" className="rounded-xl bg-white p-5" style={{ boxShadow: cardShadow }}>
          <h2 className="text-[18px] font-bold">{LISTING_COPY.priceStep}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-[14px] font-bold" htmlFor="item-stock">
              {ITEM_LISTING_COPY.stock}
              <input id="item-stock" value={stock} inputMode="numeric" onChange={(event) => setStock(event.target.value)} className={controlClass(Boolean(issues.stock))} />
            </label>
            <label className="text-[14px] font-bold" htmlFor="item-min">
              {ITEM_LISTING_COPY.min}
              <input id="item-min" value={minQuantity} inputMode="numeric" onChange={(event) => setMinQuantity(event.target.value)} className={controlClass(Boolean(issues.stock))} />
            </label>
          </div>
          {issues.stock ? <p className="mt-2 text-[13px] text-[rgb(232,27,22)]">{issues.stock}</p> : null}
          <label className="mt-4 block text-[14px] font-bold" htmlFor="item-price">
            {ITEM_LISTING_COPY.unitPrice}
            <input id="item-price" value={price} inputMode="numeric" dir="ltr" onChange={(event) => setPrice(event.target.value)} className={`${controlClass(Boolean(issues.price))} text-start`} />
            <span className="mt-2 block font-normal text-graytext">{parseToman(price) ? `${formatToman(parseToman(price))} تومان` : ""}</span>
          </label>
          {issues.price ? <p className="mt-2 text-[13px] text-[rgb(232,27,22)]">{issues.price}</p> : null}
        </section>
        {issues.form ? <p className="text-[14px] text-[rgb(232,27,22)]">{issues.form}</p> : null}
      </div>

      <aside className="mt-4 lg:sticky lg:top-[var(--shop-header-h)] lg:mt-0">
        <div className="rounded-xl bg-white p-4" style={{ boxShadow: cardShadow }}>
          <p className="text-[13px] font-bold text-graytext">پیش‌نمایش آگهی</p>
          <p className="mt-3 text-[16px] font-bold">{title.trim() || "عنوان آگهی"}</p>
          <p className="text-[13px] text-graytext">
            {game?.game_name_fa || game?.game_name || "بازی انتخاب نشده"}
            {type ? ` · ${type.name}` : ""}
          </p>
          <p className="mt-1 text-[14px] text-graytext">{type?.delivery_label || ITEM_LISTING_COPY.delivery}</p>
          <p className="mt-1 text-[18px] font-bold">{parseToman(price) ? `${formatToman(parseToman(price))} تومان` : "قیمت"}</p>
          <p className="mt-4 text-[13px] text-graytext">{LISTING_COPY.liveNote}</p>
          <div className="mt-4 flex flex-col gap-2">
            <button type="button" disabled={loading} onClick={() => onSave(true)} className="inline-flex min-h-[42px] items-center justify-center rounded-lg bg-brand px-4 text-[14px] font-bold text-ink disabled:opacity-60">
              {loading ? "…" : LISTING_COPY.place}
            </button>
            <button type="button" disabled={loading} onClick={() => onSave(false)} className="inline-flex min-h-[42px] items-center justify-center rounded-lg border-2 border-ink px-4 text-[14px] font-bold disabled:opacity-60">
              {LISTING_COPY.saveDraft}
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
