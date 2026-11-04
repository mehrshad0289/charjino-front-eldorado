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
  collectionIcon: `${A}682f43237060dae7ed11ec4ee78f0d38af343fd0.svg?generation=1793817186867872&alt=media`,
  breadcrumbChevron: `${A}608afd642560f128df4d005c33bd181cae2939c6.svg?generation=1793817186863811&alt=media`,
  breadcrumbCurrent: `${A}8c12185dfb8422cc5d6138e42e476247c9943f76.svg?generation=1793817186961616&alt=media`,
  copyLlm: `${A}dfcb3d941f6a401a5164ce0ea4612ff98c5a034e.svg?generation=1793817186908860&alt=media`,
  feedbackUp: `${A}3e0f06e31a8c9531f264b364b2a9bd0bf9a3bf6e.svg?generation=1793817187037779&alt=media`,
  feedbackDown: `${A}f356da91af849182535fd9cc52dfd7a7acef6745.svg?generation=1793817187012201&alt=media`,
};

// Docs-nav accordion tree; `expanded` collections render their articles,
// `active` marks the current article (blue + 2px left bar per the capture).
export const SUPPORT_NAV = [
  {
    label: "Getting started",
    expanded: false,
    href: "https://support.eldorado.gg/en/collections/6253613-getting-started",
    articles: [],
  },
  {
    label: "Buying",
    expanded: true,
    href: "https://support.eldorado.gg/en/collections/6253609-buying",
    articles: [
      { label: "Buying and receiving orders", href: "https://support.eldorado.gg/en/collections/6253610-buying-and-receiving-orders" },
      { label: "Payments", href: "https://support.eldorado.gg/en/collections/6253611-payments" },
    ],
  },
  {
    label: "Selling",
    expanded: true,
    href: "https://support.eldorado.gg/en/collections/6253612-selling",
    articles: [
      {
        label: "Seller verification",
        collection: true,
        expanded: true,
        href: "https://support.eldorado.gg/en/collections/19683298-seller-verification",
        children: [
          { label: "Seller verification guide", href: "https://support.eldorado.gg/en/articles/8408998-seller-verification-guide" },
          { label: "Additional verification for restricted seller categories", href: "https://support.eldorado.gg/en/articles/19683299-additional-verification" },
          { label: "Supported documents for verification", href: "https://support.eldorado.gg/en/articles/13859403-supported-documents" },
          { label: "Which countries are eligible to sell on Eldorado?", href: "https://support.eldorado.gg/en/articles/8409002-eligible-countries" },
        ],
      },
      {
        label: "Rules and guidelines",
        collection: true,
        expanded: true,
        href: "https://support.eldorado.gg/en/collections/19683304-rules-and-guidelines",
        children: [
          { label: "Seller rules", href: "https://support.eldorado.gg/en/articles/8408997-seller-rules", active: true },
          { label: "Account seller rules", href: "https://support.eldorado.gg/en/articles/8408996-account-seller-rules" },
          { label: "Account seller guidelines", href: "https://support.eldorado.gg/en/articles/13859407-account-seller-guidelines" },
          { label: "Gift card seller guidelines", href: "https://support.eldorado.gg/en/articles/13859409-gift-card-seller-guidelines" },
          { label: "Top up and subscription seller guidelines", href: "https://support.eldorado.gg/en/articles/12032614-top-up-and-subscription-seller-guidelines" },
          { label: "Item seller guidelines", href: "https://support.eldorado.gg/en/articles/13859389-item-seller-guidelines" },
          { label: "Boosting seller guidelines", href: "https://support.eldorado.gg/en/articles/13859412-boosting-seller-guidelines" },
          { label: "Currency seller guidelines", href: "https://support.eldorado.gg/en/articles/13859413-currency-seller-guidelines" },
          { label: "Duplicate offers", href: "https://support.eldorado.gg/en/articles/8409000-duplicate-offers" },
          { label: "Keyword rules FAQ", href: "https://support.eldorado.gg/en/articles/8409001-keyword-rules-faq" },
        ],
      },
      { label: "Selling and managing offers", collection: true, expanded: false, href: "https://support.eldorado.gg/en/collections/19683305-selling-and-managing-offers", children: [] },
      { label: "Automated delivery", collection: true, expanded: false, href: "https://support.eldorado.gg/en/collections/19683306-automated-delivery", children: [] },
      { label: "Ranking system and user feedback", collection: true, expanded: false, href: "https://support.eldorado.gg/en/collections/19683307-ranking-system", children: [] },
      { label: "Fees and withdrawals", collection: true, expanded: false, href: "https://support.eldorado.gg/en/collections/19683308-fees-and-withdrawals", children: [] },
      { label: "Refunds and protection", collection: true, expanded: false, href: "https://support.eldorado.gg/en/collections/19683309-refunds-and-protection", children: [] },
      { label: "Eldorado account", collection: true, expanded: false, href: "https://support.eldorado.gg/en/collections/19683310-eldorado-account", children: [] },
      { label: "Game guides", collection: true, expanded: false, href: "https://support.eldorado.gg/en/collections/19683311-game-guides", children: [] },
    ],
  },
];

export const SUPPORT_ARTICLE = {
  breadcrumb: [
    { label: "All Collections", href: "https://support.eldorado.gg/en/" },
    { label: "Selling", href: "https://support.eldorado.gg/en/collections/6253612-selling" },
    { label: "Rules and guidelines", href: "https://support.eldorado.gg/en/collections/19683304-rules-and-guidelines" },
  ],
  current: "Seller rules",
  title: "Seller rules",
  description: "Prepare to sell on Eldorado by learning about the seller rules.",
  updated: "Updated over a week ago",
  toc: [
    "Delivering orders",
    "What's prohibited",
    "Handling disputes",
    "Feedback and fairness",
    "Marketplace guidelines",
    "Requirements for sellers",
  ],
  related: [
    { label: "Start selling", href: "https://support.eldorado.gg/en/articles/8409007-start-selling" },
    { label: "Top up and subscription seller guidelines", href: "https://support.eldorado.gg/en/articles/12032614-top-up-and-subscription-seller-guidelines" },
    { label: "Item seller guidelines", href: "https://support.eldorado.gg/en/articles/13859389-item-seller-guidelines" },
  ],
};

// Article body blocks. Segment model: string = plain text,
// {b} = bold lead, {a,label} = blue underlined link.
export const SELLER_RULES_BODY = [
  {
    type: "p",
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
    segments: ["These rules apply to all categories, including Currency, Accounts, Items, Boosting, Gift cards, and Top ups."],
  },
  {
    type: "h2",
    id: "delivering-orders",
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
          "if your offer has a delivery time of 1 hour or longer, message the buyer within 30 minutes of the order being placed. Confirm youre handling the order and that you can deliver it. If theres no communication with the buyer, we may cancel the order. ",
          { b: "Messages sent through the seller API may not be enough on their own, so make sure theres a real follow-up in your chat with the buyer." },
        ],
      },
    ],
  },
  { type: "h2", id: "whats-prohibited", text: "What's prohibited" },
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
  { type: "h2", id: "handling-disputes", text: "Handling disputes" },
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
  { type: "h2", id: "feedback-and-fairness", text: "Feedback and fairness" },
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
  { type: "h2", id: "marketplace-guidelines", text: "Marketplace guidelines" },
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
        segments: [
          "the order price is the full price the buyer pays. You cant add your own fees or deliver less than what the buyer ordered. ",
          { b: "This includes charges like:" },
        ],
        nested: [
          "A fee for faster delivery",
          "A fee for tools or services you use to deliver",
          "Any other cost you take out of the delivery or ask the buyer to pay",
        ],
      },
      {
        lead: "Exception: ",
        segments: ["When you sell Robux, Robloxs 30% fee is covered by the buyer."],
      },
    ],
  },
  { type: "h2", id: "requirements-for-sellers", text: "Requirements for sellers" },
  {
    type: "ul",
    items: [
      { lead: "Age limit: ", segments: ["you must be 18 or older to sell on Eldorado."] },
      { lead: "One account per seller: ", segments: ["don't use multiple accounts. If you work with a team, you can share login details with your partners."] },
    ],
  },
  { type: "h2", id: "fraudulent-practices", text: "Fraudulent practices" },
  {
    type: "ul",
    items: [
      { lead: "Fraudulent delivery methods: ", segments: ["don't use delivery methods that put the buyer at high risk of losing what they bought or putting their game account at risk."] },
      { lead: "Misleading descriptions: ", segments: ["your offer description must match what you deliver. Misleading buyers isn't allowed."] },
    ],
  },
  { type: "h2", id: "improving-your-offers", text: "Improving your offers" },
  {
    type: "ul",
    items: [
      { lead: "Clear descriptions: ", segments: ["keep your offer title and description clear, short, and relevant. Use up to 2 keywords or keyword variations per offer."] },
      { lead: "No copyrighted images: ", segments: ["don't use copyrighted images from game developers in your offers or profile picture. We may remove offers that include copyrighted content."] },
    ],
  },
];
