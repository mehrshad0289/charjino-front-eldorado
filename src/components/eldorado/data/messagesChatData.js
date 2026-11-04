import { GAME_SELLER_POOL } from "./gamePagesData";
import { DASHBOARD_USER } from "./dashboardData";

/* Session 26 — content for the aria-label="Chat" container on
   /dashboard/messages. The messages-notempty capture leaves the chat
   container EMPTY (the real chat is a client-rendered app), so previous
   sessions rendered nothing there. The user then asked for the chat
   page to be built — this data populates it. Conversation partners are
   the capture-verbatim seller pool (gamePagesData.js); the threads are
   user-requested sample content, NOT capture data (documented, not
   invented silently). "me" = DASHBOARD_USER (NewFloat-0una). */

const S = GAME_SELLER_POOL;

export const MESSAGES_CHAT = {
  me: DASHBOARD_USER.name,
  conversations: [
    {
      id: "powerxhub",
      name: S[0].name,
      avatar: S[0].avatar,
      category: "Orders",
      time: "12:41",
      unread: 2,
      online: true,
      thread: [
        { date: "Today" },
        { from: "them", text: "Hi! Thanks for your order of 2400 CoD Points. I'm ready to deliver whenever you are online.", time: "12:31" },
        { from: "me", text: "Hey! I'm online now, ready when you are.", time: "12:33" },
        { from: "them", text: "Great. Please stay in the lobby — delivery takes about 5 minutes through the in-game store gift.", time: "12:34" },
        { attachment: { label: "Order #77351 — 2400 CoD Points (Xbox)", meta: "Delivery: 17 min - 1 h · Stock: 5", href: "/cod-points" }, from: "them", time: "12:35" },
        { from: "me", text: "Received, everything landed. Thanks a lot!", time: "12:40" },
        { from: "them", text: "Perfect! If anything looks off within 24h, message me here and I'll sort it. Enjoy!", time: "12:41" },
      ],
    },
    {
      id: "cnlteam",
      name: S[1].name,
      avatar: S[1].avatar,
      category: "Boosting",
      time: "11:02",
      unread: 0,
      online: true,
      thread: [
        { date: "Today" },
        { from: "me", text: "Is the EA FC 27 coin transfer still on schedule for today?", time: "10:58" },
        { from: "them", text: "Yes — the player-tax transfer starts in about an hour. I'll list the cards right away, you just buy them at the listed price.", time: "11:02" },
      ],
    },
    {
      id: "gaffa",
      name: S[3].name,
      avatar: S[3].avatar,
      category: "Orders",
      time: "Yesterday",
      unread: 0,
      online: false,
      thread: [
        { date: "Yesterday" },
        { from: "them", text: "Your Razer Gold 20 USD pin has been delivered to the order chat. Let me know once it redeems.", time: "18:22" },
        { from: "me", text: "Redeemed successfully, thank you!", time: "18:40" },
        { from: "them", text: "Glad to hear it. Have a great day!", time: "18:41" },
      ],
    },
    {
      id: "lunaguard",
      name: S[6].name,
      avatar: S[6].avatar,
      category: "Pre-purchase",
      time: "Yesterday",
      unread: 1,
      online: false,
      thread: [
        { date: "Yesterday" },
        { from: "me", text: "Hi — for the 10M DonutSMP money, can you deliver at my island instead of the market?", time: "09:15" },
        { from: "them", text: "Sure, island delivery works. I'm online after 5 pm CET today — ping me here when you're on.", time: "09:21" },
      ],
    },
    {
      id: "support",
      name: "Eldorado Support",
      avatar: S[2].avatar,
      support: true,
      category: "Support",
      time: "Nov 2",
      unread: 0,
      online: true,
      thread: [
        { date: "November 2" },
        { from: "me", text: "My verification documents were rejected — could you tell me why?", time: "14:02" },
        { from: "them", text: "Hello! The scan was cropped at the corners. Please re-upload the full document on a flat surface and we'll review it within 24 hours.", time: "14:11" },
        { from: "me", text: "Just re-uploaded. Thanks for the quick answer!", time: "14:20" },
      ],
    },
  ],
};
