"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createListing, deleteListingImage, placeListing, updateListing, uploadListingImage } from "@/actions/market.actions";
import { CONSOLE_FORMATS, CONSOLE_MODELS, CONSOLE_PLATFORMS, consoleFormatLabel, consoleModelLabel } from "@/lib/console-games";
import { LISTING_PHOTO_SLOTS, LISTING_SECTIONS, LISTING_TITLE_MIN, formatToman, listingMediaUrl, listingPriceError, parseToman } from "@/lib/listing";
import { GAME_LISTING_COPY, LISTING_COPY } from "./data/listingData";
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

const SELL_PLATFORMS = CONSOLE_PLATFORMS.filter((row) => row.sell);
const CONDITION_OPTIONS = [
  { value: "new", label: "آکبند" },
  { value: "used", label: "کارکرده" },
];
const DLC_OPTIONS = [
  { value: "none", label: "ندارد" },
  { value: "unused", label: "استفاده نشده" },
  { value: "used", label: "استفاده شده" },
];
const SHIPPING_OPTIONS = [
  { value: "post", label: "پست" },
  { value: "meetup", label: "تحویل حضوری" },
];

function firstFormat(platform) {
  return (CONSOLE_FORMATS[platform] || [])[0]?.value || "disc";
}

function firstModel(platform, format) {
  return (CONSOLE_MODELS[`${platform}:${format}`] || [])[0]?.value || "";
}

function initialPhotos(listing) {
  const next = {};
  for (const slot of LISTING_PHOTO_SLOTS) {
    const server = (listing?.images || []).find((image) => image.slot === slot.slot) || null;
    next[slot.slot] = { file: null, previewUrl: listingMediaUrl(server?.url || ""), server };
  }
  return next;
}

export default function ConsoleGameForm({ platform = "playstation", listing = null, blockers = [] }) {
  const router = useRouter();
  const blocked = blockers.length > 0;
  const attrs = listing?.attributes || {};
  const startPlatform = CONSOLE_FORMATS[attrs.platform] ? attrs.platform : CONSOLE_FORMATS[platform] ? platform : "playstation";
  const startFormat = attrs.format || firstFormat(startPlatform);
  const [activeSection, setActiveSection] = useState(LISTING_SECTIONS[0].id);
  const [chosenPlatform, setPlatform] = useState(startPlatform);
  const [format, setFormat] = useState(startFormat);
  const [model, setModel] = useState(attrs.console_model || firstModel(startPlatform, startFormat));
  const [gameName, setGameName] = useState(listing?.game_name || "");
  const [title, setTitle] = useState(listing?.title || "");
  const [description, setDescription] = useState(listing?.description || "");
  const [condition, setCondition] = useState(attrs.condition || "used");
  const [region, setRegion] = useState(attrs.region || "");
  const [edition, setEdition] = useState(attrs.edition || "");
  const [dlc, setDlc] = useState(attrs.dlc || "none");
  const [shipping, setShipping] = useState(attrs.shipping || "post");
  const [price, setPrice] = useState(listing?.price_amount ? String(listing.price_amount) : "");
  const [photos, setPhotos] = useState(() => initialPhotos(listing));
  const [listingId, setListingId] = useState(listing?.id || "");
  const [loading, setLoading] = useState(false);
  const [issues, setIssues] = useState({});

  const formats = CONSOLE_FORMATS[chosenPlatform] || [];
  const models = useMemo(() => CONSOLE_MODELS[`${chosenPlatform}:${format}`] || [], [chosenPlatform, format]);
  const physical = format === "disc" || format === "cartridge";
  const platformLabel = SELL_PLATFORMS.find((row) => row.key === chosenPlatform)?.title || chosenPlatform;

  useEffect(() => {
    const id = window.location.hash.replace("#", "");
    if (!id.startsWith("listing-")) return undefined;
    const timer = window.setTimeout(() => jumpToListingSection(id, setActiveSection), 280);
    return () => window.clearTimeout(timer);
  }, []);

  const photoReady = Boolean(photos.profile?.file || photos.profile?.server);
  const titleReady = title.trim().length >= LISTING_TITLE_MIN;
  const gameReady = Boolean(gameName.trim()) && Boolean(chosenPlatform);
  const priceReady = !listingPriceError(price);
  const detailsReady = titleReady && Boolean(format) && Boolean(model);
  const checks = [
    { id: "listing-game", label: "بازی", ok: gameReady },
    { id: "listing-details", label: "مشخصات", ok: detailsReady },
    { id: "listing-media", label: "مدیا", ok: photoReady },
    { id: "listing-price", label: "قیمت", ok: priceReady && gameReady },
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

  function onPlatform(next) {
    const nextFormat = firstFormat(next);
    setPlatform(next);
    setFormat(nextFormat);
    setModel(firstModel(next, nextFormat));
    clearIssue("platform");
  }

  function onFormat(next) {
    setFormat(next);
    setModel(firstModel(chosenPlatform, next));
    clearIssue("format");
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
    if (!chosenPlatform) next.platform = "پلتفرم را انتخاب کن.";
    if (!gameName.trim()) next.game = "اسم بازی را بنویس.";
    if (title.trim().length < LISTING_TITLE_MIN) next.title = "عنوان آگهی را بنویس. حداقل ۵ کاراکتر.";
    if (!format) next.format = "نوع را انتخاب کن.";
    if (!model) next.model = "کنسول را انتخاب کن.";
    const priceMessage = listingPriceError(price);
    if (priceMessage) next.price = priceMessage;
    if (publish && !photoReady) next.photo = "عکس پروفایل را انتخاب کن.";
    return next;
  }

  function firstIssueTarget(next) {
    if (next.platform || next.game) return { section: "listing-game", fieldId: next.platform ? "listing-platform" : "listing-game-name" };
    if (next.title) return { section: "listing-details", fieldId: "listing-title" };
    if (next.format) return { section: "listing-details", fieldId: "listing-format" };
    if (next.model) return { section: "listing-details", fieldId: "listing-model" };
    if (next.photo) return { section: "listing-media", fieldId: "listing-photo-profile" };
    if (next.price) return { section: "listing-price", fieldId: "listing-price" };
    return { section: "listing-details", fieldId: "listing-title" };
  }

  function sectionIssueText(id) {
    if (id === "listing-game") return [issues.platform, issues.game].filter(Boolean).join(" · ");
    if (id === "listing-details") return [issues.title, issues.format, issues.model].filter(Boolean).join(" · ");
    if (id === "listing-media") return issues.photo || "";
    if (id === "listing-price") return issues.price || "";
    return "";
  }

  function buildForm() {
    const payload = new FormData();
    payload.set("offer_type", "ConsoleGame");
    payload.set("title", title.trim());
    payload.set("description", description.trim());
    payload.set("game_name", gameName.trim());
    payload.set("price_amount", String(parseToman(price)));
    payload.set(
      "attributes",
      JSON.stringify({
        platform: chosenPlatform,
        format,
        console_model: model,
        condition: physical ? condition : "used",
        region: region.trim(),
        edition: edition.trim(),
        dlc: physical ? dlc : "none",
        shipping: physical ? shipping : "account",
      }),
    );
    return payload;
  }

  async function uploadPending(id) {
    for (const slot of LISTING_PHOTO_SLOTS) {
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
        router.push("/login?next=/dashboard/offers/ConsoleGame/new");
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
        setIssues({ form: placed.message || "برای بررسی ثبت نشد. اگر بازی تازه است، اول باید در ادمین تأیید شود." });
        return;
      }
    } else {
      setLoading(false);
    }
    router.push("/dashboard/offers/ConsoleGame");
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

  const previewCover = photos.profile?.previewUrl;
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

        <ListingSection id="listing-game" title={LISTING_COPY.pickGame} hint={GAME_LISTING_COPY.gameHint}>
          <div className="flex flex-col gap-4">
            <label className="text-[14px] font-bold" htmlFor="listing-platform">
              {GAME_LISTING_COPY.platform}
              <EldSelect
                id="listing-platform"
                className="mt-1"
                ariaLabel={GAME_LISTING_COPY.platform}
                value={chosenPlatform}
                invalid={Boolean(issues.platform)}
                onChange={onPlatform}
                options={SELL_PLATFORMS.map((row) => ({ value: row.key, label: row.title }))}
              />
              <ListingFieldNote message={issues.platform} />
            </label>
            <label className="text-[14px] font-bold" htmlFor="listing-game-name">
              {GAME_LISTING_COPY.gameName}
              <input
                id="listing-game-name"
                value={gameName}
                maxLength={80}
                aria-invalid={issues.game ? "true" : undefined}
                onChange={(event) => {
                  setGameName(event.target.value);
                  clearIssue("game");
                }}
                className={listingControlClass(Boolean(issues.game))}
              />
              <ListingFieldNote message={issues.game} />
            </label>
          </div>
        </ListingSection>

        <ListingSection id="listing-details" title="مشخصات" hint={LISTING_COPY.descriptionHint}>
          <div className="flex flex-col gap-4">
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
            <label className="text-[14px] font-bold" htmlFor="listing-format">
              {GAME_LISTING_COPY.format}
              <EldSelect
                id="listing-format"
                className="mt-1"
                ariaLabel={GAME_LISTING_COPY.format}
                value={format}
                invalid={Boolean(issues.format)}
                onChange={onFormat}
                options={formats.map((row) => ({ value: row.value, label: row.label }))}
              />
              <ListingFieldNote message={issues.format} />
            </label>
            <label className="text-[14px] font-bold" htmlFor="listing-model">
              {GAME_LISTING_COPY.model}
              <EldSelect
                id="listing-model"
                className="mt-1"
                ariaLabel={GAME_LISTING_COPY.model}
                value={model}
                invalid={Boolean(issues.model)}
                onChange={(value) => {
                  setModel(value);
                  clearIssue("model");
                }}
                options={models.map((row) => ({ value: row.value, label: row.label }))}
              />
              <ListingFieldNote message={issues.model} />
            </label>
            {physical ? (
              <label className="text-[14px] font-bold" htmlFor="listing-condition">
                {GAME_LISTING_COPY.condition}
                <EldSelect
                  id="listing-condition"
                  className="mt-1"
                  ariaLabel={GAME_LISTING_COPY.condition}
                  value={condition}
                  onChange={setCondition}
                  options={CONDITION_OPTIONS}
                />
              </label>
            ) : null}
            <label className="text-[14px] font-bold" htmlFor="listing-region">
              {GAME_LISTING_COPY.region}
              <input
                id="listing-region"
                value={region}
                maxLength={40}
                onChange={(event) => setRegion(event.target.value)}
                className={listingControlClass(false)}
              />
            </label>
            <label className="text-[14px] font-bold" htmlFor="listing-edition">
              {GAME_LISTING_COPY.edition}
              <input
                id="listing-edition"
                value={edition}
                maxLength={40}
                onChange={(event) => setEdition(event.target.value)}
                className={listingControlClass(false)}
              />
            </label>
            {physical ? (
              <>
                <label className="text-[14px] font-bold" htmlFor="listing-dlc">
                  {GAME_LISTING_COPY.dlc}
                  <EldSelect
                    id="listing-dlc"
                    className="mt-1"
                    ariaLabel={GAME_LISTING_COPY.dlc}
                    value={dlc}
                    onChange={setDlc}
                    options={DLC_OPTIONS}
                  />
                </label>
                <label className="text-[14px] font-bold" htmlFor="listing-shipping">
                  {GAME_LISTING_COPY.shipping}
                  <EldSelect
                    id="listing-shipping"
                    className="mt-1"
                    ariaLabel={GAME_LISTING_COPY.shipping}
                    value={shipping}
                    onChange={setShipping}
                    options={SHIPPING_OPTIONS}
                  />
                </label>
              </>
            ) : null}
            <label className="text-[14px] font-bold" htmlFor="listing-description">
              {LISTING_COPY.description}
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

        <ListingSection id="listing-media" title="مدیا" hint={GAME_LISTING_COPY.photosHint}>
          <div className="grid grid-cols-2 gap-3">
            {LISTING_PHOTO_SLOTS.map((slot) => (
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
          <label className="text-[14px] font-bold" htmlFor="listing-price">
            {LISTING_COPY.price}
            <input
              id="listing-price"
              value={price}
              inputMode="numeric"
              dir="ltr"
              aria-invalid={issues.price ? "true" : undefined}
              onChange={(event) => {
                setPrice(event.target.value);
                clearIssue("price");
              }}
              className={`${listingControlClass(Boolean(issues.price))} text-start`}
            />
            <ListingFieldNote message={issues.price} />
            <span className="mt-2 block text-[14px] font-normal text-graytext">
              {parseToman(price) ? `${formatToman(parseToman(price))} تومان` : ""}
            </span>
          </label>
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
        subtitle={`${gameName.trim() || "بازی انتخاب نشده"} · ${platformLabel}`}
        extra={`${consoleFormatLabel(format)}${model ? ` · ${consoleModelLabel(model)}` : ""}`}
        priceLabel={parseToman(price) ? `${formatToman(parseToman(price))} تومان` : "قیمت"}
        checks={checks}
        sectionIssueText={sectionIssueText}
        onJump={jump}
        actions={saveButtons}
      />

      <ListingMobileBar loading={loading} onDraft={() => onSave(false)} onPlace={() => onSave(true)} placeLabel={LISTING_COPY.place} />
    </div>
  );
}
