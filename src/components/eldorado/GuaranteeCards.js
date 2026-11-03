const CDN = "https://assetsdelivery.eldorado.gg/v7/_assets_/home-page/v4";

function Card({ bg, image, imageAlt, imageStyle, title, text, buttonText, href }) {
  return (
    <div
      className="flex h-[226px] items-center justify-between gap-6 rounded-lg px-8"
      style={{ backgroundColor: bg }}
    >
      <img
        src={`${CDN}/${image}`}
        alt={imageAlt}
        loading="lazy"
        style={imageStyle}
      />
      <div className="max-w-[300px]">
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
    <section className="mx-auto max-w-[1160px] pb-16 pt-4">
      <div className="grid grid-cols-2 gap-4">
        <Card
          bg="var(--color-guarantee)"
          image="trade-shield.svg?q=40"
          imageAlt="Trade shield"
          imageStyle={{ height: "154px" }}
          title="Money-back guarantee"
          text="Receive your order or get a refund. Feel safe with full trading protection."
          buttonText="Learn more"
          href="#"
        />
        <Card
          bg="var(--color-support)"
          image="chat-support.svg"
          imageAlt="24/7 live support"
          imageStyle={{ height: "154px" }}
          title="24/7 live support"
          text="Eldorado support works around the clock. Contact us at any time."
          buttonText="Chat now"
          href="#"
        />
      </div>
    </section>
  );
}
