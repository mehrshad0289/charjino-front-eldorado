function StarIcon() {
  return (
    <svg width="66" height="66" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="m12 2 2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 16.9l-6.1 3.5 1.5-6.8L2.2 9l6.9-.7L12 2Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* SEO block at the bottom of the shop pages (giftcard + gamepass captures):
   h1, gradient rating badge (4.9 from N orders), verbatim copy blocks
   ({p} paragraph / {h2} subheading / {list} ordered list). Defaults to the
   gift card content; the game pass page passes its own blocks. */

const DEFAULT_BLOCKS = [
  {
    p: "Buy Xbox gift cards cheap and gain instant access to the expansive world of Microsoft/Xbox games, subscriptions, DLCs, passes and other content. Whether you're gaming on Xbox Series X|S, Xbox One, or Windows PC (for Microsoft Store), these digital codes allow you to purchase games, downloadable content (DLC), in-game currency, subscriptions like Xbox Game Pass, and more. With Eldorado.gg, you can find Xbox gift cards for sale at cheaper prices, offering a convenient and secure way to enhance your gaming experience.",
  },
  { h2: "Xbox Gift Cards for Sale" },
  {
    p: "When you buy Xbox gift cards, you're unlocking a universe of digital content. From Xbox exclusives to the newly released games, from epic DLCs to exclusive bundles with skins, an Xbox gift card makes it all accessible. These cards are region-specific, Eldorado offers support for USA, UK, EU and Canada with plans to expand to the global support, ensuring you can find the perfect card wherever you game. Plus, with Eldorado.ggs instant delivery, there's no waiting—buy your Xbox gift card and receive it right away and redeem it on your favorite title.",
  },
  { h2: "Buy Microsoft Gift Card" },
  {
    p: "Buy Microsoft gift card codes from Eldorado.gg and enjoy competitive pricing with verified sellers, secure transactions, and 24/7 customer support. Whether you're topping up for yourself or sending a digital gift, our Xbox gift card digital offers give you more for your money. The higher value gift card you buy, the bigger the discount you can get compared to the Xbox store—just browse the listings, pick the best deal, and redeem your code right away. Don't miss out on sales, exclusive content, or premium upgrades. Buy Xbox gift cards now and elevate your gaming experience without overpaying ever again.",
  },
  { h2: "How to buy Xbox gift card" },
  {
    p: "In need for Xbox gift card? Here is a quick guide on how you can easily purchase it through Eldorado.gg:",
  },
  {
    list: [
      "On this very page, select your region and the exact Xbox/Microsoft gift card that you want to buy, with that you are also able to choose a seller from whom youre buying it.",
      "Sellers also provide a description about Xbox gift card, we suggest you to read it to make sure you are getting exactly what you want",
      "Click Buy now button, select your preferred payment method and complete the purchase",
      "Once the transaction is confimed, you will be redirected to a new window where you can see your Xbox gift card either a code or a link to redeem it with",
      "On the same page there is also a chatbox where you can chat with the seller in case you need instructions or have any questions",
    ],
  },
  {
    p: "Redeem your Xbox gift card and enjoy the benefits! In any cases you can always contact our support or use the chat with the seller, together with provided extra buttons, such as Raise a dispute in case any trouble occurs.",
  },
];

export default function GiftCardSeoText({
  title = "Buy Xbox Gift Cards Cheap",
  orders = "14,600",
  blocks = DEFAULT_BLOCKS,
}) {
  return (
    <div className="mx-auto mb-16 mt-16 w-full max-w-[1208px] px-4 lg:mb-[64px] lg:mt-[128px] lg:px-6">
      <div className="pb-5">
        <h1 className="mb-2.5 text-[24px] font-bold leading-[33.6px]">{title}</h1>
      </div>
      <div className="mb-5 flex">
        <div
          className="flex h-[43px] min-w-[246px] items-center rounded-lg pr-3"
          style={{ backgroundImage: "linear-gradient(to right, rgb(223, 28, 255) -55.11%, rgb(255, 201, 80) 97.14%)" }}
        >
          {/* capture: 66px yellow star with the 4.9 overlaid on it */}
          <div className="relative ml-1 h-[43px] w-[60px] shrink-0">
            <span className="absolute left-[22px] top-[11px] z-[2] block font-bold">4.9</span>
            <span className="absolute -top-3 left-0 z-[1] block text-[rgb(255,_201,_80)]">
              <StarIcon />
            </span>
          </div>
          <p className="ml-1.5 flex items-center justify-center text-[13px] leading-[21px]">
            From last<b className="px-1 font-bold">{orders}</b>orders
          </p>
        </div>
      </div>
      {blocks.map((block, i) =>
        block.h2 ? (
          <h2 key={i} className="font-bold leading-[19px]">
            {block.h2}
          </h2>
        ) : block.list ? (
          <ol key={i} className="mb-5 list-decimal pl-[30px]">
            {block.list.map((li, j) => (
              <li key={j} className="list-decimal">
                <p>{li}</p>
              </li>
            ))}
          </ol>
        ) : (
          <p key={i} className="mb-4">
            {block.p}
          </p>
        )
      )}
    </div>
  );
}
