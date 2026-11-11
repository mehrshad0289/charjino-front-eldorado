import Link from "next/link";
import { formatToman } from "../../lib/listing";
import { formatOrderDate, listingGame, listingTitle, orderStatusMeta } from "../../lib/order";
import { toFaDigits } from "../../lib/fa-digits";

export default function OrderCard({ order, href, amountKey = "buyer_paid_amount" }) {
  const status = orderStatusMeta(order?.status);
  const amount = order?.[amountKey] ?? order?.price_amount;
  return (
    <Link
      href={href}
      className="flex flex-col gap-2 rounded-xl bg-white p-4 shadow-[0_2px_4px_rgba(9,9,11,0.05),0_12px_8px_rgba(9,9,11,0.02)]"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[16px] font-bold">{listingTitle(order)}</p>
          <p className="text-[14px] text-graytext">
            {listingGame(order)}
            {listingGame(order) ? " · " : ""}
            {formatToman(amount)} تومان
          </p>
          <p className="mt-1 text-[13px] text-graytext">{toFaDigits(order?.order_no || "")}</p>
        </div>
        <span className="rounded-lg px-3 py-1 text-[13px] font-bold text-white" style={{ backgroundColor: status.bg }}>
          {status.label}
        </span>
      </div>
      {order?.created_at ? <p className="text-[13px] text-graytext">{formatOrderDate(order.created_at)}</p> : null}
    </Link>
  );
}
