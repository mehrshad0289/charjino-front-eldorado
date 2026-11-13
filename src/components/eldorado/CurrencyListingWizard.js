"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createListing, placeListing, updateListing, uploadListingImage } from "@/actions/market.actions";
import {
  CURRENCY_PHOTO_SLOTS,
  LISTING_SECTIONS,
  LISTING_TITLE_MIN,
  formatToman,
  listingMediaUrl,
  listingPriceError,
  parseToman,
} from "@/lib/listing";
import { CURRENCY_LISTING_COPY, LISTING_COPY } from "./data/listingData";

const inputClass =
  "block h-[42px] w-full rounded-lg border-2 border-[rgb(239,239,241)] bg-[rgb(239,239,241)] px-3 text-[14px] text-ink outline-none";
const invalidClass = "border-[rgb(232,27,22)] bg-[rgb(255,244,244)]";
const cardShadow = "0 2px 4px 0 rgba(9,9,11,0.05), 0 12px 8px 0 rgba(9,9,11,0.02)";

function controlClass(invalid) {
  return `${inputClass} mt-1 ${invalid ? invalidClass : ""}`;
}

function initialPhotos(listing) {
  const next = {};
  for (const slot of CURRENCY_PHOTO_SLOTS) {
    const server = (listing?.images || []).find((image) => image.slot === slot.slot) || null;
    next[slot.slot] = { file: null, previewUrl: listingMediaUrl(server?.url || ""), server };
  }
  return next;
}

export default function CurrencyListingWizard({ games = [], listing = null, blockers = [] }) {
  const router = useRouter();
  const blocked = blockers.length > 0;
  const initialGame = games.find((row) => row.game_name === listing?.game_name) || null;
  const [query, setQuery] = useState("");
  const [game, setGame] = useState(initialGame);
  const [region, setRegion] = useState(listing?.attributes?.region || initialGame?.regions?.[0] || "");
  const [delivery, setDelivery] = useState(listing?.delivery_method || initialGame?.delivery_methods?.[0]?.value || "");
  const [minutes, setMinutes] = useState(listing?.delivery_minutes ? String(listing.delivery_minutes) : "20");
  const [title, setTitle] = useState(listing?.title || "");
  const [description, setDescription] = useState(listing?.description || "");
  const [stock, setStock] = useState(listing?.stock ? String(listing.stock) : "1");
  const [minQuantity, setMinQuantity] = useState(listing?.min_quantity ? String(listing.min_quantity) : "1");
  const [price, setPrice] = useState(listing?.price_amount ? String(listing.price_amount) : "");
  const [photos, setPhotos] = useState(() => initialPhotos(listing));
  const [listingId, setListingId] = useState(listing?.id || "");
  const [loading, setLoading] = useState(false);
  const [issues, setIssues] = useState({});

  const unit = game?.unit_label || "";
  const filteredGames = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const rows = needle
      ? games.filter((row) => `${row.game_name_fa || ""} ${row.game_name || ""} ${row.publisher || ""}`.toLowerCase().includes(needle))
      : games;
    return rows.slice(0, 8);
  }, [games, query]);

  const photoReady = Boolean(photos.profile?.file || photos.profile?.server);
  const titleReady = title.trim().length >= LISTING_TITLE_MIN;
  const priceReady = !listingPriceError(price);
  const stockValue = Number(parseToman(stock) || 0);
  const minValue = Number(parseToman(minQuantity) || 0);
  const stockReady = stockValue >= 1 && minValue >= 1 && minValue <= stockValue;
  const minuteValue = Number(parseToman(minutes) || 0);
  const detailsReady =
    titleReady &&
    Boolean(delivery) &&
    minuteValue >= 5 &&
    minuteValue <= 1440 &&
    ((game?.regions || []).length === 0 || Boolean(region));
  const checks = [
    { id: "listing-game", label: "بازی", ok: Boolean(game) },
    { id: "listing-details", label: "مشخصات", ok: detailsReady },
    { id: "listing-media", label: "مدیا", ok: photoReady },
    { id: "listing-price", label: "قیمت", ok: priceReady && stockReady },
  ];

  function pickGame(row) {
    setGame(row);
    setRegion(row.regions?.[0] || "");
    setDelivery(row.delivery_methods?.[0]?.value || "");
    setIssues({});
  }

  function collectIssues(publish) {
    const next = {};
    if (!game) next.game = "بازی را انتخاب کن.";
    if ((game?.regions || []).length > 0 && !region) next.region = "ریجن را انتخاب کن.";
    if (!delivery) next.delivery = "روش تحویل را انتخاب کن.";
    if (minuteValue < 5 || minuteValue > 1440) next.minutes = CURRENCY_LISTING_COPY.minutesHint;
    if (title.trim().length < LISTING_TITLE_MIN) next.title = "عنوان را کامل‌تر بنویس.";
    if (!stockReady) next.stock = "موجودی و حداقل خرید باید عدد درست باشند.";
    if (listingPriceError(price)) next.price = listingPriceError(price);
    if (publish && !photoReady) next.photo = CURRENCY_LISTING_COPY.mediaMissing;
    return next;
  }

  function buildForm() {
    const payload = new FormData();
    payload.set("offer_type", "Currency");
    payload.set("title", title.trim());
    payload.set("description", description.trim());
    payload.set("game_name", game?.game_name || "");
    payload.set("publisher", game?.publisher || "");
    payload.set("delivery_method", delivery);
    payload.set("delivery_minutes", String(parseToman(minutes) || ""));
    payload.set("stock", String(parseToman(stock) || ""));
    payload.set("min_quantity", String(parseToman(minQuantity) || ""));
    payload.set("price_amount", String(parseToman(price)));
    payload.set("attributes", JSON.stringify(region ? { region } : {}));
    return payload;
  }

  async function uploadPending(id) {
    for (const slot of CURRENCY_PHOTO_SLOTS) {
      const row = photos[slot.slot];
      if (!row?.file) continue;
      const body = new FormData();
      body.set("listing_id", String(id));
      body.set("slot", slot.slot);
      body.set("file", row.file);
      const uploaded = await uploadListingImage(body);
      if (!uploaded.ok) return uploaded;
      setPhotos((current) => ({
        ...current,
        [slot.slot]: { file: null, previewUrl: listingMediaUrl(uploaded.data.url), server: uploaded.data },
      }));
    }
    return { ok: true };
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
        router.push("/login?next=/dashboard/offers/Currency/new");
        return;
      }
      setIssues({ form: saved.message || "ثبت آگهی انجام نشد." });
      return;
    }
    const id = saved.data?.id || listingId;
    setListingId(id);
    const media = await uploadPending(id);
    if (!media.ok) {
      setLoading(false);
      setIssues({ form: media.message || "آپلود عکس انجام نشد." });
      return;
    }
    if (publish) {
      const placed = await placeListing(id);
      setLoading(false);
      if (!placed.ok) {
        setIssues({ form: placed.message || "ارسال برای بررسی انجام نشد." });
        return;
      }
    } else {
      setLoading(false);
    }
    router.push("/dashboard/offers/Currency");
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
    return <p className="rounded-xl bg-white p-6 text-[14px] text-graytext">{CURRENCY_LISTING_COPY.noGames}</p>;
  }

  const previewCover = photos.profile?.previewUrl;
  const rateLabel = unit ? `نرخ هر ${unit} (تومان)` : CURRENCY_LISTING_COPY.rate;

  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start lg:gap-6">
      <div className="flex flex-col gap-4 pb-28 lg:pb-6">
        <nav className="flex gap-2 overflow-x-auto rounded-xl bg-white p-2" style={{ boxShadow: cardShadow }} aria-label="بخش‌های آگهی">
          {LISTING_SECTIONS.map((section, index) => {
            const done = checks.find((item) => item.id === section.id)?.ok;
            return (
              <a key={section.id} href={`#${section.id}`} className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg bg-[rgb(244,244,244)] px-3 text-[13px] font-bold">
                <span className={`flex size-6 items-center justify-center rounded-full ${done ? "bg-[rgb(33,150,83)] text-white" : "bg-white"}`}>
                  {done ? "✓" : index + 1}
                </span>
                {section.label}
              </a>
            );
          })}
        </nav>

        <section id="listing-game" className="rounded-xl bg-white p-5" style={{ boxShadow: cardShadow }}>
          <h2 className="text-[18px] font-bold">{LISTING_COPY.pickGame}</h2>
          <p className="mt-1 text-[14px] text-graytext">{CURRENCY_LISTING_COPY.gameHint}</p>
          <label className="mt-4 block text-[14px] font-bold" htmlFor="currency-game-search">
            {LISTING_COPY.searchGame}
            <input id="currency-game-search" value={query} onChange={(event) => setQuery(event.target.value)} className={controlClass(Boolean(issues.game))} />
          </label>
          <p className="mt-3 text-[13px] font-bold text-graytext">{query.trim() ? "نتیجه" : "پیشنهادی"}</p>
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
                  <span className="block text-[12px] text-graytext">
                    هر {row.unit_label} · {row.publisher || row.game_name}
                  </span>
                </button>
              );
            })}
          </div>
          {issues.game ? <p className="mt-2 text-[13px] text-[rgb(232,27,22)]">{issues.game}</p> : null}
        </section>

        <section id="listing-details" className="rounded-xl bg-white p-5" style={{ boxShadow: cardShadow }}>
          <h2 className="text-[18px] font-bold">مشخصات</h2>
          <p className="mt-1 text-[14px] text-graytext">{CURRENCY_LISTING_COPY.detailsHint}</p>
          <div className="mt-4 flex flex-col gap-4">
            {(game?.regions || []).length > 0 ? (
              <label className="text-[14px] font-bold">
                {CURRENCY_LISTING_COPY.region}
                <select value={region} onChange={(event) => setRegion(event.target.value)} className={controlClass(Boolean(issues.region))}>
                  {game.regions.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
            {issues.region ? <p className="text-[13px] text-[rgb(232,27,22)]">{issues.region}</p> : null}
            <label className="text-[14px] font-bold">
              {CURRENCY_LISTING_COPY.delivery}
              <select value={delivery} onChange={(event) => setDelivery(event.target.value)} className={controlClass(Boolean(issues.delivery))} disabled={!game}>
                {(game?.delivery_methods || []).map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            {issues.delivery ? <p className="text-[13px] text-[rgb(232,27,22)]">{issues.delivery}</p> : null}
            <label className="text-[14px] font-bold">
              {CURRENCY_LISTING_COPY.minutes}
              <input value={minutes} inputMode="numeric" onChange={(event) => setMinutes(event.target.value)} className={controlClass(Boolean(issues.minutes))} />
            </label>
            <p className="text-[13px] font-normal text-graytext">{CURRENCY_LISTING_COPY.minutesHint}</p>
            {issues.minutes ? <p className="text-[13px] text-[rgb(232,27,22)]">{issues.minutes}</p> : null}
            <label className="text-[14px] font-bold" htmlFor="currency-title">
              {LISTING_COPY.accountTitle}
              <input id="currency-title" value={title} maxLength={120} onChange={(event) => setTitle(event.target.value)} className={controlClass(Boolean(issues.title))} />
            </label>
            {issues.title ? <p className="text-[13px] text-[rgb(232,27,22)]">{issues.title}</p> : null}
            <label className="text-[14px] font-bold" htmlFor="currency-description">
              {CURRENCY_LISTING_COPY.instructions}
              <textarea
                id="currency-description"
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
          <p className="mt-1 text-[14px] text-graytext">{CURRENCY_LISTING_COPY.photosHint}</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {CURRENCY_PHOTO_SLOTS.map((slot) => {
              const row = photos[slot.slot];
              const invalid = slot.required && Boolean(issues.photo) && !row?.previewUrl;
              return (
                <div key={slot.slot} className={`rounded-lg p-3 ${invalid ? "bg-[rgb(255,244,244)] ring-2 ring-[rgb(232,27,22)]" : "bg-[rgb(244,244,244)]"}`}>
                  <p className="text-[13px] font-bold">
                    {slot.label}
                    {slot.required ? " *" : ""}
                  </p>
                  <p className="text-[12px] text-graytext">{slot.hint}</p>
                  {row?.previewUrl ? (
                    <img src={row.previewUrl} alt="" className="mt-2 h-28 w-full rounded-lg object-cover" />
                  ) : (
                    <div className="mt-2 flex h-28 items-center justify-center rounded-lg border border-dashed border-[rgb(198,198,204)] text-[12px] text-graytext">
                      jpg / png / webp
                    </div>
                  )}
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
            <label className="text-[14px] font-bold" htmlFor="currency-stock">
              {CURRENCY_LISTING_COPY.stock}
              {unit ? ` (${unit})` : ""}
              <input id="currency-stock" value={stock} inputMode="numeric" onChange={(event) => setStock(event.target.value)} className={controlClass(Boolean(issues.stock))} />
            </label>
            <label className="text-[14px] font-bold" htmlFor="currency-min">
              {CURRENCY_LISTING_COPY.min}
              <input id="currency-min" value={minQuantity} inputMode="numeric" onChange={(event) => setMinQuantity(event.target.value)} className={controlClass(Boolean(issues.stock))} />
            </label>
          </div>
          {issues.stock ? <p className="mt-2 text-[13px] text-[rgb(232,27,22)]">{issues.stock}</p> : null}
          <label className="mt-4 block text-[14px] font-bold" htmlFor="currency-price">
            {rateLabel}
            <input id="currency-price" value={price} inputMode="numeric" dir="ltr" onChange={(event) => setPrice(event.target.value)} className={`${controlClass(Boolean(issues.price))} text-start`} />
            <span className="mt-2 block font-normal text-graytext">{parseToman(price) ? `${formatToman(parseToman(price))} تومان` : ""}</span>
          </label>
          {issues.price ? <p className="mt-2 text-[13px] text-[rgb(232,27,22)]">{issues.price}</p> : null}
          <p className="mt-4 text-[13px] leading-[20px] text-graytext">{game?.rwt_notice || CURRENCY_LISTING_COPY.rwtFallback}</p>
        </section>
        {issues.form ? <p className="text-[14px] text-[rgb(232,27,22)]">{issues.form}</p> : null}
      </div>

      <aside className="mt-4 lg:sticky lg:top-[var(--shop-header-h)] lg:mt-0">
        <div className="rounded-xl bg-white p-4" style={{ boxShadow: cardShadow }}>
          <p className="text-[13px] font-bold text-graytext">پیش‌نمایش آگهی</p>
          {previewCover ? (
            <img src={previewCover} alt="" className="mt-3 h-36 w-full rounded-lg object-cover" />
          ) : (
            <div className="mt-3 flex h-36 items-center justify-center rounded-lg bg-[rgb(244,244,244)] text-[13px] text-graytext">بدون عکس</div>
          )}
          <p className="mt-3 text-[16px] font-bold">{title.trim() || "عنوان آگهی"}</p>
          <p className="text-[13px] text-graytext">{game?.game_name_fa || game?.game_name || "بازی انتخاب نشده"}</p>
          <p className="mt-1 text-[14px] text-graytext">
            {game?.delivery_methods?.find((item) => item.value === delivery)?.label || CURRENCY_LISTING_COPY.delivery}
            {unit ? ` · هر ${unit}` : ""}
          </p>
          <p className="mt-1 text-[18px] font-bold">{parseToman(price) ? `${formatToman(parseToman(price))} تومان` : "قیمت"}</p>
          <p className="mt-4 text-[13px] text-graytext">{LISTING_COPY.liveNote}</p>
          <div className="mt-4 hidden flex-col gap-2 lg:flex">
            <button type="button" disabled={loading} onClick={() => onSave(true)} className="inline-flex min-h-[42px] items-center justify-center rounded-lg bg-brand px-4 text-[14px] font-bold text-ink disabled:opacity-60">
              {loading ? "…" : LISTING_COPY.place}
            </button>
            <button type="button" disabled={loading} onClick={() => onSave(false)} className="inline-flex min-h-[42px] items-center justify-center rounded-lg border-2 border-ink px-4 text-[14px] font-bold disabled:opacity-60">
              {LISTING_COPY.saveDraft}
            </button>
          </div>
        </div>
      </aside>

      <div className="fixed inset-x-0 bottom-0 z-30 flex gap-2 border-t border-[rgb(231,231,231)] bg-white p-3 lg:hidden">
        <button type="button" disabled={loading} onClick={() => onSave(false)} className="inline-flex min-h-[42px] flex-1 items-center justify-center rounded-lg border-2 border-ink text-[14px] font-bold disabled:opacity-60">
          پیش‌نویس
        </button>
        <button type="button" disabled={loading} onClick={() => onSave(true)} className="inline-flex min-h-[42px] flex-[2] items-center justify-center rounded-lg bg-brand text-[14px] font-bold text-ink disabled:opacity-60">
          {loading ? "…" : LISTING_COPY.place}
        </button>
      </div>
    </div>
  );
}
