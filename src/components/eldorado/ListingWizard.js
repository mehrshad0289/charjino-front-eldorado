"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  createListing,
  deleteListingImage,
  deleteListingVideo,
  placeListing,
  updateListing,
  uploadListingImage,
  uploadListingVideo,
  getGameSchema,
} from "@/actions/market.actions";
import {
  GENERIC_LISTING_FIELDS,
  LISTING_PHOTO_SLOTS,
  LISTING_SECTIONS,
  LISTING_TITLE_MIN,
  emptyAttributes,
  formatToman,
  listingPriceError,
  parseToman,
} from "@/lib/listing";
import { LISTING_COPY } from "./data/listingData";

const inputClass =
  "block h-[42px] w-full rounded-lg border-2 border-[rgb(239,239,241)] bg-[rgb(239,239,241)] px-3 text-[14px] text-ink outline-none";
const invalidClass = "border-[rgb(232,27,22)] bg-[rgb(255,244,244)]";
const cardShadow = "0 2px 4px 0 rgba(9,9,11,0.05), 0 12px 8px 0 rgba(9,9,11,0.02)";

function controlClass(invalid) {
  return `${inputClass} mt-1 ${invalid ? invalidClass : ""}`;
}

function FieldNote({ message }) {
  if (!message) return null;
  return (
    <p className="mt-1 text-[13px] font-normal text-[rgb(232,27,22)]" role="alert">
      {message}
    </p>
  );
}

function gentleScrollTo(id) {
  const node = document.getElementById(id);
  if (!node) return;
  const offset = window.innerWidth < 1024 ? 128 : 112;
  const top = Math.max(0, window.scrollY + node.getBoundingClientRect().top - offset);
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    window.scrollTo(0, top);
    return;
  }
  const start = window.scrollY;
  const change = top - start;
  const duration = window.innerWidth < 1024 ? 900 : 560;
  const started = performance.now();
  function frame(now) {
    const progress = Math.min(1, (now - started) / duration);
    const eased = 1 - (1 - progress) ** 3;
    window.scrollTo(0, start + change * eased);
    if (progress < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function fieldsForGame(schemaFields, custom) {
  if (custom) return GENERIC_LISTING_FIELDS;
  return schemaFields.length ? schemaFields : GENERIC_LISTING_FIELDS;
}

function initialPhotos(listing) {
  const next = {};
  for (const slot of LISTING_PHOTO_SLOTS) {
    const server = (listing?.images || []).find((image) => image.slot === slot.slot) || null;
    next[slot.slot] = { file: null, previewUrl: server?.url || "", server };
  }
  return next;
}

function Section({ id, title, hint, children }) {
  return (
    <section id={id} className="scroll-mt-36 rounded-xl bg-white p-5" style={{ boxShadow: cardShadow }}>
      <h2 className="text-[18px] font-bold">{title}</h2>
      {hint ? <p className="mt-1 text-[14px] text-graytext">{hint}</p> : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function ListingWizard({ games = [], listing = null, blockers = [] }) {
  const router = useRouter();
  const blocked = blockers.length > 0;
  const initialGame = listing && games.find((row) => row.game_name === listing.game_name) ? listing.game_name : "";
  const [activeSection, setActiveSection] = useState(LISTING_SECTIONS[0].id);
  const [query, setQuery] = useState("");
  const [custom, setCustom] = useState(Boolean(listing?.game_name) && !initialGame);
  const [gameName, setGameName] = useState(listing?.game_name || "");
  const [publisher, setPublisher] = useState(listing?.publisher || "");
  const [gameId, setGameId] = useState(games.find((row) => row.game_name === listing?.game_name)?.id || null);
  const [schemaFields, setSchemaFields] = useState(GENERIC_LISTING_FIELDS);
  const [title, setTitle] = useState(listing?.title || "");
  const [description, setDescription] = useState(listing?.description || "");
  const [attributes, setAttributes] = useState(listing?.attributes || {});
  const [price, setPrice] = useState(listing?.price_amount ? String(listing.price_amount) : "");
  const [photos, setPhotos] = useState(() => initialPhotos(listing));
  const [video, setVideo] = useState(() => {
    const server = listing?.videos?.[0] || null;
    return { file: null, previewUrl: server?.url || "", server };
  });
  const [loading, setLoading] = useState(false);
  const [issues, setIssues] = useState({});
  const [listingId, setListingId] = useState(listing?.id || "");

  const fields = fieldsForGame(schemaFields, custom);

  useEffect(() => {
    if (!gameId) return undefined;
    let cancelled = false;
    getGameSchema(gameId).then((schema) => {
      if (cancelled) return;
      setSchemaFields(schema.ok && schema.fields?.length ? schema.fields : GENERIC_LISTING_FIELDS);
    });
    return () => {
      cancelled = true;
    };
  }, [gameId]);

  useEffect(() => {
    const id = window.location.hash.replace("#", "");
    if (!id.startsWith("listing-")) return undefined;
    const timer = window.setTimeout(() => gentleScrollTo(id), 280);
    return () => window.clearTimeout(timer);
  }, []);

  const filteredGames = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const rows = needle
      ? games.filter((row) => `${row.game_name_fa || ""} ${row.game_name || ""} ${row.publisher || ""}`.toLowerCase().includes(needle))
      : games;
    return rows.slice(0, 8);
  }, [games, query]);

  const selectedGame = games.find((row) => row.game_name === gameName);
  const photoReady = Boolean(photos.profile?.file || photos.profile?.server);
  const titleReady = title.trim().length >= LISTING_TITLE_MIN;
  const priceReady = !listingPriceError(price);
  const detailsReady = titleReady && fields.every((field) => !field.required || String(attributes[field.key] || "").trim());
  const checks = [
    { id: "listing-game", label: "بازی", ok: Boolean(gameName.trim()) },
    { id: "listing-details", label: "مشخصات", ok: detailsReady },
    { id: "listing-media", label: "مدیا", ok: photoReady },
    { id: "listing-price", label: "قیمت", ok: priceReady && Boolean(gameName.trim()) },
  ];

  function jump(id) {
    setActiveSection(id);
    gentleScrollTo(id);
  }

  function focusField(id) {
    const node = document.getElementById(id);
    if (!node) return;
    gentleScrollTo(id);
    window.setTimeout(() => {
      if (typeof node.focus === "function") node.focus({ preventScroll: true });
    }, window.innerWidth < 1024 ? 920 : 580);
  }

  function clearIssue(key) {
    setIssues((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  async function pickGame(row) {
    setCustom(false);
    setGameName(row.game_name);
    setPublisher(row.publisher || "");
    setGameId(row.id);
    setIssues({});
    const schema = await getGameSchema(row.id);
    const nextFields = schema.ok && schema.fields?.length ? schema.fields : GENERIC_LISTING_FIELDS;
    setSchemaFields(nextFields);
    setAttributes((current) => ({ ...emptyAttributes(nextFields), ...current }));
    window.setTimeout(() => {
      jump("listing-details");
      focusField("listing-title");
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
    if (slot === "profile") clearIssue("photo");
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

  function setVideoFile(file) {
    if (!file) return;
    setVideo((current) => {
      if (current.previewUrl?.startsWith("blob:")) URL.revokeObjectURL(current.previewUrl);
      return { file, previewUrl: URL.createObjectURL(file), server: current.server };
    });
    clearIssue("video");
  }

  async function removeVideo() {
    if (video.server?.id && listingId) {
      const result = await deleteListingVideo(listingId, video.server.id);
      if (!result.ok) {
        setIssues({ form: result.message || "حذف فیلم انجام نشد." });
        return;
      }
    }
    if (video.previewUrl?.startsWith("blob:")) URL.revokeObjectURL(video.previewUrl);
    setVideo({ file: null, previewUrl: "", server: null });
  }

  function collectIssues(requireMedia) {
    const next = {};
    if (!gameName.trim()) next.game = "بازی را انتخاب کن.";
    if (title.trim().length < LISTING_TITLE_MIN) next.title = "عنوان آگهی را بنویس. حداقل ۵ کاراکتر.";
    for (const field of fields) {
      if (field.required && !String(attributes[field.key] || "").trim()) {
        next[field.key] = `${field.label_fa} را کامل کن.`;
      }
    }
    const priceMessage = listingPriceError(price);
    if (priceMessage) next.price = priceMessage;
    if (requireMedia && !photoReady) next.photo = "عکس پروفایل بازی را انتخاب کن.";
    return next;
  }

  function firstIssueTarget(next) {
    if (next.game) return { section: "listing-game", fieldId: "listing-game-search" };
    if (next.title) return { section: "listing-details", fieldId: "listing-title" };
    for (const field of fields) {
      if (next[field.key]) return { section: "listing-details", fieldId: `attr-${field.key}` };
    }
    if (next.photo) return { section: "listing-media", fieldId: "listing-photo-profile" };
    if (next.video) return { section: "listing-media", fieldId: "listing-video" };
    if (next.price) return { section: "listing-price", fieldId: "listing-price" };
    return { section: "listing-details", fieldId: "listing-title" };
  }

  function sectionIssueText(id) {
    if (id === "listing-game") return issues.game || "";
    if (id === "listing-details") {
      return [issues.title, ...fields.map((field) => issues[field.key])].filter(Boolean).join(" · ");
    }
    if (id === "listing-media") return [issues.photo, issues.video].filter(Boolean).join(" · ");
    if (id === "listing-price") return issues.price || "";
    return "";
  }

  function buildForm() {
    const payload = new FormData();
    if (listingId) payload.set("listing_id", String(listingId));
    payload.set("title", title.trim());
    payload.set("description", description.trim());
    payload.set("game_name", gameName.trim());
    payload.set("publisher", publisher.trim());
    payload.set("price_amount", String(parseToman(price)));
    payload.set("attributes", JSON.stringify(attributes));
    return payload;
  }

  async function ensureDraft() {
    const saved = listingId ? await updateListing(listingId, buildForm()) : await createListing(buildForm());
    if (!saved.ok) return saved;
    const id = saved.data?.id || listingId;
    setListingId(id);
    return { ok: true, id };
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
        [slot.slot]: { file: null, previewUrl: uploaded.data.url, server: uploaded.data },
      }));
    }
    if (video.file) {
      const body = new FormData();
      body.set("listing_id", String(id));
      body.set("file", video.file);
      const uploaded = await uploadListingVideo(body);
      if (!uploaded.ok) return uploaded;
      setVideo({ file: null, previewUrl: uploaded.data.url, server: uploaded.data });
    }
    return { ok: true };
  }

  async function onSave(publish) {
    const nextIssues = collectIssues(publish);
    if (Object.keys(nextIssues).length) {
      setIssues(nextIssues);
      const target = firstIssueTarget(nextIssues);
      jump(target.section);
      window.setTimeout(() => focusField(target.fieldId), 280);
      return;
    }
    setLoading(true);
    setIssues({});
    const draft = await ensureDraft();
    if (!draft.ok) {
      setLoading(false);
      if (draft.unauthorized) {
        router.push("/login?next=/dashboard/offers/Account/new");
        return;
      }
      if (draft.blocked) {
        router.push("/verify/status");
        return;
      }
      setIssues({ form: draft.message || "ثبت آگهی انجام نشد." });
      return;
    }
    if (publish) {
      const media = await uploadPending(draft.id);
      if (!media.ok) {
        setLoading(false);
        setIssues({ form: media.message || "آپلود مدیا انجام نشد." });
        jump("listing-media");
        return;
      }
      const placed = await placeListing(draft.id);
      setLoading(false);
      if (!placed.ok) {
        setIssues({ form: placed.message || "ارسال برای بررسی انجام نشد." });
        return;
      }
    } else {
      setLoading(false);
    }
    router.push("/dashboard/offers/Account");
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

  const previewCover = photos.profile?.previewUrl;
  const issueList = [...new Set(Object.entries(issues).filter(([key]) => key !== "form").map(([, message]) => message))];

  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start lg:gap-6">
      <div className="flex flex-col gap-4 pb-28 lg:pb-6">
        <div className="sticky top-[100px] z-20 flex flex-col gap-2">
        <nav className="flex gap-2 overflow-x-auto rounded-xl bg-white p-2" style={{ boxShadow: cardShadow }} aria-label="بخش‌های آگهی">
          {LISTING_SECTIONS.map((section, index) => {
            const current = activeSection === section.id;
            const done = checks.find((item) => item.id === section.id)?.ok;
            return (
              <button
                key={section.id}
                type="button"
                aria-current={current ? "true" : undefined}
                onClick={() => jump(section.id)}
                className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg px-3 text-[13px] font-bold ${
                  current ? "bg-ink text-white" : "bg-[rgb(244,244,244)] text-ink"
                }`}
              >
                <span className={`flex size-6 items-center justify-center rounded-full ${done ? "bg-[rgb(33,150,83)] text-white" : "bg-white text-ink"}`}>
                  {done ? "✓" : index + 1}
                </span>
                {section.label}
              </button>
            );
          })}
        </nav>
        {issueList.length ? (
          <div role="alert" className="rounded-xl bg-[rgb(255,244,244)] p-3 text-[14px] shadow-[0_8px_20px_rgba(9,9,11,0.08)]">
            <p className="font-bold">برای ادامه این موارد را کامل کن</p>
            <ul className="mt-1 list-disc ps-5">
              {issueList.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          </div>
        ) : null}
        </div>

        <Section id="listing-game" title={LISTING_COPY.pickGame}>
          <label className="text-[14px] font-bold" htmlFor="listing-game-search">
            {LISTING_COPY.searchGame}
            <input id="listing-game-search" value={query} onChange={(event) => setQuery(event.target.value)} className={controlClass(Boolean(issues.game))} />
          </label>
          <FieldNote message={issues.game} />
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {filteredGames.map((row) => {
              const selected = !custom && gameName === row.game_name;
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
        </Section>

        <Section id="listing-details" title={LISTING_COPY.detailsStep} hint={LISTING_COPY.descriptionHint}>
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
                className={controlClass(Boolean(issues.title))}
              />
              <FieldNote message={issues.title} />
            </label>
            {fields.map((field) => (
              <label key={field.key} className="text-[14px] font-bold" htmlFor={`attr-${field.key}`}>
                {field.label_fa}
                {field.required ? " *" : ""}
                {field.type === "select" ? (
                  <select
                    id={`attr-${field.key}`}
                    value={attributes[field.key] || ""}
                    aria-invalid={issues[field.key] ? "true" : undefined}
                    onChange={(event) => {
                      setAttributes((current) => ({ ...current, [field.key]: event.target.value }));
                      clearIssue(field.key);
                    }}
                    className={controlClass(Boolean(issues[field.key]))}
                  >
                    <option value="">انتخاب کن</option>
                    {(field.options || []).map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
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
                    className={controlClass(Boolean(issues[field.key]))}
                  />
                )}
                <FieldNote message={issues[field.key]} />
              </label>
            ))}
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
        </Section>

        <Section id="listing-media" title="مدیا" hint={LISTING_COPY.photosHint}>
          <div className="grid grid-cols-2 gap-3">
            {LISTING_PHOTO_SLOTS.map((slot) => {
              const row = photos[slot.slot];
              const invalid = slot.slot === "profile" && Boolean(issues.photo);
              return (
                <div
                  key={slot.slot}
                  id={slot.slot === "profile" ? "listing-photo-profile" : undefined}
                  className={`rounded-lg p-3 ${invalid ? "bg-[rgb(255,244,244)] ring-2 ring-[rgb(232,27,22)]" : "bg-[rgb(244,244,244)]"}`}
                >
                  <p className="text-[13px] font-bold">
                    {slot.label}
                    {slot.required ? " *" : ""}
                  </p>
                  <p className="text-[12px] text-graytext">{slot.hint}</p>
                  {row?.previewUrl ? (
                    <img src={row.previewUrl} alt={slot.label} className="mt-2 h-28 w-full rounded-lg object-cover" />
                  ) : (
                    <div className="mt-2 flex h-28 items-center justify-center rounded-lg border border-dashed border-[rgb(198,198,204)] text-[12px] text-graytext">
                      jpg / png / webp
                    </div>
                  )}
                  <div className="mt-2 flex gap-2">
                    <label className="inline-flex min-h-9 cursor-pointer items-center rounded-lg bg-ink px-3 text-[12px] font-bold text-white">
                      انتخاب
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="sr-only"
                        onChange={(event) => setPhotoFile(slot.slot, event.target.files?.[0])}
                      />
                    </label>
                    {row?.previewUrl ? (
                      <button type="button" onClick={() => removePhoto(slot.slot)} className="min-h-9 rounded-lg px-2 text-[12px] font-bold text-[rgb(232,27,22)]">
                        حذف
                      </button>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
          <FieldNote message={issues.photo} />
          <div id="listing-video" className={`mt-5 rounded-lg p-3 ${issues.video ? "bg-[rgb(255,244,244)] ring-2 ring-[rgb(232,27,22)]" : ""}`}>
            <p className="text-[14px] font-bold">{LISTING_COPY.video}</p>
            <p className="mt-1 text-[14px] text-graytext">{LISTING_COPY.videoHint}</p>
            {video.previewUrl ? (
              <video src={video.previewUrl} controls className="mt-3 max-h-56 w-full rounded-lg bg-black" />
            ) : (
              <div className="mt-3 flex h-28 items-center justify-center rounded-lg border border-dashed border-[rgb(198,198,204)] text-[13px] text-graytext">
                mp4 یا webm
              </div>
            )}
            <div className="mt-2 flex gap-2">
              <label className="inline-flex min-h-10 cursor-pointer items-center rounded-lg bg-ink px-3 text-[13px] font-bold text-white">
                انتخاب فیلم
                <input
                  type="file"
                  accept="video/mp4,video/webm"
                  className="sr-only"
                  onChange={(event) => setVideoFile(event.target.files?.[0])}
                />
              </label>
              {video.previewUrl ? (
                <button type="button" onClick={removeVideo} className="min-h-10 rounded-lg px-2 text-[13px] font-bold text-[rgb(232,27,22)]">
                  حذف
                </button>
              ) : null}
            </div>
            <FieldNote message={issues.video} />
          </div>
        </Section>

        <Section id="listing-price" title={LISTING_COPY.priceStep}>
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
              className={`${controlClass(Boolean(issues.price))} text-start`}
            />
            <FieldNote message={issues.price} />
            <span className="mt-2 block text-[14px] font-normal text-graytext">
              {parseToman(price) ? `${formatToman(parseToman(price))} تومان` : ""}
            </span>
          </label>
        </Section>
        {issues.form ? <p className="text-[14px] text-[rgb(232,27,22)]" role="alert">{issues.form}</p> : null}
      </div>

      <aside className="mt-4 lg:sticky lg:top-28 lg:mt-0">
        <div className="rounded-xl bg-white p-4" style={{ boxShadow: cardShadow }}>
          <p className="text-[13px] font-bold text-graytext">پیش‌نمایش آگهی</p>
          {previewCover ? (
            <img src={previewCover} alt="" className="mt-3 h-36 w-full rounded-lg object-cover" />
          ) : (
            <div className="mt-3 flex h-36 items-center justify-center rounded-lg bg-[rgb(244,244,244)] text-[13px] text-graytext">بدون عکس</div>
          )}
          <p className="mt-3 text-[16px] font-bold">{title.trim() || "عنوان آگهی"}</p>
          <p className="text-[13px] text-graytext">
            {(selectedGame?.game_name_fa || gameName || "بازی انتخاب نشده")}
            {publisher ? ` · ${publisher}` : ""}
          </p>
          <p className="mt-1 text-[18px] font-bold">{parseToman(price) ? `${formatToman(parseToman(price))} تومان` : "قیمت"}</p>
          <ul className="mt-4 flex flex-col gap-2">
            {checks.map((item) => {
              const reason = sectionIssueText(item.id);
              return (
                <li key={item.id}>
                  <button type="button" onClick={() => jump(item.id)} className="flex w-full flex-col items-stretch text-start text-[14px]">
                    <span className="flex items-center justify-between">
                      <span>{item.label}</span>
                      <span className={item.ok ? "font-bold text-[rgb(33,150,83)]" : reason ? "font-bold text-[rgb(232,27,22)]" : "text-graytext"}>
                        {item.ok ? "کامل" : reason ? "اصلاح کن" : "ناقص"}
                      </span>
                    </span>
                    {reason ? <span className="mt-1 text-[12px] font-normal text-[rgb(232,27,22)]">{reason}</span> : null}
                  </button>
                </li>
              );
            })}
          </ul>
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
