const GCS =
  "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F";

export default function RobloxBanner() {
  return (
    <div className="relative z-10 mb-16">
      <div className="mx-auto max-w-[1208px] px-4 md:px-6">
        <a
          href="https://www.eldorado.gg/roblox-items/i/70-2-0"
          className="block h-[76px] overflow-hidden rounded-lg"
        >
          <img
            src={`${GCS}91bde34b5cfcf91f517c2765b974410a21c740a0.webp?generation=1793718219570002&alt=media`}
            alt="“More ways to make it yours” banner with Roblox avatars"
            loading="lazy"
            className="h-[76px] w-full object-cover"
          />
        </a>
      </div>
    </div>
  );
}
