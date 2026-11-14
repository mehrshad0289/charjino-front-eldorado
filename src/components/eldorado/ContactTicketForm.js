"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createTicket } from "@/actions/tickets.actions";
import { CONTACT_PAGE } from "./data/staticPagesData";
import { TICKET_NEW, ticketHref, ticketLoginHref } from "@/lib/tickets";
import EldSelect from "./EldSelect";

const CARD = "rounded-xl border-[0.8px] border-cardborder bg-card p-6 shadow-[0_2px_4px_rgba(9,9,11,0.05),0_12px_8px_rgba(9,9,11,0.02)]";
const copy = CONTACT_PAGE.ticket;

export default function ContactTicketForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [previews, setPreviews] = useState([]);
  const [category, setCategory] = useState("other");
  const loginHref = ticketLoginHref(TICKET_NEW);

  async function onSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const result = await createTicket(new FormData(event.currentTarget));
    setBusy(false);
    if (result.unauthorized) {
      router.push(loginHref);
      return;
    }
    if (!result.ok) {
      setMessage(result.message || "تیکت ثبت نشد.");
      return;
    }
    const id = result.ticket?.id || result.ticket?.number;
    if (id) {
      router.push(ticketHref(id));
      router.refresh();
      return;
    }
    setMessage("تیکت ثبت شد.");
    event.target.reset();
    setPreviews([]);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className={`${CARD} flex flex-col gap-4`}>
      <label className="flex flex-col gap-1 text-[14px] font-bold">
        {copy.subject}
        <input
          name="subject"
          required
          minLength={4}
          maxLength={160}
          className="min-h-12 rounded-lg border border-cardborder bg-white px-4 text-[14px] font-normal outline-none"
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-[14px] font-bold">
          {copy.category}
          <EldSelect
            name="category"
            ariaLabel={copy.category}
            value={category}
            onChange={setCategory}
            options={CONTACT_PAGE.categories.map((item) => ({ value: item.id, label: item.label }))}
          />
        </label>
        <label className="flex flex-col gap-1 text-[14px] font-bold">
          {copy.orderNumber}
          <input
            name="orderNumber"
            maxLength={32}
            className="min-h-12 rounded-lg border border-cardborder bg-white px-4 text-[14px] font-normal outline-none"
          />
        </label>
      </div>
      <label className="flex flex-col gap-1 text-[14px] font-bold">
        {copy.body}
        <textarea
          name="body"
          required
          minLength={8}
          maxLength={4000}
          rows={6}
          className="rounded-lg border border-cardborder bg-white px-4 py-3 text-[14px] font-normal outline-none"
        />
      </label>
      <label className="flex flex-col gap-1 text-[14px] font-bold">
        {copy.photos}
        <input
          name="images"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="text-[14px] font-normal"
          onChange={(event) => {
            const files = [...(event.currentTarget.files || [])].slice(0, 5);
            setPreviews(files.map((file) => URL.createObjectURL(file)));
          }}
        />
        <span className="font-normal text-graytext">{copy.photosHint}</span>
      </label>
      {previews.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {previews.map((src) => (
            <img key={src} alt="" src={src} className="h-20 w-20 rounded-lg object-cover" />
          ))}
        </div>
      ) : null}
      {message ? <p className="text-[14px] text-[rgb(232,27,22)]">{message}</p> : null}
      <button
        type="submit"
        disabled={busy}
        className="inline-flex min-h-12 items-center justify-center rounded-lg bg-darkbtn px-4 py-3 font-bold text-white disabled:opacity-60"
      >
        {copy.submit}
      </button>
    </form>
  );
}
