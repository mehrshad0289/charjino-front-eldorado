const CDN = "https://assetsdelivery.eldorado.gg/v7/_assets_/home-page/v4";

export default function Hero() {
  return (
    <section className="relative h-[280px] overflow-hidden md:h-[465px]">
      {/* mobile banner (includes characters) */}
      <img
        src={`${CDN}/brainrot-red-carpet-banner-mobile.webp`}
        alt="Homepage banner background image"
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover md:hidden"
      />
      {/* desktop banner + characters layer */}
      <img
        src={`${CDN}/brainrot-red-carpet-banner-desktop.webp`}
        alt="Homepage banner background image"
        fetchPriority="high"
        className="absolute inset-0 hidden h-full w-full object-cover md:block"
      />
      <img
        src={`${CDN}/brainrot-hero.webp`}
        alt=""
        fetchPriority="high"
        className="absolute bottom-[145px] left-[65%] hidden h-[280px] -translate-x-1/2 md:block"
      />

      {/* desktop content: left aligned */}
      <div className="relative mx-auto hidden max-w-[1160px] md:block">
        <div className="max-w-[440px] pt-[72px]">
          <h1 className="hero-text-shadow text-[48px] font-bold leading-[1.1] text-white">
            Complete your Brainrot set
          </h1>
          <p className="hero-text-shadow mt-4 text-xl text-white">
            The largest Steal a Brainrot marketplace
          </p>
          <a
            href="/steal-a-brainrot-brainrots/i/259"
            aria-label="Shop now"
            className="mt-6 flex h-14 w-[175px] items-center justify-center rounded-lg bg-brand text-base font-bold text-ink"
          >
            Shop now
          </a>
        </div>
      </div>

      {/* mobile content: centered bottom */}
      <div className="relative flex h-full flex-col items-center justify-end px-4 pb-5 text-center md:hidden">
        <h1 className="hero-text-shadow text-[26px] font-bold leading-[1.15] text-white">
          Complete your Brainrot set
        </h1>
        <p className="hero-text-shadow mt-1 text-base text-white">
          #1 Roblox Marketplace
        </p>
        <a
          href="/steal-a-brainrot-brainrots/i/259"
          aria-label="Shop now"
          className="mt-3 flex h-12 w-full items-center justify-center rounded-lg bg-brand text-base font-bold text-ink"
        >
          Shop now
        </a>
      </div>
    </section>
  );
}
