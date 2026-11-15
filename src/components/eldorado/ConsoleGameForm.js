"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createListing, deleteListingImage, getConsoles, getConsoleSchema, placeListing, updateListing, uploadListingImage } from "@/actions/market.actions";
import {
  CONSOLE_PLATFORMS,
  consoleFormatLabel,
  consoleModelLabel,
  defaultConsoleSchemaFields,
  normalizeConsoleAttributeValue,
} from "@/lib/console-games";
import {
  LISTING_SECTIONS,
  LISTING_TITLE_MIN,
  emptyAttributes,
  listingMediaUrl,
  listingPhotoNeeded,
  listingPhotoSlots,
  listingPriceError,
  parseToman,
  schemaFieldFilled,
  schemaFieldVisible,
  schemaItemNoun,
} from "@/lib/listing";
import { formatTomanInWords } from "@/lib/price";
import ItemListField from "./ItemListField";
import PriceField from "./PriceField";
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

function initialPhotos(listing, fields) {
  const next = {};
  for (const slot of listingPhotoSlots(fields)) {
    const server = (listing?.images || []).find((image) => image.slot === slot.slot) || null;
    next[slot.slot] = { file: null, previewUrl: listingMediaUrl(server?.url || ""), server };
  }
  return next;
}

function schemaAttributes(listing, fields) {
  const next = emptyAttributes(fields);
  const raw = listing?.attributes || {};
  for (const field of fields) {
    if (!field?.key) continue;
    const value = normalizeConsoleAttributeValue(field.key, raw[field.key]);
    if (value) next[field.key] = value;
  }
  return next;
}

export default function ConsoleGameForm({ platform = "playstation", listing = null, blockers = [] }) {
  const router = useRouter();
  const blocked = blockers.length > 0;
  const attrs = listing?.attributes || {};
  const startPlatform = attrs.platform || platform || "playstation";
  const [activeSection, setActiveSection] = useState(LISTING_SECTIONS[0].id);
  const [consoles, setConsoles] = useState(CONSOLE_PLATFORMS.filter((row) => row.sell).map((row) => ({ platform: row.key, title_fa: row.title, sell_enabled: true })));
  const [chosenPlatform, setPlatform] = useState(startPlatform);
  const [schemaFields, setSchemaFields] = useState(() => defaultConsoleSchemaFields(startPlatform));
  const [attributes, setAttributes] = useState(() => schemaAttributes(listing, defaultConsoleSchemaFields(startPlatform)));
  const [gameName, setGameName] = useState(listing?.game_name || "");
  const [title, setTitle] = useState(listing?.title || "");
  const [description, setDescription] = useState(listing?.description || "");
  const [price, setPrice] = useState(listing?.price_amount ? String(listing.price_amount) : "");
  const [photos, setPhotos] = useState(() => initialPhotos(listing, defaultConsoleSchemaFields(startPlatform)));
  const [listingId, setListingId] = useState(listing?.id || "");
  const [loading, setLoading] = useState(false);
  const [issues, setIssues] = useState({});

  const visibleFields = useMemo(
    () => schemaFields.filter((field) => schemaFieldVisible(field, attributes)),
    [schemaFields, attributes],
  );
  const photoSlots = useMemo(() => listingPhotoSlots(schemaFields), [schemaFields]);
  const sellPlatforms = useMemo(() => {
    const rows = consoles.filter((row) => row.sell_enabled || row.platform === chosenPlatform);
    return rows.length ? rows : CONSOLE_PLATFORMS.filter((row) => row.sell).map((row) => ({ platform: row.key, title_fa: row.title, sell_enabled: true }));
  }, [consoles, chosenPlatform]);
  const platformLabel = sellPlatforms.find((row) => row.platform === chosenPlatform)?.title_fa || chosenPlatform;
  const formatValue = attributes.format || "";
  const modelValue = attributes.console_model || "";

  useEffect(() => {
    let cancelled = false;
    getConsoles().then((result) => {
      if (cancelled || !result.ok) return;
      setConsoles(result.items);
      if (listing) return;
      const open = result.items.filter((row) => row.sell_enabled);
      const currentOpen = result.items.some((row) => row.platform === startPlatform && row.sell_enabled);
      if (open.length && !currentOpen) setPlatform(open[0].platform);
    });
    return () => {
      cancelled = true;
    };
  }, [listing, startPlatform]);

  useEffect(() => {
    let cancelled = false;
    getConsoleSchema(chosenPlatform).then((result) => {
      if (cancelled) return;
      const fields = result.ok && result.fields?.length ? result.fields : defaultConsoleSchemaFields(chosenPlatform);
      setSchemaFields(fields);
      setAttributes((current) => {
        const next = emptyAttributes(fields);
        for (const field of fields) {
          if (!field?.key) continue;
          const value = normalizeConsoleAttributeValue(field.key, current[field.key]);
          if (value) next[field.key] = value;
        }
        return next;
      });
      setPhotos((current) => {
        const next = { ...current };
        for (const slot of listingPhotoSlots(fields)) {
          if (!next[slot.slot]) next[slot.slot] = { file: null, previewUrl: "", server: null };
        }
        return next;
      });
    });
    return () => {
      cancelled = true;
    };
  }, [chosenPlatform]);

  useEffect(() => {
    const id = window.location.hash.replace("#", "");
    if (!id.startsWith("listing-")) return undefined;
    const timer = window.setTimeout(() => jumpToListingSection(id, setActiveSection), 280);
    return () => window.clearTimeout(timer);
  }, []);

  const photoReady = photoSlots.every((slot) => {
    if (!listingPhotoNeeded(slot)) return true;
    return Boolean(photos[slot.slot]?.file || photos[slot.slot]?.server);
  });
  const titleReady = title.trim().length >= LISTING_TITLE_MIN;
  const gameReady = Boolean(gameName.trim()) && Boolean(chosenPlatform);
  const priceReady = !listingPriceError(price);
  const detailsReady = titleReady && visibleFields.every((field) => !field.required || schemaFieldFilled(field, attributes));
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
    const fields = defaultConsoleSchemaFields(next);
    setPlatform(next);
    setSchemaFields(fields);
    setAttributes(emptyAttributes(fields));
    clearIssue("platform");
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
    for (const field of visibleFields) {
      if (field.required && !schemaFieldFilled(field, attributes)) {
        next[field.key] = field.multiline
          ? `حداقل یک ${schemaItemNoun(field)} اضافه کن.`
          : `${field.label_fa} را کامل کن.`;
      }
    }
    const priceMessage = listingPriceError(price);
    if (priceMessage) next.price = priceMessage;
    if (publish) {
      for (const slot of photoSlots) {
        const ready = Boolean(photos[slot.slot]?.file || photos[slot.slot]?.server);
        if (listingPhotoNeeded(slot) && !ready) {
          next[`photo-${slot.slot}`] = `برای «${slot.label}» باید یک تصویر پیوست شود.`;
        }
      }
    }
    return next;
  }

  function firstIssueTarget(next) {
    if (next.platform || next.game) return { section: "listing-game", fieldId: next.platform ? "listing-platform" : "listing-game-name" };
    if (next.title) return { section: "listing-details", fieldId: "listing-title" };
    for (const field of visibleFields) {
      if (next[field.key]) return { section: "listing-details", fieldId: `attr-${field.key}` };
    }
    const photoIssue = photoSlots.find((slot) => next[`photo-${slot.slot}`]);
    if (photoIssue || next.photo) return { section: "listing-media", fieldId: `listing-photo-${photoIssue?.slot || "profile"}` };
    if (next.price) return { section: "listing-price", fieldId: "listing-price" };
    return { section: "listing-details", fieldId: "listing-title" };
  }

  function sectionIssueText(id) {
    if (id === "listing-game") return [issues.platform, issues.game].filter(Boolean).join(" · ");
    if (id === "listing-details") return [issues.title, ...visibleFields.map((field) => issues[field.key])].filter(Boolean).join(" · ");
    if (id === "listing-media") return [issues.photo, ...photoSlots.map((slot) => issues[`photo-${slot.slot}`])].filter(Boolean).join(" · ");
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
    const attrsOut = { platform: chosenPlatform };
    for (const field of visibleFields) {
      const value = String(attributes[field.key] || "").trim();
      if (value) attrsOut[field.key] = value;
    }
    payload.set("attributes", JSON.stringify(attrsOut));
    return payload;
  }

  async function uploadPending(id) {
    for (const slot of photoSlots) {
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
                options={sellPlatforms.map((row) => ({ value: row.platform, label: row.title_fa }))}
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
            {visibleFields.map((field) =>
              field.multiline ? (
                <ItemListField
                  key={field.key}
                  id={`attr-${field.key}`}
                  label={field.label_fa}
                  required={Boolean(field.required)}
                  value={attributes[field.key] || ""}
                  invalid={Boolean(issues[field.key])}
                  error={issues[field.key]}
                  itemNoun={schemaItemNoun(field)}
                  onChange={(value) => {
                    setAttributes((current) => ({ ...current, [field.key]: value }));
                    clearIssue(field.key);
                  }}
                />
              ) : (
                <label key={field.key} className="text-[14px] font-bold" htmlFor={`attr-${field.key}`}>
                  {field.label_fa}
                  {field.required ? " *" : ""}
                  {field.type === "select" ? (
                    <EldSelect
                      id={`attr-${field.key}`}
                      className="mt-1"
                      ariaLabel={field.label_fa}
                      value={attributes[field.key] || ""}
                      invalid={Boolean(issues[field.key])}
                      placeholder="انتخاب کن"
                      onChange={(value) => {
                        setAttributes((current) => ({ ...current, [field.key]: value }));
                        clearIssue(field.key);
                      }}
                      options={[
                        { value: "", label: "انتخاب کن" },
                        ...(field.options || []).map((option) => ({ value: option, label: option })),
                      ]}
                    />
                  ) : (
                    <input
                      id={`attr-${field.key}`}
                      value={attributes[field.key] || ""}
                      aria-invalid={issues[field.key] ? "true" : undefined}
                      inputMode={field.type === "number" ? "numeric" : "text"}
                      onChange={(event) => {
                        setAttributes((current) => ({ ...current, [field.key]: event.target.value }));
                        clearIssue(field.key);
                      }}
                      className={listingControlClass(Boolean(issues[field.key]))}
                    />
                  )}
                  <ListingFieldNote message={issues[field.key]} />
                </label>
              ),
            )}
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
            {photoSlots.map((slot) => (
              <ListingPhotoTile
                key={slot.slot}
                slot={slot}
                row={photos[slot.slot]}
                invalid={listingPhotoNeeded(slot) && Boolean(issues[`photo-${slot.slot}`] || issues.photo) && !photos[slot.slot]?.previewUrl}
                onPick={(file) => setPhotoFile(slot.slot, file)}
                onRemove={() => removePhoto(slot.slot)}
              />
            ))}
          </div>
          <ListingFieldNote message={[issues.photo, ...photoSlots.map((slot) => issues[`photo-${slot.slot}`])].filter(Boolean).join(" · ")} />
        </ListingSection>

        <ListingSection id="listing-price" title={LISTING_COPY.priceStep}>
          <PriceField
            id="listing-price"
            label={LISTING_COPY.price}
            hint={issues.price || "تومان"}
            previewState={issues.price ? "error" : "default"}
            value={price}
            onChange={(next) => {
              setPrice(next);
              clearIssue("price");
            }}
          />
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
        extra={`${consoleFormatLabel(formatValue)}${modelValue ? ` · ${consoleModelLabel(modelValue)}` : ""}`}
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
