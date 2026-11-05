import { CONTACT_HREF } from "./data/faCopy";

const GCS =
  "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F";

const STEPS = [
  {
    title: "یک پیشنهاد را انتخاب کنید",
    text: "از فروشنده‌ای با تعداد نظر و امتیاز بالا بخرید. همهٔ فروشنده‌ها قبل از ثبت آگهی مدارک هویتی می‌دهند.",
    img: `${GCS}8ccff360b883d751d94331756ce41c14b98d3f9b.png?generation=1793718219565314&alt=media`,
  },
  {
    title: "ما پول را نگه می‌داریم",
    text: "پرداخت شما به شارژینو می‌رود. فروشنده تا وقتی تأیید نکنید که همه چیز درست است، پولی نمی‌گیرد.",
    img: `${GCS}014b581c8d37987be1334df544b7ff49871d55a0.png?generation=1793718219573728&alt=media`,
  },
  {
    title: "فروشنده تحویل می‌دهد",
    text: "برای هر فروشنده مهلت تحویل می‌گذاریم. اگر دیر شد یا مطابق پرداخت نبود، اختلاف ثبت کنید. ۹۵٪ سفارش‌ها هرگز به این مرحله نمی‌رسند.",
    img: `${GCS}8e41a34806db347539f524cecc103f3fd4aefb52.png?generation=1793718219589161&alt=media`,
  },
  {
    title: "تا سه روز بررسی کنید",
    text: "سه روز فرصت دارید درست بودن را چک کنید و اگر نبود، پول برگردد. بعضی سفارش‌ها مدت بیشتری پوشش دارند.",
    img: `${GCS}a490a1a475d0cd28d8398a73d851479273f6f8ee.png?generation=1793718219583380&alt=media`,
  },
];

export default function HowBuyingWorks() {
  return (
    <section className="relative z-10 mb-12">
      <div className="mx-auto max-w-[1208px] px-4 md:px-6">
        <div className="flex flex-col gap-4">
          <span className="block text-lg font-bold leading-[27px]">خرید چطور کار می‌کند</span>
          <div className="rounded-lg bg-white">
            <ol className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 md:flex">
              {STEPS.map((s) => (
                <li key={s.title} className="flex min-w-0 flex-1 flex-col gap-3">
                  <img
                    src={s.img}
                    alt=""
                    loading="lazy"
                    width="40"
                    height="40"
                    className="h-10 w-10 shrink-0 object-cover"
                  />
                  <div className="flex flex-col gap-1">
                    <span className="block font-bold">{s.title}</span>
                    <p className="text-sm leading-[19.6px] text-graytext">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="border-t-[0.8px] border-cardborder px-6 pt-3 pb-3 text-sm leading-[19.6px] text-graytext">
              <span>پشتیبانی انسانی شبانه‌روز در دسترس است.</span>
              <a href={CONTACT_HREF} className="ms-1 inline-block text-linkblue">
                قبل از خرید خوب است بدانید
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
