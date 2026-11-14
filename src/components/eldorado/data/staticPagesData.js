/* Contact Us (/contact-us) + Bug Bounty (/bug-bounty) page data — verbatim
   from the user-pushed captures (session 12):
   - ui ux/contact-us/www_eldorado_gg_contact-us_1920w_390w_1536w_default.make
     (native fig-make file → decoded snapshots/contact-1920px-light-1.tsx)
   - ui ux/bug-bounty/www_eldorado_gg_bug-bounty_1920w_390w_1536w_default.make
     (decoded snapshots/bugbounty-1920px-light-1.tsx)
   Both 1920-only. Asset URLs verified HTTP 200 on 2026-11-04. The contact
   banner reuses the About Us banner asset (same h2d-ext-asset id in both
   captures). Icomoon glyphs decode empty — the two card icons and the
   accordion chevrons are inline SVGs. The "Start chat" button has no href in
   the capture (the live widget opens Intercom) — rendered as a button. */

const ASSET = "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F";

export const CONTACT_BANNER = {
  src: `${ASSET}8cf9d3d1040f082339213601b200fe6d2689e101.png?generation=1793787093293454&alt=media`,
  alt: "Contact Us Page Banner Image",
};

export const CONTACT_PAGE = {
  title: "چطور می‌توانیم کمک کنیم؟",
  body: "پشتیبانی شارژینو تیکت‌های سفارش، پرداخت و حساب را بررسی می‌کند. می‌توانی عکس هم پیوست کنی.",
  cards: [
    {
      icon: "chat",
      iconBg: "bg-contactblue",
      title: "ارسال تیکت",
      text: "در داشبورد موضوع را بنویس، توضیح بده و اگر لازم است عکس پیوست کن.",
      action: { label: "ارسال تیکت", ariaLabel: "ارسال تیکت", href: "/dashboard/tickets/new", dark: true },
    },
    {
      icon: "list",
      iconBg: "bg-badgebg",
      title: "تیکت‌های من",
      text: "گفتگو با پشتیبانی مثل چت است. فهرست تیکت‌ها در داشبورد است.",
      action: { label: "تیکت‌های من", ariaLabel: "تیکت‌های من", href: "/dashboard/tickets", dark: false },
    },
    {
      icon: "articles",
      iconBg: "bg-guarantee",
      title: "جستجوی مقاله‌ها",
      text: "جواب گارانتی اکانت، قوانین فروشنده و بازگشت وجه را در مرکز راهنما ببین.",
      action: { label: "جستجوی مقاله‌ها", ariaLabel: "جستجوی مقاله‌ها", href: "/support", dark: false },
    },
  ],
  ticket: {
    heading: "تیکت جدید",
    subject: "موضوع",
    category: "موضوع کلی",
    orderNumber: "شماره سفارش (اختیاری)",
    body: "توضیح",
    photos: "پیوست عکس",
    photosHint: "حداکثر پنج تصویر، هر کدام تا ۳ مگابایت. JPG، PNG یا WEBP.",
    submit: "ثبت تیکت",
    loginTitle: "برای ارسال تیکت وارد شو",
    loginText: "ورود با پیامک است. بعد از ورود به همین صفحه برمی‌گردی.",
    login: "ورود",
    mine: "تیکت‌های من",
    emptyTitle: "هنوز تیکتی نیست",
    empty: "تیکت جدید بفرست. گفتگو با پشتیبانی همین‌جا مثل چت باز می‌شود.",
    emptyPreview: "بدون پیام",
    emptyThread: "هنوز پیامی نیست.",
    pick: "یک تیکت را از فهرست انتخاب کن.",
    reply: "ارسال",
    replyPlaceholder: "پیام…",
    send: "ارسال",
    youPrefix: "شما: ",
    closed: "این تیکت بسته شده است.",
    back: "بازگشت به لیست تیکت‌ها",
    you: "تو",
    staff: "پشتیبانی شارژینو",
  },
  categories: [
    { id: "order", label: "سفارش" },
    { id: "payment", label: "پرداخت" },
    { id: "delivery", label: "تحویل" },
    { id: "account", label: "حساب" },
    { id: "other", label: "سایر" },
  ],
  statuses: {
    open: "باز",
    answered: "پاسخ‌داده‌شده",
    closed: "بسته‌شده",
  },
};

export const BUG_BOUNTY_PAGE = {
  hero: {
    src: `${ASSET}e00ea651ead4f482fc44ffb9d454d1bd5305729f.png?generation=1793787371132974&alt=media`,
    alt: "Bug bounty ninja image",
  },
  title: "Bug Bounty",
  sections: [
    {
      heading: "Why is the bug bounty a big deal?",
      paragraphs: [
        "We love our in-house penetration testers. Theyre talented white hat hackers who work hard to keep Eldorado one of the most secure in-game item marketplaces in the world. However, there are only so many of them, and Eldorado global infrastructure grows larger and more complex every month.",
        "Now, white hat hackers around the world can search our system for any flaws large or small and get paid for it. Bug hunters may earn rewards for anything from minor bugs to critical flaws  as long as they impact our service or security of the system.",
      ],
    },
  ],
  steps: {
    heading: "How does the bug bounty program work?",
    items: [
      { parts: ["1. You find something you think might be a bug, flaw or vulnerability in our service;"] },
      {
        parts: ["2. You report it to us via email "],
        link: { label: "bugs@eldorado.gg", href: "mailto:bugs@eldorado.gg" },
        partsAfter: ["."],
      },
      { parts: ["3. Our dev team evaluates your report to determine the impact that the issue has on our service;"] },
      { parts: ["4. You get cash in your Eldorado balance depending on the severity of the issue youve uncovered."] },
      {
        parts: ["5. Bounties can range from "],
        strong: "$10",
        middle: " for minor issues to over ",
        strong2: "$5,000",
        partsAfter: [" for critical flaws."],
      },
    ],
  },
  knownIssues: {
    title: "Known Issues",
    /* Collapsed rows only — the capture contains no accordion bodies for
       these entries, so none are invented. */
    items: [
      "Unprotected Cache Purge on Eldorado.gg",
      "Missing Cross-Origin Resource Policy (CORP)",
      "Dane TLSA",
      "Missing DNS CAA record",
      "Missing BIMI record",
      "Logout Cross-Site Request Forgery (CSRF)",
    ],
  },
};
