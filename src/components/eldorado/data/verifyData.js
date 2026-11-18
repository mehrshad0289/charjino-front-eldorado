export const VERIFY_BANNER =
  "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2Fcb349af7034e5d56903b906fd4731e95c15b05bd.png?generation=1793807132818751&alt=media";

/* /verify/status — layout from the Eldorado capture (ui ux/verify/).
   Copy is the Persian parallel of that capture, not extra Charjino cards. */

export const VERIFY_STATUS = {
  badge: "اقدام لازم",
  badgeBg: "rgb(232, 27, 22)",
  title: "نزدیک شدی...",
  subtitle: "برای ادامه احراز، جزئیات را بررسی کن و اگر لازم است به‌روز کن.",
  cta: "ادامه احراز هویت",
  next: {
    title: "بعد چه می‌شود",
    items: [
      "قوانین فروشنده را می‌پذیری",
      "هویت و مدارک را می‌فرستی تا ادمین بررسی کند",
      "بعد از تأیید ادمین، شبا و نام را ثبت می‌کنی تا ادمین دوباره تأیید کند",
    ],
  },
  why: {
    title: "چرا احراز مهم است",
    body: "برای محافظت از همه در پلتفرم، فروشنده را قبل از تسویه و فروش کامل احراز می‌کنیم. وضعیت تأییدشده تسویه را امن می‌کند و اعتماد خریدار را می‌سازد.",
  },
  help: {
    title: "کمک می‌خواهی؟",
    links: [
      {
        title: "پرسش‌های فروشنده",
        href: "/support/articles/8408997-seller-rules",
        external: false,
      },
      { title: "تماس با پشتیبانی", href: "/contact-us", external: false },
    ],
  },
  cardShadow:
    "0 0 0 0 rgba(0,0,0,0), 0 0 0 0 rgba(0,0,0,0), 0 0 0 0 rgba(0,0,0,0), 0 0 0 0 rgba(0,0,0,0), 0 2px 4px 0 rgba(9,9,11,0.05), 0 12px 8px 0 rgba(9,9,11,0.02)",
  infoPillBg: "rgba(232, 27, 22, 0.2)",
};

export const VERIFY_KYC = {
  fullName: "نام و نام خانوادگی",
  nationalId: "کد ملی",
  nationalCard: "تصویر کارت ملی",
  selfie: "سلفی با کارت ملی",
  pickFile: "انتخاب تصویر",
  fileHint: "JPG، PNG یا WEBP — حداکثر ۵ مگابایت. فقط ادمین می‌بیند.",
  submit: "ارسال برای بررسی",
  pendingBadge: "در انتظار بررسی",
  pendingBadgeBg: "rgb(255, 141, 0)",
  pendingTitle: "درخواست ثبت شد",
  pendingSubtitle: "فروش باز نیست تا ادمین مدارک را تأیید کند. خریدار این تصاویر را نمی‌بیند.",
  verifiedBadge: "تأیید شد",
  verifiedBadgeBg: "rgb(33, 150, 83)",
  verifiedTitle: "احراز این مرحله تمام است",
  verifiedSubtitle: "سطح ۲ تأیید شده. قدم بعد ثبت شبا است.",
  shebaBadge: "اقدام لازم",
  shebaTitle: "شبا را ثبت کن",
  shebaSubtitle: "سطح ۲ تأیید شده. شبا و نام صاحب حساب را می‌فرستی؛ تا تأیید ادمین فروش باز نیست.",
  shebaPendingTitle: "شبا در صف بررسی است",
  shebaPendingSubtitle: "فروش باز نیست تا ادمین شبا و نام صاحب حساب را تأیید کند.",
  shebaHolder: "نام صاحب حساب",
  shebaNumber: "شماره شبا",
  shebaHint: "شبا باید با IR  ۲۴ رقم باشد. رقم کنترل همان لحظه چک می‌شود؛ .",
  shebaSubmit: "ثبت شبا",
  shebaSavedTitle: "شبا ثبت شد",
  shebaSavedSubtitle: "تسویه به این شبا می‌رود. شماره کامل اینجا نشان داده نمی‌شود.",
  shebaReplace: "ثبت شبا جدید",
  listingCta: "ثبت آگهی",
  rejectedBadge: "نیاز به اصلاح",
  rejectedTitle: "درخواست تأیید نشد",
  rejectedFallback: "درخواست احراز هویت تأیید نشد.",
  rejectedCta: "ارسال دوباره",
  docsTitle: "مدارک را کامل کن",
  docsSubtitle: "کارت ملی و سلفی را بفرست تا بررسی ادمین شروع شود.",
  docsCta: "ارسال مدارک",
  termsBadge: "اقدام لازم",
  termsTitle: "قوانین فروشنده",
  termsSubtitle: "قبل از احراز هویت، قوانین فروشنده را بخوان و بپذیر. بدون این مرحله آگهی ثبت نمی‌شود.",
  termsCta: "پذیرش و ادامه",
  termsCheck: "قوانین فروشنده را خواندم و می‌پذیرم.",
  termsLink: "خواندن قوانین فروشنده",
  steps: [
    { id: "terms", label: "قوانین" },
    { id: "identity", label: "هویت و مدارک" },
    { id: "admin", label: "تأیید ادمین" },
    { id: "sheba", label: "شبا" },
  ],
};
