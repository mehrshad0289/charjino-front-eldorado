const CDN = "https://assetsdelivery.eldorado.gg/v7/_assets_/home-page/v4";

/*
 * Image-only banner from the .make reference: 465px tall on desktop, bottom
 * 340px fades into the page background; the "Popular" cards row overlaps it.
 * No text overlay or CTA — the .make capture of eldorado.gg shows the banner
 * alone (verified against live pixel probe 2026-11-03).
 */
export default function Hero() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[280px] overflow-hidden md:h-[465px]"
    >
      <img
        src={`${CDN}/brainrot-red-carpet-banner-mobile.webp`}
        alt=""
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover md:hidden"
      />
      <img
        src={`${CDN}/brainrot-red-carpet-banner-desktop.webp`}
        alt="Homepage banner background image"
        fetchPriority="high"
        className="absolute inset-0 hidden h-full w-full object-cover md:block"
        style={{ objectPosition: "50% 15%" }}
      />
      <div
        className="absolute inset-x-0 -bottom-px h-[140px] md:h-[340px]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(246, 246, 246, 0) 0%, rgb(246, 246, 246) 100%)",
        }}
      />
    </div>
  );
}
