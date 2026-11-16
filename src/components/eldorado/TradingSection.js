export default function TradingSection() {
  return (
    <section className="mb-16 bg-white">
      <div className="mx-auto flex max-w-[1208px] flex-col items-center justify-center gap-12 overflow-hidden px-4 py-10 md:flex-row md:gap-16 md:px-6 md:py-0 md:min-h-[280px]">
        <div className="w-full md:w-1/2">
          <h2 className="mb-6 text-3xl font-bold text-ink">معاملهٔ امن و ساده</h2>
          <div className="flex flex-col gap-4 text-base text-graytext md:text-xl">
            <span>
              بدون ترس معامله کنید — شارژینو تضمین می‌کند معامله‌ها معتبرند و شما را از کلاهبرداری دور نگه می‌دارد.
            </span>
            <span>
              سریع و ساده است — محصول بازی‌تان را پیدا کنید، پرداخت کنید، تحویل بگیرید و برگردید به بازی.
            </span>
            <span>همین امروز بپیوندید و تجربهٔ بازی‌تان را بالا ببرید.</span>
          </div>
        </div>
        <img
          src="/home/safe-easy-trading-desktop.webp"
          alt=""
          loading="lazy"
          className="h-60 w-full object-contain md:hidden"
        />
        <div className="relative hidden h-[520px] w-[548px] shrink-0 md:block">
          <img
            src="/home/safe-easy-trading-desktop.webp"
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-contain"
          />
        </div>
      </div>
    </section>
  );
}
