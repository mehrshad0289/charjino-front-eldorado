/* Session 26 — data for the two dashboard routes the sidebar linked to
   but that had no page (/dashboard/notifications,
   /dashboard/boosting/my-requests). No captures exist for either, so
   the content is template-generated in the dashboard's own design
   language (chips like the messages-notempty capture, rows, the shared
   EmptyState). Notification texts reuse the product vocabulary the
   settings capture defines (order/message/dispute/payment/withdrawal
   updates). */

import { FA } from "./faCopy";

export const DASHBOARD_NOTIFICATIONS_PAGE = {
  icon: "notifications",
  title: FA.notifications,
  tabs: ["All", "Orders", "Messages", "Disputes", "Payments"],
  items: [
    { id: 1, icon: "orders", tab: "Orders", text: "Order #77351 — 2400 CoD Points (Xbox) marked as delivered. Confirm the order or open a dispute.", time: "12 min ago", unread: true },
    { id: 2, icon: "messages", tab: "Messages", text: "New message from PowerXhub: “Received, everything landed. Thanks a lot!”", time: "26 min ago", unread: true },
    { id: 3, icon: "orders", tab: "Orders", text: "Your boosting request “EA FC 27 — Division rivals wins” received a new offer from BoosterHub.", time: "2 h ago", unread: false },
    { id: 4, icon: "settings", tab: "Payments", text: "Withdrawal of $248.10 to your bank account was processed.", time: "5 h ago", unread: false },
    { id: 5, icon: "feedback", tab: "Disputes", text: "Dispute #D-2291 was resolved in your favour. The funds were released to your wallet.", time: "Yesterday", unread: false },
    { id: 6, icon: "messages", tab: "Messages", text: "New message from Eldorado Support about your verification re-upload.", time: "Nov 2", unread: false },
  ],
};

export const DASHBOARD_BOOSTING_REQUESTS_PAGE = {
  icon: "boosting",
  title: FA.myRequests,
  emptyState: {
    image: "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F91671a13bded2708951c70c98c7f9d8f11e1ed60.svg?generation=1793785993043728&alt=media",
    imageAlt: "No boosting requests",
    title: "No boosting requests yet",
    text: "Create a request and verified boosters will send you offers with their price and delivery time.",
  },
};
