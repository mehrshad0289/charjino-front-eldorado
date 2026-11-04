/* Blog landing footer (blog .make capture footer verbatim + live probes,
   session 12). Deliberately NOT the shared marketplace Footer — the blog
   footer differs (verified live + capture):
   - NO language switcher (live blog footer has none; the marketplace
     Footer renders an "English | EUR" pill — removed here)
   - title-case link texts ("Help Center", "Become a Partner", …) vs the
     marketplace sentence case + "Influencer program"
   - 16px links with li mb-[16px] / lh 19.2px (live probe: fs 16px)
   - container max-w-[1240px] (live footerInner w=1240 vs marketplace 1208)
   - payment icons render at their natural 42×28 (live probe), socials 24×24,
     footer wordmark 164×40 (svg intrinsic), Google preferred-source badge
     140×44 (capture style; png intrinsic 676×213, same aspect)
   - container px-4 <768 (live footerCont px-16px @390)
   Mobile: columns stack (basis-full <768), copyright wraps (live @390). */

const ASSET =
  "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F";

const PAYMENTS = [
  ["Visa", "980c1fc10e7a8a10040260c05a3a59c22c038a96.svg?generation=1793788935074541&alt=media", false],
  ["Mastercard", "90889b8bf95334df24405c14c80ef147af400941.svg?generation=1793788935053731&alt=media", false],
  ["Amex", "98d7917bc80c12f5da202a56f9e5b1a3b559a326.svg?generation=1793788935073365&alt=media", false],
  ["Discover", "a610ca7b4d1195b82ccb773a63d613de9479af15.svg?generation=1793788935189169&alt=media", false],
  /* live @390 hides the last three icons (footer shows Visa/MC/Amex/Discover
     + "15 more" in one row) — hidden <768, shown ≥768 like the capture */
  ["Bitcoin", "739f354c80f683de4f60f3dbeb6934658bd9bc28.svg?generation=1793788935206591&alt=media", true],
  ["Google Pay", "0f86b63e2e102de961ee26953929f404d8fd24e8.svg?generation=1793788935210602&alt=media", true],
  ["Apple Pay", "6aff6758f7dfdf1dd9c08c430a03353f4ea26425.svg?generation=1793788935249061&alt=media", true],
];

const SOCIALS = [
  ["Reddit URL", "https://www.reddit.com/r/EldoradoGG/", "24c0ea50e8b2ee2b3392d3f45301ba2105fdbd49.svg?generation=1793788935217117&alt=media"],
  ["TikTok URL", "https://www.tiktok.com/@eldoradogg1", "eab55aff40f0afb3c27cc158f9da02fd043b4c64.svg?generation=1793788935244284&alt=media"],
  ["X URL", "https://x.com/EldoradoGg", "825ef0d4ee29edd42832a3226c36356d2e026741.svg?generation=1793788935241489&alt=media"],
  ["Instagram URL", "https://www.instagram.com/eldoradogg_official/", "fe82ec5524f351595f78d64848079548d99fac94.svg?generation=1793788935242257&alt=media"],
  ["Facebook URL", "https://www.facebook.com/people/EldoradoGg/61574942990991/", "10498d44aae78ff288510c905c85512c7de46799.svg?generation=1793788935245279&alt=media"],
  ["Youtube URL", "https://www.youtube.com/@Eldorado.gg_Official", "35deca371d795df3f7f8dcc8ba44e98e76acae9a.svg?generation=1793788935372136&alt=media"],
];

/* Column links verbatim from the capture (title case). First column is
   font-bold (capture), the support columns are regular. */
const MARKET_LINKS = [
  ["Help Center", "https://support.eldorado.gg/en"],
  ["Contact Us", "https://www.eldorado.gg/contact-us"],
  ["About Us", "https://www.eldorado.gg/about-us"],
  ["Careers", "https://careers.eldorado.gg/"],
  ["Bug Bounty", "https://www.eldorado.gg/bug-bounty"],
  ["Blog", "https://www.eldorado.gg/blog"],
  ["Become a Partner", "https://www.eldorado.gg/work-with-us"],
  ["Become an Affiliate", "https://affiliates.eldorado.gg/"],
  ["Become a Seller", "https://www.eldorado.gg/become-seller"],
];

const TRADING_LINKS = [
  ["Account Warranty", "https://support.eldorado.gg/en/articles/8408988-account-warranty"],
  ["TradeShield (Buying)", "https://support.eldorado.gg/en/articles/8408994-tradeshield-buying"],
  ["TradeShield (Selling)", "https://support.eldorado.gg/en/articles/8409006-tradeshield-selling"],
  ["Withdrawals", "https://support.eldorado.gg/en/articles/8409026-seller-withdrawals"],
  ["Account Seller Rules", "https://support.eldorado.gg/en/articles/8408996-account-seller-rules"],
];

const SELLING_LINKS = [
  ["Seller Rules", "https://support.eldorado.gg/en/articles/8408997-seller-rules"],
  ["Changing Username", "https://support.eldorado.gg/en/articles/8409011-username-setup"],
  ["Fees", "https://support.eldorado.gg/en/articles/8409025-seller-fees"],
  ["Refund Policy", "https://support.eldorado.gg/en/articles/8409020-refund-return-policy"],
];

const LEGAL_LINKS = [
  ["Terms of Service", "https://www.eldorado.gg/terms-of-service"],
  ["Privacy Policy", "https://www.eldorado.gg/privacy-policy"],
  ["DMCA", "https://www.eldorado.gg/dmca"],
  ["DSA", "https://www.eldorado.gg/dsa"],
];

function LinkColumn({ links, bold }) {
  return (
    <div className="grow basis-0 max-md:basis-full">
      <ul>
        {links.map(([label, href], i) => (
          <li
            className={`list-none leading-[19.2px] ${i < links.length - 1 ? "mb-[16px]" : ""}`}
            key={href}
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
      <div className="relative z-[10] mx-auto w-full max-w-[1240px] pr-6 pl-6 max-md:pr-4 max-md:pl-4">
        {/* Payment methods */}
        <div className="mb-[56px]">
          <ul className="flex flex-wrap items-center">
            {PAYMENTS.map(([alt, asset, hideMobile]) => (
              <li
                className={`list-none mr-[10px] text-[14px] leading-[16.8px] text-[rgb(137,138,147)] ${hideMobile ? "max-md:hidden" : ""}`}
                key={alt}
              >
                <img alt={alt} className="inline-block max-w-full align-middle" src={ASSET + asset} />
              </li>
            ))}
            <li className="list-none text-[14px] leading-[16.8px] text-[rgb(137,138,147)]">
              + 15 more
            </li>
          </ul>
        </div>

        {/* Link columns */}
        <div className="mb-[60px] flex flex-wrap gap-[24px]">
          <div className="grow basis-0 max-w-[264px] pr-[10px] max-md:max-w-full max-md:basis-full">
            <div className="mb-[30px]">
              <a href="https://www.eldorado.gg/blog/">
                <img
                  alt="https://www.eldorado.gg/blog"
                  className="inline-block max-w-full align-middle"
                  src={`${ASSET}d240ce3437163ca9744612cbf30d4a9e2abc14e6.svg?generation=1793788935212784&alt=media`}
                />
              </a>
            </div>
            <div className="mb-[30px] max-w-3xs leading-[19.2px]">
              Join us today to level up your gaming experience!
            </div>
            <div>
              <ul className="flex flex-wrap">
                {SOCIALS.map(([alt, href, asset], i) => (
                  <li className={`list-none ${i < SOCIALS.length - 1 ? "mr-[14px]" : ""}`} key={href}>
                    <a href={href}>
                      <img
                        alt={alt}
                        className="inline-block size-[24px] max-w-full align-middle"
                        src={ASSET + asset}
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-[30px]">
              <a
                aria-label="Google Preferred Source"
                className="inline-block leading-[0]"
                href="https://google.com/preferences/source"
              >
                <img
                  alt="Google Preferred Source"
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

        {/* Bottom row */}
        <div className="flex flex-wrap items-center">
          <div className="mr-[24px] whitespace-nowrap text-[rgb(137,138,147)] leading-[19.2px] max-lg:whitespace-normal">
            © 2026. The eldorado.gg website is operated by GWD Processing FZCO.
          </div>
          <div className="ml-auto">
            <ul className="flex flex-wrap">
              {LEGAL_LINKS.map(([label, href], i) => (
                <li
                  className={`list-none leading-[19.2px] ${i < LEGAL_LINKS.length - 1 ? "mr-[24px]" : ""}`}
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
