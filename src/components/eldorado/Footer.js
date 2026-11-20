import Link from "next/link";
import EnamadSeal from "./EnamadSeal";
import Logo from "./Logo";
import {
  SUPPORT_BUYER_PROTECTION,
  SUPPORT_CHANGE_GAME_EMAIL,
  SUPPORT_HOME,
  SUPPORT_RECEIVE_DETAILS,
  SUPPORT_SELLER_RULES,
  SUPPORT_SELLER_WALLET,
} from "./data/supportData";

const INSTAGRAM = "https://www.instagram.com/charjino_24/";
const TELEGRAM = "https://t.me/charjino_24";

const LINK_COLS = [
  {
    bold: true,
    links: [
      ["مرکز راهنما", SUPPORT_HOME],
      ["تماس با ما", "/contact-us"],
      ["درباره ما", "/about-us"],
      ["وبلاگ", "/blog"],
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
  ["شرایط استفاده", "/terms-of-service"],
  ["حریم خصوصی", "/privacy-policy"],
  ["قانون حق نشر", "/dmca"],
  // ["قانون خدمات دیجیتال", "/dsa"],
];

const SOCIALS = [
  { name: "اینستاگرام", href: INSTAGRAM, src: "/icons/social/instagram-icon.svg" },
  { name: "تلگرام", href: TELEGRAM, src: "/icons/social/telegram-icon.svg" },
  { name: "تیک‌تاک", href: INSTAGRAM, src: "/icons/social/tiktok-icon.svg" },
  { name: "ایکس", href: INSTAGRAM, src: "/icons/social/twitter-icon.svg" },
  { name: "فیسبوک", href: INSTAGRAM, src: "/icons/social/facebook-icon.svg" },
  { name: "یوتیوب", href: INSTAGRAM, src: "/icons/social/youtube-icon.svg" },
];

export default function Footer() {
  return (
    <footer className="min-h-[330px] rounded-t-lg bg-ink text-white">
      <div className="mx-auto w-full max-w-[1208px] px-4 md:px-6">
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
            <EnamadSeal />
          </div>

          {LINK_COLS.map((col, i) => (
            <ul key={i} className="flex flex-col gap-4">
              {col.links.map(([label, href]) => (
                <li key={label}>
                  <Link
                    href={href}
                    prefetch
                    className={`text-sm leading-6 text-footlink hover:text-white ${
                      col.bold ? "font-bold" : ""
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 pb-4 text-footlink">
          <span className="whitespace-normal leading-[19.2px] lg:whitespace-nowrap">
            © ۲۰۲۶. وب‌سایت charjino.ir توسط شارژینو اداره می‌شود.
          </span>
          <ul className="flex flex-wrap items-center gap-6">
            {LEGAL_LINKS.map(([label, href]) => (
              <li key={label} className="list-none">
                <Link href={href} prefetch className="leading-[19.2px] hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
