import Link from "next/link";
import Logo from "./Logo";
import {
  SUPPORT_BUYER_PROTECTION,
  SUPPORT_CHANGE_GAME_EMAIL,
  SUPPORT_HOME,
  SUPPORT_RECEIVE_DETAILS,
  SUPPORT_SELLER_RULES,
  SUPPORT_SELLER_WALLET,
} from "./data/supportData";

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
      ["مرکز راهنما", SUPPORT_HOME],
      ["تماس با ما", "/contact-us"],
      ["درباره ما", "/about-us"],
      ["وبلاگ", "/blog/"],
      ["فروشنده شو", "/become-seller"],
    ],
  },
  {
    bold: false,
    links: [
      ["دریافت مشخصات اکانت", SUPPORT_RECEIVE_DETAILS],
      ["تعویض ایمیل اکانت بازی", SUPPORT_CHANGE_GAME_EMAIL],
      ["حفاظت خریدار", SUPPORT_BUYER_PROTECTION],
      ["کیف پول فروشنده", SUPPORT_SELLER_WALLET],
      ["قوانین فروشنده", SUPPORT_SELLER_RULES],
    ],
  },
  {
    bold: false,
    links: [
      ["سفارش‌های خرید", "/dashboard/orders/purchased"],
      ["سفارش‌های فروش", "/dashboard/orders/sold"],
      ["کیف پول", "/dashboard/wallet"],
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
  { name: "Reddit", href: "https://www.reddit.com/r/EldoradoGG/", src: "/icons/social/reddit-icon.svg" },
  { name: "TikTok", href: "https://www.tiktok.com/@eldoradogg1", src: "/icons/social/tiktok-icon.svg" },
  { name: "Twitter", href: "https://x.com/EldoradoGg", src: "/icons/social/twitter-icon.svg" },
  { name: "Facebook", href: "https://www.facebook.com/eldoradogg.official/", src: "/icons/social/facebook-icon.svg" },
  { name: "Instagram", href: "https://www.instagram.com/eldoradogg_official/", src: "/icons/social/instagram-icon.svg" },
  { name: "Youtube", href: "https://www.youtube.com/@Eldorado.gg_Official", src: "/icons/social/youtube-icon.svg" },
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

export default function Footer({ showLang = true }) {
  return (
    <footer className="min-h-[330px] rounded-t-lg bg-ink text-white">
      <div className="mx-auto w-full max-w-[1208px] px-4 md:px-6">
        {/* payments + language — the blog footer has no language selector
            (blog capture + live /blog verified 2026-11-04), hence showLang */}
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
          {showLang && (
            <button
              type="button"
              className="flex h-9 items-center gap-1.5 rounded-lg bg-darkbtn px-4 text-sm leading-[21px]"
            >
              <GlobeIcon />
              <span>
                فارسی <span className="opacity-60">|</span> تومان
              </span>
            </button>
          )}
        </div>

        {/* brand + 3 link columns (4-col grid per reference) */}
        <div className="mb-[72px] grid grid-cols-1 gap-6 pt-[54px] sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex max-w-[255px] flex-col gap-6">
            <Link href="/" aria-label="شارژینو">
              <Logo color="#FFFFFF" />
            </Link>
            <p className="text-base leading-normal text-white">
              همین امروز بپیوندید و تجربهٔ بازی‌تان را بالا ببرید.
            </p>
            <div className="flex items-center gap-4">
              {SOCIALS.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  aria-label={s.name}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-100 hover:opacity-80"
                >
                  <img src={s.src} alt="" width={24} height={24} className="block size-6" />
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

        {/* legal bar — copyright left, legal links right (article capture:
            `flex items-center` row, copyright whitespace-nowrap mr-[24px],
            links ul ml-auto mr-[24px] each; live /blog + article both split) */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 pb-4 text-footlink">
          <span className="whitespace-normal lg:whitespace-nowrap leading-[19.2px]">
            © 2026. The eldorado.gg website is operated by GWD Processing FZCO.
          </span>
          <ul className="flex flex-wrap items-center gap-6">
            {LEGAL_LINKS.map(([label, href]) => (
              <li key={label} className="list-none">
                <a href={href} className="leading-[19.2px] hover:text-white">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
