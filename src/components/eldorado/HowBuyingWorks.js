import { CONTACT_HREF } from "./data/faCopy";

export const HOW_BUYING_STEPS = [
  {
    title: "۱. محصول موردنظر خود را انتخاب کنید",
    text: "مشخصات و شرایط محصول را بررسی کنید و از بین فروشندگان، گزینه مناسب خود را انتخاب کنید. تمام اطلاعات لازم پیش از خرید در اختیار شماست.",
    img: "/home/how-purchasing/suggestion.webp",
  },
  {
    title:"۳. محصول را از فروشنده تحویل بگیرید",
    text: "مبلغ پرداختی تا زمان تحویل و تأیید محصول نزد شارژینو باقی می‌ماند. فروشنده قبل از تأیید شما به پول دسترسی نخواهد داشت.",
    img: "/home/how-purchasing/money.webp",
  },
  {
    title: "فروشنده تحویل می‌دهد",
    text: "فروشنده موظف است محصول را مطابق توضیحات آگهی و در زمان تعیین‌شده تحویل دهد. در صورت تأخیر یا مغایرت، می‌توانید از طریق شارژینو پیگیری کنید.",
    img: "/home/how-purchasing/seller.webp",
  },
  {
    title:"۴. بررسی کنید و با خیال راحت تأیید کنید",
    text: "پس از دریافت محصول، فرصت دارید آن را بررسی کنید. وقتی از صحت و کامل بودن سفارش مطمئن شدید، تحویل را تأیید کنید تا مبلغ برای فروشنده آزاد شود. در صورت بروز مشکل، امکان ثبت اختلاف و پیگیری وجود دارد.",
    img: "/home/how-purchasing/review.webp",
  },
];

export default function HowBuyingWorks() {
  return (
    <section className="relative z-10 mb-12">
      <div className="mx-auto max-w-[1208px] px-4 md:px-6">
        <div className="flex flex-col gap-4">
          <span className="block text-lg font-bold leading-[27px]">خرید مطمئن از شارژینو</span>
          <div className="rounded-lg bg-white">
            <ol className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 md:flex">
              {HOW_BUYING_STEPS.map((s) => (
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
              <span>پشتیبانی تخصصی و ۲۴ ساعته در کنار شماست تا با اطمینان خرید کنید..</span>
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
