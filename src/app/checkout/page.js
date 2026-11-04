import Footer from "../../components/eldorado/Footer";
import ChatBubble from "../../components/eldorado/ChatBubble";
import TrustpilotStars, {
  TrustpilotLogo,
} from "../../components/eldorado/TrustpilotStars";
import {
  CK_LOGO,
  CK_PRODUCT,
  CK_PAYMENTS,
  CK_SAFE_PAYMENT,
  CK_SUMMARY,
  CK_PAY_BUTTON_BG,
  CK_GUARANTEES,
} from "../../components/eldorado/data/checkoutData";

/* Checkout page (/checkout) — session 19, per the user-pushed capture
   `ui ux/checkout/
   www_eldorauantity_1_category_RequestedBoosting_gameId_142_…make`
   (origin 5e937e0; live URL /checkout?quantity=1&category=
   RequestedBoosting&gameId=142 404-redirects without a cart session, so
   the capture is the ONLY reference). Layout per capture @1920:
   MINIMAL checkout header — white bar min-h-72 with a soft shadow, ONLY
   the Eldorado logo (164×40) inside the 60% column pushed to its right
   edge (justify-end), no site nav/search/avatar; then a 60/40 split:
   LEFT (white, max-w-724 pr-118 pl-4 pt-6): lock-badge + "Secure
   checkout" h1 24 centered; product card (58×58 img, Division Rivals,
   gray meta "Delivery time: 3 days | Current division: Division 9 |
   Platform: PC - Steam | Desired division: Elite | Other options: 1",
   Seller: Joren + teal Online dot + 3 blue chips 100% positive / 7410
   reviews / Verified since 2025, bg rgba(71,131,255,.118)); "Payment
   method" + 7 radio rows (Apple Pay CHECKED with the yellow
   rgb(255,201,80) border; radios + brand logos are the capture's own
   SVG imgs; sublabels: "Pay in one click next time" linkblue, "May take
   up to 10 min" gray); "Safe payment" banner 524×79 (mt-48 mb-100).
   RIGHT (bg-page, max-w-424 pl-14 pr-4 pt-92): Order summary (hairline
   under), Order price 73.34 / Payment fees 6.15 (info icomoon → inline
   SVG) / Loyalty points + 5520 + coin 20×20, "Have a discount code?"
   underlined, hairline, Total: 79.49 (24px, hairline above); black
   Apple-Pay button h-14 max-w-368 rounded-sm (logo = capture's inline
   SVG data URI); 12px ToS/Privacy line (INTERNAL links — the routes
   exist in this clone); Trustpilot row: Excellent + 4.5 stars
   (TrustpilotStars variant=header, green rgb(33,150,83)) + Trustpilot
   logo; 2 guarantee rows (95.3% … / We don't pay the seller …; icomoon
   check glyphs → inline SVGs, documented assumption). Standard Footer +
   ChatBubble. Responsive below 1920 is a documented approximation (the
   live checkout needs a cart session; capture is 1920-only): columns
   stack (summary BELOW the form, DOM order kept), pr-118/pl-14 gutters
   relax to px-4. */

export const metadata = {
  title: "Checkout - Eldorado",
  description: "Secure checkout — complete your Eldorado order.",
};

function LockIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="10.5" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="15.5" r="1.6" fill="currentColor" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-graytext">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 11v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="8" r="1.2" fill="currentColor" />
    </svg>
  );
}

function SellerChipIcon({ name }) {
  const paths = {
    thumb: <path d="M7 10v10H4a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h3Zm2 10h8.5a2 2 0 0 0 2-1.6l1.4-7A2 2 0 0 0 18.9 9H14V5.5A2.5 2.5 0 0 0 11.5 3L9 9.8V20Z" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />,
    star: <path d="m12 3 2.7 5.8 6.3.7-4.7 4.3 1.3 6.2L12 16.9 6.4 20l1.3-6.2L3 9.5l6.3-.7L12 3Z" fill="currentColor" />,
    badge: <path d="M12 2 14.5 4.5H18V8l2.5 2.5L18 13v3.5h-3.5L12 19l-2.5-2.5H6V13l-2.5-2.5L6 8V4.5h3.5L12 2Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />,
  };
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" className="text-linkblue">
      {paths[name]}
    </svg>
  );
}

function GuaranteeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="rgb(20,19,26)" strokeWidth="1.8" />
      <path d="m8.5 12.5 2.3 2.3 4.7-5.3" stroke="rgb(20,19,26)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function CheckoutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-page text-ink">
      {/* Minimal checkout header (capture: no site nav, logo only) */}
      <header className="flex min-h-[72px] w-full bg-card shadow-[rgba(9,9,11,0.05)_0px_2px_4px_0px,_rgba(9,9,11,0.02)_0px_12px_8px_0px]">
        <div className="flex basis-full justify-start pl-4 lg:basis-[60%] lg:justify-end lg:pl-0">
          <div className="flex w-full max-w-[726px] items-center gap-1">
            <a href="/" aria-label="Eldorado logo" className="flex items-center text-[14px] leading-[21px]">
              <div className="flex py-2 pl-4 pr-[15px] lg:pl-6">
                <div className="flex">
                  <div className="h-10 w-[164px] overflow-hidden align-middle">
                    <img src={CK_LOGO} alt="Eldorado" className="block size-full" />
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </header>

      <main className="isolate grow">
        <section className="relative mx-auto flex min-h-[1200px] w-full max-w-full max-lg:flex-col">
          {/* LEFT — form (60%) */}
          <div className="flex basis-full justify-end bg-card pt-6 lg:basis-[60%]">
            <div className="w-full max-w-[724px] px-4 pb-10 pt-0 lg:pl-4 lg:pr-[118px]">
              {/* Secure checkout h1 + product + payment methods */}
              <div className="mb-6 flex flex-col gap-9 border-b-[0.8px] border-cardborder pb-6">
                <div className="flex w-full items-center justify-between gap-[10px]">
                  <div className="rounded-lg bg-badgebg p-[6px] text-ink">
                    <LockIcon />
                  </div>
                  <h1 className="flex w-full justify-center pl-[46px] text-center text-[24px] font-bold leading-[normal]">
                    Secure checkout
                  </h1>
                </div>

                {/* Product card */}
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-3 rounded-xl border-[0.8px] border-cardborder p-3">
                    <div className="flex items-start gap-[10px]">
                      <div className="h-[58px] w-[58px] shrink-0 overflow-hidden rounded-[0.1875rem]">
                        <img alt={CK_PRODUCT.alt} src={CK_PRODUCT.img} className="block h-[58px] w-[58px] object-cover align-middle" />
                      </div>
                      <div className="flex min-h-[58px] w-[calc(100%-68px)] flex-col justify-center gap-2">
                        <div>{CK_PRODUCT.title}</div>
                        <div className="flex flex-wrap text-[14px] leading-[normal] text-graytext">
                          {CK_PRODUCT.meta.map((m, i) => (
                            <span key={m} className="mb-[6px] ml-[3px] inline-flex">
                              {i > 0 ? " | " : ""}
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex grow flex-col items-start justify-center self-stretch">
                        <div>
                          <span className="text-graytext">Seller:</span>
                        </div>
                        <div className="flex flex-wrap justify-between gap-3 self-stretch">
                          <div className="flex gap-2 pb-[2px] pt-[2px]">
                            <span className="block text-[14px] font-bold leading-[19.6px]">{CK_PRODUCT.seller}</span>
                            <div className="flex items-center gap-1">
                              <div className="h-[6px] w-[6px] rounded-full bg-[rgb(0,_228,_201)]" />
                              <span className="block text-[14px] leading-[19.6px]">{CK_PRODUCT.sellerStatus}</span>
                            </div>
                          </div>
                          <div>
                            <div className="flex flex-wrap justify-start gap-2">
                              {CK_PRODUCT.sellerChips.map((chip) => (
                                <div key={chip.label} className="flex h-6 items-center gap-1 rounded-md bg-[rgba(71,_131,_255,_0.118)] px-2 pt-1 pb-1">
                                  <SellerChipIcon name={chip.icon} />
                                  <span className="block text-[12px] font-bold leading-[16.8px]">{chip.label}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment methods */}
                <div>
                  <div className="mb-3 leading-[normal]">Payment method</div>
                  <div>
                    {CK_PAYMENTS.map((pm) => (
                      <div
                        key={pm.name}
                        className={`mb-2 flex min-h-14 items-center rounded-lg border-[0.8px] bg-card px-6 pt-0 pb-0 ${
                          pm.checked ? "border-brand" : "border-cardborder"
                        }`}
                      >
                        <div className="flex">
                          <label className="grid w-full items-center gap-2" style={{ gridTemplateColumns: "20px 1fr" }}>
                            <input type="radio" name="payment" checked={!!pm.checked} readOnly className="block h-0 w-0 opacity-0" style={{ gridArea: "1 / 1 / 2 / 2" }} />
                            <div className="h-5 w-5 overflow-hidden align-middle" style={{ gridArea: "1 / 1 / 2 / 2" }}>
                              <img src={pm.radio} alt="" className="block size-full" />
                            </div>
                          </label>
                        </div>
                        <div className="grid w-full items-center" style={{ gridTemplateColumns: "fit-content(60%) 1fr", columnGap: "12px" }}>
                          <div className="min-w-[110px] pt-[5px] pb-[5px] text-[14px] leading-[normal]" style={{ gridArea: "1 / 1 / 2 / 2" }}>
                            <div className="flex flex-wrap items-center gap-2">{pm.name}</div>
                            {pm.sub && (
                              <div className={`text-[12px] leading-[16.8px] ${pm.subColor === "linkblue" ? "text-linkblue" : "text-graytext"}`}>
                                {pm.sub}
                              </div>
                            )}
                          </div>
                          <div className="grid auto-cols-[minmax(0px,auto)] grid-flow-col" style={{ gridArea: "1 / 2 / 2 / 3" }}>
                            <div className="relative flex justify-end" style={{ gridArea: "1 / 1 / 2 / 2" }}>
                              {pm.logos.map((logo) => (
                                <div key={logo.src} className={`flex h-7 shrink-0 overflow-hidden ${logo.last ? "" : "mr-[4px]"}`}>
                                  <img alt={logo.alt} src={logo.src} className="block h-7 w-[42px] object-cover align-middle" />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Safe payment banner */}
                <div className="mb-[100px] mt-12 flex h-[79px] items-center justify-center overflow-hidden max-lg:mb-16">
                  <img alt="Safe payment" src={CK_SAFE_PAYMENT} className="block h-[79px] max-w-full object-contain align-middle" />
                </div>
              </div>
              <div className="inline" />
            </div>
          </div>

          {/* RIGHT — order summary (40%) */}
          <div className="flex basis-full justify-start bg-page pt-10 lg:basis-[40%] lg:pt-[92px]">
            <div className="w-full max-w-[424px] px-4 pb-16 pt-0 lg:pl-14 lg:pr-4">
              <div className="px-[10px] pt-[18px] pb-[18px]">
                {/* Order summary */}
                <div className="mb-[14px] flex items-center justify-between border-b-[0.8px] border-cardborder pb-[14px]">
                  <div className="flex items-center leading-[normal]">Order summary</div>
                </div>
                <div className="mb-[14px] flex items-center justify-between">
                  <div className="flex items-center leading-[normal] text-graytext">Order price</div>
                  <div className="font-bold leading-[normal]">{CK_SUMMARY.orderPrice}</div>
                </div>
                <div className="mb-[14px] flex items-center justify-between">
                  <div className="flex items-center leading-[normal] text-graytext">
                    <span className="block">Payment fees</span>
                    <div className="ml-1">
                      <InfoIcon />
                    </div>
                  </div>
                  <div className="font-bold leading-[normal]">{CK_SUMMARY.paymentFees}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center leading-[normal] text-graytext">
                    <span className="block">Loyalty points</span>
                    <div className="ml-1">
                      <InfoIcon />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 font-bold leading-[normal]">
                    <span className="block">{CK_SUMMARY.loyaltyPoints}</span>
                    <div className="h-5 shrink-0 overflow-hidden">
                      <img alt="Loyalty coin" src={CK_SUMMARY.loyaltyCoin} className="block h-5 w-5 object-cover align-middle" />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-start gap-[10px] pt-2">
                  <div className="border-b-[0.8px] border-cardborder" />
                  <div className="text-[14px] leading-[19.6px] text-graytext underline" style={{ textDecoration: "underline" }}>
                    Have a discount code?
                  </div>
                </div>
                <div className="mb-[14px] mt-[14px] flex items-center justify-between border-t-[0.8px] border-cardborder pt-[14px] font-bold">
                  <div className="flex items-center leading-[normal]">Total:</div>
                  <div className="text-[24px] leading-[normal]">{CK_SUMMARY.total}</div>
                </div>

                {/* Pay button (Apple Pay wordmark = capture data URI) */}
                <div className="mx-auto flex h-14 max-w-[368px]">
                  <button
                    type="button"
                    aria-label="Pay with Apple Pay"
                    className="h-14 w-full min-w-[90px] rounded-sm bg-black bg-contain bg-center bg-no-repeat px-[52.8px] text-center"
                    style={{ backgroundImage: CK_PAY_BUTTON_BG }}
                  />
                </div>
                <div className="mt-3 text-[12px] leading-[16.8px]">
                  <span>By placing an order, you confirm that you have read and agree to our</span>&nbsp;
                  <span>
                    <a href="/terms-of-service" className="text-linkblue">Terms of Service</a> and{" "}
                    <a href="/privacy-policy" className="text-linkblue">Privacy Policy</a>.
                  </span>
                </div>

                {/* Trustpilot + guarantees */}
                <div className="pb-3 pt-3">
                  <a href="https://www.trustpilot.com/review/eldorado.gg" className="flex items-center justify-between gap-2 py-4 text-[14px] leading-[21px]">
                    <span className="block font-bold leading-[19.6px]">Excellent</span>
                    <TrustpilotStars variant="header" size={20} full={4} half={1} />
                    <TrustpilotLogo />
                  </a>
                  <ul>
                    {CK_GUARANTEES.map((g, i) => (
                      <li key={g.title} className={`flex gap-[10px] py-2 ${i === 0 ? "border-b-[0.8px] border-cardborder" : ""}`}>
                        <div>
                          <GuaranteeIcon />
                        </div>
                        <div>
                          <div className="text-[14px] font-bold leading-[19.6px]">{g.title}</div>
                          <div className="text-[14px] leading-[19.6px] text-graytext">{g.sub}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ChatBubble />
    </div>
  );
}
