const GCS =
  "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F";

const STEPS = [
  {
    title: "Pick an offer",
    text: "Buy from a seller with a high review count & rating. All sellers pass government ID checks before they list.",
    img: `${GCS}8ccff360b883d751d94331756ce41c14b98d3f9b.png?generation=1793718219565314&alt=media`,
  },
  {
    title: "We hold the money",
    text: "Your payment goes to Eldorado. The seller gets nothing until you confirm that everything is OK.",
    img: `${GCS}014b581c8d37987be1334df544b7ff49871d55a0.png?generation=1793718219573728&alt=media`,
  },
  {
    title: "The seller delivers",
    text: "We give each seller a delivery deadline. If it's late or not what you paid for, raise a dispute. 95% of orders never need one.",
    img: `${GCS}8e41a34806db347539f524cecc103f3fd4aefb52.png?generation=1793718219589161&alt=media`,
  },
  {
    title: "Check within 3 days",
    text: "You get 3 days to check it's right and get a refund if it isn't. Some orders stay protected by TradeShield for longer.",
    img: `${GCS}a490a1a475d0cd28d8398a73d851479273f6f8ee.png?generation=1793718219583380&alt=media`,
  },
];

export default function HowBuyingWorks() {
  return (
    <section className="relative z-10 mb-12">
      <div className="mx-auto max-w-[1208px] px-4 md:px-6">
        <div className="flex flex-col gap-4">
          <span className="block text-lg font-bold leading-[27px]">
            How buying on Eldorado works
          </span>
          <div className="rounded-lg bg-white">
            <ol className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 md:flex">
              {STEPS.map((s) => (
                <li key={s.title} className="flex min-w-0 flex-1 flex-col gap-3">
                  <img
                    src={s.img}
                    alt={`Illustration: ${s.title}`}
                    loading="lazy"
                    width="40"
                    height="40"
                    className="h-10 w-10 shrink-0 object-cover"
                  />
                  <div className="flex flex-col gap-1">
                    <span className="block font-bold">{s.title}</span>
                    <p className="text-sm leading-[19.6px] text-graytext">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="border-t-[0.8px] border-cardborder px-6 pt-3 pb-3 text-sm leading-[19.6px] text-graytext">
              <span>You can reach a human at support 24/7.</span>
              <a
                href="https://support.eldorado.gg/en/articles/17098994-good-to-know-before-you-buy"
                className="ml-1 inline-block text-linkblue"
              >
                Good to know before you buy
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
