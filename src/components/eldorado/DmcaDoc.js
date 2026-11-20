import Link from "next/link";
import CategoryNav from "./CategoryNav";
import ChatBubble from "./ChatBubble";
import Footer from "./Footer";

/* قانون حق نشر /dmca — layout from the Eldorado DMCA capture
   (`ui ux/DMCA/…dmca…make`, extracted snapshots/dmca-1920px-light-1.tsx,
   plus the 1440/390 make). Full-width 128px yellow band, max-w-3xl
   column (mt-30 mb-80), 48px title pulled up over the band
   (relative top-[-67px] mt-[-30px]), 18px lede with a blue contact
   link, two gray role=status info boxes (inputgray / cardborder,
   rounded-lg, 24px icon + bold lead + ul ps-5) and the 18px official-email
   paragraph. Banner image from the owner (`عکس el/dmca (1).webp`).
   Icomoon info glyphs decode empty in the capture — inline SVG circle-i
   (documented assumption, project pattern). Copy is the capture flow
   in Persian for شارژینو; contact is /contact-us (no invented inbox). */

const INFO_ICON = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
    <path d="M12 11v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="12" cy="7.8" r="1.1" fill="currentColor" />
  </svg>
);

function InfoBox({ lead, items }) {
  return (
    <div
      role="status"
      className="flex gap-3 rounded-lg border-[0.8px] border-cardborder bg-inputgray px-4 pt-3 pb-3 text-ink"
    >
      <div className="shrink-0 text-ink">{INFO_ICON}</div>
      <div className="flex flex-col gap-2">
        <span className="block font-bold">{lead}</span>
        <div className="text-[14px] leading-[19.6px]">
          <ul className="list-disc ps-5">
            {items.map((li) => (
              <li key={li.slice(0, 32)}>{li}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function DmcaDoc() {
  return (
    <div className="min-h-screen bg-page text-ink">
      <CategoryNav />
      <main className="isolate">
        <div className="mb-[50px] h-32 overflow-hidden">
          <img
            alt=""
            src="/static-pages/v2/dmca-banner.webp"
            className="block h-32 w-full object-cover align-middle"
          />
        </div>
        <div className="mx-auto mt-[30px] mb-[80px] w-full max-w-3xl px-6">
          <h1 className="relative top-[-67px] -mt-[30px] w-full max-w-[870px] text-[48px] font-bold leading-normal">
            قانون حق نشر
          </h1>
          <div className="w-full">
            <p className="mb-[30px] text-[18px] leading-[21px]">
              آثار دارای حق نشر شما بدون اجازه‌تان در شارژینو منتشر شده؟ لطفاً از صفحهٔ{" "}
              <Link href="/contact-us" className="text-linkblue">
                تماس با ما
              </Link>{" "}
              با موضوع «ادعای حق نشر» پیام بفرستید تا بررسی کنیم.
            </p>
          </div>
          <InfoBox
            lead="در پیام این اطلاعات را بنویسید:"
            items={[
              "نشانی اینترنتی محتوای ناقض حق نشر در charjino.ir",
              "شرح نقض",
              "مدرک مالکیت حق نشر، یا مدرک نمایندگی قانونی مالک",
              "نام و نام خانوادگی قانونی",
              "نام شرکت",
              "نشانی",
            ]}
          />
          <div className="mt-[30px] w-full">
            <p className="mb-[30px] text-[18px] leading-[21px]">
              در صورت امکان از ایمیل رسمی شرکت استفاده کنید. برای مثال، ما درخواست را از نشانی دامنهٔ{" "}
              <span dir="auto">@charjino.ir</span> می‌فرستیم.
            </p>
          </div>
          <InfoBox
            lead="با ارسال ادعای حق نشر تأیید می‌کنید که:"
            items={[
              "با حسن‌نیت معتقدید استفاده از این اثر در شکل مورد اعتراض، بدون اجازهٔ مالک حق نشر، نمایندهٔ او یا قانون است.",
              "اعلام می‌کنید اطلاعات درخواست درست است و مجازید از طرف مالک حق نشر اقدام کنید.",
              "می‌دانید اگر آگاهانه گزارش خلاف واقع بدهید، ممکن است مسئول خسارت، هزینه و حق‌الوکاله شوید.",
            ]}
          />
        </div>
      </main>
      <Footer />
      <ChatBubble />
    </div>
  );
}
