import { toFaDigits } from "./fa-digits";

export const ORDER_STATUS = {
  cart_pending: { label: "در انتظار پرداخت", bg: "rgb(106, 102, 123)", waitPay: true },
  awaiting_payment: { label: "در انتظار پرداخت", bg: "rgb(106, 102, 123)", waitPay: true },
  payment_verifying: { label: "در درگاه پرداخت", bg: "rgb(255, 141, 0)", waitPay: true },
  paid: { label: "منتظر فروشنده", bg: "rgb(255, 141, 0)" },
  awaiting_delivery: { label: "در حال آماده‌سازی", bg: "rgb(255, 141, 0)" },
  delivered: { label: "تحویل شد", bg: "rgb(71, 131, 255)" },
  buyer_reviewing: { label: "بررسی خریدار", bg: "rgb(71, 131, 255)", canReveal: true },
  completed: { label: "تکمیل شد", bg: "rgb(33, 150, 83)" },
  settling: { label: "در کیف پول فروشنده", bg: "rgb(33, 150, 83)" },
  settled: { label: "تسویه شد", bg: "rgb(33, 150, 83)" },
  dispute_opened: { label: "اختلاف", bg: "rgb(232, 27, 22)" },
  under_review: { label: "بررسی اختلاف", bg: "rgb(232, 27, 22)" },
  arbiter_resolved: { label: "رأی داور", bg: "rgb(34, 33, 39)" },
  refunding: { label: "بازگشت وجه", bg: "rgb(232, 27, 22)" },
  refunded: { label: "بازگشت داده شد", bg: "rgb(106, 102, 123)" },
  canceled: { label: "لغو شد", bg: "rgb(106, 102, 123)" },
  expired: { label: "منقضی شد", bg: "rgb(106, 102, 123)" },
};

export const ORDER_EVENT_LABELS = {
  "order.created": "سفارش ساخته شد",
  "order.payment_started": "آمادهٔ پرداخت",
  "payment.started": "رفتن به درگاه",
  "payment.paid_and_held": "پرداخت تأیید شد و پول نزد شارژینو ماند",
  "payment.verify_failed": "پرداخت تأیید نشد",
  "order.seller_ack": "فروشنده سفارش را پذیرفت",
  "order.delivered": "مشخصات اکانت ارسال شد",
  "delivery.stored": "تحویل ذخیره شد",
  "delivery.revealed": "خریدار اطلاعات ورود را دید",
  "order.confirmed": "دریافت تأیید شد",
  "settlement.released": "سهم فروشنده به کیف پول رفت",
  "order.canceled_by_buyer": "خریدار لغو کرد",
  "order.message_sent": "پیام در سفارش",
  "escrow.released": "پول فروشنده آزاد شد",
};

export function orderStatusMeta(status) {
  return ORDER_STATUS[status] || { label: status || "نامشخص", bg: "rgb(106, 102, 123)" };
}

export function orderEventLabel(action) {
  return ORDER_EVENT_LABELS[action] || action;
}

export function orderNeedsPayment(status) {
  return Boolean(ORDER_STATUS[status]?.waitPay);
}

export function orderCanReview(status, delivery) {
  if (status === "buyer_reviewing") return true;
  return Boolean(delivery?.has_payload);
}

export function formatOrderDate(iso) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return toFaDigits(date.toLocaleString("fa-IR"));
}

export function testPayUrl(reference, orderNo, amount) {
  const query = new URLSearchParams();
  query.set("reference", String(reference || ""));
  if (orderNo) query.set("order", String(orderNo));
  if (amount) query.set("amount", String(amount));
  return `/pay/test?${query.toString()}`;
}

export function listingTitle(order) {
  return order?.listing?.title || order?.order_no || "سفارش";
}

export function listingGame(order) {
  return order?.listing?.game_name || "";
}
