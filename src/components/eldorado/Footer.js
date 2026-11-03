import Logo from "./Logo";

const PAY_URL = "https://assetsdelivery.eldorado.gg/v7/_assets_/payments/v11/icons";
const BADGE_URL =
  "https://assetsdelivery.eldorado.gg/v7/_assets_/miscellaneous/v8/google_preferred_source_badge_dark_en.png";

const PAYMENTS = [
  ["PayPal", "paypal"],
  ["Mastercard", "Mastercard"],
  ["AMEX", "Amex"],
  ["Discover", "Discover"],
  ["BTC", "BTC"],
  ["GooglePay", "GooglePay"],
  ["ApplePay", "ApplePay"],
];

const LINK_COLS = [
  {
    bold: true,
    links: [
      ["Help center", "https://support.eldorado.gg"],
      ["Contact us", "/contact-us"],
      ["About us", "/about-us"],
      ["Careers", "https://careers.eldorado.gg/"],
      ["Bug bounty", "/bug-bounty"],
      ["Blog", "/blog/"],
      ["Influencer program", "/influencer-program"],
      ["Become an affiliate", "https://affiliates.eldorado.gg"],
      ["Become a seller", "/become-seller"],
    ],
  },
  {
    bold: false,
    links: [
      ["Account warranty", "https://support.eldorado.gg/en/articles/8408988-account-warranty"],
      ["TradeShield (buying)", "https://support.eldorado.gg/en/articles/8408994-tradeshield-buying"],
      ["TradeShield (selling)", "https://support.eldorado.gg/en/articles/8409006-tradeshield-selling"],
      ["Withdrawals", "https://support.eldorado.gg/en/articles/8409026-withdrawals"],
      ["Account seller rules", "https://support.eldorado.gg/en/articles/8408996-account-seller-rules"],
    ],
  },
  {
    bold: false,
    links: [
      ["Seller rules", "https://support.eldorado.gg/en/articles/8408997-seller-rules"],
      ["Changing username", "https://support.eldorado.gg/en/articles/8409011-changing-username"],
      ["Fees", "https://support.eldorado.gg/en/articles/8409025-fees"],
      ["Refund Policy", "https://support.eldorado.gg/en/articles/8409020-refund-policy"],
    ],
  },
];

const LEGAL_LINKS = [
  ["Terms of Service", "/terms-of-service"],
  ["Privacy Policy", "/privacy-policy"],
  ["DMCA", "/dmca"],
  ["DSA", "/dsa"],
];

const SOCIALS = [
  {
    name: "Reddit",
    href: "https://www.reddit.com/r/EldoradoGG/",
    path: "M14.5 2.5c-.3 0-.5.1-.7.3l-2.6 2.8A8.5 8.5 0 0 0 8 5.5c-2.4 0-4.5.8-5.7 2.1A2.3 2.3 0 0 0 2.3 12c-.1.4-.2.8-.2 1.2 0 3.3 3.4 6 7.6 6s7.6-2.7 7.6-6c0-.4-.1-.8-.2-1.2a2.3 2.3 0 0 0 .1-4.4c.1-.3.1-.6.1-.9 0-1.1-.9-2-2-2-.4 0-.8.2-1.1.4l-2.4-2.6h-.3Zm-.4 1.5 2 2.1c-.1.2-.1.4-.1.6 0 .8.5 1.5 1.2 1.8l-.3 1.5a.6.6 0 0 1-.6.5H7.7a.6.6 0 0 1-.6-.5l-.3-1.5c.7-.3 1.2-1 1.2-1.8 0-.2 0-.4-.1-.6l2.1-2.1h4.1ZM8 8.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm5.5 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2ZM9.5 12h3v.5c0 1-.7 1.5-1.5 1.5s-1.5-.5-1.5-1.5V12Z",
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@eldoradogg1",
    path: "M16.6 3c.3 1.7 1.4 3.1 3.4 3.3v2.9c-1.3 0-2.5-.4-3.4-1v5.6c0 3.4-2.3 5.7-5.4 5.7A5.2 5.2 0 0 1 6 14.2c0-3 2.3-5.3 5.4-5.2v3c-.3-.1-.6-.1-.9-.1-1.3.1-2.2 1.1-2.1 2.4.1 1.2 1.1 2.2 2.4 2.2 1.4 0 2.4-1 2.4-2.6V3h3.4Z",
  },
  {
    name: "Twitter",
    href: "https://x.com/EldoradoGg",
    path: "M19.6 5.9c-.6.3-1.2.4-1.9.5.7-.4 1.2-1 1.4-1.8-.6.4-1.3.6-2.1.8a3.3 3.3 0 0 0-5.7 2.3c0 .3 0 .5.1.8a9.3 9.3 0 0 1-6.8-3.4 3.3 3.3 0 0 0 1 4.4c-.5 0-1-.2-1.5-.4 0 1.6 1.1 2.9 2.6 3.2-.3.1-.6.1-.9.1l-.6-.1a3.3 3.3 0 0 0 3.1 2.3A6.6 6.6 0 0 1 4 15.9a9.3 9.3 0 0 0 5 1.5c6 0 9.3-5 9.3-9.3v-.4c.6-.5 1.2-1.1 1.6-1.8h.3Z",
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/eldoradogg.official/",
    path: "M13.5 21v-7h2.4l.4-2.8h-2.8V9.4c0-.8.2-1.4 1.4-1.4h1.5V5.5c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2h-2.4V14h2.4v7h3Z",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/eldoradogg_official/",
    path: "M11 4c1.9 0 2.2 0 3 .1.8 0 1.3.2 1.7.3.5.2.8.4 1.2.8.4.4.6.7.8 1.2.1.4.3.9.3 1.7.1.8.1 1.1.1 3s0 2.2-.1 3c0 .8-.2 1.3-.3 1.7-.2.5-.4.8-.8 1.2-.4.4-.7.6-1.2.8-.4.1-.9.3-1.7.3-.8.1-1.1.1-3 .1s-2.2 0-3-.1c-.8 0-1.3-.2-1.7-.3-.5-.2-.8-.4-1.2-.8-.4-.4-.6-.7-.8-1.2-.1-.4-.3-.9-.3-1.7-.1-.8-.1-1.1-.1-3s0-2.2.1-3c0-.8.2-1.3.3-1.7.2-.5.4-.8.8-1.2.4-.4.7-.6 1.2-.8.4-.1.9-.3 1.7-.3.8-.1 1.1-.1 3-.1Zm0 1.8c-1.9 0-2.1 0-2.9.1-.7 0-1.1.1-1.4.2-.3.1-.6.3-.8.5-.2.2-.4.5-.5.8-.1.3-.2.7-.2 1.4-.1.8-.1 1-.1 2.9s0 2.1.1 2.9c0 .7.1 1.1.2 1.4.1.3.3.6.5.8.2.2.5.4.8.5.3.1.7.2 1.4.2.8.1 1 .1 2.9.1s2.1 0 2.9-.1c.7 0 1.1-.1 1.4-.2.3-.1.6-.3.8-.5.2-.2.4-.5.5-.8.1-.3.2-.7.2-1.4.1-.8.1-1 .1-2.9s0-2.1-.1-2.9c0-.7-.1-1.1-.2-1.4-.1-.3-.3-.6-.5-.8a2 2 0 0 0-.8-.5c-.3-.1-.7-.2-1.4-.2-.8-.1-1-.1-2.9-.1Zm0 2.9a3.9 3.9 0 1 1 0 7.8 3.9 3.9 0 0 1 0-7.8Zm0 1.8a2.1 2.1 0 1 0 0 4.2 2.1 2.1 0 1 0 0-4.2Zm4.1-3a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8Z",
  },
  {
    name: "Youtube",
    href: "https://www.youtube.com/@Eldorado.gg_Official",
    path: "M19.6 7.2a2 2 0 0 0-1.4-1.4C16.9 5.4 11 5.4 11 5.4s-5.9 0-7.2.4A2 2 0 0 0 2.4 7.2 21 21 0 0 0 2 11c0 1.3.1 2.6.4 3.8a2 2 0 0 0 1.4 1.4c1.3.4 7.2.4 7.2.4s5.9 0 7.2-.4a2 2 0 0 0 1.4-1.4c.3-1.2.4-2.5.4-3.8s-.1-2.6-.4-3.8ZM9.2 13.7V8.3l4.8 2.7-4.8 2.7Z",
  },
];

function GlobeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="min-h-[330px] rounded-t-lg bg-ink text-white">
      <div className="mx-auto w-full max-w-[1208px] px-4 md:px-6">
        {/* payments + language */}
        <div className="flex flex-col items-start gap-6 pt-6 md:flex-row md:items-center md:justify-between md:gap-6">
          <div className="flex flex-wrap items-center gap-2.5">
            {PAYMENTS.map(([alt, slug]) => (
              <img
                key={slug}
                src={`${PAY_URL}/${slug}-Dark.svg`}
                alt={alt}
                loading="lazy"
                className="h-7 w-[42px]"
              />
            ))}
            <span className="ml-1 text-sm leading-normal text-footlink">+15 more</span>
          </div>
          <button
            type="button"
            className="flex h-9 items-center gap-1.5 rounded-lg bg-darkbtn px-4 text-sm leading-[21px]"
          >
            <GlobeIcon />
            <span>
              English <span className="opacity-60">|</span> EUR - €
            </span>
          </button>
        </div>

        {/* brand + 3 link columns (4-col grid per reference) */}
        <div className="mb-[72px] grid grid-cols-1 gap-6 pt-[54px] sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex max-w-[255px] flex-col gap-6">
            <a href="/" aria-label="Eldorado logo">
              <Logo color="#FFFFFF" />
            </a>
            <p className="text-base leading-normal text-white">
              Join us today to level up your gaming experience.
            </p>
            <div className="flex items-center gap-4">
              {SOCIALS.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  aria-label={s.name}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-brand"
                >
                  <svg width="24" height="24" viewBox="0 0 22 24" fill="currentColor" aria-hidden="true">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
            <a
              href="https://google.com/preferences/source?q=eldorado.gg&utm_source=marketplace&utm_medium=cta&utm_campaign=google_preferred_src&utm_content=footer"
              aria-label="Add as preferred source on Google"
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit"
            >
              <img
                src={BADGE_URL}
                alt="Add as preferred source on Google"
                loading="lazy"
                className="h-11 w-[140px]"
              />
            </a>
          </div>

          {LINK_COLS.map((col, i) => (
            <ul key={i} className="flex flex-col gap-4">
              {col.links.map(([label, href]) => (
                <li key={label}>
                  <a
                    href={href}
                    className={`text-sm leading-6 text-footlink hover:text-white ${
                      col.bold ? "font-bold" : ""
                    }`}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          ))}
        </div>

        {/* legal bar */}
        <div className="flex flex-wrap items-center gap-4 pt-4 pb-4 text-footlink">
          <span className="leading-normal">
            © 2026. The eldorado.gg website is operated by GWD Processing FZCO.
          </span>
          {LEGAL_LINKS.map(([label, href]) => (
            <a key={label} href={href} className="hover:text-white">
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
