const SAFETY = [
  {
    title: "با خیال راحت بخر",
    text: "بعد از پرداخت، پول نزد شارژینو می‌ماند. فروشنده تا وقتی تأیید کنی همه‌چیز درست است پولی نمی‌گیرد.",
  },
  {
    title: "اکانت را بررسی کن",
    text: "مشخصات ورود را می‌گیری. وارد شو و ببین همه‌چیز با آگهی یکی است.",
  },
  {
    title: "اگر فرق داشت، پول برمی‌گردد",
    text: "اگر اکانت با آگهی یکی نبود، خبر بده تا پول برگردد.",
  },
];

function steps(name) {
  return [
    `آگهی‌های اکانت ${name} را ببین و همان را که می‌خواهی انتخاب کن.`,
    `مشخصات و قیمت همان آگهی را بخوان.`,
    `دکمهٔ خرید را بزن و پرداخت را انجام بده.`,
    `اگر تحویل فوری باشد مشخصات همان لحظه می‌آید؛ وگرنه فروشنده در مهلتی که روی آگهی نوشته تحویل می‌دهد.`,
    `وارد اکانت شو، با آگهی مقایسه کن و اطلاعات ورود را عوض کن.`,
    `وقتی مطمئن شدی سفارش را «دریافت شد» بزن.`,
    `اگر خواستی برای فروشنده نظر بگذار تا خریدار بعدی تصمیم راحت‌تری بگیرد.`,
  ];
}

export default function AccountShopSeo({ gameName, countLabel }) {
  const name = gameName || "بازی";
  return (
    <div className="mb-16 mt-12 lg:mt-20">
      <section aria-label="امنیت پول">
        <h2 className="mb-6 text-center text-[24px] font-bold leading-[34px] lg:mb-8 lg:text-[30px] lg:leading-[40px]">
          پول شما چطور امن می‌ماند
        </h2>
        <ol className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
          {SAFETY.map((item, index) => (
            <li
              key={item.title}
              className="rounded-lg bg-white p-5 shadow-[rgba(9,9,11,0.05)_0px_2px_4px_0px,rgba(9,9,11,0.02)_0px_12px_8px_0px]"
            >
              <span className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-brand text-[16px] font-bold">
                {index + 1}
              </span>
              <h3 className="mb-2 text-[18px] font-bold leading-[26px] lg:text-[20px]">{item.title}</h3>
              <p className="text-[15px] leading-[24px] text-graytext lg:text-[16px] lg:leading-[26px]">{item.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-12 lg:mt-16" aria-label="اعتماد خریدار">
        <h2 className="mb-6 text-center text-[22px] font-bold leading-[32px] lg:text-[30px] lg:leading-[40px]">
          مورد اعتماد خریداران
        </h2>
        <ul className="grid grid-cols-1 gap-3 lg:grid-cols-3 lg:gap-4">
          {[
            "هویت فروشنده قبل از ثبت آگهی بررسی شده است.",
            "پول تا تأیید تحویل نزد شارژینو می‌ماند.",
            "اگر آگهی با چیزی که تحویل گرفته‌ای فرق داشت، پول برمی‌گردد.",
          ].map((line) => (
            <li
              key={line}
              className="rounded-lg bg-white px-4 py-5 text-[15px] leading-[24px] shadow-[rgba(9,9,11,0.05)_0px_2px_4px_0px,rgba(9,9,11,0.02)_0px_12px_8px_0px]"
            >
              {line}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12 lg:mt-[96px]">
        <h1 className="mb-3 text-[24px] font-bold leading-[34px]">خرید اکانت {name}</h1>
        {countLabel ? (
          <p className="mb-4 inline-flex items-center rounded-lg bg-brand px-3 py-2 text-[14px] font-bold">
            {countLabel} آگهی فعال
          </p>
        ) : null}
        <p className="mb-4 text-[16px] leading-[28px]">
          آگهی‌های اکانت {name} را در شارژینو مقایسه کنید. هر پیشنهاد عنوان، عکس، مشخصات و قیمت دارد و تا تأیید
          ادمین در این صفحه دیده نمی‌شود. بعد از خرید، پول نزد شارژینو می‌ماند تا خودتان تحویل را تأیید کنید.
        </p>
        <h2 className="mb-2 font-bold leading-[24px]">اکانت‌های {name}</h2>
        <p className="mb-4 text-[16px] leading-[28px]">
          آگهی را با مشخصات همان بازی بسنجید: سطح، رنک و نوع دسترسی. عکسی که فروشنده گذاشته باید با توضیح آگهی یکی
          باشد. اگر دسترسی ایمیل در آگهی آمده، قبل از خرید همان ردیف را بخوانید.
        </p>
        <h2 className="mb-2 font-bold leading-[24px]">خرید اکانت {name}</h2>
        <p className="mb-4 text-[16px] leading-[28px]">
          آگهیی را انتخاب کنید که با چیزی که می‌خواهید یکی است. قیمت را با بقیهٔ پیشنهادهای {name} مقایسه کنید و
          فقط همان صفحه‌ای را بخرید که مشخصاتش را خوانده‌اید.
        </p>
        <h2 className="mb-2 font-bold leading-[24px]">روش خرید اکانت {name}</h2>
        <ol className="list-decimal space-y-2 pe-1 ps-6 text-[16px] leading-[28px]">
          {steps(name).map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>
    </div>
  );
}
