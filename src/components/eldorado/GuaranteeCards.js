const CDN = "https://assetsdelivery.eldorado.gg/v7/_assets_/home-page/v4";

function Card({ bg, image, imageAlt, title, text, buttonText, href }) {
  return (
    <div
      className="flex items-center gap-5 rounded-lg p-5 md:h-[226px] md:justify-between md:gap-6 md:px-8"
      style={{ backgroundColor: bg }}
    >
      <img
        src={`${CDN}/${image}`}
        alt={imageAlt}
        loading="lazy"
        className="h-20 w-auto shrink-0 md:h-[154px]"
      />
      <div className="md:max-w-[300px]">
        <h3 className="text-xl font-bold text-ink">{title}</h3>
        <p className="mt-2 text-sm text-ink/80">{text}</p>
        <a
          href={href}
          className="mt-4 inline-flex h-10 items-center justify-center rounded-lg bg-ink px-4 text-sm font-bold text-white"
        >
          {buttonText}
        </a>
      </div>
    </div>
  );
}

export default function GuaranteeCards() {
  return (
    <section className="mx-auto max-w-[1160px] px-4 pb-16 pt-4 md:px-0">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card
          bg="var(--color-guarantee)"
          image="trade-shield.svg?q=40"
          imageAlt="Trade shield"
          title="Money-back guarantee"
          text="Receive your order or get a refund. Feel safe with full trading protection."
          buttonText="Learn more"
          href="#"
        />
        <Card
          bg="var(--color-support)"
          image="chat-support.svg"
          imageAlt="24/7 live support"
          title="24/7 live support"
          text="Eldorado support works around the clock. Contact us at any time."
          buttonText="Chat now"
          href="#"
        />
      </div>
    </section>
  );
}
