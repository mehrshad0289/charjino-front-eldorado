"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import EldSelect from "./EldSelect";
import { ORDER_COPY } from "./data/orderData";
import { toFaDigits } from "@/lib/fa-digits";
import { EMPTY_ORDER_STATUS_COUNTS } from "@/lib/order-list-query";

function SearchIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 4v10m0 0 4-4m-4 4-4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 19h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function statusOptions(counts) {
  return ORDER_COPY.statusFilters.map((item) => {
    if (item.value === "all") return item;
    const n = counts?.[item.value] ?? 0;
    return { value: item.value, label: `${item.label} (${toFaDigits(n)})` };
  });
}

export default function DashboardOrderFilters({
  status = "all",
  period = "recent",
  query = "",
  counts = EMPTY_ORDER_STATUS_COUNTS,
  searchPlaceholder,
  invoiceHref,
  invoiceLabel,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [draft, setDraft] = useState(query);

  const apply = useCallback(
    (patch) => {
      const next = {
        status: patch.status ?? status,
        period: patch.period ?? period,
        q: patch.q !== undefined ? String(patch.q).trim().slice(0, 50) : query,
      };
      const params = new URLSearchParams();
      if (next.status !== "all") params.set("status", next.status);
      if (next.period !== "recent") params.set("period", next.period);
      if (next.q) params.set("q", next.q);
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    },
    [status, period, query, pathname, router],
  );

  useEffect(() => {
    setDraft(query);
  }, [query]);

  useEffect(() => {
    if (draft === query) return undefined;
    const timer = window.setTimeout(() => apply({ q: draft }), 400);
    return () => window.clearTimeout(timer);
  }, [draft, query, apply]);

  const filters = (
    <div className="flex flex-wrap gap-2.5 [&>*]:min-w-full min-[601px]:[&>*]:min-w-[12.5rem]">
      <EldSelect
        ariaLabel="Single-select dropdown"
        value={status}
        onChange={(value) => apply({ status: value })}
        options={statusOptions(counts)}
      />
      <EldSelect
        ariaLabel="Single-select dropdown"
        value={period}
        onChange={(value) => apply({ period: value })}
        options={ORDER_COPY.periodFilters}
      />
      {searchPlaceholder ? (
        <div>
          <div className="relative w-full min-[601px]:w-[12.5rem]">
            <input
              type="text"
              value={draft}
              maxLength={50}
              onChange={(event) => setDraft(event.target.value.slice(0, 50))}
              placeholder={searchPlaceholder}
              className="block h-[42px] w-full overflow-clip rounded-lg border-2 border-[rgb(239,239,241)] bg-[rgb(239,239,241)] py-[6px] ps-3 pe-9 leading-[19.2px] outline-none placeholder:text-placehold"
            />
            <div className="absolute end-2 top-1/2 -translate-y-1/2 text-[rgb(20,20,26)]">
              <SearchIcon />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );

  if (!invoiceLabel) {
    return <div className="mb-3.5">{filters}</div>;
  }

  return (
    <div className="mb-3.5 flex flex-col gap-2.5 min-[601px]:flex-row">
      {filters}
      <div className="ms-auto min-w-full min-[601px]:min-w-[12.5rem]">
        <a
          href={invoiceHref || "/dashboard/orders/sold/invoice"}
          aria-label={invoiceLabel}
          className="inline-flex min-h-[42px] w-full min-w-[70px] items-center justify-center overflow-hidden rounded-lg bg-[rgb(244,244,244)] px-4 py-2.5 text-center text-[14px] font-bold leading-[21px] text-[rgb(20,20,26)]"
        >
          <span className="flex items-center justify-center gap-1.5">
            <span>{invoiceLabel}</span>
            <DownloadIcon />
          </span>
        </a>
      </div>
    </div>
  );
}
