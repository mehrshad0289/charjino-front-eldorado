/* Live https://support.eldorado.gg/en/ — copy translated to Persian;
   images are the same Intercom files saved in /public/support. */

export const HELP_IMG = {
  hero: "/support/hero.png",
  logo: "/support/logo.png",
  logoFooter: "/support/logo-footer.png",
  gettingStarted: "/support/icon-getting-started.png",
  buying: "/support/icon-buying.png",
  selling: "/support/icon-selling.png",
  refunds: "/support/icon-refunds.png",
  account: "/support/icon-account.png",
  gameGuides: "/support/icon-game-guides.png",
};

export const HELP_COPY = {
  homeAria: "خانهٔ مرکز راهنما",
  explore: "کاوش الدورادو",
  contact: "تماس با ما",
  language: "فارسی",
  search: "جستجو",
  searchArticles: "جستجوی مقاله‌ها...",
  howCanWeHelp: "چطور می‌توانیم کمک کنیم؟",
  mostViewed: "پربازدیدترین مقاله‌ها",
  collections: "مجموعه‌ها",
  stillNeed: "هنوز کمک لازم داری؟",
  stillDesc: "تیم پشتیبانی ۲۴ ساعته در گفتگوی زنده در دسترس است.",
  allCollections: "همهٔ مجموعه‌ها",
  articlesCount: (n) => `${n} مقاله`,
};

function A(slug, title, summary = "") {
  return { slug, href: `/support/articles/${slug}`, title, summary };
}

export const HELP_ARTICLES = {
  "8409020-refund-and-return-policy": {
    title: "سیاست بازگشت وجه و مرجوعی",
    description: "این سیاست بازگشت وجه و مرجوعی را برای همهٔ دسته‌های سفارش در الدورادو پوشش می‌دهد.",
    updated: "به‌روزشده بیش از یک هفته پیش",
    collection: "refunds-and-protection",
    body: [
      { type: "p", text: "بازگشت وجه دو راه دارد: فروشنده آن را به موجودی الدورادو می‌زند، یا تیم داوری الدورادو بعد از اختلاف به نفع تو رأی می‌دهد." },
      { type: "p", text: "قاعدهٔ کلی: اول در گفتگوی سفارش با فروشنده تماس بگیر اگر می‌خواهی مرجوع یا بازگشت وجه کنی." },
      { type: "p", text: "وقتی فروشنده سفارش را Delivered می‌زند، ۳ روز فرصت داری داخل بازی چک کنی که همه چیز رسیده؛ بعد سفارش خودش Received می‌شود. تا مطمئن نشدی تأیید نکن و نگذار فروشنده عجله‌ات بدهد. اگر ایراد دارد از صفحهٔ سفارش اختلاف باز کن." },
      { type: "p", text: "بعد از Received پنجرهٔ اختلاف معمولی بسته می‌شود. برای بیشتر محصول‌ها حفاظت بعد از آن هم ادامه دارد؛ TradeShield را ببین و از پشتیبانی اختلاف باز کن." },
      { type: "h2", text: "چطور کار می‌کند" },
      { type: "ol", items: [
        "در گفتگوی سفارش با مدرک (اسکرین‌شات یا ویدیو) با فروشنده حرف بزن و بخواه برگرداند یا درست کند؛ معمولاً سریع‌ترین راه است.",
        "اگر حل نشد، برای بیشتر دسته‌ها همان لحظه اختلاف باز کن؛ برای اکانت تحویل آنی و گیفت‌کارت بعد از ۱۲ ساعت.",
        "از صفحهٔ سفارش اختلاف باز کن و مدرک را در بخش مخصوص بگذار. کل فرایند تا ۳ روز طول می‌کشد.",
        "تیم داوری با مدرک‌ها تصمیم نهایی می‌گیرد.",
        "اگر به نفع تو باشد سفارش لغو می‌شود و پول به موجودی الدورادو می‌رود.",
      ] },
      { type: "p", text: "بازگشت به موجودی، کارمزد پرداخت اولیه را کم می‌کند. می‌توانی همان موجودی را برای سفارش بعد استفاده کنی، یا از پشتیبانی بخواهی به روش پرداخت اول برگردد (برای کارت پیش‌پرداخت نیست)." },
      { type: "h2", text: "اکانت‌ها" },
      { type: "p", text: "واجد: تحویل در مهلت نشد، مشخصات ورود غلط است، دسترسی کامل نداری (ایمیل نیست)، فروشنده اکانت را برگرداند، اکانت با آگهی یکی نیست به شرطی که رمز را عوض نکرده باشی، روی آن بازی نکرده باشی، خرید نکرده باشی یا نفروخته باشی." },
      { type: "p", text: "غیرواجد: دورهٔ حفاظت تمام شده، اشتباهاً خریدی و تحویل شده، مستقیم از سایت الدورادو نخریدی، به‌خاطر کار خودت بن شده، مدرک را بیرون از الدورادو گذاشتی." },
      { type: "h2", text: "بوستینگ / ارز و آیتم / گیفت‌کارت" },
      { type: "p", text: "واجد اگر تحویل کامل در مهلت نبود، جزئی بود، یا جزئیات ورود/کد غلط بود. غیرواجد اگر دورهٔ حفاظت تمام شده، خودت اشتباه خریدی، یا مدرک را بیرون از الدورادو گذاشتی." },
    ],
  },
  "8409016-order-dispute-how-does-it-work": {
    title: "اختلاف سفارش چطور کار می‌کند؟",
    description: "اگر سفارشت نرسید، مطابق آگهی نبود، یا فروشنده جواب نمی‌دهد، می‌توانی اختلاف باز کنی تا کمک بگیری و اگر ایراد ثابت شد بازگشت وجه بگیری.",
    updated: "به‌روزشده بیش از یک هفته پیش",
    collection: "refunds-and-protection",
    body: [
      { type: "p", text: "قبل از اختلاف، اول از گفتگوی سفارش با فروشنده حرف بزن. خیلی وقت‌ها همان‌جا حل می‌شود." },
      { type: "p", text: "بعد از Delivered سه روز فرصت چک داری. تا مطمئن نشدی تأیید نکن. اگر ایراد دارد از صفحهٔ سفارش اختلاف باز کن." },
      { type: "h2", text: "چطور کار می‌کند" },
      { type: "ol", items: [
        "در گفتگو با مدرک از فروشنده بخواه درست کند یا برگرداند.",
        "اگر نشد، اختلاف باز کن؛ برای تحویل آنی و گیفت‌کارت بعد از ۱۲ ساعت.",
        "مدرک را در بخش مخصوص صفحهٔ سفارش بفرست. ۱۲ ساعت وقت داری. تا ۴ تصویر یا ویدیوی کوتاه (هر کدام ۱۰ مگ؛ JPEG، PNG، HEIC، MP4).",
        "تیم داخلی مدرک را می‌بیند و تصمیم نهایی می‌گیرد.",
        "اگر به نفع خریدار باشد سفارش لغو می‌شود و پول به موجودی الدورادو می‌رود.",
      ] },
      { type: "p", text: "تا وقتی کامل نگرفتی یا به نتیجه نرسیدی اختلاف را لغو نکن. لغو اختلاف یعنی سفارش Received شده." },
      { type: "h2", text: "دلیل‌های رایج" },
      { type: "ol", items: [
        "فروشنده به پیام‌ها جواب نمی‌دهد",
        "محصول یا خدمت مطابق آگهی نیست",
        "در مهلت تضمینی تحویل نشد",
        "اکانت خریدی و مشخصات غلط است یا کار نمی‌کند",
        "به‌خاطر مشکل داخل بازی قابل دریافت نیست",
      ] },
    ],
  },
  "8408994-tradeshield-protection-for-buyers": {
    title: "حفاظت TradeShield برای خریدار",
    description: "TradeShield الدورادو معامله را امن نگه می‌دارد و اگر ایرادی پیش آمد سفارشت را پوشش می‌دهد.",
    updated: "به‌روزشده بیش از دو هفته پیش",
    collection: "refunds-and-protection",
    body: [
      { type: "p", text: "الدورادو پرداختت را تا تکمیل سفارش نگه می‌دارد؛ از تسویه تا تحویل پوشش داری. بیشتر سفارش‌ها ۵ روز حفاظت دارند." },
      { type: "h2", text: "چطور کار می‌کند" },
      { type: "ol", items: [
        "پرداخت می‌کنی. الدورادو پول را نگه می‌دارد.",
        "فروشنده تحویل می‌دهد. وضعیت می‌شود Delivered.",
        "سه روز چک می‌کنی و تأیید می‌کنی، یا اگر ایراد دارد اختلاف باز می‌کنی. بعد از سه روز خودش Received می‌شود.",
        "بعد از Received هم بیشتر سفارش‌ها چند روز دیگر پوشش دارند (جدول پایین).",
        "وقتی حفاظت تمام شد وضعیت Completed می‌شود و پول فروشنده آزاد می‌شود.",
      ] },
      { type: "h2", text: "مدت حفاظت بعد از Received" },
      { type: "ul", items: [
        "گیفت‌کارت: ۴ روز",
        "دستهٔ اکانت: ۵ روز",
        "اکانت GTA5: ۱۴ روز",
        "اکانت Fortnite: ۱۰ روز",
        "اکانت Rainbow Six Siege: ۱۰ روز",
        "آیتم سفارشی CS2: ۱۰ روز",
        "آیتم محدود روبلاکس: ۱۴ روز",
        "ارز روبلاکس (Robux): ۷ روز",
        "دسته‌های دیگر (غیر از تحویل خودکار): ۵ روز",
      ] },
      { type: "p", text: "سفارش تحویل خودکار ۳ روز پوشش دارد یا تا Received. همیشه داخل بازی چک کن." },
    ],
  },
  "8409006-tradeshield-protection-for-sellers": {
    title: "حفاظت TradeShield برای فروشنده",
    description: "TradeShield حفاظت فروشنده است: در برابر تقلب پرداخت، و توضیح می‌دهد چرا پول فروش برای مدت کوتاهی نگه داشته می‌شود تا به موجودی قابل برداشت برسد.",
    updated: "به‌روزشده این هفته",
    collection: "refunds-and-protection",
    body: [
      { type: "p", text: "TradeShield با پرداخت خریدار خودکار روشن می‌شود. سفارش را تا تحویل و اختلاف پوشش می‌دهد، بدون هزینهٔ اضافه. بیشتر سفارش‌ها ۵ روز حفاظت دارند." },
      { type: "p", text: "زمان دریافت پول تقریباً این است: روز Delivered + تا ۳ روز بررسی خریدار + مدت نگه TradeShield + تا ۱۲ ساعت پردازش." },
      { type: "p", text: "پوشش: پرداخت تقلبی و اختلاف ارائه‌دهندهٔ پرداخت. پلتفرم با ارائه‌دهنده حرف می‌زند؛ فروش تکمیل‌شده طبق قوانین از نظر مالی محافظت می‌شود." },
      { type: "h2", text: "آزادسازی پول" },
      { type: "ol", items: [
        "قبل از Received: بعد از Delivered خریدار ۳ روز وقت تأیید دارد؛ اگر تأیید نکند بعد از ۳ روز خودش Received می‌شود.",
        "بعد از Received دورهٔ آزادسازی دسته شروع می‌شود (جدول). خریدار می‌تواند ایراد بگوید و تو می‌توانی مستقیم حل کنی.",
      ] },
      { type: "ul", items: [
        "اکانت: ۵ روز",
        "گیفت‌کارت: ۴ روز",
        "اکانت GTA 5: ۱۴ روز",
        "محدود روبلاکس: ۱۴ روز",
        "اکانت Fortnite: ۱۰ روز",
        "Rainbow Six Siege: ۱۰ روز",
        "آیتم سفارشی CS2: ۱۰ روز",
        "ارز روبلاکس: ۷ روز",
        "دسته‌های دیگر: ۵ روز یا برای فروشندهٔ جاافتاده بدون نگه اضافه",
      ] },
    ],
  },
  "change-game-email": {
    title: "تعویض ایمیل اکانت بازی",
    description: "این راهنما برای ایمیل اکانت بازی است، نه ایمیل ورود به شارژینو.",
    updated: "به‌روزشده",
    collection: "buying-and-receiving-orders",
    body: [
      { type: "p", text: "بعد از دیدن مشخصات ورود، باید کنترل اکانت بازی مال تو شود. مهم‌ترین کار تعویض ایمیلی است که به خود بازی وصل است." },
      { type: "ol", items: [
        "با مشخصات دریافتی وارد بازی شو.",
        "وارد ایمیلی شو که الان به اکانت وصل است.",
        "در تنظیمات اکانت بازی گزینهٔ اتصال یا تغییر ایمیل را پیدا کن و ایمیل خودت را وارد کن.",
        "اگر کد تأیید به ایمیل قبلی رفت، در گفتگوی همین سفارش از فروشنده بخواه همان کد را بفرستد.",
        "از صندوق ایمیل جدیدت لینک یا کد را تأیید کن.",
        "رمز ورود اکانت بازی را عوض کن.",
        "اگر هنوز به ایمیل قبلی دسترسی داری، رمز آن را هم عوض کن.",
        "تأیید دو مرحله‌ای بازی را روشن کن.",
        "بعد از اینکه وارد شدی و ایمیل مال تو شد، در صفحهٔ سفارش دریافت را تأیید کن.",
      ] },
      { type: "h2", text: "اگر بازی پابجی موبایل است" },
      { type: "ul", items: [
        "تنظیمات، حساب، اتصال یا تغییر ایمیل.",
        "اگر اکانت به ایمیل فروشنده وصل است، کد به همان ایمیل می‌رود. در گفتگوی سفارش بخواه کد را بفرستد.",
        "بعد از اتصال ایمیل خودت، رمز را عوض کن و تأیید دو مرحله‌ای را روشن کن.",
      ] },
    ],
  },
  "8408991-receive-your-account-details": {
    title: "دریافت مشخصات اکانت",
    description: "این راهنما کمکت می‌کند مشخصات ورود را بگیری، چک کنی و اکانت را امن کنی.",
    updated: "به‌روزشده",
    collection: "buying-and-receiving-orders",
    body: [
      { type: "p", text: "بعد از پرداخت، سفارش در داشبورد، سفارش‌های خرید باز می‌شود. مشخصات ورود فقط از همان صفحه نشان داده می‌شود و فقط یک بار." },
      { type: "ol", items: [
        "بعد از پرداخت به داشبورد برو: سفارش‌های خرید، همان سفارش.",
        "منتظر بمان تا فروشنده مشخصات ورود را بفرستد. وضعیت می‌شود «بررسی خریدار».",
        "دکمهٔ نمایش مشخصات اکانت را بزن. این نمایش یک‌بار است؛ همان لحظه کپی بگیر.",
        "با همان مشخصات وارد اکانت بازی شو. هنوز چیزی عوض نکن.",
        "اکانت را با آگهی مقایسه کن. اگر فرق دارد در گفتگوی همین سفارش بنویس و دریافت را تأیید نکن.",
        "با ایمیلی که در مشخصات آمده وارد صندوق همان ایمیل شو.",
        "ایمیل اکانت بازی را به ایمیل خودت عوض کن.",
        "رمز اکانت بازی و رمز ایمیل را عوض کن. تأیید دو مرحله‌ای را روشن کن.",
        "فقط وقتی همهٔ این‌ها درست بود «سفارش را دریافت کردم» را بزن.",
      ] },
    ],
  },
  "8409026-seller-withdrawal-methods-and-fees": {
    title: "روش‌ها و کارمزد برداشت فروشنده",
    description: "روش‌های برداشت موجودی الدورادو را مقایسه کن: کارمزد، حداقل، و زمان واریز.",
    updated: "به‌روزشده",
    collection: "fees-and-withdrawals",
    body: [
      { type: "p", text: "وقتی خریدار دریافت را تأیید کند، سهم تو همان لحظه به کیف پول می‌رود." },
      { type: "ol", items: [
        "عدد قابل برداشت همان سهم فروش بعد از کارمزد است.",
        "تا تأیید خریدار، مبلغ در انتظار می‌ماند.",
        "برداشت به شبا مرحلهٔ جداست و از صفحهٔ کیف پول درخواست می‌شود.",
        "کیف پول: داشبورد، کیف پول.",
      ] },
    ],
  },
};

export const HELP_COLLECTIONS = [
  {
    slug: "getting-started",
    title: "شروع کار",
    summary: "الدورادو چطور کار می‌کند و قدم‌های اول",
    icon: HELP_IMG.gettingStarted,
    articles: [
      A("17098994-good-to-know-before-you-buy", "قبل از خرید خوب است بدانی", "تازه‌واردی؟ از انتخاب فروشنده تا تمام شدن سفارش چه می‌شود و اگر چیزی غلط بود چه کار کنی."),
      A("8409007-start-selling", "شروع فروش", "فروش در الدورادو از ساخت حساب فروشنده تا دریافت پول."),
      A("8409001-why-do-i-need-to-verify-my-id-to-sell", "چرا برای فروش باید هویت را تأیید کنم؟", "چرا هر فروشنده باید احراز شود و دادهٔ شخصی‌ات چطور محافظت می‌شود."),
      A("16768820-does-eldorado-have-a-mobile-app", "آیا الدورادو اپ موبایل دارد؟"),
      A("17716762-how-do-i-stay-safe-when-buying-online", "موقع خرید آنلاین چطور امن بمانم؟"),
      A("17741368-eldorado-loyalty-points", "امتیاز وفاداری الدورادو", "امتیاز، رنک، دستاورد و خرج کردن امتیاز برای اعتبار فروشگاه."),
      A("18225681-chat-on-your-order-page", "گفتگو در صفحهٔ سفارش", "چه کسی گفتگو را شروع می‌کند، خریدار و فروشنده چطور استفاده می‌کنند، و چطور امن بمانی."),
    ],
  },
  {
    slug: "buying",
    title: "خرید",
    summary: "چطور بخری، پرداخت کنی و سفارشت را بگیری",
    icon: HELP_IMG.buying,
    children: [
      {
        slug: "buying-and-receiving-orders",
        title: "خرید و دریافت سفارش",
        summary: "انتخاب آگهی، خرید و دریافت سفارش",
        icon: HELP_IMG.buying,
        articles: [
          A("9766170-how-to-find-the-perfect-offer-for-you", "چطور بهترین آگهی را پیدا کنی؟", "فروشنده‌های مستقل آگهی می‌گذارند؛ قیمت و تحویل فرق دارد. این راهنما می‌گوید به چه نگاه کنی."),
          A("8408993-receive-your-order", "دریافت سفارش", "سفارش را پیدا کن، تحویل را چک کن، برای فروشنده نظر بگذار. اگر غلط بود اختلاف باز کن."),
          A("8408990-buy-an-account", "خرید اکانت", "اکانت بازی را انتخاب کن، پرداخت کن، مشخصات ورود را از فروشنده بگیر. الدورادو تا تکمیل سفارش پوشش می‌دهد."),
          A("8408991-receive-your-account-details", "دریافت مشخصات اکانت", "این راهنما کمکت می‌کند مشخصات ورود را بگیری."),
          A("change-game-email", "تعویض ایمیل اکانت بازی", "بعد از دیدن مشخصات ورود، ایمیل متصل به اکانت بازی را به ایمیل خودت عوض کن."),
          A("8408992-buy-in-game-currency-or-items", "خرید ارز یا آیتم داخل بازی", "بازی و آگهی را انتخاب کن، فروشنده‌ها را مقایسه کن، مشخصات تحویل را بگذار، جمع را ببین، بعد بپرداز."),
          A("8408995-currency-and-item-delivery-methods", "روش‌های تحویل ارز و آیتم", "تحویل خودکار، ترید، صندوق، گیفت و بقیه؛ اگر سفارش دیر شد چه کار کنی."),
          A("8408989-buy-a-boosting-service", "خرید بوستینگ", "یک بازیکن اکانتت را بالا می‌برد. درخواست بوست، انتخاب آگهی، پیدا کردن بعد از خرید."),
          A("15520026-buy-a-roblox-adopt-me-automated-delivery-item", "خرید آیتم Adopt Me با تحویل خودکار", "تحویل خودکار آیتم Adopt Me را با چند کلیک می‌رساند."),
          A("16640869-buy-a-roblox-grow-a-garden-2-automated-delivery-item", "خرید آیتم Grow a Garden 2 با تحویل خودکار", "الان برای Pets و Seeds در دسترس است."),
          A("16886046-buy-a-roblox-murder-mystery-2-automated-delivery-item", "خرید آیتم Murder Mystery 2 با تحویل خودکار", "تحویل خودکار آیتم MM2 را با چند کلیک می‌رساند."),
          A("9819048-issues-with-your-order", "مشکل در سفارش؟", "با فروشنده حرف بزن، اختلاف باز کن، مدرک بگذار، اگر تقلب بود بازگشت وجه بگیر."),
          A("17333640-buy-a-roblox-steal-a-brainrot-automated-delivery-item", "خرید آیتم Steal a Brainrot با تحویل خودکار", "الان برای Brainrots در دسترس است."),
        ],
      },
      {
        slug: "payments",
        title: "پرداخت",
        summary: "روش‌های پرداخت و عیب‌یابی",
        icon: HELP_IMG.buying,
        articles: [
          A("8409019-payment-methods", "روش‌های پرداخت", "روش‌های موجود برای خرید در سایت الدورادو. اگر پرداخت شکست، نکته‌های عیب‌یابی را ببین."),
          A("8409021-prepaid-and-gift-card-payments", "پرداخت با کارت پیش‌پرداخت و گیفت‌کارت", "کدام ویزا، مسترکارت، Discover و Amex کار می‌کند و چرا کارت رد می‌شود."),
          A("8409017-declined-card-troubleshooting", "عیب‌یابی کارت ردشده", "خطا و شکست پرداخت کارت بدهی و اعتباری."),
          A("8409018-buyer-verification", "احراز خریدار", "چرا ممکن است قبل از سفارش کارت ملی، سلفی یا عکس کارت بخواهیم."),
          A("8409022-my-local-currency-type-is-not-listed", "ارز محلی‌ام در لیست نیست", "در الدورادو با هر ارزی بپرداز. بانک تبدیل می‌کند، قدم اضافه نیست."),
        ],
      },
    ],
  },
  {
    slug: "selling",
    title: "فروش",
    summary: "احراز هویت، قوانین فروشنده، ثبت آگهی و دریافت پول",
    icon: HELP_IMG.selling,
    children: [
      {
        slug: "seller-verification",
        title: "احراز فروشنده",
        summary: "فرایند احراز، مدارک و کشورها، دسته‌های محدود",
        icon: HELP_IMG.selling,
        articles: [
          A("9896838-seller-verification-guide", "راهنمای احراز فروشنده", "برای فروش هویت را تأیید کن."),
          A("11928248-additional-verification-for-restricted-seller-categories", "احراز اضافه برای دسته‌های محدود", "کدام دسته‌ها مثل Fortnite و Valorant قبل از فروش تأیید می‌خواهند."),
          A("16860239-supported-documents-for-verification", "مدارک قابل قبول برای احراز", "در کشورت کدام مدرک قبول است."),
          A("11315779-which-countries-are-eligible-to-sell-on-eldorado", "کدام کشورها می‌توانند در الدورادو بفروشند؟"),
        ],
      },
      {
        slug: "rules-and-guidelines",
        title: "قوانین و راهنما",
        summary: "قوانین فروشنده و راهنمای آگهی به‌ازای دسته",
        icon: HELP_IMG.selling,
        articles: [
          A("8408997-seller-rules", "قوانین فروشنده", "قبل از فروش در الدورادو قوانین فروشنده را بخوان."),
          A("8408996-account-seller-rules", "قوانین فروشندهٔ اکانت"),
          A("13859407-account-seller-guidelines", "راهنمای فروشندهٔ اکانت", "چه کسی می‌تواند بفروشد، دسترسی کامل، بازیابی اکانت، تعلیق."),
          A("11703747-gift-card-seller-guidelines", "راهنمای فروشندهٔ گیفت‌کارت"),
          A("12032614-top-up-and-subscription-seller-guidelines", "راهنمای فروشندهٔ شارژ و اشتراک"),
          A("13859389-item-seller-guidelines", "راهنمای فروشندهٔ آیتم"),
          A("13917635-boosting-seller-guidelines", "راهنمای فروشندهٔ بوستینگ"),
          A("13917846-currency-seller-guidelines", "راهنمای فروشندهٔ ارز"),
          A("10183840-duplicate-offers", "آگهی تکراری"),
          A("11130882-keyword-rules-faq", "سوال‌های قوانین کلمهٔ کلیدی"),
        ],
      },
      {
        slug: "selling-and-managing-offers",
        title: "فروش و مدیریت آگهی",
        summary: "فروش، تحویل و مدیریت آگهی، سقف، API فروشنده، اعلان",
        icon: HELP_IMG.selling,
        articles: [
          A("8409008-sell-an-account", "فروش اکانت", "آگهی اکانت بساز، تحویل بده، پول بگیر."),
          A("8409009-how-to-deliver-account-information-to-a-buyer", "چطور مشخصات اکانت را به خریدار برسانی", "چه چیزی بفرستی، کجا، کمک برای تعویض ایمیل."),
          A("8409010-sell-boosting-services", "فروش بوستینگ"),
          A("8409012-how-the-seller-api-works", "API فروشنده چطور کار می‌کند"),
          A("8409013-get-notified-about-new-messages-or-orders", "اعلان پیام یا سفارش جدید"),
        ],
      },
      {
        slug: "automated-delivery",
        title: "تحویل خودکار",
        summary: "راه‌اندازی اکانت روبلاکس و آگهی تحویل خودکار",
        icon: HELP_IMG.selling,
        articles: [
          A("8408987-set-up-a-roblox-account-for-automated-delivery", "راه‌اندازی اکانت روبلاکس برای تحویل خودکار", "برای فروش آیتم با تحویل خودکار اول اکانت روبلاکس را وصل کن."),
        ],
      },
      {
        slug: "ranking-system-and-user-feedback",
        title: "رتبه‌بندی و نظر کاربر",
        summary: "رتبهٔ آگهی هر دسته و راهنمای نظر کاربر",
        icon: HELP_IMG.selling,
        articles: [
          A("8409002-accounts-offer-ranking-system", "سیستم رتبهٔ آگهی اکانت"),
          A("8409003-top-ups-and-currency-offer-ranking-system", "سیستم رتبهٔ شارژ و ارز"),
          A("8409005-items-offer-ranking-system", "سیستم رتبهٔ آگهی آیتم"),
          A("8409004-user-feedback", "نظر کاربر"),
        ],
      },
      {
        slug: "fees-and-withdrawals",
        title: "کارمزد و برداشت",
        summary: "کارمزد فروشنده، روش برداشت، مدیریت کیف پول",
        icon: HELP_IMG.selling,
        articles: [
          A("8409025-seller-fees", "کارمزد فروشنده", "روی هر فروش تکمیل‌شده کارمزد می‌گیریم. کارمزد به دسته بستگی دارد."),
          A("8409026-seller-withdrawal-methods-and-fees", "روش‌ها و کارمزد برداشت فروشنده", "روش‌های برداشت موجودی را مقایسه کن."),
        ],
      },
    ],
  },
  {
    slug: "refunds-and-protection",
    title: "بازگشت وجه و حفاظت",
    summary: "چطور بازگشت وجه بگیری، اختلاف باز کنی، و TradeShield چطور کار می‌کند",
    icon: HELP_IMG.refunds,
    articles: [
      A("8409020-refund-and-return-policy", "سیاست بازگشت وجه و مرجوعی", "بازگشت وجه و مرجوعی برای همهٔ دسته‌های سفارش در الدورادو."),
      A("8409016-order-dispute-how-does-it-work", "اختلاف سفارش چطور کار می‌کند؟", "اگر نرسید یا مطابق نبود اختلاف باز کن."),
      A("8408994-tradeshield-protection-for-buyers", "حفاظت TradeShield برای خریدار", "پرداختت تا تکمیل سفارش نگه داشته می‌شود."),
      A("8409006-tradeshield-protection-for-sellers", "حفاظت TradeShield برای فروشنده", "چرا پول فروش برای مدت کوتاهی نگه داشته می‌شود."),
    ],
  },
  {
    slug: "eldorado-account",
    title: "حساب الدورادو",
    summary: "به‌روزرسانی مشخصات، امنیت حساب و تعلیق",
    icon: HELP_IMG.account,
    articles: [
      A("8409014-account-deletion", "حذف حساب", "سفارش باز، آگهی فعال و ضمانت را چک کن، بعد حذف را بخواه."),
      A("8409015-account-suspension", "تعلیق حساب", "موقع تعلیق چه می‌توانی بکنی، بن چقدر طول می‌کشد، چطور موجودی را برداری."),
      A("8409011-changing-username", "تغییر نام کاربری", "چطور نام کاربری را عوض کنی و چه قانونی دارد."),
      A("8508919-changing-email", "تغییر ایمیل", "تغییر ایمیل حساب الدورادو."),
      A("8408986-two-factor-authentication-2fa", "تأیید دو مرحله‌ای (2FA)", "چطور 2FA را روشن کنی و اگر دستگاه را از دست دادی چه کنی."),
      A("8409023-personal-data", "دادهٔ شخصی", "می‌توانی خروجی دادهٔ شخصی بخواهی."),
    ],
  },
  {
    slug: "game-guides",
    title: "راهنمای بازی‌ها",
    summary: "دانش بازی و نکته‌ها",
    icon: HELP_IMG.gameGuides,
    articles: [
      A("8408985-roblox-automated-delivery-requirements", "شرایط تحویل خودکار روبلاکس", "قبل از سفارش تنظیمات اکانت روبلاکس را چک کن."),
      A("8408984-how-to-find-your-steam-trade-url", "چطور Steam Trade URL را پیدا کنی", "با این لینک فروشنده حتی اگر دوست استیم نباشید آیتم می‌فرستد."),
    ],
  },
];

export const HELP_MOST_VIEWED = [
  A("8409020-refund-and-return-policy", "سیاست بازگشت وجه و مرجوعی"),
  A("8409016-order-dispute-how-does-it-work", "اختلاف سفارش چطور کار می‌کند؟"),
  A("8408994-tradeshield-protection-for-buyers", "حفاظت TradeShield برای خریدار"),
  A("8409006-tradeshield-protection-for-sellers", "حفاظت TradeShield برای فروشنده"),
  A("8409026-seller-withdrawal-methods-and-fees", "روش‌ها و کارمزد برداشت فروشنده"),
];

export const HELP_HOME_COLLECTIONS = HELP_COLLECTIONS.map((c) => ({
  slug: c.slug,
  href: `/support/collections/${c.slug}`,
  title: c.title,
  summary: c.summary,
  icon: c.icon,
}));

export function flattenCollections(list = HELP_COLLECTIONS) {
  const out = [];
  for (const c of list) {
    out.push(c);
    if (c.children) out.push(...flattenCollections(c.children));
  }
  return out;
}

export function getCollection(slug) {
  return flattenCollections().find((c) => c.slug === slug) || null;
}

export function getParentCollection(slug) {
  return HELP_COLLECTIONS.find((c) => c.children?.some((ch) => ch.slug === slug)) || null;
}

export function getArticle(slug) {
  const extra = HELP_ARTICLES[slug];
  for (const col of flattenCollections()) {
    const found = (col.articles || []).find((a) => a.slug === slug);
    if (found) {
      return {
        ...found,
        collection: col.slug,
        collectionTitle: col.title,
        description: extra?.description || found.summary,
        updated: extra?.updated || "",
        body: extra?.body || (found.summary ? [{ type: "p", text: found.summary }] : []),
      };
    }
  }
  if (extra) return { slug, href: `/support/articles/${slug}`, ...extra };
  return null;
}

export function helpNav() {
  return HELP_COLLECTIONS.map((c) => ({
    label: c.title,
    href: `/support/collections/${c.slug}`,
    icon: c.icon,
    children: c.children
      ? c.children.map((ch) => ({
          label: ch.title,
          href: `/support/collections/${ch.slug}`,
          articles: (ch.articles || []).map((a) => ({ label: a.title, href: a.href, slug: a.slug })),
        }))
      : (c.articles || []).map((a) => ({ label: a.title, href: a.href, slug: a.slug })),
  }));
}
