// Data for the support.eldorado.gg "Seller rules" help-center article page
// (session 24/25; the user-pushed shop-Seller rules capture →
// snapshots/sellerrules-1920px-light-{1,2}.tsx). All copy verbatim from the
// capture — the &nbsp; runs and double spaces are normalized to single
// spaces exactly as they render. Links keep the capture's support.eldorado.gg
// hrefs (external site — the live help center is the authority for those).

const A = "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F";

export const SUPPORT_IMAGES = {
  logo: `${A}c4167a01b129ef00c54d42e1641e9ddd3b2d0f65.png?generation=1793817095323835&alt=media`,
  globe: `${A}483fb55dbf77b1867fbd8a2f8294dc76a1994af9.svg?generation=1793817186604904&alt=media`,
  chevron: `${A}862fa31240c4d700074cfd3937ec2abe5032536c.svg?generation=1793817186650347&alt=media`,
  breadcrumbChevron: `${A}682f43237060dae7ed11ec4ee78f0d38af343fd0.svg?generation=1793817186867872&alt=media`,
  breadcrumbChevron2: `${A}608afd642560f128df4d005c33bd181cae2939c6.svg?generation=1793817186863811&alt=media`,
  copyLlm: `${A}dfcb3d941f6a401a5164ce0ea4612ff98c5a034e.svg?generation=1793817186908860&alt=media`,
  moreActions: `${A}cd44529a37e922463160a14a03be22aac12d5c75.svg?generation=1793817187008820&alt=media`,
  feedbackUp: `${A}3e0f06e31a8c9531f264b364b2a9bd0bf9a3bf6e.svg?generation=1793817187037779&alt=media`,
  feedbackDown: `${A}f356da91af849182535fd9cc52dfd7a7acef6745.svg?generation=1793817187012201&alt=media`,
  relatedArrow: `${A}4de56b2417898de4046f9ab04f94d99d06fa18c1.svg?generation=1793817187075986&alt=media`,
};

// Docs-nav accordion tree; `expanded` collections render their articles,
// `active` marks the current article (blue + 2px left bar per the capture).
// Icons/chevrons are the capture's own per-row assets (session 25 QA:
// hrefs corrected to the capture's verbatim URLs, Refunds / Eldorado
// account / Game guides moved back to TOP level, icons restored).
export const SUPPORT_NAV = [
  {
    label: "Getting started",
    expanded: false,
    icon: `${A}80e9ac50365eb4460d36c15d4503adc8f19d1c15.png?generation=1793817095366199&alt=media`,
    chevron: `${A}d6da788f092130ad6984d963b5fa8fff91963b68.svg?generation=1793817186622802&alt=media`,
    href: "https://support.eldorado.gg/en/collections/19784300-getting-started",
    articles: [],
  },
  {
    label: "Buying",
    expanded: true,
    icon: `${A}53e48a4dd9855a47f1f681aa918a55b0ba61379d.png?generation=1793817095382210&alt=media`,
    chevron: `${A}b09aa6be7a2c31e5a720411ece92ddc5b2779567.svg?generation=1793817186634633&alt=media`,
    href: "https://support.eldorado.gg/en/collections/19784306-buying-and-receiving-orders",
    articles: [
      { label: "Buying and receiving orders", collection: true, expanded: false, chevron: `${A}2fcdad19c45bf6a463111c4cc15cbd6394d3f218.svg?generation=1793817186624685&alt=media`, href: "https://support.eldorado.gg/en/collections/19784306-buying-and-receiving-orders", children: [] },
      { label: "Payments", collection: true, expanded: false, chevron: `${A}a40ef3147aa6b0bdad8fc6f8dcb97c1c4b046ac8.svg?generation=1793817186634100&alt=media`, href: "https://support.eldorado.gg/en/collections/19784308-payments", children: [] },
    ],
  },
  {
    label: "Selling",
    expanded: true,
    icon: `${A}dcaad788ec8f6ff8350659bb201627afb18b15a1.png?generation=1793817095376264&alt=media`,
    chevron: `${A}60c14827c66438584bbf9ea6adbc0c77b0f75f50.svg?generation=1793817186641112&alt=media`,
    href: "https://support.eldorado.gg/en/collections/19784313-seller-verification",
    articles: [
      {
        label: "Seller verification",
        collection: true,
        expanded: true,
        chevron: `${A}dfaebaa26117519acd9ab0fc14dce79bf31f826d.svg?generation=1793817186648180&alt=media`,
        href: "https://support.eldorado.gg/en/collections/19784313-seller-verification",
        children: [
          { label: "Seller verification guide", href: "https://support.eldorado.gg/en/articles/9896838-seller-verification-guide" },
          { label: "Additional verification for restricted seller categories", href: "https://support.eldorado.gg/en/articles/11928248-additional-verification-for-restricted-seller-categories" },
          { label: "Supported documents for verification", href: "https://support.eldorado.gg/en/articles/16860239-supported-documents-for-verification" },
          { label: "Which countries are eligible to sell on Eldorado?", href: "https://support.eldorado.gg/en/articles/11315779-which-countries-are-eligible-to-sell-on-eldorado" },
        ],
      },
      {
        label: "Rules and guidelines",
        collection: true,
        expanded: true,
        chevron: `${A}b2bd211753ec9357541375c3b48b4055e90ace63.svg?generation=1793817186642572&alt=media`,
        href: "https://support.eldorado.gg/en/collections/19683304-rules-and-guidelines",
        children: [
          { label: "Seller rules", href: "https://support.eldorado.gg/en/articles/8408997-seller-rules", active: true },
          { label: "Account seller rules", href: "https://support.eldorado.gg/en/articles/8408996-account-seller-rules" },
          { label: "Account seller guidelines", href: "https://support.eldorado.gg/en/articles/13859407-account-seller-guidelines" },
          { label: "Gift card seller guidelines", href: "https://support.eldorado.gg/en/articles/11703747-gift-card-seller-guidelines" },
          { label: "Top up and subscription seller guidelines", href: "https://support.eldorado.gg/en/articles/12032614-top-up-and-subscription-seller-guidelines" },
          { label: "Item seller guidelines", href: "https://support.eldorado.gg/en/articles/13859389-item-seller-guidelines" },
          { label: "Boosting seller guidelines", href: "https://support.eldorado.gg/en/articles/13917635-boosting-seller-guidelines" },
          { label: "Currency seller guidelines", href: "https://support.eldorado.gg/en/articles/13917846-currency-seller-guidelines" },
          { label: "Duplicate offers", href: "https://support.eldorado.gg/en/articles/10183840-duplicate-offers" },
          { label: "Keyword rules FAQ", href: "https://support.eldorado.gg/en/articles/11130882-keyword-rules-faq" },
        ],
      },
      { label: "Selling and managing offers", collection: true, expanded: false, chevron: `${A}9fabb0882bc9a01831807459d5b28139ff8247f7.svg?generation=1793817186699474&alt=media`, href: "https://support.eldorado.gg/en/collections/19784315-selling-and-managing-offers", children: [] },
      { label: "Automated delivery", collection: true, expanded: false, chevron: `${A}acb5de38f0f007ea43617204eb78e3bae3cfbd6d.svg?generation=1793817186810499&alt=media`, href: "https://support.eldorado.gg/en/collections/19683303-automated-delivery", children: [] },
      { label: "Ranking system and user feedback", collection: true, expanded: false, chevron: `${A}4016bb94e939126c23038966d60fade48d23caeb.svg?generation=1793817186810390&alt=media`, href: "https://support.eldorado.gg/en/collections/19784317-ranking-system-and-user-feedback", children: [] },
      { label: "Fees and withdrawals", collection: true, expanded: false, chevron: `${A}c6134ddbcd4b9e4dce180fd9c012af596a3f24c0.svg?generation=1793817186814768&alt=media`, href: "https://support.eldorado.gg/en/collections/19784318-fees-and-withdrawals", children: [] },
    ],
  },
  {
    label: "Refunds and protection",
    expanded: false,
    icon: `${A}ff2fdf33d0a96af6ea50a047dafc80304a9dc3a2.png?generation=1793817095527337&alt=media`,
    chevron: `${A}10e745853d5693bfb928ad85e0efd8ca7e5e10f9.svg?generation=1793817186873401&alt=media`,
    href: "https://support.eldorado.gg/en/collections/6253629-refunds-and-protection",
    articles: [],
  },
  {
    label: "Eldorado account",
    expanded: false,
    icon: `${A}687b1f19b2029991ec1f8c59eda9c4432f23aa80.png?generation=1793817095546471&alt=media`,
    chevron: `${A}2caa3a433bb13e10ae5ad288be1e5bce2042700a.svg?generation=1793817186863177&alt=media`,
    href: "https://support.eldorado.gg/en/collections/6253624-eldorado-account",
    articles: [],
  },
  {
    label: "Game guides",
    expanded: false,
    icon: `${A}509f2c91591688c66cde7fdbb8f0004e469a72ad.png?generation=1793817095578099&alt=media`,
    chevron: `${A}2e7779fb49c25c60b4a9b58964474fdf8790b49e.svg?generation=1793817186902422&alt=media`,
    href: "https://support.eldorado.gg/en/collections/11589525-game-guides",
    articles: [],
  },
];

export const SUPPORT_ARTICLE = {
  breadcrumb: [
    { label: "All Collections", href: "https://support.eldorado.gg/en/" },
    { label: "Rules and guidelines", href: "https://support.eldorado.gg/en/collections/19683304-rules-and-guidelines" },
  ],
  current: "Seller rules",
  title: "Seller rules",
  description: "Prepare to sell on Eldorado by learning about the seller rules.",
  updated: "Updated over a week ago",
  toc: [
    { label: "Delivering orders", anchor: "h_888aa7be53", active: true },
    { label: "What's prohibited", anchor: "h_177602eb7b" },
    { label: "Handling disputes", anchor: "h_d9c22283bf" },
    { label: "Feedback and fairness", anchor: "h_361566e7a1" },
    { label: "Marketplace guidelines", anchor: "h_5611213f2e" },
    { label: "Requirements for sellers", anchor: "h_3be8f054fc" },
    { label: "Fraudulent practices", anchor: "h_80317bd49f" },
    { label: "Improving your offers", anchor: "h_3767554cc0" },
  ],
  related: [
    { label: "Start selling", href: "https://support.eldorado.gg/en/articles/8409007-start-selling" },
  ],
};

// Article body blocks. Segment model: string = plain text,
// {b} = bold lead, {a,label} = blue underlined link.
export const SELLER_RULES_BODY = [
  {
    type: "p",
    bold: true,
    justify: true,
    segments: [
      "Breaking these rules or the ",
      { a: "Terms of Service", href: "https://www.eldorado.gg/terms-of-service" },
      " can lead to canceled orders or account suspension, which can be temporary or permanent.",
    ],
  },
  {
    type: "p",
    segments: ["Before you list an offer, also read the guidelines for each category you want to sell in:"],
  },
  {
    type: "links",
    items: [
      { label: "Account seller guidelines", href: "https://support.eldorado.gg/en/articles/13859407-account-seller-guidelines" },
      { label: "Currency seller guidelines", href: "https://support.eldorado.gg/en/articles/13859413-currency-seller-guidelines" },
      { label: "Item seller guidelines", href: "https://support.eldorado.gg/en/articles/13859389-item-seller-guidelines" },
      { label: "Boosting seller guidelines", href: "https://support.eldorado.gg/en/articles/13859412-boosting-seller-guidelines" },
      { label: "Gift card seller guidelines", href: "https://support.eldorado.gg/en/articles/13859409-gift-card-seller-guidelines" },
      { label: "Top up and subscription seller guidelines", href: "https://support.eldorado.gg/en/articles/12032614-top-up-and-subscription-seller-guidelines" },
    ],
  },
  {
    type: "p",
    justify: true,
    segments: ["These rules apply to all categories, including Currency, Accounts, Items, Boosting, Gift cards, and Top ups."],
  },
  {
    type: "h2",
    id: "h_888aa7be53",
    text: "Delivering orders",
  },
  {
    type: "ul",
    items: [
      { lead: "On-time delivery: ", segments: ["deliver orders within the guaranteed delivery time. If you're often late or don't deliver, we may remove your offers."] },
      { lead: "Late or partial delivery: ", segments: ["Get the buyer's approval before delivering late or delivering only part of an order. Without it, the buyer is eligible for a full refund if they raise a dispute."] },
      { lead: "Marking orders as delivered: ", segments: ["only mark an order as delivered once it's fully delivered. If you mark it early, the buyer is eligible for a full refund if they raise a dispute."] },
      {
        lead: "Initial response for orders: ",
        segments: [
          "if your offer has a delivery time of 1 hour or longer, message the buyer within 30 minutes of the order being placed. Confirm youre handling the order and that you can deliver it. ",
          { b: "If theres no communication with the buyer, we may cancel the order." },
          " Messages sent through the seller API may not be enough on their own, so make sure theres a real follow-up in your chat with the buyer.",
        ],
      },
    ],
  },
  { type: "h2", id: "h_177602eb7b", text: "What's prohibited" },
  {
    type: "ul",
    items: [
      { lead: "Scams and fraud. ", segments: ["Any attempt to scam or defraud buyers leads to a permanent suspension. We have a zero-tolerance policy for scams."] },
      { lead: "Age-verified accounts", segments: [" that have completed age verification on any game or platform, regardless of the age group assigned."] },
      { lead: "Outside communication. ", segments: ["Keep all communication with buyers in Eldorado chat. Don't share contact details for other apps (e.g., Discord or Skype). The only exception is boosting orders, where you may need to use voice chat."] },
      { lead: "Advertising. ", segments: ["Don't advertise other websites, including your own shop, other marketplaces, or unrelated sites."] },
      { lead: "External payments. ", segments: ["All payments must go through Eldorado. Don't discuss or arrange other payment methods with buyers."] },
      { lead: "Disrespectful behavior. ", segments: ["Don't use foul language, threats, harassment, or insults with buyers. Stay professional at all times, even during a dispute."] },
    ],
  },
  { type: "h2", id: "h_d9c22283bf", text: "Handling disputes" },
  { type: "p", segments: ["Respond to disputes within these time limits:"] },
  {
    type: "table",
    head: ["Order type", "Respond within", "What to send"],
    rows: [
      ["Accounts, boosting, gift cards or top-ups", "12 hours", "Proof or a solution"],
      ["Currency or items", "2 hours", "Proof of delivery"],
    ],
  },
  {
    type: "p",
    segments: ["If you don't upload proof within 2 hours on a Currency or Items order, the buyer is eligible for a full refund."],
  },
  {
    type: "p",
    segments: ["To avoid disputes on orders pending delivery, upload proof of delivery right after you send the currency or items."],
  },
  { type: "h2", id: "h_361566e7a1", text: "Feedback and fairness" },
  {
    type: "ul",
    items: [
      {
        lead: "Feedback integrity: ",
        segments: [
          "respect buyer feedback. We have strict guidelines on user feedback. Read more in the ",
          { a: "User feedback", href: "https://support.eldorado.gg/en/articles/8409004-user-feedback" },
          " article.",
        ],
      },
      { lead: "Respect for other sellers: ", segments: ["don't demean other sellers or make claims about them without evidence. If this rule is not followed, we may take action against such accounts."] },
    ],
  },
  { type: "h2", id: "h_5611213f2e", text: "Marketplace guidelines" },
  {
    type: "ul",
    items: [
      { lead: "Holding funds: ", segments: ["If we find a problem with your sales, we may hold your Eldorado balance for up to 30 days so we can refund affected buyers. After that, you can withdraw any remaining funds."] },
      { lead: "No random offers: ", segments: ["lotteries, raffles, and random offers or bundles (e.g., 50% chance to get a rare skin) aren't allowed."] },
      { lead: "Realistic pricing: ", segments: ["offers with unrealistic (fake) prices aren't allowed."] },
      { lead: "Correct categories: ", segments: ["list your offers in the right category and game. The only exception is boosting services where the main outcome is items, which can be listed in Items."] },
      { lead: "Impersonation: ", segments: ["don't impersonate other sellers or Eldorado employees. Don't use another seller's logo, branding, or a username that's identical or misleadingly similar to theirs. Don't use the Eldorado name, logo, or branding, including in your username."] },
      {
        lead: "No extra fees: ",
        segments: ["the order price is the full price the buyer pays. You cant add your own fees or deliver less than what the buyer ordered."],
        paras: ["This includes charges like:"],
        nested: [
          "A fee for faster delivery",
          "A fee for tools or services you use to deliver",
          "Any other cost you take out of the delivery or ask the buyer to pay",
        ],
        tail: [
          { lead: "Exception: ", segments: ["When you sell Robux, Robloxs 30% fee is covered by the buyer."] },
        ],
      },
    ],
  },
  { type: "h2", id: "h_3be8f054fc", text: "Requirements for sellers" },
  {
    type: "ul",
    items: [
      { lead: "Age limit: ", segments: ["you must be 18 or older to sell on Eldorado."] },
      { lead: "One account per seller: ", segments: ["don't use multiple accounts. If you work with a team, you can share login details with your partners."] },
    ],
  },
  { type: "h2", id: "h_80317bd49f", text: "Fraudulent practices" },
  {
    type: "ul",
    items: [
      { lead: "Fraudulent delivery methods: ", segments: ["don't use delivery methods that put the buyer at high risk of losing what they bought or putting their game account at risk."] },
      { lead: "Misleading descriptions: ", segments: ["your offer description must match what you deliver. Misleading buyers isn't allowed."] },
    ],
  },
  { type: "h2", id: "h_3767554cc0", text: "Improving your offers" },
  {
    type: "ul",
    items: [
      { lead: "Clear descriptions: ", segments: ["keep your offer title and description clear, short, and relevant. Use up to 2 keywords or keyword variations per offer."] },
      { lead: "No copyrighted images: ", segments: ["don't use copyrighted images from game developers in your offers or profile picture. We may remove offers that include copyrighted content."] },
    ],
  },
];
