import { formatOrderDate, orderEventLabel } from "../../lib/order";

export default function OrderTimeline({ items = [] }) {
  if (!items.length) return null;
  return (
    <ol className="mt-5 flex flex-col gap-3 border-s-2 border-hairline ps-4">
      {items.map((item) => (
        <li key={item.id} className="text-[14px] leading-[22px]">
          <p className="font-bold">{orderEventLabel(item.action)}</p>
          <p className="text-[13px] text-graytext">{formatOrderDate(item.at)}</p>
        </li>
      ))}
    </ol>
  );
}
