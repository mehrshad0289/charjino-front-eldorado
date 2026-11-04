/* Wallet content from the wallet capture (session 17): a white balance
   card (max-w 500px, grid "1fr 105px" — the second column is empty in the
   capture), a 200px "All" single-select combobox (inset 1px ring, same
   closed-dropdown convention as the offers filters), a white table card
   with four bold 14px column headers (widths 20/15/31/34%, no body rows —
   the capture's account has no transactions) and a centered, fully
   disabled pagination strip (First / ‹ / › / Last chips, 70% opacity). */

function ChevronDown() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m6 9.5 6 5 6-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

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

export default function DashboardWalletTable({ balanceLabel, balanceValue, filterLabel, columns, columnWidths }) {
  return (
    <>
      <div className="flex justify-between">
        <div className={`mb-10 grid w-full max-w-[500px] items-center gap-2.5 bg-white py-[17px] pl-6 pr-6 ${CARD_SHADOW}`} style={{ gridTemplateColumns: "1fr 105px" }}>
          <div className="relative flex flex-col">
            <h5 className="mb-[7px] text-[14px] font-bold leading-normal">{balanceLabel}</h5>
            <h4 className="text-[24px] font-bold leading-[28.8px]">{balanceValue}</h4>
          </div>
        </div>
      </div>
      <div className="mb-[22px] flex">
        <form className="w-[200px]">
          <button
            type="button"
            aria-label="Single-select dropdown"
            aria-haspopup="listbox"
            className="flex min-h-[42px] w-full items-center justify-between overflow-hidden rounded-lg bg-[rgb(239,_239,_241)] px-[14px] py-2 leading-[19.6px] shadow-[rgba(0,_0,_0,_0)_0px_0px_0px_1px_inset]"
          >
            <span className="block grow truncate text-[rgb(98,_99,_98)]">{filterLabel}</span>
            <span className="block shrink-0 text-[rgb(98,_99,_98)]">
              <ChevronDown />
            </span>
          </button>
        </form>
      </div>
      <div className={`bg-white ${CARD_SHADOW}`}>
        <div className="flex bg-white">
          {columns.map((c, i) => (
            <div key={c} className="py-3 pl-5 pr-5" style={{ width: columnWidths[i] }}>
              <h5 className="text-[14px] font-bold leading-5">{c}</h5>
            </div>
          ))}
        </div>
        <div className="h-px border-t-[0.8px] border-[rgb(231,_231,_231)]" />
      </div>
      <div className="mt-[30px] flex justify-center pb-5 pt-5">
        <div className="mx-[3px] mb-1.5">
          <PageChip wide>First</PageChip>
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
          <PageChip wide>Last</PageChip>
        </div>
      </div>
    </>
  );
}
