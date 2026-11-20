import { toFaDigits } from "../../lib/fa-digits";
import {
  SUPPORT_BUYER_PROTECTION,
  SUPPORT_CHANGE_GAME_EMAIL,
  SUPPORT_HOME,
  SUPPORT_RECEIVE_DETAILS,
  SUPPORT_SELLER_RULES,
  SUPPORT_SELLER_WALLET,
} from "./data/supportData";

const ASSET =
  "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F";

const INSTAGRAM = "https://www.instagram.com/charjino_24/";
const TELEGRAM = "https://t.me/charjino_24";

const PAYMENTS = [
  ["Visa", "980c1fc10e7a8a10040260c05a3a59c22c038a96.svg?generation=1793788935074541&alt=media", false],
  ["Mastercard", "90889b8bf95334df24405c14c80ef147af400941.svg?generation=1793788935053731&alt=media", false],
  ["Amex", "98d7917bc80c12f5da202a56f9e5b1a3b559a326.svg?generation=1793788935073365&alt=media", false],
  ["Discover", "a610ca7b4d1195b82ccb773a63d613de9479af15.svg?generation=1793788935189169&alt=media", false],
  ["Bitcoin", "739f354c80f683de4f60f3dbeb6934658bd9bc28.svg?generation=1793788935206591&alt=media", true],
  ["Google Pay", "0f86b63e2e102de961ee26953929f404d8fd24e8.svg?generation=1793788935210602&alt=media", true],
  ["Apple Pay", "6aff6758f7dfdf1dd9c08c430a03353f4ea26425.svg?generation=1793788935249061&alt=media", true],
];

const SOCIALS = [
  ["اینستاگرام", INSTAGRAM, "/icons/social/instagram-icon.svg"],
  ["تلگرام", TELEGRAM, "/icons/social/telegram-icon.svg"],
  ["تیک‌تاک", INSTAGRAM, "/icons/social/tiktok-icon.svg"],
  ["ایکس", INSTAGRAM, "/icons/social/twitter-icon.svg"],
  ["فیسبوک", INSTAGRAM, "/icons/social/facebook-icon.svg"],
  ["یوتیوب", INSTAGRAM, "/icons/social/youtube-icon.svg"],
];

const MARKET_LINKS = [
  ["مرکز راهنما", SUPPORT_HOME],
  ["تماس با ما", "/contact-us"],
  ["درباره ما", "/about-us"],
  ["باگ‌بانتی", "/bug-bounty"],
  ["بلاگ", "/blog"],
  ["فروشنده شو", "/become-seller"],
];

const TRADING_LINKS = [
  ["دریافت مشخصات اکانت", SUPPORT_RECEIVE_DETAILS],
  ["تعویض ایمیل اکانت بازی", SUPPORT_CHANGE_GAME_EMAIL],
  ["حفاظت خریدار", SUPPORT_BUYER_PROTECTION],
  ["کیف پول فروشنده", SUPPORT_SELLER_WALLET],
];

const SELLING_LINKS = [
  ["قوانین فروشنده", SUPPORT_SELLER_RULES],
  ["سفارش‌های خرید", "/dashboard/orders/purchased"],
  ["سفارش‌های فروش", "/dashboard/orders/sold"],
  ["کیف پول", "/dashboard/wallet"],
];

const LEGAL_LINKS = [
  ["شرایط استفاده", "/terms-of-service"],
  ["حریم خصوصی", "/privacy-policy"],
  ["قانون حق نشر", "/dmca"],
  ["قانون خدمات دیجیتال", "/dsa"],
];

function LinkColumn({ links, bold }) {
  return (
    <div className="grow basis-0 max-md:basis-full">
      <ul>
        {links.map(([label, href], i) => (
          <li
            className={`list-none leading-[19.2px] ${i < links.length - 1 ? "mb-[16px]" : ""}`}
            key={`${href}-${label}`}
          >
            <a
              className={`inline-flex text-[16px] text-[rgb(137,138,147)] ${bold ? "font-bold" : ""}`}
              href={href}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function BlogFooter() {
  return (
    <footer className="relative z-[50] bg-[rgb(20,19,26)] pt-6 pb-6">
      <div className="relative z-[10] mx-auto w-full max-w-[1240px] pe-6 ps-6 max-md:pe-4 max-md:ps-4">
        <div className="mb-[56px]">
          <ul className="flex flex-wrap items-center">
            {PAYMENTS.map(([alt, asset, hideMobile]) => (
              <li
                className={`list-none me-[10px] text-[14px] leading-[16.8px] text-[rgb(137,138,147)] ${hideMobile ? "max-md:hidden" : ""}`}
                key={alt}
              >
                <img alt={alt} className="inline-block max-w-full align-middle" src={ASSET + asset} />
              </li>
            ))}
            <li className="list-none text-[14px] leading-[16.8px] text-[rgb(137,138,147)]">
              + {toFaDigits(15)} مورد دیگر
            </li>
          </ul>
        </div>

        <div className="mb-[60px] flex flex-wrap gap-[24px]">
          <div className="grow basis-0 max-w-[264px] pe-[10px] max-md:max-w-full max-md:basis-full">
            <div className="mb-[30px]">
              <a href="/blog">
                <img
                  alt="شارژینو"
                  className="inline-block max-w-full align-middle"
                  src={`${ASSET}d240ce3437163ca9744612cbf30d4a9e2abc14e6.svg?generation=1793788935212784&alt=media`}
                />
              </a>
            </div>
            <div className="mb-[30px] max-w-3xs leading-[19.2px]">
              همین امروز بپیوندید و تجربهٔ بازی‌تان را بالا ببرید.
            </div>
            <div>
              <ul className="flex flex-wrap">
                {SOCIALS.map(([alt, href, asset], i) => (
                  <li className={`list-none ${i < SOCIALS.length - 1 ? "me-[14px]" : ""}`} key={alt}>
                    <a href={href} rel="noopener noreferrer" target="_blank">
                      <img
                        alt={alt}
                        className="inline-block size-[24px] max-w-full align-middle"
                        src={asset}
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-[30px]">
              <a
                aria-label="منبع پیشنهادی گوگل"
                className="inline-block leading-[0]"
                href="https://google.com/preferences/source"
              >
                <img
                  alt="منبع پیشنهادی گوگل"
                  className="block max-w-full align-middle"
                  height="44"
                  src={`${ASSET}e9a7f0330722bf360ea9e07aebed0e488b5b9766.png?generation=1791269821921466&alt=media`}
                  width="140"
                />
              </a>
            </div>
          </div>
          <LinkColumn bold links={MARKET_LINKS} />
          <LinkColumn links={TRADING_LINKS} />
          <LinkColumn links={SELLING_LINKS} />
        </div>

        <div className="flex flex-wrap items-center">
          <div className="me-[24px] whitespace-nowrap text-[rgb(137,138,147)] leading-[19.2px] max-lg:whitespace-normal">
            © ۲۰۲۶. وب‌سایت charjino.ir توسط شارژینو اداره می‌شود.
          </div>
          <div className="ms-auto">
            <ul className="flex flex-wrap">
              {LEGAL_LINKS.map(([label, href], i) => (
                <li
                  className={`list-none leading-[19.2px] ${i < LEGAL_LINKS.length - 1 ? "me-[24px]" : ""}`}
                  key={href}
                >
                  <a className="inline-flex text-[rgb(137,138,147)]" href={href}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
