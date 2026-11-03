const CDN = "https://assetsdelivery.eldorado.gg/v7/_assets_/home-page/v4";

function Card({ bg, image, imageAlt, title, text, buttonText, href, imgClass }) {
  return (
    <div
      className="flex items-center rounded-lg p-6 md:p-9"
      style={{ backgroundColor: bg }}
    >
      <img
        src={`${CDN}/${image}`}
        alt={imageAlt}
        loading="lazy"
        className={`h-28 w-auto shrink-0 md:h-[154px] ${imgClass || ""}`}
      />
      <div className="ml-5 md:ml-[43px]">
        <div className="mb-6">
          <h3 className="mb-3.5 text-2xl font-bold text-ink">{title}</h3>
          <p className="leading-[21px] text-ink">{text}</p>
        </div>
        <a
          href={href}
          className="inline-flex min-h-[42px] w-fit items-center justify-center rounded-lg bg-darkbtn px-4 text-sm font-bold leading-[16.8px] text-white"
        >
          {buttonText}
        </a>
      </div>
    </div>
  );
}

export default function GuaranteeCards() {
  return (
    <section className="mb-16">
      <div className="mx-auto max-w-[1208px] px-4 md:px-6">
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="w-full">
            <Card
              bg="var(--color-guarantee)"
              image="trade-shield.svg?q=40"
              imageAlt="Trade shield"
              title="Money-back guarantee"
              text="Receive your order or get a refund. Feel safe with full trading protection."
              buttonText="Learn more"
              href="https://support.eldorado.gg/en/articles/8408994-tradeshield-buying"
            />
          </div>
          <div className="w-full">
            <Card
              bg="var(--color-support)"
              image="chat-support.svg"
              imageAlt="24/7 live support"
              title="24/7 live support"
              text="Eldorado support works around the clock. Contact us at any time."
              buttonText="Chat now"
              href="#"
              imgClass="md:h-36"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
