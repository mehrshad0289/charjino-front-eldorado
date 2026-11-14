"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createListing, placeListing, uploadListingImage } from "@/actions/market.actions";
import { CONSOLE_FORMATS, CONSOLE_MODELS, CONSOLE_PLATFORMS } from "@/lib/console-games";
import { parseToman } from "@/lib/listing";

const INPUT = "block h-[42px] w-full rounded-lg bg-[rgb(239,239,241)] px-3 text-[14px]";

export default function ConsoleGameForm({ platform = "playstation" }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [chosenPlatform, setPlatform] = useState(CONSOLE_FORMATS[platform] ? platform : "playstation");
  const formats = CONSOLE_FORMATS[chosenPlatform] || [];
  const [format, setFormat] = useState(formats[0]?.value || "disc");
  const models = useMemo(() => CONSOLE_MODELS[`${chosenPlatform}:${format}`] || [], [chosenPlatform, format]);
  const [model, setModel] = useState(models[0]?.value || "");
  const physical = format === "disc" || format === "cartridge";

  function onPlatform(next) {
    const nextFormats = CONSOLE_FORMATS[next] || [];
    const nextFormat = nextFormats[0]?.value || "disc";
    setPlatform(next);
    setFormat(nextFormat);
    setModel((CONSOLE_MODELS[`${next}:${nextFormat}`] || [])[0]?.value || "");
  }

  function onFormat(next) {
    setFormat(next);
    setModel((CONSOLE_MODELS[`${chosenPlatform}:${next}`] || [])[0]?.value || "");
  }

  async function onSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const gameName = String(form.get("game_name") || "").trim();
    const price = parseToman(form.get("price_amount"));
    const body = new FormData();
    body.set("offer_type", "ConsoleGame");
    body.set("title", String(form.get("title") || "").trim());
    body.set("game_name", gameName);
    body.set("description", String(form.get("description") || "").trim());
    body.set("price_amount", String(price));
    body.set(
      "attributes",
      JSON.stringify({
        platform: chosenPlatform,
        format,
        console_model: model,
        condition: String(form.get("condition") || "used"),
        region: String(form.get("region") || "").trim(),
        edition: String(form.get("edition") || "").trim(),
        dlc: String(form.get("dlc") || "none"),
        shipping: physical ? String(form.get("shipping") || "post") : "account",
      }),
    );
    const created = await createListing(body);
    if (!created.ok) {
      setBusy(false);
      setError(created.message || "آگهی ساخته نشد.");
      return;
    }
    const id = created.data?.id;
    const file = form.get("file");
    if (id && file instanceof File && file.size > 0) {
      const image = new FormData();
      image.set("listing_id", String(id));
      image.set("slot", "profile");
      image.set("file", file);
      const uploaded = await uploadListingImage(image);
      if (!uploaded.ok) {
        setBusy(false);
        setError(uploaded.message || "عکس ذخیره نشد.");
        return;
      }
    }
    const placed = await placeListing(id);
    setBusy(false);
    if (!placed.ok) {
      setError(placed.message || "برای بررسی ثبت نشد. اگر بازی تازه است، اول باید در ادمین تأیید شود.");
      router.push("/dashboard/offers/ConsoleGame");
      return;
    }
    router.push("/dashboard/offers/ConsoleGame");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid max-w-[640px] gap-4 rounded-xl bg-white p-6">
      <label className="grid gap-1 text-[14px] font-bold">
        پلتفرم
        <select className={INPUT} value={chosenPlatform} onChange={(event) => onPlatform(event.target.value)}>
          {CONSOLE_PLATFORMS.filter((row) => row.sell).map((row) => (
            <option key={row.key} value={row.key}>
              {row.title}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-[14px] font-bold">
        نوع
        <select className={INPUT} value={format} onChange={(event) => onFormat(event.target.value)}>
          {formats.map((row) => (
            <option key={row.value} value={row.value}>
              {row.label}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-[14px] font-bold">
        کنسول
        <select className={INPUT} value={model} onChange={(event) => setModel(event.target.value)}>
          {models.map((row) => (
            <option key={row.value} value={row.value}>
              {row.label}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-[14px] font-bold">
        عنوان آگهی
        <input name="title" required minLength={5} maxLength={120} className={INPUT} placeholder="دیسک FC 26 برای PS5" />
      </label>
      <label className="grid gap-1 text-[14px] font-bold">
        اسم بازی
        <input name="game_name" required maxLength={80} className={INPUT} placeholder="FC 26" />
      </label>
      <label className="grid gap-1 text-[14px] font-bold">
        قیمت (تومان)
        <input name="price_amount" required inputMode="numeric" className={INPUT} placeholder="۱۵۰۰۰۰۰" />
      </label>
      {physical ? (
        <label className="grid gap-1 text-[14px] font-bold">
          وضعیت
          <select name="condition" className={INPUT} defaultValue="used">
            <option value="new">آکبند</option>
            <option value="used">کارکرده</option>
          </select>
        </label>
      ) : (
        <input type="hidden" name="condition" value="used" />
      )}
      <label className="grid gap-1 text-[14px] font-bold">
        ریجن
        <input name="region" maxLength={40} className={INPUT} placeholder="اروپا، آمریکا، آسیا" />
      </label>
      <label className="grid gap-1 text-[14px] font-bold">
        نسخه
        <input name="edition" maxLength={40} className={INPUT} placeholder="Standard یا Deluxe" />
      </label>
      {physical ? (
        <>
          <label className="grid gap-1 text-[14px] font-bold">
            کد الحاقیه
            <select name="dlc" className={INPUT} defaultValue="none">
              <option value="none">ندارد</option>
              <option value="unused">استفاده نشده</option>
              <option value="used">استفاده شده</option>
            </select>
          </label>
          <label className="grid gap-1 text-[14px] font-bold">
            ارسال
            <select name="shipping" className={INPUT} defaultValue="post">
              <option value="post">پست</option>
              <option value="meetup">تحویل حضوری</option>
            </select>
          </label>
        </>
      ) : null}
      <label className="grid gap-1 text-[14px] font-bold">
        توضیح
        <textarea name="description" rows={4} maxLength={5000} className="block w-full rounded-lg bg-[rgb(239,239,241)] p-3 text-[14px]" placeholder="وضعیت جعبه، خط‌وخش، و بازی‌های داخل اکانت یا راک." />
      </label>
      <label className="grid gap-1 text-[14px] font-bold">
        عکس
        <input name="file" type="file" accept="image/jpeg,image/png,image/webp" required className="text-[14px]" />
      </label>
      {error ? <p className="text-[14px] text-[rgb(232,27,22)]">{error}</p> : null}
      <button type="submit" disabled={busy} className="inline-flex min-h-[42px] items-center justify-center rounded-lg bg-ink px-4 text-[14px] font-bold text-white disabled:opacity-60">
        {busy ? "در حال ثبت" : "ارسال برای بررسی"}
      </button>
    </form>
  );
}
