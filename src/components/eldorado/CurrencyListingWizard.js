"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createListing, deleteListingImage, placeListing, updateListing, uploadListingImage } from "@/actions/market.actions";
import { CURRENCY_PHOTO_SLOTS, LISTING_SECTIONS, LISTING_TITLE_MIN, listingMediaUrl, listingPriceError, parseToman } from "@/lib/listing";
import { formatTomanInWords } from "@/lib/price";
import { CURRENCY_LISTING_COPY, LISTING_COPY } from "./data/listingData";
import {
  ListingFieldNote,
  ListingMobileBar,
  ListingPhotoTile,
  ListingPreviewAside,
  ListingSection,
  ListingStepNav,
  focusListingField,
  jumpToListingSection,
  listingCardShadow,
  listingControlClass,
} from "./ListingWizardChrome";
import LoadingSpinner from "./LoadingSpinner";
import EldSelect from "./EldSelect";
import OfferPlatformField, { offerPlatformReady } from "./OfferPlatformField";
import PriceField from "./PriceField";
import { OFFER_PLATFORM_KEY } from "@/lib/offer-platforms";

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
  const [activeSection, setActiveSection] = useState(LISTING_SECTIONS[0].id);
  const [query, setQuery] = useState("");
  const [game, setGame] = useState(initialGame);
  const [region, setRegion] = useState(listing?.attributes?.region || initialGame?.regions?.[0] || "");
  const [platform, setPlatform] = useState(listing?.attributes?.[OFFER_PLATFORM_KEY] || "");
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

  useEffect(() => {
    const id = window.location.hash.replace("#", "");
    if (!id.startsWith("listing-")) return undefined;
    const timer = window.setTimeout(() => jumpToListingSection(id, setActiveSection), 280);
    return () => window.clearTimeout(timer);
  }, []);

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
    ((game?.regions || []).length === 0 || Boolean(region)) &&
    offerPlatformReady(game?.offer_platforms, platform);
  const checks = [
    { id: "listing-game", label: "بازی", ok: Boolean(game) },
    { id: "listing-details", label: "مشخصات", ok: detailsReady },
    { id: "listing-media", label: "مدیا", ok: photoReady },
    { id: "listing-price", label: "قیمت", ok: priceReady && stockReady },
  ];

  function jump(id) {
    jumpToListingSection(id, setActiveSection);
  }

  function clearIssue(key) {
    setIssues((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  function pickGame(row) {
    setGame(row);
    setRegion(row.regions?.[0] || "");
    setPlatform("");
    setDelivery(row.delivery_methods?.[0]?.value || "");
    setIssues({});
    window.setTimeout(() => {
      jump("listing-details");
      focusListingField("listing-title");
    }, 180);
  }

  function setPhotoFile(slot, file) {
    if (!file) return;
    setPhotos((current) => {
      const previous = current[slot]?.previewUrl;
      if (previous?.startsWith("blob:")) URL.revokeObjectURL(previous);
      return {
        ...current,
        [slot]: { file, previewUrl: URL.createObjectURL(file), server: current[slot]?.server || null },
      };
    });
    clearIssue("photo");
    clearIssue(`photo-${slot}`);
  }

  async function removePhoto(slot) {
    const current = photos[slot];
    if (current?.server?.id && listingId) {
      const result = await deleteListingImage(listingId, current.server.id);
      if (!result.ok) {
        setIssues({ form: result.message || "حذف عکس انجام نشد." });
        return;
      }
    }
    if (current?.previewUrl?.startsWith("blob:")) URL.revokeObjectURL(current.previewUrl);
    setPhotos((rows) => ({ ...rows, [slot]: { file: null, previewUrl: "", server: null } }));
  }

  function collectIssues(publish) {
    const next = {};
    if (!game) next.game = "بازی را انتخاب کن.";
    if ((game?.regions || []).length > 0 && !region) next.region = "ریجن را انتخاب کن.";
    if (!offerPlatformReady(game?.offer_platforms, platform)) next.platform = "پلتفرم را انتخاب کن.";
    if (!delivery) next.delivery = "روش تحویل را انتخاب کن.";
    if (minuteValue < 5 || minuteValue > 1440) next.minutes = CURRENCY_LISTING_COPY.minutesHint;
    if (title.trim().length < LISTING_TITLE_MIN) next.title = "عنوان را کامل‌تر بنویس.";
    if (!stockReady) next.stock = "موجودی و حداقل خرید باید عدد درست باشند.";
    if (listingPriceError(price)) next.price = listingPriceError(price);
    if (publish && !photoReady) next.photo = CURRENCY_LISTING_COPY.mediaMissing;
    return next;
  }

  function firstIssueTarget(next) {
    if (next.game) return { section: "listing-game", fieldId: "listing-game-search" };
    if (next.platform) return { section: "listing-details", fieldId: "listing-offer-platform" };
    if (next.region) return { section: "listing-details", fieldId: "listing-region" };
    if (next.delivery) return { section: "listing-details", fieldId: "listing-delivery" };
    if (next.minutes) return { section: "listing-details", fieldId: "listing-minutes" };
    if (next.title) return { section: "listing-details", fieldId: "listing-title" };
    if (next.photo) return { section: "listing-media", fieldId: "listing-photo-profile" };
    if (next.stock) return { section: "listing-price", fieldId: "listing-stock" };
    if (next.price) return { section: "listing-price", fieldId: "listing-price" };
    return { section: "listing-details", fieldId: "listing-title" };
  }

  function sectionIssueText(id) {
    if (id === "listing-game") return issues.game || "";
    if (id === "listing-details") {
      return [issues.platform, issues.region, issues.delivery, issues.minutes, issues.title].filter(Boolean).join(" · ");
    }
    if (id === "listing-media") return issues.photo || "";
    if (id === "listing-price") return [issues.stock, issues.price].filter(Boolean).join(" · ");
    return "";
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
    const attrs = {};
    if (region) attrs.region = region;
    if (platform) attrs[OFFER_PLATFORM_KEY] = platform;
    payload.set("attributes", JSON.stringify(attrs));
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
      const target = firstIssueTarget(nextIssues);
      jump(target.section);
      window.setTimeout(() => focusListingField(target.fieldId), 280);
      return;
    }
    setLoading(true);
    setIssues({});
    const saved = listingId ? await updateListing(listingId, buildForm()) : await createListing(buildForm());
    if (!saved.ok) {
      setLoading(false);
      if (saved.unauthorized) {
        router.push("/login?next=/dashboard/offers/Currency/new");
        return;
      }
      if (saved.blocked) {
        router.push("/verify/status");
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
      jump("listing-media");
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
      <div className="rounded-xl bg-white p-6" style={{ boxShadow: listingCardShadow }}>
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
  const issueList = [...new Set(Object.entries(issues).filter(([key]) => key !== "form").map(([, message]) => message))];
  const saveButtons = (
    <>
      <button type="button" disabled={loading} onClick={() => onSave(true)} className="inline-flex min-h-[42px] items-center justify-center rounded-lg bg-brand px-4 text-[14px] font-bold text-ink disabled:opacity-60">
        {loading ? <LoadingSpinner variant="inline" className="text-ink" /> : LISTING_COPY.place}
      </button>
      <button type="button" disabled={loading} onClick={() => onSave(false)} className="inline-flex min-h-[42px] items-center justify-center rounded-lg border-2 border-ink px-4 text-[14px] font-bold disabled:opacity-60">
        {LISTING_COPY.saveDraft}
      </button>
    </>
  );

  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start lg:gap-6">
      <div className="flex flex-col gap-4 pb-28 lg:pb-6">
        <ListingStepNav checks={checks} activeSection={activeSection} onJump={jump} issueList={issueList} />

        <ListingSection id="listing-game" title={LISTING_COPY.pickGame} hint={CURRENCY_LISTING_COPY.gameHint}>
          <label className="text-[14px] font-bold" htmlFor="listing-game-search">
            {LISTING_COPY.searchGame}
            <input
              id="listing-game-search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                clearIssue("game");
              }}
              className={listingControlClass(Boolean(issues.game))}
            />
          </label>
          <ListingFieldNote message={issues.game} />
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
        </ListingSection>

        <ListingSection id="listing-details" title="مشخصات" hint={CURRENCY_LISTING_COPY.detailsHint}>
          <div className="flex flex-col gap-4">
            <OfferPlatformField
              payload={game?.offer_platforms}
              value={platform}
              invalid={Boolean(issues.platform)}
              error={issues.platform}
              disabled={!game}
              onChange={(value) => {
                setPlatform(value);
                clearIssue("platform");
              }}
            />
            {(game?.regions || []).length > 0 ? (
              <label className="text-[14px] font-bold" htmlFor="listing-region">
                {CURRENCY_LISTING_COPY.region}
                <EldSelect
                  id="listing-region"
                  className="mt-1"
                  ariaLabel={CURRENCY_LISTING_COPY.region}
                  value={region}
                  invalid={Boolean(issues.region)}
                  onChange={(value) => {
                    setRegion(value);
                    clearIssue("region");
                  }}
                  options={game.regions.map((item) => ({ value: item, label: item }))}
                />
                <ListingFieldNote message={issues.region} />
              </label>
            ) : null}
            <label className="text-[14px] font-bold" htmlFor="listing-delivery">
              {CURRENCY_LISTING_COPY.delivery}
              <EldSelect
                id="listing-delivery"
                className="mt-1"
                ariaLabel={CURRENCY_LISTING_COPY.delivery}
                value={delivery}
                invalid={Boolean(issues.delivery)}
                disabled={!game}
                onChange={(value) => {
                  setDelivery(value);
                  clearIssue("delivery");
                }}
                options={(game?.delivery_methods || []).map((item) => ({ value: item.value, label: item.label }))}
              />
              <ListingFieldNote message={issues.delivery} />
            </label>
            <label className="text-[14px] font-bold" htmlFor="listing-minutes">
              {CURRENCY_LISTING_COPY.minutes}
              <input
                id="listing-minutes"
                value={minutes}
                inputMode="numeric"
                aria-invalid={issues.minutes ? "true" : undefined}
                onChange={(event) => {
                  setMinutes(event.target.value);
                  clearIssue("minutes");
                }}
                className={listingControlClass(Boolean(issues.minutes))}
              />
              <span className="mt-1 block text-[13px] font-normal text-graytext">{CURRENCY_LISTING_COPY.minutesHint}</span>
              <ListingFieldNote message={issues.minutes} />
            </label>
            <label className="text-[14px] font-bold" htmlFor="listing-title">
              {LISTING_COPY.accountTitle}
              <input
                id="listing-title"
                value={title}
                maxLength={120}
                aria-invalid={issues.title ? "true" : undefined}
                onChange={(event) => {
                  setTitle(event.target.value);
                  clearIssue("title");
                }}
                className={listingControlClass(Boolean(issues.title))}
              />
              <ListingFieldNote message={issues.title} />
            </label>
            <label className="text-[14px] font-bold" htmlFor="listing-description">
              {CURRENCY_LISTING_COPY.instructions}
              <textarea
                id="listing-description"
                value={description}
                rows={4}
                onChange={(event) => setDescription(event.target.value)}
                className="mt-1 w-full rounded-lg border-2 border-[rgb(239,239,241)] bg-[rgb(239,239,241)] p-3 text-[14px] outline-none"
              />
            </label>
          </div>
        </ListingSection>

        <ListingSection id="listing-media" title="مدیا" hint={CURRENCY_LISTING_COPY.photosHint}>
          <div className="grid grid-cols-2 gap-3">
            {CURRENCY_PHOTO_SLOTS.map((slot) => (
              <ListingPhotoTile
                key={slot.slot}
                slot={slot}
                row={photos[slot.slot]}
                invalid={slot.required && Boolean(issues.photo) && !photos[slot.slot]?.previewUrl}
                onPick={(file) => setPhotoFile(slot.slot, file)}
                onRemove={() => removePhoto(slot.slot)}
              />
            ))}
          </div>
          <ListingFieldNote message={issues.photo} />
        </ListingSection>

        <ListingSection id="listing-price" title={LISTING_COPY.priceStep}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-[14px] font-bold" htmlFor="listing-stock">
              {CURRENCY_LISTING_COPY.stock}
              {unit ? ` (${unit})` : ""}
              <input
                id="listing-stock"
                value={stock}
                inputMode="numeric"
                aria-invalid={issues.stock ? "true" : undefined}
                onChange={(event) => {
                  setStock(event.target.value);
                  clearIssue("stock");
                }}
                className={listingControlClass(Boolean(issues.stock))}
              />
            </label>
            <label className="text-[14px] font-bold" htmlFor="listing-min">
              {CURRENCY_LISTING_COPY.min}
              <input
                id="listing-min"
                value={minQuantity}
                inputMode="numeric"
                aria-invalid={issues.stock ? "true" : undefined}
                onChange={(event) => {
                  setMinQuantity(event.target.value);
                  clearIssue("stock");
                }}
                className={listingControlClass(Boolean(issues.stock))}
              />
            </label>
          </div>
          <ListingFieldNote message={issues.stock} />
          <div className="mt-4">
            <PriceField
              id="listing-price"
              label={rateLabel}
              hint={issues.price || "تومان"}
              previewState={issues.price ? "error" : "default"}
              value={price}
              onChange={(next) => {
                setPrice(next);
                clearIssue("price");
              }}
            />
          </div>
          <p className="mt-4 text-[13px] leading-[20px] text-graytext">{game?.rwt_notice || CURRENCY_LISTING_COPY.rwtFallback}</p>
        </ListingSection>
        {issues.form ? (
          <p className="text-[14px] text-[rgb(232,27,22)]" role="alert">
            {issues.form}
          </p>
        ) : null}
      </div>

      <ListingPreviewAside
        cover={previewCover}
        title={title.trim() || "عنوان آگهی"}
        subtitle={game?.game_name_fa || game?.game_name || "بازی انتخاب نشده"}
        extra={`${game?.delivery_methods?.find((item) => item.value === delivery)?.label || CURRENCY_LISTING_COPY.delivery}${unit ? ` · هر ${unit}` : ""}`}
        priceLabel={parseToman(price) ? formatTomanInWords(parseToman(price)) : "قیمت"}
        checks={checks}
        sectionIssueText={sectionIssueText}
        onJump={jump}
        actions={saveButtons}
      />

      <ListingMobileBar loading={loading} onDraft={() => onSave(false)} onPlace={() => onSave(true)} placeLabel={LISTING_COPY.place} />
    </div>
  );
}
