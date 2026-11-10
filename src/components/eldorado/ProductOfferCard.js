"use client";

import { useState } from "react";
import { PRODUCT, PRODUCT_PAYMENTS, PRODUCT_WARRANTY_TOOLTIP } from "./data/productData";
import { ShieldIcon, BoltIcon, SupportIcon, TrustRow } from "./TrustRows";

/* Offer card (product .make capture + live @390/1920):
   Desktop (sidebar): blue "Full email access included" gradient banner,
   24px price, detail rows (Game Series / Original email / Warranty /
   Delivery time with ⓘ buttons), dark Buy now, TrustRows block.
   Mobile (live @390): the banner collapses to a compact light-blue chip,
   the price renders larger, the Game Series row is hidden (the game strip
   already names the game), and the card joins the white flow.
   The Warranty ⓘ opens a small tooltip with the live-scraped Covered /
   Not covered lists (the capture tooltip DOM is empty). Other ⓘ buttons
   have no tooltip content in any reference and stay decorative. */

function LinkIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M10.5 13.5a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1.4 1.4"
        stroke="#4783ff"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M13.5 10.5a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1.4-1.4"
        stroke="#4783ff"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function InfoIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 11v5.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="7.6" r="1.15" fill="currentColor" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m5 12.5 4.2 4.2L19 7" stroke="#2d5ead" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PaymentBadge({ src, alt }) {
  return (
    <span className="inline-flex h-5 items-center overflow-hidden rounded-[3px] bg-white align-middle">
      <img alt={alt} src={src} className="block h-5 w-auto" />
    </span>
  );
}

function WarrantyTooltip() {
  const [open, setOpen] = useState(false);
  const t = PRODUCT_WARRANTY_TOOLTIP;
  return (
    <span className="relative inline-flex">
      <button
        type="button"
        aria-label="Warranty information"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="text-graytext"
      >
        <InfoIcon />
      </button>
      {open && (
        <span
          role="tooltip"
          className="absolute left-1/2 top-[26px] z-20 w-max max-w-[300px] -translate-x-1/2 rounded-lg bg-[#323141] p-4 text-left text-[14px] leading-[19.6px] text-white shadow-[rgba(47,47,55,0.15)_0px_2px_4px_0px,rgba(47,47,55,0.1)_0px_24px_60px_0px]"
        >
          <span className="mb-1 block font-bold">Covered:</span>
          <ul className="mb-3 list-disc pl-4">
            {t.covered.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <span className="mb-1 block font-bold">Not covered:</span>
          <ul className="list-disc pl-4">
            {t.notCovered.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </span>
      )}
    </span>
  );
}

function DetailRow({ row }) {
  return (
    <div className="flex min-h-12 items-center justify-between border-b-[0.8px] border-cardborder px-4 py-[10px] lg:px-6">
      <div className="flex items-center gap-1 text-graytext">
        <span>{row.label}</span>
        {row.info && (row.label === "Warranty" ? <WarrantyTooltip /> : (
          <button type="button" aria-label={`${row.label} information`} className="text-graytext">
            <InfoIcon />
          </button>
        ))}
      </div>
      {row.instant ? (
        <div className="flex items-center gap-[6px]">
          <span className="text-[rgb(0,_228,_201)]">
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M13.5 3 6 13.5h4.5L10 21l7.5-10.5H13L13.5 3Z" fill="currentColor" />
            </svg>
          </span>
          <span className="font-bold">{row.value}</span>
        </div>
      ) : (
        <div>{row.value}</div>
      )}
    </div>
  );
}

function TrustRowsBlock({ trust }) {
  return (
    <div className="flex flex-col gap-3 px-4 pb-5 pt-4 lg:px-6 lg:pb-6">
      <TrustRow icon={<ShieldIcon />} label={trust?.guarantee || "Money-back guarantee"} note={trust?.guaranteeNote || "Protected by TradeShield"} />
      {trust ? null : (
        <TrustRow icon={<BoltIcon />} label="Fast checkout options">
          <PaymentBadge src={PRODUCT_PAYMENTS.applePay} alt="Apple Pay" />
          <PaymentBadge src={PRODUCT_PAYMENTS.googlePay} alt="Google Pay" />
          <PaymentBadge src={PRODUCT_PAYMENTS.paypal} alt="PayPal" />
        </TrustRow>
      )}
      <TrustRow icon={<SupportIcon />} label={trust?.support || "24/7 live support"} note={trust?.supportNote || "We're always here to help"} />
    </div>
  );
}

function WarrantyChoices() {
  const [plan, setPlan] = useState("5d");
  const [open, setOpen] = useState(false);
  const plans = [
    { id: "5d", title: "۵ روز", note: "رایگان" },
    { id: "3m", title: "۳ ماه", note: "تمدید" },
    { id: "6m", title: "۶ ماه", note: "تمدید" },
  ];
  return (
    <div className="px-4 py-4 lg:px-6">
      <p className="text-[14px] font-bold">تمدید ضمانت</p>
      <p className="mt-1 text-[13px] leading-[20px] text-graytext">اگر بن یا از دست دادن دسترسی پیش آمد، پول برمی‌گردد.</p>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {plans.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setPlan(item.id)}
            className={`rounded-lg border px-2 py-2 text-center text-[13px] ${plan === item.id ? "border-ink bg-page font-bold" : "border-cardborder"}`}
          >
            <span className="block">{item.title}</span>
            <span className="block text-graytext">{item.note}</span>
          </button>
        ))}
      </div>
      <button type="button" className="mt-3 text-[13px] font-bold text-linkblue underline" onClick={() => setOpen(true)}>
        چه چیزهایی پوشش دارد؟
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-lg bg-white p-5 text-[14px] leading-[22px]">
            <h2 className="text-[18px] font-bold">ضمانت چه چیزهایی را پوشش می‌دهد؟</h2>
            <ul className="mt-3 list-disc space-y-1 ps-5">
              <li>فروشنده اکانت را پس می‌گیرد.</li>
              <li>بن به‌خاطر انتقال مالکیت یا کار فروشنده.</li>
              <li>اکانت با آگهی یکی نیست.</li>
            </ul>
            <h3 className="mt-4 font-bold">چطور کار می‌کند</h3>
            <ul className="mt-2 list-disc space-y-1 ps-5">
              <li>پوشش رایگان ۵ روز است. تمدید ۳ یا ۶ ماهه را همین‌جا انتخاب می‌کنی.</li>
              <li>درخواست را ثبت می‌کنی و بررسی می‌شود.</li>
              <li>اگر تأیید شود، پول اکانت برمی‌گردد.</li>
            </ul>
            <button type="button" className="mt-4 rounded-lg bg-darkbtn px-4 py-2 font-bold text-white" onClick={() => setOpen(false)}>
              بستن
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function BuyNow({ href, label }) {
  const text = label || "Buy now";
  const className = "block w-full rounded-lg bg-darkbtn py-3 text-center text-[16px] font-bold leading-[24px] text-white";
  return (
    <div className="px-4 pb-1 lg:px-6 lg:pb-4">
      {href ? (
        <a href={href} aria-label={text} className={className}>
          {text}
        </a>
      ) : (
        <button type="button" aria-label={text} className={className}>
          {text}
        </button>
      )}
    </div>
  );
}

export default function ProductOfferCard({ offer }) {
  const price = offer?.price || PRODUCT.price;
  const details = offer?.details || PRODUCT.details;
  const banner = offer?.banner || "Full email access included";
  const buyHref = offer?.buyHref || "";
  const buyLabel = offer?.buyLabel || "Buy now";
  const trust = offer?.trust;
  const mobileRows = details.filter((row) => !row.mobileHidden);
  return (
    <>
      {/* mobile: chip + big price + rows + buy + trust, white flow (live @390) */}
      <div className="bg-white pb-4 lg:hidden">
        <div className="px-4 pt-1">
          <div className="flex w-fit items-center gap-[6px] rounded-full border-[0.8px] border-[rgba(71,131,255,0.4)] bg-[rgba(71,131,255,0.08)] px-3 py-1 text-[14px] leading-[19.6px]">
            <LinkIcon size={16} />
            <span className="font-bold">{banner}</span>
            <span className="text-graytext">
              <InfoIcon />
            </span>
          </div>
          <strong className="mt-3 block text-[28px] font-bold leading-[34px]">{price}</strong>
        </div>
        <div className="mt-3 border-t-[0.8px] border-cardborder">
          {mobileRows.map((row) => (
            <DetailRow key={row.label} row={row} />
          ))}
        </div>
        {offer?.showWarranty ? <WarrantyChoices /> : null}
        <div className="pb-4 pt-4">
          <BuyNow href={buyHref} label={buyLabel} />
        </div>
        <TrustRowsBlock trust={trust} />
      </div>

      {/* desktop: sidebar card (capture) */}
      <div className="hidden overflow-hidden rounded-lg bg-white shadow-[rgba(9,9,11,0.05)_0px_2px_4px_0px,rgba(9,9,11,0.02)_0px_12px_8px_0px] lg:block">
        <div
          className="flex items-center justify-center gap-[8px] rounded-t-lg p-2 outline-[0.8px] outline-[rgba(71,131,255,0.4)]/40"
          style={{ backgroundImage: "linear-gradient(rgba(71, 131, 255, 0.12), rgba(71, 131, 255, 0.082))" }}
        >
          <span className="text-focusblue">
            <LinkIcon />
          </span>
          <strong className="block font-bold">{banner}</strong>
          <span className="text-graytext">
            <InfoIcon />
          </span>
        </div>
        <div className="flex flex-col gap-[16px] border-b-[0.8px] border-cardborder px-6 pb-4 pt-6">
          <strong className="block text-[24px] font-bold leading-[28.8px]">{price}</strong>
        </div>
        {details.map((row) => (
          <DetailRow key={row.label} row={row} />
        ))}
        {offer?.showWarranty ? <WarrantyChoices /> : null}
        <div className="pb-4 pt-4">
          <BuyNow href={buyHref} label={buyLabel} />
        </div>
        <TrustRowsBlock trust={trust} />
      </div>
    </>
  );
}
