const CDN = "https://assetsdelivery.eldorado.gg/v7/_assets_/home-page/v4";

export default function TradingSection() {
  return (
    <section className="bg-white">
      <div className="mx-auto flex max-w-[1160px] flex-col items-center justify-center gap-12 overflow-hidden pt-8 md:flex-row md:gap-16">
        <div className="w-full md:w-1/2">
          <h2 className="mb-6 text-3xl font-bold text-ink">Safe and easy trading</h2>
          <div className="flex flex-col gap-4 text-base text-secondary md:text-xl">
            <span>
              Trade without fear - Eldorado guarantees that all trades are legit
              and keeps you safe from scammers.
            </span>
            <span>
              It&apos;s quick and easy - find the best product for your favorite
              game, make a payment, receive your order, and get back to playing.
            </span>
            <span>Join us today to level up your gaming experience.</span>
          </div>
        </div>

        <div className="relative hidden h-[520px] w-[548px] shrink-0 md:block">
          <img
            src={`${CDN}/safe-easy-trading-desktop.webp`}
            alt="Trading block image"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-contain"
          />
        </div>
        <img
          src={`${CDN}/safe-easy-trading-mobile.webp`}
          alt="Trading block image"
          loading="lazy"
          width="328"
          height="240"
          className="h-[240px] md:hidden"
        />
      </div>
    </section>
  );
}
