import { FA } from "@/components/eldorado/data/faCopy";
import { formatOrderDate } from "@/lib/order";

export const NOTIFICATION_TABS = [
  { id: "all", label: FA.notificationTabAll },
  { id: "orders", label: FA.notificationTabOrders },
  { id: "messages", label: FA.notificationTabMessages },
  { id: "disputes", label: FA.notificationTabDisputes },
  { id: "payments", label: FA.notificationTabPayments },
  { id: "verification", label: FA.notificationTabVerification },
];

const KIND_TAB = {
  listing_approved: "orders",
  listing_rejected: "orders",
  new_order: "orders",
  ticket_replied: "messages",
  comment_approved: "messages",
  dispute_opened: "disputes",
  dispute_resolved: "disputes",
  sale_released: "payments",
  payment_received: "payments",
  wallet_credited: "payments",
  withdrawal_requested: "payments",
  withdrawal_paid: "payments",
  kyc_submitted: "verification",
  kyc_approved: "verification",
  kyc_rejected: "verification",
};

const TAB_ICON = {
  orders: "orders",
  messages: "messages",
  disputes: "feedback",
  payments: "wallet",
  verification: "settings",
};

export function notificationTab(kind) {
  return KIND_TAB[kind] || "orders";
}

export function notificationIcon(kind) {
  return TAB_ICON[notificationTab(kind)] || "notifications";
}

export function notificationTime(iso) {
  return formatOrderDate(iso);
}

export function isNotificationUnread(item) {
  return !item?.read_at;
}
