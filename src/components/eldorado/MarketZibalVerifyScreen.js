"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyMarketPayment } from "../../actions/market.actions";
import { onlyDigits } from "../../lib/fa-digits";
import LoadingSpinner from "./LoadingSpinner";

export default function MarketZibalVerifyScreen({ gateway = "zibal" }) {
  const router = useRouter();
  const params = useSearchParams();
  const started = useRef(false);
  const [message, setMessage] = useState("در حال تأیید پرداخت…");
  const [error, setError] = useState("");

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const trackId = onlyDigits(params.get("trackId") ?? params.get("reference") ?? "");
    const authority = String(params.get("authority") ?? "").trim();
    if (!trackId && !authority) {
      setError("بازگشت از درگاه ناقص است. از سفارش‌های خرید ادامه بده.");
      return;
    }
    void (async () => {
      const result = await verifyMarketPayment(gateway, { trackId, authority, reference: trackId || authority });
      if (!result.ok || !result.orderNo) {
        setError(result.message || "پرداخت تأیید نشد.");
        return;
      }
      const outcome = result.paid ? "success" : "failed";
      setMessage(result.paid ? "پرداخت تأیید شد. در حال رفتن به سفارش…" : "پرداخت تأیید نشد. در حال رفتن به سفارش…");
      router.replace(`/dashboard/orders/purchased/${encodeURIComponent(result.orderNo)}?payment=${outcome}`);
    })();
  }, [gateway, params, router]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      {error ? (
        <>
          <h1 className="text-[24px] font-bold">پرداخت تأیید نشد</h1>
          <p className="max-w-md text-[14px] leading-[22px] text-red-600">{error}</p>
          <a href="/dashboard/orders/purchased" className="text-[14px] font-bold text-linkblue">
            سفارش‌های خرید
          </a>
        </>
      ) : (
        <>
          <LoadingSpinner variant="page" />
          <p className="text-[14px] text-graytext">{message}</p>
          <a href="/dashboard/orders/purchased" className="text-[14px] font-bold text-linkblue">
            اگر منتقل نشدی، سفارش‌های خرید را باز کن
          </a>
        </>
      )}
    </div>
  );
}
