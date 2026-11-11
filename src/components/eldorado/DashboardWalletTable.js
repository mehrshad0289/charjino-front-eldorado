"use client";

import { useMemo, useState } from "react";
import { formatToman } from "../../lib/listing";
import { formatOrderDate } from "../../lib/order";
import { DASHBOARD_WALLET_PAGE } from "./data/dashboardData";
import EldSelect from "./EldSelect";

const CARD_SHADOW =
  "shadow-[rgba(9,_9,_11,_0.05)_0px_2px_4px_0px,_rgba(9,_9,_11,_0.02)_0px_12px_8px_0px]";

function PageChip({ children, wide = false }) {
  return (
    <div
      className={`pointer-events-none flex items-center justify-center bg-[rgb(239,_239,_241)] text-[14px] font-bold tracking-[0.42px] leading-[17px] opacity-70 ${
        wide ? "h-[42px] min-w-[59px] px-4 py-1.5" : "size-[42px]"
      } rounded-sm`}
    >
      {children}
    </div>
  );
}

function kindLabel(kind) {
  return DASHBOARD_WALLET_PAGE.kinds[kind] || DASHBOARD_WALLET_PAGE.kinds.other;
}

function amountClass(amount) {
  if (amount > 0) return "text-[rgb(0,_228,_201)]";
  if (amount < 0) return "text-[rgb(232,_27,_22)]";
  return "";
}

function matchesCategory(row, category) {
  if (category === "all") return true;
  const kinds = DASHBOARD_WALLET_PAGE.filterKinds[category] || [];
  return kinds.includes(row.kind || "other");
}

export default function DashboardWalletTable({ balances, items }) {
  const page = DASHBOARD_WALLET_PAGE;
  const [category, setCategory] = useState("all");
  const rows = useMemo(() => {
    const list = Array.isArray(items) ? items : [];
    return list.filter((row) => matchesCategory(row, category));
  }, [items, category]);

  return (
    <>
      <div className="flex justify-between">
        <div
          className={`mb-10 grid w-full max-w-[500px] items-center gap-2.5 bg-white py-[17px] px-6 ${CARD_SHADOW}`}
          style={{ gridTemplateColumns: "1fr 105px" }}
        >
          <div className="relative flex flex-col">
            <h5 className="mb-[7px] text-[14px] font-bold leading-normal">{page.balanceLabel}</h5>
            <h4 className="text-[24px] font-bold leading-[28.8px]">
              {formatToman(balances?.withdrawable)} تومان
            </h4>
          </div>
        </div>
      </div>
      <div className="mb-[22px] flex">
        <EldSelect
          className="w-[200px]"
          value={category}
          onChange={setCategory}
          options={page.filterOptions}
        />
      </div>
      <div className={`bg-white ${CARD_SHADOW}`}>
        <div className="hidden bg-white md:flex">
          {page.columns.map((column, index) => (
            <div key={column} className="px-5 py-3" style={{ width: page.columnWidths[index] }}>
              <h5 className="text-[14px] font-bold leading-5">{column}</h5>
            </div>
          ))}
        </div>
        <div className="h-px border-t-[0.8px] border-[rgb(231,_231,_231)]" />
        {rows.length === 0 ? (
          <p className="px-5 py-8 text-[14px] text-graytext">{page.emptyText}</p>
        ) : (
          rows.map((row, index) => {
            const amount = Number(row.amount || 0);
            return (
              <div
                key={row.id}
                className={`flex flex-col bg-white md:flex-row md:rounded-b-[0.3125rem] ${
                  index > 0 ? "border-t-[0.8px] border-[rgb(231,231,231)]" : ""
                }`}
              >
                <div className="w-full md:w-[20%] md:border-e-[0.8px] md:border-e-[rgb(231,231,231)]">
                  <div className="px-5 py-4">
                    <p className="text-[14px] leading-[21px]">{formatOrderDate(row.created_at)}</p>
                  </div>
                </div>
                <div className="w-full md:w-[15%] md:border-e-[0.8px] md:border-e-[rgb(231,231,231)]">
                  <div className="px-5 py-4">
                    <p className={`text-[14px] leading-[21px] ${amountClass(amount)}`}>
                      {amount > 0 ? "+" : ""}
                      {formatToman(amount)} تومان
                    </p>
                  </div>
                </div>
                <div className="w-full md:w-[31%] md:border-e-[0.8px] md:border-e-[rgb(231,231,231)]">
                  <div className="px-5 py-4">
                    <p className="text-[14px] leading-[21px]">{row.order_no || ""}</p>
                  </div>
                </div>
                <div className="w-full md:w-[34%]">
                  <div className="px-5 py-4">
                    <p className="text-[14px] leading-[21px]">{kindLabel(row.kind)}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      <div className="relative mt-[30px] mb-[15px] flex justify-center pt-5 pb-5 text-center">
        <div className="mx-[3px] mb-1.5">
          <PageChip wide>{page.first}</PageChip>
        </div>
        <div className="px-[5px]">
          <PageChip>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m14 7-5 5 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </PageChip>
        </div>
        <div className="px-[5px]">
          <PageChip>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m10 7 5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </PageChip>
        </div>
        <div className="mx-[3px] mb-1.5">
          <PageChip wide>{page.last}</PageChip>
        </div>
      </div>
    </>
  );
}
