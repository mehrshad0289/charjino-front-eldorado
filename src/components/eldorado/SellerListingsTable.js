"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { pauseListing, resumeListing } from "@/actions/market.actions";
import { formatToman, listingStatusMeta } from "@/lib/listing";
import { LISTING_COPY } from "./data/listingData";

export default function SellerListingsTable({ items = [] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");

  async function run(id, action) {
    setBusyId(String(id));
    setError("");
    const result = await action(id);
    setBusyId("");
    if (result.unauthorized) {
      router.push("/login?next=/dashboard/offers/Account");
      return;
    }
    if (!result.ok) {
      setError(result.message || "انجام نشد.");
      return;
    }
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-3">
      {error ? <p className="text-[14px] text-[rgb(232,27,22)]">{error}</p> : null}
      {items.map((row) => {
        const status = listingStatusMeta(row.status);
        const editable = row.status === "draft";
        return (
          <article
            key={row.id}
            className="flex flex-col gap-3 rounded-xl bg-white p-4 shadow-[0_2px_4px_rgba(9,9,11,0.05),0_12px_8px_rgba(9,9,11,0.02)]"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[16px] font-bold">{row.title}</p>
                <p className="text-[14px] text-graytext">
                  {row.game_name} · {formatToman(row.price_amount)} تومان
                </p>
              </div>
              <span
                className="rounded-lg px-3 py-1 text-[13px] font-bold text-white"
                style={{ backgroundColor: status.bg }}
              >
                {status.label}
              </span>
            </div>
            {row.rejection_reason ? (
              <p className="text-[14px] text-[rgb(232,27,22)]">{row.rejection_reason}</p>
            ) : null}
            <div className="flex flex-wrap gap-2">
              {editable ? (
                <Link
                  href={`/dashboard/offers/Account/${row.id}`}
                  className="inline-flex min-h-10 items-center rounded-lg bg-[rgb(34,33,39)] px-3 text-[13px] font-bold text-white"
                >
                  {LISTING_COPY.edit}
                </Link>
              ) : null}
              {row.status === "active" ? (
                <button
                  type="button"
                  disabled={busyId === String(row.id)}
                  onClick={() => run(row.id, pauseListing)}
                  className="inline-flex min-h-10 items-center rounded-lg border-2 border-[rgb(34,33,39)] px-3 text-[13px] font-bold"
                >
                  {LISTING_COPY.pause}
                </button>
              ) : null}
              {row.status === "paused" ? (
                <button
                  type="button"
                  disabled={busyId === String(row.id)}
                  onClick={() => run(row.id, resumeListing)}
                  className="inline-flex min-h-10 items-center rounded-lg border-2 border-[rgb(34,33,39)] px-3 text-[13px] font-bold"
                >
                  {LISTING_COPY.resume}
                </button>
              ) : null}
            </div>
          </article>
        );
      })}
    </div>
  );
}
