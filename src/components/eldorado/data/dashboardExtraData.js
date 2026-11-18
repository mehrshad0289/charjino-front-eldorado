/* Session 26 — data for the two dashboard routes the sidebar linked to
   but that had no page (/dashboard/notifications,
   /dashboard/boosting/my-requests). No captures exist for either, so
   the content is template-generated in the dashboard's own design
   language (chips like the messages-notempty capture, rows, the shared
   EmptyState). Notification texts reuse the product vocabulary the
   settings capture defines (order/message/dispute/payment/withdrawal
   updates). */

import { FA } from "./faCopy";
import { ILLUSTRATIONS } from "./illustrations";

export const DASHBOARD_NOTIFICATIONS_PAGE = {
  icon: "notifications",
  title: FA.notifications,
};

export const DASHBOARD_BOOSTING_REQUESTS_PAGE = {
  icon: "boosting",
  title: FA.myRequests,
  emptyState: {
    image: ILLUSTRATIONS.emptyDragon,
    imageAlt: FA.nothingFound,
    title: FA.nothingFound,
    text: "هنوز درخواست بوستی ثبت نشده.",
  },
};
