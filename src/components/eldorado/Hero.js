import Link from "next/link";

/*
 * Image-only banner from the .make reference: 465px tall on desktop, bottom
 * 340px fades into the page background; the "Popular" cards row overlaps it.
 * Local home banner from imeg, linked to our Roblox hub.
 */
export default function Hero() {
  return (
    <Link
      href="/shop/top-ups/roblox"
      aria-label="روبلاکس"
      className="absolute inset-x-0 top-0 z-0 hidden h-[465px] overflow-hidden md:block"
    >
      {/* <img
        src="/home/banner.webp"
        alt=""
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: "50% 15%" }}
      /> */}
      <div
        className="absolute inset-x-0 -bottom-px h-[140px] md:h-[340px]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(246, 246, 246, 0) 0%, rgb(246, 246, 246) 100%)",
        }}
      />
    </Link>
  );
}
