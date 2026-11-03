const CDN = "https://assetsdelivery.eldorado.gg/v7/_assets_/home-page/v4";

export default function Hero() {
  return (
    <section className="relative h-[465px] overflow-hidden">
      <img
        src={`${CDN}/brainrot-red-carpet-banner-desktop.webp`}
        alt="Homepage banner background image"
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <img
        src={`${CDN}/brainrot-hero.webp`}
        alt=""
        fetchPriority="high"
        className="absolute bottom-[145px] left-[65%] h-[280px] -translate-x-1/2"
      />

      <div className="relative mx-auto max-w-[1160px]">
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
    </section>
  );
}
