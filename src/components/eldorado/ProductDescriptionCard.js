import { PRODUCT } from "./data/productData";

/* "Offer description" card (product .make capture): white rounded card with
   18px bold title, offer chips (blue check + bold label + gray ⓘ) and the
   pre-wrapped description text. The capture decode lost the Portuguese
   diacritics; the text here follows the live rendering of the same offer
   (verified 2026-11-04). */

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m5 12.5 4.2 4.2L19 7" stroke="#2d5ead" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 11v5.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="7.6" r="1.15" fill="currentColor" />
    </svg>
  );
}

export default function ProductDescriptionCard({ copy }) {
  const title = copy?.title || "Offer description";
  const chips = copy?.chips || PRODUCT.chips;
  const description = copy?.description ?? PRODUCT.description;
  return (
    <div className="rounded-lg bg-white px-4 py-1 shadow-[rgba(9,9,11,0.05)_0px_2px_4px_0px,rgba(9,9,11,0.02)_0px_12px_8px_0px] lg:px-6">
      <h2 className="pb-4 pt-6 text-[18px] font-bold leading-[27px]">{title}</h2>
      <div className="flex flex-wrap gap-[16px]">
        {chips.map((chip) => (
          <div
            key={chip}
            className="flex w-fit items-center gap-[4px] rounded-full border-[0.8px] border-cardborder bg-white px-3 py-1 text-[14px] leading-[19.6px]"
          >
            <CheckIcon />
            <span className="block font-bold">{chip}</span>
            <span className="text-graytext">
              <InfoIcon />
            </span>
          </div>
        ))}
      </div>
      <p className="whitespace-pre-wrap py-4 text-[16px] leading-[24px]">{description}</p>
    </div>
  );
}
