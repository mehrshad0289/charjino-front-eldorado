import { formatTomanInWords } from "@/lib/price";

export default function OfferPrice({
  amount,
  words,
  fallback = "",
  className = "text-[18px] font-bold leading-[27px]",
}) {
  const line = words || (Number(amount) > 0 ? formatTomanInWords(amount) : "") || fallback;
  if (!line) return null;
  return (
    <strong aria-label="amount-price" className={className}>
      {line}
    </strong>
  );
}
