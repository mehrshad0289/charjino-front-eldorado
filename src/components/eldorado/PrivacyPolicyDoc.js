import Link from "next/link";
import CategoryNav from "./CategoryNav";
import ChatBubble from "./ChatBubble";
import Footer from "./Footer";
import { SOCIAL } from "@/lib/social";
import { toFaDigits } from "@/lib/fa-digits";

/* حریم خصوصی /privacy-policy — column from the Eldorado privacy capture
   (`ui ux/Privacy Policy/…make` + owner make 1440/390): max-w-[682px],
   mt/mb 40px, 14/21 body, kicker + 14px h5, numbered h6, nested ul
   ms-30, cookie rows as bold-labeled paragraphs. Copy is شارژینو from
   Frontend-charjino/src/app/(shop)/privacy (not Lithuania/GDPR). */

const SUPPORT_PHONE = "09361240289";
const UPDATED_ISO = "2026-10-09";

const P = "mb-[16px] text-[14px] leading-[21px]";
const UL = "ms-[30px] mb-[20px]";
const LI = "text-[14px] leading-[21px]";
const LINK = "text-linkblue";

function updatedFa() {
  return new Intl.DateTimeFormat("fa-IR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${UPDATED_ISO}T00:00:00`));
}

function CookieRow({ name, category, type, purpose }) {
  return (
    <p className={P}>
      <b className="font-bold">نام کوکی: </b>
      <span dir="auto">{name}</span>{" "}
      <b className="font-bold">دسته: </b>
      {category}{" "}
      <b className="font-bold">نوع: </b>
      {type}{" "}
      <b className="font-bold">هدف: </b>
      {purpose}
    </p>
  );
}

export default function PrivacyPolicyDoc() {
  const updated = updatedFa();
  return (
    <div className="min-h-screen bg-page text-ink">
      <CategoryNav />
      <main className="isolate">
        <div className="relative mx-auto w-fit max-w-full px-6">
          <div className="mx-auto mt-10 mb-10 max-w-[682px] [&_h6]:mt-5 [&_h6]:mb-3 [&_h6]:text-[16px] [&_h6]:font-bold">
            <p className={P}>شارژینو</p>
            <h1 className="mt-[10px] mb-[20px] text-[14px] font-bold leading-normal">سیاست حریم خصوصی</h1>
            <p className={P}>
              این «<b className="font-bold">سیاست حریم خصوصی</b>» توضیح می‌دهد فروشگاه{" "}
              <b className="font-bold">شارژینو</b> («<b className="font-bold">ما</b>») روی دامنهٔ{" "}
              <span dir="auto">charjino.ir</span> دادهٔ شخصی را هنگام ورود، خرید، فروش در بازارچه، تماس با پشتیبانی
              یا استفاده از سایت چگونه پردازش می‌کند و چه حقوقی دارید.
            </p>
            <p className={P}>آخرین به‌روزرسانی: {updated}.</p>
            <p className={P}>
              استفاده از سایت به معنای آگاهی از همین متن است. نماد اعتماد الکترونیکی (اینماد) در فوتر نمایش داده
              می‌شود. سؤال دربارهٔ داده را از{" "}
              <Link href="/contact-us" className={LINK}>
                تماس با ما
              </Link>
              ، تلفن {toFaDigits(SUPPORT_PHONE)}، اینستاگرام {SOCIAL.instagram.handle} یا تلگرام {SOCIAL.telegram.handle}{" "}
              بپرسید.
            </p>

            <h6>۱. چه اصولی را در پردازش دادهٔ شخصی رعایت می‌کنیم؟</h6>
            <p className={P}>هنگام پردازش دادهٔ شخصی شما:</p>
            <ul className={UL}>
              <li>
                <p className={LI}>الزامات قوانین جاری، از جمله قانون تجارت الکترونیکی، را رعایت می‌کنیم؛</p>
              </li>
              <li>
                <p className={LI}>داده را به‌صورت قانونی، منصفانه و شفاف پردازش می‌کنیم؛</p>
              </li>
              <li>
                <p className={LI}>داده را برای اهداف مشخص و مشروع جمع می‌کنیم و خارج از آن اهداف به کار نمی‌بریم، مگر تا جایی که قانون اجازه دهد؛</p>
              </li>
              <li>
                <p className={LI}>اگر داده نسبت به هدف پردازش نادرست یا ناقص باشد، آن را اصلاح، تکمیل، تعلیق یا حذف می‌کنیم؛</p>
              </li>
              <li>
                <p className={LI}>داده را فقط تا وقتی که برای همان اهداف لازم است به‌شکل قابل شناسایی نگه می‌داریم؛</p>
              </li>
              <li>
                <p className={LI}>داده را به شخص ثالث نمی‌دهیم و منتشر نمی‌کنیم، مگر در همین سیاست یا به حکم قانون؛</p>
              </li>
              <li>
                <p className={LI}>با اقدامات فنی و سازمانی مناسب، امنیت داده را در برابر دسترسی غیرمجاز، از دست رفتن یا تخریب تصادفی حفظ می‌کنیم.</p>
              </li>
            </ul>

            <h6>۲. پردازش دادهٔ شخصی شما</h6>
            <p className={P}>شارژینو دادهٔ شخصی را برای این اهداف پردازش می‌کند:</p>
            <ul className={UL}>
              <li>
                <p className={LI}>
                  <b className="font-bold">ساخت و مدیریت حساب کاربری در شارژینو:</b>
                </p>
                <ul className={UL}>
                  <li>
                    <p className={LI}>
                      <b className="font-bold">دسته‌های داده:</b>
                    </p>
                    <ul className={UL}>
                      <li>
                        <p className={LI}>شماره موبایل برای ورود با پیامک</p>
                      </li>
                      <li>
                        <p className={LI}>نام نمایشی اگر خودتان وارد کنید</p>
                      </li>
                      <li>
                        <p className={LI}>دادهٔ فنی دستگاه و نشست ورود</p>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <p className={LI}>
                      <b className="font-bold">هدف:</b> ساخت حساب، ورود و امنیت نشست.
                    </p>
                  </li>
                </ul>
              </li>
              <li>
                <p className={LI}>
                  <b className="font-bold">ثبت سفارش و تحویل محصول دیجیتال:</b>
                </p>
                <ul className={UL}>
                  <li>
                    <p className={LI}>
                      <b className="font-bold">دسته‌های داده:</b> محصول، مبلغ به تومان، تعداد، وضعیت، شماره سفارش، و فیلد لازم همان محصول مثل Player ID، سرور/زون، یوزرنیم تلگرام، نام ورود استیم یا لینک دعوت.
                    </p>
                  </li>
                  <li>
                    <p className={LI}>
                      <b className="font-bold">هدف:</b> تحویل همان سفارش به حساب بازی یا پلتفرم شما. رمز عبور حساب بازی، کد ورود بازی یا ایمیل بازیابی بازی گرفته نمی‌شود و در فرم سفارش پذیرفته نمی‌شود.
                    </p>
                  </li>
                </ul>
              </li>
              <li>
                <p className={LI}>
                  <b className="font-bold">پرداخت:</b> دادهٔ پرداخت برای تأیید تراکنش درگاه (زیبال) و پیگیری رسید.
                </p>
              </li>
              <li>
                <p className={LI}>
                  <b className="font-bold">پشتیبانی:</b> متن تیکت و پیوست برای رفع مشکل سفارش.
                </p>
              </li>
              <li>
                <p className={LI}>
                  <b className="font-bold">بازارچه و کیف پول فروشنده:</b> آگهی، سفارش فروش و ماندهٔ کیف پول فروشنده فقط برای تسویه داخل شارژینو از ماژول بازارچه است.
                </p>
              </li>
              <li>
                <p className={LI}>
                  <b className="font-bold">علاقه‌مندی و جست‌وجو:</b> فهرست علاقه‌مندی داخل حساب شما؛ عبارت جست‌وجو برای نمایش نتیجه در خود فروشگاه.
                </p>
              </li>
              <li>
                <p className={LI}>
                  <b className="font-bold">امنیت:</b> نشانی IP و دادهٔ فنی مرورگر ممکن است برای جلوگیری از سوءاستفاده و رفع خطا در لاگ سرور بماند.
                </p>
              </li>
              <li>
                <p className={LI}>
                  <b className="font-bold">پیامک:</b> کد یک‌بارمصرف ورود و رویداد سفارش (تکمیل، ناموفق یا بازگشت وجه). پیام تبلیغاتی جدا فرستاده نمی‌شود مگر با رضایت جداگانه؛ قطع بازاریابی رسید و هشدار امنیتی را قطع نمی‌کند.
                </p>
              </li>
              <li>
                <p className={LI}>
                  <b className="font-bold">مدت نگهداری:</b> کد ورود پیامکی کوتاه‌مدت است. نشست تا خروج یا انقضای کوکی می‌ماند. سوابق سفارش، پرداخت و پشتیبانی به اندازهٔ لازم برای پیگیری، اختلاف، حسابداری و تکلیف قانونی نگه داشته می‌شود. پس از درخواست حذف حساب، دادهٔ شناسایی که دیگر لازم نیست حذف یا از دسترس پشتیبانی روزمره خارج می‌شود؛ شماره سفارش و رسید مالی ممکن است طبق الزام قانونی باقی بماند.
                </p>
              </li>
              <li>
                <p className={LI}>
                  <b className="font-bold">کودک:</b> شارژینو پروفایل سنی جدا یا حساب کودک نمی‌سازد. خرید باید توسط فرد دارای اهلیت یا با رضایت سرپرست انجام شود.
                </p>
              </li>
            </ul>

            <h6>۳. داده را به چه کسانی می‌دهیم؟</h6>
            <p className={P}>داده را نمی‌فروشیم و برای تبلیغ پیامکی انبوه به دیگران نمی‌دهیم. فقط در این موارد در اختیار دیگری قرار می‌گیرد:</p>
            <ul className={UL}>
              <li>
                <p className={LI}>با رضایت شما؛</p>
              </li>
              <li>
                <p className={LI}>زیبال برای شروع و تأیید پرداخت آنلاین؛</p>
              </li>
              <li>
                <p className={LI}>سامانهٔ پیامک برای کد ورود و اطلاع وضعیت سفارش؛</p>
              </li>
              <li>
                <p className={LI}>تأمین‌کنندهٔ همان کالای دیجیتال، فقط فیلد لازم تحویل همان سفارش، نه رمز بازی؛</p>
              </li>
              <li>
                <p className={LI}>میزبانی سرور برای نگهداری سایت و پایگاه داده؛</p>
              </li>
              <li>
                <p className={LI}>گوگل آنالیتیکس در نسخهٔ عملیاتی برای آمار بازدید، با ناشناس‌سازی IP؛</p>
              </li>
              <li>
                <p className={LI}>مراجع قانونی وقتی قانون الزام کند.</p>
              </li>
            </ul>
            <p className={P}>
              پردازنده‌ها داده را فقط طبق دستور ما، برای همان هدف و مطابق این سیاست پردازش می‌کنند.
            </p>

            <h6>۴. چه حقوقی دارید؟</h6>
            <p className={P}>به‌عنوان صاحب داده این حقوق را دارید:</p>
            <ul className={UL}>
              <li>
                <p className={LI}>
                  <b className="font-bold">اطلاع از پردازش. </b>
                  می‌توانید بپرسید چه داده‌ای، برای چه هدف و تا چه مدت پردازش می‌شود.
                </p>
              </li>
              <li>
                <p className={LI}>
                  <b className="font-bold">دسترسی. </b>
                  سفارش‌ها را از{" "}
                  <Link href="/dashboard/orders/purchased" className={LINK}>
                    سفارش‌های خرید
                  </Link>{" "}
                  ببینید. می‌توانید خروجی دادهٔ حساب را از پشتیبانی بخواهید.
                </p>
              </li>
              <li>
                <p className={LI}>
                  <b className="font-bold">اصلاح. </b>
                  نام نمایشی را در حساب اصلاح کنید یا از تیکت بخواهید موردی را درست کنیم.
                </p>
              </li>
              <li>
                <p className={LI}>
                  <b className="font-bold">حذف. </b>
                  حذف حساب، الزام نگهداری رسید پرداخت را از بین نمی‌برد.
                </p>
              </li>
              <li>
                <p className={LI}>
                  <b className="font-bold">اعتراض و شکایت. </b>
                  از{" "}
                  <Link href="/contact-us" className={LINK}>
                    تماس با ما
                  </Link>{" "}
                  یا{" "}
                  <Link href="/dashboard/tickets/new" className={LINK}>
                    تیکت پشتیبانی
                  </Link>{" "}
                  بنویسید.
                </p>
              </li>
            </ul>
            <p className={P}>برای اعمال این حقوق ممکن است هویت شما را بررسی کنیم. اگر درخواست بی‌اساس یا تکراری باشد ممکن است پاسخ مستدل رد شود.</p>

            <h6>۵. امنیت دادهٔ شخصی</h6>
            <p className={P}>
              سیاست قطعی این است که رمز اکانت بازی، ابزار عبور از محدودیت شبکه، و جایزهٔ شانسی فروخته یا درخواست نشود. اگر کسی به نام شارژینو رمز یا کد ورود بازی خواست، ندهید و به پشتیبانی خبر دهید. نشست حساب با کوکی httpOnly نگهداری می‌شود. پرداخت کارت روی صفحهٔ درگاه انجام می‌شود. هیچ امنیتی مطلق نیست؛ رخداد امنیتی از همین راه‌های تماس اعلام می‌شود.
            </p>
            <p className={P}>کارکنانی که به داده دسترسی دارند محرمانگی آن را رعایت می‌کنند.</p>

            <h6>۶. کوکی‌ها</h6>
            <p className={P}>سایت از کوکی استفاده می‌کند.</p>
            <p className={P}>کوکی فایل متنی کوچکی است که هنگام بازدید موقتاً روی دستگاه شما ذخیره می‌شود.</p>
            <p className={P}>
              برای ماندن در حساب، کوکی امن و httpOnly روی دامنهٔ فروشگاه گذاشته می‌شود. جاوااسکریپت صفحه این کوکی‌های ورود را نمی‌خواند. در نسخهٔ عملیاتی، Google Analytics برای آمار بازدید بارگذاری می‌شود و کوکی گوگل ممکن است در مرورگر ثبت شود؛ IP ناشناس می‌شود. از این آمار برای صفحات پربازدید استفاده می‌شود، نه برای ساخت پروفایل تبلیغاتی فروختنی.
            </p>
            <p className={P}>کوکی‌های غیرضروری را می‌توانید از تنظیمات مرورگر محدود یا حذف کنید. حذف کوکی ورود باعث خروج از حساب می‌شود.</p>
            <p className={P}>کوکی‌های زیر در فروشگاه استفاده می‌شود:</p>
            <CookieRow
              name="shop_access_token"
              category="ضروری / ورود"
              type="شخص اول"
              purpose="نشانهٔ دسترسی کوتاه‌مدت برای ماندن در حساب؛ httpOnly."
            />
            <CookieRow
              name="shop_refresh_token"
              category="ضروری / ورود"
              type="شخص اول"
              purpose="تمدید نشست ورود بدون وارد کردن دوبارهٔ کد پیامک؛ httpOnly."
            />
            <CookieRow
              name="_ga"
              category="تحلیلی"
              type="شخص اول"
              purpose="تمایز بازدیدکننده در Google Analytics وقتی اندازه‌گیری در نسخهٔ عملیاتی روشن باشد."
            />
            <CookieRow
              name="_ga_*"
              category="تحلیلی"
              type="شخص اول"
              purpose="نشست بازدید در Google Analytics."
            />

            <h6>تغییر این سیاست</h6>
            <p className={P}>
              متن به‌روز همین صفحه است. اگر شرایط را عوض کنیم نسخهٔ جدید را در همین نشانی می‌گذاریم. شرایط خرید جداگانه در{" "}
              <Link href="/terms-of-service" className={LINK}>
                شرایط استفاده
              </Link>{" "}
              آمده است.
            </p>
            <p className={P}>
              <i className="italic">تغییر این سیاست از {updated} اعمال شده است.</i>
            </p>
          </div>
        </div>
      </main>
      <Footer />
      <ChatBubble />
    </div>
  );
}
