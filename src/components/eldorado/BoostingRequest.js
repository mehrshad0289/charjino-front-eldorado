"use client";

import { useState } from "react";
import { submitBoostRequest, uploadBoostImage } from "../../actions/market.actions";

function emptyValue(field) {
  if (field.type === "multi_select") return [];
  if (field.type === "checkbox") return false;
  if (field.type === "range") return { from: "", to: "" };
  return field.default_value || "";
}

export default function BoostingRequest({ gameId, gameName, form }) {
  const [values, setValues] = useState(() =>
    Object.fromEntries((form?.fields || []).map((field) => [field.field_key, emptyValue(field)])),
  );
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!form) {
    return (
      <p className="mx-auto max-w-[720px] px-4 py-10 text-[16px] leading-[28px]">
        فرم بوست {gameName || "این بازی"} هنوز منتشر نشده است.
      </p>
    );
  }

  function setValue(key, value) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function onFile(key, file) {
    if (!file) return;
    setError("");
    const uploaded = await uploadBoostImage(file);
    if (uploaded.unauthorized) {
      window.location.href = `/login?next=${encodeURIComponent(window.location.pathname)}`;
      return;
    }
    if (!uploaded.ok) {
      setError(uploaded.message || "تصویر ذخیره نشد.");
      return;
    }
    setValue(key, uploaded.data.url);
  }

  async function onSubmit(event) {
    event.preventDefault();
    setError("");
    for (const field of form.fields) {
      const value = values[field.field_key];
      const empty = value === "" || value === null || (Array.isArray(value) && value.length === 0);
      if (field.required && empty) {
        setError(`«${field.label}» را پر کن.`);
        return;
      }
    }
    setLoading(true);
    const sent = await submitBoostRequest(gameId, values);
    setLoading(false);
    if (sent.unauthorized) {
      window.location.href = `/login?next=${encodeURIComponent(window.location.pathname)}`;
      return;
    }
    if (!sent.ok) {
      setError(sent.message || "درخواست ثبت نشد.");
      return;
    }
    setResult(sent.data);
  }

  if (result) {
    return (
      <section className="mx-auto max-w-[720px] px-4 py-10">
        <h1 className="text-[24px] font-bold">درخواست ثبت شد</h1>
        <p className="mt-2 text-[16px] leading-[28px]">شماره {result.requestNo}</p>
        <p className="mt-2 text-[15px] leading-[26px] text-graytext">{result.priceNote}</p>
      </section>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto grid w-full max-w-[1100px] gap-6 px-4 py-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-6">
      <section className="space-y-4 rounded-lg bg-white p-5 shadow-[rgba(9,9,11,0.05)_0px_2px_4px_0px]">
        <h1 className="text-[24px] font-bold">{form.title}</h1>
        <p className="text-[14px] text-graytext">{gameName}</p>
        {form.fields.map((field) => (
          <label key={field.field_key} className="block text-[14px]">
            <span className="mb-1 block font-bold">
              {field.label}
              {field.required ? " *" : ""}
            </span>
            {field.help ? <span className="mb-1 block text-graytext">{field.help}</span> : null}
            <Field field={field} value={values[field.field_key]} onChange={(value) => setValue(field.field_key, value)} onFile={onFile} />
          </label>
        ))}
        {error ? <p className="text-[14px] text-red-600">{error}</p> : null}
        <button type="submit" disabled={loading} className="rounded-lg bg-darkbtn px-5 py-3 font-bold text-white disabled:opacity-60">
          {loading ? "…" : "ثبت درخواست"}
        </button>
      </section>
      <aside className="h-fit rounded-lg bg-white p-5 shadow-[rgba(9,9,11,0.05)_0px_2px_4px_0px]">
        <h2 className="text-[18px] font-bold">بعد از ثبت</h2>
        <p className="mt-2 text-[14px] leading-[24px] text-graytext">{form.priceNote}</p>
      </aside>
    </form>
  );
}

function Field({ field, value, onChange, onFile }) {
  const box = "mt-1 w-full rounded-lg border-2 border-inputgray bg-inputgray px-3 py-2 outline-none focus:border-focusblue focus:bg-white";
  if (field.type === "long_text") return <textarea rows={4} className={box} value={value || ""} onChange={(event) => onChange(event.target.value)} />;
  if (field.type === "number") return <input inputMode="numeric" className={box} value={value || ""} onChange={(event) => onChange(event.target.value)} />;
  if (field.type === "select") {
    return (
      <select className={box} value={value || ""} onChange={(event) => onChange(event.target.value)}>
        <option value="">انتخاب کن</option>
        {(field.options || []).map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    );
  }
  if (field.type === "radio") {
    return (
      <span className="mt-1 flex flex-col gap-2">
        {(field.options || []).map((option) => (
          <span key={option} className="flex items-center gap-2">
            <input type="radio" name={field.field_key} checked={value === option} onChange={() => onChange(option)} />
            {option}
          </span>
        ))}
      </span>
    );
  }
  if (field.type === "multi_select") {
    const picked = Array.isArray(value) ? value : [];
    return (
      <span className="mt-1 flex flex-col gap-2">
        {(field.options || []).map((option) => (
          <span key={option} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={picked.includes(option)}
              onChange={() => onChange(picked.includes(option) ? picked.filter((item) => item !== option) : [...picked, option])}
            />
            {option}
          </span>
        ))}
      </span>
    );
  }
  if (field.type === "checkbox") {
    return <input type="checkbox" className="mt-2" checked={Boolean(value)} onChange={(event) => onChange(event.target.checked)} />;
  }
  if (field.type === "range") {
    const range = value || { from: "", to: "" };
    return (
      <span className="mt-1 flex items-center gap-2">
        <input className={box} placeholder="از" value={range.from} onChange={(event) => onChange({ ...range, from: event.target.value })} />
        <input className={box} placeholder="تا" value={range.to} onChange={(event) => onChange({ ...range, to: event.target.value })} />
      </span>
    );
  }
  if (field.type === "image") {
    return (
      <span className="mt-1 block">
        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => onFile(field.field_key, event.target.files?.[0])} />
        {value ? <span className="mt-1 block text-xs text-graytext">تصویر انتخاب شد</span> : null}
      </span>
    );
  }
  return <input className={box} value={value || ""} onChange={(event) => onChange(event.target.value)} />;
}
