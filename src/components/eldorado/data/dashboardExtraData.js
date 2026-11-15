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
