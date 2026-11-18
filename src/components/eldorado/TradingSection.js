export default function TradingSection() {
  return (
    <section className="mb-16 bg-white">
      <div className="mx-auto flex max-w-[1208px] flex-col items-center justify-center gap-12 overflow-hidden px-4 py-10 md:flex-row md:gap-16 md:px-6 md:py-0 md:min-h-[280px]">
        <div className="w-full md:w-1/2">
          <h2 className="mb-6 text-3xl font-bold text-ink">
            خرید مطمئن، معامله شفاف
          </h2>
          <div className="flex flex-col gap-4 text-base text-graytext md:text-xl">
            <p>
              با خیال راحت خرید کنید؛ شارژینو با نگهداری مبلغ پرداختی تا زمان
              تأیید سفارش و فراهم کردن امکان پیگیری و ثبت اختلاف، از حقوق
              خریداران محافظت می‌کند.
            </p>

            <p>
              <strong>ساده، سریع و مطمئن:</strong>
              محصول موردنظرتان را انتخاب کنید، پرداخت را انجام دهید و پس از
              تحویل و بررسی، سفارش خود را تأیید کنید.
            </p>

            <p>
              در تمام مراحل خرید، شارژینو در کنار شماست تا با اطمینان بیشتری
              خرید کنید و بیشتر از همیشه از دنیای بازی لذت ببرید.
            </p>
          </div>
        </div>
        <img
          src="home/Secure-Shopping-Transparent-Transactions-Sharjino.png"
          alt=""
          loading="lazy"
          className="h-60 w-full object-contain md:hidden"
        />
        <div className="relative hidden h-[520px] w-[548px] shrink-0 md:block">
          <img
            src="home/Secure-Shopping-Transparent-Transactions-Sharjino.png"
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-contain"
          />
        </div>
      </div>
    </section>
  );
}
