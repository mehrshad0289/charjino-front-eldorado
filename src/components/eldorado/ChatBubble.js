const GCS =
  "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F";

/* Intercom-style chat bubble, fixed bottom-right (present on live eldorado.gg) */
export default function ChatBubble() {
  return (
    <a
      href="/contact-us"
      aria-label="گفتگو"
      className="fixed end-5 bottom-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-brand shadow-[0_1px_6px_rgba(0,0,0,0.06),0_2px_32px_rgba(0,0,0,0.16)]"
    >
      <img
        src={`${GCS}3ac514e2f10ecc546d6f42b7a35609744d381842.svg?generation=1793718219990790&alt=media`}
        alt=""
        width="24"
        height="24"
        loading="lazy"
      />
    </a>
  );
}
